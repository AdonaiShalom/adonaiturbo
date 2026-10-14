# Engenharia reversa externa — ecossistema quântico e nanotecnologia para EU SOU

**Data da auditoria:** 2026-10-14  
**Finalidade:** mapear repositórios públicos reutilizáveis, seus domínios científicos, oportunidades de integração e aplicação às cinco operações.  
**Limite importante:** esta auditoria consulta documentação pública e estrutura de projetos; não instala dependências nem importa automaticamente o conteúdo de terceiros. O registro deste mapa não significa que o EU SOU já contenha todos os textos ou que os cálculos estejam executáveis localmente.

## 1. Resultado executivo

A engenharia reversa identificou quatro camadas distintas que o EU SOU deve manter separadas e interoperáveis:

1. **Conhecimento explicativo:** livros abertos, cursos, documentação e artigos científicos com proveniência.
2. **Motores de cálculo/simulação:** software científico open source, com versões, dependências, testes e condições de validade.
3. **Dados e benchmarks:** conjuntos de dados, licenças, metadados, splits e baselines reproduzíveis.
4. **Orquestração e governança:** API do EU SOU, LEVI, agentes por operação, isolamento de dados, registro de evidências e permissões.

O corpus atual conhecido (três documentos NIST de criptografia pós-quântica) não cobre os domínios de física quântica e nanotecnologia. Os repositórios abaixo agregam capacidade de cálculo e estrutura científica, mas não substituem um corpus curado de fontes primárias.

## 2. Repositórios públicos examinados

### R01 — QuTiP
- Repositório: https://github.com/qutip/qutip
- Licença declarada no repositório: BSD-3-Clause.
- Escopo: simulação de sistemas quânticos abertos/fechados, dinâmica, Hamiltonianos dependentes do tempo, operadores de colapso e visualização.
- Aplicação ao EU SOU: camada de simulação opcional para modelos de dinâmica quântica, óptica quântica e decoerência; não é um mecanismo de recuperação de livros.
- Integração segura: adaptador de cálculo isolado, versão fixada, limites de CPU/memória/tempo, entradas e unidades validadas, saída numérica e configuração registradas.
- Validação mínima: comparar casos didáticos/analíticos, testar convergência e registrar versão e parâmetros.
- Aplicações: Turbo (serviço de cálculo); Lab (modelagem); Marketing/Finanças/Trade apenas em pesquisa específica, não como alegação de vantagem automática.

### R02 — QuTiP Tutorials
- Repositório: https://github.com/qutip/qutip-tutorials
- Escopo: notebooks didáticos para representar estados, operadores, matrizes densidade e simulações.
- Aplicação: material de aprendizagem estruturado e exemplos reprodutíveis; converter metadados e texto autorizado em documentos indexáveis, mantendo referência ao notebook, autor e licença.
- Validação: executar exemplos em ambiente isolado e preservar outputs/versionamento; conteúdo sem outputs não deve ser apresentado como resultado já executado.

### R03 — Kwant
- Repositório: https://github.com/kwant-project/kwant
- Escopo: transporte quântico, modelos tight-binding, grafeno, isolantes topológicos, efeito Hall quântico, supercondutividade, spintrônica e eletrônica molecular.
- Aplicação: potencial motor de cálculo para Adonai Lab em nanoestruturas e transporte eletrônico, sujeito à compatibilidade do ambiente e ao domínio do modelo.
- Limites: requer geometria, Hamiltoniano, parâmetros físicos e condições de contorno adequados; simulação não é medição experimental.

### R04 — OSSCAR Quantum Mechanics and Computational Materials Science
- Repositório: https://github.com/osscar-org/quantum-mechanics
- Escopo: notebooks interativos de mecânica quântica e ciência computacional de materiais.
- Aplicação: trilha didática e casos de teste; selecionar notebooks, registrar licenças e verificar resultados antes de integrar ao corpus.

### R05 — OpenQDC
- Repositório: https://github.com/valence-labs/openQDC
- Escopo declarado: hub de datasets de química quântica preparados para ML, com conjuntos de dados e metadados.
- Aplicação: pesquisa do Adonai Lab sobre química quântica, moléculas e materiais; não carregar datasets grandes sem estimar armazenamento, RAM, licença, versão e utilidade.
- Validação: confirmar dataset individual, licença, unidades, método QM, composição, proveniência, splits e adequação ao problema.

### R06 — AiiDA Common Workflows
- Repositório: https://github.com/aiidateam/aiida-common-workflows
- Escopo: interfaces comuns de workflows de ciência de materiais computacional com engines de cálculo.
- Aplicação: referência arquitetural para workflows reproduzíveis do Lab; não implica que os engines de simulação necessários estejam instalados ou licenciados.

### R07 — QuTiP Virtual Lab
- Repositório: https://github.com/qutip/qutip-virtual-lab
- Escopo: interface de laboratório virtual para aprender e explorar mecânica quântica.
- Aplicação: possível interface didática futura; não é dependência prioritária do backend científico e não deve ser confundida com o motor de recuperação do EU SOU.

### R08 — QSBench
- Repositório: https://github.com/QSBench
- Escopo declarado: datasets sintéticos reprodutíveis para benchmarks de circuitos quânticos, incluindo valores ideais/com ruído e metadados.
- Aplicação: benchmarks de computação quântica e robustez; não é evidência de vantagem prática nem substituto de benchmarks clássicos.

## 3. Mapa de conhecimento necessário por operação

### A. Adonai Turbo — plataforma central
**Conhecimento a incorporar:** fundamentos de mecânica quântica; álgebra linear complexa; probabilidade; computação/informação quânticas; física estatística; materiais e nanoescala; métodos numéricos; interpretação de resultados; epistemologia e limites dos modelos.
**Capacidade:** pesquisa com citação; recuperação híbrida/semântica; cálculo isolado; explicação de unidades, pressupostos, incerteza e validade; detecção de lacunas.
**Critério:** toda resposta científica importante deve distinguir fonte, cálculo executado, hipótese, inferência e ausência de evidência.

### B. Adonai Marketing Digital
**Conhecimento:** estatística, desenho experimental, inferência causal, A/B testing, otimização clássica, qualidade de evidência, comunicação de incerteza e regulação de alegações.
**Uso quântico/nano:** comunicar pesquisas sobre sensores, materiais, chips, fotônica e nanotecnologia apenas com fontes verificadas; simulações quânticas são contexto de pesquisa, não prova de eficácia de produto.
**Agentes:** pesquisa → verificação científica → redação → revisão de alegações → publicação autorizada.
**Bloqueio:** não misturar dados, contas ou agentes do PSM Grupo Market.

### C. Adonai Finanças
**Conhecimento:** probabilidade, estatística, séries temporais, otimização, correlação, liquidez, volatilidade, risco de cauda, inferência causal, validação fora da amostra e economia de tecnologias emergentes.
**Uso quântico/nano:** análise setorial de empresas, cadeia de suprimentos, maturidade tecnológica, patentes, custos e riscos; métodos quantum-inspired/quânticos só em comparação experimental com baselines clássicos.
**Controles:** sem promessa de retorno, sem execução automática de ordens por alegação de superioridade quântica, com custo, slippage, risco e rastreabilidade.

### D. Adonai Lab
**Conhecimento:** mecânica e química quânticas; estrutura eletrônica; DFT e limites; materiais 2D; pontos quânticos; nanofios; superfícies/interfaces; nanoeletrônica; nanofotônica; sensores; espectroscopia; microscopia; metrologia; síntese/caracterização; toxicologia e segurança específica do material.
**Motores candidatos:** QuTiP para dinâmica quântica; Kwant para transporte em sistemas tight-binding; OpenQDC para datasets de química quântica; AiiDA para workflows reproduzíveis; OSSCAR e QuTiP Tutorials para casos didáticos.
**Critério:** parâmetros, unidades, versões, dados de entrada, logs, incerteza, teste de convergência e comparação experimental ou analítica. Não executar síntese ou protocolo laboratorial com base apenas em uma simulação.

### E. Adonai Trade (ainda não instalado)
**Conhecimento:** microestrutura de mercado, séries temporais, probabilidade, otimização, validação walk-forward, backtest sem leakage, custos, slippage, drawdown e risco.
**Uso quântico/nano:** informação setorial e pesquisa de empresas de computação quântica, semicondutores, sensores e materiais; jamais transformar material didático ou promessa comercial em sinal de trade.
**Critério antes da instalação:** contrato de dados e APIs, paper trading, benchmarks clássicos, testes de risco e autorização explícita para execução real. O EU SOU deve poder atender com conhecimento desde já, mas o Trade não deve ser declarado operacional enquanto não estiver instalado e testado.

## 4. Arquitetura de conhecimento recomendada

### Camada 1 — Catálogo (Supabase)
Registrar fonte, título, autores/instituição, URL/DOI, licença, tipo, data de acesso, versão, hash, idioma, domínio, estado de revisão e política de uso. Catálogo é metadado, não o texto integral.

### Camada 2 — Corpus e armazenamento
Armazenar somente conteúdo autorizado. Preservar arquivo original, checksum, extração textual, páginas, figuras/equações que exijam revisão, e relação entre trechos e fonte. Não assumir que links GitHub dão permissão irrestrita para redistribuir todos os dados.

### Camada 3 — Recuperação
Pesquisar por domínio e por pergunta, recuperar trechos com proveniência, avaliar relevância e permitir resposta “não encontrei evidência”. Testar consultas em português/inglês e paráfrases. Separar criptografia pós-quântica de mecânica quântica.

### Camada 4 — Ferramentas de cálculo
Adaptadores separados para QuTiP/Kwant/datasets, sem executar código arbitrário recebido do usuário. Cada chamada deve ter timeout, limites, validação, logs, versão do software, parâmetros e resultados reproduzíveis. O mecanismo de recuperação não deve depender de um pacote científico pesado para responder perguntas documentais.

### Camada 5 — LEVI e agentes
LEVI recebe pergunta, empresa e agente autorizado; consulta o EU SOU; devolve resposta com evidências e encaminha apenas a recomendação adequada à operação. Permissões por empresa, correlation ID, trilha de auditoria e falha segura. Não misturar PSM Grupo Market.

## 5. Priorização sem retrabalho

**P0 — Provar a integração atual**
- Encontrar qual repositório contém o backend local da porta 3000.
- Testar a chamada LEVI → API EU SOU com uma pergunta e confirmar fontes recuperadas.
- Verificar se o serviço de biblioteca carrega o índice correto; não substituir o índice ativo sem backup e validação.

**P1 — Conteúdo mínimo com alta cobertura**
- Mecânica quântica fundamental (estados, Schrödinger, Born, medição, tunelamento, oscilador, spin, emaranhamento, decoerência).
- Nanoescala (confinamento, pontos quânticos, nanofios, materiais 2D, transporte, nanofotônica).
- Métodos científicos, unidades, incerteza e limitações.
- Fontes primárias e material didático aberto com licença verificada.

**P2 — Reprodutibilidade e simulação**
- Casos de teste pequenos de QuTiP e Kwant.
- Datasets selecionados de OpenQDC somente após revisão.
- Benchmarks e workflows com baselines clássicos.

**P3 — Cinco operações**
- Definir e testar perguntas de aceitação específicas por empresa.
- Integrar cada agente real com escopo mínimo e dados isolados.
- Trade permanece em modo de preparação até instalação e validação.

## 6. Testes de aceitação
- [ ] Pergunta de física: recuperação do corpus com fonte/página relevante.
- [ ] Pergunta de ponto quântico: fonte sobre confinamento/nanoescala, não somente FIPS.
- [ ] Simulação QuTiP pequena reproduz caso analítico conhecido e registra parâmetros/versão.
- [ ] Exemplo Kwant tem geometria/Hamiltoniano documentados e resultado verificável.
- [ ] Dataset OpenQDC tem licença, unidade, método e proveniência confirmados antes do uso.
- [ ] Resposta sem evidência suficiente informa a lacuna.
- [ ] LEVI consulta a API do EU SOU e preserva as referências na resposta.
- [ ] Testes separados das cinco operações respeitam permissões e isolamento.
- [ ] Nenhum domínio ou agente é declarado 100% funcional sem evidências.

## 7. Fontes consultadas
- QuTiP: https://github.com/qutip/qutip
- QuTiP Tutorials: https://github.com/qutip/qutip-tutorials
- Kwant: https://github.com/kwant-project/kwant
- OSSCAR Quantum Mechanics: https://github.com/osscar-org/quantum-mechanics
- OpenQDC: https://github.com/valence-labs/openQDC
- AiiDA Common Workflows: https://github.com/aiidateam/aiida-common-workflows
- QuTiP Virtual Lab: https://github.com/qutip/qutip-virtual-lab
- QSBench: https://github.com/QSBench

**Estado:** engenharia reversa documental executada e mapa publicado. Ainda não representa instalação dos repositórios, ingestão integral do conteúdo ou validação operacional do EU SOU/LEVI.
