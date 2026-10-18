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
- Os contratos de quatro mesas e adaptadores passaram no run [39148491528](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39148491528); os jobs `contract-tests` e `windows-powershell-runtime` terminaram `success`.
- Limite: não há prova de cotação live real sem credenciais/plano válidos no ambiente instalado. O status `provider_configured` significa apenas que a variável existe, nunca que o provedor respondeu.

### Atualização de segurança HTTP — RH autenticado pelo Turbo

- A revisão de integração encontrou um bloqueio real: o runtime aceitava a origem local do Turbo, mas o preflight CORS não permitia `PATCH` nem o cabeçalho `Authorization` necessários para alterar estado de tarefas do RH.
- Corrigido `runtime/server.cjs`: allowlist local continua restrita, agora permite `PATCH` e `Authorization`, e rejeita métodos de preflight não autorizados.
- Ampliado `test-runtime-http.cjs` para provar o preflight `PATCH` com `Authorization`/`Content-Type` e bloquear `DELETE`.
- CI confirmado mais recente: [39150646803](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39150646803). Os jobs `contract-tests` e `windows-powershell-runtime` passaram, incluindo o teste do instalador reversível e a verificação isolada em PowerShell 5.1.
- Esta correção elimina um bloqueio de navegador no contrato, mas **não** prova que o Turbo local já tenha proxy autenticado nem que a sede original esteja instalada.

### Correção da experiência do menu — polling sem perda de estado

- Corrigido `public/sede3d-menu.js`: a atualização periódica do runtime agora só redesenha automaticamente a visão geral. Ao abrir RH, mercados, TradingView, Investing.com, Fear & Greed, LEVI, EU SOU ou auditoria, o polling deixa de apagar controles, consultas e resultados do painel ativo.
- O contrato do menu inclui agora uma asserção que impede regressão dessa regra.
- CI verde nos runs [39150169131](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39150169131) e [39150167299](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39150167299), commit `032fed825cbaef3d9e88654e5310b341cc044f69`; testes de contrato e runtime passaram.
- A evidência foi registrada no Supabase em AT-014. O percentual global não sobe: o HTML do Turbo continua sem receber o protótipo original no ambiente real.

### Instalador reversível para a sede 3D original — ferramenta entregue

- Criado `scripts/install-sede3d-menu.cjs`: por padrão opera em dry-run; exige HTML completo e os três assets de runtime/menu; injeta scripts antes de `</body>`, preserva o canvas/cena existente, detecta instalação repetida e cria backup antes de escrever.
- Criado `contracts/v1/test-install-sede3d-menu.cjs`: verifica dry-run sem mutação, preservação da cena, instalação, idempotência e restauração exata a partir do backup.
- Incluído no `npm test`. O contrato do instalador passou no job `contract-tests` e a verificação completa Windows PowerShell 5.1 também passou no run [39150646803](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39150646803), após corrigir o caminho do módulo no teste.
- Para executar no computador que contém os assets e o HTML original, primeiro copiar os três assets para a mesma pasta do protótipo e rodar sem `--write`; só depois da revisão do dry-run usar `--write`. **Não foi executado no HTML original**, porque ele não está disponível no ambiente do GitHub conectado. A instalação visual segue pendente.

### Ponte do runtime — timeout explícito e fail-closed

- A ponte de leitura da sede agora tem timeout configurável de 5 segundos por endpoint (limites aceitos: 100–30.000 ms). Erros HTTP, JSON inválido, tempo excedido e indisponibilidade resultam em erro explícito, sem transformar estado antigo em dado atual.
- O contrato cobre timeout, configuração inválida, HTTP 503 e contrato de resposta incompatível.
- CI verde: [39151072452](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39151072452), incluindo contrato da ponte e runtime Windows PowerShell 5.1.
- Isso melhora a robustez da conexão, mas não comprova que o HTML original tenha sido instalado no Turbo nem que a porta 3100 esteja ativa na máquina local.

### Cotação verificada — impedir preço nulo/zero na interface

- Corrigido `public/sede3d-menu.js`: mesmo que uma resposta venha marcada como `verified`, a interface só exibe o preço quando ele é não nulo, não vazio, numérico e maior que zero. Valores `null`, string vazia, zero e não numéricos não são apresentados como cotação verificada.
- O contrato do menu agora protege explicitamente essa regra, além de preservar controles/resultados durante o polling.
- CI verde no run [39151228085](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39151228085): `contract-tests` e `windows-powershell-runtime` passaram, incluindo o contrato do menu e a verificação isolada em PowerShell 5.1.
- Essa validação reduz o risco de mostrar preço inválido como real; não prova cotação live, credenciais do provedor ou instalação do HTML original no Turbo.

### Watchlists instrumentais nas quatro mesas

- A interface das mesas agora oferece seleção de instrumento por lista inicial:
  - Cripto: BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT, XRPUSDT.
  - Forex: EURUSD, GBPUSD, USDJPY, AUDUSD, USDCAD, USDCHF, NZDUSD.
  - B3: PETR4, VALE3, ITUB4, BBDC4, BBAS3, B3SA3, WEGE3.
  - Internacional: AAPL, MSFT, NVDA, AMZN, GOOGL, META, TSLA.
- A consulta usa o símbolo selecionado, preservando o contrato de leitura e os gates de cotação verificada. A lista não afirma que todos os símbolos estejam cobertos pelo plano/credenciais do provedor; cada consulta ainda pode resultar em `unavailable`, `stale` ou `unverified`.
- Contrato de menu passou no CI [39151566175](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39151566175). No último ponto de verificação, o job Windows PowerShell 5.1 ainda estava em andamento.
- A sede visual original e a aba do Turbo continuam sem instalação comprovada.

### Fear & Greed — timeout configurável, tamanho limitado e CI verde

- A fonte externa tem timeout padrão de 5 s, configurável apenas entre 100 ms e 30 s; configuração inválida e ausência de AbortController falham de forma explícita.
- Respostas maiores que 64 KiB são rejeitadas, redirecionamentos são bloqueados e a leitura é cancelada quando o limite do corpo transmitido é excedido.
- Testes adicionais cobrem timeout real via AbortSignal, limite de timeout inválido, Content-Length excessivo e corpo JSON excessivo.
- CI aprovado no commit `b52f3c5fb1d208c9b8a82bdecd7f59649f42926f`: [run 39152139127](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39152139127), incluindo `contract-tests` e `windows-powershell-runtime`.
- O teste usa respostas controladas para validar o contrato. Não prova que o provedor esteja disponível em produção nem que o indicador esteja visualmente instalado no protótipo original.

### RH/Supabase — proteção contra respostas excessivas (validação em andamento)

- O módulo RH limita respostas Supabase a 1 MiB antes de parsear JSON; para respostas em streaming, cancela a leitura ao exceder o limite. O mesmo limite é aplicado aos RPCs de criação/atualização de tarefas com auditoria.
- O endpoint RH informa `supabase_response_too_large` explicitamente e falha fechado, sem retornar tarefas/roles parciais como se fossem válidas.
- Foram adicionados contratos para `Content-Length` acima do limite e JSON excessivo.
- CI desta alteração ainda está em execução: [run 39152345672](https://github.com/AdonaiShalom/adonaiturbo/actions/runs/39152345672). Não contabilizar como gate aprovado até os dois jobs terminarem verdes.
- A alteração não modifica nem instala o HTML original e não confirma a disponibilidade real das tabelas Supabase.

### Percentual oficial nesta atualização

**38% concluído / 62% restante.** Avanço de 1 ponto pela conclusão da proteção de transporte do Fear & Greed: timeout limitado e testável, limite de 64 KiB, bloqueio de redirecionamentos e testes para timeout e payload excessivo. Os testes de contrato e Windows PowerShell 5.1 passaram no CI. As listas das quatro mesas e as proteções contra preços inválidos também estão cobertas por contratos. Isso é avanço de robustez, não comprova fonte live em produção nem instalação visual. O HTML original ainda não está na árvore do branch e não foi instalado no Turbo; proxy autenticado e integrações LEVI/EU SOU ponta a ponta seguem pendentes.

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

Estado oficial atual desta revisão: **38% concluído / 62% restante (estimativa ponderada por evidências, não telemetria automática)**. O valor reconhece os contratos de runtime e adaptadores testados, o menu de módulos implementado no branch e as funções RH/auditoria transacionais testadas no Supabase. Não contabiliza como concluídos os gates visuais, a instalação do protótipo original na aba real, as cotações live com credenciais, o proxy autenticado local, nem os testes de LEVI/EU SOU ponta a ponta. Atualizar a porcentagem somente com evidências reproduzíveis anexadas a cada gate.
