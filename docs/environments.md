# Ambientes

O projeto mantém desenvolvimento, staging e produção separados por configuração e credenciais. Não copie `.env` de um ambiente para outro e nunca versiona valores reais de secrets.

## Desenvolvimento

- Use `.env.example` como base para criar `.env`.
- Aponte `DATABASE_URL` para uma instância PostgreSQL local iniciada por `docker compose up -d postgres`.
- Use credenciais OAuth de desenvolvimento e callbacks com `http://localhost:3000`.
- Gere um `BETTER_AUTH_SECRET` exclusivo com pelo menos 32 caracteres.
- Aplique migrações novas com `pnpm db:migrate --name nome_da_migracao`.

## Staging

- Crie banco e credenciais exclusivos para staging no provedor escolhido.
- Cadastre `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` e credenciais OAuth no secret manager do deploy.
- Use uma aplicação OAuth de staging, com callbacks apontando para a URL HTTPS de staging.
- Aplique somente migrações versionadas com `pnpm db:deploy` durante o deploy.
- Não use dados pessoais reais; use contas de teste controladas.

## Produção

- Crie banco, aplicação OAuth e secrets exclusivos de produção; não reutilize os valores de staging.
- Restrinja acesso administrativo ao secret manager e ative criptografia, backups e alertas do provedor.
- Configure `DATABASE_URL`, `BETTER_AUTH_URL` HTTPS e `BETTER_AUTH_SECRET` forte no ambiente do serviço.
- Cadastre callbacks OAuth apenas para o domínio de produção.
- Aplique migrações versionadas com `pnpm db:deploy` em janela controlada e acompanhe health check e logs.
- Não execute `pnpm db:migrate` nem qualquer seed de desenvolvimento em produção.

## Variáveis obrigatórias e opcionais

| Variável                        | Obrigatória    | Observação                                                        |
| ------------------------------- | -------------- | ----------------------------------------------------------------- |
| `DATABASE_URL`                  | Sim            | Conexão PostgreSQL específica do ambiente.                        |
| `BETTER_AUTH_URL`               | Sim            | URL base HTTPS fora do desenvolvimento local.                     |
| `BETTER_AUTH_SECRET`            | Sim            | Segredo diferente em cada ambiente, com pelo menos 32 caracteres. |
| `AUTH_<PROVIDER>_ENABLED`       | Não            | Flag de ativação do provedor social; padrão desativado.           |
| `AUTH_<PROVIDER>_CLIENT_ID`     | Quando ativado | Credencial pública OAuth, definida no servidor.                   |
| `AUTH_<PROVIDER>_CLIENT_SECRET` | Quando ativado | Secret OAuth guardado somente no secret manager.                  |

O CI usa credenciais descartáveis e seu próprio PostgreSQL de serviço. Os ambientes de staging e produção só poderão ser provisionados depois da escolha do provedor de deploy e do banco gerenciado.
