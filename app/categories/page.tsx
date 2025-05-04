"use client"

import { useState } from "react";
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
import { Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";

export default function CategoriesPage() {
  const { toast } = useToast();
  
  // State
  const [isAdmin] = useState(true); // For demonstration, we'll assume user is admin
  
  // Use React Query hooks
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  
  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      deleteCategory.mutate(id);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Categorias</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie categorias para organizar os prompts.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie categorias para organizar os prompts.
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/categories/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </Link>
        )}
      </div>
      
      {!categories || categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold">Nenhuma categoria encontrada</h2>
            <p className="text-muted-foreground mt-2">
              Comece criando sua primeira categoria para organizar os prompts.
            </p>
            
            {isAdmin && (
              <Link href="/categories/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Categoria
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
              {categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/categories/${category.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteDialog
                        title="Excluir Categoria"
                        description={`Tem certeza que deseja excluir a categoria "${category.name}"? Esta ação não pode ser desfeita e removerá a associação desta categoria com todos os prompts.`}
                        onConfirm={async () => handleDelete(category.id)}
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