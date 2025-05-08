"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import UserProfileButton from "@/components/user-button";
import { useUserRole } from "@/hooks/use-user-role";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useUserRole();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navigation links for authenticated users
  const authenticatedNavLinks = [
    { title: "Prompts", href: "/" },
    { title: "Categorias", href: "/categories" },
    { title: "Ferramentas", href: "/tools" },
  ];

  // Navigation links for non-authenticated users
  const nonAuthenticatedNavLinks = [
    { title: "Início", href: "/landing" },
    { title: "Entrar", href: "/sign-in" },
    { title: "Cadastre-se", href: "/sign-up" },
  ];

  // Use appropriate nav links based on authentication status
  const navLinks = isAuthenticated ? authenticatedNavLinks : nonAuthenticatedNavLinks;

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 border-border/50' 
          : 'bg-background/30 border-transparent'
      }`}
    >
      <div className="container max-w-7xl w-full mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link 
            href={isAuthenticated ? "/" : "/landing"} 
            className="flex items-center justify-center mr-4 text-xl font-bold tracking-tight hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                VIBE<span className="font-normal">Coders</span>
              </span>
            </span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative flex items-center group ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {link.title}
                <span className={`absolute bottom-[-18px] left-0 h-[2px] bg-primary rounded-full transition-all duration-300 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex items-center gap-2 border-primary/50 hover:bg-primary/10 glow-effect"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Novidades</span>
            </Button>
          )}
          
          {isAuthenticated ? (
            <UserProfileButton />
          ) : (
            <Link href="/sign-up">
              <Button 
                size="sm" 
                className="glow-effect"
              >
                Criar Conta
              </Button>
            </Link>
          )}
          
          <ModeToggle />
          <Button 
            variant="ghost"
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/50 py-4 animate-in slide-in-from-top bg-card/80 backdrop-blur-md w-full">
          <nav className="container max-w-7xl mx-auto flex flex-col space-y-3 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all hover:bg-primary/10 hover:text-primary flex items-center ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.title}
              </Link>
            ))}
            {isAuthenticated && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 flex items-center gap-2 border-primary/50 hover:bg-primary/10"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Novidades</span>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;