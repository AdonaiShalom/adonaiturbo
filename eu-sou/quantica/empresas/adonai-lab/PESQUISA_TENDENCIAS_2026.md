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
