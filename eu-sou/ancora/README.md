# EU SOU ÂNCORA — integração Supabase

## Estado
- Projeto Supabase: `adonaiturbo`
- Esquema isolado: `eu_sou`
- Migração aplicada: `20261014035612_eu_sou_ancora_core_v1`
- Tabelas: `eu_sou.anchor_state`, `eu_sou.anchor_history`
- RLS activada nas duas tabelas.
- Acesso de aplicação limitado à role `service_role`; `anon` e `authenticated` não recebem acesso.
- As tabelas e funções existentes em `public` não foram movidas nem alteradas.
- O projecto PSM Grupo Market não foi utilizado.

## Limite actual
A estrutura de dados foi criada e verificada no Supabase remoto. Isto, por si só, **não liga automaticamente** o servidor local `C:\AdonaiTurbo\backend\server.js` (porta 3000) ao novo esquema. Essa ligação exige inspeccionar e actualizar o backend local, testar com credenciais apenas no ambiente local e validar os endpoints. Não declarar integração ponta a ponta até esses testes passarem.

## Validações efectuadas
- Projecto Supabase activo e saudável.
- Migração registada.
- Ambas as tabelas presentes, com restrições de integridade e RLS activada.
- Uma linha inicial de estado; histórico vazio.
- Permissões da aplicação concedidas apenas a `service_role`.
