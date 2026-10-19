# Revisão de segurança Supabase — Adonai Trade / EU SOU / LEVI
Data da inspeção: 2026-10-18
Projeto: `qyeduepihkxgrwotqnhb`

## Escopo e método
Inspeção somente leitura via catálogo PostgreSQL: `pg_policies`, `pg_class.relrowsecurity`, `pg_class.relforcerowsecurity` e `has_table_privilege` para os papéis `anon` e `authenticated`. Nenhuma policy, grant, schema ou dado foi alterado nesta revisão.

## Resultados observados
- As tabelas consultadas nos schemas `adonai_trade`, `eu_sou` e `levi` têm RLS habilitado.
- Em `adonai_trade`, as policies observadas para `excellence_evidence` e `excellence_work_items` são restritas ao papel `service_role`.
- Em `eu_sou.knowledge_chunks`, existe policy de SELECT para `authenticated` limitada a status `curated`, `reviewed` ou `validated`.
- Para as tabelas listadas em `adonai_trade`, `eu_sou` e `levi`, as consultas de privilégio retornaram sem SELECT/INSERT para `anon` e `authenticated`, exceto SELECT autenticado em `eu_sou.knowledge_chunks`.
- Nas sete tabelas consultadas em `public` (`agentes`, `comunicacoes`, `estados_agentes`, `fila_execucao`, `logs`, `projetos`, `resultados`, `tarefas`), os catálogos retornaram privilégios SELECT e INSERT para `anon` e `authenticated`, enquanto RLS está habilitado. A inspeção de policies realizada nesta consulta não retornou policies para essas tabelas.

## Interpretação e cautela
Privilégios SQL e policies RLS são camadas distintas. Conceder privilégio não elimina o filtro de RLS; sem policy permissiva, operações normalmente ficam negadas. Entretanto, as tabelas públicas com grants amplos merecem revisão específica: confirmar se são realmente expostas via API, se não existem policies em outra migration/contexto, quais dados contêm e se os grants anônimos são necessários. Não foi feita escrita nem tentativa de acesso como usuário anônimo.

## Ações recomendadas antes de release
1. Verificar a configuração de schemas expostos no PostgREST/Supabase e migrations aplicadas no projeto.
2. Confirmar conteúdo e classificação de dados das tabelas `public.*`.
3. Se não houver necessidade de acesso público, remover grants anon apenas via migration revisada e após identificar dependências; não alterar permissões às cegas.
4. Manter schemas de auditoria, RH, LEVI e EU SOU inacessíveis a anon; preferir rotas backend autenticadas.
5. Testar leitura/escrita com roles anon, authenticated e service_role, incluindo negação esperada e prova de isolamento.
6. Verificar `FORCE ROW LEVEL SECURITY` e ownership/bypass onde pertinente.
7. Repetir os testes de regressão antes de release.

## Estado
Revisão inicial concluída; hardening final continua pendente. Não afirmar que todo o banco está seguro apenas porque RLS está habilitado. Execução de ordens reais permanece desabilitada.
