# EU SOU × Adonai Trade — pesquisa de mercados e triagem de repositórios
Data da revisão: 2026-10-19
Escopo: conhecimento, pesquisa, análise e simulação; nenhuma ordem real.

## 1. Hierarquia operacional vinculante

1. **EU SOU — cérebro científico e decisório:** ingestão de fontes, memória científica versionada, análise gráfica e fundamentalista, notícias/eventos, índices e macro, estatística, probabilidades calibradas, análise de risco e experimentos quânticos/nanoquânticos.
2. **Gate de decisão:** bloqueia qualquer proposta quando a origem/frescor dos dados, a integridade da auditoria, o modelo, a incerteza, os limites de risco ou a autorização não passam nos critérios de aceitação.
3. **LEVI — orquestrador:** recebe uma decisão estruturada do EU SOU, preserva correlation_id e evidências, encaminha tarefas para as mesas e RH e retorna resultados. LEVI não pode inventar dados nem transformar recomendação incompleta em ordem.
4. **Quatro mesas:** B3/nacional; internacional; Forex; cripto. Cada mesa tem adaptador, calendário, moeda, sessão, custos, cobertura, política de frescor e status de dado próprio.
5. **RH — equipes especializadas:** pesquisa e inteligência; dados de mercado; risco/conformidade; auditoria/ceticismo; execução simulada; supervisão humana. Toda tarefa tem responsável, status, evidência e timestamp.

**Contrato de saída do EU SOU:** ativo/instrumento; mercado; direção ou cenário proposto (ou abstenção); horizonte; premissas; fontes e timestamps; versão/hash do modelo; estimativa probabilística e calibração; incerteza; custos; risco; testes e benchmark; razões a favor/contra; expiração da proposta; estado do gate. Uma decisão sem esses campos deve resultar em abstenção, não em execução.

**Modo atual:** pesquisa/read-only/paper. Nenhuma ordem de compra ou venda real será enviada nesta etapa. Não habilitar chaves de negociação nem chamar endpoints de corretora com efeito financeiro.

## 2. Escopo analítico obrigatório

### B3 / mercado financeiro nacional
- Ações, units, BDRs, ETFs, FIIs/Fiagro, títulos públicos e privados com cobertura comprovada, futuros e opções.
- Preços OHLCV ajustados e não ajustados; eventos corporativos; liquidez, spread, volume e custos; fundamentos de demonstrações financeiras; dividendos; múltiplos; endividamento e fluxo de caixa.
- Contexto: Selic, inflação, curva de juros, câmbio, crédito, atividade, calendário de resultados e fatos relevantes.
- Referências: B3, CVM, Banco Central e Tesouro Nacional. Provedores agregadores (por exemplo, Brapi) não substituem a documentação/licença da fonte original.

### Internacional
- Ações, ETFs, índices, títulos soberanos/corporativos, commodities, futuros e opções conforme dados licenciados.
- Fundamentos/XBRL, relatórios e eventos corporativos; curva de juros, inflação, emprego, bancos centrais, exposição cambial, concentração setorial e correlação.
- Referências: SEC EDGAR, FRED, BCE e documentação oficial da bolsa/provedor de cada instrumento.

### Forex
- Pares principais, cruzados e emergentes, com sessões e convenções de cotação explícitas; futuros/opções cambiais quando houver dados.
- Diferenciais de juros, inflação, emprego, bancos centrais, calendário macro, volatilidade, spread, rollover/swap, custo de carregamento e risco de alavancagem.
- BIS para estatísticas agregadas; CFTC COT como dado periódico de futuros cobertos, nunca como visão integral do mercado spot; provedor intradiário só é válido após teste de chave, plano, timestamp e frescor.

### Cripto
- Spot e, separadamente, futuros perpétuos/opções quando a fonte suportar: OHLCV, trades, livro, spread, profundidade, slippage, funding, basis, open interest e liquidações.
- Registrar exchange e símbolo em cada observação; tratar diferenças entre exchanges, stablecoins, risco de custódia, liquidez, rede, contratos inteligentes e métricas on-chain específicas.
- Binance Spot API e CoinGecko são pontos de integração candidatos, sujeitos a limites, termos e teste de frescor. Nunca inferir um preço global a partir de uma única exchange.

### Motores compartilhados
- Técnico: candles, tendências, momentum, volatilidade, volume e indicadores com parâmetros versionados.
- Fundamentalista: métricas comparáveis com datas fiscais, moeda, unidade e metodologia registradas.
- Notícias: origem, hora de publicação/coleta, ativo relacionado, deduplicação, evento e sentimento; sentimento não é sinal de negociação isolado.
- Estatística/probabilidade: distribuição, autocorrelação, dependência, regimes, intervalos de incerteza, calibração e testes fora da amostra.
- Risco/carteira: custos, spread, slippage, exposição, concentração, drawdown, VaR/CVaR, liquidez e cenários extremos.
- Backtest: treino/validação/teste em ordem temporal, walk-forward, benchmark, prevenção de look-ahead e survivorship bias, custos realistas e relatório reproduzível.

## 3. Fontes oficiais prioritárias

- B3: https://www.b3.com.br/ — índices, instrumentos, metodologia e dados de mercado.
- CVM: https://www.gov.br/cvm/pt-br/acesso-a-informacao-cvm/dados-abertos — documentos e dados de emissores.
- Banco Central do Brasil: https://www.bcb.gov.br/ — séries macroeconômicas, juros e câmbio.
- SEC EDGAR APIs: https://www.sec.gov/search-filings/edgar-application-programming-interfaces — documentos/XBRL de empresas dos EUA.
- FRED API: https://fred.stlouisfed.org/docs/api/fred/ — séries econômicas.
- BCE Data API: https://data.ecb.europa.eu/help/api/data — estatísticas europeias.
- BIS statistics: https://www.bis.org/statistics/ — câmbio e derivativos agregados.
- CFTC COT: https://www.cftc.gov/MarketReports/CommitmentsofTraders/AbouttheCOTReports/index.htm — posicionamento periódico de futuros cobertos.
- Brapi: https://brapi.dev/docs — API agregada; autenticação, plano e direitos de uso precisam ser verificados.
- Alpha Vantage: https://www.alphavantage.co/documentation/ — séries e dados financeiros; cobertura e limites dependem do endpoint/plano.
- Binance Spot API: https://github.com/binance/binance-spot-api-docs — trades, candles e livro da exchange.
- CoinGecko: https://docs.coingecko.com/ — dados agregados de criptoativos.
- TradingView: https://www.tradingview.com/widget/ — widgets oficiais para visualização, não substituto automático de dados licenciados para cálculos.
- Investing.com: https://www.investing.com/economic-calendar/ — calendário; incorporar apenas por meios permitidos pelos termos/licenças.

Cada ingestão deve registrar URL canônica, tipo de fonte, licença/termos, timestamp de publicação e coleta, período de referência, fuso, unidade, moeda, latência conhecida, hash e status de verificação. Indisponível, vencido, não verificado e zero são estados diferentes.

## 4. Triagem inicial de repositórios públicos

Esta é uma revisão estática inicial de README/licença/documentação via GitHub; não é declaração de clonagem, execução, benchmark ou integração em produção.

### QuantStats — https://github.com/ranaroussi/quantstats
- README consultado: módulos stats, plots e reports; métricas de desempenho, drawdown, relatórios e exemplo de Monte Carlo.
- Uso potencial: análise posterior de retornos e relatórios de backtest.
- Pendência: confirmar a licença a partir do arquivo de licença/metadata do commit selecionado, versão suportada e testes; não importar até concluir essa verificação.

### VectorBT — https://github.com/polakowo/vectorbt
- README consultado: pesquisa vetorizada, indicadores/sinais, avaliação em múltiplos ativos/períodos, aceleração NumPy/Numba e motor Rust opcional.
- O README indica licença Fair Code para a edição comunitária. **Não tratar como licença permissiva Apache/MIT**; análise jurídica/comercial obrigatória antes de qualquer uso no produto.
- Uso potencial: benchmark de pesquisa em ambiente isolado, somente após licença e requisitos de versão confirmados.

### QuantConnect LEAN — https://github.com/QuantConnect/Lean
- Arquivo LICENSE consultado e Apache License 2.0 confirmado.
- Uso potencial: referência arquitetural para backtest/eventos, custos, preenchimentos e múltiplas classes de ativos.
- Pendência: a leitura do README falhou nesta consulta; antes de adoção, revisar árvore, dependências, licenças de dados e testes, além do custo operacional. Não instalar o motor completo sem análise de escopo.

### Qiskit Finance — https://github.com/qiskit-community/qiskit-finance
- README e LICENSE consultados; Apache 2.0. O próprio projeto informa que deixou de ter suporte oficial da IBM em novembro de 2023.
- Uso permitido para estudo/prototipagem após pinagem de versão e verificação de dependências.
- Uso potencial: formular problemas financeiros e experimentar otimização/estimação; não é prova de vantagem quântica.

### Candidatos não aprovados ainda
- FinRL: https://github.com/AI4Finance-Foundation/FinRL — revisar README, licença, dependências, ambientes e risco de sobreajuste antes de recomendar.
- TA-Lib Python: https://github.com/TA-Lib/ta-lib-python — validar licença, dependência nativa e resultados numéricos.
- PyPortfolioOpt: https://github.com/robertmartin8/PyPortfolioOpt — revisar licença, pressupostos de otimização e estabilidade dos estimadores.
- FinBERT: https://github.com/ProsusAI/finBERT — revisar separadamente licença de código, pesos e corpus de treino; medir calibração e viés por idioma/domínio.
- CCXT: https://github.com/ccxt/ccxt — interface de exchanges; no projeto, expor apenas leitura e não carregar credenciais de negociação.
- Qiskit Finance, PennyLane/Cirq e simuladores: manter experimentos separados da camada de decisão até a comparação com baselines clássicos.

### Decisão de integração inicial
1. Priorizar a implementação dos contratos de dados, indicadores, métricas de risco e backtest próprios, testáveis e desacoplados.
2. Avaliar bibliotecas como dependências substituíveis; não copiar código sem respeitar a licença.
3. Não promover nenhum repositório a “validado” apenas com README. Exigir versão/commit, licença, testes reproduzidos, fixtures, resultados e limites documentados.

## 5. Pesquisa quântica e nanoquântica

- QUBO/Ising e QAOA/annealing podem ser testados em problemas discretos de seleção/alocação quando a função objetivo e restrições forem formalizadas.
- Cada teste deve usar os mesmos dados, objetivo, restrições, orçamento de computação e critérios que o solver clássico/heurística de referência.
- Registrar qualidade da solução, tempo, estabilidade, sensibilidade, ruído e custo; sem melhoria repetida, classificar como experimental.
- Simulação clássica de circuitos não é hardware quântico nem demonstra vantagem quântica.
- Nanotecnologia quântica (materiais, nanoeletrônica, nanofotônica e sensores) permanece domínio científico distinto; não alegar que resultados de nanoescala predizem preços sem hipótese testável.

## 6. Critérios de aprovação e bloqueio

Uma proposta de decisão deve ser bloqueada quando houver: fonte sem direito de uso; timestamp/fuso inválido; dado vencido ou divergente; ativo não identificado; modelo sem versão/hash; teste temporal contaminado; probabilidade não calibrada; risco acima dos limites; cadeia de auditoria inválida; integração/ordenação de papéis não verificada; ou tentativa de sair do modo paper.

A trilha deve preservar: correlation_id; fonte e hashes; versão do código/modelo; parâmetros; entrada/saída; benchmark; incerteza; responsável RH; resultado do gate; timestamp; status. Falhas não podem ser silenciosamente convertidas em zeros, dados antigos ou resultados “verificados”.

## 7. Próximas tarefas verificáveis

1. Terminar a auditoria de licenças e pinagem dos candidatos.
2. Registrar fontes oficiais e adaptadores por mercado no catálogo científico do EU SOU.
3. Criar fixtures offline para B3, internacional, Forex e cripto; validar timestamps, moedas, unidades, custos e falhas.
4. Construir baseline clássico reproduzível antes de qualquer experimento quântico.
5. Executar testes de calibração, walk-forward, out-of-sample e estresse.
6. Conectar os resultados ao contrato EU SOU → gate → LEVI → quatro mesas/RH em modo paper.
7. Resolver a integridade do ledger local e testar a trilha de auditoria Supabase antes de liberar a sede 3D.
8. Só declarar conclusão com artefatos, hashes, logs de teste e evidência de não execução de ordens reais.

## 8. Evidências desta revisão

- Playbook anterior do Trade: https://github.com/AdonaiShalom/adonaiturbo/blob/work/adonai-trade-runtime-contracts-20261017/eu-sou/quantica/empresas/adonai-trade/PLAYBOOK_CONHECIMENTO_OPERACIONAL.md
  - Blob SHA observado: 7ccfe5d679a00cf2acda29af4b53b52c638f9d0c
- Matriz anterior da sede 3D: https://github.com/AdonaiShalom/adonaiturbo/blob/work/adonai-trade-runtime-contracts-20261017/adonai-trade/docs/SEDE3D_MENU_FUNCIONAL_E_MATRIZ_DE_INTEGRACAO.md
  - Blob SHA observado: 752b420e4478537da13e46e4e863227a3e26ebe0
- VectorBT README SHA observado: f7a22ea5e7501b714fffa2afbd2079a029cd13c4
- QuantStats README SHA observado: fa7a47c223b0b8ee5069c4ba633b54e6b0d1db80
- LEAN LICENSE SHA observado: 6faed93d21a1a9551b11434e87c9000a393d73f2
- Qiskit Finance README SHA observado: 96061a6b39467a5a930a30659ac54a126c2efab1
- Qiskit Finance LICENSE SHA observado: 5333c633bff5ae1a7f8b29c4bf875cc4201cd697

Status desta versão: revisão inicial de fontes/repositórios; ainda não é aprovação para produção nem prova de desempenho financeiro.
