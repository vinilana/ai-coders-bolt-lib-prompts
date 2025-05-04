import { Category, Prompt, Tool } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Escrita Criativa', description: 'Prompts para escrita criativa e storytelling' },
  { id: '2', name: 'Redação Técnica', description: 'Prompts para documentação e conteúdo técnico' },
  { id: '3', name: 'Resumo', description: 'Prompts para resumir textos e conteúdos' },
  { id: '4', name: 'Brainstorming', description: 'Prompts para gerar ideias e sessões de brainstorming' },
  { id: '5', name: 'Análise', description: 'Prompts para análise de dados e informações' },
  { id: '6', name: 'Educacional', description: 'Prompts para fins educacionais e de aprendizado' },
];

// Mock Tools
export const mockTools: Tool[] = [
  { id: '1', name: 'ChatGPT', description: 'Modelo da OpenAI' },
  { id: '2', name: 'Claude', description: 'Assistente AI da Anthropic' },
  { id: '3', name: 'Gemini', description: 'Modelo de IA do Google' },
  { id: '4', name: 'Midjourney', description: 'Gerador de imagens AI' },
  { id: '5', name: 'DALL-E', description: 'Gerador de imagens da OpenAI' },
  { id: '6', name: 'Perplexity', description: 'Motor de busca baseado em IA' },
];

// Mock Prompts
export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Gerador de Histórias',
    content: 'Crie uma história curta sobre [tema] com [número] parágrafos que inclua os seguintes elementos: [elemento1], [elemento2], [elemento3].',
    description: 'Útil para gerar histórias curtas com elementos específicos.',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
    categories: [mockCategories[0], mockCategories[3]],
    tools: [mockTools[0], mockTools[1]],
  },
  {
    id: '2',
    title: 'Documentação API',
    content: 'Crie uma documentação para uma API REST que implementa [funcionalidade]. Inclua exemplos de endpoints, parâmetros, respostas e códigos de erro.',
    description: 'Para gerar documentação técnica de APIs REST.',
    createdAt: new Date(2023, 1, 10).toISOString(),
    updatedAt: new Date(2023, 1, 12).toISOString(),
    categories: [mockCategories[1]],
    tools: [mockTools[0], mockTools[2]],
  },
  {
    id: '3',
    title: 'Resumo de Artigo Científico',
    content: 'Leia o seguinte artigo científico e crie um resumo detalhado em 5 parágrafos, destacando a metodologia, resultados e conclusões principais:\n\n[texto do artigo]',
    description: 'Ideal para resumir artigos científicos longos.',
    createdAt: new Date(2023, 2, 5).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString(),
    categories: [mockCategories[2], mockCategories[4]],
    tools: [mockTools[0], mockTools[1], mockTools[2]],
  },
  {
    id: '4',
    title: 'Geração de Ideias de Produto',
    content: 'Gere 10 ideias inovadoras de produtos para o mercado de [setor] considerando as seguintes tendências: [tendência1], [tendência2], [tendência3].',
    description: 'Para sessões de brainstorming de produtos.',
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 3, 22).toISOString(),
    categories: [mockCategories[3]],
    tools: [mockTools[0], mockTools[2]],
  },
  {
    id: '5',
    title: 'Explicação de Conceito',
    content: 'Explique o conceito de [conceito] como se estivesse falando para um aluno do [nível educacional]. Inclua exemplos práticos e analogias.',
    description: 'Perfeito para criar explicações adaptadas a diferentes níveis educacionais.',
    createdAt: new Date(2023, 4, 8).toISOString(),
    updatedAt: new Date(2023, 4, 9).toISOString(),
    categories: [mockCategories[5]],
    tools: [mockTools[0], mockTools[1]],
  },
  {
    id: '6',
    title: 'Análise SWOT',
    content: 'Faça uma análise SWOT detalhada para [empresa/produto/serviço], considerando o mercado atual de [indústria/setor].',
    description: 'Para análises estratégicas de negócios.',
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 5, 16).toISOString(),
    categories: [mockCategories[4]],
    tools: [mockTools[0], mockTools[2]],
  },
  {
    id: '7',
    title: 'Descrição de Imagem para Midjourney',
    content: 'Descrição detalhada para o Midjourney: [tema], estilo [estilo artístico], [elementos visuais], [atmosfera/mood], [iluminação], [perspectiva], --ar 16:9 --q 2',
    description: 'Otimizado para gerar imagens no Midjourney.',
    createdAt: new Date(2023, 6, 1).toISOString(),
    updatedAt: new Date(2023, 6, 1).toISOString(),
    categories: [mockCategories[0], mockCategories[3]],
    tools: [mockTools[3]],
  },
  {
    id: '8',
    title: 'Plano de Aula',
    content: 'Crie um plano de aula detalhado sobre [tópico] para alunos do [nível educacional]. Inclua objetivos de aprendizagem, atividades, materiais necessários e métodos de avaliação.',
    description: 'Para professores prepararem aulas estruturadas.',
    createdAt: new Date(2023, 7, 12).toISOString(),
    updatedAt: new Date(2023, 7, 14).toISOString(),
    categories: [mockCategories[5]],
    tools: [mockTools[0], mockTools[2]],
  },
];

// Mock API handlers
let prompts = [...mockPrompts];
let categories = [...mockCategories];
let tools = [...mockTools];

// Helper to generate pagination
export const paginateItems = <T>(
  items: T[],
  page: number = 1,
  pageSize: number = 5
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    totalItems: items.length,
    currentPage: page,
    pageSize: pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
};

// Helper to filter prompts
export const filterPrompts = (
  allPrompts: Prompt[],
  filters: {
    categoryIds?: string[];
    toolIds?: string[];
    searchTerm?: string;
  }
) => {
  return allPrompts.filter(prompt => {
    // Skip deleted prompts
    if (prompt.deletedAt) return false;
    
    // Filter by categories if specified
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      const promptCategoryIds = prompt.categories.map(c => c.id);
      if (!filters.categoryIds.some(id => promptCategoryIds.includes(id))) {
        return false;
      }
    }
    
    // Filter by tools if specified
    if (filters.toolIds && filters.toolIds.length > 0) {
      const promptToolIds = prompt.tools.map(t => t.id);
      if (!filters.toolIds.some(id => promptToolIds.includes(id))) {
        return false;
      }
    }
    
    // Filter by search term if specified
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      return (
        prompt.title.toLowerCase().includes(searchTermLower) ||
        prompt.content.toLowerCase().includes(searchTermLower) ||
        (prompt.description && prompt.description.toLowerCase().includes(searchTermLower))
      );
    }
    
    return true;
  });
};

// Mock API for prompts
export const promptsApi = {
  getAll: (filters: {
    page?: number;
    pageSize?: number;
    categoryIds?: string[];
    toolIds?: string[];
    searchTerm?: string;
  } = {}) => {
    const filteredPrompts = filterPrompts(prompts, {
      categoryIds: filters.categoryIds,
      toolIds: filters.toolIds,
      searchTerm: filters.searchTerm,
    });
    
    return paginateItems(
      filteredPrompts,
      filters.page || 1,
      filters.pageSize || 5
    );
  },
  
  getById: (id: string) => {
    return prompts.find(p => p.id === id && !p.deletedAt);
  },
  
  create: (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    
    prompts.push(newPrompt);
    return newPrompt;
  },
  
  update: (id: string, promptData: Partial<Prompt>) => {
    const index = prompts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    prompts[index] = {
      ...prompts[index],
      ...promptData,
      updatedAt: new Date().toISOString(),
    };
    
    return prompts[index];
  },
  
  delete: (id: string) => {
    const index = prompts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    prompts[index] = {
      ...prompts[index],
      deletedAt: new Date().toISOString(),
    };
    
    return true;
  },
};

// Mock API for categories
export const categoriesApi = {
  getAll: () => {
    return categories;
  },
  
  getById: (id: string) => {
    return categories.find(c => c.id === id);
  },
  
  create: (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
    };
    
    categories.push(newCategory);
    return newCategory;
  },
  
  update: (id: string, categoryData: Partial<Category>) => {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
    };
    
    return categories[index];
  },
  
  delete: (id: string) => {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    // Remove category from array
    categories = categories.filter(c => c.id !== id);
    
    // Remove category from prompts
    prompts = prompts.map(prompt => ({
      ...prompt,
      categories: prompt.categories.filter(c => c.id !== id),
    }));
    
    return true;
  },
};

// Mock API for tools
export const toolsApi = {
  getAll: () => {
    return tools;
  },
  
  getById: (id: string) => {
    return tools.find(t => t.id === id);
  },
  
  create: (toolData: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...toolData,
      id: uuidv4(),
    };
    
    tools.push(newTool);
    return newTool;
  },
  
  update: (id: string, toolData: Partial<Tool>) => {
    const index = tools.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tools[index] = {
      ...tools[index],
      ...toolData,
    };
    
    return tools[index];
  },
  
  delete: (id: string) => {
    const index = tools.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    // Remove tool from array
    tools = tools.filter(t => t.id !== id);
    
    // Remove tool from prompts
    prompts = prompts.map(prompt => ({
      ...prompt,
      tools: prompt.tools.filter(t => t.id !== id),
    }));
    
    return true;
  },
};