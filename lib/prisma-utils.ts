import { Prisma } from '@prisma/client';
import { FilterOptions, PaginatedResponse } from './types';

/**
 * Utilitário para construir condições de filtragem para consultas Prisma
 */
export function buildPromptWhereClause(filters: FilterOptions): Prisma.PromptWhereInput {
  const where: Prisma.PromptWhereInput = {
    deletedAt: null, // Ignorar prompts excluídos
  };

  // Adicionar filtro por termo de busca
  if (filters.searchTerm) {
    where.OR = [
      { title: { contains: filters.searchTerm, mode: 'insensitive' } },
      { content: { contains: filters.searchTerm, mode: 'insensitive' } },
      { description: { contains: filters.searchTerm, mode: 'insensitive' } }
    ];
  }

  // Adicionar filtro por título específico
  if (filters.title) {
    where.title = { contains: filters.title, mode: 'insensitive' };
  }

  // Adicionar filtro por categorias
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    where.categories = {
      some: {
        categoryId: {
          in: filters.categoryIds
        }
      }
    };
  }

  // Adicionar filtro por ferramentas
  if (filters.toolIds && filters.toolIds.length > 0) {
    where.tools = {
      some: {
        toolId: {
          in: filters.toolIds
        }
      }
    };
  }

  return where;
}

/**
 * Utilitário para aplicar paginação a consultas Prisma
 */
export function applyPagination<T>(
  query: any,
  page: number = 1,
  pageSize: number = 5
): any {
  const skip = (page - 1) * pageSize;
  return query.skip(skip).take(pageSize);
}

/**
 * Formata o resultado de uma consulta paginada
 */
export function formatPaginatedResponse<T, R>(
  items: T[],
  totalItems: number,
  page: number = 1,
  pageSize: number = 5,
  formatFn?: (item: T) => R
): PaginatedResponse<R | T> {
  const formattedItems = formatFn ? items.map(formatFn) : items;
  
  return {
    items: formattedItems as any,
    totalItems,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize)
  };
}

/**
 * Aplica ordenação a uma consulta Prisma
 */
export function applyOrderBy<T extends string>(
  field: T, 
  direction: 'asc' | 'desc' = 'desc'
): { [key in T]: 'asc' | 'desc' } {
  return { [field]: direction } as { [key in T]: 'asc' | 'desc' };
} 