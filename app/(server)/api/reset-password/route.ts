import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 1. Find the user with this token and check if it's not expired
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('user_id, reset_token_expiry')
      .eq('reset_token', token)
      .single()

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // 2. Check if the token has expired
    const expiry = new Date(user.reset_token_expiry)
    if (expiry < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    // 3. Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Update the user's password and clear the reset token
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      })
      .eq('user_id', user.user_id)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    }, { status: 200 })

  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
