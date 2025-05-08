---
id: plan-005
title: Página Inicial para Usuários Não Autenticados
createdAt: 2025-05-08
author: vinilana
status: completed
---

## 🧩 Escopo

Criar uma página inicial separada que será exibida para usuários não autenticados, movendo as seções de herói e recursos da página inicial atual. Usuários autenticados devem ver diretamente a interface principal da biblioteca de prompts.

## ✅ Requisitos Funcionais

- Criar um novo componente de página inicial que exiba as seções de herói e recursos
- Implementar roteamento no lado do cliente para mostrar a landing page para usuários não autenticados
- Manter a lista principal de prompts e funcionalidades na página inicial atual para usuários autenticados
- Adicionar um call-to-action claro para usuários não autenticados fazerem login/cadastro
- Manter todos os visuais e interações atuais da landing page

## ⚙️ Requisitos Não Funcionais

- Performance: Garantir que a landing page carregue rapidamente e as animações permaneçam suaves
- Segurança: Proteger corretamente as rotas com base no status de autenticação
- Responsividade: Manter o design responsivo atual para todos os tamanhos de tela

## 📚 Diretrizes & Pacotes

- Seguir o padrão App Router do Next.js
- Utilizar os componentes de UI e abordagem de estilização existentes
- Aproveitar os métodos de autenticação já presentes no projeto

## 🔢 Plano de Execução

1. Criar um novo componente de página em `app/landing/page.tsx` para abrigar o conteúdo da landing
2. Mover as seções de herói e recursos de `app/page.tsx` para a nova landing page
3. Atualizar a lógica de roteamento para direcionar usuários não autenticados para a landing page
4. Modificar a `app/page.tsx` atual para exibir apenas o conteúdo da biblioteca de prompts
5. Adicionar roteamento condicional baseado em autenticação no layout raiz
