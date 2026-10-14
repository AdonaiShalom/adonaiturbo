# EU SOU — Playbook operacional para Adonai Turbo
Versão 1.0 · 2026-10-14

## Objetivo
Transformar conhecimento científico em respostas recuperáveis, rastreáveis e seguras para LEVI, sem misturar projetos ou afirmar execução não testada.

## Contrato de resposta científica
Cada resultado deve carregar: pergunta normalizada, empresa consumidora, domínio, fontes e URLs, páginas/trechos, versão/data, pontuação de recuperação, limitações e estado (documentado/revisado/validado). Quando não houver fonte relevante, abster-se explicitamente.

## Pipeline requerido
1. Ingestão controlada de PDF/HTML/Markdown/licenças autorizadas.
2. Extração e limpeza preservando títulos, equações, unidades, páginas e referências.
3. Segmentação por seção com metadados `company_scope`, `domain_slug`, `source_id`, `document_version`.
4. Recuperação lexical e/ou vetorial com filtros por escopo; reranking avaliado por conjunto de perguntas anotadas.
5. Resposta baseada apenas nos trechos retornados; citações e indicação de incerteza.
6. Registro de latência, top-k, score, origem, erro/timeout e resultado sem segredos.
7. Teste de regressão e rollback para cada atualização do índice.

## Isolamento
Adonai Turbo, Marketing Digital, Finanças, Lab e Trade são cinco escopos consumidores. PSM Grupo Market permanece fora deste conjunto e isolado. O LEVI coordena chamadas; não elimina autorização e políticas específicas de cada empresa.

## Testes mínimos
- Pergunta de física deve recuperar física, não apenas criptografia pós-quântica.
- Pergunta de nanotecnologia deve recuperar material/nanoestrutura específico.
- Fonte ausente ou serviço indisponível deve gerar abstenção, não uma resposta inventada.
- Testar timeout, resposta vazia, documento duplicado, PDF sem texto, metadado ausente e rollback.
- Medir p50/p95 em vez de declarar metas de latência sem medição.

## Aceitação
A integração só pode ser marcada operacional depois de testes no servidor local, com logs de consultas, fontes, trechos e resultados. A presença de arquivos no GitHub ou registros no Supabase não prova que o runtime os consulte.