import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Define protected routes
const protectedRoutes = ['/appscreen', '/paywall', '/dashboard']
const authRoutes = ['/signup', '/login']
const publicRoutes = ['/']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value
  
  // For auth routes (signup/login), redirect to appscreen/paywall if already logged in
  if (authRoutes.includes(pathname)) {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        // Redirect based on subscription status
        if (decoded.is_subscribed === true) {
          const url = new URL('/appscreen', request.url)
          return NextResponse.redirect(url)
        } else {
          const url = new URL('/paywall', request.url)
          return NextResponse.redirect(url)
        }
      } catch (error) {
        // Token invalid, allow access to auth pages
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // If no token, redirect to signup
  if (!token) {
    const url = new URL('/signup', request.url)
    return NextResponse.redirect(url)
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // For appscreen, ensure user is subscribed
    if (pathname.startsWith('/appscreen') && decoded.is_subscribed !== true) {
      const url = new URL('/paywall', request.url)
      return NextResponse.redirect(url)
    }
    
    // For paywall, ensure user is NOT subscribed
    if (pathname.startsWith('/paywall') && decoded.is_subscribed === true) {
      const url = new URL('/appscreen', request.url)
      return NextResponse.redirect(url)
    }
    
    // For dashboard, any logged-in user can access (subscription not required)
    // No additional check needed for dashboard
    
    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to signup
    const url = new URL('/signup', request.url)
    const response = NextResponse.redirect(url)
    response.cookies.delete('auth_token')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}