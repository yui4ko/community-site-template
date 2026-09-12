import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isApiUpload = request.nextUrl.pathname.startsWith('/api/upload');
    const isLogin = request.nextUrl.pathname === '/admin/login';

    // If accessing admin routes or upload API
    if ((isAdminRoute || isApiUpload) && !isLogin) {
        // Check for NextAuth v5 session cookies
        // Note: Cookie name depends on protocol (http vs https)
        const sessionToken = request.cookies.get('authjs.session-token') ||
            request.cookies.get('__Secure-authjs.session-token') ||
            request.cookies.get('next-auth.session-token');

        // If no session, redirect to login or return 401
        if (!sessionToken) {
            if (isApiUpload) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Redirect logged-in users away from login page
    if (isLogin) {
        const sessionToken = request.cookies.get('authjs.session-token') ||
            request.cookies.get('__Secure-authjs.session-token') ||
            request.cookies.get('next-auth.session-token');

        if (sessionToken) {
            return NextResponse.redirect(new URL('/admin/events', request.url));
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/upload/:path*',
    ],
}
