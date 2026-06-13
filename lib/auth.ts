import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

export interface AuthResult {
  success: boolean
  userId?: string
  email?: string
  error?: string
  status?: number
  response?: NextResponse
}

export function verifyAuth(request: Request): AuthResult {
  try {
    // Get token from Authorization header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return {
        success: false,
        error: 'Unauthorized',
        status: 401
      }
    }

    // Verify token and get user
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (!decoded || !decoded.id) {
      return {
        success: false,
        error: 'Invalid token',
        status: 401
      }
    }

    return {
      success: true,
      userId: decoded.id,
      email: decoded.email
    }
  } catch (error) {
    return {
      success: false,
      error: 'Invalid or expired token',
      status: 401
    }
  }
}

export function createErrorResponse(error: string, status: number = 500) {
  return NextResponse.json(
    { success: false, error },
    { status }
  )
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status }
  )
}

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}