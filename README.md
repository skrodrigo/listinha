# 🛒 Listinha - Shopping List Manager

Um aplicativo mobile completo para gerenciar listas de compras com orçamento, histórico e relatórios. Desenvolvido com **React Native**, **Hono**, **Prisma** e **Better Auth**.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Tecnologias](#tecnologias)

---

## 🎯 Visão Geral

**Listinha** é um aplicativo que permite:

- ✅ **Criar listas de compras** com orçamento definido
- ✅ **Adicionar itens** com quantidade e valor
- ✅ **Acompanhar gastos** em tempo real
- ✅ **Visualizar histórico** de compras anteriores
- ✅ **Gerar relatórios** com resumo de gastos
- ✅ **Autenticação segura** com email e senha
- ✅ **Sincronização** entre dispositivos

---

## 🏗️ Arquitetura

```
Listinha/
├── backend/                    # Servidor Hono + Prisma
│   ├── src/
│   │   ├── index.ts           # App principal
│   │   ├── routes/
│   │   │   └── lists.ts       # Rotas de listas
│   │   ├── lib/
│   │   │   ├── auth.ts        # Configuração Better Auth
│   │   │   ├── prisma.ts      # Cliente Prisma
│   │   │   └── env.ts         # Variáveis de ambiente
│   │   └── generated/
│   │       └── prisma/        # Cliente Prisma gerado
│   ├── prisma/
│   │   └── schema.prisma      # Schema do banco de dados
│   └── package.json
│
└── mobile/                     # App React Native (Expo)
    ├── src/
    │   ├── app/               # Rotas e telas
    │   │   ├── (tabs)/        # Abas principais
    │   │   ├── list/[id].tsx  # Detalhe da lista
    │   │   └── report/[id].tsx # Relatório
    │   ├── hooks/
    │   │   └── useAuth.tsx    # Hook de autenticação
    │   ├── infra/
    │   │   ├── api.ts         # Cliente Axios
    │   │   └── services/      # Serviços de API
    │   ├── types/
    │   │   └── index.ts       # Tipos TypeScript
    │   └── assets/
    └── package.json
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (para o app mobile)

```bash
# Verificar versões
node --version
npm --version
```

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd listinha
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Configurar variáveis de ambiente
# DATABASE_URL=postgresql://user:password@localhost:5432/listinha
# BETTER_AUTH_SECRET=sua-chave-secreta-aqui
# BETTER_AUTH_URL=http://localhost:3000
```

### 3. Configurar Banco de Dados

```bash
cd backend

# Executar migrations
npx prisma migrate dev --name init

# Gerar cliente Prisma
npx prisma generate
```

### 4. Configurar Mobile

```bash
cd mobile

# Instalar dependências
npm install

```

---

## 💻 Desenvolvimento

### Backend

```bash
cd backend

# Iniciar servidor em desenvolvimento
npm run dev

# Servidor rodará em http://localhost:3000
```

**Comandos úteis:**

```bash
# Verificar tipos TypeScript
npm run type-check

# Executar migrations
npx prisma migrate dev

# gerar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (GUI do banco)
npx prisma studio
```

### Mobile

```bash
cd mobile

# Iniciar Expo
npx expo start

```

---

## 📁 Estrutura do Projeto

### Backend - `backend/src/`

#### `index.ts` - Aplicação Principal
- Configura middlewares (CORS, autenticação, Prisma)
- Define rotas de autenticação
- Monta rotas de listas

#### `routes/lists.ts` - Rotas de Listas
- `GET /api/lists` - Listar todas as listas do usuário
- `POST /api/lists` - Criar nova lista
- `GET /api/lists/:id` - Obter detalhes de uma lista
- `PATCH /api/lists/:id` - Atualizar lista
- `DELETE /api/lists/:id` - Deletar lista
- `POST /api/lists/:id/items` - Adicionar item
- `PATCH /api/lists/:id/items/:itemId` - Atualizar item
- `DELETE /api/lists/:id/items/:itemId` - Deletar item

#### `lib/auth.ts` - Autenticação
- Configuração do Better Auth
- Adapter Prisma para persistência
- Suporte a email/senha

#### `lib/prisma.ts` - Banco de Dados
- Cliente Prisma
- Middleware para injetar Prisma no contexto

### Mobile - `mobile/src/`

#### `app/` - Telas
- `login.tsx` - Tela de login
- `register.tsx` - Tela de registro
- `(tabs)/newList.tsx` - Criar nova lista
- `(tabs)/history.tsx` - Histórico de listas
- `list/[id].tsx` - Detalhe e edição de lista
- `report/[id].tsx` - Relatório de gastos

#### `hooks/useAuth.tsx` - Autenticação
- Context de autenticação
- Gerenciamento de sessão
- Login/Logout

#### `infra/services/` - Serviços de API
- `authService.ts` - Endpoints de autenticação
- `listService.ts` - Endpoints de listas

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/register` | Registrar novo usuário |
| POST | `/api/auth/callback/credentials` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/session` | Obter sessão atual |

### Listas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/lists` | Listar todas as listas |
| POST | `/api/lists` | Criar lista |
| GET | `/api/lists/:id` | Obter lista |
| PATCH | `/api/lists/:id` | Atualizar lista |
| DELETE | `/api/lists/:id` | Deletar lista |

### Itens

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/lists/:id/items` | Adicionar item |
| PATCH | `/api/lists/:id/items/:itemId` | Atualizar item |
| DELETE | `/api/lists/:id/items/:itemId` | Deletar item |

---

## 🛠️ Tecnologias

### Backend
- **Hono** - Framework web ultrarrápido
- **Prisma** - ORM para Node.js
- **PostgreSQL** - Banco de dados
- **Better Auth** - Autenticação
- **TypeScript** - Tipagem estática

### Mobile
- **React Native** - Framework mobile
- **Expo** - Plataforma React Native
- **Expo Router** - Navegação
- **TanStack Query** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **TypeScript** - Tipagem estática


---

## 📝 Fluxo de Uso

### 1. Registro
```
Usuário → Tela de Registro → POST /api/register → Banco de Dados
```

### 2. Login
```
Usuário → Tela de Login → POST /api/auth/callback/credentials → Sessão
```

### 3. Criar Lista
```
Usuário → Tela Nova Lista → POST /api/lists → Banco de Dados
```

### 4. Adicionar Itens
```
Usuário → Detalhe da Lista → POST /api/lists/:id/items → Banco de Dados
```

### 5. Visualizar Relatório
```
Usuário → Histórico → Clica em Lista → GET /api/lists/:id → Tela de Relatório
```

