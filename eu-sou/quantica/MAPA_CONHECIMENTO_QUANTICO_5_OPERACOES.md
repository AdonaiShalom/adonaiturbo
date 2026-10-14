# Mapa de conhecimento quântico e nanotecnologia — EU SOU

**Versão:** 1.0 — 14/10/2026  
**Estado:** mapa curricular e catálogo inicial publicados; os textos completos ainda precisam ser ingeridos, indexados e validados.  
**Princípio:** esta página organiza o conhecimento que o EU SOU deve recuperar. Não significa que todos os conteúdos já estejam armazenados nem que o LEVI já os consulte em produção.

## 1. Separação de domínios

1. **Mecânica quântica:** estados, operadores, equação de Schrödinger, medição, probabilidades, energia, tunelamento, spin e sistemas de muitas partículas.
2. **Informação/computação quânticas:** qubits, portas, circuitos, emaranhamento, ruído, algoritmos, hardware e limites de escalabilidade.
3. **Nanotecnologia quântica:** fenômenos de nanoescala, confinamento, pontos quânticos, nanofios, materiais 2D, nanoeletrônica, nanofotônica, sensores e materiais.
4. **Química quântica e materiais:** estrutura eletrônica, ligações, estados excitados, transporte, superfícies, interfaces e simulação de materiais.
5. **Criptografia pós-quântica:** padrões de segurança concebidos para resistir a ataques de computadores quânticos. É um domínio relacionado, mas não substitui os domínios científicos anteriores.
6. **Método científico:** proveniência, licenças, extração de fórmulas, unidades, incerteza, reprodução, validação e comparação com baselines.

## 2. Corpus científico necessário

### Q01 — Matemática e ferramentas
- Álgebra linear complexa, vetores, espaços de Hilbert, operadores, autovalores e autovetores.
- Probabilidade, estatística, cálculo, equações diferenciais, Fourier e métodos numéricos.
- Unidades SI, análise dimensional, propagação de incerteza, estabilidade numérica e sensibilidade.
- Para cada modelo: equações, parâmetros, unidades, pressupostos, condições de contorno, domínio de validade e testes.

### Q02 — Fundamentos de mecânica quântica
- Função de onda, normalização, amplitude e densidade de probabilidade; regra de Born.
- Estados, superposição, interferência, observáveis, valores esperados e medição.
- Equação de Schrödinger temporal e estacionária; evolução unitária.
- Princípio da incerteza, estados ligados e espalhamento.
- Poços e barreiras de potencial, tunelamento, oscilador harmônico e átomo de hidrogênio.
- Momento angular, spin, partículas idênticas, emaranhamento e decoerência.
- Limites de interpretação, regimes de validade e distinção entre teoria, aproximação e observação.

### Q03 — Computação e informação quânticas
- Qubits, esfera de Bloch, portas, circuitos, medidas, estados mistos e matrizes densidade.
- Emaranhamento, canais quânticos, ruído, correção de erros e tolerância a falhas.
- Algoritmos e aplicações propostas, requisitos de hardware, qubits lógicos/físicos e custos.
- Otimização quântica e algoritmos inspirados em métodos quânticos.
- Cada alegação de vantagem deve incluir baseline clássico competitivo, dataset, custo total, tamanho do problema, repetibilidade e limitações.

### Q04 — Nanotecnologia quântica e materiais
- Mudanças eletrônicas, ópticas, magnéticas e químicas na nanoescala; efeitos de tamanho e superfície.
- Confinamento quântico, níveis discretos, pontos quânticos, nanocristais e nanofios.
- Materiais 2D, heteroestruturas, interfaces, defeitos, transporte e propriedades dependentes da geometria.
- Nanoeletrônica, nanofotônica, emissores quânticos e dispositivos.
- Sensores quânticos, metrologia, ruído, calibração e limites de detecção.
- Síntese, caracterização, pureza, estabilidade, escalabilidade, reprodutibilidade e segurança ambiental/ocupacional.
- Caracterização e limites: microscopia eletrônica, AFM/STM, espectroscopia e técnicas apropriadas à amostra.
- Modelagem como DFT e dinâmica molecular somente com pressupostos, parâmetros e validação documentados.

### Q05 — Curadoria e recuperação
- Preservar o arquivo original e seu hash; não corrigir fórmulas por suposição.
- Conferir visualmente equações extraídas; registrar correção, página e motivo.
- Armazenar metadados no Supabase e texto/trechos no armazenamento aprovado, com referência estável.
- Indexar por domínio, título, instituição, idioma, página, data e licença.
- Avaliar consultas em português e inglês, paráfrases e perguntas sem resposta no corpus.
- Não usar um limiar de score como prova suficiente de relevância; avaliar o trecho e sua pertinência.
- Separar fontes primárias, revisões, materiais didáticos, preprints, padrões e material não revisado.

## 3. Aplicação por operação

### A. Adonai Turbo — inteligência e coordenação
Recuperação de evidências, cálculos reproduzíveis, pressupostos, comparação de alternativas, incerteza e detecção de lacunas. LEVI recebe resposta estruturada e não transforma evidência incompleta em certeza.

### B. Adonai Marketing Digital
- Estatística, probabilidade, inferência causal, experimentos A/B, atribuição e otimização clássica como baseline.
- Métodos quânticos ou quantum-inspired apenas como pesquisa comparativa; nenhuma vantagem presumida.
- Validar alegações de clientes/produtos ligados a nano/materiais com fontes primárias, limites e segurança.
- Separar permissões de pesquisa, produção, revisão e publicação.
- Não compartilhar dados, credenciais ou operações com PSM Grupo Market.

### C. Adonai Finanças
- Probabilidade, séries temporais, otimização de portfólio, correlação, liquidez, volatilidade, risco de cauda e cenários.
- Comparar métodos clássicos e alternativas quânticas/inspiradas com datasets, custos e métricas equivalentes.
- Controlar sobreajuste, taxas, slippage, incerteza e estabilidade fora da amostra.
- Pesquisa sobre indústrias quânticas/nanomateriais com data, origem e distinção entre fatos e projeções.
- Não prometer retornos nem autorizar ordens reais sem controles independentes.

### D. Adonai Lab
- Mecânica quântica, química quântica, materiais e nanoestruturas quando pertinentes ao experimento.
- Desenho experimental, amostragem, unidades, metrologia, análise de erro, reprodutibilidade e validação.
- Para formulações, alimentos e agronomia, exigir literatura específica, composição, concentração, compatibilidade, estabilidade, métodos analíticos e avaliação de segurança.
- Simulação não equivale a resultado experimental; aplicação prática requer medidas e revisão apropriada.

### E. Adonai Trade
- Dados temporais corretos, vieses de seleção/sobrevivência, look-ahead bias, regimes e volatilidade.
- Backtesting walk-forward e fora da amostra, custos, slippage, drawdown, risco e benchmarks.
- Métodos quânticos/inspirados apenas como experimentos; nunca presumir superioridade nem usar como sinal automático.
- Pesquisa em tecnologia quântica pode apoiar análise setorial, não uma ordem automática.
- Execução real sujeita a permissões, testes e aprovação próprios.

## 4. Fontes institucionais iniciais

| Fonte | Uso inicial | Estado |
|---|---|---|
| [MIT OCW 8.04 — Quantum Physics I](https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/) | Fundamentos e mecânica quântica introdutória | Candidata; verificar materiais e licença |
| [MIT OCW 8.05 — Quantum Physics II](https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/) | Formalismo e tópicos intermediários | Candidata; verificar materiais e licença |
| [NIST — Quantum Information Science](https://www.nist.gov/quantum-information-science) | Informação, sensores e metrologia quântica | Candidata; selecionar documentos específicos |
| [National Quantum Initiative](https://www.quantum.gov/strategy-documents/) | Estratégia e contexto do campo | Contexto; não substitui texto didático |
| [National Nanotechnology Initiative](https://www.nano.gov/about-nanotechnology/) | Conceitos e propriedades de nanoescala | Candidata; complementar com literatura primária |
| [NNI — What Is So Special about Nano?](https://www.nano.gov/about-nanotechnology/what-is-so-special-about-nano/) | Efeitos dependentes da escala | Candidata; verificar referências |
| [NIST — Designing the Nanoworld](https://www.nist.gov/programs-projects/designing-nanoworld-nanostructure-nanodevices-and-nano-optics) | Nanoestruturas, dispositivos e nanofotônica | Candidata; verificar conteúdo vigente |
| [NIST FIPS 203](https://csrc.nist.gov/pubs/fips/203/final) | Criptografia pós-quântica (ML-KEM) | Domínio separado |
| [NIST FIPS 204](https://csrc.nist.gov/pubs/fips/204/final) | Criptografia pós-quântica (ML-DSA) | Domínio separado |
| [NIST FIPS 205](https://csrc.nist.gov/pubs/fips/205/final) | Criptografia pós-quântica (SLH-DSA) | Domínio separado |

Catalogar uma URL não significa que seu texto integral esteja armazenado ou indexado. Respeitar licenças e termos de acesso. Registrar título, instituição/autores, URL/DOI, data, licença, versão, idioma, hash, método de extração e validação.

## 5. Contrato mínimo LEVI → EU SOU

Cada consulta científica inclui identificador de correlação, operação solicitante, agente (se aplicável), pergunta, contexto mínimo, domínio, idioma e limites.

O EU SOU retorna resposta, fontes/URLs/páginas/trechos, método e parâmetros/unidades quando houver cálculo, incerteza, pressupostos, limitações e estado de validação. Se não houver evidência suficiente, declara a lacuna.

LEVI mantém a proveniência vinculada à resposta, respeita permissões, não mistura dados de empresas e falha com segurança quando a API científica está indisponível.

## 6. Testes de aceitação
- [ ] Oscilador harmônico retorna trecho correto e fórmula verificada no original.
- [ ] Regra de Born e equação de Schrödinger retornam fontes/páginas pertinentes.
- [ ] Ponto quântico e confinamento retornam fonte de nanotecnologia, não apenas FIPS.
- [ ] Nanofotônica/sensores retornam fonte específica e limites de aplicação.
- [ ] Criptografia pós-quântica retorna FIPS 203/204/205 sem confusão com mecânica quântica.
- [ ] Pergunta fora do corpus gera resposta de lacuna, sem citações inventadas.
- [ ] LEVI chama a API EU SOU e usa a resposta retornada com proveniência.
- [ ] Testes por operação confirmam isolamento e permissões.
- [ ] Corpus, código e esquema têm versões identificadas; resultados reproduzíveis são registrados.

## 7. Estado confirmado em 14/10/2026
- Supabase: 7 domínios inseridos/atualizados, 11 fontes candidatas e 11 relações fonte-domínio.
- Fontes marcadas como não revisadas; catalogação não equivale à ingestão do texto completo.
- Biblioteca local anteriormente observada: 607 trechos de três padrões NIST de criptografia pós-quântica.
- Laboratório experimental anteriormente reportado: 26 trechos de material do MIT e nota local; não foi promovido para a biblioteca ativa.
- O repositório GitHub contém documentação e o aplicativo FreeLLMAPI em Next.js; a árvore consultada não contém backend/server.js, backend/levi-core.js ou biblioteca-local/server.py. Portanto, o repositório conectado não comprova sincronização do backend local.
- Integração operacional LEVI → EU SOU, ingestão completa do corpus e ativação de todos os agentes ainda não foram comprovadas ponta a ponta.
