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
   - Utilizar [TanStack Query](https://tanstack.com/query/latest) para buscar, criar, atualizar e deletar dados de forma assíncrona, com gerenciamento de cache, loading e error state.
   - Substituir chamadas diretas aos serviços por hooks baseados em TanStack Query (`useQuery`, `useMutation`, etc).
8. Implementar tratamento de erros e estado de carregamento para operações assíncronas, aproveitando os recursos do TanStack Query.
9. Remover código de mock-data.ts após validação completa
