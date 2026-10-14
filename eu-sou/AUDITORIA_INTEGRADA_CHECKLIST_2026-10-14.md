# Auditoria integrada e checklist mestre — Cérebro EU SOU / LEVI

Data: 2026-10-14  
Escopo: evidências remotas do GitHub e Supabase + plano de verificação local pendente.  
Status geral: **Fase 5 em andamento; não há evidência suficiente para declarar o programa operacional de ponta a ponta.**

## Regras de integridade e arquitetura

- EU SOU é o núcleo de conhecimento científico, recuperação, cálculo, simulação, memória científica, evidências e rastreabilidade.
- LEVI é o orquestrador: encaminha pedidos e resultados autorizados às cinco empresas Adonai.
- Cinco empresas: Adonai Turbo, Adonai Marketing Digital, Adonai Finanças, Adonai Lab e Adonai Trade.
- PSM Grupo Market é projeto independente; não fundir repositórios, credenciais, backends nem dados com as cinco empresas Adonai.
- Compartilhar conhecimento científico validado não autoriza compartilhar dados privados, credenciais ou bancos entre empresas.
- Manter a biblioteca ativa separada de índices experimentais até validação explícita.
- Fluxo: **concluir → testar → validar → documentar → publicar → avançar**.
- Não marcar fase como 100% sem critérios originais e evidências reproduzíveis vinculadas.

## Auditoria das três camadas

### 1. Servidor local — `C:\AdonaiTurbo`, `http://localhost:3000`

- [ ] Inspecionar, com PowerShell local, `backend\server.js`, `backend\eu-sou-api.js`, `backend\levi-core.js`, `frontend\index.html`, testes e configuração de rotas.
- [ ] Fazer backup antes de qualquer alteração.
- [ ] Confirmar endpoints reais de saúde, EU SOU, LEVI, conversas e memória; registrar status, latência e resposta.
- [ ] Confirmar o caminho real de recuperação científica e quais trechos/fontes chegam ao prompt do LEVI.
- [ ] Confirmar leitura e gravação persistente de memória no Supabase.
- [ ] Testar texto, SSE/JSON, comando STOP, falha/timeout e voz/áudio sem alterar a voz configurada.
- [ ] Executar `node --check` nos arquivos alterados e testes de regressão.
- **Limite da auditoria remota:** esta sessão não executa comandos no computador local nem consegue provar o estado atual de `localhost:3000`. Os itens acima permanecem pendentes até execução local com evidência.

### 2. GitHub — `AdonaiShalom/adonaiturbo`

- [x] Encontrada documentação `eu-sou/PLANO_MESTRE_E_CHECKLIST.md`, `eu-sou/STATUS_ATUAL.md`, `eu-sou/AUDITORIA_FECHAMENTO_FASES_2026-10-13.md`, `eu-sou/integracao-levi/README.md` e `eu-sou/quantica/README.md`.
- [x] Encontrada estrutura de documentação por conhecimento, quântica, modelos/fórmulas, validação, trade, lab e marketing; há pastas separadas para Adonai Marketing Digital e PSM Grupo Market.
- [x] A raiz do repositório contém FreeLLMAPI/Next.js (`src/app/api`, `src/app/v1`) e `public/Adonai_Turbo_Real.html`.
- [ ] Comparar o HTML publicado com `C:\AdonaiTurbo\frontend\index.html` e o backend Express local.
- [ ] Documentar a relação entre a aplicação Next.js publicada e o backend Express local; não presumir que são o mesmo runtime.
- [ ] Publicar backend, contratos, testes e relatórios de forma deliberada, sem enviar `.env`, tokens ou dados privados.
- [ ] Recuperar do computador/backups os títulos e critérios originais das subfases 4.5–4.10 e relatórios das Fases 1–3.

### 3. Supabase — projeto `qyeduepihkxgrwotqnhb`

- [x] Confirmadas migrations: `eu_sou_ancora_core_v1`, `eu_sou_anchor_functions_v1`, `levi_anchor_core_and_functions_v1`, `revoke_public_execution_rls_auto_enable`, `eu_sou_scientific_registry_v1`, `levi_conversation_memory`.
- [x] Existem tabelas para domínios/fontes/ferramentas/modelos científicos, benchmarks, execuções, evidências, checkpoints, conversas, mensagens e memória do usuário.
- [x] Todas as tabelas listadas em `public`, `eu_sou` e `levi` estão com RLS habilitado.
- [x] Consulta a `pg_policies` não retornou políticas nessas três schemas. Isso exige auditoria de grants, funções `SECURITY DEFINER`, uso de service role e acesso da aplicação antes de qualquer mudança.
- [x] Contagens verificadas: 0 registros em `eu_sou.science_domains`, `scientific_sources`, `scientific_tools`, `scientific_models`, `validation_benchmarks`, `scientific_runs`, `run_evidence`, `phase_checkpoints`, `levi.conversations`, `conversation_messages` e `user_memory`.
- [x] `eu_sou.anchor_state` e `levi.anchor_state` estão inicializados com `event_seq=0` e hashes zerados; `anchor_history` está vazia.
- [ ] Confirmar quais funções e grants são usados pela aplicação, sem expor chaves.
- [ ] Definir escopo/owner por projeto e permissões explícitas; testar leitura/gravação com a identidade real do backend.
- [ ] Popular catálogo e memória apenas com fontes, dados e eventos verificados; não inserir linhas artificiais para aparentar conclusão.
- [ ] Gravar checkpoints e evidências de fase após os testes reais.

## Checklist mestre das dez fases

> Os estados abaixo preservam o histórico. “Concluída historicamente” não equivale a “revalidada nesta versão”. Os escopos de Fases 5–10 listados como complementares não substituem títulos/critério originais ainda não recuperados.

### Fase 1 — Diagnóstico e fundação
Estado: **concluída historicamente; revalidação documental pendente**.
- [x] Auditoria/inventário inicial registrado.
- [ ] Recuperar relatório original, inventário, backups e critérios de aceite.
- [ ] Comparar inventário histórico com arquivos/rotas atuais e guardar diferenças.
- [ ] Vincular evidências da fase ao checklist.

### Fase 2 — Motor científico
Estado: **concluída historicamente; evidências integrais pendentes de reconciliação**.
- [x] Motor científico e testes aprovados registrados historicamente.
- [ ] Recuperar logs/testes originais e versões das dependências.
- [ ] Reexecutar cálculos e testes científicos na versão atual.
- [ ] Conferir precisão numérica, tolerâncias, erros e resultados reproduzíveis.

### Fase 3 — Recuperação e validação científica
Estado: **declarada 100% anteriormente; reconciliação obrigatória, sem apagar a declaração histórica**.
- [ ] Recuperar critérios originais e mapear cada um a uma evidência.
- [ ] Confirmar recuperação de fonte/trecho, rastreabilidade e limites de confiança.
- [ ] Reconciliar os registros divergentes antes de alterar o estado oficial.
- [ ] Registrar casos sem fonte suficiente e comportamento esperado.

### Fase 4 — Integração controlada EU SOU ↔ LEVI
Estado: **em andamento; subfase 4.4 em validação**.
- [x] Separação de responsabilidades EU SOU/LEVI registrada.
- [x] Contrato/estrutura inicial de API registrados.
- [x] Teste histórico da Fase 4.2 registrou `levi: true`, `motor: "eu-sou"` e `validar_matematica` → `APROVADO`.
- [x] Biblioteca ativa reportou 607 trechos em 3 documentos NIST de criptografia pós-quântica.
- [x] Índice experimental separado do MIT OCW reportou 26 trechos.
- [ ] 4.1: repetir teste de contrato da API e arquivar request/response.
- [ ] 4.2: reexecutar encaminhamento LEVI → EU SOU na versão atual.
- [ ] 4.3: rastrear pergunta, consulta, trechos, fontes, resultado científico e resposta final.
- [ ] 4.4: conferir visualmente fórmulas com possível erro no símbolo ℏ, testar relevância/cobertura em português e manter o índice experimental isolado.
- [ ] 4.5–4.10: recuperar títulos e critérios originais; não inventar nomes nem estados.
- [ ] Testar timeout, indisponibilidade, erro e retorno de controle.
- [ ] Testar o ciclo de voz ponta a ponta sem alterar a configuração atual da voz do LEVI.

### Fase 5 — Validação integrada e publicação controlada
Estado: **em andamento; não concluída**. O escopo complementar foi registrado em 14/10; recuperar o critério original antes do aceite formal.
- [ ] Corrigir e testar memória persistente do LEVI no Supabase.
- [ ] Confirmar leitura e gravação real em `levi.conversations`, `levi.conversation_messages` e `levi.user_memory`.
- [ ] Corrigir e testar o comando STOP/cancelamento.
- [ ] Testar API JSON e SSE, incluindo erro, timeout e interrupção.
- [ ] Testar EU SOU → LEVI → resposta baseada em fonte → resposta ao usuário.
- [ ] Testar voz: pergunta falada → transcrição → EU SOU → resposta → áudio.
- [ ] Executar regressão, segurança/RLS, recuperação após falha e separação de escopos.
- [ ] Guardar logs, versões, latências, correlação e resultados de aceitação.
- [ ] Atualizar documentação e publicar apenas depois de aprovação.

### Fase 6 — Expansão científica (escopo complementar; recuperar título/critério original)
Estado: **planejada, não iniciada com evidência de aceite**.
- [ ] Curadoria de fontes científicas identificáveis, licenças, autores, versões e hashes.
- [ ] Cobertura multidisciplinar e critérios de qualidade.
- [ ] Separar fatos verificados, hipóteses, simulações e resultados experimentais.
- [ ] Criar benchmarks de cobertura e qualidade de recuperação.

### Fase 7 — Memória e recuperação (escopo complementar; recuperar título/critério original)
Estado: **planejada; memória persistente ainda não comprovada em operação real**.
- [ ] Separar memória do usuário, memória de conversas e conhecimento científico.
- [ ] Indexação, busca contextual, referências, deduplicação e versionamento.
- [ ] Regras de retenção, isolamento por projeto e permissões.
- [ ] Testar persistência entre reinícios, recuperação, exclusão autorizada e não vazamento entre empresas.

### Fase 8 — Modelagem, simulação e nanotecnologia quântica (escopo complementar; recuperar título/critério original)
Estado: **planejada; laboratório experimental existente, sem promoção para biblioteca ativa**.
- [ ] Física/matemática quântica, informação e computação quânticas.
- [ ] Modelos numéricos, circuitos/sistemas quânticos e simulações reproduzíveis.
- [ ] Materiais, nanoestruturas e nanotecnologia quântica com fontes primárias.
- [ ] Validar hipóteses, unidades, fórmulas, incertezas e comparações clássicas.
- [ ] Não alegar vantagem quântica sem benchmark reproduzível.

### Fase 9 — Aplicações às cinco empresas Adonai (escopo complementar; recuperar título/critério original)
Estado: **planejada; cada integração deve ser validada isoladamente**.
- [ ] Adonai Turbo: integração e escopo próprios.
- [ ] Adonai Marketing Digital: integração e escopo próprios.
- [ ] Adonai Finanças: integração e escopo próprios.
- [ ] Adonai Lab: integração e escopo próprios.
- [ ] Adonai Trade: integração e escopo próprios.
- [ ] Definir agentes, permissões, contratos, métricas e auditoria por empresa.
- [ ] Impedir mistura de dados/backends; PSM Grupo Market continua separado.

### Fase 10 — Consolidação, governança e evolução (escopo complementar; recuperar título/critério original)
Estado: **planejada**.
- [ ] Consolidar governança, segurança, rastreabilidade, versionamento e reprodutibilidade.
- [ ] Manter evolução contínua do conhecimento quântico multidisciplinar útil às cinco empresas.
- [ ] Manter acervo validado de nanotecnologia quântica.
- [ ] Definir processo de curadoria, revisão, descontinuação e atualização de fontes/modelos.
- [ ] Validar todas as interfaces EU SOU ↔ LEVI ↔ cinco empresas e produzir relatório final de aceitação.
- [ ] Encerrar somente com evidências auditáveis e plano de manutenção.

## Bloqueios prioritários antes de declarar a Fase 5 concluída

1. **Dados ausentes no Supabase:** as tabelas de registro científico, checkpoints e memória/conversas estão criadas, mas vazias. O conhecimento local/documental pode existir fora delas; é necessário provar o caminho de recuperação usado pelo LEVI.
2. **Políticas de acesso:** RLS está habilitado e a consulta de políticas não retornou políticas nas schemas auditadas. Verificar grants, funções e identidade usada pelo backend antes de alterar permissões.
3. **Código local não auditado nesta sessão:** comparar os arquivos locais com o que está publicado no GitHub.
4. **Critérios originais incompletos:** recuperar títulos e critérios das subfases 4.5–4.10 e fases 6–10 antes de afirmar que este documento reproduz literalmente o plano original.
5. **Integração ponta a ponta:** reexecutar teste rastreável de pergunta → recuperação científica → resposta do EU SOU → LEVI → usuário, em texto e voz.

## Sequência operacional

1. Recuperar checklist/relatórios originais dos backups locais.
2. Inspecionar o servidor com PowerShell somente leitura e comparar hashes/versões.
3. Corrigir primeiro o caminho de recuperação científica e a persistência da memória.
4. Testar contratos, permissões, STOP, JSON/SSE, erros, regressão e voz.
5. Registrar checkpoints e evidências no Supabase e no GitHub.
6. Aprovar formalmente a Fase 5; só então avançar para a Fase 6.

## Critério de status
- **Concluída historicamente:** há registro anterior.
- **Revalidada:** teste repetido na versão atual com saída preservada.
- **100% comprovada:** todos os critérios originais possuem evidência aprovada e reproduzível.
- **Pendente de evidência:** o trabalho pode ter ocorrido, mas ainda não foi confirmado nesta auditoria.
