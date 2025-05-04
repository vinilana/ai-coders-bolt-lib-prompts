"use client"

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PromptCard from "@/components/prompt-card";
import PromptFilter from "@/components/prompt-filter";
import Pagination from "@/components/pagination";
import DeleteDialog from "@/components/delete-dialog";
import { FilterOptions, Prompt } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { usePrompts, useDeletePrompt } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useTools } from "@/hooks/use-tools";

export default function Home() {
  const { toast } = useToast();
  
  // State
  const [isAdmin] = useState(true); // For demonstration, we'll assume user is admin
  
  const [filters, setFilters] = useState<FilterOptions>({
    page: 1,
    pageSize: 6,
  });
  
  // Use React Query hooks
  const { data: promptsData, isLoading: isLoadingPrompts } = usePrompts(filters);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: tools, isLoading: isLoadingTools } = useTools();
  
  const deletePromptMutation = useDeletePrompt();
  
  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  
  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      deletePromptMutation.mutate(id);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o prompt.",
        variant: "destructive",
      });
    }
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (id: string) => {
    const prompt = promptsData?.items.find(p => p.id === id);
    if (prompt) {
      setPromptToDelete(prompt);
      setDeleteDialogOpen(true);
    }
  };
  
  // Handle filter change
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  }, []);
  
  // Handle page size change
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters(prev => ({
      ...prev,
      pageSize,
      page: 1, // Reset to first page when page size changes
    }));
  }, []);
  
  // Loading state
  if (isLoadingPrompts || isLoadingCategories || isLoadingTools) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Prompts</h1>
            <p className="text-muted-foreground mt-1">
              Explore e gerencie prompts para suas ferramentas de IA favoritas.
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
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Prompts</h1>
          <p className="text-muted-foreground mt-1">
            Explore e gerencie prompts para suas ferramentas de IA favoritas.
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/prompts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Prompt
            </Button>
          </Link>
        )}
      </div>
      
      <PromptFilter
        categories={categories || []}
        tools={tools || []}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
      
      {!promptsData || promptsData.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold">Nenhum prompt encontrado</h2>
            <p className="text-muted-foreground mt-2">
              {filters.categoryIds?.length || filters.toolIds?.length || filters.searchTerm
                ? "Tente ajustar os filtros para encontrar o que procura."
                : "Comece criando seu primeiro prompt."}
            </p>
            
            {isAdmin && (
              <Link href="/prompts/new" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Prompt
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promptsData.items.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isAdmin={isAdmin}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
          
          <Pagination
            currentPage={promptsData.currentPage}
            totalPages={promptsData.totalPages}
            totalItems={promptsData.totalItems}
            pageSize={promptsData.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
      
      {/* Delete confirmation dialog */}
      {promptToDelete && (
        <DeleteDialog
          title="Excluir Prompt"
          description={`Tem certeza que deseja excluir o prompt "${promptToDelete.title}"? Esta ação não pode ser desfeita.`}
          onConfirm={async () => handleDelete(promptToDelete.id)}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  );
}