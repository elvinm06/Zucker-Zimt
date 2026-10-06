import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SITE_LANG_COOKIE } from '@/lib/site-i18n';
import { toLocale } from '@/lib/locale';

/**
 * Picks the visitor's language from the switcher's cookie and rewrites the
 * request to the matching `/<lang>/…` route. The public URL stays the same;
 * the pages behind it are static, so they are served from the cache instead
 * of waiting for a server render (and for the backend) on every visit.
 */
export function middleware(request: NextRequest) {
  const lang = toLocale(request.cookies.get(SITE_LANG_COOKIE)?.value);
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${url.pathname === '/' ? '' : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except API routes, Next's own assets and files (icon.svg, …).
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
