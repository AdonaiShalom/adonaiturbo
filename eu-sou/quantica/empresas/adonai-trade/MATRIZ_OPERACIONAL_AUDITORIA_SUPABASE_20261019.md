# Adonai Trade — matriz operacional, auditoria Supabase e plano de validação
Data: 2026-10-19
Status: diagnóstico conectado; sem ordens reais; sem alteração de políticas/permissões nesta revisão.

## 1. Hierarquia de decisão e responsabilidades

### EU SOU — autoridade científica para recomendação
Responsável por consolidar conhecimento com proveniência; identificar instrumento e mercado; analisar preço, volume, indicadores, fundamentos, notícias/eventos, índices, estatística, probabilidades e risco; executar cálculos quânticos/nanoquânticos apenas como experimentos comparados com baselines clássicos; entregar um pacote decisório rastreável ou abster-se.
Saída mínima: decision_id/correlation_id, instrumento, mercado, direção/cenário, horizonte, validade, fontes e timestamps, versões/hashes, premissas, probabilidades calibradas, intervalos/incerteza, custos, risco, benchmark, objeções, resultado do gate.

### Gate de risco, integridade e autorização
Não é um agente de previsão. É uma barreira determinística antes de qualquer encaminhamento operacional. Deve negar se: fonte/dado vencido, licença incerta, timestamp/unidade/moeda inválidos, divergência de preços, modelo sem versão, teste temporal contaminado, probabilidade não calibrada, limites de risco ultrapassados, auditoria quebrada, duplicidade/idempotência falha, ou modo paper não confirmado.

### LEVI — orquestração
Recebe somente pacotes do EU SOU que passaram pelas validações de estrutura e gate. Mantém correlation_id, distribui subtarefas e propostas às quatro mesas e ao RH, agrega resultados e reporta o estado. Não inventa dados, não altera probabilidade e não converte recomendação em ordem financeira por conta própria.

### Quatro mesas
- B3/nacional: calendário e sessões locais, B3/CVM/BCB, ações/BDRs/ETFs/FIIs/derivativos cobertos, eventos corporativos, custos e regras brasileiras.
- Internacional: bolsas/ativos e moedas explícitos, filings SEC/XBRL, macro, resultados, calendário, custos e licenças por fornecedor.
- Forex: pares e convenção de cotação, sessões, diferenciais de juros, rollover, spreads, alavancagem e limitação do COT a futuros cobertos.
- Cripto: exchange e símbolo em cada registro, spot separado de perpétuos/opções, spread/profundidade/slippage/funding/basis, qualidade da exchange, stablecoin e risco on-chain.

### RH — papéis identificados no Supabase
- research: pesquisa e inteligência, análise e proveniência.
- market_data: validação de fornecedor, frescor e qualidade.
- risk: limites, bloqueios e conformidade.
- audit: ceticismo, trilha, hashes e evidências; pode bloquear.
- orchestrator: distribuição de tarefas e coordenação das quatro mesas.
- paper_execution: somente simulação; nenhuma credencial/end-point financeiro.
- human_supervisor: revisão de exceções e aprovação de mudanças de configuração.

Os papéis já existem em `adonai_trade.rh_roles`, mas a coluna `activity_status` retornou `not_reported` para todos. Isso comprova catálogo de funções, não agentes ativos ou tarefas sendo executadas.

## 2. Diagnóstico conectado do Supabase

Projeto conectado: `qyeduepihkxgrwotqnhb`.
Esquemas relevantes observados: `eu_sou`, `adonai_trade`, `levi`; o banco também contém outros domínios que não devem ser alterados nesta tarefa.

### RLS / privilégios
O advisor de segurança reportou 51 tabelas com RLS habilitado sem políticas próprias, incluindo tabelas de memória/âncora do EU SOU e LEVI, RH e tabelas de outros domínios. O advisor também retornou privilégios de `service_role` em tabelas de escrita e leitura, e `authenticated` com SELECT em `eu_sou.knowledge_chunks`.
Interpretação: “RLS sem política” não prova por si só exposição pública; o acesso efetivo depende de grants, roles, funções SECURITY DEFINER/INVOKER e caminhos de API. Não desligar RLS e não criar políticas permissivas genéricas. Próximo passo é mapear, por tabela, papéis legítimos, grants, RPCs e origem de cada chamada; testar como anon/authenticated/service_role em ambiente controlado e adicionar apenas políticas mínimas necessárias.

### RPCs observadas
- `adonai_trade.rh_create_task_with_audit` e `rh_update_task_status_with_audit`: SECURITY DEFINER.
- `adonai_trade.verify_runtime_audit_chain`: SECURITY INVOKER.
- `eu_sou.anchor_advance/read` e `levi.anchor_advance/read`: SECURITY DEFINER.
- `eu_sou.search_knowledge`: SECURITY INVOKER.
Antes de expor estas rotinas via API, revisar `search_path`, grants EXECUTE, validação de entrada, owner, privilégio mínimo e se a função pode contornar RLS. Não presumir que o status SECURITY DEFINER é vulnerabilidade automática; revisar a implementação e os grants.

### Performance
O advisor de performance reportou 30 chaves estrangeiras sem índice de cobertura e índices não utilizados. A amostra inclui referências em `eu_sou.run_evidence`, `science_domains`, `scientific_models`, `scientific_runs`, `source_domain_links`, `validation_benchmarks`, e em tabelas de RH/LEVI. Não criar ou remover índices em massa: validar volume, planos de consulta, latência e frequência real; criar índices nas FKs críticas após medir, e avaliar índices “unused” apenas após período representativo.

### Evidência de integração já registrada
`adonai_trade.rh_tasks` contém `AT-E2E-20261019-014753` com teste controlado de write-read-update-complete e trilha de auditoria marcado como pass, com `market_orders_sent=false` e `execution_performed=false`. Isto prova aquele fluxo específico do Supabase RH, não a integração completa EU SOU → gate → LEVI → 4 mercados nem a saúde da auditoria local Node.
`RH-2026-001` segue `in_progress` para API RH autenticada/auditoria transacional.
`RH-2026-002` está `blocked`: o HTML original da sede 3D e `frontend/index.html` não estão no ramo GitHub conectado. O bloqueio registra explicitamente que não se deve substituir o protótipo original por uma teia genérica.

## 3. Plano de auditoria RLS sem risco de abertura acidental

1. Exportar para relatório a matriz schema/tabela/RLS/grants/policies e funções relacionadas; não copiar segredos.
2. Para cada tabela, classificar dados: público, interno, pessoal, segredo operacional, auditoria imutável.
3. Identificar caller legítimo (browser authenticated, backend service_role, RPC), necessidade de SELECT/INSERT/UPDATE/DELETE e ownership.
4. Revisar SECURITY DEFINER: search_path fixo, nomes qualificados, checagem de caller, parâmetros validados e grants EXECUTE mínimos.
5. Preparar políticas específicas por tabela em migration versionada e ambiente de teste; negar por padrão.
6. Testar anon, authenticated sem vínculo, authenticated autorizado e service_role; verificar leituras e tentativas de mutação indevidas.
7. Conferir regressão do anchor, conhecimento, RH e append-only audit; somente então preparar PR/migration para aprovação.
8. Reexecutar advisors e guardar antes/depois. Não marcar concluído só porque o advisor deixou de reportar.

## 4. Plano de validação de engenharia

### Escritor de auditoria local
A cadeia local do projeto Trade foi observada anteriormente com quebra em registro 109 (índice interno 177 em vez do esperado 108). O arquivo original deve permanecer preservado. A correção fail-closed está somente em cópia isolada até passar:
- append normal em cadeia vazia;
- append normal em cadeia válida com registros existentes;
- rejeição de cadeia inválida sem alterar bytes;
- rejeição de divergência disco/memória;
- comportamento com duas tentativas/processos concorrentes;
- reinício do módulo e verificação de assinatura/hash;
- novo ledger apenas com evento de incidente e referência/hash da cadeia arquivada, nunca renumerando ou fingindo que a cadeia antiga está íntegra.

### Dados e backtests
- Fixtures determinísticas offline por mercado.
- Testes de timezone, horário de mercado, calendário, unidade, moeda, ajuste corporativo, faltantes, duplicados, atraso e divergência entre fornecedores.
- Walk-forward e teste fora da amostra; prevenção de look-ahead e survivorship bias.
- Custos, spread, slippage, funding, rollover, liquidez e limitações por classe de ativo.
- Métricas: retorno líquido, volatilidade, drawdown, Sharpe/Sortino com ressalvas, exposição, turnover, CVaR, estabilidade por regime e calibração probabilística.
- Comparar modelo e baseline simples sob mesmo conjunto de dados, restrições e orçamento computacional.

### Quantum / nanoquantum
Separar otimização quântica inspirada, circuitos simulados e hardware real. Fixar seed, dataset, função objetivo, restrições, tempo de computação e solver clássico de comparação. Resultado sem ganho reproduzível permanece experimental. Nanotecnologia/nanoquantum é linha de pesquisa científica independente até existir hipótese testável que a conecte a um sinal de mercado.

## 5. Portas de aceitação
- [ ] RLS/grants/RPCs mapeados e testados por papel.
- [ ] Escritor local passa os sete testes acima; cadeia original preservada.
- [ ] Fontes e adaptadores validados nos quatro mercados.
- [ ] EU SOU produz decisão versionada e explicável ou abstenção.
- [ ] Gate de risco/integridade bloqueia entradas inválidas.
- [ ] LEVI encaminha por correlation_id e RH registra responsáveis/resultados.
- [ ] Sede 3D original validada com API, sem substituir o HTML original.
- [ ] Smoke/API sem ordens reais; porta 3100 só após liberação e teste explicitamente planejado.
- [ ] Evidência final, hashes e logs reproduzíveis guardados.

## 6. Estado desta revisão
- Concluído: consulta conectada de papéis RH, tarefas, RPCs, grants e advisors.
- Em andamento: documento de governança/segurança e priorização das correções.
- Bloqueado: validar HTML/runtime local 3100 diretamente pelo conector GitHub/Supabase; este acesso não equivale a shell local.
- Sem alteração nesta revisão: políticas RLS, grants, chaves, servidor local, porta 3100, execução financeira.
