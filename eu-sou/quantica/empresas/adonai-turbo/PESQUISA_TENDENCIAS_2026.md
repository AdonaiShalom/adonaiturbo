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
