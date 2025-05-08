import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Defina rotas protegidas
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
 ]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Public route matcher
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/landing(.*)',  // Landing page is public
  '/api/(.*)'
]);

// Define authentication routes that shouldn't redirect to landing
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // Skip middleware for public routes and static assets
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

  // Protege rotas especificadas para usuários autenticados
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/landing', request.url));
    }
  }

  // Para outras rotas não especificadas explicitamente
  const { userId } = await auth();
  
  // If the URL is root ("/"), redirect unauthenticated users to landing page
  if (!userId && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/landing', request.url));
  }
  
  // For other routes, redirect to landing page if not authenticated (except auth routes)
  if (!userId && !isAuthRoute(request)) {
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  return NextResponse.next();
});

// Ajuste o matcher para excluir assets estáticos corretamente
export const config = {
  matcher: [
    // Exclude files with extensions like .jpg, .png, etc.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
    '/',
  ],
}; 