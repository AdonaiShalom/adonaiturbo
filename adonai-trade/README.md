# Adonai Trade

Módulo independente de análise e operações de mercado do ecossistema Adonai.

## Execução local
- Servidor local: `http://127.0.0.1:3100/`
- O Adonai Turbo permanece na porta `3000`.
- Este módulo não deve ser misturado ao PSM Grupo Market.

## Segurança
- Não armazenar segredos, tokens ou chaves no repositório ou navegador.
- Credenciais ficam em variáveis de ambiente do servidor.
- Não conceder acesso público às tabelas de negociação.
- Não declarar integração ativa sem testar conexão, autenticação e leitura/escrita.
- Este runtime é somente leitura e modo paper; não envia ordens.

## Runtime HTTP
Requer Node.js 22+. Execute `npm test` e depois `npm start`. O servidor escuta em `127.0.0.1:3100` por padrão. Endpoints: `GET /health`, `GET /ready`, `GET /api/v1/integrations`, `GET /api/v1/markets`, `GET /api/v1/markets/quote?desk=CRYPTO&symbol=BTCUSDT` e `POST /api/v1/policy/evaluate`.

O ledger usa o schema PostgREST `adonai_trade`. A migration `supabase/migrations/20261018100000_runtime_audit_events.sql` foi aplicada ao projeto Supabase conectado; a tabela existe com RLS habilitado. A última consulta de verificação encontrou zero eventos, portanto ainda não há prova de gravação ponta a ponta pelo runtime. Configure `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` somente no ambiente privado do servidor; nunca publique a chave nem a envie ao navegador.

Sem ledger disponível, `/ready` permanece em HTTP 503 e a avaliação falha fechada em HTTP 503. Uma avaliação bem-sucedida registra somente uma decisão de política; nenhuma ordem é executada.

## Smoke test explícito da auditoria real
O script `scripts/verify-audit-live.cjs` faz uma gravação `no_order` de teste e lê o mesmo evento de volta usando a chave de serviço no ambiente privado. Ele não envia ordens, mas cria um registro permanente append-only. Para executá-lo deliberadamente, com credenciais já configuradas no servidor:
```sh
ADONAI_TRADE_CONFIRM_LIVE_AUDIT=YES npm run verify:audit:live
```
No Windows PowerShell:
```powershell
$env:ADONAI_TRADE_CONFIRM_LIVE_AUDIT = 'YES'
npm.cmd run verify:audit:live
Remove-Item Env:ADONAI_TRADE_CONFIRM_LIVE_AUDIT
```
O comando exige confirmação explícita e imprime somente o status e o identificador do evento. Não execute no computador compartilhado e não cole a chave em terminal gravado, chat, navegador ou log. O script não foi executado nesta sessão porque as credenciais privadas do runtime não estão disponíveis aqui.

## Adaptadores de cotações (somente leitura)
- Cripto: Binance Spot 24h; usa o horário de fechamento do último negócio e rejeita dados fora da janela de 120 segundos.
- Forex: Frankfurter / referência do BCE; é uma taxa de referência diária, não cotação intradiária. Dados fora da janela são marcados como `stale`.
- B3: Brapi; requer `BRAPI_TOKEN` privado e um timestamp de mercado recente.
- Internacional: Alpha Vantage; requer `ALPHAVANTAGE_API_KEY`. A resposta Global Quote não fornece timestamp intradiário confiável, então o adaptador a marca `unverified` em vez de fingir que é cotação atual.

Endpoint `GET /api/v1/markets/quote?desk=...&symbol=...` retorna `verified`, `stale`, `unverified` ou `unavailable`. Resposta indisponível usa HTTP 503. Todas as respostas indicam `mode: read_only` e `execution_enabled: false`. Chaves não configuradas, símbolos inválidos, falhas do provedor e timestamps ausentes são tratados explicitamente. O adaptador cancela requisições após 5 segundos e limita corpos de resposta a 1 MiB, incluindo validação antes de acumular respostas em streaming. O endpoint público de consulta também aplica limite em memória de 30 pedidos por minuto por endereço de cliente, devolvendo HTTP 429 e `Retry-After` quando excedido. O endpoint de avaliação de políticas, que pode escrever na auditoria persistente, aplica um limite separado de 20 pedidos por minuto por endereço de cliente, também antes da gravação. Este limitador local é adequado apenas a uma única instância; deployments multi-instância devem usar um limitador partilhado.

## Quatro mesas
`GET /api/v1/markets` lista Cripto, Forex, B3 e Internacional. A existência de um adaptador não significa que a credencial esteja configurada nem que o provedor tenha sido validado ao vivo. Testes automatizados usam respostas simuladas e não provam conectividade externa.

## Integrações LEVI e EU SOU
`GET /api/v1/integrations` expõe configuração para LEVI e EU SOU, mas não os chama nem afirma conectividade. Configure `LEVI_ENDPOINT` e `EU_SOU_ENDPOINT` apenas no ambiente do servidor. Até um teste autenticado ponta a ponta, o status permanece `not_verified`.

## Gates ainda pendentes
Gravação real da auditoria pelo runtime e confirmação do evento no Supabase; teste externo dos provedores com credenciais privadas; integrações autenticadas LEVI/EU SOU; e integração visual na aba existente do Adonai Turbo. A interface 3D não está incluída neste runtime e nenhuma ordem real pode ser executada.
