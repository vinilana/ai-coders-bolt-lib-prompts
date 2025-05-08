"use client"

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Search, 
  Lightbulb,
  Layers,
  Shield,
  Zap
} from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isAuthenticated } = useUserRole();
  const router = useRouter();
  
  // Redirect authenticated users to the main app
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 -mx-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-indigo-500/5 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-500/10 rounded-full blur-[80px] -z-10"></div>
        
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              <span>Potencialize sua experiência com AI</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
              Biblioteca de Prompts <br />para IA
            </h1>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              Explore e gerencie prompts para suas ferramentas de IA favoritas e acelere seu fluxo de trabalho com prompts otimizados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/sign-in">
                <Button 
                  size="lg" 
                  className="glow-effect group"
                >
                  <Search className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Entrar e Explorar
                </Button>
              </Link>
              
              <Link href="/sign-up">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/50 hover:bg-primary/10"
                >
                  Criar Conta
                </Button>
              </Link>
            </div>
            
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg">
                <div className="font-bold text-2xl text-primary">100+</div>
                <div className="text-muted-foreground text-sm">Prompts Disponíveis</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg">
                <div className="font-bold text-2xl text-primary">10+</div>
                <div className="text-muted-foreground text-sm">Categorias</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg">
                <div className="font-bold text-2xl text-primary">5+</div>
                <div className="text-muted-foreground text-sm">Ferramentas</div>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-lg">
                <div className="font-bold text-2xl text-primary">24/7</div>
                <div className="text-muted-foreground text-sm">Acesso Ilimitado</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nossa biblioteca de prompts foi projetada para acelerar seu fluxo de trabalho com IA e maximizar sua produtividade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prompts Otimizados</h3>
              <p className="text-muted-foreground">
                Prompts cuidadosamente elaborados para obter os melhores resultados das ferramentas de IA.
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organização por Categorias</h3>
              <p className="text-muted-foreground">
                Encontre facilmente o prompt que você precisa com nossa organização por categorias e ferramentas.
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conteúdo Verificado</h3>
              <p className="text-muted-foreground">
                Todos os prompts são verificados para garantir qualidade e eficácia antes de serem adicionados à biblioteca.
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg card-hover">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acesso Rápido</h3>
              <p className="text-muted-foreground">
                Copie e use prompts instantaneamente em suas ferramentas de IA favoritas com um único clique.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 