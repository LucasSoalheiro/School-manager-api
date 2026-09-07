# School Management API

Uma API REST de gerenciamento escolar desenvolvida com **TypeScript**, **Fastify**, **Drizzle ORM** e **PostgreSQL (Neon HTTP)** seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

---

## 🚀 Tecnologias e Ferramentas

* **Linguagem & Runtime:** Node.js (ES Modules, TypeScript)
* **Framework Web:** [Fastify v5](https://fastify.dev/)
* **ORMs e Banco de Dados:** [Drizzle ORM](https://orm.drizzle.team/), PostgreSQL ([Neon Serverless](https://neon.tech/))
* **Validação:** [Zod](https://zod.dev/)
* **Autenticação & Criptografia:** `@fastify/jwt`, `bcrypt`
* **Segurança:** `@fastify/helmet`, `@fastify/cors`, `@fastify/rate-limit`

---

## 🏛️ Arquitetura do Projeto

O projeto é estruturado com separação em camadas bem definidas:

```text
src/
├── config/                  # Configurações de ambiente e variáveis
├── entity/                  # Entidades de Domínio e Value Objects (Regras de Negócio)
│   └── value_object/        # Objetos de Valor (Email, Password)
├── repository/              # Interfaces de Repositório (Contratos)
├── service/                 # Serviços de Aplicação (Casos de Uso)
├── database/
│   ├── drizzle/             # Schemas e Repositórios concretos do Drizzle
│   │   ├── schemas/         # Tabelas e Relações do Drizzle ORM
│   │   └── repository/      # Implementações Drizzle dos Repositórios
│   └── mapper/              # Mappers (Domínio <-> Persistência)
└── http/                    # Camada HTTP e Infraestrutura de Rede
    ├── controller/          # Controladores das requisições
    ├── middlewares/         # Middlewares (Autenticação JWT e Autorização RBAC)
    ├── routes/              # Plugins de rotas Fastify
    └── schemas/             # Schemas Zod para validação das requisições
```

---

## 🛡️ Recursos de Segurança

* **Autenticação JWT:** Proteção de rotas através de Tokens Bearer via `@fastify/jwt`.
* **Controle de Acesso por Papéis (RBAC):** Restrição de permissões entre os perfis `student` e `teacher`.
* **Criptografia de Senhas:** Hashing seguro de senhas com `bcrypt` e validação no Value Object `Password`.
* **Validação de Entrada com Zod:** Sanitização e validação de schemas em todos os endpoints HTTP.
* **Cabeçalhos de Segurança (Helmet):** Proteção contra XSS, Clickjacking e Content Sniffing via `@fastify/helmet`.
* **Rate Limiting:** Proteção contra ataques de força bruta e DoS via `@fastify/rate-limit`.
* **CORS:** Políticas de Origem Cruzada configuradas via `@fastify/cors`.

---

## 📋 Pré-requisitos e Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
NODE_ENV=dev
PORT=3000
SALT_ROUNDS=10
DATABASE_URL=postgresql://usuario:senha@ep-exemplo.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=sua_chave_secreta_jwt_super_segura
```

---

## ⚙️ Instalação e Execução

### 1. Instalar as dependências
```bash
npm install
```

### 2. Gerar e aplicar migrações no banco de dados (Drizzle Kit)
```bash
npx drizzle-kit push
```

### 3. Compilar o TypeScript
```bash
npm run build
```

### 4. Iniciar o servidor
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`.

---

## 📄 Documentação da API

Para conferir a documentação detalhada de cada rota, parâmetros, exemplos de requisição e respostas HTTP, consulte o arquivo **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**.
