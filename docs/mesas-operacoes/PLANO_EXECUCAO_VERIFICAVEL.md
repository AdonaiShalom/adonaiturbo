# AdonaiTrade — plano de execução verificável

Data: 2026-10-16. Este plano é um backlog, não uma declaração de conclusão.

## Estado confirmado até agora

- Testes locais anteriores foram reportados como aprovados para módulos de conhecimento, auditoria, Monte Carlo, controles de risco, API smoke e suítes de mesas/equipes. Isso valida os testes executados, não toda a aplicação.
- Forex teve testes unitários/históricos/API reportados como aprovados em execução anterior; uma API local na porta 3100 respondeu HTTP 200 naquele momento.
- O GitHub conectado contém um README do módulo Trade, mas package.json e server.js não foram comprovados no caminho adonai-trade/ da branch principal.
- Supabase foi inspecionado sem alterações. Os registros em adonai_trade.integration_status não são health checks em tempo real.
- O Render conectado lista o serviço psm-grupo-market, não um serviço confirmado do Adonai Turbo. Não alterar o PSM para tentar implantar o Trade.
- Integração de ponta a ponta entre LEVI, EU SOU, RH e as quatro mesas, assim como a sala 3D ligada a eventos reais, permanece sem comprovação.

## Regras obrigatórias

1. Paper trading como padrão. Não ativar negociação real, credenciais de saque ou ordens reais.
2. LEVI/LLM não cria ordens diretamente. O motor de risco determinístico independente pode bloquear qualquer proposta.
3. Dados ausentes/vencidos, timeout, resposta inválida, autenticação falha ou risco excedido levam a bloqueio seguro.
4. Cada tarefa tem correlation_id, mesa, fontes, timestamps UTC, método e versão, parâmetros, baseline, incerteza, resultado, decisão de risco e estado de simulação.
5. O RH diferencia função planejada, agente cadastrado, processo ativo e agente qualificado. Não exibir “trabalhando” sem heartbeat/evento recente.
6. Alterações Supabase só por migração revisada com testes de RLS, grants e policies; preservar acesso restrito ao conhecimento curado.
7. Não misturar portas/serviços de Adonai Trade, Adonai Turbo e PSM Grupo Market.

## P0 — reconciliar fonte local e repositório

- Executar o script scripts/mesas-operacoes/Diagnostico-AdonaiTrade.ps1 no Windows.
- Inspecionar package.json, rotas, RH, adaptadores, configuração de risco e testes.
- Revisar o corpo do smoke antes de executá-lo: inspeções anteriores indicaram que pode interagir com arquivos em data.
- Comparar Git status e árvore local com o branch remoto; remover segredos antes de publicar.
- Aceite: inventário reproduzível, backup verificado, testes não destrutivos e origem do código identificada.

## P1 — contrato LEVI ↔ EU SOU ↔ mesas

- Contrato versionado para tarefas e eventos, autenticação/autorização, schema validado, timeout, correlação, idempotência e auditoria.
- Testes para sucesso, não autorizado, timeout, payload inválido, duplicidade e indisponibilidade.
- Aceite: teste ponta a ponta reproduzível e nenhuma rota de LLM para execução direta.

## P2 — quatro mesas e risco

- B3: calendário, leilões, corporate actions, liquidez, custos e risco por ativo/setor.
- Internacional: fuso/feriados por bolsa, moeda-base, conversão FX, setores e calendário macro.
- Cripto: spot versus derivativos, funding, liquidação, livro de ordens, rate limits e risco de exchange.
- Forex: bid/ask, spread, swap/rollover, fonte/frequência das cotações e calendário macro.
- Cada mesa deve testar frescor, limites, exposição, drawdown, custos/slippage, bloqueio e kill switch.
- Aceite: testes positivos e negativos por mesa com resultado documentado.

## P3 — EU SOU e qualidade científica

- Registrar fontes, licença, data, método, baseline clássico, incerteza, reprodutibilidade e revisão.
- Só classificar como quântico/híbrido quando método e ambiente sustentarem essa classificação; comparar com baseline clássico, sem presumir vantagem financeira.
- Exigir revisão antes de promover conhecimento para curado/revisado/validado.
- Aceite: cálculos reproduzíveis, fontes rastreáveis e limitações explícitas.

## P4 — paper trading

- Simulador reproduzível que inclua custos, spread, slippage, latência, falhas e eventos relevantes.
- Resultados separados por mesa e agregados por exposição de carteira; validação fora da amostra.
- Nenhum caminho do simulador pode enviar ordens reais.
- Aceite: relatório reproduzível e revisão independente.

## P5 — sala de operações e observabilidade

- Salas: centro LEVI, B3, Internacional, Cripto, Forex, laboratório EU SOU, risco independente, operações/dados e auditoria.
- Painel 3D é somente visualização; KPIs, tarefas, alertas e estados vêm da API e de eventos persistidos.
- Vista tabular acessível equivalente; offline quando heartbeat expirar; validar queda de API, reconexão e reconciliação UI/API.
- Aceite: cada agente visual tem evento/heartbeat verificável e nenhuma atividade inventada.

## P6 — segurança e publicação

- Testar autenticação, autorização, CORS, rate limits, gestão de segredos, dependências/licenças, logs, RLS, grants e policies.
- CI com testes determinísticos, regressões, versionamento e rollback documentado.
- Publicar apenas no serviço correto depois de confirmar repositório, branch e destino de implantação.
- Aceite: health checks e testes de acesso permitido/negado, release reproduzível e plano de rollback.

## Pesquisa open source a validar antes de adotar

- Freqtrade: referência para dry-run, custos e parâmetros de execução; não copiar configuração sem revisão.
- QuantConnect LEAN: referência para controles determinísticos de drawdown separados dos sinais.
- TradingAgents: referência para debate adversarial limitado; debate de LLM não é evidência científica nem autorização de ordem.
- CCXT: candidato a adaptador de cripto após revisar licença, versão, rate limits e permissões.
- TradingView Lightweight Charts: candidato de visualização, não fonte de dados ou execução.
- Qiskit Algorithms: README consultado alerta sobre suporte oficial; avaliar manutenção e comparar métodos quânticos/híbridos com baselines clássicos.

## Definição de concluído

Cada etapa só fecha com commit/versão, comando de teste, resultado real, data, evidência, falhas conhecidas e revisão. Ciclo obrigatório: concluir → testar → validar → documentar → publicar → avançar.

O conector não executa comandos arbitrários no Windows nem lê diretamente C:\AdonaiTurbo\AdonaiTrade. A execução local é feita com o script PowerShell e os relatórios devolvidos, sem pedir para repetir diagnósticos anteriores já registrados.
