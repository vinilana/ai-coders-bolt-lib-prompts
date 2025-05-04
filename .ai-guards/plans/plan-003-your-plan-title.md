---
id: plan-003
title: Implementação de Autenticação Clerk para NextJS
createdAt: 2025-05-04
author: vinilana
status: draft
---

## 🧩 Escopo

Implementar o Clerk como solução de autenticação para nossa aplicação NextJS. O Clerk irá gerenciar o cadastro de usuários, login, gerenciamento de sessão e perfil, permitindo que foquemos nas funcionalidades principais do app ao invés da infraestrutura de autenticação.

## ✅ Requisitos Funcionais

- Funcionalidade de cadastro e login de usuários
- Integração com login social (Google, GitHub)
- Rotas protegidas para usuários autenticados
- Controle de acesso baseado em papéis (usuário, admin)
- Gerenciamento de perfil do usuário
- Gerenciamento de sessão e tokens


## 📚 Diretrizes & Pacotes

- Siga as melhores práticas do Next.js para implementação de autenticação
- Pacotes a serem utilizados:
  - @clerk/nextjs (Licença MIT) use o context7 mcp para acessar a documentação mais recente

## 🔢 Plano de Execução


2. **Instalar e Configurar o SDK do Clerk**
   - Instale o pacote Clerk NextJS:
     ```bash
     npm install @clerk/nextjs
     ```
   - Adicione as variáveis de ambiente do Clerk no `.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
     NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
     NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
     ```

3. **Configurar Middleware para Proteção de Rotas**
   - Crie o arquivo `middleware.ts` na raiz do projeto:
     ```typescript
     import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
     import { NextResponse } from 'next/server';

     // Defina rotas protegidas
     const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
     const isAdminRoute = createRouteMatcher(['/admin(.*)']);

     export default clerkMiddleware((auth, request) => {
       // Protege rotas de admin para usuários com papel de admin
       if (isAdminRoute(request)) {
         auth().protect({ role: 'admin' });
       }

       // Protege rotas do dashboard para usuários autenticados
       if (isProtectedRoute(request)) {
         auth().protect();
       }

       return NextResponse.next();
     });

     export const config = {
       matcher: ['/((?!.*\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
     };
     ```

4. **Criar Páginas de Autenticação**
   - Crie a página de login (`app/sign-in/page.tsx`):
     ```tsx
     import { SignIn } from '@clerk/nextjs';

     export default function SignInPage() {
       return (
         <div className="flex justify-center items-center min-h-screen">
           <SignIn />
         </div>
       );
     }
     ```
   - Crie a página de cadastro (`app/sign-up/page.tsx`):
     ```tsx
     import { SignUp } from '@clerk/nextjs';

     export default function SignUpPage() {
       return (
         <div className="flex justify-center items-center min-h-screen">
           <SignUp />
         </div>
       );
     }
     ```

5. **Implementar ClerkProvider no Layout Raiz**
   - Atualize o layout raiz (`app/layout.tsx`):
     ```tsx
     import { ClerkProvider } from '@clerk/nextjs';
     import { Inter } from 'next/font/google';
     import './globals.css';

     const inter = Inter({ subsets: ['latin'] });

     export default function RootLayout({
       children,
     }: {
       children: React.ReactNode;
     }) {
       return (
         <ClerkProvider>
           <html lang="pt-br">
             <body className={inter.className}>{children}</body>
           </html>
         </ClerkProvider>
       );
     }
     ```

6. **Criar Componentes de Perfil de Usuário**
   - Crie o componente de botão de usuário (`components/user-button.tsx`):
     ```tsx
     'use client';
     
     import { UserButton } from '@clerk/nextjs';

     export default function UserProfileButton() {
       return <UserButton afterSignOutUrl="/" />;
     }
     ```
   - Crie a página de perfil do usuário (`app/profile/page.tsx`):
     ```tsx
     'use client';
     
     import { useUser } from '@clerk/nextjs';

     export default function ProfilePage() {
       const { isLoaded, user } = useUser();

       if (!isLoaded) {
         return <div>Carregando...</div>;
       }

       if (!user) {
         return <div>Não autenticado</div>;
       }

       return (
         <div className="max-w-4xl mx-auto py-8 px-4">
           <h1 className="text-2xl font-bold mb-4">Perfil</h1>
           <div className="bg-white shadow rounded-lg p-6">
             <div className="flex items-center space-x-4">
               <div>
                 <h2 className="text-xl font-medium">{user.firstName} {user.lastName}</h2>
                 <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
               </div>
             </div>
           </div>
         </div>
       );
     }
     ```

7. **Implementar Proteção de Rotas de API**
   - Crie rota de API protegida (`app/api/protected/route.ts`):
     ```typescript
     import { auth } from '@clerk/nextjs/server';
     import { NextResponse } from 'next/server';

     export async function GET() {
       const { userId } = await auth();
       
       if (!userId) {
         return new NextResponse(
           JSON.stringify({ error: 'Não autorizado' }),
           { status: 401 }
         );
       }
       
       return NextResponse.json({ message: 'Rota de API protegida', userId });
     }
     ```

8. **Configurar Controle de Acesso Baseado em Papéis**
   - Atualize os metadados do usuário com papéis via Dashboard do Clerk ou API
   - Crie função auxiliar para checagem de papéis (`utils/auth.ts`):
     ```typescript
     import { auth } from '@clerk/nextjs/server';

     export async function hasRole(role: string) {
       const { userId } = await auth();
       
       if (!userId) {
         return false;
       }
       
       // Verifica se o usuário possui o papel necessário nos metadados
       const { sessionClaims } = await auth();
       const roles = sessionClaims?.metadata?.roles as string[] || [];
       
       return roles.includes(role);
     }
     ```
