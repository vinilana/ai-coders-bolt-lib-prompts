"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromptFormData, Category, Tool, Prompt } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { promptsApi } from "@/lib/mock-data";

// Validation schema
const promptSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres").max(100, "O título deve ter no máximo 100 caracteres"),
  content: z.string().min(10, "O texto do prompt deve ter no mínimo 10 caracteres"),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  toolIds: z.array(z.string()).min(1, "Selecione pelo menos uma ferramenta"),
});

interface PromptFormProps {
  categories: Category[];
  tools: Tool[];
  prompt?: Prompt; // For editing
  isEdit?: boolean;
}

export default function PromptForm({ categories, tools, prompt, isEdit = false }: PromptFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Initialize form state
  const [formData, setFormData] = useState<PromptFormData>({
    title: prompt?.title || "",
    content: prompt?.content || "",
    description: prompt?.description || "",
    categoryIds: prompt?.categories.map(c => c.id) || [],
    toolIds: prompt?.tools.map(t => t.id) || [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const validatedData = promptSchema.parse(formData);
      
      if (isEdit && prompt) {
        // Update existing prompt
        await promptsApi.update(prompt.id, {
          title: validatedData.title,
          content: validatedData.content,
          description: validatedData.description,
          categories: categories.filter(c => validatedData.categoryIds.includes(c.id)),
          tools: tools.filter(t => validatedData.toolIds.includes(t.id)),
        });
        
        toast({
          title: "Prompt atualizado",
          description: "O prompt foi atualizado com sucesso!",
          variant: "default",
        });
      } else {
        // Create new prompt
        await promptsApi.create({
          title: validatedData.title,
          content: validatedData.content,
          description: validatedData.description,
          authorId: "1", // Mock user ID
          categories: categories.filter(c => validatedData.categoryIds.includes(c.id)),
          tools: tools.filter(t => validatedData.toolIds.includes(t.id)),
        });
        
        toast({
          title: "Prompt criado",
          description: "O prompt foi criado com sucesso!",
          variant: "default",
        });
      }
      
      // Redirect to prompts list
      router.push("/");
      router.refresh();
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
          description: "Ocorreu um erro ao salvar o prompt.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
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
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => {
      const categoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      
      return { ...prev, categoryIds };
    });
    
    // Clear category error if we now have selections
    if (errors.categoryIds && formData.categoryIds.length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.categoryIds;
        return newErrors;
      });
    }
  };
  
  // Handle tool selection
  const handleToolChange = (toolId: string) => {
    setFormData(prev => {
      const toolIds = prev.toolIds.includes(toolId)
        ? prev.toolIds.filter(id => id !== toolId)
        : [...prev.toolIds, toolId];
      
      return { ...prev, toolIds };
    });
    
    // Clear tool error if we now have selections
    if (errors.toolIds && formData.toolIds.length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.toolIds;
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
          <CardTitle>{isEdit ? "Editar Prompt" : "Novo Prompt"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Atualize os detalhes do prompt conforme necessário." 
              : "Preencha os detalhes para criar um novo prompt."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Título do prompt"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">
              Texto do Prompt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Insira o texto do prompt aqui..."
              className={`min-h-32 ${errors.content ? "border-destructive" : ""}`}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Uma breve descrição sobre o prompt e como usá-lo"
              className="min-h-20"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>
                Categorias <span className="text-destructive">*</span>
              </Label>
              {errors.categoryIds && (
                <p className="text-xs text-destructive">{errors.categoryIds}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={formData.categoryIds.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>
                Ferramentas <span className="text-destructive">*</span>
              </Label>
              {errors.toolIds && (
                <p className="text-xs text-destructive">{errors.toolIds}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {tools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tool-${tool.id}`}
                      checked={formData.toolIds.includes(tool.id)}
                      onCheckedChange={() => handleToolChange(tool.id)}
                    />
                    <Label
                      htmlFor={`tool-${tool.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {tool.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
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
                ? "Atualizar Prompt" 
                : "Criar Prompt"
            }
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}