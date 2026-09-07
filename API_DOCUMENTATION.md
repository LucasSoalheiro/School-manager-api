# Documentação da API - School Management

Esta documentação descreve todos os endpoints disponíveis na API de Gerenciamento Escolar, com seus métodos HTTP, permissões exigidas, exemplos de corpo da requisição (*body*) e possíveis respostas.

---

## 🔐 Autenticação e Cabeçalhos

Rotas protegidas requerem o envio do token JWT no cabeçalho `Authorization`:

```http
Authorization: Bearer <seu_token_jwt>
```

---

## 📑 Sumário de Módulos

1. [Autenticação (`/auth`)](#1-autenticação-auth)
2. [Estudantes (`/students`)](#2-estudantes-students)
3. [Professores (`/teachers`)](#3-professores-teachers)
4. [Turmas (`/classes`)](#4-turmas-classes)
5. [Disciplinas (`/subjects`)](#5-disciplinas-subjects)
6. [Matrículas (`/enrollments`)](#6-matrículas-enrollments)
7. [Atividades (`/activities`)](#7-atividades-activities)
8. [Notas e Entregas (`/grades`)](#8-notas-e-entregas-grades)

---

## 1. Autenticação (`/auth`)

### 1.1. Login de Estudante
Realiza a autenticação de um estudante cadastrado e retorna um token JWT.

* **Método:** `POST`
* **Rota:** `/auth/login/student`
* **Autenticação:** Pública

#### Exemplo de Body (JSON)
```json
{
  "email": "joao.silva@email.com",
  "password": "senhaSegura123"
}
```

#### Respostas Possíveis
* **`200 OK`**
```json
{
  "user": {
    "id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

* **`401 Unauthorized`**
```json
{
  "error": "Unauthorized",
  "message": "Invalid email or password"
}
```

---

### 1.2. Login de Professor
Realiza a autenticação de um professor cadastrado e retorna um token JWT.

* **Método:** `POST`
* **Rota:** `/auth/login/teacher`
* **Autenticação:** Pública

#### Exemplo de Body (JSON)
```json
{
  "email": "maria.oliveira@escola.com",
  "password": "senhaProfessor123"
}
```

#### Respostas Possíveis
* **`200 OK`**
```json
{
  "user": {
    "id": "e8d9a7f1-4c3b-2a1d-9f8e-987654321cba",
    "name": "Maria Oliveira",
    "email": "maria.oliveira@escola.com",
    "role": "teacher"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

* **`401 Unauthorized`**
```json
{
  "error": "Unauthorized",
  "message": "Invalid email or password"
}
```

---

## 2. Estudantes (`/students`)

### 2.1. Cadastrar Estudante
* **Método:** `POST`
* **Rota:** `/students`
* **Autenticação:** Pública

#### Exemplo de Body (JSON)
```json
{
  "name": "João",
  "last_name": "Silva",
  "email": "joao.silva@email.com",
  "password": "senhaSegura123"
}
```

#### Respostas Possíveis
* **`201 Created`**
```json
{
  "id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
  "email": "joao.silva@email.com"
}
```

* **`400 Bad Request`** (Validação Zod / Nome curto / Email inválido)
```json
{
  "error": "Validation Error",
  "message": "Validation failed for request data",
  "issues": [
    {
      "code": "too_small",
      "path": ["name"],
      "message": "Name must have at least 3 characters"
    }
  ]
}
```

---

### 2.2. Buscar Estudante por ID
* **Método:** `GET`
* **Rota:** `/students/:id`
* **Autenticação:** Exige Token JWT (`student` ou `teacher`)

#### Respostas Possíveis
* **`200 OK`**
```json
{
  "id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
  "email": "joao.silva@email.com",
  "name": "João",
  "last_name": "Silva",
  "full_name": "João Silva",
  "is_active": true
}
```

* **`404 Not Found`**
```json
{
  "error": "Not Found",
  "message": "Student with id \"c1f7a8e2-9b21-4d3f-8a5e-123456789abc\" not found"
}
```

---

### 2.3. Atualizar Nome do Estudante
* **Método:** `PATCH`
* **Rota:** `/students/:id/name`
* **Autenticação:** Exige Token JWT

#### Exemplo de Body (JSON)
```json
{
  "name": "João Carlos"
}
```

#### Resposta
* **`200 OK`**
```json
{
  "message": "Student name updated successfully"
}
```

---

### 2.4. Alterar Senha do Estudante
* **Método:** `PATCH`
* **Rota:** `/students/:id/password`
* **Autenticação:** Exige Token JWT

#### Exemplo de Body (JSON)
```json
{
  "current_password": "senhaSegura123",
  "new_password": "novaSenhaSegura456"
}
```

#### Respostas Possíveis
* **`200 OK`**
```json
{
  "message": "Student password updated successfully"
}
```

* **`400 Bad Request`**
```json
{
  "error": "Bad Request",
  "message": "Current password is incorrect"
}
```

---

### 2.5. Ativar Estudante
* **Método:** `PATCH`
* **Rota:** `/students/:id/activate`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Resposta
* **`200 OK`**
```json
{
  "message": "Student activated successfully"
}
```

---

### 2.6. Desativar Estudante
* **Método:** `PATCH`
* **Rota:** `/students/:id/deactivate`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Resposta
* **`200 OK`**
```json
{
  "message": "Student deactivated successfully"
}
```

---

## 3. Professores (`/teachers`)

### 3.1. Cadastrar Professor
* **Método:** `POST`
* **Rota:** `/teachers`
* **Autenticação:** Pública

#### Exemplo de Body (JSON)
```json
{
  "name": "Maria",
  "last_name": "Oliveira",
  "email": "maria.oliveira@escola.com",
  "password": "senhaProfessor123"
}
```

#### Resposta
* **`201 Created`**
```json
{
  "id": "e8d9a7f1-4c3b-2a1d-9f8e-987654321cba",
  "email": "maria.oliveira@escola.com"
}
```

---

### 3.2. Buscar Professor por ID
* **Método:** `GET`
* **Rota:** `/teachers/:id`
* **Autenticação:** Exige Token JWT

#### Resposta
* **`200 OK`**
```json
{
  "id": "e8d9a7f1-4c3b-2a1d-9f8e-987654321cba",
  "email": "maria.oliveira@escola.com",
  "name": "Maria",
  "last_name": "Oliveira",
  "full_name": "Maria Oliveira",
  "is_active": true,
  "school_classes": [
    {
      "id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c",
      "class_name": "Turma 301 - Ensino Médio",
      "is_active": true
    }
  ]
}
```

---

### 3.3. Atribuir Turma ao Professor
* **Método:** `POST`
* **Rota:** `/teachers/:id/classes`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "class_id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c"
}
```

#### Resposta
* **`200 OK`**
```json
{
  "message": "Class assigned to teacher successfully"
}
```

---

### 3.4. Remover Turma do Professor
* **Método:** `DELETE`
* **Rota:** `/teachers/:id/classes/:class_id`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Resposta
* **`200 OK`**
```json
{
  "message": "Class removed from teacher successfully"
}
```

---

## 4. Turmas (`/classes`)

### 4.1. Criar Turma
* **Método:** `POST`
* **Rota:** `/classes`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "class_name": "Turma 301 - Ensino Médio"
}
```

#### Resposta
* **`201 Created`**
```json
{
  "id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c",
  "class_name": "Turma 301 - Ensino Médio"
}
```

---

### 4.2. Buscar Turma por ID
* **Método:** `GET`
* **Rota:** `/classes/:id`
* **Autenticação:** Exige Token JWT

#### Resposta
* **`200 OK`**
```json
{
  "id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c",
  "class_name": "Turma 301 - Ensino Médio",
  "is_active": true,
  "students": [
    {
      "id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
      "name": "João Silva",
      "email": "joao.silva@email.com"
    }
  ],
  "activities": [
    {
      "id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
      "title": "Trabalho de Matemática",
      "description": "Resolver os exercícios do Capítulo 4.",
      "created_at": "2026-09-06T18:00:00.000Z",
      "delivery_date": "2026-09-20T23:59:59.000Z"
    }
  ]
}
```

---

### 4.3. Adicionar Estudante à Turma
Matricula um aluno na turma e gera um registro em `enrollment`.

* **Método:** `POST`
* **Rota:** `/classes/:id/students`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "student_id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc"
}
```

#### Resposta
* **`200 OK`**
```json
{
  "message": "Student added to class successfully"
}
```

---

### 4.4. Adicionar Atividade à Turma
* **Método:** `POST`
* **Rota:** `/classes/:id/activities`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "title": "Trabalho de Matemática",
  "description": "Resolver os exercícios do Capítulo 4 do livro didático.",
  "delivery_date": "2026-09-20T23:59:59.000Z"
}
```

#### Resposta
* **`201 Created`**
```json
{
  "activity_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
  "title": "Trabalho de Matemática"
}
```

---

### 4.5. Fechar Turma
* **Método:** `PATCH`
* **Rota:** `/classes/:id/close`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Resposta
* **`200 OK`**
```json
{
  "message": "School class closed successfully"
}
```

---

## 5. Disciplinas (`/subjects`)

### 5.1. Criar Disciplina
* **Método:** `POST`
* **Rota:** `/subjects`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "name": "Matemática Avançada",
  "description": "Cálculo e Geometria Analítica.",
  "teacher_id": "e8d9a7f1-4c3b-2a1d-9f8e-987654321cba",
  "school_class_id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c"
}
```

#### Resposta
* **`201 Created`**
```json
{
  "id": "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
  "name": "Matemática Avançada",
  "teacher_id": "e8d9a7f1-4c3b-2a1d-9f8e-987654321cba",
  "class_id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c"
}
```

---

### 5.2. Atualizar Disciplina
* **Método:** `PUT`
* **Rota:** `/subjects/:id`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "name": "Matemática Aplicada II",
  "description": "Estatística e Álgebra Linear."
}
```

#### Resposta
* **`200 OK`**
```json
{
  "message": "Subject updated successfully"
}
```

---

## 6. Matrículas (`/enrollments`)

### 6.1. Buscar Matrículas por Estudante
* **Método:** `GET`
* **Rota:** `/enrollments/student/:student_id`
* **Autenticação:** Exige Token JWT

#### Resposta
* **`200 OK`**
```json
[
  {
    "id": "d7c6b5a4-9f8e-7d6c-5b4a-3f2e1d0c9b8a",
    "student_id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
    "school_class_id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c",
    "enrolled_at": "2026-09-06T18:00:00.000Z",
    "status": "active",
    "is_active": true
  }
]
```

---

### 6.2. Cancelar Matrícula
* **Método:** `PATCH`
* **Rota:** `/enrollments/:id/cancel`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Resposta
* **`200 OK`**
```json
{
  "message": "Enrollment cancelled successfully"
}
```

---

## 7. Atividades (`/activities`)

### 7.1. Buscar Atividade por ID
* **Método:** `GET`
* **Rota:** `/activities/:id`
* **Autenticação:** Exige Token JWT

#### Resposta
* **`200 OK`**
```json
{
  "id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
  "title": "Trabalho de Matemática",
  "description": "Resolver os exercícios do Capítulo 4.",
  "created_at": "2026-09-06T18:00:00.000Z",
  "delivery_date": "2026-09-20T23:59:59.000Z",
  "school_class_id": "f5e4d3c2-b1a0-9f8e-7d6c-5b4a3f2e1d0c"
}
```

---

### 7.2. Atualizar Data de Entrega
* **Método:** `PATCH`
* **Rota:** `/activities/:id/delivery-date`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "delivery_date": "2026-09-25T23:59:59.000Z"
}
```

#### Resposta
* **`200 OK`**
```json
{
  "message": "Activity delivery date updated successfully"
}
```

---

## 8. Notas e Entregas (`/grades`)

### 8.1. Atribuir Registro de Nota (Pendente)
Atribui um registro de nota pendente para um aluno em uma atividade.

* **Método:** `POST`
* **Rota:** `/grades/assign`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "student_id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
  "activity_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d"
}
```

#### Resposta
* **`201 Created`**
```json
{
  "grade_id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "student_id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
  "activity_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
  "status": "pending"
}
```

---

### 8.2. Submeter Atividade pelo Aluno
Altera o status da nota de `pending` para `submitted`.

* **Método:** `POST`
* **Rota:** `/grades/:id/submit`
* **Autenticação:** Exige Token JWT (Regra: `student`)

#### Resposta
* **`200 OK`**
```json
{
  "message": "Grade submitted successfully"
}
```

---

### 8.3. Avaliar e Dar Nota (Professor)
Atribui nota (0 a 10) e feedback a uma atividade previamente submetida.

* **Método:** `PATCH`
* **Rota:** `/grades/:id/grade`
* **Autenticação:** Exige Token JWT (Regra: `teacher`)

#### Exemplo de Body (JSON)
```json
{
  "score": 9.5,
  "feedback": "Excelente resolução dos exercícios!"
}
```

#### Resposta
* **`200 OK`**
```json
{
  "message": "Grade scored successfully"
}
```

---

### 8.4. Buscar Notas por Aluno
* **Método:** `GET`
* **Rota:** `/grades/student/:student_id`
* **Autenticação:** Exige Token JWT

#### Resposta
* **`200 OK`**
```json
[
  {
    "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "student_id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
    "activity_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
    "score": 9.5,
    "status": "graded",
    "submitted_at": "2026-09-07T14:30:00.000Z",
    "feedback": "Excelente resolução dos exercícios!"
  }
]
```

---

### 8.5. Buscar Notas por Atividade
* **Método:** `GET`
* **Rota:** `/grades/activity/:activity_id`
* **Autenticação:** Exige Token JWT

#### Resposta
* **`200 OK`**
```json
[
  {
    "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    "student_id": "c1f7a8e2-9b21-4d3f-8a5e-123456789abc",
    "activity_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
    "score": 9.5,
    "status": "graded",
    "submitted_at": "2026-09-07T14:30:00.000Z",
    "feedback": "Excelente resolução dos exercícios!"
  }
]
```
