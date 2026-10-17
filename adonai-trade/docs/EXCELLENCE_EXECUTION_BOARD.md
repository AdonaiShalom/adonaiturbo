# Adonai Trade — quadro de execução da excelência

Atualizado em: 2026-10-17  
Escopo: Adonai Trade, integração com LEVI, EU SOU e RH Adonai Trade.  
Regra operacional: somente paper trading; nenhuma ordem real.  
Documento de arquitetura: [EXCELLENCE_ENGINEERING_PLAN.md](./EXCELLENCE_ENGINEERING_PLAN.md)

## Estado geral

- Estado do release: **BLOQUEADO PARA RELEASE** até comprovação de runtime real, integridade e testes ponta a ponta.
- Fonte executável local: **aguardando inspeção do ZIP/código completo**.
- CI do plano: revisão documental; não equivale a teste do runtime.
- Integrações em Supabase: status permanecem pending/degraded quando não há evidência de teste.

## Backlog priorizado

| ID | Prioridade | Área | Tarefa | Estado | Evidência para concluir |
|---|---|---|---|---|---|
| AT-001 | P0 | Fonte | Inspecionar ZIP e gerar inventário/hash do runtime | Bloqueado por fonte | Inventário, hash, diff e relatório de segredos |
| AT-002 | P0 | Auditoria | Reproduzir quebra da cadeia e assinaturas inválidas | Pendente | Teste mínimo reproduzível e relatório da causa raiz |
| AT-003 | P0 | Segurança | Rever secrets, permissões, RLS, grants e schemas expostos | Em investigação | Matriz de acesso e teste de acesso negativo |
| AT-004 | P0 | Testes | Garantir que smoke tests não apaguem dados reais | Pendente | Teste em pasta/banco temporário e confirmação de não mutação |
| AT-005 | P1 | Contratos | Validar envelope, correlação, idempotência e erros da API real | Parcial | Testes contra servidor real e respostas versionadas |
| AT-006 | P1 | LEVI | Validar roteamento LEVI → Trade e registro de auditoria | Pendente | Teste ponta a ponta correlacionado |
| AT-007 | P1 | EU SOU | Validar request/response, autenticação e evidência persistida | Pendente | Execução científica registrada e consultável |
| AT-008 | P1 | Runtime | Confirmar health/readiness e isolamento da porta 3100 | Pendente | Health check local e prova de separação Turbo/PSM |
| AT-009 | P2 | Cripto | Validar fixtures, precisão, taxas, freshness e limites de API | Pendente | Testes determinísticos e dados simulados |
| AT-010 | P2 | Forex | Validar bid/ask, pip, lote, rollover, sessão e spread | Pendente | Fixtures e testes de regressão |
| AT-011 | P2 | B3 | Validar calendário, ajustes, ticker, atraso e liquidez | Pendente | Fixtures históricas com proveniência |
| AT-012 | P2 | Internacional | Validar fuso, moeda, calendário, splits e custos | Pendente | Fixtures por mercado e testes de normalização |
| AT-013 | P3 | Quantitativo | Backtest sem look-ahead, custos e fora da amostra | Pendente | Relatório reproduzível com hash do dataset |
| AT-014 | P3 | Paper engine | Persistir propostas, vetos, simulações e ledger | Pendente | Trilha completa sem chamadas de corretora |
| AT-015 | P4 | RH | Definir papéis, critérios, aprovação humana e histórico de aprendizagem | Pendente | Testes de permissão e evidências de execução |
| AT-016 | P5 | Entrega | CI, lockfile, SBOM, release hash, rollback e runbook | Pendente | Pipeline verde e pacote reproduzível |

## Regras de atualização

1. Não marcar uma tarefa como concluída sem anexar o comando/teste, resultado e commit/hash.
2. Não converter estados pending/degraded para connected sem teste ponta a ponta executado.
3. Não tratar cadastro de agentes, endpoints ou tabelas como prova de funcionamento.
4. Registrar bloqueios e riscos explicitamente; não ocultar falhas para liberar release.
5. Não alterar o projeto PSM nem as portas Turbo 3000 / Trade 3100 / PSM 3001.
6. Toda promoção deve passar por revisão e aceite; este quadro não autoriza merge nem deploy.

## Próxima ação concreta

Anexar o arquivo `AdonaiTrade_Source_Review_20261015_171400.zip` à conversa. Em seguida: inventariar arquivos, validar package/entrypoint, procurar segredos, executar testes isolados em cópia descartável e priorizar AT-002 (integridade da auditoria).
