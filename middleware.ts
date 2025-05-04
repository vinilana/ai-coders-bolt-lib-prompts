import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Defina rotas protegidas
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  // Add other protected routes here, but NOT auth routes
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Public route matcher
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/$',       // Home page
  '/api/(.*)'
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
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Para outras rotas não especificadas explicitamente
  const { userId } = await auth();
  if (!userId) {
    // Opcional: redirecionar para login para rotas não explicitamente marcadas como públicas
    return NextResponse.redirect(new URL('/sign-in', request.url));
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