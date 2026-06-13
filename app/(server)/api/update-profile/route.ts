import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pitchContext, senderName } = body

    // Verify authentication
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Dynamic validation and update for pitchContext
    if (pitchContext !== undefined) {
      if (!pitchContext) {
        return createErrorResponse('Pitch context is required', 400)
      }
      if (pitchContext.length < 20 || pitchContext.length > 150) {
        return createErrorResponse('Pitch context must be between 20 and 150 characters', 400)
      }
      updateData.pitch_context = pitchContext
    }

    // Dynamic validation and update for senderName
    if (senderName !== undefined) {
      if (!senderName || senderName.trim().length === 0) {
        return createErrorResponse('Sender name is required', 400)
      }
      if (senderName.length < 2 || senderName.length > 50) {
        return createErrorResponse('Sender name must be between 2 and 50 characters', 400)
      }
      updateData.sender_name = senderName.trim()
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length <= 1) {
      return createErrorResponse('At least one field to update is required', 400)
    }

    const supabase = getSupabaseClient()

    // Update user's fields
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', auth.userId)
      .select('user_id, email, is_subscribed, pitch_context, sender_name, created_at')
      .single()

    if (updateError) {
      console.error('User update error:', updateError)
      return createErrorResponse('Failed to update profile', 500)
    }

    // Generate new JWT token with updated pitch_context and sender_name
    const newToken = jwt.sign(
      {
        id: updatedUser.user_id,
        email: updatedUser.email,
        is_subscribed: updatedUser.is_subscribed,
        pitch_context: updatedUser.pitch_context,
        sender_name: updatedUser.sender_name
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return createSuccessResponse({
      message: 'Profile updated successfully',
      user: updatedUser,
      token: newToken
    }, 200)

  } catch (error: any) {
    console.error('Update profile error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}
