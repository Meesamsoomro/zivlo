import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '@/app/(server)/utils'

// Use named export directly without any wrapper
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, pitchContext, senderName } = body

    // Validate input
    if (!email || !password || !pitchContext || !senderName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, pitch context, and sender name are required' },
        { status: 400 }
      )
    }
    // Validate sender name
    if (senderName.trim().length < 2 || senderName.trim().length > 50) {
      return NextResponse.json(
        { success: false, error: 'Sender name must be between 2 and 50 characters' },
        { status: 400 }
      )
    }
    // Validate pitch context
    if (pitchContext.length < 20 || pitchContext.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Pitch context must be between 20 and 150 characters' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user into database
    const { data: user, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          is_subscribed: false,
          pitch_context: pitchContext,
          sender_name: senderName.trim()
        },
      ])
      .select('user_id, email, is_subscribed, pitch_context, sender_name, created_at')
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      )
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        is_subscribed: user.is_subscribed,
        pitch_context: user.pitch_context,
        sender_name: user.sender_name
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    )

    // Send Welcome Email asynchronously
    const domain = process.env.NEXT_PUBLIC_APP_URL
    const loginLink = `${domain}/login`;
    const welcomeHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #f1f5f9; border-radius: 12px; background-color: #ffffff;">
        <h1 style="color: #0D1529; font-size: 28px; margin-bottom: 8px; font-family: Georgia, serif;">Zivlo</h1>
        <p style="color: #C8A84B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 24px;">Welcome Aboard</p>
        <h2 style="color: #0D1529; font-size: 20px; margin-bottom: 16px;">We're thrilled to have you!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          Zivlo is built to help UK businesses and agencies find high-quality independent business leads, uncover key decision-makers, and generate personalised outreach pitches instantly.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          You can now search businesses by niche and location, access real-time officer data, and stand out directly in your prospects' inboxes.
        </p>
        <a href="${loginLink}" style="display: inline-block; background-color: #0D1529; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Access Your Dashboard
        </a>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} Zivlo. Built for UK Businesses.
        </p>
      </div>
    `;

    sendEmail(
      email,
      'Welcome to Zivlo! Let\'s win more clients',
      `Welcome to Zivlo! Access your dashboard here: ${loginLink}`,
      welcomeHtml
    ).catch((err) => console.error('Failed to send welcome email:', err));

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        is_subscribed: user.is_subscribed,
        pitch_context: user.pitch_context,
        sender_name: user.sender_name,
        created_at: user.created_at,
      },
      token,
    }, { status: 201 })

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}