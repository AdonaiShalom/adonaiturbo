# EU SOU — Nucleo cientifico de fisica quantica e nanotecnologia

Versao 1.0. Estado: sintese educacional original para curadoria e ingestao. Nao significa que o backend local ja a tenha carregado.

## Fisica quantica

Um estado puro e representado por um vetor normalizado |psi> em um espaco de Hilbert. Observaveis sao operadores hermitianos. A regra de Born associa probabilidades a amplitudes: para um projetor P, p = <psi|P|psi>. O valor esperado e <A> = <psi|A|psi>; para um estado misto rho, <A> = Tr(rho A).

A evolucao de um sistema nao relativistico isolado obedece i hbar d|psi>/dt = H|psi>, com H o Hamiltoniano. Em estados estacionarios, H|psi> = E|psi>. Para uma particula em potencial V(x), H = -(hbar^2/2m) d^2/dx^2 + V(x). Potencial, condicoes de contorno, normalizacao e aproximacoes definem a validade da solucao.

Para o oscilador harmonico H = p^2/(2m) + m omega^2 x^2/2, os niveis sao E_n = hbar omega (n + 1/2), n = 0,1,2,... A energia de ponto zero e hbar omega/2. Este e um benchmark analitico para testar solvers; requer o modelo de potencial harmonico.

A relacao de incerteza e Delta A Delta B >= |< [A,B] >|/2. Superposicao e combinacao linear de estados; interferencia depende de fases relativas. Estados compostos podem estar emaranhados e apresentar correlacoes nao fatoraveis. Decoerencia descreve perda de coerencia observavel por interacao com ambiente; nao e sinonimo de uma interpretacao especifica da medicao.

## Informacao quantica

Um qubit puro e |psi> = alpha|0> + beta|1>, com |alpha|^2 + |beta|^2 = 1. Medir na base computacional produz 0 e 1 com probabilidades |alpha|^2 e |beta|^2. Portas ideais sao unitarias; ruido, medicao e sistemas abertos exigem formalismo adicional. Qubits fisicos nao equivalem a qubits logicos uteis. Toda alegacao de vantagem quantica deve identificar tarefa, escala, hardware, ruido, custo total e baseline classico competitivo. Algoritmos quantum-inspired executados em hardware classico nao sao automaticamente computacao quantica.

## Nanotecnologia quantica

Na nanoescala, tamanho, superficie, composicao, defeitos, temperatura e ambiente podem mudar propriedades eletronicas, opticas, magneticas e quimicas. "Nano" nao implica automaticamente efeito quantico forte: a relevancia depende das dimensoes comparadas a escalas fisicas pertinentes.

Confinamento em uma ou mais dimensoes pode discretizar niveis. Pontos quanticos confinam portadores em tres dimensoes; nanofios tipicamente em duas, com transporte ao longo de uma dimensao; pocos quanticos confinam em uma dimensao. Sao idealizacoes que devem ser relacionadas a geometria e ao material reais.

Materiais 2D, heteroestruturas e interfaces dependem de defeitos, ligantes, substrato, strain, contatos e contaminacao. Nanoeletronica e transporte quantico exigem geometria, Hamiltoniano, parametros, condicoes de contorno, discretizacao e testes de convergencia. Nanofotonica envolve interacao da luz com estruturas subcomprimento de onda. Sensores quanticos precisam declarar ruido, calibracao, largura de banda, tempo de integracao e baseline classico.

Quimica quantica e materiais computacionais usam metodos diferentes (Hartree-Fock, DFT, coupled cluster, dinamica molecular) com custos e erros diferentes. Registrar metodo, base/funcional, pseudopotencial, geometria, convergencia, unidades, versao e observavel. Dados precisam de licenca, metodo de referencia, unidades, proveniencia e divisao de treino/teste. Simulacao nao equivale a experimento. Seguranca de nanomateriais depende da substancia, dose, forma, via de exposicao e contexto.

## Metodo cientifico do EU SOU

Toda resposta deve distinguir teoria estabelecida, aproximacao, calculo executado, inferencia e evidencia experimental. Registrar fonte, versao, pagina/trecho, parametros, unidades, pressupostos, incerteza, limitacoes e estado de validacao. Se nao houver evidencias, declarar a lacuna. Simulacoes devem testar caso analitico, convergencia, sensibilidade e baseline; dados devem ser verificados quanto a licenca, vies, unidades, duplicatas e leakage.

## Aplicacao nas cinco operacoes

- Adonai Turbo: recuperacao com fontes, calculos auditaveis, incerteza e encaminhamento pelo LEVI.
- Adonai Marketing Digital: estatistica, inferencia causal, A/B testing, otimizacao e revisao de alegacoes cientificas. Separar o PSM Grupo Market.
- Adonai Financas: probabilidade, series temporais, otimizacao, risco, custos e validacao fora da amostra. Tecnologia emergente nao garante retorno.
- Adonai Lab: mecanica/quimica quantica, pontos quanticos, materiais 2D, nanoeletronica, nanofotonica, sensores, metrologia e validacao experimental.
- Adonai Trade: preparar conhecimento, mas nao declarar instalado. Exigir backtest walk-forward, custos, slippage, drawdown, paper trading e comparacao com baselines classicos.

## Referencias tecnicas
- QuTiP User Guide: https://qutip.readthedocs.io/en/stable/guide/guide.html
- QuTiP states/operators: https://qutip.org/docs/4.7/guide/guide-states.html
- QuTiP tutorials: https://github.com/qutip/qutip-tutorials
- Kwant tutorial: https://www.kwant-project.org/doc/1/tutorial/introduction
- Kwant quantum wire: https://www.kwant-project.org/doc/latest/tutorial/first_steps
- OSSCAR: https://github.com/osscar-org/quantum-mechanics
- OpenQDC: https://github.com/valence-labs/openQDC
- AiiDA common workflows: https://github.com/aiidateam/aiida-common-workflows
- MIT OCW 8.04: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/
- MIT OCW 8.05: https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/
- NIST Quantum Information Science: https://www.nist.gov/quantum-information-science
- National Nanotechnology Initiative: https://www.nano.gov/about-nanotechnology/

Este arquivo e uma sintese educacional original com referencias, nao copia integral de fontes de terceiros. Verificar licencas antes de ingerir arquivos completos.
