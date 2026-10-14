# Auditoria executada — EU SOU, Fases 1–4
Data da revalidação: 2026-10-14 (UTC)

## Resultado honesto

Este documento separa evidência observada de trabalho ainda não demonstrado. Não certifica as quatro fases a 100% porque a execução dos testes no ambiente local Windows e o ciclo completo de voz não podem ser comprovados pelo repositório remoto.

## Verificações observadas

- Supabase: migrações registadas: `eu_sou_ancora_core_v1`, `eu_sou_anchor_functions_v1`, `levi_anchor_core_and_functions_v1` e `revoke_public_execution_rls_auto_enable`.
- Supabase: RLS activo nas quatro tabelas de âncora (`eu_sou.anchor_state`, `eu_sou.anchor_history`, `levi.anchor_state`, `levi.anchor_history`).
- Supabase: a consulta de privilégios confirmou `anon=false`, `authenticated=false`, `service_role=true` e `postgres=true` para executar `public.rls_auto_enable()`.
- Supabase Security Advisor: o aviso de execução pública de `public.rls_auto_enable()` deixou de aparecer após a revogação. Permanecem avisos informativos de tabelas RLS sem políticas; cada tabela exige revisão do modelo de acesso antes de criar políticas.
- GitHub: o repositório contém a aplicação Next.js, mas não contém os ficheiros locais Express `backend/server.js`, `backend/levi-core.js` e `backend/eu-sou-api.js` necessários para testar a instalação local.
- Evidência histórica anterior: `validar_matematica` foi reportado como aprovado, mas a bateria actual dos quatro comandos ainda precisa ser executada no Windows.

## Estado por fase

| Fase | Estado | Evidência que falta para fechar |
|---|---|---|
| 1 | Historicamente concluída; revalidação parcial | Inventário e relatório original comparados com o ambiente actual |
| 2 | Historicamente concluída; revalidação parcial | Reexecutar testes do motor científico e anexar saídas |
| 3 | Conclusão histórica preservada; reconciliação pendente | Recuperar critérios e provas originais; não inventar nem reabrir sem fundamento |
| 4 | Em andamento | Testes locais ponta a ponta, falhas/timeouts, rastreabilidade, fontes, busca científica e ciclo de voz |

## Próximos testes obrigatórios no Windows

1. Executar os quatro comandos de integração: `validar_matematica`, `validar_oscilador`, `particula_caixa`, `qubit_basico`.
2. Testar entrada inválida, timeout e indisponibilidade do serviço EU SOU.
3. Confirmar IDs de correlação, fontes e comportamento quando não há fonte suficiente.
4. Validar pergunta por voz → encaminhamento EU SOU → resposta do LEVI → áudio reproduzido, sem alterar a voz configurada.
5. Recuperar `C:\\AdonaiDados\\EU_SOU\\backups\\CONTINUIDADE_EU_SOU_FASE4_2026-10-13.txt` e os relatórios originais das Fases 1–3.
6. Repetir a auditoria de segurança após revisão das permissões das tabelas; não criar políticas genéricas nem expor dados.
7. Executar build/testes do repositório e anexar o resultado de CI.

## Regra de aceitação

Uma fase só pode ser marcada como 100% quando os critérios originais estiverem identificados, os testes relevantes passarem na versão corrente e as evidências estiverem ligadas ao repositório. A migração de segurança restringe permissões; não prova, por si só, a integração completa.
