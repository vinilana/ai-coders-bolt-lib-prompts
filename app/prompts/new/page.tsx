"use client"

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromptForm from "@/components/prompt-form";
import { categoriesApi, toolsApi } from "@/lib/mock-data";
import { Category, Tool } from "@/lib/types";
import Link from "next/link";

export default function NewPromptPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  
  useEffect(() => {
    // Load categories and tools
    setCategories(categoriesApi.getAll());
    setTools(toolsApi.getAll());
  }, []);
  
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
        categories={categories}
        tools={tools}
      />
    </div>
  );
}