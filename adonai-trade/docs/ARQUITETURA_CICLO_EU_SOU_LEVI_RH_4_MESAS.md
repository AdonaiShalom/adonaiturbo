# Arquitetura obrigatória — ciclo EU SOU → LEVI → RH → quatro mesas

**Status:** contrato-alvo de integração; não é prova de integração executável ponta a ponta.  
**Escopo:** Adonai Trade dentro do repositório AdonaiTurbo. PSM Grupo Market permanece separado e fora do escopo.  
**Modo de operação permitido nesta fase:** análise e paper trading; execução financeira real permanece desabilitada.

## 1. Lei de fluxo e responsabilidade

O fluxo canônico é:

`fontes → EU SOU → LEVI → RH/alçadas → mesa designada → motor de risco → proposta paper → auditoria → avaliação de resultado → aprendizado validado do EU SOU`

Nenhum componente pode saltar etapas, inverter a ordem de autoridade ou declarar uma integração ativa apenas porque existe uma URL configurada.

### EU SOU — cérebro científico
Recebe dados e referências de notícias, preços, índices, estatísticas, indicadores, pesquisa e documentos. Deve:
- validar origem, licença quando aplicável, timestamp, frescor, completude e consistência;
- separar observações, fatos verificados, hipóteses, inferências e previsões;
- executar análise matemática/estatística e comparar com uma linha de base clássica;
- quando pertinente, avaliar modelos quânticos e nanoquânticos, registrando método, parâmetros, hipóteses, incerteza, versão e limites;
- distinguir simulação clássica, resultado de hardware quântico real, estimativa teórica e evidência experimental;
- produzir um pacote de evidências e recomendação com validade temporal, confiança calibrada e condições de rejeição.

Cálculo quântico ou nanoquântico não é requisito artificial para toda notícia ou cotação: só deve ser usado quando houver método pertinente e verificável. Não se pode alegar vantagem quântica sem comparação reproduzível com a melhor linha de base clássica adequada.

### LEVI — orquestrador
Recebe a saída estruturada do EU SOU; verifica se há evidência suficiente, prazo válido e identificador de correlação; encaminha a tarefa para RH e para uma mesa compatível. LEVI coordena, mas não pode contornar veto do motor de risco nem conceder permissões que não existam no catálogo de alçadas.

### RH — hierarquia, competência e alçada
RH mantém papéis, responsáveis, competências, limites, tarefas e estado de aprovação. Deve validar:
- quem solicitou, quem analisou, quem revisou e quem autorizou;
- qual mesa e qual instrumento estão dentro da alçada;
- separação de funções entre pesquisa, recomendação, risco, autorização, simulação e auditoria;
- trilha de aprovação e justificativa de exceções.

Cadastro de cargo/equipe não significa que o agente esteja ativo nem que uma tarefa tenha sido executada. Atividade só pode ser declarada com evento/tarefa persistida e evidência verificável.

### Quatro mesas — autoridade delimitada
Cada mesa pode produzir recomendações e propostas de compra/venda em modo paper, somente dentro de seu mandato e alçadas explícitas:

1. **CRYPTO** — ativos digitais, venue, taxas, funding, spread, liquidez e precisão do instrumento.
2. **FOREX** — pares cambiais, bid/ask, pip/lot, conversão, sessão, feriados, rollover e slippage. Referência diária não pode ser exibida como cotação intradiária.
3. **B3** — instrumentos brasileiros, calendário, leilões, ajustes/proventos, atraso, licença e fonte.
4. **INTERNATIONAL** — bolsas/ativos internacionais, fuso UTC, moeda, calendário local, corporate actions, custos e divergência entre fontes.

Cada mesa precisa ter sua própria hierarquia explícita e testável: analista → revisor → responsável pela mesa → alçada de risco/autorização conforme a política. Os nomes concretos, limites e papéis válidos devem vir do catálogo persistido de RH, não de suposições da interface. A mesa não pode autorizar a própria exceção de risco.

## 2. Envelope comum e correlação

Cada trabalho deve usar envelope versionado com, no mínimo:
- `schema_version`, `correlation_id`, `task_id`, `requested_by`, `market`, `task_type`, `mode`, `created_at`, `expires_at`, `payload`;
- `data_context`: provedor, timestamp observado, referência de licença quando necessária e qualidade;
- `scientific_context`: método, linha de base, incerteza e referências de evidência;
- identificação da versão do modelo, estratégia, instrumento e contexto de risco quando aplicáveis.

O mesmo `correlation_id` deve acompanhar EU SOU → LEVI → RH → mesa → risco → decisão paper → auditoria → resultado. Respostas fora de prazo, dados vencidos ou inválidos e correlação ausente/inconsistente devem ser bloqueados.

## 3. Estados obrigatórios da decisão

- `RECEIVED`: tarefa recebida, ainda sem conclusão científica.
- `RESEARCHED`: dados e fontes avaliados pelo EU SOU.
- `RECOMMENDED`: recomendação emitida com evidências e incerteza.
- `ORCHESTRATED`: LEVI encaminhou ao destino adequado.
- `PENDING_AUTHORIZATION`: RH ainda precisa validar competência/alçada.
- `RISK_BLOCKED`: política de risco recusou ou colocou em quarentena.
- `PAPER_APPROVED`: proposta aprovada para simulação, não para execução real.
- `PAPER_RECORDED`: simulação/decisão e auditoria persistidas.
- `EVALUATED`: resultado comparado com a hipótese e benchmark.
- `LEARNING_CANDIDATE`: possível melhoria aguardando validação.
- `PROMOTED`: melhoria validada, versionada e aprovada para uso futuro.

Uma falha de integração, auditoria ou dependência não pode avançar automaticamente o estado. Não transformar `unknown`, `stale`, `unverified` ou `unavailable` em aprovado.

## 4. Portões de segurança que não podem ser ignorados

Antes de qualquer proposta paper, exigir:
- proveniência e frescor de dados verificados;
- envelope e validade temporal corretos;
- hierarquia e alçada RH válidas;
- política independente de risco aprovada;
- custos, liquidez, exposição, concentração e limites de perda conhecidos;
- idempotência/replay controlados;
- kill switch e estado de pausa respeitados;
- gravação de auditoria persistente disponível.

Se o risco não puder ser calculado, se a auditoria falhar, ou se houver conflito não resolvido entre evidências, bloquear. Nesta fase, toda resposta deve manter `mode: paper` e `execution_enabled: false`. A autoridade conceitual de compra/venda das mesas não habilita ordens reais.

## 5. Ciclo de aprendizado contínuo

Para cada decisão, registrar hipótese, dados usados, método/versão, recomendação, aprovações, decisão de risco, resultado observado e benchmark. O aprendizado deve:
1. comparar previsão com resultado real e medir erro, calibração, custos e drawdown;
2. identificar viés, vazamento de dados, mudança de regime e falhas de proveniência;
3. criar candidato de melhoria separado da versão em produção;
4. executar testes temporais fora da amostra, testes de regressão e comparação com a linha de base;
5. exigir revisão/aprovação antes de promover a versão;
6. manter rollback, histórico imutável e explicação do motivo da promoção.

Resultados ruins não devem ser apagados; geram evidência e revisão. O sistema evolui continuamente, mas nenhuma atualização pode retirar as regras de segurança.

## 6. Contratos HTTP e separação de serviços

- Adonai Turbo: porta local 3000.
- Protótipo oficial da sede 3D: rota `/sede3d` no serviço local legado da porta 3100. Não confundir com `/trade3d-operacional`, que não é o protótipo oficial.
- Runtime isolado de integração/paper: porta local 3107.
- PSM Grupo Market: serviço separado na porta 3001; fora do escopo.

O status de integração deve separar configuração, conectividade, autenticação, teste de contrato e execução ponta a ponta. Uma URL configurada não equivale a `verified`. Nunca mover credenciais para HTML/navegador.

## 7. Diagnóstico observado no código do repositório

A inspeção do código versionado mostra componentes úteis, mas ainda não prova o ciclo completo:
- `runtime/integration-status.cjs` declara endpoints LEVI/EU SOU e explicitamente retorna `not_verified`; não realiza as chamadas aos serviços.
- `runtime/market-desks.cjs` lista as quatro mesas e mantém `execution_enabled: false`; configuração de provedor não comprova cotação disponível.
- `runtime/policy-gate.cjs` valida envelope, modo paper, qualidade/proveniência e contexto científico opcional; o contexto científico ainda não é obrigatório em todas as tarefas.
- `runtime/rh-store.cjs` lê papéis/tarefas persistidos, mas cadastro não comprova que as tarefas foram encaminhadas pelo ciclo.
- A documentação do runtime informa que a escrita/leitura real do ledger e o teste autenticado ponta a ponta LEVI/EU SOU continuam sendo portões separados a comprovar.

Portanto, a arquitetura descrita aqui é o contrato obrigatório para implementação e testes; não declarar EU SOU → LEVI → RH → quatro mesas integrado até que a sequência seja demonstrada por teste de contrato/ponta a ponta e eventos correlacionados persistidos.

## 8. Critérios de aceite para declarar alinhamento

- [ ] Teste mostra que notícia, cotação, índice e estatística entram no pipeline de pesquisa do EU SOU, com fonte/frescor.
- [ ] Teste demonstra análise matemática e, quando pertinente, avaliação quântica/nanoquântica com método, baseline e incerteza.
- [ ] Teste demonstra que LEVI consome a saída do EU SOU e encaminha usando o mesmo `correlation_id`.
- [ ] Teste demonstra que RH valida a hierarquia e bloqueia ator sem competência/alçada.
- [ ] Testes separados demonstram roteamento para CRYPTO, FOREX, B3 e INTERNATIONAL.
- [ ] Cada mesa tem papéis e permissões persistidos; compra/venda em paper exige aprovação e passa pelo motor de risco independente.
- [ ] Dados vencidos, endpoint indisponível, contexto científico requerido ausente, risco desconhecido e falha de auditoria bloqueiam o avanço.
- [ ] Ledger registra a cadeia completa e permite recuperar eventos correlacionados.
- [ ] Resultado paper é comparado com benchmark; melhoria não entra em uso sem validação e aprovação.
- [ ] Testes unitários, integração, smoke, regressão e rollback passam.
- [ ] UI apresenta status real e não simula agentes ativos, cotações verificadas ou ordens executadas.

**Regra de conclusão:** só marcar item como concluído com comando/teste, saída observada, artefato/versionamento e evidência persistida.