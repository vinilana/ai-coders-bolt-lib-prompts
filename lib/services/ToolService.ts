import { prisma } from './prisma';
import { Tool } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Serviço para acesso a ferramentas
export const ToolService = {
  // Obter todas as ferramentas
  getAll: async (): Promise<Tool[]> => {
    const tools = await prisma.tool.findMany({
      orderBy: { name: 'asc' }
    });
    
    return tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description || undefined
    }));
  },
  
  // Obter ferramenta por ID
  getById: async (id: string): Promise<Tool | null> => {
    const tool = await prisma.tool.findUnique({
      where: { id }
    });
    
    if (!tool) return null;
    
    return {
      id: tool.id,
      name: tool.name,
      description: tool.description || undefined
    };
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
    
    return {
      id: tool.id,
      name: tool.name,
      description: tool.description || undefined
    };
  },
  
  // Atualizar ferramenta existente
  update: async (id: string, data: Partial<Omit<Tool, 'id'>>): Promise<Tool | null> => {
    try {
      const tool = await prisma.tool.update({
        where: { id },
        data
      });
      
      return {
        id: tool.id,
        name: tool.name,
        description: tool.description || undefined
      };
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