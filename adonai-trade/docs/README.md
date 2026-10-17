# Adonai Trade — engenharia e governança

Este diretório documenta o módulo Adonai Trade dentro do repositório. O README da raiz descreve o serviço FreeLLMAPI; ele não é o runtime do Trade.

## Documentos canônicos

- [Plano de engenharia reversa e excelência](./EXCELLENCE_ENGINEERING_PLAN.md) — arquitetura-alvo, evidências, riscos e critérios de aceite.
- [Backlog legível por máquina](./EXCELLENCE_BACKLOG.json) — IDs estáveis AT-001..AT-012 e critérios por item.
- [Quadro de execução](./EXCELLENCE_EXECUTION_BOARD.md) — visão humana do backlog; o estado operacional é lido do Supabase.
- [Contrato do registro de excelência](./EXCELLENCE_SCHEMA_CONTRACT.md) — modelo de dados, permissões e invariantes.
- [Gates de liberação](./EXCELLENCE_RELEASE_GATES.md) — condições obrigatórias de segurança, integração, testes e release.
- [Revisão de engenharia reversa](./OPEN_SOURCE_ENGINEERING_REVIEW.md) — padrões públicos analisados e plano de adaptação sem cópia de código.

## Verificações automáticas

O workflow `.github/workflows/adonai-trade-quality.yml` executa `tests/test_excellence_backlog.py` em pull requests e no branch de trabalho. O pgTAP de banco é separado e deve ser executado num banco descartável com pgTAP instalado.

## Fonte da verdade

- **Código executável:** commit revisado do runtime real do Trade, quando publicado após inspeção do pacote local.
- **Estado das tarefas e evidências:** tabelas `adonai_trade.excellence_work_items` e `adonai_trade.excellence_evidence`.
- **Estado das integrações:** `adonai_trade.integration_status`; não declarar integração ativa sem teste ponta a ponta.
- **Plano e critérios:** documentos versionados neste diretório. O backlog JSON é espelho de planejamento, não substitui o estado verificado no banco.

## Guardrails

1. Paper trading apenas; nenhum segredo no Git.
2. LEVI coordena, mas não sobrepõe o veto do motor de risco.
3. EU SOU fornece evidências e incerteza, não autorização financeira.
4. Cripto, Forex, B3 e Internacional têm adaptadores e testes separados, com contrato de proposta comum.
5. RLS e grants devem ser revisados em conjunto; não adicionar políticas amplas apenas para silenciar alertas.
6. Não mesclar ou publicar o runtime sem revisão do diff, testes isolados, CI verde e plano de rollback.
7. Turbo (3000), Trade (3100) e PSM (3001) permanecem separados.
