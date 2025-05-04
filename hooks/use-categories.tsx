import { Category } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// API endpoints
const API_URL = "/api/categories";

// Query keys for consistent caching
const CATEGORIES_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORIES_KEYS.all, 'list'] as const,
  list: () => [...CATEGORIES_KEYS.lists()] as const,
  details: () => [...CATEGORIES_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CATEGORIES_KEYS.details(), id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEYS.list(),
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORIES_KEYS.detail(id),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Category, 'id'>) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate categories lists to refresh data
      queryClient.invalidateQueries({queryKey: CATEGORIES_KEYS.lists()});
      toast({
        title: "Categoria criada",
        description: "A categoria foi criada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update category');
      return response.json();
    },
    onSuccess: (updatedCategory) => {
      // Update cache for this specific category
      queryClient.setQueryData(CATEGORIES_KEYS.detail(id), updatedCategory);
      // Invalidate lists that might contain this category
      queryClient.invalidateQueries({queryKey: CATEGORIES_KEYS.lists()});
      
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete category');
      return response.json();
    },
    onSuccess: (_, id) => {
      // Invalidate lists that might have contained this category
      queryClient.invalidateQueries({queryKey: CATEGORIES_KEYS.lists()});
      // Remove the category from detail cache
      queryClient.removeQueries({queryKey: CATEGORIES_KEYS.detail(id)});
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a categoria. Tente novamente.",
        variant: "destructive",
      });
    },
  });
} 