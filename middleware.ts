// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    console.log("token: ",token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: check for admin role
    if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/not-authorized', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Apply only to specific routes
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};