# MSTL — reconstrução

Nova versão do SaaS multi-tenant baseada no escopo do repositório original.

## Estado atual

- Aplicação Next.js 16 com interface inicial em português.
- Cadastro e login por e-mail/senha com Better Auth.
- Login social opcional por Google, GitHub e Facebook, controlado por configuração de servidor.
- PostgreSQL conectado por Prisma ORM 7 e adapter `pg`.
- Validação de variáveis obrigatórias e flags OAuth durante a inicialização.
- Health check de prontidão em `/api/health`, com verificação do banco e `x-request-id` para correlação.
- Contrato OpenAPI inicial em `/openapi.yaml`.
- CI configurada para formatação, typecheck, testes, geração do Prisma Client e build.
- Sessão verificada no servidor na rota `/dashboard`.
- A migração inicial do banco ainda precisa ser aplicada a uma instância PostgreSQL.
- Organização, membros, projetos e recuperação de senha seguem como etapas seguintes.

## Requisitos

- Node.js 22.12 ou superior.
- pnpm 11 (definido no `package.json`).
- PostgreSQL 17 local ou uma URL PostgreSQL configurada.

## Configuração local

1. Copie `.env.example` para `.env`.
2. Configure `DATABASE_URL`, `BETTER_AUTH_URL` e `BETTER_AUTH_SECRET` (segredo aleatório com pelo menos 32 caracteres).
3. Inicie PostgreSQL. Se Docker Compose estiver disponível, use `docker compose up -d postgres`.
4. Instale dependências com `pnpm install`.
5. Gere e aplique a migração com `pnpm db:migrate --name init_auth`.
6. Inicie a aplicação com `pnpm dev` e abra `http://localhost:3000`.

### Ambientes e validação

`src/instrumentation.ts` valida `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` e flags dos provedores sociais ao iniciar a aplicação. Em desenvolvimento, staging e produção, configure esses valores no gerenciador de secrets do respectivo ambiente; não reutilize credenciais entre ambientes. O CI usa valores isolados de teste e não precisa de uma instância PostgreSQL para typecheck e build.

Use `pnpm db:migrate` para criar e aplicar migrações em desenvolvimento e `pnpm db:deploy` para aplicar migrações já versionadas em staging/produção. O health check `/api/health` retorna 200 quando o banco está acessível e 503 quando está indisponível.

O seed de dados de negócio fica para a fase de organizações e projetos: neste estágio o schema contém apenas identidade/autenticação, e não há dados de domínio úteis para popular. Contas locais devem ser criadas pelo fluxo de cadastro, sem credenciais demo embutidas.

### Login social (opcional)

Configure no `.env` as credenciais do provedor e defina `AUTH_GOOGLE_ENABLED="true"`, `AUTH_GITHUB_ENABLED="true"` ou `AUTH_FACEBOOK_ENABLED="true"`. O provedor só é ativado quando a flag e as duas credenciais estão presentes. Para desativar, mude a flag para `false` e reinicie/reimplante a aplicação; isso também remove o provedor dos endpoints de autenticação. Os segredos permanecem apenas no servidor.

Cadastre os callbacks OAuth no respectivo console do provedor:

- Google: `${BETTER_AUTH_URL}/api/auth/callback/google`.
- GitHub: `${BETTER_AUTH_URL}/api/auth/callback/github`.
- Facebook: `${BETTER_AUTH_URL}/api/auth/callback/facebook`.

Para desenvolvimento local, use `http://localhost:3000/api/auth/callback/google`, `http://localhost:3000/api/auth/callback/github` ou `http://localhost:3000/api/auth/callback/facebook`. A disponibilidade dos botões nas telas de acesso é calculada no servidor.

## Comandos úteis

- `pnpm auth:schema` atualiza o schema Prisma baseado nas opções de Better Auth.
- `pnpm db:generate` gera o cliente Prisma.
- `pnpm db:migrate --name nome_da_migracao` cria e aplica uma migração local.
- `pnpm typecheck` verifica os tipos TypeScript.
- `pnpm format:check` verifica formatação com Prettier.
- `pnpm test` executa os testes unitários nativos do Node.
- `pnpm db:deploy` aplica migrações versionadas em staging/produção.

## Segurança e escopo

- Cookies/sessões e verificação de credenciais são geridos pelo Better Auth.
- Senhas devem ter ao menos 12 caracteres.
- `.env` contém segredos locais e não deve ser versionado.
- A rota de dashboard consulta a sessão no servidor; ocultar links na interface não substitui a autorização do backend.
- Não há e-mail de verificação nem recuperação de senha configurados ainda.
- PostgreSQL é a fonte de persistência; a interface não usa dados falsos como se fossem persistidos.
- Billing permanece fora do MVP até aprovação das regras comerciais.

## Próxima etapa

Implementar organizações e memberships, tornar a organização o escopo obrigatório de toda consulta, e cobrir a proteção cross-tenant antes de criar projetos.
