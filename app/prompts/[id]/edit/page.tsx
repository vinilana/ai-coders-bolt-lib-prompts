"use client"

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromptForm from "@/components/prompt-form";
import { Category, Tool, Prompt } from "@/lib/types";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { usePrompt } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useTools } from "@/hooks/use-tools";

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params?.id as string;
  
  // Use React Query hooks
  const { data: prompt, isLoading: isLoadingPrompt, isError } = usePrompt(id);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: tools, isLoading: isLoadingTools } = useTools();
  
  const isLoading = isLoadingPrompt || isLoadingCategories || isLoadingTools;
  
  // Handle error
  if (isError) {
    toast({
      title: "Erro",
      description: "Prompt não encontrado",
      variant: "destructive",
    });
    router.push("/");
  }
  
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
        categories={categories || []}
        tools={tools || []}
        prompt={prompt}
        isEdit={true}
      />
    </div>
  );
}