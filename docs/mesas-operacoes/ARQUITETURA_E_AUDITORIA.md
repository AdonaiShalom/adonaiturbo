# Adonai Trade — arquitetura das quatro mesas, RH, LEVI e EU SOU

**Status:** proposta técnica para revisão; não representa integração operacional concluída.  
**Branch:** `work/adonai-trade-professionalization-20261016`  
**Escopo:** B3/Nacional, Internacional, Cripto e Forex; RH próprio do AdonaiTrade; LEVI; EU SOU; observabilidade e sala 3D.

## 1. Princípios de implementação

1. O RH canônico de Adonai Trade é o módulo próprio `lib/rh.js` e sua interface em `index.html`, conforme a referência do projeto. O schema `rh_adonai` do Adonai Turbo não deve ser tratado como RH do Trade.
2. Nenhuma equipe ou competência é considerada existente até ser lida do RH e validada por testes. A matriz abaixo é uma arquitetura-alvo para avaliação, não uma lista de funcionários já cadastrados.
3. LEVI distribui tarefas, consolida evidências e registra decisões; não pode contornar limites de risco ou transformar recomendação em ordem de mercado automaticamente.
4. EU SOU pode calcular, recuperar literatura, simular e comparar hipóteses. “Quântico” e “nanotecnologia quântica” não são, por si só, evidência de vantagem financeira. Toda hipótese aplicada a mercados precisa de baseline clássico, dados apropriados, validação fora da amostra, custos, incerteza e reprodução independente.
5. Começar em modo leitura/paper trading. Não ativar ordens reais, alavancagem ou credenciais de corretora como consequência desta arquitetura.
6. A interface 3D deve consumir eventos reais do backend com timestamp, estado, origem e identificador de correlação. Sem eventos, mostrar “sem atividade / conexão indisponível”, nunca simular trabalhadores ativos.

## 2. Hierarquia funcional proposta

- **Governança / responsável humano:** define mandato, capital autorizado, tolerância a risco e aprova alterações críticas.
- **LEVI — orquestrador:** recebe a solicitação, seleciona mesa e especialistas pelo RH, decompõe o trabalho, pede cálculos ao EU SOU, agrega resultados e registra trilha de auditoria.
- **Controle de risco independente:** pode bloquear propostas, impor limites e interromper paper trading. Não deve depender da aprovação do operador que gerou o sinal.
- **Liderança de cada mesa:** prioriza pesquisa, valida dados, acompanha exposição e responde pelos relatórios daquela classe de ativos.
- **Analistas e pesquisadores:** produzem teses, dados, cenários e validações com fontes identificadas.
- **Traders / operadores de simulação:** executam apenas simulações autorizadas, registram entrada/saída hipotéticas, custos e slippage.
- **Dados, engenharia e auditoria:** cuidam de qualidade, relógios/timezones, proveniência, monitoramento, testes, permissões e trilha imutável.
- **EU SOU — núcleo científico transversal:** fornece conhecimento e experimentos rastreáveis às quatro mesas; não recebe autoridade para ignorar limites de risco nem evidência insuficiente.

A quantidade final de pessoas/agentes deve vir do inventário real do RH. A arquitetura lógica não deve ser convertida automaticamente em contratações.

## 3. Mandato e funções por mesa

### Mesa Nacional — B3

**Mandato:** análise de ações, ETFs, índices, futuros e demais instrumentos brasileiros somente quando a fonte e o contrato do instrumento estiverem confirmados.

Funções alvo:
- Líder de mesa: prioridades, limites e revisão diária.
- Analista fundamentalista: resultados, balanços, fatos relevantes e valuation; fonte/data para cada dado.
- Analista quantitativo: séries, fatores, testes estatísticos e validação fora da amostra.
- Especialista de microestrutura: liquidez, spread, leilões, lote, horário e qualidade de execução.
- Operador de paper trading: simula ordens e registra slippage/custos.
- Controle de risco: exposição por ativo/setor, concentração, drawdown e limites de perda.
- Pesquisador EU SOU: formula hipóteses matemáticas e físicas testáveis; comparação com baseline.

Melhorias críticas: calendário B3, corporate actions, survivorship/look-ahead bias, custos e emolumentos, limites por instrumento, regras de leilão, circuit breakers e dados com proveniência.

### Mesa Internacional

**Mandato:** instrumentos estrangeiros com regras, moeda, calendário, liquidez e fontes específicas por mercado.

Funções alvo:
- Líder de mesa e responsável por exposição agregada.
- Analista macro/global: taxas, inflação, bancos centrais e calendário de eventos.
- Analista de ativos/empresas: fundamentos e eventos por jurisdição.
- Quant internacional: correlação, fatores, regime e risco de cauda.
- Especialista FX/câmbio: conversão, custo de hedge, exposição cambial e horários.
- Operador de simulação e analista de execução.
- Risco/compliance: limites de jurisdição, instrumento, contraparte e concentração.
- Pesquisador EU SOU: cenários e modelos com hipóteses explícitas.

Melhorias críticas: timezone explícito, moeda-base, FX spot versus conversão contábil, calendários e feriados, custos de câmbio, dados atrasados, restrições de acesso e prevenção de vazamento temporal.

### Mesa Cripto

**Mandato:** análise de criptoativos; spot e derivativos devem ser tratados como produtos distintos. Não pressupor suporte de uma corretora ou exchange.

Funções alvo:
- Líder de mesa.
- Analista de protocolo/on-chain: métricas com fonte e limitações.
- Quant de mercado: volatilidade, regimes, funding, basis e correlação.
- Especialista em exchange/API: limites, rate limits, WebSocket, reconexão e precisão de quantidades.
- Analista de liquidez/microestrutura: spread, profundidade, slippage e fragmentação.
- Operador de paper trading.
- Risco/custódia/segurança: permissões mínimas, retirada desabilitada quando possível, segregação de chaves e resposta a incidentes.
- Pesquisador EU SOU: testes reproduzíveis; nenhuma alegação de “vantagem quântica” sem comparação experimental.

Melhorias críticas: relógio e sequência de eventos, dados duplicados/fora de ordem, reconexão idempotente, limites de taxa, risco de exchange, funding/liquidação em derivativos, proteção contra manipulação e gestão de segredos fora do frontend.

### Mesa Forex

**Mandato:** análise de pares FX; distinguir série histórica diária, cotação streaming e execução de broker.

Funções alvo:
- Líder de mesa.
- Analista macro de moedas e bancos centrais.
- Quant de FX: volatilidade, correlação, carry e regime.
- Especialista de dados: bid/ask, OHLC, fonte, timestamp, calendário e lacunas.
- Especialista de execução: spread, slippage, rollover/swap e rejeições.
- Operador de paper trading.
- Risco: exposição líquida por moeda, alavancagem, gaps e limites por par.
- Pesquisador EU SOU: validação independente de hipóteses.

Melhorias críticas: documentar claramente a fonte Frankfurter/BCE para histórico diário; não rotular isso como preço ao vivo; testar pares inválidos, inversão, lacunas, erro HTTP, timeout e dados stale; separar dados indicativos de cotações executáveis.

## 4. RH próprio: fluxo obrigatório

Antes de alterar o RH:
1. Inspecionar `index.html`, `lib/rh.js`, rotas `/api/rh` e testes atuais.
2. Inventariar cada agente: ID estável, nome, mesa, cargo, competências, evidências, nível de autonomia, estado e responsável.
3. Fazer correspondência entre competências e funções-alvo. Identificar lacunas sem duplicar agentes.
4. Usar as rotas de contratação/prova apenas em testes isolados ou após aprovação explícita; nunca testar mutações no RH produtivo.
5. Adicionar avaliação por prova técnica e evidência, trilha de decisão, controle de conflitos e revisão periódica.
6. Preservar compatibilidade com os endpoints existentes e adicionar testes de regressão.

As rotas anotadas na memória do projeto incluem `GET /api/rh`, `POST /api/rh/vaga`, `/api/rh/contratar`, `/api/rh/desligar` e `/api/rh/prova`; confirmar as assinaturas e semântica no código local antes de usar.

## 5. Contrato LEVI ↔ EU SOU ↔ mesas

Cada tarefa deve carregar:
- `correlation_id`, `desk`, `task_type`, `requester`, `created_at`, `deadline`.
- Dados de entrada com origem, timestamp, unidade, timezone, hash e status de qualidade.
- Hipótese, método, versão do software/modelo, parâmetros, baseline e limitações.
- Resultado numérico, incerteza, métricas de validação, fontes e hashes.
- Recomendação classificada como pesquisa, simulação, paper trading ou bloqueada.
- Decisão final, responsável, motivo e referência à evidência.

Fluxo: pedido → LEVI seleciona competências pelo RH → EU SOU recupera conhecimento e/ou calcula → analista independente revisa → motor de risco avalia → simulação registra resultado → LEVI apresenta síntese e evidências. Uma falha de fonte, dados vencidos, risco excedido ou falta de validação bloqueia a recomendação operacional.

## 6. Uso científico responsável do EU SOU

Para cada hipótese:
1. Definir uma pergunta falsificável e métrica primária antes do teste.
2. Identificar fontes científicas, versão, licença e limitações.
3. Criar baseline clássico simples.
4. Separar treino, validação e teste temporalmente; usar walk-forward quando apropriado.
5. Incluir custos, slippage, latência, survivorship bias e look-ahead bias.
6. Registrar parâmetros, seed, hashes, versões e incerteza.
7. Exigir reprodução independente antes de promover de candidato para validado.

A computação quântica pode ser pesquisada para problemas específicos de otimização, amostragem ou química/materials science, mas não se deve presumir benefício para previsão de preços. Nanotecnologia quântica pode contribuir com conhecimento de sensores e materiais, mas só entra no processo de mercado se existir uma ligação física/operacional demonstrável e evidência aplicável.

## 7. Sala 3D e estado operacional verdadeiro

A cena 3D deve ser uma visualização do estado real, não uma fonte de estado. Cada agente visualizado corresponde a um registro do RH e mostra:
- status: ocioso, trabalhando, aguardando revisão, bloqueado, erro ou desconectado;
- tarefa atual e mesa;
- timestamp da última atualização;
- fonte do evento e `correlation_id`;
- indicador de dados atualizados ou atrasados.

Eventos de backend sugeridos: `task.created`, `task.started`, `eu_sou.run.completed`, `risk.blocked`, `review.requested`, `paper_order.simulated`, `task.failed`, `integration.health_changed`. Persistir os eventos antes de animá-los. A cena deve usar WebSocket/SSE se já existir infraestrutura segura; caso contrário, começar por polling com timestamp e reconciliação. Sem heartbeat, mostrar indisponível.

Layout sugerido: centro de comando LEVI; quatro salas por mesa; sala independente de risco; laboratório EU SOU; painel de fontes/dados; auditoria e incidentes. Cada sala mostra KPIs calculados do backend, não números decorativos. Atributos 3D são apresentação; acessibilidade exige uma vista tabular equivalente.

## 8. Pesquisa de referências open source

- [Freqtrade](https://github.com/freqtrade/freqtrade): dry-run, backtesting, dados, análise de look-ahead/recursão e ferramentas de operação. Adaptar a disciplina de validação; não assumir que a arquitetura Python deve ser copiada para o projeto Node.
- [QuantConnect LEAN](https://github.com/QuantConnect/Lean): modelos separados de risco, incluindo drawdown por portfólio e por ativo. Inspirar a separação de risco da geração de sinal.
- [CCXT](https://github.com/ccxt/ccxt): API unificada para exchanges e mercados. Usar apenas na mesa cripto após avaliar exchanges, versões, rate limits, suporte e segurança.
- [backtesting.py](https://github.com/kernc/backtesting.py): métricas detalhadas de performance, custos/commission e resultados por trade; referência para o relatório de simulação.
- [VectorBT](https://github.com/polakowo/vectorbt): experimentos vetorizados, análise de portfólio e testes walk-forward; revisar a licença da edição comunitária e dependências antes de integrar.
- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts): gráficos web leves. Licença Apache 2.0 com exigência de atribuição da TradingView; respeitar `NOTICE` e a atribuição na página.

Esta é uma revisão arquitetural inicial baseada em documentação e código público selecionado, não uma auditoria linha a linha de todo o universo GitHub. Antes de integrar dependências, revisar licença, versão fixada, vulnerabilidades, testes e manutenção.

## 9. Dados Supabase — proposta, ainda sem migração

O schema `adonai_trade` consultado contém `integration_status` com quatro componentes (`trade_server`, `github`, `eu_sou`, `levi`). Isso é insuficiente para guardar tarefas, estado de sala, decisões e evidências. Entretanto, não criar tabelas duplicadas antes de revisar o RH local e as migrações existentes.

Modelo alvo a considerar:
- `desk_tasks`: tarefa, mesa, agente, estado, correlação e timestamps.
- `desk_decisions`: hipótese, recomendação, risco, aprovador e evidências.
- `desk_events`: log append-only para visualização/auditoria.
- `paper_orders` e `paper_fills`: ordens e execuções simuladas com custos.
- `integration_checks`: verificações datadas e evidência, não status manual presumido.

Requisitos: RLS habilitado; políticas mínimas; acesso de escrita apenas no backend autenticado; nenhuma chave de serviço no frontend; retenção e auditoria; idempotência; restrições de estado; não registrar segredos; migração versionada e rollback. Só implementar depois de confirmar grants, policies, contratos do RH e plano de testes.

## 10. Critérios de aceitação

- [ ] RH Trade auditado e inventário real reconciliado com a matriz de competências.
- [ ] Quatro mesas têm endpoints/estado próprio e testes, sem cruzar dados com PSM ou RH geral.
- [ ] LEVI seleciona agentes por competências e grava correlação, resultados e falhas.
- [ ] EU SOU retorna evidência, versão, parâmetros, incerteza e limitações; execução reproduzível.
- [ ] Risco pode bloquear propostas e o bloqueio é auditado.
- [ ] Paper trading contabiliza custos e slippage; nenhuma ordem real sem autorização e controles explícitos.
- [ ] UI 3D usa eventos reais e mostra indisponibilidade sem simular atividade.
- [ ] Supabase policies/grants e testes de acesso aprovados antes de gravar dados operacionais.
- [ ] Testes unitários, integração, regressão e smoke passam; resultados e comandos ficam documentados.
- [ ] Documentação distingue claramente implementado, testado, validado e ainda planejado.

## 11. Próxima dependência de implementação

O código de `adonai-trade/index.html`, `adonai-trade/server.js` e `adonai-trade/lib/rh.js` não estava disponível no caminho correspondente do repositório remoto consultado. Portanto, a próxima etapa é inspecionar a cópia local real, sem abrir navegador e sem alterar arquivos: confirmar assinaturas do RH, inventariar agentes e testes, e só então implementar os adaptadores e testes compatíveis com o código existente.
