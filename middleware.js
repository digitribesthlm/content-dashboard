// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token');

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/selected-topics')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Prevent authenticated users from accessing login page
  if (pathname === '/' && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/selected-topics',
  ],
};