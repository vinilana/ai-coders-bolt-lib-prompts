---
id: plan-002
title: Migração para Banco de Dados Real
createdAt: 2025-05-04
author: vinilana
status: draft
---

## 🧩 Scope

Migrar a aplicação da biblioteca de prompts de IA do uso de dados mock em memória para um banco de dados real. Essa migração manterá todas as funcionalidades existentes enquanto substitui as funções de mockAPI por serviços que se conectam e interagem com um banco de dados persistente.

## ✅ Functional Requirements

- Implementar CRUD completo para todas as entidades (Prompts, Categories, Tools)
- Manter todas as funcionalidades de filtragem e paginação existentes
- Garantir que as relações many-to-many (Prompts-Categories, Prompts-Tools) sejam preservadas
- Implementar soft delete para Prompts (uso do campo deletedAt)
- Preservar a funcionalidade de busca por termo nos campos title, content e description

## 📚 Guidelines & Packages

- Packages:
  - Prisma ORM (MIT License) - Para interações com o banco de dados
  - uuid (MIT License) - Para geração de IDs únicos
  - @tanstack/react-query (MIT License) - Para gerenciamento de cache, estado de carregamento e sincronização de dados assíncronos no frontend ([docs](https://tanstack.com/query/latest))

## 🔢 Execution Plan

3. Implementar serviços de acesso ao banco de dados para substituir as APIs mock
   - CategoryService (getAll, getById, create, update, delete)
   - ToolService (getAll, getById, create, update, delete)
   - PromptService (getAll, getById, create, update, delete)
4. Implementar funções de paginação e filtragem usando consultas SQL/Prisma
5. Refatorar páginas/componentes da aplicação para usar os novos serviços
   - **Páginas que precisam de refatoração:**
     - `app/page.tsx`: Página principal/Home - exibe lista de prompts
     - `app/prompts/new/page.tsx`: Criação de novo prompt
     - `app/prompts/[id]/page.tsx`: Página de detalhes/edição de prompt
     - `app/categories/page.tsx`: Gerenciamento de categorias
     - `app/categories/new/page.tsx`: Criação de nova categoria
     - `app/categories/[id]/page.tsx`: Página de detalhes/edição de categoria
     - `app/tools/page.tsx`: Gerenciamento de ferramentas
     - `app/tools/new/page.tsx`: Criação de nova ferramenta
     - `app/tools/[id]/page.tsx`: Página de detalhes/edição de ferramenta
   - **Componentes que precisam de revisão:**
     - `components/prompt-card.tsx`: Exibição de card de prompt
     - `components/prompt-filter.tsx`: Filtragem de prompts
     - `components/prompt-form.tsx`: Formulário de criação/edição de prompt
     - `components/category-form.tsx`: Formulário de criação/edição de categoria
     - `components/tool-form.tsx`: Formulário de criação/edição de ferramenta
     - `components/pagination.tsx`: Componente de paginação
     - `components/delete-dialog.tsx`: Modal de confirmação de exclusão
   - **Implementação de TanStack Query:**
     - Criar pasta `hooks/` com hooks personalizados para cada entidade:
       - `hooks/use-prompts.tsx`: Hooks para operações CRUD e queries de prompts
       - `hooks/use-categories.tsx`: Hooks para operações CRUD e queries de categorias
       - `hooks/use-tools.tsx`: Hooks para operações CRUD e queries de ferramentas
     - Implementar em cada hook:
       - `useQuery` para buscar dados (lista, item único, dados filtrados)
       - `useMutation` para operações de escrita (create, update, delete)
       - Funções de invalidação de cache para manter consistência dos dados
     - Substituir chamadas diretas aos serviços por chamadas aos hooks TanStack Query
   - **Tratamento de estados:**
     - Implementar exibição de estados de carregamento durante operações assíncronas
     - Implementar exibição de mensagens de erro com feedback visual
     - Implementar otimistic updates para operações de modificação
8. Implementar tratamento de erros e estado de carregamento para operações assíncronas, aproveitando os recursos do TanStack Query.
9. Remover código de mock-data.ts após validação completa
