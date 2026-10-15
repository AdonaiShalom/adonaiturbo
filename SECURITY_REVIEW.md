# Revisão de segurança — 15/10/2026

## Escopo e limitações

Revisão estática de rotas da aplicação. Não representa pentest, auditoria completa, teste de produção nem certificação. O build e testes automatizados ainda precisam ser executados em ambiente com dependências.

## Correção proposta nesta branch

- `src/app/v1/chat/completions/route.ts`: autenticação agora falha de forma segura quando nenhuma chave de servidor está configurada; quando configurada, exige `Authorization: Bearer <chave>` correspondente a `API_KEY` ou `OPENJARVIS_API_KEY`.

## Achados que exigem confirmação da arquitetura antes de alterar

1. `src/app/api/conversas/route.ts` consulta conversas com uma chave Supabase de servidor sem verificação explícita de sessão/identidade na própria rota.
2. `src/app/api/conversas/[id]/route.ts` valida formato do identificador, mas não verifica explicitamente propriedade/autorização da conversa na rota.
3. `src/app/api/chat/route.ts` aceita `conversaId` enviado pelo cliente e usa credencial privilegiada de servidor para gravar mensagens. É necessário definir e validar o modelo de identidade/propriedade antes de impor controles compatíveis.
4. `next.config.ts` tem `typescript.ignoreBuildErrors: true`; isso pode permitir publicação apesar de erros de tipos. Remover essa opção deve ocorrer após corrigir e validar os erros existentes.

## Testes necessários antes de integrar

- Sem `API_KEY` e sem `OPENJARVIS_API_KEY`: endpoint deve retornar HTTP 401 sem chamar provedores.
- Com chave configurada: ausência de token, token errado e esquema de autorização malformado devem retornar HTTP 401.
- Com chave válida: comportamento OpenAI-compatible e streaming devem continuar funcionando.
- Rodar instalação reprodutível, `npm run build` e testes automatizados (se adicionados/configurados).
- Testar isolamento entre usuários/conversas usando duas identidades distintas, após confirmar o mecanismo de autenticação e as políticas RLS do Supabase.

## Ações externas ainda necessárias

- Verificar e revogar/rotacionar qualquer credencial real que tenha sido publicada anteriormente no histórico Git; substituir por uma nova variável de ambiente no serviço emissor/deploy. Apagar um valor do arquivo atual não invalida uma chave já exposta.
- Confirmar que as variáveis `API_KEY` ou `OPENJARVIS_API_KEY` estão configuradas no deploy antes de integrar esta mudança, para evitar indisponibilidade esperada por fail-closed.
- Verificar permissões RLS do schema `turbo` e autenticação usada pelo frontend.

