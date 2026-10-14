# EU SOU — estado de continuidade do projeto

Atualizado em: 2026-10-13

## Regras de integridade
- Manter o EU SOU como componente separado, com escopo e dados próprios.
- Manter Adonai Turbo e PSM Grupo Market em repositórios e ambientes separados.
- Não substituir a biblioteca científica ativa com índices experimentais sem validação e aprovação explícitas.
- Não declarar integração, testes ou fases concluídos sem evidências reproduzíveis.
- Fluxo de trabalho: concluir → testar → validar → documentar → publicar → avançar.

## Fases — estado registrado
| Fase | Estado registrado | Observações |
|---|---|---|
| 1 | Concluída no registro de continuidade | Auditoria/inventário inicial. |
| 2 | Concluída no registro de continuidade | Motor científico; preservar relatórios de teste originais como evidência. |
| 3 | Declarada como 100% concluída anteriormente pelo responsável; registro precisa ser reconciliado | Não reabrir automaticamente. Comparar critérios originais e evidências antes de alterar o estado oficial. |
| 4 | Em andamento | Integração e evolução controlada do EU SOU. |
| 4.4 | Em andamento | Biblioteca científica e validação do material de física quântica. |
| 5 | Ainda não iniciada como fase formal | Validação integrada e preparação para publicação controlada; iniciar após aprovação dos itens obrigatórios da Fase 4. |

Este quadro é um registro de continuidade baseado nas informações disponíveis em 2026-10-13; não substitui os planos e relatórios originais de aceitação.

## Fase 4.4 — biblioteca científica

### Biblioteca ativa
O serviço local de biblioteca respondeu anteriormente com estado saudável e 607 trechos de 3 documentos. Os três documentos identificados são padrões NIST de criptografia pós-quântica: NIST FIPS 203 (ML-KEM), NIST FIPS 204 (ML-DSA) e NIST FIPS 205 (SLH-DSA).

Esse corpus é específico de criptografia pós-quântica e não é suficiente, por si só, para responder a perguntas gerais sobre mecânica quântica. A biblioteca ativa deve permanecer preservada até uma migração validada e aprovada.

### Laboratório experimental de oscilador quântico
Foi criado um laboratório separado com material do MIT OpenCourseWare, “8.04 Quantum Physics I — Lecture 8”, sobre o oscilador harmônico quântico. O índice experimental contém 26 trechos reportados: 22 do PDF do MIT e 4 de uma nota explicativa local.

Resultados de busca já observados no laboratório:
- “quantum harmonic oscillator energy eigenvalues” encontrou trechos relevantes sobre os autovalores.
- “ground state zero point energy” encontrou trechos relevantes sobre a energia não nula do estado fundamental.
- Algumas consultas terminológicas ainda não recuperam resultados adequados; relevância e cobertura precisam ser melhoradas.

### Extração de PDF e fórmulas
Em 2026-10-13, a extração das páginas 8 e 9 do PDF do MIT foi testada com PyMuPDF 1.28.2, instalado isoladamente no laboratório. O teste leu as 10 páginas do PDF sem alterar a biblioteca ativa.

A extração recuperou o texto, mas algumas fórmulas exibem o símbolo de constante de Planck reduzida (ℏ) como “J” ou com mapeamento incorreto. Portanto:
1. Conferir as fórmulas visualmente no PDF original.
2. Corrigir apenas com base na fonte primária e registrar cada correção.
3. Testar a extração e a indexação experimental.
4. Avaliar precisão e relevância das buscas.
5. Não promover o índice experimental para a biblioteca ativa sem validação explícita.

Fonte primária: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/808334d09369e3a726f6f20d82315c20_MIT8_04S13_Lec08.pdf

## Integração LEVI ↔ EU SOU
- A rota de orquestração do LEVI respondeu HTTP 200 em um teste anterior. Isso comprova apenas a resposta daquela rota, não uma integração ponta a ponta com o EU SOU.
- Ainda não há evidência registrada neste documento de um teste completo em que uma pergunta falada ao LEVI seja encaminhada ao EU SOU, respondida com base científica e reproduzida por áudio.
- A escuta contínua do navegador e os eventos de transcrição foram observados em testes anteriores, incluindo ocorrências de no-speech; isso não prova, por si só, o fluxo de voz completo.
- Manter a configuração atual da voz do LEVI inalterada, salvo solicitação explícita do responsável.
- Próximo passo: inspecionar as rotas e executar teste rastreável de pergunta → encaminhamento → resposta do EU SOU → resposta falada, sem alterar arquivos antes de identificar o caminho real.

## Próximas ações
1. Reconciliar a documentação original e as evidências da Fase 3, sem remover sua declaração anterior de conclusão.
2. Validar visualmente as fórmulas do MIT e melhorar a extração no laboratório.
3. Medir a relevância das buscas com consultas de teste registradas.
4. Executar e documentar o teste ponta a ponta LEVI ↔ EU SOU por texto e por voz.
5. Só então aprovar eventual promoção do corpus experimental e preparar a validação formal da Fase 5.