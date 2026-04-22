# SIGP-PE - Sistema Integrado de Gestão de Produtos

Sistema desenvolvido para o desafio técnico de gestão de produtos, seguindo os padrões de identidade visual institucional (GovPE).

## 🚀 Tecnologias Utilizadas

- **Backend:** NestJS (Node.js), TypeORM, JWT para Autenticação.
- **Frontend:** Next.js 15, Tailwind CSS, Axios, React Hot Toast.
- **Banco de Dados:** PostgreSQL rodando via Docker.
- **Segurança:** Proteção de rotas via Guards no Backend e Middleware de Cookies no Frontend.

## 📦 Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados.
- Node.js (v18 ou superior).

### Passo 1: Iniciar o Banco de Dados
Na raiz do projeto, execute:

```bash
docker-compose up -d
```

### Passo 2: Configurar o Backend

```bash
cd backend
npm install
npm run start:dev
```
*A API estará disponível em http://localhost:3000*

### Passo 3: Configurar o Frontend

```bash
cd ../frontend
npm install
npm run dev
```
*O sistema estará disponível em http://localhost:3001*

## 🔑 Acesso para Teste

Para facilitar a avaliação, utilize as credenciais abaixo:
- **Usuário:** `validado@email.com`
- **Senha:** `senha123`

## 🛠️ Funcionalidades Implementadas
- [x] Autenticação Completa (Login/Logout com JWT)
- [x] CRUD de Produtos (Criar, Listar, Excluir)
- [x] Cadastro dinâmico de Categorias
- [x] Busca em tempo real na listagem
- [x] Feedback visual via Toasts (Sucesso/Erro)
- [x] Relacionamento entre Tabelas (Produto -> Categoria -> Usuário)
- [x] Interface Responsiva (Padrão GovPE)