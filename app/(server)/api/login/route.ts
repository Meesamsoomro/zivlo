import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get user by email
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('user_id, email, password, is_subscribed, pitch_context, sender_name, created_at')
      .eq('email', email)
      .single()

    if (fetchError || !user) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
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
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    console.log('user', user);
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    console.log('userWithoutPassword', userWithoutPassword);
    // Return success response
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    }, { status: 200 })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}