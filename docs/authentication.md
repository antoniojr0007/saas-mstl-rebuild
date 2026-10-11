# Autenticação e conta

## Funcionalidades disponíveis

- Cadastro e login com e-mail e senha via Better Auth.
- Login social opcional por Google, GitHub e Facebook; disponibilidade depende das flags e credenciais de servidor configuradas.
- Rotas do painel e perfil verificam a sessão no servidor.
- Perfil permite atualizar o nome e alterar a senha. A troca da senha exige a senha atual e encerra outras sessões.
- Rate limit persistido no PostgreSQL: até 5 tentativas de login e 3 cadastros por IP a cada 60 segundos; limite geral de 30 requisições por IP no mesmo período.

## Banco de dados

A tabela `rateLimit` armazena os contadores de rate limit. A migração `20261011_auth_rate_limit` deve ser aplicada em cada ambiente antes de habilitar esta versão (`pnpm db:deploy`). O workflow de CI aplica as migrações antes das verificações.

## Itens pendentes da Fase 2

- Recuperação e verificação de e-mail precisam de um provedor transacional e de um remetente verificado. Não registrar tokens de recuperação nos logs.
- Testar os fluxos OAuth reais com as URLs de callback e credenciais de cada provedor.
- Adicionar cobertura automatizada para caminhos de sucesso, falha e rate limit.
- Considerar limpeza operacional dos contadores expirados e confirmar limites para ambientes com múltiplas instâncias.

Os limites atuais são uma configuração inicial. Ajustá-los conforme telemetria e regras de negócio, sem desabilitar proteção em produção.
