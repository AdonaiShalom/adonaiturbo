# Adonai Trade — mesas de operações

Esta pasta contém a documentação versionada para a evolução profissional das quatro mesas do Adonai Trade.

- [Auditoria e arquitetura das quatro mesas](./ARQUITETURA_E_AUDITORIA.md)
- [Plano de profissionalização inicial](../ADONAI_TRADE_PROFISSIONALIZACAO.md)

## Estado da entrega

- Documentação arquitetural: registrada na branch de trabalho.
- Código operacional das mesas/RH: ainda depende de auditoria da cópia local real.
- Migrações Supabase: não aplicadas nesta etapa.
- Ordens reais: fora do escopo até existir autenticação, controles de risco, auditoria e aprovação explícita.
- Sala 3D: requisito definido; não declarar operacional até conectar eventos reais do backend.

## Organização-alvo para código, após auditar o existente

Não criar duplicatas se módulos equivalentes já existirem.

- `src/desks/national/` — B3 / mercado nacional
- `src/desks/international/` — mercados internacionais
- `src/desks/crypto/` — criptoativos
- `src/desks/forex/` — moedas
- `src/orchestration/levi/` — delegação e correlação de tarefas
- `src/science/eu-sou/` — adaptador de cálculo e evidências científicas
- `src/risk/` — limites independentes e bloqueios
- `src/observability/` — eventos, saúde e auditoria
- `src/ui/operations-room/` — painel e cena 3D alimentados por estado real
- `test/` — testes unitários, integração, regressão e smoke

A árvore é uma proposta, não uma afirmação sobre a estrutura local atual. Primeiro inspecionar `server.js`, `lib/rh.js`, `index.html`, testes e `package.json`; depois adaptar a estrutura ao código existente.
