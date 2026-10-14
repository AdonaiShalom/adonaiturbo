# Plano de integração científica — EU SOU, LEVI e cinco operações Adonai

**Versão:** 1.0 — 14/10/2026  
**Repositório:** `AdonaiShalom/adonaiturbo`  
**Status:** plano e checklist aprovados para execução; não representa integração já concluída.

## 1. Objetivo e regras de arquitetura

- [ ] EU SOU é o núcleo científico: fontes, recuperação de trechos, cálculos, modelos, simulações, incerteza, validação e evidências.
- [ ] LEVI é o orquestrador: identifica a intenção, consulta EU SOU para conhecimento científico, recebe evidências e encaminha recomendações aos agentes autorizados.
- [ ] Toda resposta científica ou recomendação baseada em conhecimento deve registrar a consulta ao EU SOU, fontes/trechos recuperados, método, limitações e resultado. Se não houver evidência suficiente, informar a lacuna.
- [ ] Consultas operacionais podem usar os sistemas próprios de cada empresa; isso não autoriza misturar dados privados, credenciais, históricos ou backends entre empresas.
- [ ] GitHub versiona código, migrations, contratos e documentação; Supabase guarda metadados científicos, execuções, evidências e estado operacional; servidor local executa as APIs. A sincronização precisa ser testada, não presumida.
- [ ] PSM Grupo Market permanece separado, com projeto, dados, credenciais, agentes e backend próprios. Não é uma das cinco operações Adonai deste plano.
- [ ] Não afirmar vantagem quântica, retorno financeiro ou desempenho de nanotecnologia sem evidência experimental ou benchmark reproduzível. Comparar sempre com uma linha de base clássica.
- [ ] Nenhuma operação financeira, publicação comercial, alteração de produção ou experimento físico de risco deve ser executado automaticamente sem permissões e aprovação apropriadas.

## 2. Conteúdo científico comum que o EU SOU precisa catalogar

### Mecânica quântica e matemática
- [ ] Álgebra linear complexa, vetores/estados, operadores, autovalores/autovetores e produtos internos.
- [ ] Função de onda, normalização, amplitude e densidade de probabilidade, observáveis e regra de Born.
- [ ] Equação de Schrödinger dependente e independente do tempo; evolução, estados estacionários e valores esperados.
- [ ] Superposição, interferência, princípio da incerteza, emaranhamento, medição, decoerência e limites de interpretação.
- [ ] Poços e barreiras de potencial, tunelamento, oscilador harmônico, átomo de hidrogênio e espalhamento.
- [ ] Métodos numéricos, solução de equações, otimização, propagação de erro, análise de sensibilidade e incerteza.

### Informação e computação quânticas
- [ ] Qubits, portas e circuitos, estados mistos/matrizes densidade, emaranhamento e ruído.
- [ ] Algoritmos quânticos e suas hipóteses, requisitos de hardware, complexidade e limitações.
- [ ] Otimização quântica e inspirada em métodos quânticos: benchmarks reproduzíveis contra métodos clássicos equivalentes.
- [ ] Criptografia pós-quântica separada conceitualmente de mecânica quântica e de computação quântica; mapear NIST FIPS 203, 204 e 205 como segurança criptográfica, não como corpus geral de física.

### Nanotecnologia quântica e materiais
- [ ] Física de nanoescala (aprox. 1–100 nm), confinamento quântico e efeitos dependentes do tamanho.
- [ ] Pontos quânticos, nanocristais, nanofios, materiais 2D, nanoestruturas semicondutoras, spintrônica e nanofotônica.
- [ ] Propriedades eletrônicas, ópticas, magnéticas, térmicas e mecânicas; superfícies, interfaces e transporte.
- [ ] Modelagem atômica/nanoescala, simulação, caracterização e metrologia; microscopia eletrônica, STM/AFM e métodos apropriados ao material.
- [ ] Síntese, reprodutibilidade, pureza, estabilidade, escalabilidade, custo, ciclo de vida e segurança ambiental/ocupacional.
- [ ] Distinguir resultado publicado, hipótese, simulação e resultado experimental; registrar limites, licença, data, versão e origem.

## 3. Checklist por operação

### A. Adonai Turbo — plataforma e inteligência
- [ ] Contrato único de consulta LEVI → EU SOU com ID de correlação, intenção, empresa solicitante e contexto mínimo necessário.
- [ ] Recuperação científica com fontes/trechos e pontuação de relevância; recusa explícita quando evidência insuficiente.
- [ ] Resposta estruturada: conclusão, evidências, método, confiança/limitações, riscos e próximo passo.
- [ ] Memória de conversa separada de biblioteca científica; versionamento e auditoria.
- [ ] Health checks e testes ponta a ponta: pergunta → EU SOU → evidências → LEVI → resposta por texto; depois voz e áudio.
- [ ] Permissões por empresa/agente, logs sem segredos e fallback seguro quando EU SOU estiver indisponível.
- [ ] Métodos quânticos/inspirados somente em ambiente experimental até comparação com baseline e revisão humana.

### B. Adonai Marketing Digital — marketing, publicidade e afiliados
- [ ] Estatística, probabilidade, desenho experimental, A/B tests, inferência causal, atribuição e análise de conversão.
- [ ] Otimização clássica de orçamento, campanhas, segmentação, calendário e alocação de recursos como baseline.
- [ ] Pesquisa exploratória sobre otimização quântica/inspirada em alocação e planejamento; exigir benchmark com dados comparáveis.
- [ ] Conhecimento de nanotecnologia usado para validar conteúdo técnico de clientes/produtos: fonte primária, alegações permitidas, riscos e limites; proibir alegações científicas sem evidência.
- [ ] Agentes com permissões de análise, criação, revisão e publicação separadas; publicação exige autorização conforme política da empresa.
- [ ] Isolar totalmente o ambiente Adonai Marketing Digital do PSM Grupo Market.

### C. Adonai Finanças — análise financeira e gestão de risco
- [ ] Probabilidade, séries temporais, estatística, otimização de portfólio, correlação, liquidez, drawdown, risco de cauda e cenários.
- [ ] Comparar modelos clássicos de risco/otimização com quaisquer métodos quânticos ou quantum-inspired; medir custo computacional e estabilidade.
- [ ] Modelar incerteza, custos, taxas, slippage, limites de dados e risco de sobreajuste.
- [ ] Pesquisa de mercado sobre setores de computação quântica/nanomateriais apenas com fontes, data e distinção entre fato e projeção.
- [ ] Nenhuma promessa de retorno; nenhuma ordem financeira real sem autorização explícita, controles e validação independentes.
- [ ] Manter credenciais, contas, dados pessoais e histórico financeiro no ambiente autorizado de Finanças.

### D. Adonai Lab — ciência aplicada e laboratório
- [ ] Desenho de experimentos, estatística, metrologia, análise de incerteza, reprodutibilidade e gestão de amostras.
- [ ] Física quântica de materiais; pontos quânticos, nanoestruturas, propriedades ópticas/elétricas/térmicas e interfaces.
- [ ] Formulações, alimentos e agronomia: literatura específica, composição, estabilidade, dose/concentração, compatibilidade, métodos analíticos e segurança conforme o domínio.
- [ ] Modelos de simulação com parâmetros, unidades, condições de contorno, versão e validação contra dados experimentais.
- [ ] Caracterização, controle de qualidade, segurança ocupacional/ambiental e rastreabilidade de lotes.
- [ ] Separar hipótese, simulação e resultado medido; não recomendar aplicação prática sem evidência e revisão técnica apropriadas.

### E. Adonai Trade — pesquisa e estratégia de mercado
- [ ] Dados de mercado, qualidade temporal, viés de sobrevivência, look-ahead bias, regimes, volatilidade e gestão de risco.
- [ ] Backtesting walk-forward, fora da amostra, benchmark, custos, slippage e relatório de robustez.
- [ ] Avaliar métodos de otimização quântica/inspirada apenas como pesquisa comparativa; não pressupor vantagem sobre métodos clássicos.
- [ ] Usar conhecimento quântico/nanotecnológico para pesquisa setorial e análise de tecnologias quando pertinente, não como sinal automático de compra/venda.
- [ ] Agentes de pesquisa, validação, risco e execução com permissões distintas; negociação real permanece desabilitada até autorização e testes específicos.
- [ ] Publicar recomendação com evidências, horizonte, premissas, risco, limites e critérios de parada.

## 4. Agentes e direção do LEVI

Para cada operação, inventariar os agentes reais existentes antes de criar novos. Cada agente precisa de: ID estável, empresa/escopo, capacidades, permissões, estado, responsável, contratos de entrada/saída, testes e logs. Não inventar que agentes estão ativos sem consulta ao banco e teste.

- [ ] LEVI identifica empresa, tipo de pedido e nível de risco.
- [ ] LEVI consulta EU SOU para perguntas científicas, cálculo, hipótese, modelo e recomendação baseada em evidência.
- [ ] EU SOU devolve fontes, trechos, método, incerteza e limitações; LEVI não pode transformar ausência de evidência em certeza.
- [ ] LEVI encaminha tarefa ao agente correto apenas após verificar escopo/permissão.
- [ ] Agentes devolvem resultado estruturado; LEVI consolida, valida e registra.
- [ ] Ações irreversíveis, financeiras, de publicação ou de laboratório exigem controle/aprovação apropriados.
- [ ] Testar indisponibilidade, timeout, resposta vazia, fonte irrelevante, permissão negada e tentativa de acesso cruzado.

## 5. Registro de fontes e recuperação

Fontes primárias iniciais a catalogar (metadados e links; respeitar licenças e termos antes de armazenar documentos completos):

1. MIT OpenCourseWare, 8.04 Quantum Physics I — fundamentos, função de onda, Schrödinger, incerteza, estados de energia e oscilador: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/
2. MIT OCW, Lecture Notes — lista de notas por assunto: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/pages/lecture-notes/
3. NIST, Quantum Information Science — computação, redes, sensores e metrologia: https://www.nist.gov/quantum-information-science
4. National Quantum Initiative — estratégia e relatórios de ciência/tecnologia quântica: https://www.quantum.gov/strategy-documents/
5. National Nanotechnology Initiative — escala, propriedades e aplicações da nanotecnologia: https://www.nano.gov/about-nanotechnology/
6. NNCO, What Is So Special about Nano? — efeitos quânticos na nanoescala: https://www.nano.gov/about-nanotechnology/what-is-so-special-about-nano/
7. NIST, Designing the Nanoworld — pontos quânticos, nanodispositivos, nanofotônica e modelagem atômica: https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
8. NIST FIPS 203/204/205 — registrar em domínio separado de criptografia pós-quântica.

Para cada fonte: título, instituição/autores, URL/DOI, licença, data de publicação/acesso, versão, domínio, idioma, hash quando arquivo for armazenado, método de extração, páginas/trechos, estado de validação e usos autorizados.

## 6. Integração GitHub ↔ servidor 3000 ↔ Supabase

### GitHub
- [ ] Preservar este plano e atualizar estado por commit.
- [ ] Identificar branch/commit que corresponde ao código local; comparar `backend/server.js`, `backend/levi-core.js`, `backend/eu-sou-api.js` e arquivos da biblioteca.
- [ ] Testar build/validações no commit candidato antes de publicar.

### Supabase
- [ ] Reutilizar o esquema existente `eu_sou`: `science_domains`, `scientific_sources`, `source_domain_links`, `scientific_tools`, `scientific_models`, `validation_benchmarks`, `scientific_runs`, `run_evidence` e `phase_checkpoints`.
- [ ] Inspecionar e configurar RLS/políticas com princípio do menor privilégio antes de habilitar gravações pela aplicação.
- [ ] Cadastrar domínios e metadados das fontes; não armazenar documentos protegidos sem permissão nem segredos em registros científicos.
- [ ] Registrar cada execução com versão, parâmetros não sensíveis, resultado, evidências e estado de validação.
- [ ] Não duplicar tabelas nem criar migrations até validar o esquema existente e os contratos.

### Servidor local 3000
- [ ] Executar health checks e confirmar versões/commit em execução.
- [ ] Confirmar endpoint EU SOU e endpoint LEVI; verificar URL, timeout, contrato e tratamento de falha.
- [ ] Testar busca direta por “equação de Schrödinger”, “oscilador harmônico”, “ponto quântico” e “nanotecnologia quântica”; inspecionar fonte/trecho, não apenas HTTP 200.
- [ ] Testar uma pergunta científica via LEVI e confirmar que a resposta usa evidências recuperadas pelo EU SOU.
- [ ] Repetir com pergunta sem cobertura e confirmar que a limitação é declarada.
- [ ] Testar voz mantendo a configuração atual do LEVI: fala → transcrição → consulta EU SOU → resposta → áudio.
- [ ] Fazer backup, testar, validar, documentar e só então promover/publicar.

## 7. Critérios para declarar o sistema operacional

- [ ] Índice ativo contém corpus de física quântica e nanotecnologia validado, não apenas criptografia pós-quântica.
- [ ] Testes de recuperação aprovados por tópico, idioma, fonte e relevância.
- [ ] Cada resposta científica tem proveniência e limitações verificáveis.
- [ ] LEVI comprovadamente chama EU SOU e usa a resposta retornada.
- [ ] Supabase possui fontes/domínios/evidências cadastrados e RLS validado.
- [ ] Cinco operações possuem escopos, agentes reais, permissões e testes separados.
- [ ] Nenhum acesso cruzado indevido; falhas e timeouts são seguros.
- [ ] Testes por texto e voz aprovados; logs e commit identificados.
- [ ] Checklist e evidências atualizados; somente então declarar conclusão.

## 8. Ordem de execução para reduzir retrabalho

1. **Congelar alterações paralelas e inventariar** versões locais, GitHub, endpoints, tabelas, políticas e agentes.
2. **Corrigir a recuperação científica** usando primeiro o índice experimental existente; preservar o índice ativo e validá-lo antes de promover.
3. **Cadastrar metadados de fontes e domínios** nas tabelas existentes, após resolver RLS e contrato de acesso.
4. **Validar a consulta LEVI → EU SOU → LEVI** por texto, com fonte/trecho e ID de correlação.
5. **Completar a cobertura científica** por módulos e medir recuperação/relevância; adicionar conteúdo apenas com fonte e licença verificadas.
6. **Integrar e testar cada uma das cinco operações** individualmente; inventariar os agentes reais antes de habilitá-los.
7. **Validar voz, segurança, falhas e regressão**.
8. **Documentar, versionar e publicar** somente com evidências reproduzíveis.

**Estado inicial conhecido em 14/10/2026:** o repositório contém a estrutura documental; o Supabase possui as tabelas de registro científico, mas os catálogos estão vazios; a biblioteca ativa conhecida é de criptografia pós-quântica e o material MIT de oscilador permanece experimental. A integração ponta a ponta e a ativação de todos os agentes ainda precisam ser demonstradas.
