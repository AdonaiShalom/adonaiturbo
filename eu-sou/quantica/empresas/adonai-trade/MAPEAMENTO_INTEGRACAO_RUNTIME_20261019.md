# Mapeamento de integração EU SOU → runtime Adonai Trade
Data: 2026-10-19
Branch de proposta: `work/adonai-trade-eu-sou-mainline-20261019`
Estado: análise estática do conteúdo de `main`; nenhuma alteração no runtime principal.

## O que já existe em main
- `adonai-trade/runtime/policy-gate.cjs`: contrato versionado `1.0.0`, UUIDs para tarefa/correlação, modo paper obrigatório, frescor/proveniência de dados, ação `analysis_only`/proposta paper e gate de risco independente.
- `adonai-trade/runtime/market-desks.cjs`: quatro mesas B3, Internacional, Forex e Cripto, todas com `execution_enabled=false`; configuração do provedor não é apresentada como prova de cotação.
- `adonai-trade/runtime/market-adapters.cjs`: adaptadores de cotação read-only; valida timestamp, preço, idade máxima, tamanho de resposta e timeout.
- `adonai-trade/runtime/audit-ledger.cjs`: grava evento de auditoria no Supabase e verifica a cadeia após append; falha de auditoria bloqueia o resultado.
- `adonai-trade/runtime/integration-status.cjs`: expõe os endpoints configurados de LEVI e EU SOU como `not_verified`, sem fingir conectividade.
- `adonai-trade/package.json`: suíte de testes do runtime e dos contratos; o CI do PR #14 foi aprovado conforme seu registro de integração.

## Lacuna exata identificada
O runtime já tem um policy gate operacional para envelopes de tarefa e propostas em modo paper. A implementação `eu-sou/.../decision-gate.cjs` deste PR é um segundo contrato de referência mais detalhado para probabilidades, incerteza, hashes de modelo/dataset, validação, custos e contexto confiável. Não se deve instalar dois gates independentes que possam divergir.

A integração correta é mapear os campos do EU SOU para o contrato existente e, após revisão, incorporar apenas as verificações ausentes ao `adonai-trade/runtime/policy-gate.cjs`, com regressão dos testes existentes. A decisão de proposta continua não sendo uma ordem; execução real permanece fora de escopo.

## Campos que precisam de mapeamento
| Conceito EU SOU | Runtime existente | Gap / regra de integração |
|---|---|---|
| `decision_id` | `task_id` + `correlation_id` | Definir idempotência persistida; não tratar os IDs como intercambiáveis sem contrato |
| Mercado/instrumento/horizonte | `market` + `payload` | Formalizar símbolo, venue, moeda e horizonte no schema versionado |
| Fontes, licença, timestamp e hash | `data_context` | O runtime exige provider, observed_at e data_quality; ainda não valida hash de conteúdo/licença permitida de modo completo |
| Probabilidade calibrada/incerteza | `scientific_context` aceita method/baseline/uncertainty/evidence_refs | Exigir evento, horizonte, evidência verificável e status de calibração confiável antes de expor probabilidade |
| Modelo/dataset/benchmark | `scientific_context` parcial | Adicionar versões/hashes e validation_run_id com checagem confiável, não apenas strings preenchidas |
| Spread, tarifas, slippage, carry/funding | `payload` atualmente genérico | Definir campos e moeda por mercado; impedir aprovação quando os custos requeridos não estão disponíveis |
| Risco | `input.risk` independente e checks pass | Garantir limites confiáveis completos e registrar perfil/estado de portfólio usado |
| Auditoria | `audit-ledger.cjs` e RPC de verificação | Testar cadeia inválida, falha de append, concorrência e reinício; manter falha fechada |
| Quântico/nanoquântico | Não é autoridade própria no runtime | Resultado é evidência experimental comparada com baseline clássico; nunca bypass do gate |
| LEVI/RH | endpoints listados como `not_verified`; RH tem API autenticada | Fazer chamada autenticada ponta a ponta com correlation_id, timeouts, idempotência e erros explícitos |

## Ordem segura de integração
1. Preservar o runtime atual e usar o PR #20 como especificação/testes de referência.
2. Adicionar fixtures ao contrato existente e adaptar `contracts/v1/test-policy-gate.cjs` antes de modificar comportamento.
3. Estender `validateEnvelope/evaluatePolicy` para campos científicos/custos com bloqueio por padrão; nenhuma chamada financeira externa.
4. Rodar a suíte completa `npm test` em cópia isolada/CI, incluindo runtime HTTP, audit ledger, quatro adaptadores, RH e menu sede 3D.
5. Executar testes Supabase de leitura/escrita com credenciais restritas em ambiente controlado; não usar segredos no navegador.
6. Só então preparar um PR de integração ao runtime, separado do PR de pesquisa, e testar a interface original da sede 3D quando o HTML original estiver disponível.

## Limite de evidência
Esta é revisão estática do repositório conectado. Não confirma que o processo local na porta 3100 ou 3107 está ativo, que os endpoints locais de LEVI/EU SOU respondem, que as chaves dos provedores funcionam, nem que o HTML original está instalado. Nenhuma ordem real foi enviada.