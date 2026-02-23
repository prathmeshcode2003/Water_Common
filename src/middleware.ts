/**
 * Next.js Middleware for i18n routing
 * Handles locale detection and URL-based language routing
 */


import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextResponse } from 'next/server';

// List of protected routes after login
const protectedRoutes = [
  '/:locale/water-tax/citizen',
  '/:locale/water-tax/citizen/dashboard',
  '/:locale/water-tax/citizen/passbook',
  '/:locale/water-tax/citizen/meter-reading',
  '/:locale/water-tax/citizen/new-grievance',
  '/:locale/water-tax/citizen/bill-calculator',
];

export async function middleware(request) {
  // i18n handling
  const intlResponse = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: false,
  })(request);

  // Session protection for protected routes
  const url = request.nextUrl;
  const path = url.pathname;
  const localeMatch = locales.find(l => path.startsWith(`/${l}/water-tax/citizen`));
  if (localeMatch) {
    // Only protect dashboard and post-login screens
    const protectedPaths = [
      `/` + localeMatch + `/water-tax/citizen/dashboard`,
      `/` + localeMatch + `/water-tax/citizen/passbook`,
      `/` + localeMatch + `/water-tax/citizen/meter-reading`,
      `/` + localeMatch + `/water-tax/citizen/new-grievance`,
      `/` + localeMatch + `/water-tax/citizen/bill-calculator`,
    ];
    if (protectedPaths.some(p => path.startsWith(p))) {
      const sessionId = request.cookies.get('wt_citizen_session_id')?.value;
      // If no session cookie, redirect to login
      if (!sessionId) {
        return NextResponse.redirect(new URL(`/${localeMatch}/water-tax/citizen?view=login`, request.url));
      }
      // Check if session is valid (in-memory check via API route)
      // This fetch will return 200 if session is valid, 401 if not
      try {
        const apiUrl = new URL(`/api/water-tax/session/validate`, request.url);
        apiUrl.searchParams.set('sid', sessionId);
        const resp = await fetch(apiUrl.toString(), { headers: { cookie: request.headers.get('cookie') || '' } });
        if (resp.status !== 200) {
          return NextResponse.redirect(new URL(`/${localeMatch}/water-tax/citizen?view=login`, request.url));
        }
      } catch {
        return NextResponse.redirect(new URL(`/${localeMatch}/water-tax/citizen?view=login`, request.url));
      }
    }
  }
  return intlResponse;
}


// No default export, use named middleware above

export const config = {
  // Match all paths except API routes, Next.js internals, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
