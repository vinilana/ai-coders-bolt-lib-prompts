import { Prompt, Category, Tool } from './types';

/**
 * Formata um prompt do Prisma para o formato da aplicação
 */
export function formatPrompt(prompt: any): Prompt {
  return {
    id: prompt.id,
    title: prompt.title,
    content: prompt.content,
    description: prompt.description || undefined,
    authorId: prompt.authorId,
    createdAt: prompt.createdAt.toISOString(),
    updatedAt: prompt.updatedAt.toISOString(),
    deletedAt: prompt.deletedAt ? prompt.deletedAt.toISOString() : null,
    categories: prompt.categories?.map((pc: any) => formatCategory(pc.category)) || [],
    tools: prompt.tools?.map((pt: any) => formatTool(pt.tool)) || []
  };
}

/**
 * Formata uma categoria do Prisma para o formato da aplicação
 */
export function formatCategory(category: any): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description || undefined
  };
}

/**
 * Formata uma ferramenta do Prisma para o formato da aplicação
 */
export function formatTool(tool: any): Tool {
  return {
    id: tool.id,
    name: tool.name,
    description: tool.description || undefined
  };
} 