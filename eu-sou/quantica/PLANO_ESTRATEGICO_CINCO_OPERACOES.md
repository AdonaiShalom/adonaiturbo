# EU SOU — Plano estratégico de conhecimento quântico para cinco operações
**Versão:** 1.0.0  
**Data:** 2026-10-14  
**Estado:** estratégia e catálogo de engenharia reversa pública; ingestão e execução local ainda dependem de validação técnica.

## Objetivo executivo
O EU SOU deve ser o núcleo independente de conhecimento científico, evidências, métodos e memória operacional. LEVI é o orquestrador: recebe a intenção, identifica domínio e risco, consulta o EU SOU, valida a qualidade das evidências, encaminha tarefas aos agentes autorizados de cada empresa e registra a proveniência. Os agentes não devem inventar ciência nem tratar o catálogo de repositórios como se fossem resultados validados.

"Ter todo o conhecimento" é um objetivo de cobertura contínua, não uma condição que possa ser declarada concluída. A meta verificável é manter uma taxonomia ampla, fontes confiáveis e versionadas, ingestão rastreável, recuperação relevante, benchmarks, controle de licença, atualização periódica e limites explícitos.

## Tendências observadas e implicações estratégicas
1. **Engenharia e fabricação, não só algoritmos:** NIST anunciou em junho de 2026 um centro para acelerar fabricação escalável de componentes e sistemas quânticos. O conhecimento do EU SOU precisa cobrir materiais, criogenia, fotônica, fabricação, caracterização, controle, metrologia e cadeia de suprimentos.
2. **Materiais quânticos e nanofabricação:** materiais 2D, interfaces, supercondutores, junções, defeitos, perdas e coerência são importantes para dispositivos. Guardar parâmetros e proveniência de cada amostra/modelo; não generalizar uma experiência isolada.
3. **Sensores e metrologia:** sensores quânticos, padrões, calibração, ruído, incerteza, largura de banda e implantação são um caminho aplicado relevante, distinto da promessa de computadores quânticos universais.
4. **Software aberto e híbrido:** ecossistema fragmentado; manter adaptadores desacoplados para QuTiP (dinâmica), Kwant (transporte), PennyLane (circuitos e ML híbrido), Qiskit Finance (experimentos financeiros) e workflows científicos. O uso de simulador clássico ou método quantum-inspired não deve ser chamado de execução em hardware quântico.
5. **Segurança pós-quântica:** a criptografia pós-quântica é uma necessidade operacional concreta e distinta de computação quântica. Inventariar algoritmos, protocolos, dependências e planos de migração; não confundir “post-quantum” com física quântica ou nanotecnologia.
6. **Reprodutibilidade e avaliação:** métricas, baseline clássico, custo total, ruído, escalabilidade, repetibilidade, versionamento e dados de benchmark devem ser requisitos padrão antes de adotar qualquer ferramenta.
7. **Aplicações de mercado exigem maturidade:** distinguir pesquisa, protótipo, produto comercial, adoção real e projeção. Nunca converter tendência de pesquisa em promessa de receita, rendimento financeiro ou desempenho operacional.

## Arquitetura de conhecimento recomendada
- **Camada A — fundamentos:** mecânica quântica, álgebra linear, estatística, equações, unidades e métodos numéricos.
- **Camada B — domínios científicos:** informação/computação quântica; materiais; química computacional; nanoeletrônica; nanofotônica; sensores/metrologia; dispositivos; fabricação; segurança pós-quântica.
- **Camada C — fontes e proveniência:** documento original, repositório, commit/tag, licença, versão, data de consulta, autor, páginas/trechos, hash e método de extração.
- **Camada D — modelos e ferramentas:** código isolado por ambiente, dependências fixadas, testes unitários, casos analíticos e logs.
- **Camada E — aplicações de cada empresa:** políticas de uso, entradas, restrições, riscos, agente responsável, métricas e critérios de aceitação.
- **Camada F — recuperação pelo LEVI:** consulta ao EU SOU antes de responder a questões científicas; retorno estruturado com fontes, trechos, score, pressupostos, incertezas e lacunas.
- **Camada G — governança:** aprovação humana em ações financeiras, publicações, compras, implantação e experimentos de risco; permissões e dados separados por empresa.

## Matriz de cobertura por empresa

### 1. Adonai Turbo — plataforma e integração
**Conhecimento:** fundamentos quânticos; busca semântica e lexical; RAG científico; ranking e limiar de relevância; citações; proveniência; avaliação de respostas; observabilidade; segurança; criptografia pós-quântica; versionamento de API; fallback e tratamento de falhas.
**Agentes e hierarquia:** LEVI coordena; agente científico consulta EU SOU; agente de integração executa apenas operações autorizadas; agente de qualidade executa testes; agente de segurança verifica permissões/segredos; agente de publicação só promove artefatos aprovados.
**Critérios:** 100% das respostas científicas testadas incluem origem ou admitem ausência; consultas não relevantes não são preenchidas com trechos fracos; timeout e indisponibilidade têm fallback explícito; testes de regressão são repetíveis.
**Não fazer:** dar ao modelo acesso irrestrito a shell, credenciais ou sistemas de outra empresa.

### 2. Adonai Marketing Digital
**Conhecimento:** estatística; experimentação e A/B; inferência causal; segmentação e incerteza; otimização sob restrições; análise de tendências baseada em fontes; verificação de alegações sobre chips, sensores e nanomateriais; comunicação científica responsável; direitos autorais/licenças; medição de conversão e incrementalidade.
**Agentes:** pesquisa e tendências; validação científica; analista de público; estratégia/campanha; produção criativa; métricas/experimentos; conformidade e aprovação. LEVI atribui, o EU SOU fundamenta alegações e o responsável humano aprova publicação.
**Critérios:** alegação científica ligada a fonte primária; testes definidos antes de campanha; não inferir causalidade de correlação; nenhuma promessa de “vantagem quântica” sem evidência específica.
**Separação:** PSM Grupo Market permanece sistema distinto, com dados, backend e permissões próprios.

### 3. Adonai Finanças
**Conhecimento:** probabilidade, estatística bayesiana, séries temporais, otimização, risco de cauda, liquidez, correlação instável, custos, slippage, validação fora da amostra; segurança pós-quântica; análise de empresas e cadeias de suprimento quântico/nanotecnológico com fontes datadas.
**Agentes:** ingestão/qualidade de dados; pesquisa macro e empresas; risco; carteira/otimização; conformidade; auditoria e relatório. LEVI coordena, mas não transforma pesquisa quântica em sinal financeiro sem backtest.
**Critérios:** baseline clássico; walk-forward; custos e drawdown; prevenção de look-ahead e survivorship bias; trilha de auditoria; limites de risco e aprovação humana.
**Não fazer:** prometer retorno, inferir preço futuro a partir de anúncio científico ou executar transações sem autorização explícita.

### 4. Adonai Lab
**Conhecimento:** Schrödinger e modelos analíticos; química quântica; DFT e limitações; tight-binding; transporte (Kwant); dinâmica de sistemas abertos (QuTiP); materiais 2D, pontos quânticos, nanofios/poços; nanoeletrônica; nanofotônica; sensores quânticos; metrologia; nanofabricação; análise de imagens SEM; desenho experimental; segurança e gestão de amostras.
**Agentes:** revisão bibliográfica; modelagem; materiais; simulação; metrologia; experimentos; análise de dados; reprodutibilidade e segurança. Separar resultado teórico, simulado, observado e replicado.
**Critérios:** parâmetros/unidades; método e versão; convergência/sensibilidade; benchmark analítico; incerteza; licença e proveniência de datasets; validação experimental quando necessária.
**Não fazer:** declarar simulação como experimento ou material seguro com base só no modelo.

### 5. Adonai Trade — conhecimento preparado, instalação pendente
**Conhecimento:** otimização combinatória; otimização de portfólio; QUBO/Ising quando pertinente; algoritmos híbridos e quantum-inspired; séries temporais e microestrutura; risco; backtesting; execução simulada; custos; monitoramento de regime; cibersegurança pós-quântica.
**Agentes planejados:** dados e integridade; pesquisa; estratégias; risco; backtest; paper trading; execução; auditoria. Nenhum agente de execução real antes de testes, controles e autorização.
**Critérios:** comparação com baseline clássico simples e forte; testes fora da amostra; walk-forward; custos/slippage; drawdown; paper trading; monitoramento e kill switch.
**Estado:** não afirmar que Adonai Trade está instalado até existir evidência de instalação e testes.

## Repositórios públicos examinados — candidatos, não endossos
- QuTiP: https://github.com/qutip/qutip — dinâmica quântica e sistemas abertos.
- Kwant: https://github.com/kwant-project/kwant — modelos tight-binding e transporte quântico em nanoestruturas.
- OSSCAR: https://github.com/osscar-org/quantum-mechanics — notebooks de mecânica quântica e materiais computacionais.
- PennyLane: https://github.com/PennyLaneAI/pennylane — programação quântica e fluxos híbridos quantum/classical.
- Qiskit Finance: https://github.com/qiskit-community/qiskit-finance — demonstrações e ferramentas para problemas financeiros formulados como problemas quânticos; testar contra baseline clássico.
- quacc: https://github.com/Quantum-Accelerators/quacc — automação de fluxos de química computacional/materials science; requer engines e validação.
- QuantumDeviceSEM: https://github.com/shanto268/QuantumDeviceSEM — análise/segmentação de imagens SEM de dispositivos quânticos; verificar licença, dependências e qualidade antes de usar.
- Quantum-dot cellular automata: https://github.com/basilwong/quantum-dot-cellular-automata — modelo específico de QCA; projeto educacional/de pesquisa, não solução geral de fabricação.
- OpenQDC: https://github.com/valence-labs/openQDC — catálogo/datasets de química quântica; rever licença, método, unidades e proveniência por dataset.
- AiiDA Common Workflows: https://github.com/aiidateam/aiida-common-workflows — workflows reproduzíveis com dependências científicas.

Engenharia reversa responsável significa analisar documentação, arquitetura, interfaces, testes e métodos públicos, então reproduzir princípios e benchmarks originais. Não copiar segredos, dados privados, conteúdo licenciado sem permissão, nem assumir que um repositório pequeno ou sem manutenção é cientificamente validado.

## Tendências externas a acompanhar
- NIST Quantum Science: https://www.nist.gov/quantum-science
- NIST Quantum Manufacturing Engineering Center (junho de 2026): https://www.nist.gov/news-events/news/2026/06/nist-launches-center-drive-manufacture-quantum-technologies
- NSF — Engineering materials for the quantum age (julho de 2026): https://www.nsf.gov/science-matters/engineering-materials-quantum-age
- NIST technology roadmaps: https://www.nist.gov/ctl/ctl-roadmaps
- National Nanotechnology Initiative: https://www.nano.gov/

## Plano de execução e critérios de saída
**Etapa 1 — Inventário e baseline:** confirmar branches, arquivos, APIs, tabelas, índices e contratos; gerar backup; nunca sobrescrever índice sem verificar conteúdo.
**Etapa 2 — Ingestão:** carregar o corpus original e fontes aprovadas na biblioteca ativa; guardar metadados e licença; indexar em diretório versionado separado; não misturar projeto PSM.
**Etapa 3 — Avaliação de recuperação:** conjunto fixo de perguntas por domínio (Schrödinger, oscilador, qubit, ponto quântico, nanofio, DFT, sensor, pós-quântica, A/B, risco e QUBO). Verificar fonte correta, score, recall, falsos positivos e lacunas.
**Etapa 4 — API do EU SOU:** endpoint de pesquisa estruturado, timeout, health, versão do índice, fontes e status; não retornar apenas trechos de domínio diferente.
**Etapa 5 — LEVI:** consultar EU SOU para cada pergunta científica; responder com citações internas; admitir quando não há fonte; logar pergunta, fontes e agente destinatário.
**Etapa 6 — Supabase:** catálogo canônico de fontes/ferramentas/domínios, versão e status; sincronização idempotente; RLS e credenciais por ambiente; não tratar registros de catálogo como conteúdo integral ingerido.
**Etapa 7 — GitHub:** documentação, corpus, schemas e testes versionados; CI de sintaxe e testes; commits claros; segredos fora do repositório.
**Etapa 8 — Cinco empresas/agentes:** mapear cada agente real existente para permissões e tarefas; não inventar agentes como se estivessem instalados; validar cada rota.
**Etapa 9 — Testes integrados:** EU SOU API, LEVI local :3000, Supabase, repositório, timeout, fallback, autorização, citações e regressões.
**Etapa 10 — Publicação e operação contínua:** checklist de release, changelog, rollback, monitoramento de fontes/versões e revisão periódica de tendências.

## Contrato mínimo LEVI ↔ EU SOU
Entrada: pergunta, empresa/projeto, agente/role, idioma, finalidade, nível de risco e contexto permitido.
Saída: resposta/resumo, fontes e trechos, domínio, scores, método, pressupostos, incertezas, estado de evidência, limitações, versão do índice e recomendação de próximo passo.
Regras: nenhuma evidência suficiente → declarar lacuna; nenhuma execução privilegiada implícita; respeitar isolamento por empresa; ações financeiras/publicações/experimentos de risco requerem aprovação conforme política.

## Checklist de validação antes de declarar concluído
- [ ] Corpus no GitHub com commit confirmado.
- [ ] Fontes aprovadas com licença e proveniência verificadas.
- [ ] Biblioteca ativa carregou o índice novo sem perder o índice anterior.
- [ ] Perguntas de teste recuperam documentos relevantes e fontes corretas.
- [ ] API EU SOU retorna trechos, fonte, score e versão.
- [ ] LEVI consulta realmente a API e cita os resultados.
- [ ] Testes sem resultado e timeout não geram afirmações inventadas.
- [ ] Supabase contém catálogo consistente e não duplica fontes em sincronizações.
- [ ] Cinco operações têm mapeamento de agentes/permissões verificável.
- [ ] Adonai Trade permanece marcado como não instalado até comprovação.
- [ ] Testes de integração e regressão passam; logs/rollback estão documentados.

**Importante:** esta publicação organiza estratégia e especificação. Não prova por si só que o serviço local :3000, a ingestão, os agentes das cinco operações ou a implantação de Adonai Trade já estejam funcionando. Essas condições exigem testes reais.
