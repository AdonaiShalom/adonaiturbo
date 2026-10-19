# Adonai Trade — relatório de auditoria inicial e plano de avanço

**Data:** 2026-10-16  
**Status:** auditoria documental e de metadados concluída parcialmente; execução local e integração ponta a ponta ainda não comprovadas.  
**Branch:** `work/adonai-trade-professionalization-20261016`  
**Escopo:** quatro mesas (B3, Internacional, Cripto e Forex), RH, LEVI, EU SOU, Supabase, risco, pesquisa open source e sala de operações 3D.

## 1. Evidências observadas

### GitHub
- Repositório conectado: [AdonaiShalom/adonaiturbo](https://github.com/AdonaiShalom/adonaiturbo).
- A pasta `adonai-trade/` contém `README.md` com a separação de portas documentada: Trade `:3100`, Turbo `:3000`, PSM `:3001`.
- A consulta a `adonai-trade/package.json` e `adonai-trade/server.js` no branch principal retornou 404. Portanto, o código executável local do Trade **não está comprovadamente publicado nesse caminho**. Não inferir que o projeto local está ausente; a evidência é apenas sobre o conteúdo acessível no GitHub.
- O branch de trabalho já contém `docs/ADONAI_TRADE_PROFISSIONALIZACAO.md` e `docs/mesas-operacoes/ARQUITETURA_E_AUDITORIA.md`. Este relatório complementa esses documentos sem alterar código de execução.

### Supabase `adonaiturbo`
- Projeto consultado: `qyeduepihkxgrwotqnhb`, estado `ACTIVE_HEALTHY`.
- O schema `adonai_trade` contém `integration_status` (4 registros); ainda não há tabelas de tarefas de mesa, propostas, ordens simuladas ou eventos de sala nesse schema.
- Os quatro componentes registrados são `levi`, `trade_server`, `eu_sou` e `github`. Os estados lidos são registros de integração anteriores, não health checks em tempo real. Os detalhes registram os testes ponta a ponta como não verificados; GitHub está marcado como degradado para publicação de código executável.
- O schema `rh_adonai` contém 12 funções lógicas de RH, 60 atribuições, cinco empresas, cinco recomendações para Adonai Trade em `pending_review` e zero `learning_runs`. Essas linhas descrevem a estrutura compartilhada do RH no Supabase; **não comprovam que os agentes estão executando processos ou que esse schema seja o RH canônico da aplicação local Trade**.
- A recomendação do RH já registrada propõe 36 funções lógicas: 4 mesas × (3 traders + 4 analistas) = 28, mais 8 funções compartilhadas. O próprio registro declara que é desenho, não implementação validada.
- O advisory de segurança reportou 52 achados informativos `rls_enabled_no_policy no projeto. Para `adonai_trade.integration_status`, a consulta de privilégios mostrou SELECT negado a `anon` e `authenticated`, permitido a `service_role`. A tabela tem RLS ligado e não possui política. Isso parece negar acesso direto de clientes, mas ainda é necessário testar a autenticação e o acesso do backend e avaliar os grants completos antes de qualquer mudança.
- Em `eu_sou.knowledge_chunks`, há uma política de SELECT para `authenticated` limitada a status `curated`, `reviewed` e `validated`. Preservar esse limite e não expor fontes ou registros científicos indiscriminadamente.
- Migrações existentes incluem `rh_adonai_core_and_company_scoped_audit` e `adonai_trade_integration_status_v1`. Não criar tabelas duplicadas nem aplicar DDL antes de revisar as migrações e as políticas completas.

## 2. Pesquisa técnica de repositórios públicos

A revisão abaixo é uma análise seletiva de código/documentação pública, não uma auditoria linha a linha de todos os repositórios nem autorização para copiar dependências.

| Referência | Evidência examinada | Aplicação recomendada ao Adonai Trade | Limite |
|---|---|---|---|
| [Freqtrade](https://github.com/freqtrade/freqtrade) | Configuração de exemplo define `dry_run: true`, limite de posições, parâmetros de entrada/saída e livro de ordens. | Manter paper trading como padrão; registrar custos, slippage, timeout, liquidez e limites antes de comparar estratégias. | Não copiar configuração nem ativar corretora por padrão. |
| [QuantConnect LEAN](https://github.com/QuantConnect/Lean) | `MaximumDrawdownPercentPortfolio` é um modelo de risco separado que acompanha pico da carteira e exige reinicialização manual após disparo. | Separar o controle determinístico de risco da geração de sinal; criar travas e reset explícito após bloqueio. | Definir limites reais com responsável humano e testes negativos. |
| [TradingAgents](https://github.com/TauricResearch/TradingAgents) | Lógica de fluxo alterna analistas Bull/Bear e analistas de risco agressivo/conservador/neutro com número máximo de rodadas. | Debates limitados, crítica adversarial e síntese com evidências podem melhorar a qualidade da análise por mesa. | Debate de LLM não é prova científica, autorização de ordem nem substituto do motor de risco. |
| [CCXT](https://github.com/ccxt/ccxt) | Biblioteca multi-exchange para APIs de cripto; oferece uma possível camada de adaptação. | Avaliar para a mesa Cripto após escolher exchanges e verificar suporte, versão, rate limits, tratamento de erros e permissões mínimas. | Não adicionar dependência sem análise de licença, supply chain e testes em sandbox. |
| [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) | Biblioteca de gráficos web; o LICENSE consultado é Apache 2.0. | Candidato para gráficos profissionais em 2D dentro dos painéis de cada mesa; manter atribuição e avisos exigidos pela licença. | É visualização, não feed de mercado, corretora, estratégia ou motor de ordens. |
| [Qiskit Algorithms](https://github.com/qiskit-community/qiskit-algorithms) | O README alerta que o projeto não é mais oficialmente suportado pela IBM. | Usar o EU SOU para comparar métodos quânticos/híbridos com baselines clássicos e registrar limitações de manutenção. | Não assumir vantagem financeira quântica nem adotar automaticamente uma dependência não suportada. |

### Regras de engenharia derivadas da revisão
1. **Dados primeiro:** cada cotação tem fonte, instrumento, moeda, timestamp UTC, timezone de origem, frequência, unidade, atraso/frescor e hash quando apropriado.
2. **Backtest honesto:** custos, spread, slippage, latência, eventos corporativos, sobrevivência, look-ahead e separação temporal treino/validação/teste.
3. **Risco independente:** uma proposta de LLM nunca vira ordem diretamente. Um componente determinístico pode bloquear a operação e o bloqueio é auditado.
4. **Adaptação por mercado:** B3, internacional, cripto e Forex não compartilham pressupostos de horário, precisão, liquidez, financiamento, calendário ou execução.
5. **Dependências sob controle:** licença, versão fixada, changelog, testes, vulnerabilidades e plano de atualização antes de integrar qualquer biblioteca.

## 3. Hierarquia e mandato das quatro mesas

### Camada de governança
Responsável humano define mandato, limites, capital autorizado, tolerância a risco e aprova alterações críticas.

### Camada de orquestração
- **LEVI:** recebe pedidos, encaminha tarefas por competência, controla prazos, correlaciona resultados e apresenta síntese auditável.
- **EU SOU:** pesquisa fontes, executa cálculos e simulações, propõe hipóteses e registra método, baseline, incerteza e limitações.
- **Risco independente:** valida limites e pode negar qualquer proposta. Não responde ao mesmo agente que produziu o sinal.
- **Dados e operações:** validam feeds, qualidade, relógios, reconexão, estado de ordens e reconciliação.
- **Auditoria/compliance/segurança:** revisa evidências, permissões, trilha de eventos, licenças e incidentes.
- **RH/qualificação:** mantém competências, avaliações, status e permissões graduais.

### Mandato por mesa
- **B3:** dados de bolsa, liquidez, leilões, corporate actions, custos/emolumentos, fundamentos, eventos e risco por ativo/setor.
- **Internacional:** fuso e feriados por bolsa, moeda-base, conversão FX, fundamentos/setores, macro global e regras da jurisdição.
- **Cripto:** spot versus derivativos, order book, profundidade, funding, liquidação, rate limits, risco de exchange/custódia e API sem permissão de saque.
- **Forex:** fonte e frequência de cotação, bid/ask, spread, swap/rollover, bancos centrais, calendário macro e exposição líquida por moeda.

O número final de agentes físicos deve depender do inventário do RH, custo e telemetria. As 36 funções são metas de desenho, não uma afirmação de 36 processos ativos.

## 4. Contrato de trabalho LEVI ↔ EU SOU ↔ mesa

Cada tarefa deve carregar pelo menos:
- `correlation_id`, `desk`, `task_type`, solicitante, prazo e timestamp UTC;
- instrumento e dados de entrada com fonte, unidade, timezone, frescor e qualidade;
- hipótese, método, versão de modelo/software, parâmetros, baseline e limitações;
- resultado numérico, incerteza, fontes e referências de evidência;
- decisão de risco: aprovado, bloqueado ou requer revisão, com motivo;
- estado da simulação e responsável pela revisão.

Fluxo: pedido → LEVI seleciona competências → analistas consultam dados → EU SOU calcula/pesquisa → revisão independente → motor de risco → paper trading → reconciliação → LEVI apresenta relatório. Timeout, dado vencido, resposta inválida, falta de fonte ou risco excedido deve produzir falha segura, nunca aprovação implícita.

## 5. Sala de operações 3D profissional: especificação funcional

### Espaços
1. **Centro de comando LEVI:** fila de tarefas, dependências, falhas e correlações.
2. **Sala B3**, **Sala Internacional**, **Sala Cripto** e **Sala Forex:** dados, análises, hipóteses, riscos e resultados de simulação por mercado.
3. **Laboratório EU SOU:** fontes, cálculos, benchmarks, versões, incerteza e estado dos experimentos.
4. **Sala de risco independente:** exposição, limites, bloqueios, drawdown e kill switch de simulação.
5. **Operações e dados:** saúde de integrações, latência, qualidade/frescor de feed e reconciliação.
6. **Auditoria:** linha do tempo imutável de tarefas, decisões, falhas e aprovações.

### Regra de verdade visual
Avatares e luzes representam somente registros reais do RH e eventos persistidos. Cada agente mostra estado, tarefa, mesa, último heartbeat, fonte e `correlation_id`. Sem heartbeat, API ou evento recente, a interface mostra **Offline / Sem evidência recente**; não anima uma equipe como se estivesse trabalhando.

### Implementação visual por etapas
- Começar com uma vista profissional responsiva: mapa 3D estilizado, salas clicáveis e painel tabular acessível equivalente.
- Usar o motor gráfico apenas para apresentação. KPIs, tarefas, alertas e status vêm da API; não criar métricas decorativas.
- Preferir SSE/WebSocket somente se já houver autenticação e infraestrutura robusta; caso contrário, polling limitado com timestamps, tratamento de desconexão e reconciliação.
- Usar gráficos financeiros 2D dentro das salas; não tentar transformar o gráfico em fonte de dados.
- Testar estados reais: ocioso, trabalhando, aguardando revisão, bloqueado, erro, offline e reconectando.
- Aceite visual: cada animação tem evento de origem; ao desligar API, todos os estados mudam para indisponível; a tabela acessível mostra os mesmos dados do cenário.

**Bloqueio atual:** a fonte executável do Trade não está comprovadamente publicada em `adonai-trade/`; por isso, não afirmar que esta sala 3D foi integrada ou que os agentes estão trabalhando. Primeiro reconciliar o código local com o repositório e definir o contrato real de eventos.

## 6. Backlog de implementação com critérios de aceite

### P0 — Fonte e segurança
- [ ] Receber/inspecionar a árvore real do projeto local, `package.json`, `server.js`, `lib/rh.js`, rotas, configurações, testes e status Git.
- [ ] Revisar `test/smoke.js` em cópia isolada, pois o histórico de inspeção registrou possível remoção de arquivos de dados durante o teste.
- [ ] Fazer secret scan sem imprimir valores; verificar autenticação, CORS, validação de payloads, limites de requisição e logs.
- [ ] Confirmar qual RH é canônico no runtime: módulo local do Trade versus schema compartilhado `rh_adonai`.
- **Aceite:** inventário reproduzível, cópia de segurança, nenhum segredo exposto e testes não destrutivos.

### P1 — Contratos e RH
- [ ] Inventariar competências e permissões reais; manter agentes não qualificados sem autoridade operacional.
- [ ] Implementar contrato versionado LEVI/EU SOU com autenticação, timeout, validação de esquema, correlação e auditoria.
- [ ] Testar sucesso, não autorizado, timeout, resposta inválida, duplicidade/idempotência e indisponibilidade.
- **Aceite:** evidência de teste de ponta a ponta; nenhum atalho de LLM ao risco.

### P2 — Dados e risco por mesa
- [ ] Definir adaptadores e esquema de dados por mercado.
- [ ] Definir regras determinísticas de frescor, exposição, limites, drawdown, custos, idempotência e parada de emergência.
- [ ] Testar cenários negativos e recuperação/reconciliação.
- **Aceite:** cada regra de bloqueio demonstrada por teste.

### P3 — Paper trading
- [ ] Validar dados, custo, spread, slippage, latência e resultados fora da amostra.
- [ ] Separar resultados por mesa e consolidar correlação/exposição de portfólio.
- **Aceite:** relatório reproduzível e aprovação independente por mesa.

### P4 — Sala 3D e observabilidade
- [ ] Criar UI conectada ao contrato real de eventos.
- [ ] Adicionar heartbeat, estados de indisponibilidade, linha do tempo e vista tabular.
- [ ] Verificar que nenhum avatar ou KPI se declara ativo sem evento recente.
- **Aceite:** teste de reconciliação UI/API e teste de desconexão.

### P5 — Supabase e publicação
- [ ] Rever migrações, grants, RLS e policies; avaliar os 52 avisos informativos sem remover a defesa de negação por padrão.
- [ ] Só criar tabelas após comparar o contrato e evitar duplicação; usar migração versionada, política mínima e testes de acesso.
- [ ] Publicar código executável somente após revisão de origem, licença, segredos, dependências e testes isolados.
- **Aceite:** testes de leitura/escrita permitida e negada, advisors revistos e release reproduzível.

Execução financeira real permanece fora deste backlog automático. Exige autorização explícita, corretora/feed definidos, limites de capital, revisão de compliance aplicável, reconciliação, kill switch testado e aprovação independente.

## 7. Critério de conclusão

Documentação, registro no Supabase ou uma cena 3D bonita não provam operação. Cada marco precisa de versão de código, comando de teste, saída observada, data, evidência, falhas conhecidas e revisão independente. Manter o ciclo: **concluir → testar → validar → documentar → publicar → avançar**.
