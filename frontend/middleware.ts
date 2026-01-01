import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Protect customer routes
    if (request.nextUrl.pathname.startsWith('/customer')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Redirect to home if logged in and trying to access login
    if (request.nextUrl.pathname.startsWith('/login') && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/customer/:path*', '/login'],
}
