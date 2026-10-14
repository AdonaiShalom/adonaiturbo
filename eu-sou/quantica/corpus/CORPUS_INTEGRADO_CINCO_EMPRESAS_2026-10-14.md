# EU SOU — Corpus Integrado de Conhecimento Quântico e Nanotecnologia
**Versão documental:** 2026-10-14.  
**Escopo:** conhecimento compartilhado e aplicações por empresa.  
**Status:** corpus versionado no GitHub; a ingestão na biblioteca local e a consulta pelo LEVI ainda precisam de teste de execução.

Este arquivo reúne o conteúdo dos cinco módulos empresariais para facilitar ingestão controlada pelo indexador EU SOU. As fontes externas são referências a verificar; não são garantias de desempenho nem evidência de que o software esteja instalado.

## Regras globais de conhecimento
1. Distinguir física quântica, computação quântica, algoritmos quantum-inspired e criptografia pós-quântica.
2. Toda resposta factual deve registrar fonte, trecho, data/versão e nível de evidência.
3. Diferenciar teoria, simulação, resultado experimental, replicação independente e produto comercial.
4. Manter licenças, versões, hashes, parâmetros, unidades, métodos e incertezas.
5. Comparar com baselines clássicos fortes antes de alegar vantagem quântica.
6. Isolar dados, segredos, permissões e backends de cada empresa; PSM Grupo Market permanece separado.
7. O LEVI orquestra; o EU SOU recupera evidência; agentes executam apenas tarefas autorizadas.
8. Não considerar o conteúdo carregado no índice local até testes de recuperação e ponta a ponta.

## Referências abertas para engenharia reversa responsável
- QuTiP — https://github.com/qutip/qutip
- Kwant — https://github.com/kwant-project/kwant
- OSSCAR Quantum Mechanics — https://github.com/osscar-org/quantum-mechanics
- PennyLane — https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — https://github.com/qiskit-community/qiskit-finance
- DeepChem — https://github.com/deepchem/deepchem
- PySCF — https://github.com/pyscf/pyscf
- AiiDA Common Workflows — https://github.com/aiidateam/aiida-common-workflows
- Cirq — https://github.com/quantumlib/Cirq
- quacc — https://github.com/Quantum-Accelerators/quacc
- OpenQDC — https://github.com/valence-labs/openQDC
- OSS quantum software catalog — https://github.com/qosf/awesome-quantum-software
- NIST quantum science — https://www.nist.gov/quantum-science
- NIST nanoworld/nanodevices/nano-optics — https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
- National Nanotechnology Initiative — https://www.nano.gov/



---

# MÓDULO EMPRESARIAL: adonai-turbo

# ADONAI TURBO — atualização de pesquisa e tendências 2026
**Área:** Plataforma, recuperação científica e orquestração  
**Estado:** módulo documental versionado; ingestão no índice ativo e integração operacional pendentes.  
**Atualização:** 14/10/2026

## Novos conhecimentos e prioridades
1. **Contrato de evidência:** cada resposta científica deve carregar fonte, trecho, versão do índice, data, score e incerteza.
2. **RAG híbrido:** combinar busca lexical e vetorial quando possível; filtros por domínio/empresa; deduplicação e ranking; limiar calibrado com conjunto de teste, não escolhido por intuição.
3. **Observabilidade:** medir latência de recuperação, latência total, taxa de consultas sem evidência, falsos positivos, timeouts e erros por fonte.
4. **Integração adaptadora:** encapsular QuTiP, PySCF, Kwant, PennyLane, Cirq e AiiDA como ferramentas opcionais, cada uma com ambiente/dependências próprios. Não instalar automaticamente em produção.
5. **Segurança e separação:** controle de acesso por empresa; segredos fora do Git; registro de auditoria; PSM Grupo Market não compartilha backend nem dados com Adonai Turbo.
6. **Tendência prioritária:** industrialização/manufatura e integração entre sensores, redes e computação, além de algoritmos. Isso requer catalogar componentes, maturidade, dependências e evidência de implantação.

## Repositórios e fontes examinados
## Fontes e repositórios para aprofundamento
- DeepChem — química computacional, materiais, biologia e modelos ML: https://github.com/deepchem/deepchem
- PySCF — estrutura eletrônica e química quântica: https://github.com/pyscf/pyscf
- AiiDA Common Workflows — workflows científicos reproduzíveis e interoperáveis: https://github.com/aiidateam/aiida-common-workflows
- Cirq — construção e simulação de circuitos quânticos: https://github.com/quantumlib/Cirq
- PennyLane — circuitos híbridos, ML e química quântica: https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — problemas financeiros formulados para experimentos quânticos: https://github.com/qiskit-community/qiskit-finance
- Catálogo de projetos abertos: https://github.com/qosf/awesome-quantum-software
- NIST, manufatura quântica (29/06/2026): https://www.nist.gov/news-events/news/2026/06/nist-launches-center-drive-manufacture-quantum-technologies
- NSF, prioridades de engenharia quântica (08/01/2026): https://www.nsf.gov/eng/updates/new-road-map-engineering-research-advance-quantum
- NSF, infraestrutura quântica e nanotecnologia (13/02/2026): https://www.nsf.gov/news/nsf-launches-100m-national-quantum-nanotechnology-research
- NSF, integração de sensores, redes e computação (07/07/2026): https://www.nsf.gov/news/nsf-launches-project-triad-advance-quantum-technology-real
- NIST, nanodispositivos, pontos quânticos e nano-óptica: https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
- Tendências do ecossistema aberto (estudo de setembro de 2026): https://arcxiv.org/abs/2609.28349

**Método de engenharia reversa responsável:** analisar APIs, documentação, exemplos, testes, licenças, dependências e benchmarks; extrair princípios e criar implementações próprias com atribuição. Não copiar código protegido sem observar licença, nem considerar um README como prova científica.

## Plano de testes e critérios de aceitação
- [ ] Perguntas canônicas por domínio recuperam fonte correta e relevante.
- [ ] Query fora do domínio não recebe documentos apenas por conter a palavra “quântico”.
- [ ] Timeout/servidor indisponível retorna estado explícito e não inventa evidência.
- [ ] LEVI usa resposta estruturada da API EU SOU e cita a origem.
- [ ] CI testa schema, ranking, isolamento de empresa e regressões.
- [ ] Registrar baseline de precisão@k/recall@k, latência p50/p95 e taxa de abstenção.

## Limites de uso
Este módulo é de arquitetura e operação. Os repositórios científicos são dependências candidatas, não agentes instalados. Não executar código de terceiros no servidor 3000 sem revisão, ambiente isolado e licença verificada.

## Proveniência e manutenção
- Registar data de acesso, versão/tag/commit, licença, ambiente e hash dos artefactos.
- Tratar resultados de pesquisa como candidatos até validação independente.
- Ao atualizar, manter a versão anterior, gerar diff e executar testes de regressão.
- A presença deste documento no GitHub/Supabase não prova ingestão no índice local EU SOU nem consulta pelo LEVI.


---

# MÓDULO EMPRESARIAL: adonai-marketing-digital

# ADONAI MARKETING DIGITAL — atualização de pesquisa e tendências 2026
**Área:** Inteligência de tendências, conteúdo e análise de mercado  
**Estado:** módulo documental versionado; ingestão no índice ativo e integração operacional pendentes.  
**Atualização:** 14/10/2026

## Novos conhecimentos e prioridades
1. **Radar de tendências com proveniência:** registrar data, entidade, fonte primária, estágio (pesquisa/protótipo/produto), região, nível de confiança e evidência contrária.
2. **Segmentação por maturidade:** separar qubits/processadores, sensores, redes, fotônica, materiais, nanofabricação, metrologia e segurança pós-quântica.
3. **Mensuração:** testes A/B, grupos de controle, intervalos de confiança, inferência causal e métricas de incremento; não confundir visualizações com efeito comercial.
4. **Validação de alegações:** cada frase como “vantagem quântica”, “nano”, “revolucionário” ou “mais eficiente” precisa de comparação e fonte específica.
5. **Oportunidades de conteúdo:** manufatura escalável de sistemas quânticos, infraestrutura aberta para nanofabricação/caracterização, sensores quânticos e integração de sistemas são tendências documentadas em 2026.

## Repositórios e fontes examinados
## Fontes e repositórios para aprofundamento
- DeepChem — química computacional, materiais, biologia e modelos ML: https://github.com/deepchem/deepchem
- PySCF — estrutura eletrônica e química quântica: https://github.com/pyscf/pyscf
- AiiDA Common Workflows — workflows científicos reproduzíveis e interoperáveis: https://github.com/aiidateam/aiida-common-workflows
- Cirq — construção e simulação de circuitos quânticos: https://github.com/quantumlib/Cirq
- PennyLane — circuitos híbridos, ML e química quântica: https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — problemas financeiros formulados para experimentos quânticos: https://github.com/qiskit-community/qiskit-finance
- Catálogo de projetos abertos: https://github.com/qosf/awesome-quantum-software
- NIST, manufatura quântica (29/06/2026): https://www.nist.gov/news-events/news/2026/06/nist-launches-center-drive-manufacture-quantum-technologies
- NSF, prioridades de engenharia quântica (08/01/2026): https://www.nsf.gov/eng/updates/new-road-map-engineering-research-advance-quantum
- NSF, infraestrutura quântica e nanotecnologia (13/02/2026): https://www.nsf.gov/news/nsf-launches-100m-national-quantum-nanotechnology-research
- NSF, integração de sensores, redes e computação (07/07/2026): https://www.nsf.gov/news/nsf-launches-project-triad-advance-quantum-technology-real
- NIST, nanodispositivos, pontos quânticos e nano-óptica: https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
- Tendências do ecossistema aberto (estudo de setembro de 2026): https://arcxiv.org/abs/2609.28349

**Método de engenharia reversa responsável:** analisar APIs, documentação, exemplos, testes, licenças, dependências e benchmarks; extrair princípios e criar implementações próprias com atribuição. Não copiar código protegido sem observar licença, nem considerar um README como prova científica.

## Plano de testes e critérios de aceitação
- [ ] Cada item do radar tem data, URL, trecho e estágio de maturidade.
- [ ] Conteúdo separa fato, interpretação, projeção e publicidade.
- [ ] A/B tem hipótese e métrica primária definidas antes de iniciar.
- [ ] Não há alegação de desempenho sem baseline, condições e fonte.
- [ ] Publicações passam por revisão humana e direitos/licenças.

## Limites de uso
Use os dados do EU SOU como apoio factual, não como substituto de pesquisa de público ou de medição. PSM Grupo Market permanece separado.

## Proveniência e manutenção
- Registar data de acesso, versão/tag/commit, licença, ambiente e hash dos artefactos.
- Tratar resultados de pesquisa como candidatos até validação independente.
- Ao atualizar, manter a versão anterior, gerar diff e executar testes de regressão.
- A presença deste documento no GitHub/Supabase não prova ingestão no índice local EU SOU nem consulta pelo LEVI.


---

# MÓDULO EMPRESARIAL: adonai-financas

# ADONAI FINANÇAS — atualização de pesquisa e tendências 2026
**Área:** Análise financeira, risco e tecnologias emergentes  
**Estado:** módulo documental versionado; ingestão no índice ativo e integração operacional pendentes.  
**Atualização:** 14/10/2026

## Novos conhecimentos e prioridades
1. **Pesquisa de empresas e cadeia de valor:** materiais, criogenia, lasers, fotônica integrada, detectores, semicondutores, packaging, sensores e ferramentas de simulação.
2. **Modelo de evidência financeira:** diferenciar anúncio público, contrato, receita reportada, subsídio, capex, demonstração técnica e especulação; registrar datas e fontes.
3. **Quantificação de risco:** cenários, probabilidades, sensibilidade, liquidez, concentração, risco de cauda e custo de capital; explicitar incerteza e dados ausentes.
4. **Computação quântica em finanças:** Qiskit Finance serve para prototipar formulações; cada método deve ser comparado a heurísticas e otimizadores clássicos.
5. **Segurança pós-quântica:** tratar migração criptográfica como risco tecnológico separado, com inventário de dependências e criticidade.

## Repositórios e fontes examinados
## Fontes e repositórios para aprofundamento
- DeepChem — química computacional, materiais, biologia e modelos ML: https://github.com/deepchem/deepchem
- PySCF — estrutura eletrônica e química quântica: https://github.com/pyscf/pyscf
- AiiDA Common Workflows — workflows científicos reproduzíveis e interoperáveis: https://github.com/aiidateam/aiida-common-workflows
- Cirq — construção e simulação de circuitos quânticos: https://github.com/quantumlib/Cirq
- PennyLane — circuitos híbridos, ML e química quântica: https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — problemas financeiros formulados para experimentos quânticos: https://github.com/qiskit-community/qiskit-finance
- Catálogo de projetos abertos: https://github.com/qosf/awesome-quantum-software
- NIST, manufatura quântica (29/06/2026): https://www.nist.gov/news-events/news/2026/06/nist-launches-center-drive-manufacture-quantum-technologies
- NSF, prioridades de engenharia quântica (08/01/2026): https://www.nsf.gov/eng/updates/new-road-map-engineering-research-advance-quantum
- NSF, infraestrutura quântica e nanotecnologia (13/02/2026): https://www.nsf.gov/news/nsf-launches-100m-national-quantum-nanotechnology-research
- NSF, integração de sensores, redes e computação (07/07/2026): https://www.nsf.gov/news/nsf-launches-project-triad-advance-quantum-technology-real
- NIST, nanodispositivos, pontos quânticos e nano-óptica: https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
- Tendências do ecossistema aberto (estudo de setembro de 2026): https://arcxiv.org/abs/2609.28349

**Método de engenharia reversa responsável:** analisar APIs, documentação, exemplos, testes, licenças, dependências e benchmarks; extrair princípios e criar implementações próprias com atribuição. Não copiar código protegido sem observar licença, nem considerar um README como prova científica.

## Plano de testes e critérios de aceitação
- [ ] Baseline clássico simples e forte antes de testar quantum/quantum-inspired.
- [ ] Backtest com walk-forward, custos, slippage e prevenção de look-ahead/survivorship bias.
- [ ] Toda afirmação financeira possui fonte, data e classificação (fato/projeção).
- [ ] Nenhuma promessa de retorno ou ordem executada sem autorização.
- [ ] Registrar drawdown, volatilidade, liquidez e cenários adversos.

## Limites de uso
Pesquisa de tecnologias quânticas não é, isoladamente, sinal de compra/venda. A saída deve ser auditável e sujeita à política de risco da empresa.

## Proveniência e manutenção
- Registar data de acesso, versão/tag/commit, licença, ambiente e hash dos artefactos.
- Tratar resultados de pesquisa como candidatos até validação independente.
- Ao atualizar, manter a versão anterior, gerar diff e executar testes de regressão.
- A presença deste documento no GitHub/Supabase não prova ingestão no índice local EU SOU nem consulta pelo LEVI.


---

# MÓDULO EMPRESARIAL: adonai-lab

# ADONAI LAB — atualização de pesquisa e tendências 2026
**Área:** Física quântica, química computacional, nanomateriais e dispositivos  
**Estado:** módulo documental versionado; ingestão no índice ativo e integração operacional pendentes.  
**Atualização:** 14/10/2026

## Novos conhecimentos e prioridades
1. **Estrutura eletrônica:** PySCF para métodos de química quântica; DFT e suas limitações; validação de convergência, bases, funcionais e condições de contorno.
2. **Materiais e workflows:** AiiDA Common Workflows para reprodutibilidade e intercâmbio de engines; registar inputs, outputs, versões, recursos e provenance.
3. **ML científico:** DeepChem como candidato para tarefas de química/materials ML, com validação externa e análise de domínio de aplicabilidade.
4. **Nanoestruturas:** pontos quânticos, dopantes, nanofios, poços, materiais 2D, interfaces, defeitos, transporte, propriedades ópticas e spin.
5. **Nanofotônica e sensores:** acoplamento ponto quântico–nanoestrutura plasmônica, perdas, emissão, ruído, resolução, calibração e incerteza.
6. **Da pesquisa à manufatura:** incluir criogenia, lasers, packaging, reprodutibilidade de processo, caracterização e rendimento de fabricação; não limitar a biblioteca a algoritmos de computador quântico.

## Repositórios e fontes examinados
## Fontes e repositórios para aprofundamento
- DeepChem — química computacional, materiais, biologia e modelos ML: https://github.com/deepchem/deepchem
- PySCF — estrutura eletrônica e química quântica: https://github.com/pyscf/pyscf
- AiiDA Common Workflows — workflows científicos reproduzíveis e interoperáveis: https://github.com/aiidateam/aiida-common-workflows
- Cirq — construção e simulação de circuitos quânticos: https://github.com/quantumlib/Cirq
- PennyLane — circuitos híbridos, ML e química quântica: https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — problemas financeiros formulados para experimentos quânticos: https://github.com/qiskit-community/qiskit-finance
- Catálogo de projetos abertos: https://github.com/qosf/awesome-quantum-software
- NIST, manufatura quântica (29/06/2026): https://www.nist.gov/news-events/news/2026/06/nist-launches-center-drive-manufacture-quantum-technologies
- NSF, prioridades de engenharia quântica (08/01/2026): https://www.nsf.gov/eng/updates/new-road-map-engineering-research-advance-quantum
- NSF, infraestrutura quântica e nanotecnologia (13/02/2026): https://www.nsf.gov/news/nsf-launches-100m-national-quantum-nanotechnology-research
- NSF, integração de sensores, redes e computação (07/07/2026): https://www.nsf.gov/news/nsf-launches-project-triad-advance-quantum-technology-real
- NIST, nanodispositivos, pontos quânticos e nano-óptica: https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
- Tendências do ecossistema aberto (estudo de setembro de 2026): https://arcxiv.org/abs/2609.28349

**Método de engenharia reversa responsável:** analisar APIs, documentação, exemplos, testes, licenças, dependências e benchmarks; extrair princípios e criar implementações próprias com atribuição. Não copiar código protegido sem observar licença, nem considerar um README como prova científica.

## Plano de testes e critérios de aceitação
- [ ] Cada simulação guarda geometria/material, unidades, parâmetros, método e versões.
- [ ] Convergência/sensibilidade e baseline analítico são testados.
- [ ] Separar resultados teóricos, simulados, medidos e replicados.
- [ ] Dataset possui licença, origem, unidade, qualidade e domínio de aplicabilidade.
- [ ] Comparar com referência experimental ou literatura quando disponível.

## Limites de uso
PySCF/DeepChem/AiiDA são candidatos de software; validar licença, dependências, ambiente, benchmarks e adequação antes de instalar. Simulação não substitui experimento.

## Proveniência e manutenção
- Registar data de acesso, versão/tag/commit, licença, ambiente e hash dos artefactos.
- Tratar resultados de pesquisa como candidatos até validação independente.
- Ao atualizar, manter a versão anterior, gerar diff e executar testes de regressão.
- A presença deste documento no GitHub/Supabase não prova ingestão no índice local EU SOU nem consulta pelo LEVI.


---

# MÓDULO EMPRESARIAL: adonai-trade

# ADONAI TRADE — atualização de pesquisa e tendências 2026
**Área:** Pesquisa quantitativa e otimização; instalação ainda pendente  
**Estado:** módulo documental versionado; ingestão no índice ativo e integração operacional pendentes.  
**Atualização:** 14/10/2026

## Novos conhecimentos e prioridades
1. **Problema primeiro, tecnologia depois:** formalizar objetivo, restrições, universo, custos e métrica; só usar QUBO/Ising se a formulação representar corretamente o problema.
2. **Quantum-inspired vs quântico:** rotular claramente algoritmos clássicos inspirados em conceitos quânticos, simuladores clássicos e hardware quântico real.
3. **Benchmarks financeiros:** comparar com otimizadores clássicos fortes, heurísticas e estratégias simples; medir qualidade, tempo, estabilidade e custo total.
4. **Pipeline seguro:** dados validados → pesquisa → backtest → teste fora da amostra → paper trading → revisão de risco → eventual execução autorizada.
5. **Tendências tecnológicas como contexto:** manufatura, sensores, fotônica e materiais podem informar análise setorial, mas não substituem métricas financeiras nem justificam trades por si sós.

## Repositórios e fontes examinados
## Fontes e repositórios para aprofundamento
- DeepChem — química computacional, materiais, biologia e modelos ML: https://github.com/deepchem/deepchem
- PySCF — estrutura eletrônica e química quântica: https://github.com/pyscf/pyscf
- AiiDA Common Workflows — workflows científicos reproduzíveis e interoperáveis: https://github.com/aiidateam/aiida-common-workflows
- Cirq — construção e simulação de circuitos quânticos: https://github.com/quantumlib/Cirq
- PennyLane — circuitos híbridos, ML e química quântica: https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — problemas financeiros formulados para experimentos quânticos: https://github.com/qiskit-community/qiskit-finance
- Catálogo de projetos abertos: https://github.com/qosf/awesome-quantum-software
- NIST, manufatura quântica (29/06/2026): https://www.nist.gov/news-events/news/2026/06/nist-launches-center-drive-manufacture-quantum-technologies
- NSF, prioridades de engenharia quântica (08/01/2026): https://www.nsf.gov/eng/updates/new-road-map-engineering-research-advance-quantum
- NSF, infraestrutura quântica e nanotecnologia (13/02/2026): https://www.nsf.gov/news/nsf-launches-100m-national-quantum-nanotechnology-research
- NSF, integração de sensores, redes e computação (07/07/2026): https://www.nsf.gov/news/nsf-launches-project-triad-advance-quantum-technology-real
- NIST, nanodispositivos, pontos quânticos e nano-óptica: https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics
- Tendências do ecossistema aberto (estudo de setembro de 2026): https://arcxiv.org/abs/2609.28349

**Método de engenharia reversa responsável:** analisar APIs, documentação, exemplos, testes, licenças, dependências e benchmarks; extrair princípios e criar implementações próprias com atribuição. Não copiar código protegido sem observar licença, nem considerar um README como prova científica.

## Plano de testes e critérios de aceitação
- [ ] Estratégias testadas fora da amostra e em vários regimes.
- [ ] Custos, slippage, latência, liquidez e drawdown incluídos.
- [ ] Comparação documentada com baseline clássico.
- [ ] Paper trading e kill switch antes de qualquer execução real.
- [ ] Logs reproduzíveis e aprovação explícita para execução.
- [ ] Não marcar sistema instalado até inventário técnico e testes passarem.

## Limites de uso
Adonai Trade permanece não instalado até evidência. Este documento prepara conhecimento e critérios; não habilita trading nem conecta corretoras.

## Proveniência e manutenção
- Registar data de acesso, versão/tag/commit, licença, ambiente e hash dos artefactos.
- Tratar resultados de pesquisa como candidatos até validação independente.
- Ao atualizar, manter a versão anterior, gerar diff e executar testes de regressão.
- A presença deste documento no GitHub/Supabase não prova ingestão no índice local EU SOU nem consulta pelo LEVI.


## Testes de aceitação do corpus
- [ ] Ingestão em diretório de staging, sem sobrescrever o índice ativo.
- [ ] Consultas sobre equação de Schrödinger e oscilador harmônico recuperam fonte de física quântica.
- [ ] Consultas sobre PySCF/DFT recuperam o módulo Adonai Lab.
- [ ] Consultas sobre teste A/B recuperam o módulo Marketing Digital.
- [ ] Consultas sobre risco, slippage e backtesting recuperam os módulos Finanças/Trade corretos.
- [ ] Consultas sobre fabricação quântica, nanofotônica e sensores recuperam fontes pertinentes.
- [ ] Resposta do LEVI cita fonte real do EU SOU; sem evidência, admite a lacuna.
- [ ] API indisponível/timeout não causa invenção de evidência.
- [ ] Índice novo só é promovido após testes; manter rollback do anterior.

**Nota operacional:** este arquivo reúne texto para ingestão, mas publicar o corpus não executa automaticamente o indexador local, não altera o servidor 3000 e não instala agentes.
