import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Clean host (remove port if any for domain comparison)
  const hostname = host.split(':')[0].toLowerCase();

  // 1. If request is for apex domain (getstay.in), 301 redirect directly to https://www.getstay.in
  if (hostname === 'getstay.in') {
    const targetUrl = `https://www.getstay.in${pathname}${search}`;
    return NextResponse.redirect(targetUrl, 301);
  }

  // 2. If request is on www.getstay.in but protocol is insecure http in production
  if (hostname === 'www.getstay.in' && proto === 'http') {
    const targetUrl = `https://www.getstay.in${pathname}${search}`;
    return NextResponse.redirect(targetUrl, 301);
  }

  // 3. For canonical hostname (https://www.getstay.in/*), pass through directly with 0 redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except internal static assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
     * - banners, site.webmanifest
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon-.*\\.png|apple-touch-icon\\.png|safari-pinned-tab\\.svg|banners/|site\\.webmanifest).*)',
  ],
};
