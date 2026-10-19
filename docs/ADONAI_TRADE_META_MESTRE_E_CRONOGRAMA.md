# Adonai Trade — meta mestre, cronograma e controle de conclusão

**Responsável pelo objetivo:** Esdras Affonso  
**Estado inicial:** plano registrado; execução integral ainda não comprovada.  
**Regra permanente:** manter o foco até a entrega funcional, sem declarar 100% antes de evidências verificáveis.  
**Repositório:** `AdonaiShalom/adonaiturbo`, branch de revisão `work/adonai-trade-professionalization-20261016`.  
**Separação obrigatória:** Adonai Trade não se mistura com PSM Grupo Market. Portas-alvo documentadas: Trade 3100, Turbo 3000, PSM 3001. Confirmar no ambiente antes de qualquer integração.

## 1. Meta final

Entregar o Adonai Trade como sistema integrado, testado, seguro, auditável e funcional, com:
- quatro mesas: **B3/Nacional**, **Internacional**, **Criptoativos** e **Forex**;
- **RH próprio do Adonai Trade** para cadastro, competências, qualificação, atribuições e estado real dos agentes;
- **EU SOU** como núcleo científico para pesquisa, cálculos, hipóteses e experimentos reproduzíveis;
- **LEVI** como orquestrador que encaminha tarefas, correlaciona resultados e reporta estados sem contornar os controles de risco;
- **motor independente de risco e execução**, com bloqueios determinísticos, dados frescos, limites, idempotência, custos/slippage, auditoria e parada de emergência;
- **interface profissional renovada**, com dashboard e salas 3D para centro de comando, quatro mesas, laboratório EU SOU, RH, risco, dados e auditoria;
- integrações verificadas com fontes de dados, GitHub e Supabase conforme necessidade e após revisão de segurança;
- testes, documentação, procedimento de operação, recuperação e publicação controlada.

“100% concluído” significa que todos os critérios obrigatórios deste plano passaram e as evidências foram registradas. Não significa que toda corretora ou bolsa do mundo esteja integrada. Qualquer execução financeira real exige autorização explícita e controles adicionais; o marco de conclusão técnica pode ser validado em paper trading sem ativar ordens reais.

## 2. Arquitetura funcional-alvo

### Quatro mesas
1. **B3/Nacional:** dados, calendário, liquidez, eventos corporativos, custos, análise e risco próprios do mercado brasileiro.
2. **Internacional:** instrumentos e bolsas identificados, calendários/fusos, moeda-base, conversão, fundamentos e regras por jurisdição.
3. **Criptoativos:** separar spot e derivativos; exchanges, order book, liquidez, funding, custódia e risco de contraparte.
4. **Forex:** fonte e frequência de cotação explícitas; separar histórico diário de cotações executáveis; bid/ask, spread, rollover e exposição por moeda.

### Componentes transversais
- **RH:** nenhuma função/agente é considerado qualificado sem prova e evidência.
- **EU SOU:** cada hipótese deve guardar fontes, versões, método, baseline clássico, incerteza, limitações e resultados.
- **LEVI:** coordena fluxo e comunicação; não transforma resposta de modelo em ordem executável.
- **Risco independente:** pode bloquear propostas e o bloqueio não pode ser ignorado pelo LEVI ou por qualquer mesa.
- **Sala 3D:** avatares, atividade, indicadores e estados vêm de dados/eventos reais; sem heartbeat ou evento recente, exibir offline/sem evidência, nunca fingir atividade.
- **Auditoria:** registrar correlação, origem, timestamps, versão, decisões, falhas, testes e aprovações.

## 3. Cronograma sequencial e gates de aceite

As etapas avançam por evidência, não por data presumida. Se um gate falhar, corrigir e repetir os testes antes de avançar.

### Etapa 0 — Preservação e inventário
- [ ] Confirmar fonte canônica do código local, branch e estado Git; preservar backup e alterações do usuário.
- [ ] Inventariar arquivos-chave, scripts, rotas, portas, dependências, variáveis de ambiente por nome (nunca imprimir valores) e testes.
- [ ] Revisar o comportamento destrutivo de `test/smoke.js` antes de executá-lo; usar cópia isolada quando necessário.
- [ ] Executar testes unitários seguros e registrar data, comando, saída e código de saída.
**Gate:** inventário reproduzível, cópia preservada, nenhum segredo exposto, testes classificados por risco.

### Etapa 1 — Integridade do motor e segurança
- [ ] Auditar validação de ordens, cálculo de risco incluindo custos e slippage, caixa, exposição, limites diários, drawdown, preço vencido, idempotência e kill switch.
- [ ] Criar testes positivos e negativos para cada regra; provar que ordens inválidas são bloqueadas.
- [ ] Rever autenticação, autorização, CORS, validação de payloads, logs e tratamento de falhas.
**Gate:** testes negativos comprovam os bloqueios; nenhum caminho alternativo contorna o motor de risco.

### Etapa 2 — RH e qualificação
- [ ] Confirmar o RH canônico do Trade e inventariar agentes/funções reais sem duplicar o RH do Adonai Turbo.
- [ ] Mapear líderes, traders e analistas das quatro mesas; registrar competências, permissões e avaliadores.
- [ ] Implementar/validar fluxo de prova técnica, sandbox, revisão independente e requalificação.
**Gate:** toda função tem critérios verificáveis; agente não qualificado permanece sem autoridade operacional.

### Etapa 3 — Contratos e integração LEVI ↔ EU SOU ↔ mesas
- [ ] Definir contrato versionado, autenticação, IDs de correlação, timestamps, esquema, timeout, limites e auditoria.
- [ ] Testar sucesso, não autorizado, timeout, resposta inválida, duplicidade, falha de serviço e recuperação.
- [ ] Validar fontes científicas, proveniência, hashes/versões, baseline e incerteza.
**Gate:** testes ponta a ponta reproduzíveis; falha ou evidência insuficiente resulta em bloqueio/estado explícito, nunca aprovação implícita.

### Etapa 4 — Dados e adaptadores dos quatro mercados
- [ ] Documentar fonte, licença, instrumento, unidade, moeda, timezone, frequência, atraso/frescor e qualidade.
- [ ] Implementar adaptadores por mercado sem assumir que APIs, horários ou regras são intercambiáveis.
- [ ] Testar dados ausentes, atrasados, duplicados, fora de ordem, instrumentos inválidos, timeout e reconexão.
**Gate:** cada mesa mostra a origem e a atualidade dos dados; histórico não é apresentado como preço ao vivo.

### Etapa 5 — Paper trading e validação quantitativa
- [ ] Validar estratégias com divisão temporal correta, sem look-ahead/survivorship bias, incluindo spread, custos, slippage e latência.
- [ ] Executar backtest, walk-forward, replay e simulação por mesa.
- [ ] Avaliar drawdown, exposição/correlação, robustez, falhas e reprodutibilidade; revisão independente.
**Gate:** relatório por mesa aprovado e reproduzível; nenhuma alegação de vantagem quântica sem baseline clássico e evidência independente.

### Etapa 6 — Nova interface, layout e sala 3D
- [ ] Definir identidade visual profissional, navegação e dashboard comum.
- [ ] Criar salas navegáveis: centro LEVI, B3, Internacional, Cripto, Forex, laboratório EU SOU, RH, risco, dados/operações e auditoria.
- [ ] Vincular cada agente/avatares e animação a estado real, heartbeat e eventos do backend.
- [ ] Manter alternativa tabular acessível e responsiva com os mesmos dados.
- [ ] Testar desconexão, offline, erro, bloqueado, trabalhando, aguardando revisão e reconexão.
**Gate:** UI e API concordam; ao desligar a API, o sistema mostra indisponibilidade; nenhuma atividade fictícia.

### Etapa 7 — Supabase e integrações externas
- [ ] Comparar migrações e schema existentes antes de propor alterações; evitar tabelas duplicadas.
- [ ] Revisar RLS, grants, policies, funções privilegiadas e testes de leitura/escrita permitida e negada.
- [ ] Integrar apenas serviços aprovados; guardar segredos no servidor/secret store e verificar logs.
**Gate:** integrações testadas com evidência; nenhum segredo no frontend/repositório; sem migrações destrutivas não autorizadas.

### Etapa 8 — End-to-end, recuperação e release candidate
- [ ] Executar regressão completa de cada mesa, RH, LEVI, EU SOU, risco, auditoria e interface.
- [ ] Testar reinício, indisponibilidade, dados stale, ordens duplicadas, limites excedidos, falhas de rede e parada de emergência.
- [ ] Produzir relatório de versão, testes, falhas conhecidas, backup/rollback e instruções de operação.
**Gate:** todos os testes obrigatórios passam, sem falha crítica aberta; release candidate reproduzível.

### Etapa 9 — Entrega e manutenção
- [ ] Publicar apenas após revisão, aprovação e checklist de segurança.
- [ ] Confirmar health checks externos, logs/monitoramento, rollback e documentação de operação.
- [ ] Registrar aceite final de cada mesa e integração, com responsável e evidência.
**Gate:** entrega documentada, reproduzível e recuperável; riscos residuais explicitados.

### Etapa 10 — Execução financeira real (separada e opcional)
- [ ] Definir por escrito corretora/exchange, instrumentos, jurisdição, capital, limites e responsável.
- [ ] Exigir autorização explícita, credenciais com privilégio mínimo, testes externos, reconciliação real, revisão de conformidade aplicável e kill switch comprovado.
- [ ] Fazer habilitação gradual e reversível; nenhuma ordem real é habilitada automaticamente por concluir as etapas anteriores.
**Gate:** aprovação humana expressa e evidências adicionais. Sem isso, permanecer em leitura/paper trading.

## 4. Painel permanente de progresso

Atualizar este quadro em cada sessão de trabalho:

| Campo | Registro |
|---|---|
| Etapa atual | A preencher com base na última evidência |
| Concluído e validado | Apenas itens com saída de teste/artefato verificável |
| Em andamento | Trabalho iniciado, ainda sem gate aprovado |
| Bloqueios/pendências | Dependências, acesso, falhas e decisões necessárias |
| Próximo passo único | Ação concreta e segura de maior prioridade |
| Evidência | Commit/PR, arquivo, comando, resultado, data e revisor |

**Estado inicial deste registro:** plano e critérios definidos; o progresso de implementação precisa ser atualizado conforme evidências novas. Não inferir que interface 3D, quatro integrações ou execução real já estejam prontas.

## 5. Regras de trabalho permanentes

1. Manter o objetivo de conclusão integral em todas as sessões e retomar da última etapa com evidências.
2. Seguir o ciclo: **concluir → testar → validar → documentar → publicar → avançar**.
3. Não declarar fase, mesa ou integração 100% pronta sem testes reproduzíveis.
4. Preservar backups; evitar testes destrutivos no projeto principal.
5. Não misturar Adonai Trade com PSM Grupo Market, nem alterar PSM, deploy ou serviços externos fora do escopo aprovado.
6. Não expor segredos, dados pessoais ou chaves; não habilitar ordens reais automaticamente.
7. Relatar sempre: etapa atual, evidências concluídas, andamento, pendências e próximo passo.
