# EU SOU — Relatório de validação da busca científica
Data: 2026-10-14
Projeto Supabase: adonaiturbo (`qyeduepihkxgrwotqnhb`)
Status: função de recuperação corrigida e testes SQL concluídos; integração runtime/local ainda pendente.

## Alterações aplicadas
- Migração `eu_sou_search_knowledge_or_fallback_v1`: normalização básica de acentos, busca estrita com fallback OR por termos, limite de resultados e filtro de status/escopo.
- Migração `eu_sou_search_knowledge_relevance_v2`: ranking por cobertura dos termos e peso adicional para termos no título, mantendo o filtro por escopo empresarial.
- Função alterada: `eu_sou.search_knowledge(p_query, p_company_scope, p_limit)`.
- Histórico Supabase confirma as duas migrações:
  - `20261014232557 eu_sou_search_knowledge_or_fallback_v1`
  - `20261014232659 eu_sou_search_knowledge_relevance_v2`

## Evidências de teste no banco
| Caso | Consulta de teste | Resultado |
|---|---|---|
| Física quântica | equacao de Schrodinger oscilador harmonico energia ponto zero | Encontrou “Equação de Schrödinger e oscilador harmônico” (shared) |
| Nanotecnologia | pontos quanticos nanofotonica nanoestrutura sensores quanticos | Encontrou “Pontos quânticos e materiais bidimensionais” e “Sensores quânticos e metrologia” (shared) |
| Laboratório | PySCF DFT estrutura eletronica convergencia | Encontrou “DFT e validação de estrutura eletrônica” e playbook do Adonai Lab |
| Marketing | alegação científica randomização campanha intervalo confiança | Encontrou “Marketing científico e maturidade de alegações” no escopo correto |
| Finanças | QUBO risco slippage custos transação | Encontrou “Otimização financeira quântica e risco” no escopo correto |
| Trade | walk-forward drawdown slippage paper trading | Encontrou “Pesquisa quantum-inspired para Adonai Trade” no escopo correto |
| Adonai Turbo | recuperacao cientifica score fonte proveniencia latencia | Encontrou “Contrato de recuperação científica do LEVI” no escopo correto |
| Isolamento | busca de marketing limitada ao escopo Finanças | Nenhum resultado de Marketing retornado |
| Consulta sem evidência | xyzabcqwerty sem evidência inexistente | Zero resultados |

## Limitações restantes
- O catálogo Supabase continua pequeno: 12 trechos curados (5 por empresa + 7 compartilhados). Busca corrigida não equivale a corpus completo.
- A consulta de nanotecnologia retornou fontes compartilhadas, não um playbook específico do Lab; deve-se ampliar a cobertura científica.
- Ainda não foi executado teste ponta a ponta no runtime local `biblioteca-local:8765 → LEVI → Adonai Turbo:3000` nesta sessão, porque não há canal para o shell/localhost local.
- Portanto, não declarar a fase de integração completa. Próximo passo: ampliar e curar os trechos do corpus para cada escopo, depois validar a API/runtime local e registrar latência, fonte e trechos usados.


## Atualização de execução — 14/10/2026
- Foram inseridos 13 trechos curados adicionais a partir do corpus e playbooks versionados no GitHub; total agora: 25 trechos curados/revisados/validados.
- Distribuição confirmada por consulta SQL: `shared=10`, `adonai-turbo=3`, `adonai-marketing-digital=3`, `adonai-financas=3`, `adonai-lab=3`, `adonai-trade=3`.
- Migração adicional: `eu_sou_search_knowledge_minimum_term_coverage_v3`, que exige pelo menos dois termos correspondentes em consultas com múltiplos termos, evitando falsos positivos por uma palavra genérica.
- Reteste: a consulta desconhecida `xyzabcqwerty sem evidência inexistente` retornou zero resultados; consulta de um termo `nanotecnologia` continuou retornando resultado relevante.
- Retestes com consultas de domínio retornaram trechos do escopo esperado para Marketing Digital, Lab, Trade e Adonai Turbo; Finanças já havia passado no teste anterior após a ingestão adicional.
- A tentativa de buscar conteúdo de Marketing com escopo Finanças retornou zero resultados após a expansão do acervo.
- Todos os novos trechos foram marcados `curated` com metadados de versão e origem; isso significa curadoria documental, não validação experimental.
- O catálogo ainda é uma base de conhecimento inicial (25 trechos), não ingestão integral do corpus.
- O teste ponta a ponta com servidor local `8765` e LEVI via `:3000` continua pendente porque esta sessão não possui canal de shell/localhost local.
