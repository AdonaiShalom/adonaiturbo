# Integração com LEVI

Definir contratos de recomendação com fontes e timestamps, método, hipóteses, alternativas, incerteza, riscos, aprovações e condições de parada. A documentação não habilita execução autónoma.

## Estado da validação — 2026-10-14

### Âncora Supabase do LEVI

No projeto Supabase do Adonai Turbo foi criada a migração `levi_anchor_core_and_functions_v1`.

- Esquema isolado: `levi`.
- Tabelas: `levi.anchor_state` e `levi.anchor_history`.
- RPCs: `public.levi_anchor_read()` e `public.levi_anchor_advance(...)`.
- RLS habilitada nas duas tabelas; acesso directo a `anon` e `authenticated` revogado; execução das RPCs reservada a `service_role`.
- Teste da RPC de avanço executado dentro de uma transação de teste e revertido; a leitura posterior confirmou `event_seq = 0`, hashes zerados e versão 1, sem evento de teste persistido.

Isto valida o mecanismo da âncora no banco de dados. **Não comprova ainda que o servidor local na porta 3000 esteja ligado à âncora.**

### Estado do fluxo LEVI ↔ EU SOU

A rota de orquestração do LEVI respondeu HTTP 200 em teste anterior. Esse resultado, isoladamente, não comprova a comunicação ponta a ponta entre LEVI e o Cérebro EU SOU.

Ainda falta registrar um teste reproduzível que comprove:
1. A pergunta recebida pelo LEVI.
2. O encaminhamento explícito ao endpoint correto do EU SOU.
3. A resposta do EU SOU e a origem das evidências utilizadas.
4. O retorno da resposta ao LEVI.
5. A reprodução em áudio quando a pergunta é feita por voz.
6. A leitura e gravação controlada da âncora pelo servidor local, usando credenciais exclusivamente server-side.

## Registro histórico das subfases 4.1–4.3

O estado histórico e os critérios de continuidade estão consolidados em [PLANO_MESTRE_E_CHECKLIST.md](../PLANO_MESTRE_E_CHECKLIST.md): 4.1 foi registada como validada; 4.2 foi aprovada em teste anterior com `levi: true`, `motor: "eu-sou"` e `validar_matematica` → `APROVADO`; 4.3 permanece parcial até que fontes, trechos recuperados e respostas sejam rastreados com evidências reproduzíveis. Repetir os testes é revalidação, não uma afirmação de que o trabalho anterior nunca ocorreu.

## Próximo passo obrigatório

Inspecionar os ficheiros locais existentes em `C:\AdonaiTurbo\backend\server.js`, `C:\AdonaiTurbo\backend\levi-core.js` e `C:\AdonaiTurbo\backend\eu-sou-api.js` antes de editar. Confirmar também se o pacote Supabase já está instalado e como o servidor carrega variáveis de ambiente, sem expor segredos.

Depois, implementar a ligação na estrutura existente — sem criar uma segunda pasta LEVI, sem duplicar rotas, sem alterar a voz atual e sem tocar no PSM Grupo Market. Executar primeiro teste de leitura, depois avanço idempotente de teste e fluxo texto LEVI → EU SOU → LEVI; só então testar voz e áudio.

Não marcar a integração como concluída até que o fluxo completo tenha sido validado.
