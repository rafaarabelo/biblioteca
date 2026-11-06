# Gestão Natural + A Biblioteca

Sistema de clínica de estética natural (agenda, pacientes, prontuário, pedidos
manipulados, programas de tratamento) com a biblioteca de conhecimento
cosmetológico de Rafa Rabelo como seção de pesquisa.

> Uso diário: veja [`docs/gestao-natural.md`](docs/gestao-natural.md), inclusive
> como ativar a migration `supabase/017_gestao_natural.sql`.

Aplicação **Next.js 14 (App Router)** + **React 18** + **TypeScript** + **CSS Modules**, com persistência em **Supabase** e deploy na **Vercel**.

---

## Stack

- **Next.js 14.2** (App Router)
- **React 18.3**
- **TypeScript** (strict)
- **CSS Modules** + Design System em CSS custom properties
- **Supabase** (banco, auth, storage)
- **Vercel** (hospedagem e CI/CD)

---

## Rodando localmente

### Pré-requisitos

- Node.js 20 ou superior
- npm

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de variáveis de ambiente
#    Copie o .env.example e preencha com os valores reais do Supabase
cp .env.example .env.local   # no Windows: copy .env.example .env.local

# 3. Rodar em desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:3000`.

### Scripts disponíveis

| Comando             | O que faz                                        |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento (com Turbopack)      |
| `npm run build`     | Build de produção                                |
| `npm run start`     | Roda o build de produção localmente              |
| `npm run lint`      | ESLint (next lint)                               |
| `npm run typecheck` | Checagem de tipos TypeScript (`tsc --noEmit`)    |

---

## Variáveis de ambiente

Todas as variáveis estão documentadas em `.env.example`. Crie um `.env.local`
(nunca versionado) com os valores reais:

| Variável                              | Pública? | Descrição                                                       |
| ------------------------------------- | -------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Sim      | URL do projeto Supabase                                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Sim      | Chave anon/pública (usada no cliente)                           |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`| Sim      | Chave publishable (mesma família da anon)                       |
| `SUPABASE_SERVICE_ROLE_KEY`           | **NÃO**  | Chave secreta — bypassa RLS. Só server-side. Nunca expor.       |

> ⚠️ **Importante:** a `SUPABASE_SERVICE_ROLE_KEY` **não** leva o prefixo
> `NEXT_PUBLIC_`. Esse prefixo expõe a variável ao navegador — o que jamais
> pode acontecer com a chave secreta.

---

## Deploy na Vercel

O repositório está conectado à Vercel. Todo push na branch principal dispara
automaticamente: `npm install` → build → deploy.

### 1. Configurar as variáveis de ambiente na Vercel

No painel da Vercel:

1. Acesse o projeto → **Settings** → **Environment Variables**
2. Adicione as 4 variáveis (mesmos nomes e valores do `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Para cada uma, selecione os ambientes onde ela vale:
   **Production**, **Preview** e **Development**.
4. Salve.

> A `SUPABASE_SERVICE_ROLE_KEY` é tratada como secreta pela Vercel
> automaticamente (não aparece nos logs de build do cliente).

### 2. Fazer o deploy

```bash
# Garanta que o build passa localmente antes de subir
npm run typecheck
npm run lint
npm run build

# Commit e push para a branch principal
git add .
git commit -m "Deploy: versão de produção"
git push origin main
```

A Vercel detecta o push, roda o build e publica. Acompanhe o progresso na aba
**Deployments** do painel.

### 3. Domínio customizado

No painel da Vercel: **Settings** → **Domains** → adicione seu domínio e siga
as instruções de DNS (geralmente um registro `CNAME` ou `A` apontando para a
Vercel).

---

## Checklist antes de cada deploy

- [ ] `npm run typecheck` passa sem erros
- [ ] `npm run lint` sem warnings importantes
- [ ] `npm run build` conclui com sucesso
- [ ] Variáveis de ambiente configuradas na Vercel (Production)
- [ ] Nenhum segredo commitado (o `.gitignore` protege `.env*`)

---

## Estrutura do projeto

```
src/
├── app/                  # Rotas (App Router)
│   ├── (protected)/      # Rotas autenticadas (mesa, caderno, acervo, etc.)
│   ├── auth/             # Callbacks de autenticação
│   ├── login/            # Login
│   ├── layout.tsx        # Root layout (fontes via next/font)
│   └── globals.css       # Estilos globais + aliases do Design System
├── components/           # Componentes compartilhados
│   ├── ds/               # Design System (Paper, Notebook, Ribbon, etc.)
│   ├── layout/           # PhotoLayout e layouts estruturais
│   ├── ui/               # Sidebar, TopBar, Badge, etc.
│   └── icons/            # Ícones SVG
├── features/             # Funcionalidades por domínio
│   ├── mesa/             # Mesa de Pesquisa
│   ├── caderno/          # Caderno de Campo
│   ├── acervo/           # Acervo Científico
│   ├── formulas/         # Fórmulas
│   ├── protocolos/       # Protocolos de Uso
│   └── casos/            # Casos Clínicos
├── domain/               # Entidades e regras de domínio
├── application/          # Casos de uso
├── infrastructure/       # Repositórios, event bus
├── lib/supabase/         # Clients Supabase (browser, server, admin)
├── styles/               # design-system.css (tokens canônicos)
├── types/                # Tipos e tipos gerados do Supabase
└── middleware.ts         # Auth + proteção de rotas
```

---

## Notas de arquitetura

- **Fontes:** carregadas via `next/font/google` (self-hosting automático, zero
  layout shift). As variáveis CSS (`--font-cormorant`, etc.) são consumidas pelo
  Design System em `design-system.css`.
- **Background:** a Mesa de Pesquisa usa `Background mesa.png` (madeira escura);
  as demais telas usam `Background papel todos.png` (papel claro) via
  `PhotoLayout`. As imagens ficam em `public/`.
- **Autenticação:** o `middleware.ts` cuida do refresh de token e da proteção de
  rotas. A raiz `/` redireciona para `/hoje` (autenticado) ou `/login`.
- **Persistência:** toda a persistência real ocorre no Supabase. O
  `localStorage` é usado apenas para estado de interface (filtros, tema, notas
  rápidas, posição de scroll) — nunca como fonte de verdade.
- **Imagens remotas:** avatares e fotos vêm do Supabase Storage
  (`*.supabase.co`), já liberado em `next.config.mjs`.
