"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { title: "Prompts", href: "/" },
    { title: "Categorias", href: "/categories" },
    { title: "Ferramentas", href: "/tools" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center mr-6 text-xl font-bold"
          >
            Biblioteca de Prompts
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            className="md:hidden" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t py-4">
          <nav className="container flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                  pathname === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;