import { Tool } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// API endpoints
const API_URL = "/api/tools";

// Query keys for consistent caching
const TOOLS_KEYS = {
  all: ['tools'] as const,
  lists: () => [...TOOLS_KEYS.all, 'list'] as const,
  list: () => [...TOOLS_KEYS.lists()] as const,
  details: () => [...TOOLS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TOOLS_KEYS.details(), id] as const,
};

export function useTools() {
  return useQuery({
    queryKey: TOOLS_KEYS.list(),
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tools');
      return response.json();
    },
  });
}

export function useTool(id: string) {
  return useQuery({
    queryKey: TOOLS_KEYS.detail(id),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch tool');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateTool() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<Tool, 'id'>) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create tool');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate tools lists to refresh data
      queryClient.invalidateQueries({queryKey: TOOLS_KEYS.lists()});
      toast({
        title: "Ferramenta criada",
        description: "A ferramenta foi criada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a ferramenta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTool(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Tool>) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update tool');
      return response.json();
    },
    onSuccess: (updatedTool) => {
      // Update cache for this specific tool
      queryClient.setQueryData(TOOLS_KEYS.detail(id), updatedTool);
      // Invalidate lists that might contain this tool
      queryClient.invalidateQueries({queryKey: TOOLS_KEYS.lists()});
      
      toast({
        title: "Ferramenta atualizada",
        description: "A ferramenta foi atualizada com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a ferramenta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete tool');
      return response.json();
    },
    onSuccess: (_, id) => {
      // Invalidate lists that might have contained this tool
      queryClient.invalidateQueries({queryKey: TOOLS_KEYS.lists()});
      // Remove the tool from detail cache
      queryClient.removeQueries({queryKey: TOOLS_KEYS.detail(id)});
      
      toast({
        title: "Ferramenta excluída",
        description: "A ferramenta foi excluída com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a ferramenta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
} 