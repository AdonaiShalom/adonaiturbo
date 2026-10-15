# Adonai Trade — matriz de integrações e plano de engenharia

**Data da verificação:** 2026-10-15  
**Objetivo:** organizar integrações com evidências, sem misturar Adonai Trade, Adonai Turbo, EU SOU, LEVI e PSM Grupo Market.

## Regras de arquitetura

- Adonai Trade é um módulo independente; a porta local documentada é `3100`.
- Adonai Turbo permanece na porta `3000`.
- PSM Grupo Market permanece isolado, com serviço Render próprio. Não reutilizar seu serviço, repositório, variáveis ou banco para publicar o Trade.
- Integrações EU SOU ↔ LEVI ↔ Trade devem usar contratos HTTP autenticados, versionados, auditáveis e com timeout.
- Alertas do TradingView são sinais de entrada; não autorizam, por si só, execução automática de ordens.
- Nunca colocar credenciais, tokens ou segredos em commits, logs, payloads ou documentação.

## Estado confirmado por ferramentas

| Componente | Evidência observada | Estado correto |
|---|---|---|
| GitHub | Repositório `AdonaiShalom/adonaiturbo` acessível. A pasta `adonai-trade/` contém somente este README de módulo no branch principal consultado. | Conectado; código executável do Trade ainda não está versionado nessa pasta. |
| Supabase | Projeto `adonaiturbo` em estado `ACTIVE_HEALTHY`; schema `adonai_trade` tem tabela `integration_status`, RLS habilitado e zero registros. | Banco acessível; estado de integração ainda não registrado. |
| EU SOU | Edge Function `eu-sou-knowledge-search` ativa com verificação JWT habilitada. | Componente publicado; fluxo completo Trade → EU SOU não foi testado. |
| LEVI | Existe schema `levi`; documentos do repositório registram testes anteriores da rota de orquestração. | Presença confirmada; contrato ponta a ponta Trade ↔ LEVI pendente. |
| Render | Workspace consultado lista somente `psm-grupo-market`, ligado ao repositório `psmgesso-lang/psm-grupo-market`. | Render conectado; serviço exclusivo do Trade ainda não existe nesse workspace consultado. |
| TradingView | O webhook local do Trade passou nos testes de autenticação e validação anteriormente registrados, mas não foi recebida confirmação de alerta real externo. | Endpoint local testado; entrega pública HTTPS pendente. |
| ChatGPT/GPT | A conexão ChatGPT está ativa nesta sessão. | Isso não prova que exista uma chave/API GPT configurada no servidor do Trade. |

## Riscos e cuidados identificados

1. A tabela `adonai_trade.integration_status` está vazia; não há registro operacional persistido de `trade_server`, `github`, `eu_sou` ou `levi`.
2. O linter de segurança reporta tabelas com RLS habilitado sem políticas. Isso pode ser a postura privada intencional; **não** adicionar políticas genéricas nem expor tabelas de negociação sem definir papéis, propriedade dos dados e permissões necessárias.
3. O repositório principal é usado por outras partes do Adonai Turbo. Alterações de código do Trade devem ser isoladas por pasta/branch e não devem alterar a configuração de produção do PSM.
4. O webhook precisa responder rapidamente. A documentação do TradingView indica limite de aproximadamente 3 segundos, aceita portas 80/443 e exige URL pública HTTPS; `localhost` não é acessível pelo TradingView.
5. Não executar ordens reais neste ciclo. Primeiro validar recebimento, autenticação, idempotência, auditoria e modo de simulação.

## Sequência recomendada de trabalho

### A. Preparar o código executável
- Trazer o conteúdo real de `C:\AdonaiTurbo\AdonaiTrade` para uma branch isolada, depois de revisar arquivos e garantir que nenhum `.env`, chave, token, dado de usuário ou log sensível entre no Git.
- Preservar os testes já aprovados do webhook: segredo incorreto → 401; alerta válido → 202; duplicado → 409; JSON inválido → 400; tipo de conteúdo incorreto → 415.
- Adicionar CI para instalar dependências, verificar sintaxe e executar testes em cada PR.

### B. Publicar no Render, sem tocar no PSM
- Criar um novo serviço web somente quando o código executável estiver presente no repositório correto.
- Definir root directory/build/start commands próprios do Trade, health check e variáveis secretas no painel do Render.
- Não reutilizar nem modificar o serviço `psm-grupo-market`.
- Fazer deploy em modo de observação/simulação e testar health check antes de apontar alertas reais.

### C. Completar as integrações
- TradingView → endpoint HTTPS público → validação de segredo, esquema, tamanho, timestamp/idempotência → registro de auditoria → resposta rápida.
- Trade → EU SOU: contrato versionado para consulta de conhecimento/recomendações, timeout, correlação e proveniência.
- Trade → LEVI: endpoint autenticado, escopo explícito de comandos e trilha de auditoria.
- GPT: usar somente API oficial e credenciais server-side se o módulo realmente precisar de inferência; não confundir ChatGPT conectado nesta sessão com API configurada no servidor.
- Supabase: definir políticas por tabela e papéis antes de permitir acesso via cliente; manter dados de negociação privados por padrão.

### D. Critérios de aceite
- CI verde e testes repetíveis.
- Health check HTTPS público do serviço exclusivo do Trade.
- Testes de webhook externos com alerta de teste, sem ordem financeira.
- Verificação de assinatura/segredo, rejeição de payload inválido, deduplicação e auditoria.
- Testes autenticados e negativos para os contratos LEVI/EU SOU.
- Registro de estado de cada integração baseado em verificações reais, com data e evidência.
- Revisão de segurança do Supabase sem políticas públicas genéricas.
- Documentação atualizada antes de qualquer promoção para produção.

## Limitação desta alteração

Este documento registra o diagnóstico e o plano. Não publica o serviço, não altera tabelas/políticas do Supabase, não cria credenciais e não ativa execução de ordens. O código executável local do Trade não estava presente na pasta `adonai-trade/` do GitHub no momento da verificação; por isso, não seria seguro criar um serviço Render apontando para essa pasta ainda.
