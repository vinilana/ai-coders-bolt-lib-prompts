import { prisma } from './prisma';
import { Prompt, PaginatedResponse, Category, Tool } from '../types';
import { buildPromptWhereClause, formatPaginatedResponse } from '../prisma-utils';
import { formatPrompt, formatCategory, formatTool } from '../formatters';

/**
 * Serviço para consultas avançadas que relacionam múltiplas entidades
 */
export const AdvancedQueryService = {
  /**
   * Obtém estatísticas sobre o uso de categorias em prompts
   */
  getCategoryStats: async (): Promise<Array<{ category: Category, promptCount: number }>> => {
    // Buscar todas as categorias
    const categories = await prisma.category.findMany();
    
    // Para cada categoria, contar quantos prompts não deletados a utilizam
    const results = await Promise.all(
      categories.map(async (category) => {
        const promptCount = await prisma.promptCategory.count({
          where: {
            categoryId: category.id,
            prompt: {
              deletedAt: null
            }
          }
        });
        
        return {
          category: formatCategory(category),
          promptCount
        };
      })
    );
    
    // Ordenar pelo número de prompts (decrescente)
    return results.sort((a, b) => b.promptCount - a.promptCount);
  },
  
  /**
   * Obtém estatísticas sobre o uso de ferramentas em prompts
   */
  getToolStats: async (): Promise<Array<{ tool: Tool, promptCount: number }>> => {
    // Buscar todas as ferramentas
    const tools = await prisma.tool.findMany();
    
    // Para cada ferramenta, contar quantos prompts não deletados a utilizam
    const results = await Promise.all(
      tools.map(async (tool) => {
        const promptCount = await prisma.promptTool.count({
          where: {
            toolId: tool.id,
            prompt: {
              deletedAt: null
            }
          }
        });
        
        return {
          tool: formatTool(tool),
          promptCount
        };
      })
    );
    
    // Ordenar pelo número de prompts (decrescente)
    return results.sort((a, b) => b.promptCount - a.promptCount);
  },
  
  /**
   * Busca prompts relacionados a um prompt específico
   * (prompts que compartilham categorias ou ferramentas com o prompt de referência)
   */
  getRelatedPrompts: async (promptId: string, limit: number = 5): Promise<Prompt[]> => {
    // Buscar o prompt de referência com suas categorias e ferramentas
    const referencePrompt = await prisma.prompt.findUnique({
      where: { id: promptId, deletedAt: null },
      include: {
        categories: true,
        tools: true
      }
    });
    
    if (!referencePrompt) return [];
    
    // Extrair IDs de categorias e ferramentas
    const categoryIds = referencePrompt.categories.map(pc => pc.categoryId);
    const toolIds = referencePrompt.tools.map(pt => pt.toolId);
    
    // Buscar prompts relacionados que compartilham categorias ou ferramentas
    const relatedPrompts = await prisma.prompt.findMany({
      where: {
        id: { not: promptId }, // Excluir o próprio prompt
        deletedAt: null,
        OR: [
          {
            categories: {
              some: {
                categoryId: { in: categoryIds }
              }
            }
          },
          {
            tools: {
              some: {
                toolId: { in: toolIds }
              }
            }
          }
        ]
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tools: {
          include: {
            tool: true
          }
        }
      },
      take: limit
    });
    
    // Formatar os resultados
    return relatedPrompts.map(formatPrompt);
  },
  
  /**
   * Busca prompts por autor
   */
  getPromptsByAuthor: async (
    authorId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Prompt>> => {
    // Criar filtro básico por autor
    const where = {
      authorId,
      deletedAt: null
    };
    
    // Contar total de prompts do autor
    const totalItems = await prisma.prompt.count({ where });
    
    // Buscar prompts do autor com paginação
    const prompts = await prisma.prompt.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tools: {
          include: {
            tool: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
    
    // Formatar e retornar resultado paginado
    return formatPaginatedResponse(
      prompts, 
      totalItems,
      page,
      pageSize,
      formatPrompt
    );
  },
  
  /**
   * Realiza uma busca avançada em todas as entidades simultaneamente
   */
  searchAll: async (searchTerm: string): Promise<{
    prompts: Prompt[];
    categories: Category[];
    tools: Tool[];
  }> => {
    // Buscar prompts que correspondam ao termo de busca
    const prompts = await prisma.prompt.findMany({
      where: {
        deletedAt: null,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        categories: {
          include: {
            category: true
          }
        },
        tools: {
          include: {
            tool: true
          }
        }
      },
      take: 5 // Limitar a 5 resultados para prompts
    });
    
    // Buscar categorias que correspondam ao termo de busca
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      take: 5 // Limitar a 5 resultados para categorias
    });
    
    // Buscar ferramentas que correspondam ao termo de busca
    const tools = await prisma.tool.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      take: 5 // Limitar a 5 resultados para ferramentas
    });
    
    // Formatar os resultados
    return {
      prompts: prompts.map(formatPrompt),
      categories: categories.map(formatCategory),
      tools: tools.map(formatTool)
    };
  }
}; 