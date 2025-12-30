# Dropzone

Sistema de autenticação e gerenciamento com Next.js 15, utilizando Next-Auth v5, Prisma ORM, PostgreSQL e shadcn/ui. O projeto inclui funcionalidades de chat em tempo real, sistema de agendamento, visualização de dados geográficos e gerenciamento de unidades militares.

## Stack Principal

- **Framework**: Next.js 15 (App Router)
- **Autenticação**: Next-Auth v5 (JWT, sessão 30 dias)
- **Banco de Dados**: PostgreSQL via Prisma ORM
- **UI**: shadcn/ui + Radix UI + Tailwind CSS
- **Validação**: Zod + React Hook Form
- **Notificações**: Sonner
- **Real-time**: Socket.io

## Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dropzone"

AUTH_SECRET=
NEXTAUTH_SECRET=

ROOT_DATABASE_USERNAME="admin"
ROOT_DATABASE_NAME="Administrador"
ROOT_DATABASE_PASSWORD="123456789"

EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_FROM_ADDRESS="seu-email@gmail.com"
EMAIL_SERVER_PASSWORD="sua-senha-app"
EMAIL_SERVER_FROM_NAME="Dropzone"

DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=dropzone
DB_PORT=5432
```

### 3. Gerar token de autenticação

```bash
npx auth secret
```

### 4. Iniciar PostgreSQL com Docker

```bash
docker-compose up -d
```

### 5. Configurar banco de dados

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 6. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:4000`

## Comandos Úteis

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

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
npx prisma studio
```

### Email Templates

Para visualizar e editar templates de email:

```bash
cd src/packages/transactional
npm run dev
```

### Docker

```bash
docker-compose up -d
docker-compose down
docker-compose logs -f
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/              # Rotas de autenticação
│   ├── api/                 # API Routes
│   └── dashboard/           # Área protegida
│       ├── definicoes/      # Configurações
│       ├── manager/         # Gestão com data tables
│       ├── builder/         # Visual flow builder
│       ├── datacenters/     # Visualização geográfica
│       └── beta/            # Jogo estratégico
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── form/                # Formulários
│   ├── dashboard/           # Componentes do dashboard
│   ├── chat/                # Sistema de chat
│   └── nodes/               # Flow nodes
├── lib/
│   ├── db.ts               # Prisma client
│   ├── user.ts             # User queries
│   └── SendEmail.ts        # Nodemailer
├── services/
│   ├── unit.service.ts     # Serviço de unidades
│   └── selected-unit.service.ts
├── utils/
│   ├── auth/               # Server actions
│   └── chat/               # Chat operations
└── packages/
    └── transactional/      # Email templates
```

## Funcionalidades

- Autenticação com Next-Auth v5
- Sistema de recuperação de senha
- Gerenciamento de usuários
- Chat em tempo real multi-room
- Sistema de agendamento
- Visualização de dados geográficos com Leaflet
- Visual flow builder com @xyflow/react
- Sistema de unidades militares
- Jogo estratégico em tempo real

## Arquitetura

### Autenticação

Next-Auth v5 configurado com:
- Provider: Credentials (username/password)
- Session: JWT (30 dias)
- Middleware protegendo rotas `/dashboard/*`

### Banco de Dados

Prisma ORM com PostgreSQL:
- Modelos: User, PasswordResetToken, Room, RoomUser, Message, Schedule, Unit, SelectedUnit
- Seeders organizados em `prisma/seeds/`
- Services layer para operações no banco

### Email

- SMTP via Nodemailer
- Templates React Email
- Visualização de prévia em desenvolvimento

## Desenvolvimento

### Padrões de Código

- TypeScript com ESM
- Server Actions retornam `Promise<Message>`
- Serviços usam apenas Prisma ORM (sem SQL raw)
- Transformação automática camelCase → snake_case quando necessário

### Branches

- `main`: Branch principal (produção)
- `dev`: Branch de desenvolvimento

## Resetar Banco de Dados

**CUIDADO**: Este comando irá excluir todos os dados

```bash
npx prisma migrate reset
```

## Vídeo Demo

[![Watch the video](https://img.youtube.com/vi/1TuKGQQnsJw/0.jpg)](https://www.youtube.com/watch?v=1TuKGQQnsJw)

## Licença

MIT
