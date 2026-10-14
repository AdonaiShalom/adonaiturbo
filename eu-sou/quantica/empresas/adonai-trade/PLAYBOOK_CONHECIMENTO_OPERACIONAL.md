# EU SOU — Playbook de pesquisa para Adonai Trade
Versão 1.0 · 2026-10-14 · Preparação de conhecimento; Adonai Trade ainda requer instalação própria.

## Base clássica obrigatória
Microestrutura, qualidade de dados, spreads, liquidez, slippage, custos, sizing, gestão de risco, backtesting walk-forward, prevenção de look-ahead e survivorship bias, monitoramento e controles de execução.

## Pesquisa quântica/quantum-inspired
- Problemas discretos de seleção/alocação podem ser formulados como QUBO/Ising, se a função objetivo e as restrições forem expressas corretamente.
- QAOA, annealing e heurísticas são opções de pesquisa; não assumem vantagem em dados financeiros ruidosos.
- Comparar contra solver clássico, heurísticas e baseline de carteira/estratégia.
- Incluir custos, latência de execução, restrições de liquidez e sensibilidade a parâmetros.

## Protocolo
1. Dados versionados com timestamps e controles contra vazamento.
2. Divisão temporal treino/validação/teste.
3. Backtest com custos e slippage conservadores.
4. Walk-forward e períodos de estresse.
5. Comparação justa de recursos, objetivo e restrições.
6. Relatório com retornos líquidos, risco, drawdown, turnover, estabilidade e intervalos de incerteza.
7. Paper trading com limites, kill switch e supervisão humana antes de qualquer capital real.

## Limite de segurança
O conhecimento aqui preparado não instala agentes, não conecta corretora e não autoriza ordens. Não executar capital real sem instalação, auditoria e autorização explícitas.