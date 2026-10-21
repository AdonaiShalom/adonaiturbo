# Plano de execução e cobrança pelo RH — Norma ES-EUS-RISCO-001

**Estado:** PENDENTE DE IMPLEMENTAÇÃO E HOMOLOGAÇÃO  
**Norma relacionada:** [LEI-FUNDAMENTAL-EU-SOU-GESTAO-DE-RISCO.md](LEI-FUNDAMENTAL-EU-SOU-GESTAO-DE-RISCO.md)  
**Regra:** não marcar qualquer item como concluído sem evidência verificável.

## Cobrança obrigatória do RH

O RH deverá, quando implementado, cobrar a norma e cada melhoria aprovada de forma recorrente, registrando responsável, prazo, evidência esperada, evidência recebida, estado, data da última cobrança, próxima cobrança e escalonamento.

### Checklist de conformidade

- [ ] Norma versionada e acessível aos componentes envolvidos.
- [ ] RH possui registro persistente de tarefas e pendências.
- [ ] Cada tarefa tem responsável, prazo, evidência e estado.
- [ ] Cobranças recorrentes e escalonamentos foram implementados e testados.
- [ ] Fluxo EU SOU → LEVI → RH → quatro mesas está integrado.
- [ ] Relatórios das mesas retornam ao LEVI e ao EU SOU.
- [ ] O EU SOU consegue avaliar resultados e propor uma nova versão.
- [ ] Melhorias passam por testes e aprovação antes da produção.
- [ ] Limites de risco e bloqueios não podem ser contornados por modelos experimentais.
- [ ] Auditoria registra versões, decisões, testes e reversões.
- [ ] Testes de regressão, simulação e rollback passaram.
- [ ] Evidências de homologação foram publicadas.

## Evidência inicial já obtida

Data: 2026-10-21. Um teste HTTP local comprovou o encaminhamento LEVI → EU SOU para `analisar_gestao_risco` no mercado cripto; retorno `motor=eu-sou`, resultado `status=APROVADO` e `ordens_reais=false`.

## Lacunas conhecidas

O teste acima não comprova o fluxo completo do RH e das quatro mesas, a persistência de tarefas, a cobrança recorrente, os escalonamentos, nem a validade financeira de modelos quânticos/nanoquânticos. Esses itens permanecem pendentes até que sejam implementados e testados.

## Critério de encerramento

Só encerrar quando cada item aplicável tiver evidência reproduzível, logs ou testes anexados, revisão documentada e aprovação formal. A documentação da norma não substitui a implementação. Nenhuma ordem real é necessária para homologar este fluxo.
