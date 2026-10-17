# Contrato do schema de excelência do Adonai Trade

**Schema:** `adonai_trade`  
**Estado:** registry de planejamento e evidências; não é o ledger de ordens nem prova de operação de mercado.

## Entidades

### `excellence_work_items`

- `work_key`: ID estável de tarefa, único (AT-001..AT-012).
- `component`: domínio responsável (core, audit, security, crypto, forex, b3, international, eu_sou, levi, rh, github, supabase, delivery).
- `priority`: P0..P4.
- `status`: planned, in_progress, blocked, verified, deferred.
- `acceptance_criteria`: array JSON de critérios verificáveis.
- `source_reference`: referência de origem.
- `updated_at`: atualizado pelo trigger.
- `verified_at`: preenchido ao mudar para verified e limpo quando o estado deixa de ser verified.

### `excellence_evidence`

- `work_item_id`: FK restritiva para tarefa.
- `evidence_type`: tipo de prova.
- `source_reference`, `summary`, `details`: proveniência e detalhe.
- `verified`: revisão da evidência; exige referência de origem não vazia.
- `observed_at`, `recorded_at`: momento observado e registrado.

## Invariantes

1. Uma tarefa não pode passar a `verified` sem evidência marcada `verified=true`, com referência de origem e tipo técnico (`automated_test`, `manual_test`, `security_review`, `benchmark` ou `deployment_check`). Evidência apenas documental não basta.
2. Evidências são append-only para operações normais; correções devem gerar novo registro, sem reescrever histórico.
3. `anon` e `authenticated` não têm leitura direta dessas tabelas.
4. `service_role` tem acesso operacional explícito ao backlog; para evidências, pode ler/inserir, não atualizar/apagar.
5. RLS permanece habilitado em ambas as tabelas.
6. Evidência registrada não prova, por si só, que o código está correto; exige fonte, commit/artefato, comando/teste, resultado e timestamp quando aplicável.
7. Nenhum item é `verified` atualmente; os 12 itens continuam abertos em estados planejado, em andamento ou bloqueado.

## Migrações e testes

- `supabase/migrations/20261017145301_adonai_trade_excellence_backlog_and_evidence.sql`
- `supabase/migrations/20261017150214_adonai_trade_excellence_integrity_guards.sql`
- `supabase/migrations/20261017150842_adonai_trade_verified_requires_technical_evidence.sql`
- `supabase/migrations/20261017150927_adonai_trade_verified_evidence_type.sql`
- `supabase/tests/adonai_trade_excellence_integrity.test.sql`

As quatro migrations foram aplicadas ao projeto Supabase conectado e aparecem no histórico. A última constraint está `NOT VALID` para preservar duas evidências documentais históricas marcadas como verificadas; ela bloqueia novas evidências documentais verificadas. Testes transacionais diretos confirmaram o bloqueio de novos registros documentais e de conclusão sem evidência técnica. O workflow Python de consistência do backlog passou; pgTAP permanece pendente de execução num banco descartável com pgTAP instalado. Não reaplicar migrations manualmente em produção sem verificar a tabela de histórico e o diff de schema.
