# Plano de profissionalização do Adonai Trade

**Status:** proposta técnica para revisão; não autoriza operação financeira real.  
**Escopo:** quatro mesas independentes, RH, EU SOU, LEVI e Supabase.  
**Separação obrigatória:** Adonai Trade em `127.0.0.1:3100`; Adonai Turbo em `:3000`; PSM Grupo Market em `:3001`. Não misturar repositórios, configurações, portas ou segredos.

## 1. Estrutura-alvo de funções lógicas

A meta de desenho é **36 funções lógicas**, não 36 processos de IA pesados:

- 4 mesas × (3 traders + 4 analistas) = 28 funções de mesa.
- 8 funções centrais compartilhadas = 36 no total.
- Implementar por serviços/agentes especializados com identidade, permissões e telemetria separadas; dimensionar processos físicos conforme carga medida.

### Mesa B3 — 7 funções
**Traders:** líder/coordenador; curto prazo/intraday; swing/posição.  
**Analistas:** dados, liquidez e microestrutura; quantitativo/estatístico; fundamentos de empresas e setores; macro Brasil, notícias e eventos corporativos.

### Mesa Internacional — 7 funções
**Traders:** líder/coordenador; curto prazo; swing/posição.  
**Analistas:** dados e microestrutura de bolsas; quantitativo/fatores; fundamentos e setores; macro global, notícias e eventos.

### Mesa Cripto — 7 funções
**Traders:** líder/coordenador; curto prazo; swing/posição.  
**Analistas:** exchange, livro de ordens e liquidez; quantitativo/volatilidade; on-chain e tokenomics; derivativos, funding, notícias, custódia e risco de contraparte.

### Mesa Forex — 7 funções
**Traders:** líder/coordenador; curto prazo; swing/posição.  
**Analistas:** cotações/spread/qualidade; quantitativo/estatístico; macro e bancos centrais; calendário econômico, notícias e risco de execução.

### Oito funções centrais
1. LEVI — orquestrador operacional/vice; encaminha tarefas e acompanha estados.
2. EU SOU — cérebro científico; recupera fontes, cria hipóteses e avalia evidências.
3. Controle independente de risco — motor determinístico de aprovação/bloqueio.
4. Engenharia de dados — proveniência, frescor, qualidade e reconciliação.
5. Operações/execução — adaptadores de corretora, estado de ordens e recuperação.
6. Gestão de portfólio — exposição consolidada, correlação e limites por mesa.
7. Auditoria, segurança e conformidade — permissões, licenças, trilha e revisão.
8. RH/recrutamento/qualificação — perfis, provas, treinamento e requalificação.

## 2. Autoridade e fluxo de decisão

1. Mesa solicita análise com `correlation_id`, mercado, instrumento, horizonte e timestamp.
2. LEVI distribui tarefas aos analistas e consulta EU SOU por contrato autenticado.
3. EU SOU devolve hipótese, fontes/versionamento, hash de entrada, baseline, incerteza, limitações e evidência; conhecimento `curated` não equivale a resultado validado.
4. Trader propõe ação; nenhuma saída textual de LLM é uma ordem executável.
5. Motor de risco independente valida instrumento permitido, frescor dos dados, exposição, limites, liquidez, idempotência e estado do sistema.
6. Paper trading é o padrão inicial. Execução real permanece desabilitada até aprovação explícita, reconciliação comprovada e controles testados.
7. Registrar cada transição e resultado no log de auditoria. O LEVI não pode ignorar nem sobrescrever um bloqueio do motor de risco.

## 3. EU SOU: pesquisa quântica e nanotecnologia

O EU SOU pode pesquisar computação quântica, física, otimização, química, materiais, sensores e nanotecnologia quântica. Para qualquer aplicação financeira, exigir: hipótese testável; fonte e licença; versão e hash; baseline clássico; teste sem look-ahead; custos e slippage; teste fora da amostra; repetição; revisão independente. Nenhuma vantagem de trading é presumida a partir do rótulo “quântico” ou “nanotecnologia”.

## 4. RH — processo de recrutamento e qualificação

Usar as funções existentes em `rh_adonai` (direção, recrutamento, capacitação, integração, pesquisa, validação, auditoria, privacidade, desempenho e dados). O catálogo atual de 12 agentes de RH é uma base funcional de RH, não uma lista de 12 traders já qualificados.

Para cada uma das 28 funções de mesa, registrar perfil, competências, mercado, permissões e avaliador independente. Pipeline: especificação da função → triagem → prova técnica → sandbox → revisão independente → qualificação → monitoramento/requalificação. Permissões graduais: observação → análise → proposta → paper trading → execução real autorizada. Não promover automaticamente os agentes atuais a traders.

## 5. Estado conhecido do sistema (observação inicial; requer nova verificação antes de cada release)

- Forex: os testes unitários de Forex e o teste HTTP local reportados em 2026-10-16 passaram; `GET /api/forex?par=EURUSD` retornou histórico diário de Frankfurter/BCE. Isso não comprova feed intradiário de corretora nem execução.
- Supabase: `adonai_trade.integration_status` foi observado como a única tabela do schema de trading; RH possui `agents`, `agent_assignments`, `recommendations`, `learning_runs` e `activity_log`. Conferir migrações antes de adicionar tabelas.
- EU SOU: há conhecimento curado, mas `curated` não significa validado; validar cada hipótese com benchmarks aprovados.
- GitHub: README de `adonai-trade/` está publicado; buscar `package.json` e `server.js` em `adonai-trade/` retornou 404 na consulta inicial. Confirmar árvore local e publicar código apenas após auditoria.
- Os estados registrados anteriormente (`pending`/ `degraded`) são registros históricos, não health checks atuais.

## 6. Modelo de dados a avaliar (não criar duplicatas)

Após comparar o esquema local, migrações e funções existentes, avaliar entidades para:
- cadastro/qualificação de agentes e atribuições;
- instrumentos e eventos de dados de mercado;
- versões de estratégia, execuções de backtest e resultados;
- propostas, decisões de risco e limites;
- ordens, eventos de ordem, fills e posições;
- snapshots de portfólio e eventos de auditoria.

Todos os registros devem conter IDs, timestamps UTC, origem, versão e correlação quando aplicável. Restrições de integridade, idempotência e índices devem refletir consultas reais.

## 7. Segurança Supabase

- Segredos apenas no servidor/secret store; nunca no frontend, repositório ou logs.
- RLS e grants devem ser avaliados em conjunto; política ausente não prova exposição nem segurança.
- Conceder somente privilégios necessários a `anon`, `authenticated` e funções de servidor.
- Testar explicitamente allow/deny para leitura e escrita com cada papel; revisar views e funções com privilégios elevados.
- Não aplicar DDL de produção antes de comparar migrações e definir testes de autorização.
- Registrar estado de integração somente depois de testes reais de autenticação, leitura, escrita e falha.

## 8. Referências técnicas para avaliação (não incorporação automática)

- QuantConnect LEAN: https://github.com/QuantConnect/Lean — arquitetura de pesquisa/backtest/execução.
- CCXT: https://github.com/ccxt/ccxt — adaptadores de exchanges cripto; revisar permissões e licenças.
- TradingView Lightweight Charts: https://github.com/tradingview/lightweight-charts — gráficos; não é feed de dados nem motor de ordens.
- Revisar licenças, versões fixadas, dependências e superfície de ataque antes de integrar qualquer código.

## 9. Etapas e critérios de aceite

**Etapa A — inventário:** confirmar árvore local, Git status, testes, env vars por nomes (nunca valores), endpoints e backups. Aceite: relatório reproduzível, nenhum segredo exposto e Forex preservado.

**Etapa B — RH:** mapear as 36 funções, competências, provas e avaliadores; reutilizar funções de RH existentes. Aceite: cada função tem critérios verificáveis e status inicial “não qualificado” até evidência.

**Etapa C — contratos LEVI/EU SOU:** definir autenticação, payload versionado, correlação, timeout, tratamento de falhas e auditoria. Aceite: testes de ponta a ponta de sucesso, não autorizado, timeout e resposta inválida.

**Etapa D — risco e dados:** implementar regras determinísticas, stale-data gate, limites, idempotência, reconciliação e parada de emergência. Aceite: testes negativos demonstram bloqueio e não há caminho alternativo via LLM.

**Etapa E — paper trading por mesa:** validar fonte, custos, slippage, out-of-sample, falhas e resultados. Aceite: relatório reproduzível e aprovação independente por mesa.

**Etapa F — sala 3D:** avatares refletem estados reais persistidos; “ordem enviada”, “confirmada”, “rejeitada” e “offline” derivam de eventos reais. Aceite: reconciliação UI/API e testes de estados.

**Etapa G — execução real:** fora do escopo automático deste plano. Exige autorização explícita, corretora e instrumentos definidos, testes de ponta a ponta, política de capital/risco, revisão jurídica/compliance aplicável e kill switch testado.

## 10. Critério de conclusão

Não declarar mesa ou integração operacional por documentação ou registro de status. Exigir evidências de teste datadas, versão de código, resultado de execução, auditoria e aprovador independente. Nenhuma chave, ordem real ou migração destrutiva deve ser introduzida como parte deste plano documental.
