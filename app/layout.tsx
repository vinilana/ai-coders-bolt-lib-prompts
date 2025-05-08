"use client"

import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ClerkProvider } from '@clerk/nextjs';
import Head from 'next/head';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Biblioteca de Prompts para suas ferramentas de IA favoritas" />
        <meta name="theme-color" content="#0c111b" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryClientProvider client={queryClient}>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
                  {children}
                </main>
                <footer className="py-8 border-t border-border/40 bg-card/30 backdrop-blur-sm">
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-4">VIBECoders</h3>
                        <p className="text-muted-foreground">
                          Biblioteca de prompts para impulsionar sua produtividade com IA.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-4">Links Rápidos</h4>
                        <ul className="space-y-2">
                          <li><a href="/" className="text-muted-foreground hover:text-primary transition">Prompts</a></li>
                          <li><a href="/categories" className="text-muted-foreground hover:text-primary transition">Categorias</a></li>
                          <li><a href="/tools" className="text-muted-foreground hover:text-primary transition">Ferramentas</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-4">Suporte</h4>
                        <ul className="space-y-2">
                          <li><a href="#" className="text-muted-foreground hover:text-primary transition">FAQ</a></li>
                          <li><a href="#" className="text-muted-foreground hover:text-primary transition">Contato</a></li>
                          <li><a href="#" className="text-muted-foreground hover:text-primary transition">Política de Privacidade</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
                      © {new Date().getFullYear()} VIBECoders. Todos os direitos reservados.
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </QueryClientProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}