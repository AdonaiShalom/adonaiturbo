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
