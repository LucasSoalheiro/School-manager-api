# Relatório de Auditoria e Inconsistências — School Manager

Este documento apresenta uma análise técnica completa do projeto **School Manager**, englobando o backend (**School-manager-api** em Node.js / TypeScript / Fastify / Drizzle ORM) e o frontend móvel (**School-manager-mobile** em Flutter / Dart).

---

## 1. Visão Geral e Matriz de Inconsistências

Durante a varredura profunda de código, contratos de rede, banco de dados, regras de negócio e documentação, foram identificadas **22 inconsistências e problemas**, categorizados por nível de criticidade:

| Criticidade | Quantidade | Principais Impactos |
|---|:---:|---|
| 🔴 **Crítica** | 7 | Crash em tempo de execução no app, quebra de inicialização da API, falha no pub get, navegação para telas incorretas |
| 🟠 **Alta** | 6 | Dados essenciais não exibidos (turmas sem atividades, boletim sem nome de turma/atividade), ausência de geração de notas, IDOR de submissão/nota |
| 🟡 **Média** | 5 | Restrições incorretas de ambiente (porta fixa em 4 dígitos, sem `.env`), validações conflitantes de senha, N+1 no banco e na rede |
| 🔵 **Baixa** | 4 | Rotas e modelos órfãos (Subject), documentação com comandos e senhas inválidas, script de teste inexistente |

---

## 2. Inconsistências Críticas (Erros em Tempo de Execução e Quebras)

### 2.1. [CRÍTICA] Crash no Mobile ao Submeter Atividade (`Null check operator used on a null value`)
- **Arquivo afetado:** [`student_activities_tab.dart`](./School-manager-mobile/lib/presentation/features/student/student_activities_tab.dart#L113-L125)
- **Problema:** Na listagem de atividades pendentes, o código filtra atividades sem registro prévio de nota usando `if (grade == null) return status == 'pending';`. Porém, ao clicar no botão "Entregar", o código executa `widget.viewModel.submitActivity(grade!.id)`. Como `grade` é `null`, o Dart dispara `NullThrownError`, causando a tela vermelha de erro (crash) imediata.
- **Passos para Resolver:**
  1. No backend, garantir a criação automática de registros de `grade` pendente ao publicar atividades e ao matricular novos alunos (ver item 2.6).
  2. No app mobile, tratar a ausência de grade antes do `submitActivity`, bloqueando o clique ou chamando um fluxo de auto-atribuição/submissão por `activityId`.

---

### 2.2. [CRÍTICA] Navegação Incorreta no Dashboard do Aluno (Off-by-One Error)
- **Arquivo afetado:** [`student_home_screen.dart`](./School-manager-mobile/lib/presentation/features/student/student_home_screen.dart#L50-L52)
- **Problema:** A `StudentHomeScreen` passa `onTabChange: (i) => _onTabChanged(i + 1)`. No entanto, os cartões em [`student_dashboard_tab.dart`](./School-manager-mobile/lib/presentation/features/student/student_dashboard_tab.dart#L104-L129) já passam os índices reais exatos (1 para Turmas, 2 para Atividades, 3 para Boletim).
- **Impacto:** O aluno clica em "Turmas Ativas" e vai para "Atividades"; clica em "A Fazer" e vai para "Boletim"; clica em "Média de Notas" e cai em "Perfil".
- **Passos para Resolver:**
  1. Alterar em `student_home_screen.dart`:
     ```dart
     // De:
     onTabChange: (i) => _onTabChanged(i + 1),
     // Para:
     onTabChange: (i) => _onTabChanged(i),
     ```

---

### 2.3. [CRÍTICA] Conflito de Versão do Dart SDK no Mobile (`pubspec.yaml`)
- **Arquivo afetado:** [`pubspec.yaml`](./School-manager-mobile/pubspec.yaml#L21-L22)
- **Problema:** O arquivo especificava `sdk: ^3.13.2`, enquanto a instalação padrão atual do Flutter Stable 3.47.1 utiliza o Dart SDK 3.13.1. Isso impedia a execução de `flutter pub get` e testes.
- **Passos para Resolver:**
  1. Manter a restrição relaxada e compatível:
     ```yaml
     environment:
       sdk: '>=3.13.0 <4.0.0'
     ```

---

### 2.4. [CRÍTICA] Atividades e Alunos Nunca Aparecem na Aba do Professor
- **Arquivos afetados:**
  - Backend: [`teacherController.ts`](./School-manager-api/src/http/controller/teacherController.ts#L45-L58) e [`DrizzleTeacherRepository.ts`](./School-manager-api/src/database/drizzle/repository/DrizzleTeacherRepository.ts#L33-L39)
  - Mobile: [`teacher_view_model.dart`](./School-manager-mobile/lib/presentation/features/teacher/teacher_view_model.dart#L44-L48) e [`teacher_classes_tab.dart`](./School-manager-mobile/lib/presentation/features/teacher/teacher_classes_tab.dart#L288-L345)
- **Problema:** O `TeacherViewModel.loadData()` carrega as turmas do professor a partir de `profileRepository.getProfile(teacherId, role: 'teacher')` (`GET /teachers/:id`). Na API, a rota serializa apenas `{ id, class_name, is_active }` sem carregar as atividades e os alunos vinculados.
- **Impacto:** O professor cria atividades com sucesso, mas elas somem da tela ("0 alunos • 0 atividades"), gerando a impressão de que a criação falhou.
- **Passos para Resolver:**
  1. Criar na API uma rota dedicada `GET /teachers/:id/classes` ou enriquecer o retorno de `GET /teachers/:id` carregando os relacionamentos com `loadClassRelations` do repositório de turmas.
  2. Alternativamente, no `TeacherViewModel.loadData()`, buscar os detalhes completos de cada turma chamando `schoolClassRepository.getClassById(classId)` (assim como o `StudentViewModel` já faz).

---

### 2.5. [CRÍTICA] Boletim do Aluno Exibe "Turma desconhecida" e "Atividade: ---"
- **Arquivos afetados:**
  - Backend: [`gradeController.ts`](./School-manager-api/src/http/controller/gradeController.ts#L55-L74)
  - Mobile: [`grade_model.dart`](./School-manager-mobile/lib/data/models/grade_model.dart#L55-L65) e [`student_grades_tab.dart`](./School-manager-mobile/lib/presentation/features/student/student_grades_tab.dart#L44-L70)
- **Problema:** A rota `GET /grades/student/:student_id` retorna somente os campos brutos da tabela `grade` (`activity_id`, `score`, `status`, etc.). `GradeModel` não desserializa informações de título nem de turma. No Flutter, o boletim agrupa por `grade.schoolClass?.name ?? 'Turma desconhecida'` e exibe `grade.activity?.title ?? '---'`.
- **Impacto:** Qualquer nota recebida pelo aluno é exibida sem identificação de qual disciplina ou trabalho se trata.
- **Passos para Resolver:**
  1. Na API, criar uma query de join entre `grade`, `activity` e `school_class`, retornando `activity_title` e `class_name`.
  2. No Flutter, incluir esses campos em `GradeModel` e mapeá-los para `GradeEntity`.

---

### 2.6. [CRÍTICA] Desconexão de Negócio: Atividades Publicadas sem Instâncias de Notas
- **Arquivos afetados:** [`AddActivityToClassService.ts`](./School-manager-api/src/service/school_class/AddActivityToClassService.ts) e [`AddStudentToClassService.ts`](./School-manager-api/src/service/school_class/AddStudentToClassService.ts)
- **Problema:** Na arquitetura desenhada, o fluxo de entregas depende de um registro na tabela `grade` com status `pending`. No entanto, ao criar uma atividade, apenas a tabela `activity` recebe um registro. O endpoint `POST /grades/assign` existe, mas nunca é chamado automaticamente nem pela API nem pelo app.
- **Passos para Resolver:**
  1. Alterar `AddActivityToClassService` para buscar todos os alunos matriculados ativos na turma e criar registros de `grade` com `status: "pending"` para cada um.
  2. Alterar `AddStudentToClassService` para criar registros de `grade` com `status: "pending"` para todas as atividades já existentes naquela turma ao matricular um novo aluno.

---

### 2.7. [CRÍTICA] Falta de Inicialização de Variáveis de Ambiente no Backend
- **Arquivos afetados:** [`main.ts`](./School-manager-api/src/main.ts#L11-L16) e [`package.json`](./School-manager-api/package.json#L9-L13)
- **Problema:** A API lê as configurações de `process.env` no arquivo [`env.ts`](./School-manager-api/src/config/env.ts), porém não importa `dotenv/config` nem utiliza a flag nativa `--env-file=.env` no script `"start": "node ./out/main.js"`.
- **Impacto:** O comando `npm start` quebra imediatamente com `Error: NODE_ENV not found in environment`.
- **Passos para Resolver:**
  1. Adicionar `node --env-file=.env ./out/main.js` no script `"start"` do `package.json`, ou importar `import "dotenv/config";` no topo do arquivo `src/config/env.ts`.

---

## 3. Inconsistências de Segurança & Autorização

### 3.1. [ALTA] Vulnerabilidades de IDOR (Insecure Direct Object Reference)
- **Falha 1 — Submissão de Notas:** [`SubmitGradeService.ts`](./School-manager-api/src/service/grade/SubmitGradeService.ts#L11-L24). Qualquer usuário logado como `student` pode alterar a submissão de qualquer outro estudante apenas fornecendo o `grade_id`.
  - **Correção:** Validar `if (grade.student_id !== request.user.id) throw new ForbiddenError(...)`.
- **Falha 2 — Lançamento de Notas:** [`GradeActivityService.ts`](./School-manager-api/src/service/grade/GradeActivityService.ts#L14-L27). Qualquer professor pode atribuir notas a submissões de turmas que pertencem a outros professores.
  - **Correção:** Obter a turma da atividade vinculada e garantir que o `teacher_id` é o `request.user.id`.
- **Falha 3 — Gerenciamento de Turmas:** Qualquer professor pode fechar (`/classes/:id/close`), reabrir (`/classes/:id/reopen`) ou desmatricular alunos de turmas criadas por outros docentes.

---

### 3.2. [ALTA] Falha no Encadeamento de Middlewares Fastify (`Double Reply Send`)
- **Arquivo afetado:** [`authMiddleware.ts`](./School-manager-api/src/http/middlewares/authMiddleware.ts#L10-L33)
- **Problema:** Em rotas com `{ onRequest: [authenticate, authorize(["teacher"])] }`, se o token for inválido, `authenticate` envia um 401 via `reply.status(401).send(...)`. No entanto, como o hook não interrompe o pipeline síncrono lançando um erro, o segundo hook `authorize` executa logo em seguida. Como `request.user` é nulo, ele tenta enviar um segundo reply `reply.status(403).send(...)`, disparando o erro interno `FST_ERR_REP_ALREADY_SENT`.
- **Passos para Resolver:**
  1. Utilizar `return reply.status(401).send(...)` ou lançar `throw new UnauthorizedError(...)` no catch de `authenticate`.

---

### 3.3. [ALTA] Sessão Zumbi no App Mobile após Expiração de Token JWT
- **Arquivo afetado:** [`api_client.dart`](./School-manager-mobile/lib/core/network/api_client.dart#L177-L208)
- **Problema:** Quando a API retorna status `401 Unauthorized`, o `ApiClient` apenas lança uma `ApiException`. Ele não limpa o armazenamento local (`SessionStorage.clearSession()`) nem notifica o `AuthViewModel`. O aplicativo permanece logado e todas as ações seguintes falham sucessivamente com erro genérico.
- **Passos para Resolver:**
  1. Injetar um callback ou evento de logout no `ApiClient` para limpar a sessão e redirecionar automaticamente para o `LoginScreen` ao interceptar código 401.

---

## 4. Inconsistências de Validação, Banco de Dados & Performance

### 4.1. [MÉDIA] Conflito Severo nas Regras de Validação de Senha
- **Backend Domain:** [`password.ts`](./School-manager-api/src/entity/value_object/password.ts#L8-L16) exige: `>= 5 caracteres`, pelo menos 1 dígito (`0-9`) e pelo menos 1 caractere especial (`@$!%*?&`).
- **Backend Zod Schema:** [`studentSchemas.ts`](./School-manager-api/src/http/schemas/studentSchemas.ts#L7) e [`teacherSchemas.ts`](./School-manager-api/src/http/schemas/teacherSchemas.ts#L7) exigem apenas `z.string().min(6)`.
- **Mobile Frontend:** [`register_screen.dart`](./School-manager-mobile/lib/presentation/features/auth/register_screen.dart#L223) valida apenas `val.length >= 6`.
- **Documentação:** Tanto o [`API_DOCUMENTATION.md`](./School-manager-api/API_DOCUMENTATION.md#L43) quanto o [`QUICK_START_GUIDE.md`](./School-manager-mobile/QUICK_START_GUIDE.md#L53) colocam exemplos de senhas sem caracteres especiais (`senhaSegura123`, `senha123`).
- **Impacto:** O usuário cadastra uma senha válida no formulário do app, o Zod aceita, mas a entidade de domínio rejeita e o backend devolve status HTTP 500!
- **Passos para Resolver:**
  1. Alinhar a regex de validação em todas as pontas (Flutter UI, Zod Schema e VO Domain) ou simplificar a regra de domínio para validar apenas tamanho mínimo caso não seja obrigatório exigir caracteres especiais.
  2. Ajustar os exemplos nas documentações para cumprirem a regra adotada.

---

### 4.2. [MÉDIA] Erros de Regra de Negócio Retornando HTTP 500 (Internal Server Error)
- **Problema:** Entidades como `Student.create`, `Teacher.create`, `School_class.create` e `Password.create` lançam `throw new Error("...")`.
- No manipulador de erros do Fastify ([`main.ts`](./School-manager-api/src/main.ts#L44-L57)), somente instâncias de `AppError` e `ZodError` recebem status 400. Erros de `Error` padrão recebem `statusCode || 500`.
- **Impacto:** Tentativa de cadastro com nome curto ou senha sem número retorna HTTP 500 ao invés de HTTP 400.
- **Passos para Resolver:**
  1. Criar erros de domínio especializados que estendam `BadRequestError` ou converter erros de validação de domínio em `BadRequestError`.

---

### 4.3. [MÉDIA] Restrição Artificial e Arbitrária de Porta na API
- **Arquivo afetado:** [`env.ts`](./School-manager-api/src/config/env.ts#L27-L29)
- **Problema:**
  ```typescript
  if (env.PORT.length != 4) {
    throw new Error("PORT can only have four digits. Ex: 3000, 8080, 1234");
  }
  ```
- **Impacto:** Quebra deploy em portas padrão de produção como 80 (HTTP) e 443 (HTTPS), e em portas de 5 dígitos alocadas dinamicamente em serviços como Render, Heroku ou Fly.io.
- **Passos para Resolver:**
  1. Remover a restrição de tamanho de string e validar apenas como número inteiro entre 1 e 65535:
     ```typescript
     const port = parseInt(env.PORT, 10);
     if (isNaN(port) || port < 1 || port > 65535) {
       throw new Error("PORT must be a valid port number between 1 and 65535");
     }
     ```

---

### 4.4. [MÉDIA] Ausência de Índices e Restrições Únicas no Banco de Dados
- **Arquivo afetado:** [`migration.sql`](./School-manager-api/drizzle/20260906211058_tiresome_risque/migration.sql)
- **Problemas:**
  - A tabela `enrollment` não possui constraint `UNIQUE(student_id, school_class_id)`.
  - A tabela `grade` não possui constraint `UNIQUE(student_id, activity_id)`.
  - Nenhuma das foreign keys possui índice (`student_id`, `school_class_id`, `teacher_id`, `activity_id`).
- **Impacto:** Concorrência pode gerar duplicidades de matrículas e notas, e todas as consultas por foreign key executam full table scans.
- **Passos para Resolver:**
  1. Adicionar índices compostos e constraints únicas nos schemas do Drizzle e gerar nova migration com `npx drizzle-kit generate`.

---

### 4.5. [MÉDIA] Gargalo Crítico de Performance por Consultas N+1
- **Backend:** [`DrizzleTeacherRepository.findAll()`](./School-manager-api/src/database/drizzle/repository/DrizzleTeacherRepository.ts#L95-L108) executa um loop com uma consulta SQL individual para cada professor existente.
- **Frontend:** [`grade_repository_impl.dart`](./School-manager-mobile/lib/data/repositories/grade_repository_impl.dart#L53-L77) em `getGradesByTeacher` faz requisições HTTP aninhadas: 1 busca do professor + 1 busca por turma + 1 busca por atividade para carregar as notas pendentes.
- **Passos para Resolver:**
  1. Criar na API um endpoint único `GET /teachers/:id/pending-grades` que retorne em uma única query com JOIN todas as submissões pendentes de avaliação para as turmas do professor.

---

## 5. Inconsistências de Funcionalidades, Telas e Documentação

### 5.1. [BAIXA] Edição de Perfil de Professor Falsamente Bloqueada no App
- **Arquivo afetado:** [`profile_screen.dart`](./School-manager-mobile/lib/presentation/features/profile/profile_screen.dart#L90-L100)
- **Problema:** A interface do app exibe a mensagem `'Edição de perfil para professores não suportada na API'` e oculta os formulários para professores. Porém, na API, as rotas `PATCH /teachers/:id/name` e `PATCH /teachers/:id/password` estão 100% implementadas e funcionais.
- **Passos para Resolver:**
  1. Adicionar `updateTeacherName` e `updateTeacherPassword` no `RemoteDataSource` e `ProfileRepositoryImpl`.
  2. Habilitar a exibição dos formulários de alteração de nome e senha para ambos os papéis em `profile_screen.dart`.

---

### 5.2. [BAIXA] Impossibilidade Prática de Alunos Serem Matriculados em Turmas
- **Problema:** Não existe rota `GET /students` na API para listar alunos cadastrados, e não existe interface no app do professor para vincular alunos a turmas. O aluno recém-cadastrado fica sem turmas indefinidamente.
- **Passos para Resolver:**
  1. Expor `GET /students` com paginação e busca por nome/email (protegido para professores).
  2. Adicionar na tela de turmas do professor uma ação para matricular alunos pesquisando por nome ou e-mail.
  3. Alternativamente, criar um sistema de código de turma (ex: "MAT101-X7") para que o próprio aluno se auto-matricule digitando o código.

---

### 5.3. [BAIXA] Rota Órfã de Disciplinas (`Subject`)
- **Problema:** `ApiConstants.subjectById(id)` aponta para `/subjects/$id`. No entanto, na API essa rota não existe (existem apenas `POST /subjects`, `PUT /subjects/:id` e `GET /subjects/class/:class_id`). Além disso, não há tela no app para disciplinas.
- **Passos para Resolver:**
  1. Ou remover a constante não utilizada de `ApiConstants.dart` e os modelos órfãos, ou implementar os endpoints e telas de disciplinas se forem escopo do projeto.

---

### 5.4. [BAIXA] Script de Testes Inválido no Backend
- **Arquivo afetado:** [`package.json`](./School-manager-api/package.json#L12)
- **Problema:** `"test": "test"`. Executar `npm test` falha com erro de comando não encontrado.
- **Passos para Resolver:**
  1. Configurar Vitest (`npm i -D vitest`) e definir `"test": "vitest run"`.

---

## 6. Guia Prático Passo a Passo para Correção Integral

### Passo 1: Corrigir o App Mobile (Correções Imediatas)
1. **Navegação do Dashboard (`student_home_screen.dart`):**
   Substituir a linha 51 por:
   ```dart
   StudentDashboardTab(
     viewModel: _viewModel,
     onTabChange: (i) => _onTabChanged(i),
   ),
   ```
2. **Crash na Entrega (`student_activities_tab.dart`):**
   Adicionar salvaguarda na submissão:
   ```dart
   onPressed: () async {
     if (grade == null) {
       ScaffoldMessenger.of(context).showSnackBar(
         const SnackBar(content: Text('Atividade ainda não habilitada para entrega.')),
       );
       return;
     }
     final success = await widget.viewModel.submitActivity(grade.id);
     // ...
   }
   ```
3. **Alinhamento do SDK no `pubspec.yaml`:**
   ```yaml
   environment:
     sdk: '>=3.13.0 <4.0.0'
   ```

---

### Passo 2: Corrigir o Backend API
1. **Inicialização do Ambiente (`package.json`):**
   ```json
   "scripts": {
     "build": "npx tsc --build",
     "start": "node --env-file=.env ./out/main.js",
     "dev": "node --env-file=.env --watch ./out/main.js",
     "test": "vitest run"
   }
   ```
2. **Remover Validação de Tamanho de Porta (`src/config/env.ts`):**
   ```typescript
   const portNumber = parseInt(env.PORT, 10);
   if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
     throw new Error("PORT must be a valid number between 1 and 65535");
   }
   ```
3. **Parar Encadeamento no Middleware de Autenticação (`src/http/middlewares/authMiddleware.ts`):**
   ```typescript
   export async function authenticate(
     request: FastifyRequest,
     reply: FastifyReply,
   ): Promise<void> {
     try {
       await request.jwtVerify();
     } catch (err) {
       return reply.status(401).send({
         error: "Unauthorized",
         message: "Invalid or missing JWT token",
       });
     }
   }
   ```
4. **Auto-atribuição de Notas nas Atividades (`AddActivityToClassService.ts`):**
   Ao criar a atividade, iterar sobre os alunos da classe e persistir um `Grade` pendente para cada um usando `Grade.create(student, activity)`.
5. **Enriquecer Dados do Boletim (`gradeController.ts`):**
   Fazer JOIN entre `grade`, `activity` e `school_class` para retornar `activity_title` e `class_name` no endpoint `GET /grades/student/:student_id`.

---

## 7. Sugestões de Melhorias Arquiteturais e de Produto

1. **Auto-matrícula via Código de Convite:**
   - Adicionar à tabela `school_class` uma coluna `code varchar(8) UNIQUE` gerada automaticamente (ex: `MAT-4821`).
   - Permitir que o aluno insira o código na tela "Minhas Turmas" para se matricular de forma autônoma.
2. **Endpoint Agregado para Dashboard do Docente:**
   - Criar `GET /teachers/:id/dashboard` retornando contadores de turmas, alunos e a lista de submissões pendentes já preenchidas com nomes de aluno e títulos de atividade.
   - Isso elimina dezenas de requisições HTTP em cascata e melhora dramaticamente a velocidade do app.
3. **Tratamento Global de Sessão Expirada (401 Interceptor):**
   - No `ApiClient` do Flutter, implementar um listener de autorização para disparar logout automático caso qualquer requisição retorne 401.
4. **Suíte de Testes Automatizados:**
   - Adicionar testes de integração no backend com `supertest` cobrindo fluxos de login, cadastro, publicação de atividade e atribuição de nota.
   - Adicionar testes de ViewModel no Flutter cobrindo as transições de estado do `StudentViewModel` e `TeacherViewModel`.
5. **Transições de Telas com IndexedStack:**
   - Nas telas `StudentHomeScreen` e `TeacherHomeScreen`, utilizar `IndexedStack` no corpo do `Scaffold` para preservar o estado de rolagem e dados já carregados ao alternar entre as abas.
