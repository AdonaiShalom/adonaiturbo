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


## Atualização de regressão — 14/10/2026, 20:41 BRT
- Acervo confirmado por SQL: 31 trechos ativos, distribuídos em 11 `shared` e 4 por escopo de empresa; conteúdo total armazenado aproximado de 25.468 caracteres.
- Seis documentos-fonte integrais (cinco playbooks e o núcleo científico) foram obtidos do GitHub e gravados com URL, SHA de origem, versão e hash MD5. Verificação direta retornou `hash_ok=true` para todos os seis.
- Migrações v1, v2 e v3 aparecem no histórico real do Supabase.
- Matriz SQL repetida: física (3 resultados), nanotecnologia no escopo Lab (5), Marketing (4), Finanças (5), Trade (4), Turbo (3); consultas vazia e desconhecida (0).
- A busca no escopo Finanças para uma consulta de Marketing pode retornar um resultado `shared` genérico. Isso é permitido pelo contrato atual; o resultado não contém escopo empresarial de Marketing. Registrar como oportunidade de calibração de relevância, não como vazamento entre empresas.
- A Edge Function `eu-sou-knowledge-search` está ativa com `verify_jwt=true`; seu código usa a função SQL e exige configuração server-side. Não foi possível executar um teste HTTP autenticado da Edge Function porque a sessão não fornece ferramenta de invocação HTTP genérica nem credencial JWT do usuário.
- A integração runtime local permanece pendente: os conectores desta sessão não alcançam o shell/localhost do PC do usuário. O código local `C:\AdonaiTurbo\backend\levi-core.js` e o servidor `:3000` não foram modificados por esta sessão. Não declarar integração ponta a ponta concluída.


- Criado script de diagnóstico local somente leitura: [DIAGNOSTICO_LOCAL_EU_SOU_LEVI_2026-10-14.ps1](https://github.com/AdonaiShalom/adonaiturbo/blob/main/eu-sou/quantica/DIAGNOSTICO_LOCAL_EU_SOU_LEVI_2026-10-14.ps1). Testa portas 3000/8765, busca local e rota de orquestração, sem alterar arquivos ou banco. Não foi executado, pois o runner desta sessão não tem acesso ao computador Windows.
- Criado SQL de regressão repetível: [TESTES_REGRESSAO_BUSCA_SUPABASE_2026-10-14.sql](https://github.com/AdonaiShalom/adonaiturbo/blob/main/eu-sou/quantica/TESTES_REGRESSAO_BUSCA_SUPABASE_2026-10-14.sql).
