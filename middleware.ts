import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/games(.*)',
]);

const isHostGameRoute = createRouteMatcher([
  '/game/[^/]+$', // Matches /game/{gameId} but not /game/{gameId}/play
]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);
  const isGamePlay = url.pathname.match(/^\/game\/[^\/]+\/play$/);

  if (isProtectedRoute(request) || (isHostGameRoute(request) && !isGamePlay)) {
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
