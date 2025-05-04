---
id: plan-004
title: Hook de Autenticação de Papel de Usuário
createdAt: 2025-05-04
author: vinilana
status: completed
---

## 🧩 Escopo

Implementar um hook React para identificar e gerenciar os papéis dos usuários na aplicação, com foco específico em distinguir usuários administradores de usuários comuns. Este hook irá utilizar os claims de sessão do Clerk para determinar os papéis dos usuários de forma consistente tanto em componentes client quanto server.

## ✅ Requisitos Funcionais

- Criar um hook `useUserRole` que identifica se o usuário possui privilégios de administrador
- Suportar renderização condicional baseada em papéis nos componentes
- Garantir que a identificação de papel seja consistente com as verificações de autenticação do middleware
- Fornecer uma API simples para checagem de papéis específicos (ex: `isAdmin()`)
- Lidar graciosamente com o estado não autenticado

## ⚙️ Requisitos Não Funcionais

- Performance: Minimizar re-renderizações ao checar papéis de usuário
- Segurança: Garantir que os claims de papel não possam ser manipulados no client
- Reusabilidade: O hook deve ser utilizável em qualquer componente da aplicação

## 📚 Diretrizes & Pacotes

- Seguir as melhores práticas do Next.js e React para hooks
- Utilizar a autenticação Clerk existente (@clerk/nextjs)


## 🔢 Plano de Execução

1. ✓ Criar uma interface TypeScript para papéis de usuário e claims
2. ✓ Implementar o hook `useUserRole` que extrai as informações de papel da sessão do Clerk
3. ✓ Adicionar métodos auxiliares para checagens comuns de papel (isAdmin, isAuthenticated)
4. ✓ Atualizar o componente page.tsx para usar o hook ao invés do estado isAdmin hardcoded

## 📝 Implementação

- Criadas interfaces TypeScript para papéis de usuário em `lib/types.ts` 
- Implementado hook `useUserRole` em `hooks/use-user-role.tsx` para extrair informações de papel da sessão Clerk
- Hook fornece verificações para `isAdmin`, `isAuthenticated` e método genérico `hasRole`
- Atualizado `app/page.tsx` para usar o hook em vez do estado hardcoded
