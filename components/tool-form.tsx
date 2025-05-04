"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tool } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useCreateTool, useUpdateTool } from "@/hooks/use-tools";

// Validation schema
const toolSchema = z.object({
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres").max(50, "O nome deve ter no máximo 50 caracteres"),
  description: z.string().optional(),
});

interface ToolFormProps {
  tool?: Tool; // For editing
  isEdit?: boolean;
}

export default function ToolForm({ tool, isEdit = false }: ToolFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Initialize form state
  const [formData, setFormData] = useState<Omit<Tool, 'id'>>({
    name: tool?.name || "",
    description: tool?.description || "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Use React Query mutations
  const createTool = useCreateTool();
  const updateTool = useUpdateTool(tool?.id || "");
  
  const isSubmitting = createTool.isPending || updateTool.isPending;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = toolSchema.parse(formData);
      
      if (isEdit && tool) {
        // Update existing tool
        updateTool.mutate(validatedData, {
          onSuccess: () => {
            router.push("/tools");
            router.refresh();
          }
        });
      } else {
        // Create new tool
        createTool.mutate(validatedData, {
          onSuccess: () => {
            router.push("/tools");
            router.refresh();
          }
        });
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Erro de validação",
          description: "Verifique os campos do formulário.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao salvar a ferramenta.",
          variant: "destructive",
        });
      }
    }
  };
  
  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Editar Ferramenta" : "Nova Ferramenta"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Atualize os detalhes da ferramenta conforme necessário." 
              : "Preencha os detalhes para criar uma nova ferramenta."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nome da ferramenta"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Uma breve descrição sobre a ferramenta"
              className="min-h-20"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? "Salvando..." 
              : isEdit 
                ? "Atualizar Ferramenta" 
                : "Criar Ferramenta"
            }
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}