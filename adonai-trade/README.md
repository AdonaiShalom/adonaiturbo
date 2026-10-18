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

Requer Node.js 22+. A partir desta pasta, execute `npm test` e depois `npm start`. O servidor escuta em `127.0.0.1:3100` por padrão. Endpoints: `GET /health`, `GET /ready`, `GET /api/v1/integrations`, `GET /api/v1/markets` e `POST /api/v1/policy/evaluate`. Não há adaptador de mercado nem envio de ordens.

O ledger usa o schema PostgREST `adonai_trade`. A migration `supabase/migrations/20261018100000_runtime_audit_events.sql` foi aplicada ao projeto Supabase conectado; a tabela existe com RLS habilitado, mas a contagem de eventos observada era zero. Isso **não** comprova uma gravação ponta a ponta do runtime. Configure `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` somente no ambiente privado do servidor; nunca publique a chave nem a envie ao navegador.

Sem ledger disponível, `/ready` permanece em HTTP 503 e a avaliação falha fechada em HTTP 503. Uma avaliação bem-sucedida registra somente uma decisão de política; nenhuma ordem é executada.

## Quatro mesas de mercado

`GET /api/v1/markets` lista Cripto, Forex, B3 e Internacional. Até que provedores sejam configurados e testados, cada mesa informa `quote_status: unavailable`, `provider_configured: false` e `execution_enabled: false`. Isso é um catálogo de capacidades, não um feed de cotações.

## Integrações LEVI e EU SOU

`GET /api/v1/integrations` expõe endpoints de configuração para LEVI e EU SOU, mas não os chama nem afirma conectividade. Configure `LEVI_ENDPOINT` e `EU_SOU_ENDPOINT` apenas no ambiente do servidor. Até um teste autenticado ponta a ponta, o status permanece `not_verified`; nenhuma integração habilita execução.

## Validação de entrada HTTP

O endpoint de avaliação limita corpos JSON a 64 KiB e responde HTTP 413 a corpos maiores. A suíte de regressão cobre esse limite e verifica que o servidor continua respondendo após rejeitar a requisição. A auditoria real, integrações autenticadas, feeds de mercado e integração visual na aba existente do Adonai Turbo continuam como gates separados.
