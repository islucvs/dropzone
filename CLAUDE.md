# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Sistema de autenticação e gerenciamento com Next.js 15, utilizando Next-Auth v5, Prisma ORM, PostgreSQL e shadcn/ui. O projeto inclui funcionalidades de chat em tempo real, sistema de agendamento e visualização de dados geográficos.

## Comandos Essenciais

### Desenvolvimento
```bash
npm run dev
```
Inicia servidor de desenvolvimento na porta 4000 com turbopack.

### Build
```bash
npm run build
```
Executa `prisma generate` e build de produção sem lint.

### Linting
```bash
npm run lint
```

### Database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma migrate reset
```

### Email Templates (workspace)
```bash
cd src/packages/transactional
npm run dev
```
Visualização de templates de email React.

### Docker
```bash
docker-compose up -d
```
Inicia PostgreSQL 18 Alpine em container.

### Criar Token Auth.js
```bash
npx auth secret
```

## Arquitetura

### Stack Principal
- **Framework**: Next.js 15 (App Router)
- **Auth**: Next-Auth v5 (strategy: JWT, session 30 dias)
- **Database**: PostgreSQL via Prisma ORM + pg Pool direto
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **Validação**: Zod + React Hook Form
- **Notificações**: Sonner (toast)
- **Real-time**: Socket.io (versão no-socket removida recentemente)

### Estrutura de Diretórios

```
src/
├── app/
│   ├── (auth)/              # Rotas de autenticação (login/registro)
│   ├── api/                 # API Routes (auth, socket, units)
│   └── dashboard/           # Área protegida
│       ├── (home)/
│       ├── definicoes/      # Configurações e gestão de usuários
│       ├── manager/         # Gestão com data tables
│       ├── builder/         # Visual flow builder (@xyflow/react)
│       ├── datacenters/     # Visualização geográfica (Leaflet)
│       └── [outras rotas]/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── form/                # Formulários específicos
│   ├── dashboard/           # App sidebar, data tables
│   ├── chat/                # Chat components
│   ├── nodes/               # Flow nodes (sum-node, num-node)
│   └── tabs/                # Tab systems
├── lib/
│   ├── db.ts               # Prisma client + pg Pool
│   ├── user.ts             # User queries
│   ├── SendEmail.ts        # Nodemailer
│   └── socket-server.ts    # Socket.io setup
├── utils/
│   ├── auth/               # Server actions (login, register, forget, etc)
│   ├── chat/               # Chat operations
│   └── server/             # Server utilities
├── contexts/               # React contexts (dashboard, sidebar)
├── types/                  # TypeScript types
├── hooks/                  # Custom hooks
└── packages/
    └── transactional/      # Email templates (@react-email)
```

### Database Schema (Prisma)

**Modelos principais**:
- `User`: autenticação, profile, relações com messages/rooms/schedules
- `PasswordResetToken`: tokens de reset de senha
- `Room` + `RoomUser` + `Message`: sistema de chat multi-room
- `Schedule`: agendamentos com integração Google Calendar
- `Chart` + `Data`: visualização de dados

### Autenticação

**Next-Auth v5** configurado em `src/auth.ts`:
- Provider: Credentials (username/password)
- Session: JWT (30 dias)
- Callbacks customizados adicionam `id` e `username` ao session/token
- Pages: signIn e error apontam para `/`
- Middleware em `src/middleware.ts` protege rotas `/dashboard/*`

**Nomes possíveis de cookies**:
- `__Secure-next-auth.session-token`
- `next-auth.session-token`
- `__Host-next-auth.session-token`
- `authjs.session-token`
- `__Secure-authjs.session-token`

### Server Actions Pattern

Todos os server actions retornam `Promise<Message>`:
```typescript
type Message = {
  success: boolean;
  message: string;
  redirect?: string;
}
```

Localizados em `src/utils/auth/`:
- `loginAction`: signIn com Next-Auth
- `registerAction`: cria user com bcrypt hash
- `forgetAction`: gera token de reset
- `alterPasswordAction`: altera senha
- `deleteUserAction`: remove usuário

### Database Access

Duas formas:
1. **Prisma Client** (ORM): `import db from "@/lib/db"`
2. **pg Pool** (raw SQL): `import { pool } from "@/lib/db"`

Pool configurado com SSL false para desenvolvimento local.

### Email System

- **SMTP**: Nodemailer configurado em `src/lib/SendEmail.ts`
- **Templates**: React Email em `src/packages/transactional/emails/`
  - `RegisterConfirm.tsx`
  - `ResetPassword.tsx`
- Variáveis de ambiente necessárias:
  - `EMAIL_SERVER_HOST`
  - `EMAIL_SERVER_PORT`
  - `EMAIL_SERVER_FROM_ADDRESS`
  - `EMAIL_SERVER_PASSWORD`
  - `EMAIL_SERVER_FROM_NAME`

### Variáveis de Ambiente Críticas

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
AUTH_SECRET=
NEXTAUTH_SECRET=

ROOT_DATABASE_USERNAME="admin"
ROOT_DATABASE_NAME="Administrador"
ROOT_DATABASE_PASSWORD="123456789"

EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_FROM_ADDRESS=
EMAIL_SERVER_PASSWORD=
EMAIL_SERVER_FROM_NAME=

DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=5432
```

### UI/UX Patterns

- **Theme**: Dark mode fixo (`dark bg-neutral-900`)
- **Toast**: Sonner com estilo customizado (border laranja `#fc5c00`, monospace)
- **Path alias**: `@/*` → `./src/*`
- **Componentes**: shadcn/ui + Radix primitives
- **Validação**: Zod schemas com React Hook Form + resolvers

### Flow Builder

Utiliza `@xyflow/react` para criação de diagramas:
- Nodes customizados em `src/components/nodes/`
- Base components: `base-node.tsx`, `base-handle.tsx`, `labeled-handle.tsx`
- Implementado em `/dashboard/builder`

### Chat System

- Rooms multi-usuário com RoomUser junction table
- Messages vinculadas a Room e User
- Components em `src/components/chat/`
- Real-time via Socket.io (verificar `socket-server.ts`)

### Workspace Structure

Monorepo NPM workspace:
```json
"workspaces": ["src/packages/*"]
```

Atualmente contém apenas `transactional` (email templates).

## Notas de Desenvolvimento

- TypeScript strict mode: `false`
- ESM: `"type": "module"` em package.json
- Build: `--no-lint` (lint separadamente)
- Port: 4000 (dev server)
- Prisma provider: PostgreSQL
- bcrypt: `bcrypt-ts` (TypeScript-friendly)

## Git Status Recente

Commits recentes indicam:
- "no-socket version" (2x) - possível remoção de Socket.io
- "Major PR upgrades"
- "Building modifications"
- Removidos: `.dockerignore`, `.env.production`, `devlog.txt`
- Adicionado: `docker-compose.yml`
