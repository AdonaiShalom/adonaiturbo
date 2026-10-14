# Cérebro EU SOU — Plano mestre e checklist de continuidade

Última consolidação documental: 2026-10-13  
Repositório: `AdonaiShalom/adonaiturbo`  
Objetivo: preservar o histórico disponível sem apagar conclusões anteriores, sem inventar etapas ausentes e sem confundir evidência histórica com revalidação atual.

## Regras de preservação

- Manter o Cérebro EU SOU separado de Adonai Turbo como produto/orquestrador e de PSM Grupo Market como projeto independente.
- LEVI é o orquestrador; o raciocínio, conhecimento científico e evidências pertencem ao EU SOU.
- Não sobrescrever a biblioteca ativa com índices experimentais sem testes, validação e aprovação explícita.
- Um teste aprovado anteriormente continua registrado como aprovado historicamente; uma revalidação atual é uma atividade distinta.
- Não declarar uma fase concluída sem respeitar o registro original e suas evidências.
- Fluxo operacional: concluir → testar → validar → documentar → publicar → avançar.

## Plano mestre — dez fases

Os registros recuperados confirmam a estrutura de dez fases, mas não preservam aqui os títulos completos de todas elas. Para não fabricar nomes ou critérios, os itens abaixo distinguem o que está documentado do que precisa ser recuperado do plano original.

| Fase | Registro preservado | Próxima ação documental/técnica |
|---|---|---|
| 1 | Concluída no registro de continuidade; auditoria/inventário inicial | Preservar relatório e evidências originais; não reabrir sem motivo documentado |
| 2 | Concluída no registro de continuidade; motor científico e testes aprovados | Vincular os relatórios de teste originais |
| 3 | Declarada anteriormente como 100% concluída pelo responsável; existe também registro que exige reconciliação | Recuperar critérios e evidências originais e reconciliar sem reabrir automaticamente |
| 4 | Em andamento; integração controlada e evolução do EU SOU com LEVI | Concluir as subfases 4.1–4.10 segundo o plano original |
| 5 | Ainda não iniciada como fase formal no registro de 13/10; validação integrada e preparação para publicação controlada | Iniciar após aprovação dos critérios obrigatórios da Fase 4 |
| 6 | Fase existente no plano mestre; título e critérios completos não recuperados nesta consolidação | Recuperar literalmente do plano original |
| 7 | Fase existente no plano mestre; título e critérios completos não recuperados nesta consolidação | Recuperar literalmente do plano original |
| 8 | Fase existente no plano mestre; título e critérios completos não recuperados nesta consolidação | Recuperar literalmente do plano original |
| 9 | Fase existente no plano mestre; título e critérios completos não recuperados nesta consolidação | Recuperar literalmente do plano original |
| 10 | Fase existente no plano mestre; título e critérios completos não recuperados nesta consolidação | Recuperar literalmente do plano original |

**Importante:** a ausência dos títulos das Fases 6–10 neste documento não significa que elas não existam; significa que seus nomes e critérios originais ainda precisam ser recuperados de uma fonte primária antes de serem transcritos.

## Fase 4 — Integração controlada EU SOU ↔ LEVI

### Critérios gerais
- [x] Separação de responsabilidades: EU SOU mantém conhecimento e lógica científica; LEVI orquestra.
- [x] Estrutura inicial de comunicação por API registrada.
- [ ] Executar teste reproduzível ponta a ponta na versão atual.
- [ ] Confirmar pergunta → endpoint correto do EU SOU → resposta científica → retorno ao LEVI.
- [ ] Registrar fontes, evidências e identificador de correlação.
- [ ] Validar fluxo por texto e por voz, incluindo reprodução de áudio.
- [ ] Fechar as subfases 4.1–4.10 usando os critérios originais.

### Fase 4.1 — Preparação e contrato da API
**Estado histórico:** registrada como validada. Não equivale a uma nova execução nesta data.

- [x] Preparação da estrutura de integração registrada.
- [x] Verificação inicial do contrato de comunicação pela API registrada.
- [x] Separação das responsabilidades LEVI/EU SOU definida.
- [ ] Vincular as saídas originais e critérios de aceitação ao repositório.
- [ ] Repetir os testes de contrato na versão atual e registrar resultado, data e evidência.

### Fase 4.2 — Encaminhamento LEVI → EU SOU
**Estado histórico:** aprovada em teste anterior; revalidação atual pendente.

- [x] Teste anterior reportou `levi: true`.
- [x] Resultado anterior reportou `motor: "eu-sou"`.
- [x] `validar_matematica` retornou `status: "APROVADO"` no teste registrado anteriormente.
- [ ] Reexecutar o mesmo teste na versão atual e preservar a saída integral.
- [ ] Comprovar o retorno da resposta científica ao usuário.
- [ ] Testar e documentar falhas, timeout e indisponibilidade do serviço, sem presumir comportamento ainda não testado.

### Fase 4.3 — Conhecimento, evidências e rastreabilidade
**Estado:** parcial; confirmação integral pendente. O requisito está documentado, mas nem todos os critérios têm evidência reproduzível vinculada neste repositório.

- [x] Necessidade de preservar a origem do conhecimento científico registrada.
- [x] Necessidade de vincular fontes/evidências às respostas registrada.
- [ ] Confirmar quais fontes e trechos foram realmente utilizados em cada resposta.
- [ ] Rastrear pergunta, consulta de recuperação, trechos recuperados, resposta científica e resposta final do LEVI.
- [ ] Registrar metadados necessários (fonte, referência, data/versão e identificador de correlação quando disponível).
- [ ] Testar consultas sem fonte suficiente e garantir que incerteza/limitação seja explicitada.
- [ ] Publicar casos de teste reproduzíveis e resultados.

### Fase 4.4 — Biblioteca científica e busca
**Estado:** em validação; detalhes técnicos registrados em [quantica/README.md](quantica/README.md).

- [x] Serviço de biblioteca reportou 607 trechos em 3 documentos.
- [x] Identificado que os três documentos ativos são padrões NIST de criptografia pós-quântica (FIPS 203, 204 e 205), não um corpus geral de mecânica quântica.
- [x] Criado índice experimental separado para material MIT OCW sobre oscilador harmônico quântico.
- [x] Testada extração do PDF com PyMuPDF 1.28.2; extração de texto funcionou.
- [ ] Conferir visualmente as fórmulas afetadas pelo mapeamento incorreto de ℏ.
- [ ] Melhorar e medir relevância/cobertura de buscas em português.
- [ ] Validar o índice experimental antes de qualquer promoção para biblioteca ativa.

### Fases 4.5–4.10 — preservação obrigatória do plano original
O registro disponível confirma que a Fase 4 contém subfases até 4.10, mas esta consolidação não recuperou com segurança os títulos e critérios específicos de 4.5, 4.6, 4.7, 4.8, 4.9 e 4.10. Não atribuir nomes nem declarar estados por suposição. Próxima ação: recuperar o plano original e transcrever cada subfase literalmente, preservando os estados e as evidências já existentes.

| Subfase | Título/critério original | Estado |
|---|---|---|
| 4.5 | A recuperar do plano original | Pendente de reconciliação documental |
| 4.6 | A recuperar do plano original | Pendente de reconciliação documental |
| 4.7 | A recuperar do plano original | Pendente de reconciliação documental |
| 4.8 | A recuperar do plano original | Pendente de reconciliação documental |
| 4.9 | A recuperar do plano original | Pendente de reconciliação documental |
| 4.10 | A recuperar do plano original | Pendente de reconciliação documental |

## Fase 5 — validação integrada

Estado registrado em 13/10/2026: ainda não iniciada como fase formal. Iniciar depois que os critérios obrigatórios da Fase 4 forem aprovados. O escopo final deve seguir o plano original, que precisa ser recuperado antes de detalhar novos critérios.

## Evidências técnicas já registradas

- Teste histórico do encaminhamento LEVI → EU SOU: `levi: true`, `motor: "eu-sou"`, `validar_matematica` → `APROVADO`. A saída integral e a data exata devem ser anexadas quando recuperadas.
- Serviço local da biblioteca: estado saudável reportado, 607 trechos/3 documentos; os três documentos são padrões NIST de criptografia pós-quântica.
- Laboratório experimental do MIT: índice reportado com 26 trechos (22 do PDF + 4 de nota explicativa); não substitui a biblioteca ativa.
- Extração PDF: PyMuPDF 1.28.2 leu o material, mas alguns símbolos ℏ precisam ser conferidos visualmente.
- LEVI: resposta HTTP 200 em teste anterior; não é evidência suficiente, isoladamente, de integração ponta a ponta.
- Voz: eventos de escuta/transcrição foram observados, incluindo `no-speech`; ainda falta evidência reproduzível do ciclo pergunta falada → resposta do EU SOU → áudio.

## Arquivos relacionados

- [Estado atual](STATUS_ATUAL.md)
- [Biblioteca e laboratório de física quântica](quantica/README.md)
- [Integração LEVI](integracao-levi/README.md)

## Pendências para concluir a reconciliação histórica

1. Recuperar o arquivo local `C:\AdonaiDados\EU_SOU\backups\CONTINUIDADE_EU_SOU_FASE4_2026-10-13.txt` e os relatórios de teste originais.
2. Recuperar os títulos e critérios originais das subfases 4.5–4.10 e das Fases 6–10.
3. Comparar as evidências históricas com o estado do código atual sem apagar conclusões já comprovadas.
4. Atualizar este checklist com os dados originais e manter links para logs/relatórios.
5. Depois: concluir → testar → validar → documentar → publicar → avançar.

## Auditoria de fechamento por evidências — 13/10/2026

A auditoria do fechamento, limites da verificação remota e critérios para comprovar 100% por fase estão em [AUDITORIA_FECHAMENTO_FASES_2026-10-13.md](./AUDITORIA_FECHAMENTO_FASES_2026-10-13.md). As fases historicamente concluídas são preservadas; não são declaradas revalidadas sem executar novamente os testes no ambiente local.

## Diretriz vinculante de continuidade — 14/10/2026

Esta seção registra decisões explícitas do responsável pelo projeto em 14/10/2026. Ela complementa o histórico preservado; não substitui nem falsifica os títulos/estados originais que ainda precisem ser recuperados.

### Regra obrigatória: concluir as dez fases como um programa integrado

- Manter o foco na conclusão das **10 fases do Cérebro EU SOU**, acompanhando dependências e pendências entre elas até o fechamento global.
- Não abandonar, reiniciar arbitrariamente, declarar concluída sem evidências ou perder o histórico de nenhuma fase.
- Preservar o fluxo: **concluir → testar → validar → documentar → publicar → avançar**.
- Avançar em passos verificáveis, sem pular critérios obrigatórios. Fases historicamente concluídas devem ser preservadas como tais; a revalidação atual deve ser identificada separadamente.
- Sempre que for necessário executar um procedimento no Windows, preferir **um único bloco PowerShell**, curto, filtrado e seguro. Fazer backup antes de alterações e validar depois.
- Reutilizar pastas, módulos, tabelas e estruturas existentes no GitHub e Supabase. Criar novas estruturas somente quando a auditoria demonstrar necessidade; não criar tabelas ou migrations redundantes sem inspecionar o esquema e definir finalidade, RLS, permissões e testes.
- O acesso ao servidor local `http://127.0.0.1:3000` depende de execução no computador do responsável; conectores remotos não devem ser tratados como acesso automático ao localhost. Declarar acesso somente quando verificado.

### Arquitetura e separação obrigatórias

- **EU SOU:** núcleo de conhecimento, pesquisa, memória científica, cálculo, simulação, evidências e rastreabilidade.
- **LEVI:** orquestrador que encaminha solicitações e resultados autorizados às cinco empresas Adonai e aos agentes de cada empresa.
- O EU SOU compartilha conhecimento validado; isso não autoriza compartilhamento automático de dados privados, credenciais, backends ou bancos de dados.
- Manter cada empresa/sistema com escopo, dados, credenciais, permissões e backend próprios.
- **PSM Grupo Market permanece separado** e não deve ser contado como uma das cinco empresas Adonai nem fundido à arquitetura de dados delas.

### Objetivo científico transversal, com ênfase na Fase 10

A Fase 10 deve assegurar a consolidação e a expansão de um acervo de **conhecimento quântico multidisciplinar que atenda às necessidades das cinco empresas Adonai**, assim como conhecimento de **nanotecnologia quântica**. Este objetivo deve orientar a curadoria e a aplicação do conhecimento em todo o plano, não ficar isolado num único módulo.

O acervo deve desenvolver, conforme relevância e evidência disponível:
- fundamentos de mecânica quântica, matemática, física, computação e informação quânticas;
- métodos numéricos, otimização, modelagem, simulação, análise de incerteza e validação;
- materiais, nanoestruturas, instrumentação e conceitos de nanotecnologia quântica;
- aplicações pertinentes a Adonai Turbo, Adonai Marketing Digital, Adonai Finanças, Adonai Lab e Adonai Trade;
- fontes identificáveis, licenças, referências, versões, reprodutibilidade e distinção explícita entre fato verificado, hipótese, simulação e resultado experimental.

A integração empresarial deve ser feita por interfaces autorizadas e auditáveis. O LEVI coordena os agentes; não elimina os limites de acesso nem executa automaticamente ações comerciais ou financeiras.

### Plano de trabalho das Fases 5–10 — adição de escopo, não transcrição do plano original

Os itens abaixo são requisitos complementares registrados nesta data. Os títulos/critério originais das fases devem ser recuperados e reconciliados antes de substituir qualquer definição histórica.

- **Fase 5 — validação integrada:** contratos de API, testes científicos reproduzíveis, integração EU SOU–LEVI, falhas/timeout, segurança, regressão e evidências antes da publicação.
- **Fase 6 — expansão científica:** pesquisa e curadoria de fontes/código, licenças, procedência, cobertura multidisciplinar e avaliação de qualidade.
- **Fase 7 — memória e recuperação:** indexação, busca contextual, referências, versionamento, deduplicação, avaliação de relevância e separação entre memória científica e dados operacionais.
- **Fase 8 — pesquisa e simulação avançadas:** modelos físicos/matemáticos, circuitos e sistemas quânticos, nanoescala, experimentos computacionais reproduzíveis e análise de incerteza.
- **Fase 9 — aplicação empresarial:** integrações individualizadas para as cinco empresas Adonai, agentes, permissões, contratos, métricas e registros; cada integração é validada separadamente.
- **Fase 10 — consolidação e evolução do conhecimento:** consolidar governança e rastreabilidade e garantir a expansão contínua do conhecimento quântico multidisciplinar e de nanotecnologia quântica relevante às cinco empresas, coordenada pelo LEVI e seus agentes.

### Estado operacional registrado em 14/10/2026

- Validação atual de `validar_matematica`: respondeu `status: APROVADO`, método SymPy analítico + SciPy BFGS independente, ponto mínimo (3, -1), valor mínimo 5 e autovalores da Hessiana [2, 4].
- Teste anterior: `validar_oscilador` e `qubit_basico` retornaram respostas aprovadas.
- `particula_caixa`: falhou anteriormente com HTTP 400 e continua pendente de diagnóstico.
- `validar_matematica`: chamada anterior havia retornado HTTP 504; a chamada atual respondeu, mas a causa do timeout anterior ainda precisa ser determinada ou registrada como transitória com evidência.
- Portanto, esses resultados não autorizam declarar a Fase 4 ou o conjunto de dez fases concluído.

### Regra de publicação e registro

Cada alteração relevante deve apontar para evidências de teste, decisão, versão/commit e estado. Antes de criar estrutura no Supabase, inspecionar tabelas, colunas, RLS e migrations existentes. Usar as estruturas atuais quando adequadas; não duplicar o plano mestre em tabelas sem necessidade definida.

