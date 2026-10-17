# Adonai Trade — quadro de execução da excelência

Atualizado em: 2026-10-17  
Fonte canônica de status: `adonai_trade.excellence_work_items` no Supabase. Este arquivo é um espelho documental e deve ser sincronizado após mudanças.  
Escopo: Adonai Trade, LEVI, EU SOU, quatro mesas de mercado e RH.  
Regra operacional: paper trading apenas; nenhuma ordem real.

## Estado do release

**BLOQUEADO PARA RELEASE** até revisão do runtime executável, integridade de auditoria, segurança e testes ponta a ponta.

O GitHub contém documentação e contratos iniciais, mas a branch `main` consultada não contém `adonai-trade/server.js` nem `adonai-trade/package.json`. Não afirmar que o runtime local foi publicado ou testado até inspecionar a fonte e comprovar o commit/hash.

## Backlog alinhado ao Supabase

| ID canônico | Prioridade | Área | Tarefa | Estado no Supabase | Critério mínimo de aceite |
|---|---|---|---|---|---|
| AT-001 | P0 | Auditoria | Reproduzir e diagnosticar quebra da cadeia | blocked | Repro isolada, causa-raiz, testes de adulteração/replay/concorrência, origem preservada |
| AT-002 | P0 | Segurança | Rever RLS, grants, schemas expostos e funções privilegiadas | in_progress | Matriz por role/objeto, teste de acesso negativo, justificativa por política |
| AT-003 | P1 | Core/runtime | Validar servidor, contrato HTTP, health/readiness e falhas | blocked | Código-fonte revisado, contrato testado, timeout falha fechado, paper não chama corretora |
| AT-004 | P1 | LEVI | Provar integração ponta a ponta e correlação | blocked | correlation_id, auditoria persistida, falha não cria proposta executável |
| AT-005 | P1 | EU SOU | Provar contrato e persistência científica | blocked | fonte/modelo/benchmark/resultado registrados e reproduzíveis |
| AT-006 | P2 | Cripto | Validar dados, precisão, taxas e frescor | planned | fixtures offline, limites corretos, stale feed bloqueado, paper-only |
| AT-007 | P2 | Forex | Validar bid/ask, spread, pip/lote e sessões | planned | fixtures, conversão, rollover/calendário e slippage testados |
| AT-008 | P2 | B3 | Validar calendário, ticker, ajustes e atraso | planned | fixtures versionadas, proveniência/licença, atraso identificado |
| AT-009 | P2 | Internacional | Validar timezone, moedas, calendário e custos | planned | UTC, conversão, corporate actions e divergências de fonte testadas |
| AT-010 | P3 | Quantitativo | Backtest sem look-ahead e com custos | planned | baseline, custos, out-of-sample, walk-forward e drawdown reproduzíveis |
| AT-011 | P4 | RH | Governança de agentes e evidências de aprendizagem | planned | papéis, donos, critérios de qualificação e histórico auditável |
| AT-012 | P4 | Entrega | Release candidate reproduzível e rollback | planned | CI, scan de segredos, dependências/SBOM, backup, rollback e hash |

## Regras de engenharia

1. IDs `AT-001..AT-012` são estáveis e devem corresponder a `work_key` no Supabase.
2. Não marcar `verified` sem evidência revisada com origem, timestamp, resultado e commit/artefato quando aplicável.
3. `integration_status` só pode passar de `pending/degraded` após teste ponta a ponta real; registrar resultado e horário.
4. RLS permanece habilitado; acesso é a interseção de GRANT e política. Não adicionar políticas amplas só para remover alertas.
5. A evidência é append-only: correções são novos registros, não sobrescritas silenciosas.
6. Testes de smoke usam cópia/pasta/banco temporários e não apagam dados operacionais.
7. Não misturar Turbo (3000), Trade (3100) e PSM (3001).
8. Não mesclar ou implantar sem revisão humana e gates verdes.

## Migrações e guardas adicionais

- `20261017150842_adonai_trade_verified_requires_technical_evidence.sql` exige evidência técnica revisada antes de `verified`.
- `20261017150927_adonai_trade_verified_evidence_type.sql` impede novas evidências documentais de serem marcadas como verificadas. A constraint é `NOT VALID` para preservar registros históricos existentes; novas gravações são verificadas. Os dois registros históricos documentais permanecem identificados como legado e não são prova de conclusão.
- O teste de regressão pgTAP cobre o bloqueio de evidência documental e a trilha append-only.

## Próxima sequência

1. Inspecionar ZIP/fonte executável e gerar inventário + hashes + scan de segredos.
2. Reproduzir a quebra histórica da cadeia de auditoria em ambiente isolado.
3. Validar grants/RLS e teste negativo por papel.
4. Rodar contratos e smoke não destrutivos contra a fonte exata.
5. Validar cada mesa com fixtures antes de qualquer integração de provedor.
