import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Defina rotas protegidas
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  // Add other protected routes here, but NOT auth routes
]);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)' // Assuming API routes have their own protection
]);

export default clerkMiddleware(async (auth, request) => {
  const path = new URL(request.url).pathname;
  
  // Skip protection for public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protege rotas de admin para usuários com papel de admin
  if (isAdminRoute(request)) {
    const { userId, sessionClaims } = await auth();
    if (!userId || sessionClaims?.role !== 'admin') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Protege rotas do dashboard para usuários autenticados
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 