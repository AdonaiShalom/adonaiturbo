# Contrato de execução Adonai Trade — v1

**Estado:** contrato inicial versionado; ainda não prova integração em execução.  
**Versão:** 1.0.0  
**Escopo:** LEVI → EU SOU → mesa especializada → motor independente de risco → paper trading → auditoria.

## Regras obrigatórias

1. Todas as solicitações usam o envelope JSON Schema `task-envelope.v1.schema.json`.
2. O modo de execução é exclusivamente `paper`. Não existe autorização implícita para enviar ordens reais.
3. `correlation_id` permanece estável em toda a cadeia; `task_id` identifica a tarefa idempotente. `expires_at` é obrigatório e deve ser posterior a `created_at`.
4. A mesa só aceita um dos mercados explícitos: B3, INTERNATIONAL, CRYPTO ou FOREX.
5. Dados `stale`, `invalid`, `unknown`, ausentes ou sem proveniência suficiente não podem fundamentar proposta executável. A resposta deve ser bloqueio explícito, com motivo auditável.
6. A resposta de EU SOU deve separar fatos/fontes, método, baseline, incerteza, limitações e recomendação. Alegações quânticas não recebem privilégio decisório sem validação contra baseline clássico.
7. LEVI pode encaminhar e resumir, mas não pode alterar limites de risco nem sobrepor um veto.
8. O motor independente de risco é a autoridade final para permitir ou bloquear qualquer proposta de paper order.
9. Segredos não são aceitos no payload nem registrados em logs. Autenticação deve usar cabeçalhos e segredos de ambiente.
10. Falhas de autenticação, timeout, esquema inválido, replay não idempotente, dados vencidos ou indisponibilidade do serviço resultam em falha segura (sem ordem).

## Resposta mínima de serviço

```json
{
  "schema_version": "1.0.0",
  "correlation_id": "UUID da solicitação",
  "task_id": "UUID da tarefa",
  "status": "accepted | completed | blocked | failed",
  "stage": "levi | eu_sou | market_desk | risk | paper_execution",
  "mode": "paper",
  "decision": "no_order | proposal_only | paper_order | blocked",
  "reason_codes": [],
  "evidence_refs": [],
  "created_at": "timestamp ISO-8601 UTC"
}
```

## Runtime HTTP inicial

O `runtime/server.cjs` fornece `/health`, `/ready` e `POST /api/v1/policy/evaluate`. Esta primeira fatia não conecta provedores de mercado, não persiste a auditoria e não executa ordens. Por isso, `/ready` retorna `503` até que o ledger durável seja integrado. O endpoint de avaliação declara explicitamente `audit_persisted: false` e `execution_performed: false`.

## Estados de aceite

- **accepted:** validado e colocado em processamento; não significa análise concluída.
- **completed:** resultado completo com fontes e trilha de auditoria.
- **blocked:** bloqueio deliberado por risco, qualidade, permissão ou governança.
- **failed:** falha técnica; nunca converte automaticamente em aprovação.

## Critérios para implementar e testar

- Validação de schema e rejeição de propriedades desconhecidas.
- Teste de idempotência por `task_id`.
- Testes negativos de autenticação, timeout, dados vencidos e mercado inválido.
- Confirmação de que um veto de risco bloqueia todas as rotas de execução.
- Auditoria correlacionada ponta a ponta sem segredos.
- Testes isolados para cada uma das quatro mesas.
- Contrato de saída versionado antes de conectar os serviços locais.

Este artefato define o contrato. A integração LEVI/EU SOU/mesas ainda precisa ser implementada e comprovada com testes de ponta a ponta.
