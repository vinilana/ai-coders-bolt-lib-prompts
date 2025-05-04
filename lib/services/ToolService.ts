import { prisma } from './prisma';
import { Tool, PaginatedResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { formatPaginatedResponse, applyOrderBy } from '../prisma-utils';
import { formatTool } from '../formatters';

// Serviço para acesso a ferramentas
export const ToolService = {
  // Obter todas as ferramentas
  getAll: async (): Promise<Tool[]> => {
    const tools = await prisma.tool.findMany({
      orderBy: { name: 'asc' }
    });
    
    return tools.map(formatTool);
  },
  
  // Obter ferramentas com paginação e busca
  getAllPaginated: async (params: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
  } = {}): Promise<PaginatedResponse<Tool>> => {
    const { 
      page = 1, 
      pageSize = 10,
      searchTerm 
    } = params;

    // Construir condições de busca
    const where: any = {};
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    // Contar total de itens
    const totalItems = await prisma.tool.count({ where });

    // Buscar ferramentas com paginação
    const tools = await prisma.tool.findMany({
      where,
      orderBy: applyOrderBy('name', 'asc'),
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    // Formatar resultado
    return formatPaginatedResponse<any, Tool>(
      tools, 
      totalItems, 
      page, 
      pageSize, 
      formatTool
    );
  },
  
  // Obter ferramenta por ID
  getById: async (id: string): Promise<Tool | null> => {
    const tool = await prisma.tool.findUnique({
      where: { id }
    });
    
    if (!tool) return null;
    
    return formatTool(tool);
  },
  
  // Criar nova ferramenta
  create: async (data: Omit<Tool, 'id'>): Promise<Tool> => {
    const tool = await prisma.tool.create({
      data: {
        id: uuidv4(),
        name: data.name,
        description: data.description
      }
    });
    
    return formatTool(tool);
  },
  
  // Atualizar ferramenta existente
  update: async (id: string, data: Partial<Omit<Tool, 'id'>>): Promise<Tool | null> => {
    try {
      const tool = await prisma.tool.update({
        where: { id },
        data
      });
      
      return formatTool(tool);
    } catch (error) {
      return null; // Ferramenta não encontrada ou erro ao atualizar
    }
  },
  
  // Excluir ferramenta
  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.tool.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false; // Ferramenta não encontrada ou erro ao excluir
    }
  }
};