"use client"

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/components/category-form";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCategory } from "@/hooks/use-categories";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params?.id as string;
  
  // Use React Query hook
  const { data: category, isLoading, isError } = useCategory(id);
  
  // Handle error
  if (isError) {
    toast({
      title: "Erro",
      description: "Categoria não encontrada",
      variant: "destructive",
    });
    router.push("/categories");
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Categoria não encontrada</h2>
        <p className="text-muted-foreground mt-2">
          A categoria que você está tentando editar não existe ou foi excluída.
        </p>
        <Link href="/categories" className="mt-4 inline-block">
          <Button>Voltar para a lista</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/categories">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Editar Categoria</h1>
      </div>
      
      <CategoryForm 
        category={category}
        isEdit={true}
      />
    </div>
  );
}