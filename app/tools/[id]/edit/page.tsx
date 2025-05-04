"use client"

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolForm from "@/components/tool-form";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useTool } from "@/hooks/use-tools";

export default function EditToolPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params?.id as string;
  
  // Use React Query hook
  const { data: tool, isLoading, isError } = useTool(id);
  
  // Handle error
  if (isError) {
    toast({
      title: "Erro",
      description: "Ferramenta não encontrada",
      variant: "destructive",
    });
    router.push("/tools");
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!tool) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Ferramenta não encontrada</h2>
        <p className="text-muted-foreground mt-2">
          A ferramenta que você está tentando editar não existe ou foi excluída.
        </p>
        <Link href="/tools" className="mt-4 inline-block">
          <Button>Voltar para a lista</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Editar Ferramenta</h1>
      </div>
      
      <ToolForm 
        tool={tool}
        isEdit={true}
      />
    </div>
  );
}