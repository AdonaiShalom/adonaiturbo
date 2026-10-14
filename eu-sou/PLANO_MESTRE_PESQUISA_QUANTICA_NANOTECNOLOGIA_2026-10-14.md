# EU SOU — Pesquisa técnica e plano mestre para ciência quântica e nanotecnologia
Data: 2026-10-14  
Status: relatório de pesquisa e proposta de arquitetura; **não representa integração de software concluída**.

## 1. Objetivo e limites

Transformar o EU SOU num núcleo científico modular, auditável e reproduzível, capaz de pesquisar fontes, executar cálculos, orquestrar simuladores, analisar materiais e comparar hipóteses com evidências. O LEVI atua como orquestrador por contratos explícitos; o EU SOU conserva a responsabilidade científica e a proveniência. Adonai Turbo, Adonai Lab, Adonai Finanças, Adonai Trade, Adonai Marketing Digital e PSM Grupo Market mantêm dados, permissões, backends e objetivos próprios.

Esta revisão é documental e baseada em fontes públicas do GitHub e na auditoria remota disponível. O repositório GitHub não contém os ficheiros locais Express `backend/server.js`, `backend/levi-core.js` e `backend/eu-sou-api.js`; por isso, não é possível afirmar que foi feita engenharia reversa desses ficheiros nem que as integrações locais foram executadas. Não instalar dependências, alterar backend, remover ficheiros ou publicar funcionalidades sem inventário local, backup, revisão de licenças e testes.

## 2. Estado conhecido do EU SOU — evidência e lacunas

- O diretório `eu-sou/` na branch `main` contém um README inicial de documentação, não a implementação local completa.
- A PR #4, `Auditoria e endurecimento EU SOU — fases 1 a 4`, documenta uma auditoria parcial. Não declara as Fases 1–4 100% concluídas.
- A auditoria remota registou RLS ativo nas tabelas de âncora EU SOU/LEVI e revogação da execução pública de `public.rls_auto_enable()`. Permanecem avisos de tabelas com RLS sem políticas; cada tabela precisa de revisão específica antes de definir políticas.
- A auditoria assinala como pendentes os testes locais Windows: `validar_matematica`, `validar_oscilador`, `particula_caixa`, `qubit_basico`; entradas inválidas, timeouts, indisponibilidade, correlação, fontes, voz ponta a ponta e CI.
- O histórico de trabalho local indica uma biblioteca científica em `C:\AdonaiTurbo\frontend\eu-sou-completo\biblioteca-local`, servidor em `127.0.0.1:8765`, índice ativo com documentos NIST FIPS 203/204/205 e um índice experimental de 633 trechos que passou quatro testes. Isto é contexto anterior, não prova do estado atual: confirmar no Windows antes de decidir sobre indexação, migração ou eliminação.
- A subfase atual continua sendo **4.4 — confirmar o índice e a pesquisa no servidor ativo**. Não avançar para instalação de novos motores antes de reconciliar o índice ativo, o experimental e os backups.

Evidência remota:
- Auditoria na branch de revisão: https://github.com/AdonaiShalom/adonaiturbo/blob/audit/eu-sou-phases-1-4-hardening/eu-sou/AUDITORIA_REVALIDACAO_2026-10-14.md
- PR #4: https://github.com/AdonaiShalom/adonaiturbo/pull/4
- README EU SOU em main: https://github.com/AdonaiShalom/adonaiturbo/blob/main/eu-sou/README.md

## 3. Pesquisa de projetos open source no GitHub

### 3.1 Candidatos prioritários

| Projeto | Área e valor potencial | Recomendação para EU SOU | Limites e verificações |
|---|---|---|---|
| QuTiP — https://github.com/qutip/qutip | Dinâmica de sistemas quânticos abertos/fechados; Hamiltonianos dependentes do tempo e operadores de colapso | **Prioridade alta para Fase 7**, como motor especializado opcional para dinâmica quântica | Não substitui DFT nem simulação atomística. Validar versão, licença BSD-3-Clause, instalação e testes |
| Qiskit — https://github.com/Qiskit/qiskit | Circuitos, operadores, primitivas Sampler/Estimator, transpiler e informação quântica | **Prioridade alta para Fase 7**, adaptador de circuitos e simulação | Simulação clássica escala de forma limitada; hardware real exige credenciais, custo, consentimento e tratamento de ruído |
| PennyLane — https://github.com/PennyLaneAI/pennylane | Computação quântica híbrida, diferenciação automática, química quântica e machine learning quântico | **Prioridade alta, mas não instalar em paralelo sem decisão de arquitetura**; comparar com Qiskit e escolher o primeiro piloto | Sobreposição parcial com Qiskit. Verificar versão de Python, dispositivos, dependências e licença Apache-2.0 |
| pymatgen — https://github.com/materialsproject/pymatgen | Estruturas cristalinas, composição, defeitos, superfícies, diagramas de fase, DOS/bandas e integrações com bases de materiais | **Prioridade alta para Fase 8**, camada de representação e análise de materiais | Não é, sozinho, um motor DFT. Confirmar licença MIT, dependências e necessidades de memória |
| matminer — https://github.com/hackingmaterials/matminer | Featurização, datasets e mineração de dados de ciência dos materiais | **Prioridade alta após pymatgen**, para preparar dados e testar modelos | Proveniência e citações originais dos datasets são obrigatórias; verificar licença e versões compatíveis |
| pyiron_atomistics — https://github.com/pyiron/pyiron_atomistics | Ambiente de workflows de simulação atomística, integração com ASE e códigos externos, armazenamento e execução de tarefas | **Avaliar para Fase 8/10**, se a execução atomística crescer | Pode ser pesado para a máquina local; não instalar até confirmar recursos, executáveis e ambiente de execução |
| AiiDA — https://github.com/aiidateam/aiida-core | Workflows científicos com proveniência de inputs/outputs, checkpoints, plugins e execução em HPC | **Prioridade alta como referência arquitetural de proveniência**; avaliar adoção apenas se o EU SOU precisar de workflows de longa duração | Pode duplicar o executor e a persistência atuais; não introduzir uma segunda camada de workflows sem análise de sobreposição |
| OpenMM — https://github.com/openmm/openmm | Dinâmica molecular de alto desempenho, especialmente biomolecular | **Opcional e condicionado ao caso de uso**, para química/biologia/fase alimentar | É dinâmica molecular clássica, não computação quântica nem DFT. Não usar como substituto de métodos eletrónicos |

### 3.2 Candidatos complementares para avaliar

- atomate2 — https://github.com/materialsproject/atomate2 : workflows de ciência dos materiais; avaliar em conjunto com pymatgen/pyiron/AiiDA, evitando três orquestradores concorrentes.
- Materiais e datasets: começar por APIs e datasets com documentação e proveniência, incluindo Materials Project (https://materialsproject.org/), NOMAD (https://nomad-lab.eu/) e conjuntos citados pelo matminer. Confirmar termos de uso, atribuição, limites de API e licenças de cada conjunto.
- Simulação eletrónica/DFT: avaliar códigos estabelecidos como Quantum ESPRESSO, ABINIT ou GPAW apenas depois de escolher uma plataforma de cálculo, validar licenças, pseudopotenciais, recursos e disponibilidade de executáveis. O GitHub não basta para provar que uma simulação está cientificamente correta.
- Quantum dots e nanomateriais específicos: esta pesquisa inicial não identificou um pacote único e suficientemente validado para adotar como motor universal de pontos quânticos. Fazer revisão dedicada por material, método (k·p, tight-binding, DFT/TD-DFT, etc.), escala e evidência experimental antes de selecionar software.
- Sensores quânticos, spintrónica, materiais topológicos e fotónica: tratar cada domínio como adaptador/modelo específico, não como uma funcionalidade genérica que possa ser considerada implementada apenas por acrescentar um agente.

### 3.3 Regra de seleção

Não instalar todos os projetos. Para cada candidato, preencher uma ficha de avaliação com:
1. problema científico exato e resultado esperado;
2. manutenção, releases, testes, documentação e comunidade;
3. licença do código, dependências, datasets e pseudopotenciais;
4. compatibilidade de Python, Windows/WSL/Linux, RAM/CPU/GPU e custo;
5. API estável e possibilidade de execução isolada;
6. referência científica, benchmark independente e critério de aceitação;
7. duplicação com funcionalidades já existentes;
8. plano de remoção/reversão e impacto na instalação.

## 4. Arquitetura-alvo recomendada

Manter uma arquitetura em camadas, com contratos claros e adaptadores independentes:

1. **Interface/API EU SOU** — recebe pedido científico estruturado; valida entradas; gera identificador de correlação.
2. **Catálogo de conhecimento** — documentos, metadados, fontes, versões, citações e indexação; separa conteúdo e embeddings/índice.
3. **Motor matemático** — álgebra, unidades, constantes, precisão, validação dimensional e testes de referência.
4. **Registo de modelos e executores** — catálogo de ferramentas disponíveis, versões, licenças, capacidade, tempo limite e ambiente.
5. **Adaptadores científicos** — primeiro QuTiP ou Qiskit para um piloto quântico; pymatgen para materiais; matminer para dados; motores DFT/atomísticos somente após decisão.
6. **Workflow e proveniência** — cada execução regista inputs, parâmetros, versões, ambiente, logs, outputs, referências, incerteza e estado.
7. **Validação independente** — testes analíticos, benchmarks, replicação e critérios de rejeição.
8. **Segurança e governação** — permissões mínimas, isolamento, segredos apenas no servidor, políticas RLS específicas, auditoria e limites de execução.
9. **LEVI como orquestrador** — encaminha pedidos e apresenta resultados com fontes; não altera silenciosamente parâmetros científicos nem converte hipóteses em factos.
10. **Aplicações empresariais** — recebem resultados via APIs autorizadas, com permissões e dados separados. PSM Grupo Market continua isolado do Adonai Turbo e das empresas Adonai.

## 5. Plano mestre das dez fases — gates de aceitação

### Fase 1 — Inventário e preservação
- [ ] Comparar inventário remoto e local.
- [ ] Identificar os componentes reais, os protótipos, as rotas, os testes e os módulos sem uso.
- [ ] Identificar dependências duplicadas, APIs sobrepostas, índices, caches e backups.
- [ ] Fazer backup verificável antes de qualquer mudança.
- **Gate:** mapa de componentes com evidência e plano de reversão.

### Fase 2 — Motor científico e contratos
- [ ] Formalizar schemas de entrada/saída, unidades e erros.
- [ ] Executar testes matemáticos e de física de referência.
- [ ] Validar normalização, dimensões, precisão e casos-limite.
- [ ] Distinguir falha de execução, falta de dados e resultado cientificamente inválido.
- **Gate:** testes automatizados reproduzíveis e contratos documentados.

### Fase 3 — Conhecimento, fontes e recuperação
- [ ] Comparar índice ativo, índice experimental e documentos de origem.
- [ ] Medir precisão/relevância de recuperação com conjunto de perguntas anotadas.
- [ ] Guardar título, autor/organização, URL/DOI, data, licença, versão e localização do excerto.
- [ ] Aplicar deduplicação sem apagar originais; manter versões e hashes.
- [ ] Responder “não sei” quando a evidência é insuficiente.
- **Gate:** pesquisa auditável, fontes clicáveis e benchmark de recuperação.

### Fase 4 — Integração EU SOU–LEVI (subfase atual 4.4)
- [ ] Validar serviço ativo, health check, timeouts, indisponibilidade e recuperação.
- [ ] Testar `validar_matematica`, `validar_oscilador`, `particula_caixa`, `qubit_basico`.
- [ ] Testar pergunta → pesquisa/cálculo → evidências → resposta LEVI → áudio, sem mudar a voz atual.
- [ ] Registar correlação, latência, fontes, versões e logs sem expor segredos.
- **Gate:** teste ponta a ponta local e evidência guardada; só então fechar 4.4.

### Fase 5 — Revalidação integral e segurança
- [ ] Executar regressão, integração, build, smoke tests e recuperação de backup.
- [ ] Rever cada tabela com RLS; não criar políticas genéricas para remover avisos.
- [ ] Verificar autenticação, autorização, rate limits, validação de entradas e gestão de segredos.
- [ ] Validar que dados de utilizador/empresa não atravessam fronteiras de autorização.
- **Gate:** riscos críticos resolvidos e resultados anexados ao relatório.

### Fase 6 — Expansão do conhecimento
- [ ] Organizar física, matemática, química, materiais, biologia, sensores, computação e segurança.
- [ ] Indexar documentos com metadados, licenças e proveniência.
- [ ] Criar relações entre conceitos, modelos, datasets e publicações.
- [ ] Criar conjunto de perguntas de avaliação e métricas de recuperação.
- **Gate:** cobertura mensurável, referências completas e política de atualização.

### Fase 7 — Física quântica e computação quântica
- [ ] Implementar benchmarks analíticos: oscilador harmónico, partícula na caixa, tunelamento e qubit básico.
- [ ] Comparar QuTiP, Qiskit e PennyLane por um caso-piloto e escolher uma integração inicial, sem instalar tudo.
- [ ] Separar simulação clássica de estados/circuitos, hardware quântico real e métodos quântico-inspirados.
- [ ] Testar ruído, shots, convergência, complexidade, limites de escala e custo.
- [ ] Incluir química quântica apenas com Hamiltonianos, mapeamento, base e aproximações documentados.
- **Gate:** benchmark reproduzido por referência independente; nenhum alegado ganho sem comparação justa.

### Fase 8 — Nanotecnologia quântica e materiais
- [ ] Representar estruturas, composição, simetria, defeitos, superfícies e condições.
- [ ] Piloto de materiais com pymatgen; dados/featurização com matminer se houver caso comprovado.
- [ ] Avaliar DFT, dinâmica molecular, tight-binding, k·p e outros métodos conforme a pergunta científica.
- [ ] Cobrir pontos quânticos, confinamento, materiais 2D, heteroestruturas, nanoeletrónica, spintrónica, fotónica e sensores.
- [ ] Guardar parâmetros, pseudopotenciais, convergência, temperatura, condições de fronteira e incerteza.
- [ ] Incluir toxicologia, exposição, migração, segurança e impacto ambiental para aplicações pertinentes.
- **Gate:** cada domínio tem método apropriado, benchmark e limites explícitos; não há “simulação universal”.

### Fase 9 — Agentes e aplicações
- [ ] Preservar e auditar os 18 agentes do Adonai Lab; não criar duplicados por especialidade sem necessidade.
- [ ] Atribuir a cada agente objetivo, contrato, ferramentas permitidas, evidência exigida e critérios de rejeição.
- [ ] Criar fluxos pesquisa → hipótese → cálculo/simulação → validação independente → relatório.
- [ ] Integrar as cinco empresas através de APIs autorizadas, sem fundir dados, credenciais ou backends.
- [ ] Manter PSM Grupo Market separado; não assumir que os agentes do Lab estão automaticamente disponíveis no EU SOU.
- **Gate:** fluxos ponta a ponta testados e limites de acesso documentados.

### Fase 10 — Auditoria, documentação, publicação e melhoria contínua
- [ ] Executar auditoria de todas as fases e rever evidências.
- [ ] Publicar documentação de arquitetura, instalação, versões, licenças, benchmarks e limitações.
- [ ] Só publicar releases que passem os gates; manter backup e reversão.
- [ ] Monitorizar qualidade, latência, custos, erros e atualidade do conhecimento.
- [ ] Reavaliar dependências e remover componentes apenas quando a análise provar que são redundantes, não usados e seguros para remover.
- **Gate:** release rastreável e recuperável, com processo contínuo de validação.

## 6. O que não acrescentar agora

- Não instalar Qiskit, PennyLane, QuTiP, pymatgen, matminer, pyiron e AiiDA todos de uma vez.
- Não criar um segundo motor de workflows se a arquitetura atual já cumpre os requisitos; primeiro comparar funcionalidades e proveniência.
- Não manter duas cópias do mesmo corpus/índice como se fossem duas fontes independentes. Conservar backups e índices experimentais até reconciliação e aprovação.
- Não duplicar os 18 agentes do Adonai Lab dentro do EU SOU sem um contrato e uma razão funcional.
- Não usar OpenMM como motor quântico ou DFT; é uma ferramenta de dinâmica molecular.
- Não declarar vantagem quântica, eficácia de nanomateriais, segurança alimentar ou aplicação industrial sem evidência adequada.
- Não eliminar ficheiros, tabelas, backups, índices ou agentes com base apenas em nomes, tamanho ou suspeita de duplicação.

## 7. Ordem de execução imediata

1. **Fase 4.4:** diagnóstico somente de leitura no Windows; comparar o índice ativo com o experimental e verificar a pesquisa em `127.0.0.1:8765`.
2. **Reconciliar evidências:** recuperar `C:\AdonaiDados\EU_SOU\backups\CONTINUIDADE_EU_SOU_FASE4_2026-10-13.txt` e os relatórios das Fases 1–3.
3. **Fechar testes base:** quatro comandos científicos, casos inválidos, timeout e fluxo de voz sem alterar a configuração atual.
4. **Criar benchmark científico mínimo:** resultados esperados, tolerâncias, fontes e testes automatizados.
5. **Selecionar um único piloto quântico** (comparar QuTiP/Qiskit/PennyLane com base no primeiro caso de uso).
6. **Selecionar um piloto de materiais** (pymatgen; acrescentar matminer só se o benchmark de dados justificar).
7. **Decidir arquitetura de workflows** antes de introduzir pyiron, atomate2 ou AiiDA.
8. **Integrar em branch isolada**, com backup, testes, revisão de licença e plano de reversão.
9. **Rever a Fase 10** antes de publicar qualquer integração.

## 8. Fontes GitHub consultadas

- QuTiP: https://github.com/qutip/qutip
- Qiskit: https://github.com/Qiskit/qiskit
- PennyLane: https://github.com/PennyLaneAI/pennylane
- pymatgen: https://github.com/materialsproject/pymatgen
- matminer: https://github.com/hackingmaterials/matminer
- pyiron_atomistics: https://github.com/pyiron/pyiron_atomistics
- AiiDA Core: https://github.com/aiidateam/aiida-core
- OpenMM: https://github.com/openmm/openmm
- atomate2: https://github.com/materialsproject/atomate2
- EU SOU — auditoria Fases 1–4: https://github.com/AdonaiShalom/adonaiturbo/blob/audit/eu-sou-phases-1-4-hardening/eu-sou/AUDITORIA_REVALIDACAO_2026-10-14.md
- EU SOU — PR de auditoria: https://github.com/AdonaiShalom/adonaiturbo/pull/4

## 9. Estado desta entrega

- Pesquisa inicial do GitHub: concluída para os projetos listados.
- Arquitetura e plano por fases: propostos neste documento.
- Código local do backend: não inspecionado por não estar no repositório remoto.
- Instalação de dependências: não realizada.
- Integração científica em runtime: não realizada.
- Remoções: nenhuma realizada.
- Próximo passo: executar o diagnóstico local da Fase 4.4 e usar os resultados para decidir o primeiro piloto, sem alterar ficheiros nesta etapa.
