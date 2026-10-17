# Revisão de engenharia reversa — Adonai Trade

Revisão de padrões arquiteturais públicos; não é validação de segurança/rentabilidade dos projetos externos e não copia código. Paper trading permanece obrigatório até aprovação dos gates.

## Referências para análise

- OpenTradex: https://github.com/deonmenezes/opentradex — gateway local, health/readiness, endpoints de quote/risk, eventos e controles paper-first.
- ALTA: https://github.com/kyky2347/ALTA — separar pesquisa, hipótese, decisão e acompanhamento; manter a proveniência de fontes e revisões.
- TradingAgents: https://github.com/vonhatthinh/TradingAgents — especialização de agentes, divisão de responsabilidades e pesquisa de estratégias. Validar código, licença e dependências antes de qualquer adoção.

As referências acima são inspiração para revisão, não dependências aprovadas.

## Arquitetura-alvo

```text
Providers read-only
 -> adaptadores por mercado
 -> normalização + freshness/quality gates
 -> snapshot imutável
 -> estratégia/pesquisa/agentes
 -> revisor cético independente
 -> motor determinístico de risco (veto final)
 -> proposta paper idempotente
 -> simulador com custos
 -> ledger append-only e métricas
 -> revisão posterior e evidência
```

LEVI coordena, mas não aprova risco por linguagem natural. EU SOU fornece pesquisa, benchmarks e incerteza, mas não envia ordens. RH Adonai mantém papéis e aprovações com escopo explícito.

## Contrato comum

Cada adaptador retorna schema versionado com mercado, provedor, instrumento, moeda, observed_at/received_at em UTC, bid/ask/last/volume quando aplicável, precisão/unidade, referência da fonte, frescor e motivos de rejeição. Logs nunca contêm segredos, dados de conta ou ordens reais.

- **Cripto:** tick/step size, taxas, funding, limites de API e falha do provedor.
- **Forex:** bid/ask, pip/lot, moeda base/termo, spread, rollover, sessões e feriados.
- **B3:** calendário, leilões, proventos, ajustes, atrasos e licença da fonte.
- **Internacional:** calendário por bolsa, corporate actions, moeda, timezone, custos e divergência entre provedores.

## Guardas obrigatórios

1. Paper-only imposto pelo servidor; nenhum parâmetro HTTP habilita modo real.
2. Cotação vencida, schema inválido, provedor indisponível ou relógio inconsistente bloqueiam propostas.
3. Idempotência impede duplicidade; retry não pode criar duas propostas.
4. Limites de exposição, concentração, drawdown, liquidez e perda diária; veto de risco não contornável.
5. Backtest point-in-time, walk-forward, baseline e custos realistas; sem look-ahead.
6. Ledger append-only com hash encadeado e testes de adulteração.
7. Métricas de frescor, latência, falhas, rejeições e divergência de execução simulada.
8. Kill switch e recuperação testados; reinício não apaga histórico.
9. Segredos fora do Git, logs sanitizados e privilégios mínimos.

## Sequência

A. Inspecionar runtime executável, dependências, entrypoint, configuração, RLS/grants e cadeia de auditoria.  
B. Fixar contratos, fixtures determinísticas e testes sem dependência de APIs externas.  
C. Validar uma mesa por vez, com casos de sucesso e falha.  
D. Adicionar backtest temporal, custos, veto de risco e revisão cética.  
E. Validar LEVI → Trade → EU SOU → RH/auditoria com correlation ID e evidência persistida.  
F. Release reproduzível com CI, SBOM, secret scan, rollback e revisão humana.

## Limites

A documentação pública não prova segurança, rentabilidade ou adequação. Antes de incorporar código/dependências, revisar licença, manutenção, cadeia de suprimentos, permissões, tráfego de rede e testes. O runtime executável do Adonai Trade permanece pendente de inspeção e nenhuma integração é promovida por este documento.
