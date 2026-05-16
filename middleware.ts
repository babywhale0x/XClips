import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect routes starting with /admin, but exclude /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminToken = request.cookies.get('admin_session')?.value;

    if (!adminToken || adminToken !== 'authenticated') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
