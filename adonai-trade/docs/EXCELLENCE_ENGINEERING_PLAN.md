# Adonai Trade — Plano de engenharia reversa e excelência

**Data da auditoria:** 2026-10-17  
**Branch:** `docs/adonai-trade-excellence-20261017`  
**Estado deste artefato:** plano versionado para execução incremental; não é certificação nem prova de integração ponta a ponta.  
**Regra de segurança:** paper trading apenas. Nenhuma chave de corretora, ordem real ou alteração de schema Supabase é autorizada por este documento.

## 1. Resumo executivo

O Adonai Trade já tem artefatos de contrato e um primeiro gate determinístico de política no branch de contratos, além de testes automatizados de envelope, risco e sazonalidade. Entretanto, o repositório conectado não contém, no caminho `adonai-trade/`, o runtime executável completo que existe no ambiente local. O estado do GitHub/Supabase não prova que LEVI, EU SOU, as quatro mesas e RH estejam conectados de ponta a ponta.

**Prioridade imediata:** integrar o código-fonte local revisado a um branch isolado, preservar a instalação atual, corrigir trilha de auditoria, testar contratos reais e construir evidências reproduzíveis. Não implantar ou substituir a versão instalada antes dos gates de aceite.

## 2. Evidências observadas e limites

### GitHub

- Repositório: [AdonaiShalom/adonaiturbo](https://github.com/AdonaiShalom/adonaiturbo).
- O README da branch principal descreve FreeLLMAPI, não a aplicação executável completa do Adonai Trade.
- O README em `adonai-trade/README.md` descreve o módulo independente na porta 3100 e separação das portas Turbo 3000 / PSM 3001.
- A pasta `adonai-trade/` consultada contém README, contratos e runtime de segurança; não foi encontrado ali `server.js` nem `package.json` executável na branch consultada.
- O PR de contrato (#11) descreve schema versionado, gate determinístico, testes negativos e CI; declara explicitamente que não conecta serviços locais, não implementa adaptadores de mercado, não confirma Supabase e não prova paper trading persistente.
- O PR de arquitetura (#10) é documentação e requer revisão técnica antes de DDL ou código operacional.
- Não importar nem copiar cegamente código de terceiros. Primeiro revisar licença, dependências, manutenção, segredos, permissões, testes, origem e compatibilidade com o runtime Node do projeto.

### Supabase `adonaiturbo`

A tabela `adonai_trade.integration_status` apresenta quatro componentes, todos sem prova de integração completa:
- `levi`: `pending`; contrato de requisição/resposta e persistência da auditoria ainda precisam de teste local.
- `eu_sou`: `pending`; contrato, autenticação e persistência precisam de teste local.
- `trade_server`: `pending`; acessibilidade do servidor na porta 3100 não foi validada pelo conector.
- `github`: `degraded`; fonte local recebida, mas revisão de origem e publicação do executável permanecem pendentes.

Inventário observado nas tabelas de domínio:
- `eu_sou`: 12 domínios científicos, 44 fontes, 31 chunks de conhecimento, 11 ferramentas científicas, 33 vínculos fonte-domínio, 3 benchmarks; ainda sem execuções científicas, modelos científicos, evidências de execução ou checkpoints de fase registrados nas tabelas consultadas.
- `levi`: estruturas de âncora presentes; conversas, mensagens e memória não tinham registros nas tabelas consultadas.
- `rh_adonai`: 5 empresas, 12 agentes, 60 atribuições e 5 recomendações; sem execuções de aprendizado registradas.
- As tabelas operacionais do schema `adonai_trade` precisam de validação funcional com o runtime real, não apenas existência de schema.

Advisors observados:
- Segurança: 52 alertas de tabelas com RLS habilitado sem políticas.
- Performance: 30 chaves estrangeiras sem índice de cobertura e 19 índices não usados.
- RLS sem política **não prova, isoladamente, exposição pública**; verificar privilégios, schemas expostos, roles, views e grants antes de qualquer alteração. Não desabilitar RLS para “resolver” acesso.

### Histórico de testes locais fornecido anteriormente

O histórico desta sessão registra que `npm.cmd test` passou pelas suites `unit.js`, `unit_mesa.js`, `unit_equipes.js` e `smoke.js` numa cópia local em ocasião anterior. Isso não substitui a repetição dos testes contra o ZIP/fonte exato que será publicado. Também foi relatada uma quebra da cadeia de auditoria a partir do registro 76 e assinaturas inválidas nos registros 77–86; isso precisa de diagnóstico reproduzível antes de declarar integridade aprovada.

## 3. Engenharia reversa: arquitetura-alvo

Fluxo-alvo, com contratos versionados e correlação de ponta a ponta:

`LEVI (intenção e roteamento) → EU SOU (evidências científicas e incerteza) → mesa especializada → normalização/validação de dados → motor de risco independente → simulador de execução → ledger imutável/auditoria → relatório para LEVI e RH`

Princípios:
1. LEVI coordena, mas não pode alterar limites nem sobrepor veto de risco.
2. EU SOU fornece fontes, método, baseline, incerteza, limitações e evidências; não transforma hipóteses em fatos.
3. Quatro mesas independentes: `CRYPTO`, `FOREX`, `B3`, `INTERNATIONAL`. Cada uma tem adaptador de dados, calendário, regras de instrumento, custos e testes próprios.
4. Todas usam o mesmo contrato de proposta e a mesma interface de risco; especificidades de mercado ficam nos adaptadores.
5. `paper` é o único modo permitido no caminho atual. Ausência, atraso, inconsistência ou baixa proveniência dos dados bloqueia a proposta.
6. O motor de risco é determinístico, separado da estratégia e testado por propriedades; risco desconhecido equivale a bloqueio.
7. Cada tarefa usa `task_id` idempotente e `correlation_id` estável desde a entrada até auditoria.
8. Falha técnica, timeout, autenticação inválida, repetição inconsistente ou serviço indisponível falha fechado: sem ordem.
9. Segredos nunca entram em payloads, logs, relatórios, prompts ou dados de conhecimento.
10. RH gerencia papéis, atribuições, qualificação, avaliação e aprovação; não recebe credenciais de corretora nem autoriza por conta própria uma ordem.

## 4. O que falta implementar e provar

### P0 — Integridade, segurança e contenção

- Reproduzir e corrigir a cadeia de auditoria; identificar se a quebra vem de dado alterado, sequência concorrente, serialização, chave/assinatura ou teste destrutivo. Preservar evidências originais.
- Definir esquema canônico de evento, ordenação monotônica, hash anterior, hash atual, assinatura, rotação/versão de chave e verificação de cadeia.
- Idempotência real persistida por `task_id`; concorrência, retry e replay devem ter testes.
- Confirmar autenticação/autorização entre serviços, rate limiting, timeout, limites de payload, validação de input e redação de segredos.
- Revisar todas as tabelas RLS, grants, schemas expostos, views e funções privilegiadas. Criar políticas específicas por componente/tenant só após mapear o modelo de acesso.
- Fazer varredura de segredos e dependências; fixar versões e gerar lockfile quando houver dependências.
- Garantir que testes de smoke executem em banco/pasta temporários e nunca apaguem dados de operação.

**Critério de aceite P0:** cadeia íntegra em testes positivos e negativos; segredos ausentes; acesso mínimo; nenhum caminho capaz de converter falha em ordem.

### P1 — Runtime e contratos de integração

- Incorporar o código executável real de `C:\AdonaiTurbo\AdonaiTrade` após receber e revisar o ZIP/source; o repositório conectado não permite reconstruir fielmente arquivos locais que ainda não foram publicados.
- Estabelecer API documentada para health/readiness, tarefas, resultados, auditoria e versão do contrato.
- Implementar autenticação serviço-a-serviço para LEVI → Trade e Trade → EU SOU; não confiar apenas em localhost.
- Mapear cada campo dos contratos para requests/responses reais e validar tipos, erros, limites e timeouts.
- Persistir estados `accepted`, `completed`, `blocked`, `failed`, motivos de bloqueio e evidências correlacionadas.
- Registrar em `integration_status` apenas resultados de verificações realmente executadas, com timestamp e evidência; não marcar integração como ativa por existir endpoint/configuração.
- CI deve executar schema validation, testes de contrato, unitários, regressão, segurança e smoke não destrutivo em pull requests.

**Critério de aceite P1:** teste ponta a ponta local LEVI → Trade → EU SOU → mesa → risk gate → paper ledger → auditoria, com bloqueios negativos confirmados.

### P2 — Dados e quatro mesas

Cada adaptador precisa de testes gravados (fixtures), limites de taxa, cache, timeout, retry com backoff, circuit breaker, qualidade e proveniência dos dados.

- **Cripto:** validar exchange/símbolo/mercado spot ou derivativo, precisão de preço/quantidade, filtros de lote, taxas, funding quando aplicável, limites de API e modo sandbox. Não reutilizar credenciais reais nos testes.
- **Forex:** validar bid/ask, spread, pip/lot size, conversão da moeda da conta, sessão/feriados, rollover, slippage e diferença entre preço de referência e execução simulada.
- **B3/Nacional:** validar ticker, pregão, leilões, feriados, ajuste por proventos/desdobramentos, atraso do feed, liquidez, lote e limites de dados do provedor.
- **Internacional:** normalizar timezone, moeda, calendário por bolsa, split/dividendos, ADR/ETF quando aplicável, custos e diferenças entre provedores.
- **Todos:** timestamp UTC, origem/licença, símbolo canônico, unidade, bid/ask/close, intervalo, qualidade e freshness. Dados futuros, duplicados, faltantes ou fora da sessão são rejeitados ou explicitamente sinalizados.

**Critério de aceite P2:** contrato comum validado em fixtures para todas as mesas; nenhum teste depende de rede ou de conta real; cada fonte tem status de saúde e idade de dado visíveis.

### P3 — Pesquisa quantitativa e simulação confiável

- Backtest event-driven ou bar-by-bar, sem look-ahead, sem survivorship bias e sem vazamento entre treino e teste.
- Incluir comissões, spread, slippage, funding/rollover, liquidez, latência, lotes e regras de mercado.
- Separar treino, validação, teste fora da amostra e walk-forward; registrar versão de dados, estratégia e parâmetros.
- Benchmarks simples (buy-and-hold, cash, baseline estatístico), ablação e análise de sensibilidade.
- Métricas: retorno líquido, volatilidade, Sharpe/Sortino, Calmar, drawdown máximo, turnover, exposição, win/loss, profit factor, custos e intervalos de confiança.
- Testes de propriedade: tamanho da posição nunca excede limite, perda não é omitida, custo nunca melhora artificialmente o PnL, timestamps não avançam para o futuro, e modo paper não emite chamadas de corretora.
- Sazonalidade é descritiva; não deve ser promovida a sinal de compra/venda sem validação estatística e fora da amostra.

**Critério de aceite P3:** relatórios reproduzíveis com dataset/version hash, custos explícitos, baselines, limites de validade e ausência de promessa de lucro.

### P4 — EU SOU, LEVI e RH

- EU SOU: persistir execução, modelo, benchmark, versão de fonte, método, resultado e evidências; diferenciar hipótese, simulação, resultado validado e conhecimento estabelecido.
- LEVI: ferramenta de roteamento com schema estrito; registrar decisão e resposta por correlação; LLM não calcula risco nem pode emitir ordem diretamente.
- RH: matriz de responsabilidades, dono por componente, qualificação verificável, revisões periódicas, histórico de treinamento e critérios de promoção/reprovação de agentes.
- Aprendizado: propostas geradas em sandbox, revisão cética, baseline, testes, aprovação humana e trilha de evidência antes de promover conhecimento.
- Evitar criar muitos agentes sem papel testável. Cada agente precisa de entradas, saídas, limites, dono, testes e métrica de qualidade.

**Critério de aceite P4:** cada recomendação tem fonte, versão, responsável, evidência e estado; nenhum agente é considerado operacional só por estar cadastrado.

### P5 — Operação, observabilidade e entrega

- Logs estruturados com correlation/task IDs, métricas e traces; não registrar tokens nem dados pessoais desnecessários.
- Health/readiness separado; indicadores de latência, erro, idade de feed, taxa de bloqueio, drawdown simulado e atraso da fila.
- Graceful shutdown, lock de instância, retries limitados, fila idempotente, backup/restore e runbook de recuperação.
- Build reprodutível, lockfile, verificação de licença/SBOM, análise de vulnerabilidade e artefato de release com hash.
- Documentar rollback e plano de recuperação antes de qualquer implantação.
- Separação fixa: Adonai Trade 3100; Turbo 3000; PSM 3001. Não compartilhar runtime, variáveis, dados ou publicação entre projetos.

## 5. Referências open source para engenharia reversa

As referências abaixo são fontes de padrões de arquitetura e testes, não dependências aprovadas nem código já incorporado. Revisar licença e dependências antes de reutilizar qualquer trecho.

- [CCXT](https://github.com/ccxt/ccxt) — interface unificada para exchanges; estudar abstração de mercados, limites e normalização.
- [ccxt/binance-trade-bot](https://github.com/ccxt/binance-trade-bot) — exemplo de bot e backtest; estudar custos e pontos de risco, não assumir que a estratégia seja robusta.
- [Stratex](https://github.com/achrafedd/Stratex) — separação entre estratégias, backtest, risco e paper trading; avaliar a implementação e o estado de manutenção antes de adotar.
- [Automated-paper-trading-bot](https://github.com/WalllerG/Automated-paper-trading-bot) — referência de backtest sem look-ahead, custos e limites independentes; validar licença e código.
- [OpenFinData](https://github.com/robertoecf/openfindata) — infraestrutura de dados financeiros públicos brasileiros via API/CLI/Python/MCP.
- [brasa](https://github.com/wilsonfreitas/brasa) — extração de dados de instituições brasileiras como B3, ANBIMA, Tesouro Direto e CVM.
- [brapi](https://github.com/0peters/brapi) — referência de API para ações brasileiras; verificar atraso, cobertura, licença e limites do provedor.
- [ApexAlgo](https://github.com/Stenvro/ApexAlgo) — referência de gate de risco, sandbox, isolamento por exchange e testes de paridade; não adotar código sem revisão aprofundada.

### Processo obrigatório de revisão de cada repositório

1. Confirmar licença e avisos de atribuição.
2. Revisar histórico, releases, atividade e issues abertas.
3. Inventariar dependências, lockfiles, vulnerabilidades e chamadas de rede.
4. Procurar segredos, execução de shell, telemetria, binários e código ofuscado.
5. Inspecionar estratégia, risco, backtest, tratamento de erros e persistência.
6. Copiar apenas padrões necessários; documentar origem, licença, alterações e motivo.
7. Adaptar a testes do Adonai Trade; não importar diretórios inteiros.
8. Executar testes isolados antes de qualquer integração.

## 6. Sequência de execução e gates

| Gate | Entrega | Evidência obrigatória |
|---|---|---|
| G0 | Fonte real sob revisão | Inventário de arquivos, hash do ZIP, diff, varredura de segredos |
| G1 | Segurança e auditoria | Testes de assinatura/hash, replay, concorrência e RLS revisada |
| G2 | Contratos | Testes positivos/negativos para requests/responses reais |
| G3 | Quatro mesas | Fixtures por mercado, normalização e freshness |
| G4 | Paper engine | Backtest e paper persistente com custos, limites e ledger |
| G5 | EU SOU + LEVI + RH | Testes ponta a ponta e evidência persistida |
| G6 | Release candidate | CI verde, documentação, SBOM, backup/rollback e relatório de aceite |

Não avançar um gate com falha aberta em segurança, integridade, perdas/custos simulados ou origem dos dados. Não declarar 100% até G0–G6 terem evidência publicada e revisada.

## 7. Bloqueio atual para implementar o runtime real

A conexão do GitHub permite trabalhar no repositório e no branch; a conexão do Supabase permite inspecionar o projeto. Ela **não dá acesso ao disco C:\ do computador**. Para aplicar engenharia reversa fiel ao runtime local, anexar nesta conversa o arquivo `AdonaiTrade_Source_Review_20261015_171400.zip` ou publicar o código executável revisado em um branch isolado. Até lá, qualquer implementação de `server.js` ou dos adaptadores seria especulativa.

## 8. Definition of Done

- [ ] Código executável real revisado, sem segredos e com licença/dependências identificadas.
- [ ] Testes repetidos a partir do mesmo commit/hash que será entregue.
- [ ] Auditoria íntegra e idempotente sob retry/concorrência.
- [ ] Falhas e vetos de risco provados por testes negativos.
- [ ] Quatro mesas validadas com fixtures, custos e timestamps.
- [ ] EU SOU/LEVI/RH integrados por contrato e com evidências persistidas.
- [ ] Supabase com políticas de acesso revisadas, grants mínimos e advisors reavaliados.
- [ ] Backtest fora da amostra e paper trading reproduzíveis.
- [ ] CI verde, documentação, SBOM, release hash, backup e rollback.
- [ ] Nenhuma ordem real habilitada sem processo de autorização separado e explícito.
