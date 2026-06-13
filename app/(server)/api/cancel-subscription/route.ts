import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    // Verify authentication
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    const supabase = getSupabaseClient()

    // Get the active payment for this user
    const { data: activePayment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', auth.userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError) {
      console.error('Fetch payment error:', fetchError)
      return createErrorResponse('No active subscription found', 404)
    }

    // Update payment: set is_active to false
    const { error: paymentUpdateError } = await supabase
      .from('payments')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', activePayment.id)

    if (paymentUpdateError) {
      console.error('Payment update error:', paymentUpdateError)
      return createErrorResponse('Failed to cancel subscription', 500)
    }

    // Update user: set is_subscribed to false
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        is_subscribed: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', auth.userId)

    if (userUpdateError) {
      console.error('User update error:', userUpdateError)
      return createErrorResponse('Failed to update user subscription status', 500)
    }

    // Get updated user data
    const { data: updatedUser } = await supabase
      .from('users')
      .select('user_id, email, is_subscribed, created_at, updated_at')
      .eq('user_id', auth.userId)
      .single()

    // Generate new JWT token
    const newToken = jwt.sign(
      { 
        id: auth.userId, 
        email: updatedUser?.email || auth.email,
        is_subscribed: false
      },
        process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return createSuccessResponse({
      message: 'Subscription cancelled successfully',
      user: updatedUser,
      token: newToken
    }, 200)

  } catch (error: any) {
    console.error('Cancel subscription error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}