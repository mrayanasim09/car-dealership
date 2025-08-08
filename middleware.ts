import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Get the token from the cookies
    const token = request.cookies.get('firebase-auth-token')?.value
    
    // If there's no token, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
}

