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