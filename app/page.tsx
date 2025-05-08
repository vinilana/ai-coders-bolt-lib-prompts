"use client"

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search
} from "lucide-react";
import PromptCard from "@/components/prompt-card";
import PromptFilter from "@/components/prompt-filter";
import Pagination from "@/components/pagination";
import DeleteDialog from "@/components/delete-dialog";
import { FilterOptions, Prompt } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { usePrompts, useDeletePrompt } from "@/hooks/use-prompts";
import { useCategories } from "@/hooks/use-categories";
import { useTools } from "@/hooks/use-tools";
import { useUserRole } from "@/hooks/use-user-role";
import { useRouter } from "next/navigation";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  
  // Get user role
  const { isAdmin, isAuthenticated } = useUserRole();
  
  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);
  
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
    const prompt = promptsData?.items.find((p: Prompt) => p.id === id);
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
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-primary/20 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-primary/20 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-primary/20 rounded"></div>
                <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Not authenticated view
  if (!isAuthenticated) {
    return null; // Just return null as middleware will redirect
  }
  
  return (
    <div className="space-y-10">
      {/* Main Content */}
      <section id="prompt-list" className="pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Prompts</h1>
            <p className="text-muted-foreground mt-1">Explore e gerencie sua coleção de prompts para IA.</p>
          </div>
          
          {isAdmin && (
            <Link href="/prompts/new" className="shrink-0">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Prompt
              </Button>
            </Link>
          )}
        </div>
        
        <PromptFilter 
          categories={categories || []} 
          tools={tools || []} 
          onFilterChange={handleFilterChange}
          categoryId={filters.categoryId}
          toolId={filters.toolId}
          searchQuery={filters.searchQuery}
        />
        
        {promptsData?.items && promptsData.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {promptsData.items.map((prompt: Prompt) => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt} 
                  isAdmin={isAdmin}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={filters.page || 1}
              totalPages={Math.ceil((promptsData.totalItems || 0) / (filters.pageSize || 6))}
              onPageChange={handlePageChange}
              pageSize={filters.pageSize || 6}
              onPageSizeChange={handlePageSizeChange}
              totalItems={promptsData.totalItems || 0}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 rounded-lg border border-dashed mt-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Nenhum prompt encontrado</h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              {filters.searchQuery || filters.categoryId || filters.toolId ? 
                'Tente ajustar seus filtros ou pesquisa para encontrar o que está procurando.' : 
                'Comece adicionando seu primeiro prompt à biblioteca.'}
            </p>
            
            {isAdmin && (
              <Link href="/prompts/new" className="mt-4">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Prompt
                </Button>
              </Link>
            )}
          </div>
        )}
      </section>
      
      {/* Delete Dialog */}
      <DeleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => promptToDelete && handleDelete(promptToDelete.id)}
        title="Excluir prompt"
        description={`Tem certeza que deseja excluir o prompt "${promptToDelete?.title}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
}