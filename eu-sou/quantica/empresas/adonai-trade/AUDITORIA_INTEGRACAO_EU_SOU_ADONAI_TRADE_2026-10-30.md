# Auditoria de integração — EU SOU / Adonai Trade
**Data:** 2026-10-30  
**Base examinada:** `main` do repositório `AdonaiShalom/adonaiturbo`  
**Branch de trabalho do procedimento:** `work/eu-sou-prompt-operacao-cripto-e2e-20261030`  
**Modo da auditoria:** leitura de código e documentação; nenhuma execução de ordens, nenhuma alteração em produção.

## 1. Resultado executivo

**Estado: PARCIAL / BLOQUEADO PARA EXECUÇÃO.**

O repositório contém uma fatia de descoberta de cripto, um avaliador heurístico de oportunidades, um gate fail-closed e contratos de tarefa. Não há evidência no runtime versionado de análise científica completa das quatro finalistas, encaminhamento efetivo desse resultado ao LEVI e envio/gestão de ordens Binance Futures Demo.

A documentação do próprio EU SOU declara que a pasta Adonai Trade é uma especificação de conhecimento versionada, cuja ingestão na biblioteca local e execução por agentes ainda precisam de validação. O playbook descreve métodos desejados, mas não comprova instalação ou execução.

## 2. Evidências por componente

| Componente | Evidência observada | Estado |
|---|---|---|
| Descoberta | `adonai-trade/runtime/crypto-discovery.cjs` consulta CoinGecko e `demo-fapi.binance.com/fapi/v1/exchangeInfo`; filtra `TRADING`, `PERPETUAL`, `USDT`. | Existe; leitura somente |
| Lotes | Descoberta aceita no máximo 250 ativos por página e página 1–40. | Paginação existe; execução de 40 lotes não comprovada |
| Funil | `crypto-opportunity-funnel.cjs` aceita até 10.000 registros por chamada, valida frescor/duplicidade/contrato e calcula `expected_return_pct - spread_bps/100 - volatility_pct*0.25`. | Heurístico simples |
| Finalistas | Mesmo módulo seleciona até 5 candidatos com score positivo. | Não implementa seleção formal de 40 e depois 4 |
| Testes do funil | `test-crypto-opportunity-funnel.cjs` cobre duplicidade, contrato não verificado, dado vencido, limite máximo e modo sem execução. | Testes de contrato existem; não provam 10.000 análises reais |
| Gate | `policy-gate.cjs` valida envelope, modo paper, proveniência/frescor e risco independente. | Existe; fail-closed |
| Resultado do gate | O gate retorna `proposal_only`; comentário do código afirma que não transmite ordem. | Não é executor |
| Runtime | `runtime/server.cjs` expõe descoberta, cotação, tarefas RH e `POST /api/v1/policy/evaluate`. A avaliação registra auditoria e retorna `execution_performed:false`. | Não foi encontrada rota de ordem Demo no runtime examinado |
| Contrato | `contracts/v1/EXECUTION_CONTRACT.md` diz explicitamente que a fatia inicial não conecta provedores nem executa ordens. | Contrato documental |
| Conhecimento EU SOU | `eu-sou/quantica/empresas/adonai-trade/README.md` declara ingestão local e execução por agentes pendentes de validação. | Conteúdo preparado, não prova de ingestão |
| Métodos científicos | Playbook pede baseline clássico, walk-forward, custos, slippage, drawdown e paper trading. | Critérios documentados, não implementação comprovada |
| Métodos quânticos | Documentação exige QUBO/Ising quando adequado e comparação com baseline clássico. | Pesquisa planejada; sem benchmark operacional demonstrado |

## 3. Separação importante entre repositório e ambiente local

O documento `eu-sou/STATUS_ATUAL.md` registra que o repositório consultado não contém os arquivos centrais do backend local (`backend/server.js`, `backend/levi-core.js`, `frontend/eu-sou-completo/biblioteca-local/server.py`). A auditoria anterior do ambiente local informou testes de API e integração LEVI → EU SOU, mas esses resultados são evidência do ambiente observado naquela sessão, não deste repositório.

Consequência: não alterar os arquivos locais nem presumir sincronização com GitHub. Antes de implementar a ponte real, localizar e identificar o repositório/commit correto do backend local e obter uma cópia de trabalho correspondente.

## 4. Lacunas funcionais bloqueadoras

1. **Orquestração do funil:** não há evidência versionada de execução persistente de 40 lotes de 250, agregação deduplicada e trilha completa do ciclo V3.1.
2. **Segundo ciclo:** não há evidência de 10.000 avaliações sobre o universo de 40 ativos, nem seleção final de exatamente quatro candidatos elegíveis.
3. **Contrato de quatro finalistas:** falta schema versionado que represente as quatro finalistas, dados por campo, métricas, proveniência, timestamps, versão do algoritmo, IDs e hashes.
4. **Análise científica:** falta módulo/contrato executável que receba as quatro finalistas e produza estudo reproduzível por ativo, LONG/SHORT, calibração, retorno líquido, risco, validação temporal e comparação.
5. **Integração EU SOU:** falta evidência no repositório de chamada autenticada ao motor científico real e retorno estruturado com evidências.
6. **Gate:** o gate atual aceita contexto científico genérico, mas não valida todos os campos do contrato científico proposto. A extensão deve ocorrer no gate existente; não criar gate concorrente.
7. **LEVI:** falta prova de que o contrato científico completo é transportado sem alteração e com o mesmo `correlation_id`/IDs.
8. **Execução Demo:** falta adaptador/rota comprovada para envio, consulta, preenchimento, proteção, cancelamento seguro e reconciliação de ordens Binance Futures Demo.
9. **Monitoramento:** falta retorno estruturado do resultado realizado ao EU SOU e avaliação pós-operação.
10. **Testes ponta a ponta:** faltam testes com fixtures reproduzíveis para caminho completo, falhas, idempotência, expiração, proteção e confirmação independente de ordem Demo.

## 5. Plano de implementação recomendado

### Fase A — localizar e congelar a fonte verdadeira
- Identificar repositório, branch e commit do backend local EU SOU/LEVI.
- Comparar arquivos locais e remotos; registrar hashes.
- Não copiar nem sobrescrever componentes até a reconciliação.

### Fase B — contratos e funil
- Criar schemas versionados para lote, conjunto de 40 e pacote de quatro finalistas.
- Implementar orquestração persistente dos 40 lotes de 250 e o segundo ciclo de 10.000 avaliações.
- Garantir IDs idempotentes, hashes, logs de exclusão e auditoria por lote.
- Testar com fixtures e provar contagens, deduplicação e reprocessamento seguro.

### Fase C — estudo científico EU SOU
- Implementar adaptador para quatro finalistas, com resultados independentes por ativo.
- Separar dados observados, cálculos, modelos, previsões e conclusões.
- Exigir baseline clássico, validação walk-forward, calibração, custos e risco.
- Marcar métodos quânticos como simulador, quantum-inspired ou hardware real; nunca inferir vantagem sem benchmark.

### Fase D — gate e LEVI
- Estender `policy-gate.cjs` para validar contrato científico, evidências, calibração, custos, limites, conta e validade.
- Manter um único gate independente.
- Transportar a decisão pelo LEVI sem alteração de parâmetros; auditar cada transição.

### Fase E — Binance Futures Demo
- Implementar adaptador separado e restrito ao endpoint Demo.
- Bloquear por código e configuração qualquer endpoint/credencial real.
- Fazer teste sem envio, depois teste de uma ordem Demo somente com autorização explícita.
- Confirmar ordem, fills, posição, proteção e reconciliação por consultas independentes.

### Fase F — aprendizagem e aceite
- Retornar resultado reconciliado ao EU SOU.
- Medir previsão versus resultado e atualizar relatório, sem retreino automático.
- Aceitar ponta a ponta somente com evidência E5; antes disso, manter como parcial.

## 6. Critérios de aceite

- [ ] 40 lotes de 250 efetivamente registrados e reconciliados.
- [ ] Segundo ciclo de 10.000 avaliações efetivamente registrado.
- [ ] Quatro finalistas elegíveis, deduplicadas e com proveniência completa.
- [ ] Quatro análises científicas reproduzíveis; LONG/SHORT avaliados.
- [ ] Baseline clássico, walk-forward, custos, calibração e riscos documentados.
- [ ] Gate independente existente aprova ou bloqueia com motivos auditáveis.
- [ ] LEVI transporta o mesmo contrato e IDs sem alteração.
- [ ] Ambiente Binance Futures Demo autenticado e confirmado.
- [ ] Ordem Demo, fills, posição e ordens protetivas confirmados independentemente.
- [ ] Resultado reconciliado e devolvido ao EU SOU.
- [ ] Ordens reais continuam desabilitadas e bloqueadas.

## 7. Segurança e limites desta auditoria

- Nenhuma ordem foi enviada.
- Nenhuma credencial foi lida ou exibida.
- Nenhum código de runtime foi alterado.
- Nenhum serviço local foi chamado nesta auditoria de GitHub.
- Nenhuma integração foi declarada concluída.
- A auditoria não substitui testes no ambiente local nem uma revisão de segurança do adaptador Demo.

**Próxima ação única:** localizar o repositório e o commit que contêm o backend local verdadeiro do EU SOU/LEVI; sem isso, qualquer patch de integração seria feito no lugar errado.
