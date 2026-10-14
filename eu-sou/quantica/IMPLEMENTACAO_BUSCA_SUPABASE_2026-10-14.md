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

## Atualização de execução e reteste — 14/10/2026, 20:41 BRT
- Migrações de busca v1, v2 e v3 confirmadas no histórico do Supabase.
- Ingestão direta concluída de seis documentos integrais do GitHub: os cinco playbooks operacionais e o núcleo científico quântico/nanotecnológico.
- Inventário ativo confirmado: 31 trechos curados/revisados/validados; 11 `shared` e 4 em cada escopo empresarial (Turbo, Finanças, Lab, Marketing Digital e Trade), com cerca de 25,5 mil caracteres.
- Integridade: os seis documentos-fonte possuem hash MD5 consistente com o conteúdo armazenado e SHA do arquivo GitHub registrado em metadados.
- Regressão SQL repetida: consultas para física, nanotecnologia, Marketing, Finanças, Trade e Turbo retornaram resultados pertinentes; consultas vazia e desconhecida retornaram zero; limite máximo de 10 respeitado.
- Escopo empresarial: busca de Marketing no escopo Finanças não retorna registros etiquetados como Marketing. Um resultado `shared` genérico pode aparecer por desenho do contrato de compartilhamento; isso não é conteúdo empresarial de Marketing.
- Suíte de regressão salva em [TESTES_REGRESSAO_BUSCA_SUPABASE_2026-10-14.sql](https://github.com/AdonaiShalom/adonaiturbo/blob/main/eu-sou/quantica/TESTES_REGRESSAO_BUSCA_SUPABASE_2026-10-14.sql).
- Edge Function `eu-sou-knowledge-search` verificada como ACTIVE, versão 1, com `verify_jwt=true`. O código usa service-role no lado do servidor e não expõe a chave ao navegador.
- Ainda pendente: teste HTTP autenticado real da Edge Function e teste ponta a ponta com o LEVI local em `127.0.0.1:3000` e a biblioteca local em `127.0.0.1:8765`. Os conectores desta sessão não fornecem execução de shell nem acesso aos serviços localhost do PC, portanto não é possível alegar esses testes como executados.
- O repositório GitHub é um frontend Next.js e não contém os caminhos locais `backend/levi-core.js` e `backend/server.js` encontrados no PC. Nenhuma alteração de runtime foi feita remotamente para evitar modificar um projeto diferente ou quebrar a instalação local.
