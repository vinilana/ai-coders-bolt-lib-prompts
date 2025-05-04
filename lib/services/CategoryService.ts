import { prisma } from './prisma';
import { Category, PaginatedResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { formatPaginatedResponse, applyOrderBy } from '../prisma-utils';
import { formatCategory } from '../formatters';

// Serviço para acesso a categorias
export const CategoryService = {
  // Obter todas as categorias
  getAll: async (): Promise<Category[]> => {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    return categories.map(formatCategory);
  },

  // Obter categorias com paginação e busca
  getAllPaginated: async (params: {
    page?: number;
    pageSize?: number;
    searchTerm?: string;
  } = {}): Promise<PaginatedResponse<Category>> => {
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
    const totalItems = await prisma.category.count({ where });

    // Buscar categorias com paginação
    const categories = await prisma.category.findMany({
      where,
      orderBy: applyOrderBy('name', 'asc'),
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    // Formatar resultado
    return formatPaginatedResponse(
      categories, 
      totalItems, 
      page, 
      pageSize, 
      formatCategory
    );
  },
  
  // Obter categoria por ID
  getById: async (id: string): Promise<Category | null> => {
    const category = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!category) return null;
    
    return formatCategory(category);
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
    
    return formatCategory(category);
  },
  
  // Atualizar categoria existente
  update: async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> => {
    try {
      const category = await prisma.category.update({
        where: { id },
        data
      });
      
      return formatCategory(category);
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