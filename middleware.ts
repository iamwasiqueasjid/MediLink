import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login' || path === '/register';

  // Protected paths
  const isProtectedPath = path.startsWith('/patient') || path.startsWith('/doctor');

  // If trying to access protected path without token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login/register, redirect to appropriate dashboard
  if (token && (path === '/login' || path === '/register')) {
    // Verify token and get role to redirect appropriately
    try {
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        headers: {
          Cookie: `auth-token=${token.value}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const redirectPath = data.user.role === 'doctor' ? '/doctor' : '/patient';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    } catch (error) {
      // If verification fails, let them through to login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
