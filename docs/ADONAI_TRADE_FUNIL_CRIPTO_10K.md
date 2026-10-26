# Funil Cripto 10K — procedimento

## Meta
Varredura de ativos cripto com Perp e CoinGecko, análise ampla e seleção de até cinco finalistas; até quatro candidatas seguem para o EU SOU; o EU SOU devolve até três recomendações. A execução é exclusivamente na Binance Futures Demo.

## Regras
1. Confirmar conexão, cobertura, timestamps e limites das fontes. Cruzar tokens descobertos com contratos realmente negociáveis na Binance Futures Demo.
2. Contar apenas avaliações válidas, distintas, versionadas e auditáveis. Registrar ativos únicos, análises válidas e falhas. Se não alcançar 10.000, informar o total real; nunca inflar contagem com duplicatas ou retries.
3. Avaliar LONG e SHORT com dados de preço, volume, liquidez, spread, volatilidade, funding quando disponível, custos, notícias e risco. Selecionar até cinco oportunidades robustas; não preencher vagas artificialmente.
4. Enviar até quatro candidatas ao EU SOU com fontes, horários, tese, entrada, stop, alvo, horizonte, custos, incerteza e evidência que refutaria a tese.
5. O EU SOU valida matemática e modelos. Cálculos quânticos/nanoquânticos só podem ser declarados executados se houver implementação reproduzível, testes e comparação com baseline clássico. Retornar até três recomendações ou NO TRADE.
6. Risco independente consulta saldo, margem, posições e ordens na Demo e pode vetar. O saldo de 5.000 USDT informado deve ser confirmado por API; não usar saldo local como saldo da exchange.
7. Limite: no máximo três novas entradas confirmadas em qualquer janela móvel de 24 horas, somando LONG e SHORT. Não há obrigação de operar. Uma ordem por vez por padrão; após timeout, reconciliar por clientOrderId antes de tentar novamente.
8. Confirmar ordem, fills, posição e saldo na Binance Demo; mocks não contam como operação. Retornar resultados ao EU SOU via LEVI; RH registra lições, responsáveis, evidências e testes de melhoria.
9. Execução real permanece desabilitada. Se dados, auditoria, conta ou risco estiverem incertos, não enviar ordem.

## Relatório por ciclo
Ativos/instrumentos únicos; avaliações válidas/falhas; cobertura das fontes; finalistas; candidatas enviadas ao EU SOU; recomendações; bloqueios; operações na janela de 24h; reconciliação; resultados e lições.

**Estado:** procedimento documental. A meta de 10.000 análises, integrações, cálculos e limite de 24h só podem ser declarados operacionais após testes e evidência de runtime.

## Estado técnico — atualização de 26/10/2026
- Corrigido `adonai-trade/runtime/market-adapters.cjs` para solicitar a cotação CRYPTO no host `demo-fapi.binance.com`, caminho `/fapi/v1/ticker/24hr`, com fonte `binance_usdm_futures_demo_24hr`. Commit: `01b76d16e4db07b228650dcc93a18ffaab7796fb`.
- Atualizado `adonai-trade/contracts/v1/test-market-adapters.cjs` para exigir esse host/caminho e identificar a fonte, impedindo que o mock antigo dependa de Binance Spot. Commit: `9603758af7d77e20acfa0e620e8ea6bc809c0209`.
- O conteúdo dos dois arquivos foi relido do GitHub e conferido. O check Vercel disponível no commit do teste está verde, mas isso não prova execução da suíte Node.
- **Ainda não validado:** acesso de rede real ao endpoint Demo, execução local da suíte, descoberta Perp/CoinGecko, 10.000 avaliações válidas, integração de ponta a ponta EU SOU/LEVI, armazenamento persistente do limite móvel de três entradas, envio/reconciliação de ordem Demo.
- Segurança: nenhuma ordem foi enviada; execução real continua desabilitada. A correção do adaptador de cotação não é uma implementação do motor de ordens.


## Implementação inicial do avaliador — 26/10/2026
- Criado `adonai-trade/runtime/crypto-opportunity-funnel.cjs`: avaliador read-only, limite de lote 10.000 registros, deduplicação determinística por instrumento/lado/horário/versão, rejeição de dados vencidos, métricas inválidas e contrato Demo não confirmado, score de baseline transparente e seleção de até cinco finalistas com score positivo. Commit do módulo: `839f09704f3bcfb4c78a7ca16d70fbe5809eda8a`.
- Criado `adonai-trade/contracts/v1/test-crypto-opportunity-funnel.cjs` com verificações de duplicatas, frescor, contrato elegível, limite de lote e execução desabilitada.
- Incluído o novo teste no comando `npm test`. Commit: `3cca6f2a1c95ff3142ea6f102ca11481142bcf76`.
- Os arquivos foram relidos e o conteúdo esperado foi confirmado no GitHub. O check Vercel desse commit estava pendente na última consulta; nenhum resultado de execução Node foi confirmado.
- Limitações: score é heurística experimental, não previsão validada; não há coleta CoinGecko/Perp, persistência da contagem, integração EU SOU/LEVI, nem execução/reconciliação de ordens neste módulo. O módulo não envia ordens.


## Descoberta cripto e endpoint read-only — 26/10/2026
- Criado `adonai-trade/runtime/crypto-discovery.cjs`: consulta CoinGecko Markets (até 250 ativos por chamada) e cruza símbolos com `/fapi/v1/exchangeInfo` da Binance USDⓈ-M Futures Demo; só marca elegibilidade quando há contrato PERPETUAL, quote USDT e status TRADING. Commit: `eaf4bf4bef0778829e006de597add58be3eba335`.
- Criada rota GET `/api/v1/crypto/discovery?per_page=250`, com limite de 6 chamadas/minuto por endereço e validação de parâmetro; execução desabilitada. Commit: `3b1519783fad42ea856f2a404ad1b03fa3a025ad`.
- Adicionados testes unitários de descoberta e teste HTTP; incluídos no `npm test`. Commits dos testes/integração: `fada90f3382873eafc055667c86f3043e33f55b6`, `3c068505be7cd140c21242ef396ca1a7aa2e06a3`, `5f10acd1940c25b0fd8010c0cd2a3db350f3944b`, `ef988464805e77ec14982ae4a231f908042b6756`.
- Os arquivos foram gravados e relidos do GitHub. Isso ainda não prova execução dos testes Node nem resposta real dos provedores; as verificações unitárias usam mocks.
- A descoberta cobre no máximo 250 moedas por requisição e não é a meta de 10.000 avaliações. Para atingir essa meta são necessárias várias fontes/lotes de dados, métricas reais e registro persistente, com deduplicação global entre ciclos. Ainda não existe integração EU SOU/LEVI nem ordem/reconciliação de Binance Demo nesta rota.
