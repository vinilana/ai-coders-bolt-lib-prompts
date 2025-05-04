// Data Models
export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  categories: Category[];
  tools: Tool[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Tool {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

// For form data
export interface PromptFormData {
  title: string;
  content: string;
  description?: string;
  categoryIds: string[];
  toolIds: string[];
}

// For API requests
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// For pagination
export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// For filters
export interface FilterOptions {
  categoryIds?: string[];
  toolIds?: string[];
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}