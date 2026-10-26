# Norma fundamental EU SOU — Governança de risco e melhoria contínua

- **Código:** ES-EUS-RISCO-001
- **Versão:** 1.0
- **Estado:** Norma proposta registrada; implementação e homologação operacional pendentes.
- **Escopo:** EU SOU, LEVI, RH e quatro mesas operacionais (analistas, traders e sistemas associados).

## Princípio obrigatório

A gestão de risco deve funcionar como ciclo contínuo, auditável e baseado em evidências. O EU SOU estuda, avalia e propõe melhorias; o LEVI orquestra e encaminha; o RH distribui, coordena e cobra evidências de execução; as quatro mesas, analistas e traders executam somente tarefas autorizadas e devolvem relatórios. O LEVI consolida esses relatórios e os encaminha ao EU SOU, que analisa os resultados e inicia o ciclo seguinte.

## Responsabilidades

1. **EU SOU — governança científica:** avaliar riscos clássicos, quânticos e nanoquânticos; distinguir hipótese de método validado; analisar relatórios; propor, testar e versionar melhorias; documentar evidências, limitações e critérios de aprovação.
2. **LEVI — orquestração:** encaminhar recomendações aprovadas, coordenar o fluxo entre EU SOU, RH e mesas, reunir relatórios e registrar falhas, pendências e incidentes.
3. **RH — cobrança e conformidade:** transformar cada norma e melhoria aprovada em tarefas atribuídas, prazos, responsáveis, evidências exigidas e estado verificável; cobrar pendências; escalar atrasos e descumprimentos; impedir que uma tarefa seja marcada como concluída sem evidência. O RH não pode modificar limites de risco por conta própria.
4. **Quatro mesas, analistas e traders — execução:** operar dentro dos limites autorizados, registrar dados e decisões, reportar resultados e incidentes e nunca contornar bloqueios de segurança.

## Ciclo obrigatório

1. Estudar evidências e riscos.
2. Propor uma melhoria com justificativa, versão e critérios mensuráveis.
3. Validar por testes reproduzíveis, simulação/paper trading e comparação com a versão vigente.
4. Aprovar formalmente antes de uso operacional.
5. Encaminhar pelo LEVI e distribuir pelo RH com responsável e prazo.
6. Executar nas mesas somente dentro das permissões e limites vigentes.
7. Relatar resultados, perdas, desvios, incidentes e qualidade dos dados.
8. Consolidar e encaminhar relatórios pelo LEVI ao EU SOU.
9. Avaliar resultados, registrar conclusões e iniciar novo ciclo.
10. Reverter ou suspender mudanças que falhem nos critérios de segurança ou desempenho.

## Regras de segurança

- Aprendizagem contínua não significa alteração automática de regras de produção.
- Modelos quânticos e nanoquânticos são experimentais até validação específica e autorização formal; não podem remover stops, aumentar limites ou autorizar operações por si mesmos.
- Dados ausentes, vencidos, inconsistentes, falta de autorização ou falha de controles essenciais devem levar a bloqueio ou revisão conforme política de cada mercado.
- Cada mudança deve preservar versão anterior, evidências, aprovador, data, critérios de rollback e trilha de auditoria.
- Limites de risco devem ser definidos e validados por mercado; não há garantia de ausência de perdas.
- Nenhuma operação real é autorizada por este documento.

## Obrigação de cobrança pelo RH

O RH deverá manter um registro de conformidade com, no mínimo: identificador da norma/tarefa, versão, responsável, prazo, evidências requeridas, evidências recebidas, estado, data de revisão, motivo de pendência e escalonamento. Estados permitidos: **PENDENTE**, **EM EXECUÇÃO**, **AGUARDANDO EVIDÊNCIA**, **REPROVADO**, **APROVADO** e **SUSPENSO**. A conclusão exige evidência verificável e validação; não basta declaração verbal.

O RH deverá cobrar a execução desta norma em cada ciclo e reabrir a tarefa quando houver regressão, ausência de evidência ou descumprimento. Essa cobrança deve ser implementada em software e validada com testes; este documento sozinho não prova que a automação já existe.

## Critérios mínimos de homologação

- Testes demonstram o fluxo EU SOU → LEVI → RH → quatro mesas → relatórios → LEVI → EU SOU.
- Pendências sem evidência permanecem abertas e são cobradas/escaladas.
- Alterações não aprovadas não chegam à produção.
- Bloqueios de risco não podem ser contornados por recomendações experimentais.
- Relatórios e decisões são rastreáveis e versionados.
- Testes de regressão, simulação e reversão são documentados.

## Situação atual

O teste local registrado em 2026-10-21 comprovou o encaminhamento LEVI → EU SOU para `analisar_gestao_risco` no mercado cripto, com resposta `APROVADO` e `ordens_reais=false`. Isso não comprova ainda o fluxo completo com RH e quatro mesas, a execução automática da cobrança, nem a validação operacional dos modelos quânticos/nanoquânticos. Essas etapas permanecem pendentes até evidência.

**Princípio permanente:** EU SOU estuda e melhora; LEVI coordena; RH distribui e cobra; mesas executam com segurança; relatórios retornam; EU SOU aprende. O ciclo continua, sem sacrificar controles ou evidências.


## Aditivo V1.1 — evidência por função e melhoria controlada

Aplicar o ciclo a cada departamento, categoria e função: estudar evidências; formular melhoria mensurável; testar em ambiente seguro; comparar com baseline; revisar independentemente; aprovar; distribuir pelo RH; coordenar pelo LEVI; executar dentro das permissões; medir o resultado; devolver ao EU SOU; registrar a lição e reiniciar.

O RH mantém responsável, prazo, critério de aceite, evidência e estado; sem prova, a tarefa permanece pendente. EU SOU distingue hipótese, simulação, teste com mocks e confirmação de provedor. LEVI não contorna risco; traders não executam proposta bloqueada. Limites críticos não podem ser alterados por aprendizagem automática.

Para Binance Futures Demo, saldo e posições devem ser consultados pela API autenticada. Os 5.000 USDT informados permanecem não confirmados até essa consulta. Adonai Trade não possui banca fictícia própria e execução real permanece desabilitada. Dados ausentes/vencidos, auditoria indisponível, estado de conta incerto ou timeout de envio impedem nova tentativa até reconciliação. Nunca registrar credenciais nos relatórios.

**Estado:** aditivo documental; implementação automática no RH, prompt em runtime e validação operacional permanecem pendentes até inspeção do código e testes.
