import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendEmail } from '@/app/(server)/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if user exists
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('user_id, email')
      .eq('email', email)
      .single()

    /**
     * SECURITY NOTE: 
     * We always return success even if the user is not found.
     * This prevents attackers from "enumerating" emails to see who has an account.
     */
    if (user) {
      // 1. Generate a secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // 2. Save it to the users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          reset_token: resetToken,
          reset_token_expiry: resetTokenExpiry.toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('Error saving reset token:', updateError);
        throw new Error('Failed to save reset token');
      }
      console.log('resetToken', resetToken);
      // 3. Send the email using the central utility
      const domain = process.env.NEXT_PUBLIC_APP_URL;
      const resetLink = `${domain}/reset-password?token=${resetToken}`;
      console.log('resetLink', resetLink);
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f1f5f9; border-radius: 12px; background-color: #ffffff;">
          <h1 style="color: #0D1529; font-size: 28px; margin-bottom: 24px; font-family: Georgia, serif;">Zivlo</h1>
          <h2 style="color: #0D1529; font-size: 20px; margin-bottom: 16px;">Reset your password</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            We received a request to reset your Zivlo password. Click the button below to choose a new one:
          </p>
          <a href="${resetLink}" style="display: inline-block; background-color: #0D1529; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-top: 32px;">
            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} Zivlo. Built for UK Businesses.
          </p>
        </div>
      `;

      await sendEmail(
        email,
        'Reset your password',
        `Reset your password here: ${resetLink}`,
        htmlContent
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent.'
    }, { status: 200 })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
