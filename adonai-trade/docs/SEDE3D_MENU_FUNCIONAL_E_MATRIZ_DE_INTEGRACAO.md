# Sede 3D Adonai Trade — menu funcional, módulos e matriz de integração

## Propósito obrigatório

O alvo é **instalar o protótipo original enviado pelo usuário como a nova sede visual da aba Adonai Trade**, substituindo somente o conteúdo dessa aba no Adonai Turbo. Não é criar uma teia 3D genérica e não é substituir o projeto inteiro do Turbo.

Limites de ambiente:
- Adonai Turbo: `http://127.0.0.1:3000`
- Runtime independente Adonai Trade: `http://127.0.0.1:3100`
- PSM Grupo Market: `http://127.0.0.1:3001` — fora do escopo e intocável.

## Inventário de evidências existente

1. O ZIP local de referência registrado pelo usuário é `AdonaiTrade_COMPLETO.zip`, SHA-256 `573AFEF41813311C4411B943802F649D0A66ABB9C5771C3DCC7E485CDEFE343C`. A comparação somente leitura registrada em 18/10 encontrou 144 arquivos no protótipo e 175 na instalação: 130 idênticos, 11 diferentes, 1 só no protótipo, 29 só na instalação e 2 ambíguos. `public/sede3d.html` e `public/teia3d.js` eram idênticos; `public/index.html`, `server.js`, `package.json`, arquivos de ordens/estado e testes tinham diferenças. `test/unit_seguranca.js` aparecia apenas no protótipo.
2. A branch conectada contém um runtime HTTP isolado, adaptadores de mercado, política fail-closed, ponte read-only e testes de contrato. A ponte não foi inserida no HTML original.
3. Os quatro mercados já nomeados pelo runtime são Cripto, Forex, B3 e Internacional. Adaptadores configurados não equivalem a cotação atual validada: Forex usa Alpha Vantage `FX_INTRADAY` de 1 minuto quando `ALPHAVANTAGE_API_KEY` está configurada, com conversão de fuso e frescor máximo de 120 s; sem chave, usa Frankfurter/BCE apenas como referência diária não verificada. B3 depende de `BRAPI_TOKEN`; Internacional usa Alpha Vantage `TIME_SERIES_INTRADAY` de 1 minuto e só pode ser marcado `verified` se o timestamp local da bolsa for convertido corretamente e estiver dentro de 120 s. Limites do plano podem resultar em indisponibilidade. Cripto usa Binance Spot 24h com janela de frescor de 120 s.
4. O ledger de auditoria está criado no Supabase com RLS habilitado, mas a última consulta registrada encontrou zero eventos; a gravação/leitura real pelo runtime permanece pendente.
5. LEVI e EU SOU estão declarados por endpoints no Turbo, mas a integração autenticada de ponta a ponta não foi provada.
6. A execução financeira permanece desabilitada. A instalação pode ficar pronta para operar em modo de análise/paper e passar por gates de segurança; isso não significa habilitar ordens reais sem testes, aprovação e controles explícitos.

## Menu de navegação proposto para o protótipo original

O menu deve ser implementado dentro do protótipo real, preservando sua cena 3D, identidade visual e controles existentes. Cada item deve abrir um painel funcional ou declarar explicitamente “não conectado / não verificado”; não usar botões decorativos que prometem ações inexistentes.

### 1. Sede 3D
- Visão geral do ambiente e navegação da sede original.
- Estado do runtime: conectado, degradado ou indisponível.
- Horário da última leitura separado do horário da cotação.
- Indicador persistente `PAPER / EXECUÇÃO DESABILITADA` enquanto esse for o contrato.

### 2. RH Adonai Trade
- Organograma: Orquestrador/LEVI, coordenação de risco, pesquisa, dados, execução simulada, auditoria e supervisão humana.
- Diretório de agentes/equipes: identificador, função, responsável, estado reportado, tarefa, evidência, última atualização.
- Quadro de tarefas: fila, em execução, bloqueadas, revisão, concluídas; toda mudança deve ter evento de auditoria.
- Matriz de permissões: leitura, análise, simulação, aprovação; nenhuma equipe pode enviar ordens reais nesta etapa.
- Painel de desempenho: somente métricas calculadas de tarefas/eventos reais persistidos; não animar agentes como ativos sem eventos.
- A ponte atual não fornece estado RH, atividade ou probabilidades. Antes de mostrar equipes “trabalhando”, implementar contrato e persistência para esses campos; até lá, exibir “atividade não reportada”.

### 3. Quatro mesas de mercado
Cada mesa deve ter painel próprio, watchlist, instrumentos, horário de sessão, provedor, estado da conexão, timestamp, origem, qualidade dos dados, spread/custos quando disponíveis, risco, análises, histórico e modo paper.

- **Cripto:** adaptador Binance Spot; validar símbolo, frescor, limites, custos e falha do provedor.
- **Forex:** Alpha Vantage `FX_INTRADAY` de 1 minuto com fuso e timestamp validados quando `ALPHAVANTAGE_API_KEY` estiver configurada. Sem a chave, Frankfurter/BCE permanece explicitamente como referência diária `unverified`, nunca cotação intradiária.
- **B3:** integrar Brapi com token privado no servidor; validar timestamp e limites do plano/provedor.
- **Internacional:** Alpha Vantage `TIME_SERIES_INTRADAY` de 1 minuto, com conversão do fuso informado pelo provedor e frescor máximo de 120 s. Se a chave/plano não fornecer a série ou o horário não puder ser validado, retornar `unavailable`/`unverified`; não degradar para `Global Quote` diário.

Em todas as mesas: respostas `verified / stale / unverified / unavailable`; nunca transformar indisponibilidade em zero, nunca reutilizar preço antigo como atual, nunca gerar probabilidade sem modelo validado e evidência.

### 4. Gráficos e fontes externas
- **TradingView:** gráfico/widget oficial por símbolo e mercado, com atribuição e configuração de símbolo; distinguir visualização do gráfico de fonte de dados autorizada para cálculo/execução. Não raspar nem contornar acesso pago.
- **Investing.com:** acesso ao calendário econômico e páginas/recursos permitidos pelo fornecedor. A incorporação deve respeitar widgets oficiais, termos e licenciamento; o painel aponta para o [calendário econômico](https://www.investing.com/economic-calendar/) e para o [gerador oficial do widget](https://br.investing.com/webmaster-tools/economic-calendar). O widget só deve ser incorporado depois que o proprietário aceitar os termos e gerar o código oficial; se não houver widget autorizado, abrir a fonte em nova aba e registrar a referência.
- **Fear & Greed (GREED):** tratar como indicador de sentimento separado, com provedor, timestamp, escala, fonte e estado de verificação. Não usar índice de sentimento como probabilidade de lucro ou sinal automático. Se a fonte estiver ausente, mostrar “não conectado”.
- Cada fonte deve ter status de conexão, última atualização, limitações e link para a origem. O fato de o menu exibir o nome da fonte não prova integração.

### 5. Inteligência, risco e pesquisa
- Análise técnica e contexto macroeconômico por mesa.
- Motor de risco: exposição, limites, drawdown, custo/spread, tamanho máximo, bloqueios e explicação da decisão.
- Backtest reproduzível sem vazamento temporal, com período, instrumento, custos, slippage, benchmark, parâmetros, versão do código e relatório.
- Cenários e probabilidades só quando houver modelo, calibração, dados e avaliação fora da amostra. Até então: “não calculado / sem evidência”.
- Cético/auditor: procurar dados atrasados, premissas contraditórias, overfitting e sinais sem fonte.

### 6. LEVI — orquestração
- LEVI recebe pedido, cria tarefa, seleciona mesa/função, aplica limites de risco e devolve resultado com evidências.
- Endpoint declarado: `http://127.0.0.1:3000/api/levi/orquestrar`.
- Integração só pode aparecer como conectada após teste de request/response, autenticação/limites, timeout, rastreamento da tarefa e persistência de auditoria. Status atual registrado: pendente.
- LEVI não pode afirmar que chamou uma mesa ou RH se a chamada e o evento não existirem.

### 7. EU SOU — motor científico
- Endpoint declarado: `http://127.0.0.1:3000/api/eu-sou/calcular`.
- Usar como motor científico para cálculos/revisões de hipóteses e não como fonte de cotações.
- Toda saída deve carregar entrada, método, unidades, versão, resultado, incerteza/limites e evidência reproduzível.
- Status de integração ponta a ponta registrado: pendente.

### 8. Auditoria, memória e configuração
- Trilha append-only de tarefa, fonte, decisão, resultado, usuário/serviço, timestamps e hash/correlação.
- Saúde dos provedores, endpoints, Supabase, LEVI, EU SOU e runtime.
- Configuração privada exclusivamente no servidor; nunca expor service-role/API keys ao browser.
- Exportar relatório de auditoria e estado da instalação; controlar versões e rollback.

## Arquitetura de integração

1. Servir o HTML original preservado e fazer o roteamento da aba Turbo para a sede nova, sem reescrever o resto de `frontend/index.html`.
2. Manter Trade em 3100. Preferir proxy same-origin do Turbo para as rotas read-only necessárias; não habilitar CORS global.
3. Adaptar o protótipo por uma camada de integração pequena, não duplicar nem reescrever a cena 3D.
4. Contratos de API versionados para mercados, RH, tarefas, fontes, LEVI, EU SOU e auditoria.
5. Supabase como persistência/auditoria com políticas de menor privilégio; credencial service role somente no servidor.
6. Estados de erro devem falhar fechados e apagar indicadores que possam parecer atuais; execução real continua desabilitada.
7. PSM não é importado, reconfigurado nem utilizado como backend.

## Registro de execução vigente — 2026-10-18

**Este documento é o plano mestre canônico único.** Os documentos antigos de planejamento devem ser tratados como material histórico/técnico subordinado; não criar metas paralelas nem contar documentação repetida como avanço funcional. A trilha de auditoria e os relatórios técnicos são preservados para não apagar evidência.

### Trabalho implementado nesta sessão (ainda sujeito ao CI)

- Criado o adaptador `runtime/fear-greed.cjs` para a API pública de sentimento da Alternative.me: valida valor inteiro 0–100, timestamp numérico, timestamp futuro, idade de até 24 horas e estados `verified`, `stale` ou `unavailable`.
- Adicionado endpoint read-only `GET /api/v1/sentiment/fear-greed` com rate limit e execução desabilitada.
- Conectado o painel Fear & Greed do menu da sede ao endpoint, exibindo valor, classificação, horário, idade, origem e aviso de que sentimento não é probabilidade de lucro.
- Criados testes de payload válido, dado antigo, valor fora da escala, timestamp futuro, falha de rede e endpoint HTTP.
- Incluídos os testes do menu e do adaptador na workflow do GitHub Actions.
- Commit de alteração da workflow: `46e3a2aa030cc1784c58be73f049a77f8107d291`. Validação concluída: os runs [39146806219](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39146806219) e [39146806260](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39146806260) passaram; os passos `Run Fear & Greed source adapter and HTTP endpoint tests` e `Run 3D sede menu contract` tiveram conclusão `success`, assim como `windows-powershell-runtime`. A evidência está registrada no Supabase. Isso valida o código no branch, não a instalação local.
- O código está na branch de integração; não está instalado no Windows nem incorporado no HTML original. A sede visual, o RH real e a integração da aba Turbo continuam pendentes.

### Atualização de execução — tarefas RH autenticadas e auditoria transacional

- Adicionados os RPCs Supabase `rh_create_task_with_audit` e `rh_update_task_status_with_audit`. Cada operação grava a alteração da tarefa e o evento de auditoria na mesma transação do banco; a decisão usa o contrato permitido `proposal_only` e os detalhes identificam o tipo de evento.
- Adicionados ao runtime os endpoints `POST /api/v1/rh/tasks` e `PATCH /api/v1/rh/tasks/:id/status`. Escritas exigem `RH_API_TOKEN` com pelo menos 32 caracteres, comparação constante do token, validação do corpo e chamada ao RPC transacional. Se a variável não estiver configurada, a escrita falha fechada; o token nunca vai para o navegador.
- Testes automatizados cobrem criação/atualização via RPC simulado, entradas inválidas, autenticação obrigatória, endpoint HTTP, ausência de vazamento de chave e modo paper. Os runs [39147955092](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39147955092) e [39147955670](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39147955670) passaram em Linux e Windows.
- Teste no Supabase conectado: a criação e atualização da tarefa `RH-2026-001` foram executadas pela função SQL; o estado foi confirmado como `in_progress`, e os dois eventos correspondentes (`rh_task_created` e `rh_task_status_updated`) apareceram na tabela de auditoria. Isso valida as funções SQL no projeto conectado, mas ainda não comprova que o runtime local esteja configurado com `RH_API_TOKEN` nem que o Turbo faça proxy autenticado.

### Atualização de execução — RH com dados persistidos

- Criado o esquema Supabase `adonai_trade.rh_roles` e `adonai_trade.rh_tasks`, com RLS ativado, acesso direto negado a `anon` e `authenticated`, e acesso do `service_role` apenas no backend. O catálogo possui sete funções: orquestração/LEVI, risco, pesquisa, dados de mercado, simulação paper, auditoria e supervisão humana.
- Aplicada a migração ao projeto Supabase conectado e verificada a presença de **7 funções**. Após a implementação dos RPCs transacionais, foram criadas duas tarefas reais: `RH-2026-001` (API RH e auditoria, `in_progress`) e `RH-2026-002` (integrar o protótipo original ao Turbo, `blocked` pelo acesso aos arquivos). A consulta confirmou **4 eventos** em `runtime_audit_events`, cobrindo criação e mudança de estado das duas tarefas. Isso comprova a persistência transacional via SQL; ainda não prova que o runtime local esteja configurado com token nem que o Turbo faça proxy autenticado. O estado `not_reported` das funções permanece correto: não afirmar que equipes estão ativas.
- Implementado `runtime/rh-store.cjs` para ler funções e tarefas persistidas sem expor a chave privada; adicionado `GET /api/v1/rh` com rate limit e modo read-only; o painel RH do menu consulta o endpoint e apresenta o que existe, inclusive indisponibilidade e ausência de tarefas.
- Teste `test-rh-store.cjs` verifica contrato PostgREST, leitura de funções/tarefas, configuração ausente, falha do Supabase, ausência de vazamento da chave e endpoint HTTP. O run [39147536284](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39147536284) passou nos jobs `contract-tests` e `windows-powershell-runtime`.
- Limite: o endpoint é somente leitura; criar/alterar tarefas requer um backend autenticado que autorize a ação e registre evento de auditoria. Não abrir escrita sem autenticação.

### Atualização de execução — TradingView multi-mercado

- O módulo TradingView do menu agora oferece seleção de gráfico para quatro mesas: `BINANCE:BTCUSDT`, `OANDA:EURUSD`, `BMFBOVESPA:PETR4` e `NASDAQ:AAPL`. A seleção troca o widget oficial e fornece link para abrir o símbolo selecionado no TradingView.
- O contrato automatizado verifica a existência e o mapeamento dos quatro símbolos. Os runs [39147273715](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39147273715) passaram nos jobs `contract-tests` e `windows-powershell-runtime`, incluindo o teste do menu.
- Limite da evidência: isto valida o código do ramo e o mapeamento dos símbolos; ainda não valida renderização real do widget no navegador nem prova que o script esteja incorporado ao protótipo original. Investing.com continua sendo um link para recurso oficial permitido; não está sendo alegada integração de dados direta.

### Atualização de execução — dados intradiários Forex e Internacional

- Forex agora usa Alpha Vantage `FX_INTRADAY` de 1 minuto quando `ALPHAVANTAGE_API_KEY` está configurada; sem essa chave, permanece o fallback Frankfurter/BCE com estado `unverified` e motivo explícito `daily_reference_not_intraday`.
- Internacional agora usa `TIME_SERIES_INTRADAY` de 1 minuto em vez de `Global Quote`. Os timestamps locais são convertidos usando o fuso informado pelo provedor e a cotação só pode ser `verified` se tiver preço válido e idade de até 120 segundos; dados antigos viram `stale`, fuso/data inválidos viram `unverified`, e resposta de limite/erro vira `unavailable`.
- Os contratos de quatro mesas e adaptadores passaram no run [39148491528](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39148491528); o job `contract-tests` terminou `success` e a etapa de verificação isolada do runtime no Windows também terminou `success`. A limpeza final do job Windows ainda estava em andamento na última consulta.
- Limite: não há prova de cotação live real sem credenciais/plano válidos no ambiente instalado. O status `provider_configured` significa apenas que a variável existe, nunca que o provedor respondeu.

### Percentual oficial nesta atualização

**33% concluído / 67% restante.** Aumentado em 2 pontos porque, além do RH com tarefas e auditoria transacionais, Cripto/Forex/B3/Internacional agora têm contratos de dados mais rigorosos; Forex e Internacional possuem caminho intradiário de 1 minuto com conversão de fuso, checagem de timestamp e falha segura, e os testes dos adaptadores passaram no CI. Não significa que as credenciais dos provedores foram configuradas nem que cotações reais foram confirmadas. O token do runtime e o proxy autenticado do Turbo ainda não foram validados localmente; a instalação visual do protótipo original e o teste do widget no navegador continuam pendentes.

### Documentos de planejamento anteriores

Os antigos documentos de planejamento não constituem planos ativos independentes. A ordem de prioridade é: (1) este plano mestre; (2) runbook técnico como procedimento subordinado; (3) relatórios de auditoria/testes como evidências históricas. Não excluir logs, testes ou evidências de auditoria que sustentem segurança e reversibilidade.

## Ordem de execução e gates de aceite

- [ ] G0 — revalidar o ZIP real por SHA-256 na máquina de origem e gerar relatório de diferenças atual.
- [ ] G1 — analisar todos os 11 arquivos diferentes, 29 exclusivos da instalação, 1 exclusivo do protótipo e 2 ambíguos; preservar mudanças úteis da instalação e adicionar `unit_seguranca.js` sem sobrescritas cegas.
- [ ] G2 — integrar a sede original à aba Trade do Turbo com backup, diff mínimo e rollback.
- [ ] G3 — implementar menu e ramificações acima conectados a funções/contratos reais.
- [ ] G4 — validar o servidor local 3100 e todos os endpoints em execução.
- [ ] G5 — provar cotações/fonte/horário dos quatro mercados e status explícito para cada provedor.
- [ ] G6 — implementar RH com estado real de tarefas e evidências; não simular atividade.
- [ ] G7 — conectar TradingView, Investing.com e GREED com fontes autorizadas, atribuição e timestamps.
- [ ] G8 — provar persistência e leitura do ledger Supabase, RLS e política de segredos.
- [ ] G9 — provar LEVI e EU SOU ponta a ponta com rastreio e auditoria.
- [ ] G10 — executar testes unitários, contratos, integração, navegador, falhas de rede, regressão das abas e rollback.
- [ ] G11 — revisão final, documentação, artefato de release e publicação após aprovação dos gates.

## Percentual — regra de medição

Não considerar documentação ou CI de contratos como instalação visual concluída. A medição deve ponderar: protótipo original e aba Turbo 25%; menu/RH/funções 15%; quatro mercados com dados comprovados 20%; TradingView/Investing.com/GREED 10%; Supabase/auditoria/segurança 10%; LEVI + EU SOU 10%; testes de regressão, rollback e release 10%.

Estado de partida desta revisão: **25% concluído / 75% restante (estimativa de escopo, não telemetria automática)**. A estimativa reconhece que o runtime e os contratos existem, mas os gates visuais, de dados ao vivo, RH, fontes externas, auditoria ponta a ponta e integrações permanecem abertos. Atualizar a porcentagem somente com evidências reproduzíveis anexadas a cada gate.
