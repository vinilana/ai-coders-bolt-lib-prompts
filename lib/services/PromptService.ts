import { prisma } from './prisma';
import { Prompt, PaginatedResponse, FilterOptions } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Serviço para acesso a prompts
export const PromptService = {
  // Obter todos os prompts com paginação e filtros
  getAll: async (filters: FilterOptions = {}): Promise<PaginatedResponse<Prompt>> => {
    const {
      page = 1,
      pageSize = 5,
      categoryIds,
      toolIds,
      searchTerm
    } = filters;

    // Construir as condições de filtro
    const where: any = {
      deletedAt: null, // Ignorar prompts excluídos
    };

    // Adicionar filtro por termo de busca
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Adicionar filtro por categorias
    if (categoryIds && categoryIds.length > 0) {
      where.categories = {
        some: {
          categoryId: {
            in: categoryIds
          }
        }
      };
    }

    // Adicionar filtro por ferramentas
    if (toolIds && toolIds.length > 0) {
      where.tools = {
        some: {
          toolId: {
            in: toolIds
          }
        }
      };
    }

    // Contar o total de itens com os filtros aplicados
    const totalItems = await prisma.prompt.count({ where });
    
    // Buscar os prompts paginados
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

    // Transformar os resultados do Prisma para o formato da aplicação
    const formattedPrompts: Prompt[] = prompts.map(prompt => ({
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || undefined,
      authorId: prompt.authorId,
      createdAt: prompt.createdAt.toISOString(),
      updatedAt: prompt.updatedAt.toISOString(),
      deletedAt: prompt.deletedAt ? prompt.deletedAt.toISOString() : null,
      categories: prompt.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        description: pc.category.description || undefined
      })),
      tools: prompt.tools.map(pt => ({
        id: pt.tool.id,
        name: pt.tool.name,
        description: pt.tool.description || undefined
      }))
    }));

    // Retornar resposta paginada
    return {
      items: formattedPrompts,
      totalItems,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize)
    };
  },
  
  // Obter prompt por ID
  getById: async (id: string): Promise<Prompt | null> => {
    const prompt = await prisma.prompt.findUnique({
      where: { 
        id,
        deletedAt: null
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
      }
    });
    
    if (!prompt) return null;
    
    return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || undefined,
      authorId: prompt.authorId,
      createdAt: prompt.createdAt.toISOString(),
      updatedAt: prompt.updatedAt.toISOString(),
      deletedAt: prompt.deletedAt ? prompt.deletedAt.toISOString() : null,
      categories: prompt.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        description: pc.category.description || undefined
      })),
      tools: prompt.tools.map(pt => ({
        id: pt.tool.id,
        name: pt.tool.name,
        description: pt.tool.description || undefined
      }))
    };
  },
  
  // Criar novo prompt
  create: async (data: {
    title: string;
    content: string;
    description?: string;
    authorId: string;
    categoryIds: string[];
    toolIds: string[];
  }): Promise<Prompt> => {
    const promptId = uuidv4();
    
    const prompt = await prisma.prompt.create({
      data: {
        id: promptId,
        title: data.title,
        content: data.content,
        description: data.description,
        authorId: data.authorId,
        categories: {
          create: data.categoryIds.map(categoryId => ({
            categoryId
          }))
        },
        tools: {
          create: data.toolIds.map(toolId => ({
            toolId
          }))
        }
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
      }
    });
    
    return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || undefined,
      authorId: prompt.authorId,
      createdAt: prompt.createdAt.toISOString(),
      updatedAt: prompt.updatedAt.toISOString(),
      deletedAt: prompt.deletedAt ? prompt.deletedAt.toISOString() : null,
      categories: prompt.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        description: pc.category.description || undefined
      })),
      tools: prompt.tools.map(pt => ({
        id: pt.tool.id,
        name: pt.tool.name,
        description: pt.tool.description || undefined
      }))
    };
  },
  
  // Atualizar prompt existente
  update: async (id: string, data: {
    title?: string;
    content?: string;
    description?: string | null;
    categoryIds?: string[];
    toolIds?: string[];
  }): Promise<Prompt | null> => {
    try {
      // Verificar se o prompt existe
      const existingPrompt = await prisma.prompt.findUnique({
        where: { id, deletedAt: null }
      });
      
      if (!existingPrompt) return null;
      
      // Preparar dados básicos para atualização
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.description !== undefined) updateData.description = data.description;
      
      // Iniciar uma transação para atualizar prompt e relações
      const prompt = await prisma.$transaction(async (tx) => {
        // Atualizar dados básicos do prompt
        const updatedPrompt = await tx.prompt.update({
          where: { id },
          data: updateData
        });
        
        // Atualizar categorias se fornecidas
        if (data.categoryIds !== undefined) {
          // Remover todas as categorias existentes
          await tx.promptCategory.deleteMany({
            where: { promptId: id }
          });
          
          // Adicionar novas categorias
          if (data.categoryIds.length > 0) {
            await tx.promptCategory.createMany({
              data: data.categoryIds.map(categoryId => ({
                promptId: id,
                categoryId
              }))
            });
          }
        }
        
        // Atualizar ferramentas se fornecidas
        if (data.toolIds !== undefined) {
          // Remover todas as ferramentas existentes
          await tx.promptTool.deleteMany({
            where: { promptId: id }
          });
          
          // Adicionar novas ferramentas
          if (data.toolIds.length > 0) {
            await tx.promptTool.createMany({
              data: data.toolIds.map(toolId => ({
                promptId: id,
                toolId
              }))
            });
          }
        }
        
        // Buscar o prompt atualizado com todas as relações
        return await tx.prompt.findUnique({
          where: { id },
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
          }
        });
      });
      
      if (!prompt) return null;
      
      // Transformar o resultado no formato da aplicação
      return {
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        description: prompt.description || undefined,
        authorId: prompt.authorId,
        createdAt: prompt.createdAt.toISOString(),
        updatedAt: prompt.updatedAt.toISOString(),
        deletedAt: prompt.deletedAt ? prompt.deletedAt.toISOString() : null,
        categories: prompt.categories.map(pc => ({
          id: pc.category.id,
          name: pc.category.name,
          description: pc.category.description || undefined
        })),
        tools: prompt.tools.map(pt => ({
          id: pt.tool.id,
          name: pt.tool.name,
          description: pt.tool.description || undefined
        }))
      };
    } catch (error) {
      console.error('Erro ao atualizar prompt:', error);
      return null;
    }
  },
  
  // Exclusão lógica (soft delete) de prompt
  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.prompt.update({
        where: { id },
        data: {
          deletedAt: new Date()
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}; 