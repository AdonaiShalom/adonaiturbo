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

## Checklist mestre e subfases da Fase 4
Consulte [PLANO_MESTRE_E_CHECKLIST.md](PLANO_MESTRE_E_CHECKLIST.md) para o registro consolidado das Fases 1–10, os estados históricos das Fases 4.1–4.4, as pendências de evidência e as subfases 4.5–4.10 cujos títulos precisam ser recuperados da fonte original. A ausência de um título nesta consolidação não significa que a etapa foi perdida ou não foi concluída.

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

## Atualização de auditoria e catálogo — 2026-10-14

### Engenharia reversa do repositório conectado
A árvore de arquivos do repositório consultado contém o aplicativo FreeLLMAPI em Next.js e a função src/lib/knowledge.ts, que lê src/knowledge/manual_adonai.md. A árvore não contém backend/server.js, backend/levi-core.js nem frontend/eu-sou-completo/biblioteca-local/server.py. Portanto, este repositório documenta o projeto EU SOU, mas não é evidência de que o backend local em localhost:3000 esteja versionado ou sincronizado neste mesmo repositório. É necessário localizar o repositório/commit correspondente ao backend local antes de publicar alterações nele.

### Catálogo científico Supabase
- Domínios científicos: 12 no total, incluindo mecânica quântica, informação quântica, nanotecnologia quântica, sensores, nanofotônica, química quântica, materiais, nanoeletrônica, métodos científicos e criptografia pós-quântica.
- Fontes candidatas: 11, incluindo MIT OCW 8.04/8.05, NIST Quantum Information Science, National Quantum Initiative, National Nanotechnology Initiative, NIST nanoworld e FIPS 203/204/205.
- Relações fonte-domínio: 11.
- Fontes revisadas/validadas: 0. Todas as novas fontes permanecem não revisadas e são apenas metadados/links; não foi armazenado o texto integral dos materiais.
- Foi corrigida a restrição de unicidade de DOI para permitir múltiplas fontes sem DOI: o índice agora é único apenas para DOI não nulo. Isso preserva a unicidade de DOIs existentes e permite catalogar fontes institucionais sem DOI.

### Mapa de conhecimento por operação
Publicado [MAPA_CONHECIMENTO_QUANTICO_5_OPERACOES.md](quantica/MAPA_CONHECIMENTO_QUANTICO_5_OPERACOES.md), com os módulos curriculares Q01–Q05, fontes candidatas, aplicação às cinco operações e critérios de aceitação.

### Pendências operacionais — não declarar concluído
1. Ingerir e validar documentos completos autorizados; os metadados do catálogo não são o corpus de recuperação.
2. Validar e integrar o índice experimental sem substituir o índice ativo às cegas.
3. Demonstrar consulta LEVI → EU SOU com fontes/trechos reais e resposta que os utilize.
4. Inspecionar RLS: a auditoria anterior encontrou tabelas com RLS habilitado e nenhuma política retornada; revisar permissões antes de habilitar acessos pela aplicação.
5. Identificar e versionar o repositório correto do backend local; o repositório atual não contém os arquivos centrais do servidor local.
6. Inventariar agentes reais, escopos e permissões das cinco operações e testar cada uma isoladamente.


## Execucao de incorporacao de conhecimento — 2026-10-14

- Publicado corpus sintetico original: `eu-sou/quantica/corpus/NUCLEO_CIENTIFICO_QUANTICA_NANOTECNOLOGIA.md` (commit `74cffa83671f618e82f8fa0b4690c10ab9367ff4`). Contem fundamentos de mecânica quântica, informação quântica, confinamento e pontos quânticos, nanoeletrônica, nanofotônica, química quântica, validação e checklist por operação.
- Catálogo Supabase atualizado com 6 repositórios públicos candidatos (QuTiP, QuTiP Tutorials, Kwant, OSSCAR Quantum Mechanics, OpenQDC e AiiDA Common Workflows), 6 relações domínio-fonte e 6 ferramentas registradas em `eu_sou.scientific_tools`.
- Todos os seis recursos estão marcados como `candidate`/`unreviewed`; nenhum motor foi instalado, nenhum dataset foi baixado e nenhum documento integral de terceiros foi copiado para o corpus.
- O conteúdo do novo arquivo do GitHub ainda precisa ser ingerido pela biblioteca ativa em `C:\\AdonaiTurbo\\frontend\\eu-sou-completo\\biblioteca-local\\`. Não existe evidência de que o servidor 3000 o esteja consultando.
- Próxima validação obrigatória: ingestão com backup, teste de pesquisa de Schrödinger/oscilador e ponto quântico, depois teste real LEVI → API EU SOU com referências retornadas.


## Pesquisa aprofundada e estratégia de cobertura — 2026-10-14

- Publicado plano estratégico detalhado: `eu-sou/quantica/PLANO_ESTRATEGICO_CINCO_OPERACOES.md` (commit `89598ed6b6d7b9e12d17f237c232824444530fe1`).
- Analisados READMEs públicos de QuTiP, Kwant, OSSCAR Quantum Mechanics, PennyLane, Qiskit Finance, quacc e QuantumDeviceSEM, além de um projeto de autômatos celulares de pontos quânticos. Tratados como referências/candidatos; não como resultados científicos certificados.
- Tendências oficiais verificadas em fontes de 2026: fabricação escalável de componentes quânticos (NIST, 29/06/2026), materiais quânticos e manufatura (NSF, 21/07/2026), e em fontes técnicas contínuas: sensores/metrologia, fotônica integrada, nanoestruturas e segurança pós-quântica.
- Conclusão estratégica: priorizar (1) recuperação científica com proveniência, (2) benchmarks e simulações reproduzíveis, (3) nanomateriais/nanoeletrônica/nanofotônica/sensores, (4) estatística e risco para Finanças/Trade, (5) validação de alegações e experimentação para Marketing, e (6) isolamento de permissões e dados por empresa.
- Pendência crítica: o plano e os catálogos não são ingestão executável. A biblioteca local e o servidor 3000 ainda precisam passar testes de recuperação e de ponta a ponta; agentes e Adonai Trade não podem ser declarados operacionais sem inventário e testes.


## Organização em cinco pastas empresariais — 2026-10-14

- Publicado índice mestre: `eu-sou/quantica/INDICE_MESTRE.md` (commit `8925a1dce6da8bf13a06c7f20a3ec1b0b1139d15`).
- Criadas cinco pastas no GitHub com README operacional e científico:
  - `eu-sou/quantica/empresas/adonai-turbo/README.md` (commit `3567dfebd6be2d2ce866f219143a6e4c5e43f20a`)
  - `eu-sou/quantica/empresas/adonai-marketing-digital/README.md` (commit `60c63279b4ac11a70fbd9f9b786f821b61452091`)
  - `eu-sou/quantica/empresas/adonai-financas/README.md` (commit `2ca58386ea4a6442f9ae6599606336f924edc8c7`)
  - `eu-sou/quantica/empresas/adonai-lab/README.md` (commit `bf9a71e9ef2a567ddc1d4392bd9ee424b5592dd2`)
  - `eu-sou/quantica/empresas/adonai-trade/README.md` (commit `f06006d0c48a409d29495998ad67803906ff1c63`)
- Os cinco documentos foram catalogados no schema `eu_sou` do Supabase em `scientific_sources`, com slug da empresa, domínio, URL e estado `unreviewed`; relações com domínios existentes também foram criadas.
- A estrutura separa conteúdo científico comum de aplicação específica por empresa. Adonai Trade permanece não instalado até evidência; PSM Grupo Market permanece separado.
- **Pendente:** ingestão real dos arquivos do GitHub na biblioteca local EU SOU, testes de recuperação por empresa e prova de consulta ponta a ponta do LEVI no servidor :3000. O catálogo Supabase guarda metadados/URLs, não o conteúdo integral dos documentos.
