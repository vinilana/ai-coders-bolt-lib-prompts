---
id: plan-001
title: Upgrade Next.js para v15
createdAt: 2025-05-04
author: vinilana
status: draft
---

## 🧩 Scope
Atualizar o projeto de Next.js da versão 13.5.1 para a versão 15, garantindo compatibilidade com novas APIs, configurações e codemods, sem quebrar funcionalidades existentes.

## ✅ Functional Requirements
- O projeto deve rodar em Next.js v15.
- As APIs de Headers e Cookies devem ser migradas para suas versões assíncronas.
- Páginas e layouts do App Router devem usar funções `async`.
- Configurações experimentais renomeadas para suas contrapartes estáveis.
- Middleware e rotas de API atualizadas conforme nova assinatura do Next.js 15.

## 📚 Guidelines & Packages
- Seguir documentação oficial de upgrade do Next.js v15.
- Uso de `@next/codemod`, `eslint-config-next@latest`.
- Ferramentas: npm, codemods Next.js

## 🔢 Execution Plan
1. Executar codemod: `npx @next/codemod@canary upgrade latest`.
2. Atualizar dependências: `npm install next@latest react@latest react-dom@latest eslint-config-next@latest`.
4. Ajustar `next.config.js` renomeando flags experimentais.
5. Migrar APIs: substituir `headers()` e `cookies()` por chamadas `await`.
6. Atualizar funções de metadata, páginas e layouts para `async`.
7. Revisar e atualizar middlewares e matchers.
