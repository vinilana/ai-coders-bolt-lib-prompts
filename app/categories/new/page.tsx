"use client"

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/components/category-form";
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Criar Nova Categoria</h1>
      </div>
      
      <CategoryForm />
    </div>
  );
}