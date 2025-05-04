import { prisma } from './prisma';
import { Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Serviço para acesso a categorias
export const CategoryService = {
  // Obter todas as categorias
  getAll: async (): Promise<Category[]> => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || undefined
    }));
  },
  
  // Obter categoria por ID
  getById: async (id: string): Promise<Category | null> => {
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) return null;
    
    return {
      id: category.id,
      name: category.name,
      description: category.description || undefined
    };
  },
  
  // Criar nova categoria
  create: async (data: Omit<Category, 'id'>): Promise<Category> => {
    const category = await prisma.category.create({
      data: {
        id: uuidv4(),
        name: data.name,
        description: data.description
      }
    });
    
    return {
      id: category.id,
      name: category.name,
      description: category.description || undefined
    };
  },
  
  // Atualizar categoria existente
  update: async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> => {
    try {
      const category = await prisma.category.update({
        where: { id },
        data
      });
      
      return {
        id: category.id,
        name: category.name,
        description: category.description || undefined
      };
    } catch (error) {
      return null; // Categoria não encontrada ou erro ao atualizar
    }
  },
  
  // Excluir categoria
  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.category.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false; // Categoria não encontrada ou erro ao excluir
    }
  }
}; 