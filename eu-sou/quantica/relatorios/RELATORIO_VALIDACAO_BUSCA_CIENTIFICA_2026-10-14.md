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
