# EU SOU — Busca científica via Supabase Edge Function

Data: 2026-10-14

## O que foi executado
- Criada a tabela `eu_sou.knowledge_chunks` com escopo por empresa, domínio, texto, fonte, hash e estado de revisão.
- Criados índices de pesquisa textual e a função SQL `eu_sou.search_knowledge(query, company_scope, limit)`.
- Inseridos 12 trechos curados iniciais: fundamentos de estados/medição, oscilador harmônico, decoerência, pontos quânticos/materiais 2D, DFT, transporte, sensores/metrologia e playbooks para Turbo, Marketing, Finanças, Lab e Trade.
- Criados 3 benchmarks em estado `draft`.
- Publicada a Edge Function `eu-sou-knowledge-search`, estado ACTIVE, versão 1, com `verify_jwt=true`.

## Contrato HTTP
`POST /functions/v1/eu-sou-knowledge-search`
Body: `{"query":"energia do oscilador harmônico","company_scope":"adonai-lab","limit":5}`
Headers: JWT de usuário autorizado, `apikey` e `Content-Type: application/json`.

Escopos permitidos: `adonai-turbo`, `adonai-marketing-digital`, `adonai-financas`, `adonai-lab`, `adonai-trade`; a busca também considera conteúdo `shared`. Não desativar verificação JWT nem embutir service-role key no browser/LEVI frontend.

## Validação
- Confirmado: migration aplicada.
- Confirmado: 12 trechos inseridos; 6 escopos distintos contando `shared`.
- Confirmado: 3 benchmarks em estado `draft`.
- Confirmado: Edge Function criada e ativa com JWT obrigatório.
- Pendente: teste HTTP autenticado da Edge Function, testes de relevância e latência, e integração do backend local LEVI em `:3000`.
- Pendente: ingestão/sincronização automática do GitHub para o índice local. O catálogo Supabase contém texto curado independente; não afirma sincronização automática do conteúdo GitHub.
- Pendente: revisão científica formal das 12 unidades de conhecimento.

## Próxima implementação obrigatória
O backend Node local deve chamar a Edge Function usando credencial de servidor guardada em `backend/.env` e nunca exposta ao navegador. Recomendação: endpoint interno autenticado, timeout curto, escopo empresarial obrigatório, anexar apenas trechos retornados ao contexto do LEVI e registar fonte, rank, latência e abstinência. Antes de editar `backend/levi-core.js` ou `backend/server.js`, verificar os caminhos reais do repositório local e comparar com o GitHub; os caminhos `backend/...` consultados no repositório público não foram encontrados, portanto não foi alterado código de runtime.

## Limitação operacional
A Edge Function e a base remota foram alteradas diretamente. Esta sessão não tem shell no PC do usuário nem consegue chamar `localhost:3000` ou `127.0.0.1:8765`. Logo, ainda não é honesto declarar que LEVI já usa a busca remota em operação.