import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sub_id, session_id } = body

    // Verify authentication
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    // Validate input
    if (!sub_id || !session_id) {
      return createErrorResponse('Subscription ID and Session ID are required', 400)
    }

    // Verify Stripe Session
    let paymentIntentId: string | null = null;
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== 'paid') {
        return createErrorResponse('Payment not completed', 400);
      }
      paymentIntentId = session.payment_intent as string;
    } catch (stripeErr: any) {
      console.error('Stripe session retrieval error:', stripeErr);
      return createErrorResponse('Invalid session ID', 400);
    }

    const supabase = getSupabaseClient()

    // Get subscription details
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', sub_id)
      .single()

    if (subError || !subscription) {
      console.error('Subscription error:', subError)
      return createErrorResponse('Subscription plan not found', 404)
    }

    // Calculate dates
    const startDate = new Date().toISOString()
    let endDate

    const duration = new Date()
    if (subscription.plan_type === 'monthly') {
      duration.setMonth(duration.getMonth() + 1)
      endDate = duration.toISOString()
    } else if (subscription.plan_type === 'yearly') {
      duration.setFullYear(duration.getFullYear() + 1)
      endDate = duration.toISOString()
    } else if (subscription.plan_type === 'lifetime') {
      duration.setFullYear(duration.getFullYear() + 100)
      endDate = duration.toISOString()
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: auth.userId,
        sub_id: sub_id,
        start_from: startDate,
        per_day: 5,
        per_month: 150,
        end_at: endDate,
        is_active: true
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Payment creation error:', paymentError)
      if (paymentIntentId) {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
        console.log(`Refunded payment intent ${paymentIntentId} due to payment creation error.`);
      }
      return createErrorResponse('Failed to create payment record. You have been refunded.', 500)
    }

    // Update user's subscription status
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        is_subscribed: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', auth.userId)
      .select('user_id, email, is_subscribed, pitch_context, created_at')
      .single()

    if (updateError) {
      console.error('User update error:', updateError)
      if (paymentIntentId) {
        await stripe.refunds.create({ payment_intent: paymentIntentId });
        console.log(`Refunded payment intent ${paymentIntentId} due to user update error.`);

        // Also clean up the payment record we just inserted
        if (payment) {
          await supabase.from('payments').delete().eq('id', payment.id);
        }
      }
      return createErrorResponse('Subscription activation failed. You have been refunded.', 500)
    }

    // Generate new JWT token
    const newToken = jwt.sign(
      {
        id: updatedUser.user_id,
        email: updatedUser.email,
        is_subscribed: true
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return createSuccessResponse({
      message: 'Payment successful! You are now subscribed.',
      payment: payment,
      user: updatedUser,
      token: newToken
    }, 201)

  } catch (error: any) {
    console.error('Payment error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}