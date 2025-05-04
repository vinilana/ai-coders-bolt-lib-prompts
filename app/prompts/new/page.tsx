"use client"

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromptForm from "@/components/prompt-form";
import Link from "next/link";
import { useCategories } from "@/hooks/use-categories";
import { useTools } from "@/hooks/use-tools";

export default function NewPromptPage() {
  // Use React Query hooks
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: tools, isLoading: isLoadingTools } = useTools();
  
  const isLoading = isLoadingCategories || isLoadingTools;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        <h1 className="text-2xl font-bold ml-4">Criar Novo Prompt</h1>
      </div>
      
      <PromptForm 
        categories={categories || []}
        tools={tools || []}
      />
    </div>
  );
}