import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { business_type, location, leads, payment_id, pitch } = body

    // Verify authentication
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    // Validate input
    if (!business_type || !location) {
      return createErrorResponse('Business type and location are required', 400)
    }

    const supabase = getSupabaseClient()

    // Insert search record
    const { data: search, error: insertError } = await supabase
      .from('searches')
      .insert({
        user_id: auth.userId,
        business_type: business_type,
        location: location,
        leads: leads || 0,
        pitch: pitch || null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Search creation error:', insertError)
      return createErrorResponse('Failed to save search', 500)
    }

    // Decrement per_day in payments table
    try {
      let targetPaymentId = payment_id;
      if (!targetPaymentId) {
        // Auto-detect the user's active payment record if payment_id isn't explicitly passed
        const { data: activePay } = await supabase
          .from('payments')
          .select('id')
          .eq('user_id', auth.userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (activePay) {
          targetPaymentId = activePay.id;
        }
      }

      if (targetPaymentId) {
        const { data: payment } = await supabase
          .from('payments')
          .select('per_day, per_month')
          .eq('id', targetPaymentId)
          .single();

        if (payment && typeof payment.per_day === 'number' && payment.per_day > 0) {
          const updates: any = {
            per_day: payment.per_day - 1
          };
          
          if (typeof payment.per_month === 'number') {
            updates.per_month = Math.max(0, payment.per_month - (leads || 0));
          }

          await supabase
            .from('payments')
            .update(updates)
            .eq('id', targetPaymentId);
        }
      }
    } catch (payErr) {
      console.error('Failed to decrement payment per_day:', payErr);
      // Non-blocking catch to ensure search creation still returns success
    }

    return createSuccessResponse({
      message: 'Search saved successfully',
      search: search
    }, 201)

  } catch (error: any) {
    console.error('Create search error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}