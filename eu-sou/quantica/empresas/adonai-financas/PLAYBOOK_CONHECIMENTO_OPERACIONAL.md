# EU SOU — Playbook quantitativo para Adonai Finanças
Versão 1.0 · 2026-10-14

## Princípio
Métodos quânticos e quantum-inspired são experimentais para muitos usos financeiros. Não implicam rentabilidade, previsão superior ou redução de risco. O núcleo clássico e a governança de risco são obrigatórios.

## Conhecimento requerido
- Probabilidade, estatística, séries temporais, covariância, otimização convexa/inteira, risco de cauda, VaR/CVaR, drawdown, liquidez e custos.
- Formulação QUBO/Ising: definir variáveis binárias, função objetivo, restrições e pesos de penalidade; testar que a formulação representa o problema original.
- QAOA/VQE: documentar encoding, ansatz, otimizador, shots, ruído, orçamento computacional e critérios de parada.
- Baselines: enumeração exata em instâncias pequenas, solver clássico forte, heurísticas e método atualmente usado.
- Avaliação: separação temporal, walk-forward, custos de transação, slippage, limites de posição, dados sem look-ahead e análise de robustez.

## Protocolo de validação
1. Fixar problema, dados e período antes de comparar.
2. Congelar sementes, versões e parâmetros.
3. Comparar a mesma função objetivo e restrições.
4. Reportar qualidade da solução, tempo total, custo e variabilidade.
5. Executar análise fora da amostra e testes de estresse.
6. Documentar limitações e não inferir vantagem universal.
7. Exigir aprovação humana e limites de risco antes de qualquer uso operacional.

## Critério de aceite
Sem melhoria estatisticamente robusta sobre baseline clássico após custos e fora da amostra, registrar “sem vantagem demonstrada”. Nenhum resultado de pesquisa autoriza movimentação automática de capital.