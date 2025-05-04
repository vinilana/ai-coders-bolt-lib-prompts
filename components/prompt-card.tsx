"use client"

import { useState } from "react";
import { Clock, Copy, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Prompt } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface PromptCardProps {
  prompt: Prompt;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function PromptCard({ prompt, isAdmin = true, onDelete }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    
    toast({
      title: "Copiado!",
      description: "O prompt foi copiado para a área de transferência.",
      duration: 3000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEdit = () => {
    router.push(`/prompts/${prompt.id}/edit`);
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(prompt.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: ptBR
    });
  };

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex justify-between">
          <span className="truncate">{prompt.title}</span>
        </CardTitle>
        <div className="flex gap-1 flex-wrap mt-2">
          {prompt.categories.map((category) => (
            <Badge key={category.id} variant="secondary" className="mr-1 mb-1">
              {category.name}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="mb-4">
          {prompt.description && (
            <p className="text-sm text-muted-foreground mb-3">{prompt.description}</p>
          )}
          <div className="relative rounded-md bg-muted p-3 font-mono text-sm">
            <pre className="max-h-52 overflow-y-auto whitespace-pre-wrap break-words">
              {prompt.content}
            </pre>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          {prompt.tools.map((tool) => (
            <Badge key={tool.id} variant="outline" className="mr-1 mb-1">
              {tool.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{formatDate(prompt.updatedAt)}</span>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copiar texto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {isAdmin && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}