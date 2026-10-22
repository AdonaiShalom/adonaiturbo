# Adonai Trade — gates de qualidade e liberação

## Princípio

Uma tarefa só pode ser declarada concluída quando o critério de aceite é satisfeito e existe evidência reproduzível. Documentação, tabela criada ou teste de um subsistema não provam que o sistema inteiro está operacional.

## Gates obrigatórios

### G0 — Integridade e segurança (bloqueante)
- Reproduzir o problema histórico da cadeia em ambiente isolado; preservar a origem.
- Testar hash/assinatura, adulteração, replay, duplicidade e concorrência.
- Revisar grants, RLS, schemas expostos, views, funções `SECURITY DEFINER` e secrets.
- Demonstrar testes positivos e negativos por papel.
- Nenhuma ordem real habilitada.

### G1 — Fonte executável e build
- Revisar o ZIP/pacote real e gerar inventário, hashes e lista de dependências.
- Confirmar entrypoint, configuração e portas; manter Turbo 3000, Trade 3100 e PSM 3001 separados.
- Fazer secret scan sem publicar valores secretos.
- Rodar testes em cópia descartável; proibir smoke tests que limpem dados reais.
- Fixar versão do runtime e reproduzir instalação/build a partir de zero.

### G2 — Contratos e integração
- Contratos de request/response versionados, validação de schema e timeout.
- `correlation_id` atravessa LEVI → Trade → EU SOU e aparece na auditoria.
- Falha, timeout, resposta inválida ou dado vencido falham fechados; nenhuma falha vira ordem.
- Estado de integração só muda após teste ponta a ponta com timestamp e artefato.

### G3 — Quatro mesas
- Cripto: precisão por ativo, limites da exchange, taxas, funding e frescor de preço.
- Forex: bid/ask, pip/lot, conversão, spread, sessões, feriados, rollover e slippage.
- B3: calendário, leilões, ajustes corporativos, proventos, atrasos e licença dos dados.
- Internacional: UTC, moedas, calendários por bolsa, corporate actions, custos e divergência de provedores.
- Fixtures determinísticas versionadas; não depender de API externa para unit tests.

### G4 — Motor quantitativo e risco
- Sem look-ahead/data leakage; splits temporais e walk-forward.
- Baseline simples comparável; taxas, spread, slippage e funding incluídos.
- Drawdown, exposição, concentração, liquidez, limites por ativo/mesa e kill switch.
- Propostas não podem contornar veto do motor de risco.
- Paper trading antes de qualquer decisão de mudança de modo.

### G5 — Release reproduzível
- CI verde na revisão exata; testes unitários, contratos, segurança e migrations.
- SBOM/inventário de dependências, scan de segredos e hashes do artefato.
- Backup testado, plano de rollback e procedimento de incidentes.
- Revisão humana do diff e aprovação explícita antes de merge/deploy.

## Evidência mínima por tarefa

- ID estável (AT-xxx), origem e timestamp.
- Commit SHA ou hash do artefato.
- Comando/teste executado, ambiente e código de saída.
- Resultado observado, incluindo falhas.
- Revisor e decisão.
- Para integração: request/response sanitizados e correlation ID.
- Para mercado: fixture ou snapshot permitido, timestamp da cotação e status de atraso.

## Estado atual

- O registro de backlog e evidências está criado no Supabase.
- Guardas de integridade e testes de regressão estão versionados.
- A validação transacional dos guardas foi executada diretamente no Supabase e revertida após os testes.
- CI para validar documentação/IDs está sendo introduzido; até o workflow executar verde, não declarar o gate CI aprovado.
- O runtime local ainda precisa ser inspecionado; as integrações continuam pendentes.
