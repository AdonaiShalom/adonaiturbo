# Adonai Trade

Módulo independente de análise e operações de mercado do ecossistema Adonai.

## Execução local
- Servidor local: `http://127.0.0.1:3100/`
- O Adonai Turbo permanece na porta `3000`.
- Este módulo não deve ser misturado ao PSM Grupo Market.

## Integrações planejadas / a validar
- GitHub: versionamento do código deste módulo.
- Supabase: schema privado `adonai_trade` no projeto Supabase `adonaiturbo`.
- EU SOU: consumir conhecimento e recomendações científicas por contrato de API explícito.
- LEVI: receber solicitações/orquestração por endpoint autenticado e auditável.

## Regras de segurança
- Não armazenar segredos, tokens ou chaves neste repositório.
- Credenciais ficam em variáveis de ambiente do servidor.
- Não conceder acesso público às tabelas de negociação.
- Não declarar uma integração ativa até testar conexão, autenticação e leitura/escrita.


## Runtime HTTP inicial (modo paper)

Requer Node.js 22+. A partir desta pasta, execute `npm test` e depois `npm start`. O servidor escuta em `127.0.0.1:3100` por padrão. Endpoints: `GET /health`, `GET /ready` e `POST /api/v1/policy/evaluate`. Não há adaptador de mercado nem envio de ordens.

O ledger usa o schema PostgREST `adonai_trade`. As configurações de conexão devem existir apenas no ambiente privado do servidor. A migration `supabase/migrations/20261018100000_runtime_audit_events.sql` ainda não foi aplicada ao projeto conectado. Não considerar a integração operacional até testar /ready e confirmar uma gravação real no ambiente alvo.

Sem ledger disponível, `/ready` permanece em HTTP 503 e a avaliação falha fechada em HTTP 503. Nenhuma ordem é executada.
