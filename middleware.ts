import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/games(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only protect dashboard and game creation API
  // Allow: /, /join/*, /game/*/play, /sign-in, /sign-up
  const isHostGameView = pathname.match(/^\/game\/[^\/]+$/) && !pathname.includes('/play');

  if (isProtectedRoute(request) || isHostGameView) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
