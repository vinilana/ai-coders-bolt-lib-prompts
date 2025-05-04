import { Prompt, FilterOptions, PaginatedResponse, PromptFormData } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// API endpoints
const API_URL = "/api/prompts";

// Query keys for consistent caching
const PROMPTS_KEYS = {
  all: ['prompts'] as const,
  lists: () => [...PROMPTS_KEYS.all, 'list'] as const,
  list: (filters: FilterOptions) => [...PROMPTS_KEYS.lists(), filters] as const,
  details: () => [...PROMPTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROMPTS_KEYS.details(), id] as const,
};

export function usePrompts(filters: FilterOptions = {}) {
  const { toast } = useToast();
  
  const query = useQuery({
    queryKey: PROMPTS_KEYS.list(filters),
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
      
      const url = `${API_URL}?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch prompts');
      return response.json();
    },
  });

  return {
    ...query,
    prompts: query.data as PaginatedResponse<Prompt> | undefined,
  };
}

export function usePrompt(id: string) {
  return useQuery({
    queryKey: PROMPTS_KEYS.detail(id),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch prompt');
      return response.json();
    },
    enabled: !!id,
  });
}

// Use PromptFormData directly without adding authorId
export function useCreatePrompt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: PromptFormData) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create prompt');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate prompts lists to refresh data
      queryClient.invalidateQueries({queryKey: PROMPTS_KEYS.lists()});
      toast({
        title: "Prompt criado",
        description: "O prompt foi criado com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o prompt. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePrompt(id: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<PromptFormData>) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update prompt');
      return response.json();
    },
    onSuccess: (updatedPrompt) => {
      // Update cache for this specific prompt
      queryClient.setQueryData(PROMPTS_KEYS.detail(id), updatedPrompt);
      // Invalidate lists that might contain this prompt
      queryClient.invalidateQueries({queryKey: PROMPTS_KEYS.lists()});
      
      toast({
        title: "Prompt atualizado",
        description: "O prompt foi atualizado com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o prompt. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete prompt');
      return response.json();
    },
    onSuccess: (_, id) => {
      // Invalidate lists that might have contained this prompt
      queryClient.invalidateQueries({queryKey: PROMPTS_KEYS.lists()});
      // Remove the prompt from detail cache
      queryClient.removeQueries({queryKey: PROMPTS_KEYS.detail(id)});
      
      toast({
        title: "Prompt excluído",
        description: "O prompt foi excluído com sucesso.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o prompt. Tente novamente.",
        variant: "destructive",
      });
    },
  });
} 