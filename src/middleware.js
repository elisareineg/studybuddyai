import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Define protected routes - update this list as needed
  const protectedPaths = ['/', '/dashboard', '/study'];
  
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(pp => 
    path === pp || path.startsWith(`${pp}/`)
  );

  if (!token && isProtectedPath) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  // If user is authenticated and trying to access login page, redirect to home
  if (token && path === '/auth/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};