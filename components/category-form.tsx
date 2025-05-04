"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";

// Validation schema
const categorySchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres").max(50, "O nome deve ter no máximo 50 caracteres"),
  description: z.string().optional(),
});

interface CategoryFormProps {
  category?: Category; // For editing
  isEdit?: boolean;
}

export default function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Initialize form state
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: category?.name || "",
    description: category?.description || "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Use React Query mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id || "");
  
  const isSubmitting = createCategory.isPending || updateCategory.isPending;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = categorySchema.parse(formData);
      
      if (isEdit && category) {
        // Update existing category
        updateCategory.mutate(validatedData, {
          onSuccess: () => {
            router.push("/categories");
            router.refresh();
          }
        });
      } else {
        // Create new category
        createCategory.mutate(validatedData, {
          onSuccess: () => {
            router.push("/categories");
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
          description: "Ocorreu um erro ao salvar a categoria.",
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
          <CardTitle>{isEdit ? "Editar Categoria" : "Nova Categoria"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Atualize os detalhes da categoria conforme necessário." 
              : "Preencha os detalhes para criar uma nova categoria."}
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
              placeholder="Nome da categoria"
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
              placeholder="Uma breve descrição sobre a categoria"
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
                ? "Atualizar Categoria" 
                : "Criar Categoria"
            }
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}