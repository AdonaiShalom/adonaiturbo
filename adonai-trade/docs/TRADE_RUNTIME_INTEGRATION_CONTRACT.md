# Adonai Trade — contrato de integração do runtime

Status: contrato de engenharia; não prova que o runtime está integrado.
Escopo: serviço Trade, aba existente do Adonai Turbo, LEVI, EU SOU, RH e auditoria.
Modo permitido nesta etapa: paper trading. Nenhuma ordem real.

## 1. Separação de serviços e interfaces

- Adonai Turbo: manter o serviço existente e a aba Trade existente; não substituir a página inteira.
- Adonai Trade: serviço separado na porta 3100, conforme configuração local validada.
- PSM Grupo Market: projeto separado; não alterar porta, arquivos, rotas nem configuração como parte da integração Trade.
- A porta e a origem reais da aba Turbo devem ser confirmadas no ambiente de execução antes da alteração do HTML. Não assumir que uma URL de desenvolvimento equivale à URL final.

## 2. Contrato mínimo HTTP

### Health/readiness
- `GET /health`: informa que o processo está vivo.
- `GET /ready`: informa prontidão apenas se as dependências obrigatórias e a configuração estiverem válidas.
- Respostas incluem `service`, `version`, `timestamp` e `mode`.
- Readiness não deve retornar pronto se o ledger/auditoria não puder persistir, se a configuração estiver incompleta ou se o modo de segurança não puder ser determinado.

### Proposta de análise (não é ordem)
- Endpoint de proposta deve validar o corpo contra schema versionado.
- Campos mínimos: `schema_version`, `correlation_id`, `market`, `instrument`, `observed_at`, `source`, `strategy_id`, `risk_context`.
- A resposta deve separar claramente `analysis`, `risk_decision`, `evidence` e `execution_mode`.
- `execution_mode` deve permanecer `paper`; este contrato não autoriza criação de ordem real.
- Requisição inválida, timeout, fonte vencida, resposta inválida de dependência ou falha de auditoria devem falhar fechadas: sem proposta executável e sem efeito colateral de negociação.

## 3. Ledger Supabase do runtime (implementação isolada, migração pendente)

- Migration proposta: `supabase/migrations/20261018100000_runtime_audit_events.sql`.
- Adaptador: `runtime/audit-ledger.cjs`; usa `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` apenas no processo servidor, TLS para endpoints remotos, timeout de 4 segundos e insert-only na API do PostgREST.
- A migration cria `adonai_trade.runtime_audit_events`, ativa RLS, restringe o uso do schema a `service_role`, remove grants da tabela de `public`/`anon`/`authenticated`, concede `SELECT`/`INSERT` a `service_role`, restringe a função do trigger e bloqueia `UPDATE`/`DELETE` por trigger.
- A migration **não foi aplicada** ao projeto conectado. Antes da aplicação, revisar grants de schema, exposição do schema no PostgREST, política de retenção e auditoria operacional. Nunca expor a chave service-role ao navegador.
- `/ready` só retorna 200 depois de conseguir consultar o ledger. A avaliação só retorna 200/422 depois de persistir o evento; falha ou ausência do ledger retorna 503 sem executar ordens.

## 4. Correlação e trilha de auditoria

Um `correlation_id` gerado/validado na entrada deve atravessar LEVI → Trade → EU SOU → motor de risco → simulador → ledger. Cada evento persistido deve incluir:
- timestamp UTC;
- serviço e versão;
- correlation_id e identificador de evento;
- origem/proveniência dos dados e observed_at;
- decisão e razão;
- hash encadeado/versão da cadeia quando suportado;
- resultado de persistência.

Eventos anteriores são append-only. Correção gera novo evento que referencia o anterior; não se sobrescreve evidência silenciosamente.

## 5. Limites obrigatórios do motor de risco

O motor de risco é independente das equipes que sugerem estratégias. Nenhuma decisão de LEVI, RH, modelo quantitativo ou mesa pode contornar veto de risco.

Antes de aceitar uma proposta em paper, validar pelo menos:
- frescor dos dados e timestamp;
- limites de exposição, concentração e perda;
- custos, spread, taxas, funding e slippage conforme o mercado;
- liquidez, precisão de preço/quantidade e limites do instrumento;
- idempotência/replay e chave de operação;
- kill switch e estado de pausa;
- persistência de auditoria.

Se algum limite não puder ser calculado, a decisão é rejeitar ou colocar em quarentena, nunca presumir risco zero.

## 6. Quatro mesas e fixtures offline

Cada mesa deve possuir fixtures determinísticas versionadas, sem depender de APIs externas durante unit tests.

- CRYPTO: precisão por ativo, limites do venue, taxas, funding, spread e frescor.
- FOREX: bid/ask, pip/lot, conversão, sessões, feriados, rollover e slippage.
- B3: calendário, leilões, ajustes/proventos, atrasos e proveniência/licença dos dados.
- INTERNATIONAL: timezone UTC, moeda, calendário de cada bolsa, corporate actions, custos e divergência de fontes.

Nenhuma fixture deve ser apresentada na interface como cotação ao vivo.

## 7. Sede 3D e estado real

A sede 3D deve consumir uma API de estado observável, não inventar atividade localmente. Cada agente/equipe apresentado como ativo deve estar associado a:
- agent_id/equipe e função;
- estado (idle, working, blocked, failed, completed);
- tarefa e work_key;
- started_at/updated_at;
- correlation_id quando aplicável;
- origem do estado e evidência associada.

Animação decorativa deve ser identificada como visualização, não como execução real. Sem resposta do serviço, a interface mostra desconectado/desatualizado, nunca “operacional”.

A integração deve ser incorporada somente à aba Trade já existente, com backup do arquivo anterior, diff revisável e rollback testado. Não trocar o HTML principal inteiro nem remover funções de outras abas.

## 7. Critérios de aceitação ponta a ponta

1. Serviço Trade inicia na porta configurada e health/readiness refletem o estado real.
2. Aba Trade abre o serviço sem quebrar outras abas do Turbo nem interferir no PSM.
3. Uma requisição de teste produz correlation_id consistente em todos os serviços disponíveis.
4. EU SOU retorna proveniência/referência de evidência ou declara indisponibilidade; nunca fabrica citação.
5. O motor de risco aprova e rejeita fixtures determinísticas conforme esperado.
6. Falha de dependência, dados vencidos, duplicidade e falha de auditoria não produzem proposta executável.
7. Ledger/auditoria persiste os eventos e os testes de adulteração/replay/concorrência passam.
8. As quatro mesas passam seus testes offline.
9. A sede 3D reflete o estado de backend, incluindo estados blocked/failed/desconectado.
10. Testes executam em ambiente descartável, sem apagar dados operacionais.
11. Backup e rollback são demonstrados.
12. Release candidato é reproduzível, com inventário de dependências, scan de segredos e hashes.

## 8. Evidência e status

Uma tarefa só pode virar `verified` com evidência técnica reproduzível, revisada, contendo work_key, commit/hash, ambiente, comando, exit code, timestamp UTC, resultado e revisor. Documento, migration criada ou CI de um subsistema não prova integração ponta a ponta.

Estado atual deste documento: requisitos formalizados; integração runtime ainda não comprovada. Não atualizar o status Supabase para verified apenas pela existência deste contrato.

## 9. Próxima ação executável

Obter e inspecionar a fonte executável real e o protótipo 3D original, gerar inventário/hash e executar os gates em cópia isolada. Em seguida, implementar a integração na aba existente e comprovar a sequência ponta a ponta. Manter PR não mesclado até todos os gates obrigatórios passarem e haver revisão humana.
