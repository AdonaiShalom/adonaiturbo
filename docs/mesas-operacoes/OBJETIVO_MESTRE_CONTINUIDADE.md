# OBJETIVO MESTRE E CONTINUIDADE — ADONAI TRADE

**Responsável pelo projeto:** Esdras Affonso  
**Data de registro:** 2026-10-16  
**Meta permanente:** concluir 100% do AdonaiTrade, com quatro mesas de operações integradas, testadas, seguras, documentadas e publicadas no ambiente correto, sem perder o foco entre sessões.

Este documento é o ponto de retomada do projeto. Atualizá-lo conforme as evidências forem obtidas. Não tratar plano, documentação, interface demonstrativa ou teste isolado como prova de sistema completo.

## 1. Regra de foco permanente

Em toda sessão de trabalho:
1. Retomar lendo este documento e os artefatos vinculados antes de iniciar tarefas.
2. Informar fase atual, evidências concluídas, trabalho em andamento, bloqueios, próximo passo e progresso comprovado.
3. Continuar do último passo ainda aberto; não reiniciar auditorias já comprovadas sem motivo.
4. Priorizar o caminho que move o projeto para conclusão; evitar tarefas cosméticas que não resolvem integração, segurança ou operação.
5. Não declarar 100% até todos os critérios de aceite deste documento serem verificados.
6. Seguir o ciclo obrigatório: **concluir → testar → validar → documentar → publicar → avançar**.
7. Distinguir claramente: planejado, implementado, testado, validado, publicado e operacional.

## 2. Objetivo final

Entregar um sistema profissional AdonaiTrade com quatro mesas:
- **B3:** ações brasileiras, microestrutura, liquidez, calendário de pregões/leilões, eventos corporativos e risco por ativo/setor.
- **Internacional:** bolsas globais, setores, moedas, calendários por fuso/bolsa, macroeconomia e conversão de moeda.
- **Cripto:** spot e derivativos separados, liquidez/livro de ordens, funding, liquidação, tokenomics, limites de API e risco de exchange.
- **Forex:** pares e fontes de cotações, bid/ask, spread, swaps/rollover, frequência/frescor dos dados, bancos centrais e calendário macro.

Integrar as quatro mesas com RH AdonaiTrade, orquestrador LEVI, cérebro científico EU SOU, serviços de dados, auditoria, motor independente de risco, simulação/paper trading, observabilidade e interface operacional profissional (incluindo sala 3D conectada a eventos reais, não atividade fictícia).

## 3. Hierarquia e limites de decisão

1. **Governança humana:** escopo, permissões, limites de capital, aprovação de releases e quaisquer decisões de operação real.
2. **LEVI — orquestração:** recebe intenção, classifica, escolhe a mesa e delega tarefas rastreáveis; não tem poder para contornar controles.
3. **EU SOU — pesquisa e cálculos:** fornece fontes, métodos, cálculos reprodutíveis, baselines, incerteza, limitações e revisão científica. “Quântico” ou “nanotecnologia quântica” não devem ser alegações decorativas nem promessa de vantagem financeira.
4. **Mesa especializada:** analisa apenas dentro do mandato e dos dados válidos da sua classe de mercado.
5. **Motor determinístico independente de risco:** aplica limites, frescor, exposição, drawdown, custos e kill switch; pode vetar qualquer proposta, inclusive a de LEVI.
6. **Operações/dados:** saúde de conectores, qualidade, latência, reconciliação e observabilidade.
7. **Auditoria/compliance/segurança:** trilha de decisão, autorização, licenças, segredos, testes e controles de acesso.
8. **RH e qualificação:** registra funções, responsabilidades, competências e resultados de treinamento. Uma função lógica planejada não equivale a agente real, pessoa contratada ou processo ativo.

Nenhuma saída de LLM cria diretamente uma ordem. Dados ausentes, vencidos ou inválidos, timeout, erro de autenticação, resposta inválida ou risco excedido resultam em bloqueio seguro.

## 4. Rastreamento obrigatório

Cada tarefa/decisão precisa, conforme aplicável, de:
- `correlation_id`, mesa, tipo de tarefa, solicitante e timestamp UTC;
- fonte, timestamp do dado, frescor e licença/termos de uso;
- hipótese, método, versão de código/modelo e parâmetros;
- baseline, incerteza, limitações e resultado;
- decisão do motor de risco, motivo do bloqueio/aceite e estado de simulação;
- auditoria de quem/qual serviço solicitou e executou cada ação.

## 5. Fases de execução

**Fase A — Reconciliar fonte de verdade**
- Diagnosticar a cópia local `C:\AdonaiTurbo\AdonaiTrade`, branch/status Git e arquivos-chave.
- Comparar com a branch GitHub de trabalho `work/adonai-trade-professionalization-20261016` e com o conteúdo de PRs existentes.
- Inspecionar o smoke test antes de executá-lo; ele pode modificar/apagar arquivos de `data`. Não executar smoke na cópia original sem análise do efeito e backup verificado.
- Remover segredos dos artefatos públicos; não imprimir conteúdo de .env.
- Aceite: fonte de verdade identificada, árvore comparada, mudanças locais preservadas e testes seguros selecionados.

**Fase B — Contratos e RH**
- Definir contratos versionados entre LEVI, EU SOU e cada mesa; schema, autenticação/autorização, timeout, correlação, idempotência, repetição e auditoria.
- Mapear cada função do RH para responsabilidade, permissões mínimas, entradas/saídas, critérios de qualidade e escalonamento humano.
- Aceite: contratos e matriz de responsabilidade revisados; casos negativos cobertos.

**Fase C — Quatro mesas e controles**
- Validar requisitos específicos de B3, Internacional, Cripto e Forex.
- Implementar/confirmar frescor de dados, custos, spread/slippage, exposição, limites, drawdown, kill switch e reconciliação.
- Aceite: testes positivos e negativos por mesa; nenhum caminho que contorne o motor independente de risco.

**Fase D — EU SOU e conhecimento**
- Curadoria com fonte rastreável, licença, data, método, revisão e versão.
- Cálculos reproduzíveis e comparação com baseline clássico. Só chamar algoritmo de quântico/híbrido quando tecnicamente justificável; não presumir superioridade ou lucro.
- Aprendizado não muda regras de produção nem promove recomendações automaticamente sem revisão/controles.
- Aceite: evidência reproduzível, limites declarados e revisão registrada.

**Fase E — Paper trading**
- Simulação determinística/reproduzível com custos, spread, slippage, latência, falhas, eventos e dados de qualidade conhecida.
- Avaliação por mesa e carteira, incluindo exposição conjunta e validação fora da amostra.
- Aceite: relatórios repetíveis e reconciliação; nenhuma ordem real é possível pelo caminho de simulação.

**Fase F — Sala operacional e visualização 3D**
- Centro LEVI; salas B3, Internacional, Cripto e Forex; laboratório EU SOU; risco; operações/dados; auditoria.
- Indicadores, alertas, tarefas e estados vêm de APIs/eventos persistidos. Não inventar avatares “trabalhando” sem heartbeat recente; estado expirado deve ser offline/desconhecido.
- Fornecer vista tabular acessível equivalente e tratar queda/reconexão da API.
- Aceite: reconciliação UI/API demonstrada e estado real observável.

**Fase G — Segurança e infraestrutura**
- Verificar autenticação, autorização, CORS, rate limits, segredos, logs, dependências/licenças, RLS, grants e policies.
- Supabase: inspecionar migrations existentes e histórico antes de qualquer DDL; não duplicar tabelas nem afrouxar políticas. Preservar a política de leitura restrita do conhecimento curado.
- Render: identificar o serviço correto do AdonaiTurbo/Trade. O workspace observado listou `psm-grupo-market`; não tocar nele nem utilizá-lo como destino de Trade.
- Aceite: testes de acesso permitido/negado, logs sem segredos, health checks, rollback documentado e serviço de destino confirmado.

**Fase H — Publicação e operação**
- CI com testes determinísticos, regressões, versões e artefato reproduzível.
- Publicar somente após aprovação dos gates e confirmação de repositório, branch e serviço corretos.
- Monitorar logs, métricas, falhas, frescor, reconciliação e recuperação.
- Aceite: release identificada, testes pós-deploy e rollback verificável.

## 6. Pesquisa open source já iniciada

Candidatos revisados seletivamente (não são auditorias linha a linha nem adoção automática):
- Freqtrade — referências de dry-run, custos e execução simulada.
- QuantConnect LEAN — controles determinísticos de drawdown separados dos sinais.
- TradingAgents — debate adversarial limitado; não substitui evidência nem controles.
- CCXT — candidato para adaptadores cripto após revisão de licença, versão, permissões e rate limits.
- TradingView Lightweight Charts — visualização, não fonte de dados ou executor; licença Apache 2.0 observada na revisão inicial.
- Qiskit Algorithms — verificar manutenção e comparar com baselines clássicos; README consultado sinalizou suporte oficial limitado/descontinuado.

Antes de incorporar qualquer projeto: revisar licença, manutenção, cadeia de dependências, segurança, interfaces e adequação; documentar quais arquivos/ideias foram aproveitados. Nunca copiar código sem cumprir licença.

## 7. Estado conhecido e limites (16/10/2026)

- Testes locais anteriores foram reportados como aprovados em suítes unitárias, mesas/equipes, módulos de conhecimento, auditoria, Monte Carlo, controles de risco e API smoke. Isto não comprova a aplicação inteira nem o funcionamento em produção.
- Testes Forex unitário/histórico/API e resposta HTTP 200 na porta 3100 foram reportados em uma execução anterior.
- Há documentação de auditoria inicial em `docs/mesas-operacoes/RELATORIO_AUDITORIA_INICIAL.md` na branch de trabalho.
- Foi preparado o script `scripts/mesas-operacoes/Diagnostico-AdonaiTrade.ps1` para inventário local; deve ser relido/revisado antes de execução e seu relatório é necessário para reconciliar o código local.
- O plano está em `docs/mesas-operacoes/PLANO_EXECUCAO_VERIFICAVEL.md`.
- PRs de documentação/arquitetura existem no repositório; verificar seu estado atual antes de abrir duplicatas ou integrar alterações.
- Supabase foi inspecionado sem alterações nesta etapa; registros de `adonai_trade.integration_status` são registros de estado, não comprovação de health check em tempo real.
- O Render conectado listou `psm-grupo-market`; nenhum serviço Render do Adonai Turbo/Trade foi confirmado.
- A implementação da sala 3D ligada a eventos reais e a integração ponta a ponta LEVI ↔ EU SOU ↔ quatro mesas não foram comprovadas.
- Não há autorização para negociação real. O padrão permanece paper trading.
- A conexão atual não executa comandos arbitrários no Windows nem dá acesso direto ao disco local; essas etapas exigem PowerShell e retorno das evidências.

## 8. Pesquisa e arquitetura-alvo: segurança financeira

- Sem capital real, chaves de saque, execução real ou autonomia financeira por padrão.
- Antes de qualquer futura operação real, exigir autorização humana explícita e separada, corretora/feed identificados, limites de capital e exposição, kill switch testado, reconciliação, revisão de compliance e bateria de testes.
- Segredos só no gestor de segredos/ambiente privado; jamais no Git, logs, relatórios ou interface.
- Não mesclar AdonaiTrade/AdonaiTurbo com PSM Grupo Market; preservar as portas e os ambientes independentes já definidos.

## 9. Checklist de conclusão a manter atualizado

Não marcar como concluído sem evidência:
- [ ] Fonte local/GitHub reconciliada e segura.
- [ ] RH e hierarquia com funções, permissões e critérios de qualidade.
- [ ] Contratos LEVI ↔ EU SOU ↔ cada mesa versionados e testados.
- [ ] Mesa B3 testada, incluindo casos de falha.
- [ ] Mesa Internacional testada, incluindo casos de falha.
- [ ] Mesa Cripto testada, incluindo casos de falha.
- [ ] Mesa Forex testada, incluindo casos de falha.
- [ ] Motor independente de risco, limites e kill switch testados.
- [ ] Dados, custos, frescor e auditoria verificados.
- [ ] EU SOU com cálculos/fonte/baseline reprodutíveis e revisão.
- [ ] Paper trading reproduzível e reconciliação de carteira.
- [ ] Interface 3D e painel alternativo conectados a eventos reais.
- [ ] Segurança, RLS/grants/policies, dependências e segredos revisados.
- [ ] CI/regressões e release/rollback comprovados.
- [ ] Serviço de destino correto identificado; publicação e health checks aprovados.
- [ ] Documentação operacional, limitações, alertas e plano de recuperação entregues.

**Meta 100%:** todos os itens acima concluídos com evidência, nenhum bloqueio crítico aberto e operação verificada no ambiente de destino. Até então, informar progresso por etapa com base em testes e commits, nunca estimar uma porcentagem global sem medir critérios.

## 10. Formato obrigatório do relatório de cada sessão

- **Meta:** concluir 100% do AdonaiTrade.
- **Fase atual:**
- **Concluído nesta sessão + evidências (arquivos/commits/testes/resultados):**
- **Em andamento:**
- **Pendências/bloqueios:**
- **Próximo passo concreto:**
- **O que exige PowerShell do usuário:**
- **Segurança/ambientes preservados:**
- **Estado da conclusão:** não declarar 100% até todos os critérios serem comprovados.
