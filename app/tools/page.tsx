"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteDialog from "@/components/delete-dialog";
import { toolsApi } from "@/lib/mock-data";
import { Tool } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function ToolsPage() {
  const { toast } = useToast();
  
  // State
  const [isAdmin] = useState(true); // For demonstration, we'll assume user is admin
  const [tools, setTools] = useState<Tool[]>([]);
  
  // Load tools
  useEffect(() => {
    loadTools();
  }, []);
  
  const loadTools = () => {
    setTools(toolsApi.getAll());
  };
  
  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const success = toolsApi.delete(id);
      
      if (success) {
        toast({
          title: "Ferramenta excluída",
          description: "A ferramenta foi excluída com sucesso.",
          variant: "default",
        });
        
        loadTools();
      } else {
        throw new Error("Falha ao excluir a ferramenta");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a ferramenta.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Ferramentas</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie ferramentas para associar aos prompts.
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/tools/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Ferramenta
            </Button>
          </Link>
        )}
      </div>
      
      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold">Nenhuma ferramenta encontrada</h2>
            <p className="text-muted-foreground mt-2">
              Comece criando sua primeira ferramenta para associar aos prompts.
            </p>
            
            {isAdmin && (
              <Link href="/tools/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Ferramenta
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {tool.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/tools/${tool.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteDialog
                        title="Excluir Ferramenta"
                        description={`Tem certeza que deseja excluir a ferramenta "${tool.name}"? Esta ação não pode ser desfeita e removerá a associação desta ferramenta com todos os prompts.`}
                        onConfirm={async () => handleDelete(tool.id)}
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}