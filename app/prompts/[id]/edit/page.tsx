"use client"

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromptForm from "@/components/prompt-form";
import { categoriesApi, toolsApi, promptsApi } from "@/lib/mock-data";
import { Category, Tool, Prompt } from "@/lib/types";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar categorias e ferramentas apenas uma vez na montagem do componente
  useEffect(() => {
    setCategories(categoriesApi.getAll());
    setTools(toolsApi.getAll());
  }, []);
  
  // Carregar o prompt quando o ID mudar
  useEffect(() => {
    const id = params?.id as string;
    if (id) {
      const promptData = promptsApi.getById(id);
      if (promptData) {
        setPrompt(promptData);
      } else {
        toast({
          title: "Erro",
          description: "Prompt não encontrado",
          variant: "destructive",
        });
        router.push("/");
      }
    }
    
    setIsLoading(false);
  }, [params?.id, router, toast]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!prompt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Prompt não encontrado</h2>
        <p className="text-muted-foreground mt-2">
          O prompt que você está tentando editar não existe ou foi excluído.
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button>Voltar para a lista</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Editar Prompt</h1>
      </div>
      
      <PromptForm 
        categories={categories}
        tools={tools}
        prompt={prompt}
        isEdit={true}
      />
    </div>
  );
}