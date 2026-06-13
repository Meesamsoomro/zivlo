import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Verify authentication
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    const supabase = getSupabaseClient()

    // Get payment information for the logged-in user
    const { data: payment, error: fetchError } = await supabase
      .from('payments')
      .select(`
        id,
        user_id,
        sub_id,
        start_from,
        end_at,
        is_active,
        per_day,
        per_month,
        created_at,
        updated_at,
        subscriptions:sub_id (
          id,
          plan_type,
          plan_name,
          price
        )
      `)
      .eq('user_id', auth.userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return createSuccessResponse({
          payment: null,
          message: 'No active payment found for this user'
        }, 200)
      }

      console.error('Fetch payment error:', fetchError)
      return createErrorResponse('Failed to fetch payment information', 500)
    }

    return createSuccessResponse({ payment: payment }, 200)

  } catch (error: any) {
    console.error('Get payment error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}