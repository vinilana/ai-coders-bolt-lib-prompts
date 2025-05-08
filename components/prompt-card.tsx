"use client"

import { useState } from "react";
import Link from "next/link";
import { 
  Copy, 
  Edit, 
  MoreVertical, 
  Trash, 
  Check, 
  ExternalLink, 
  Star,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface PromptCardProps {
  prompt: Prompt;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

const PromptCard = ({ prompt, isAdmin, onDelete }: PromptCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Copy prompt to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    
    toast({
      title: "Copiado!",
      description: "O prompt foi copiado para a área de transferência.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card className="card-hover overflow-hidden border border-border/60 bg-card/60 backdrop-blur-sm relative">
      {/* Pill badge for top categories */}
      {prompt.categories && prompt.categories.length > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
            {prompt.categories[0].name}
          </Badge>
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Link 
            href={`/prompts/${prompt.id}`} 
            className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1 flex-1 group"
          >
            {prompt.featured && (
              <Sparkles className="h-4 w-4 inline-block mr-1.5 text-amber-400" />
            )}
            <span className="group-hover:underline decoration-primary/30 underline-offset-4">
              {prompt.title}
            </span>
          </Link>
          
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/prompts/${prompt.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(prompt.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="text-muted-foreground text-sm line-clamp-3 mb-3 min-h-[4.5rem]">
          {prompt.description}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {prompt.tools && prompt.tools.length > 0 && prompt.tools.map((tool) => (
            <Badge key={tool.id} variant="secondary" className="bg-secondary/50">
              {tool.name}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-border/30 mt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-amber-400 mr-1" />
          <span>{prompt.rating || 4.5}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-primary/30 hover:bg-primary/10"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            Copiar
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="h-8 glow-effect"
            asChild
          >
            <Link href={`/prompts/${prompt.id}`}>
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Abrir
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PromptCard;