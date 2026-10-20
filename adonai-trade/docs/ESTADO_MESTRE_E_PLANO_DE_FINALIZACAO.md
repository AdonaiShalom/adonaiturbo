# Adonai Trade — estado-mestre e plano de finalização

**Data de consolidação:** 2026-10-20  
**Propósito:** registro operacional único para retomar o projeto sem perder decisões, misturar sistemas ou declarar conclusão sem evidência.  
**Estado geral:** EM RECONSTRUÇÃO CONTROLADA — ainda não comprovado como instalado e pronto no Adonai Turbo.

## 1. Limites obrigatórios

- Adonai Turbo: `C:\AdonaiTurbo`, HTTP local na porta **3000**.
- Adonai Trade legado: porta **3100**, preservar até a migração estar testada.
- Runtime isolado Adonai Trade: porta **3107**, somente leitura/paper.
- PSM Grupo Market: porta **3001**, **fora do escopo; não modificar nem integrar neste trabalho**.
- Protótipo 3D oficial: `PROTOTIPO_Sede3D_abrir_no_navegador.html`; no serviço legado, rota oficial registrada `/sede3d`.
- `/trade3d-operacional` e `/adonai-trade-3d-operacional` **não são o protótipo oficial**. Não usar como substitutos nem apagar arquivos locais sem inventário e prova de alvo.
- A expressão “sem o centro” permanece ambígua no histórico disponível. Não remover prédio, nó, painel ou módulo por suposição; preservar o original até identificar o alvo com evidência.
- Modo obrigatório enquanto os gates não forem aprovados: **PAPER / execução financeira real desabilitada**. Não enviar ordens reais, não exibir segredos e não imprimir tokens de API.

## 2. O que está comprovado no repositório conectado

1. Existe runtime isolado com contratos HTTP, política fail-closed, adaptadores de mercado, ponte para a interface e cliente de polling.
2. O pacote `adonai-trade` declara Node.js >=22 e possui testes de contratos para limites de taxa, política, sazonalidade, mesas de mercado, estado de integrações, ledger, HTTP, adaptadores, ponte, menu, Fear & Greed, RH e instalador da sede.
3. A branch `safety/guard-official-sede3d-target` contém uma proteção no instalador: só aceita nomes oficiais permitidos (`sede3d.html` ou `prototipo_sede3d_abrir_no_navegador.html`, sem diferenciar maiúsculas/minúsculas); execução padrão é dry-run; exige os três scripts auxiliares; injeta antes de `</body>` sem substituir a cena; cria backup no modo de escrita.
4. O teste do instalador cobre preservação da cena, idempotência, HTML inválido, dry-run sem alteração, backup, restauração byte a byte, segundo nome permitido e rejeição de `trade3d-operacional.html`.
5. PR de proteção: https://github.com/AdonaiShalom/adonaiturbo/pull/23. O workflow de contrato foi reportado como concluído com sucesso; o PR ainda precisa de revisão/estado final. CI verde prova somente os testes executados, não a instalação local.
6. O plano canônico é `SEDE3D_MENU_FUNCIONAL_E_MATRIZ_DE_INTEGRACAO.md`; o procedimento subordinado é `TURBO_TAB_INTEGRATION_RUNBOOK.md`.

## 3. O que ainda NÃO está comprovado

- O protótipo original dentro da aba Trade do `C:\AdonaiTurbo\frontend\index.html`.
- A identidade/hash atual do arquivo local, backup, diff e rollback testado.
- Saúde real simultânea das portas 3000, 3100 e 3107; a porta 3001 deve permanecer independente.
- Cotações atuais verificadas nos quatro mercados, com timestamp e qualidade validados.
- Atividade real de RH/agentes persistida; não inventar agentes ativos, tarefas ou probabilidades.
- Escrita e leitura end-to-end de eventos reais no ledger Supabase. O último estado documentado mencionou tabela criada com RLS e zero eventos observados.
- Integração autenticada ponta a ponta com LEVI e EU SOU.
- Teste visual e de navegação da sede no Turbo, tratamento de falha de rede/payload, regressão e rollback local.
- Disponibilidade/validade das credenciais dos provedores. Presença de variável de ambiente não prova acesso ou cotação.

## 4. Menu funcional requerido

O menu deve existir dentro do protótipo 3D original, preservando cena, identidade e controles. Cada item abre uma função real ou informa claramente “não conectado”, “não verificado” ou “atividade não reportada”; não usar botões decorativos.

1. **Sede 3D:** estado do runtime, hora da leitura, hora da cotação separadas e indicador PAPER.
2. **RH Adonai Trade:** organograma; diretório de equipes/agentes com identificador, papel, responsável, estado reportado, tarefa, evidência e atualização; fila de tarefas; permissões; métricas derivadas de eventos persistidos.
3. **Cripto:** adaptador público Binance Spot; frescor e origem da cotação.
4. **Forex:** Alpha Vantage intradiário 1 min se disponível; Frankfurter/BCE só referência diária, nunca intradiário.
5. **B3:** Brapi, token somente no servidor; validação do plano e timestamp.
6. **Internacional:** Alpha Vantage intradiário 1 min; não substituir série intradiária por cotação diária.
7. **TradingView:** widget/gráfico oficial e atribuição; visualização não equivale a feed validado para decisões.
8. **Investing.com:** calendário/widget oficial apenas respeitando termos; se não autorizado, abrir fonte e registrar referência.
9. **Fear & Greed:** fonte, escala, timestamp e status; sentimento não é probabilidade de lucro.
10. **Inteligência e risco:** regras explícitas, limites, exposição e motivo de bloqueio; sem probabilidades não validadas.
11. **LEVI:** conexão, resposta e erros reais do endpoint; sem declarar operacional sem teste end-to-end.
12. **EU SOU:** operações científicas validadas, com limites e erros transparentes.
13. **Auditoria:** cadeia de eventos verificável, hashes/IDs e falhas de gravação expostas.

Estados padronizados de dados: `verified`, `stale`, `unverified`, `unavailable`. Nunca converter indisponibilidade em zero nem apresentar dado antigo como atual.

## 5. Mesas de mercado no runtime

| Mesa | Provedor configurado no código | Condição para considerar dados verificados |
|---|---|---|
| Cripto | Binance Spot pública | Cotação obtida, símbolo correto, timestamp/frescor e resposta válidos |
| Forex | Alpha Vantage FX intraday ou referência diária Frankfurter/BCE | Intraday apenas se chave, série e timestamp forem validados; referência diária rotulada como tal |
| B3 | Brapi | Token válido, plano autorizado, símbolo e timestamp verificados |
| Internacional | Alpha Vantage intraday 1 min | Chave/plano, série intradiária e conversão de fuso/frescor validados |

O código atualmente marca `quote_status: not_checked` e `execution_enabled: false`. Isso deve continuar até testes de integração comprovarem algo diferente; credencial configurada não é sinônimo de cotação funcional.

## 6. Plano independente, em ordem obrigatória

### Fase A — Congelar e inventariar
- Registrar branch/commit, arquivos, tamanhos e SHA-256.
- Identificar o protótipo original exato; não escolher por semelhança de nome.
- Manter cópia imutável do original e do `frontend/index.html`.
- Registrar separadamente as versões ZIP/protótipo/instalação e seus diffs conhecidos.

### Fase B — Testar o pacote isolado
- Executar a suíte de contratos do pacote em cópia de trabalho.
- Rodar testes destrutivos somente em diretório temporário isolado.
- Validar runtime, ponte, polling, menu, RH, auditoria e política fail-closed.
- Guardar saída, commit, código de saída e data. Teste não executado = não validado.

### Fase C — Verificar integrações reais
- Testar endpoints/portas sem revelar segredos.
- Testar cada feed por símbolo com timestamp, qualidade, latência e falhas.
- Testar LEVI/EU SOU com timeout curto e erros controlados.
- Fazer escrita/leitura real do ledger com evento de teste identificável e limpeza apenas se segura e prevista.
- Sem evidência, marcar pendente; nunca simular sucesso.

### Fase D — Integrar a sede original
- Fazer backup + SHA-256 do `frontend/index.html` e do protótipo.
- Integrar somente a aba Trade existente; preservar todas as outras abas e a cena original.
- Preferir rotas same-origin/proxy; não habilitar CORS amplo.
- Usar o instalador guardado em dry-run primeiro; conferir o diff e só então gravar.
- Testar inicialização, navegação, polling, erro de rede, payload inválido, retorno ao Turbo e ausência de efeitos colaterais.

### Fase E — Aceitação final e publicação
- Rodar toda a regressão local e os contratos CI.
- Conferir hashes, diff, logs, status de endpoints e evidência visual.
- Testar restauração do backup.
- Documentar o que funciona, o que está bloqueado e o modo de operação.
- Publicar/mesclar somente após revisão e checks necessários; não declarar 100% com pendências.

## 7. Critérios para declarar “pronto”

Todos devem ser verdadeiros e documentados:
- [ ] Protótipo 3D original está dentro da aba Trade real do Turbo.
- [ ] Outras abas do Turbo e PSM não foram alterados.
- [ ] Portas/serviços estão separados e respondem aos contratos esperados.
- [ ] Menu completo navega; itens sem integração mostram estado explícito.
- [ ] Os quatro mercados exibem somente dados com estado/timestamp coerentes; sem dados falsos.
- [ ] RH exibe somente atividade e métricas apoiadas por persistência/evidência.
- [ ] LEVI, EU SOU e auditoria passaram testes end-to-end.
- [ ] Execução real continua bloqueada por padrão; gates de risco passam.
- [ ] Testes de regressão, segurança, falhas e rollback passaram.
- [ ] Evidência reproduzível e relatório final foram arquivados.

**Percentual:** não atribuir percentual novo sem checklist medido por evidências. Sucesso do CI não significa que a instalação local está pronta.

## 8. Limite operacional deste registro

Este documento e as alterações no GitHub salvam o estado recuperável no repositório. Eles não editam automaticamente o disco Windows local. O arquivo local `C:\AdonaiTurbo\frontend\index.html` e o protótipo original não estão presentes no repositório conectado; portanto, nenhuma afirmação de instalação local deve ser feita até que exista uma execução local observável e validada.

**Regra de continuidade:** concluir → testar → validar → documentar → publicar → avançar. Um único plano canônico; nenhuma mistura com PSM; nenhuma ordem real; nenhuma exclusão especulativa.
