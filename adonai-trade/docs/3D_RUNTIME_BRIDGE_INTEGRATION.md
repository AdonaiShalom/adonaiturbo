# Adonai Trade — integração da sede 3D com o runtime

## Estado desta entrega

Este documento especifica a ligação segura entre o runtime HTTP e o protótipo original da sede 3D. **Não afirma que o HTML original já foi modificado**: o protótipo precisa passar pela rotina de recebimento e comparação por hash antes de qualquer alteração.

## Contrato disponível

**Separação de portas:** o servidor legado do Trade permanece em `3100`. O runtime fail-closed isolado desta branch usa `3107` por padrão para evitar conflito entre dois processos que disputam a mesma porta. A ponte/menu e os testes do runtime apontam para `3107`; não pare nem substitua o servidor legado para ativar este serviço.

O adaptador `public/runtime-bridge.js` expõe `AdonaiTradeRuntimeBridge.readState({ baseUrl })` e consulta somente:

- `GET /api/v1/markets`
- `GET /api/v1/integrations`

Se a sede for servida pelo mesmo origin com proxy para o runtime, usar `baseUrl: ''` (URLs relativas). Se houver outro origin, configurar proxy same-origin; o runtime não deve receber uma abertura CORS indiscriminada.

Exemplo de chamada no ponto de inicialização da sede:

```js
const state = await window.AdonaiTradeRuntimeBridge.readState({ baseUrl: '' });
// Encaminhe state apenas para o renderizador existente da sede.
// Não substitua o estado visual original nem invente equipes, decisões ou probabilidades.
```

## Menu funcional complementar para a sede original

Foi criado o arquivo `public/sede3d-menu.js`, com menu navegável para Sede 3D, RH, as quatro mesas (Cripto, Forex, B3 e Internacional), TradingView, Investing.com, Fear & Greed, Inteligência/Risco, LEVI, EU SOU e Auditoria. A camada não substitui nem redesenha a cena 3D original. Inclui consultas de cotação read-only e mostra explicitamente indisponibilidade/dados não verificados.

Depois de copiar o arquivo para o diretório público efetivamente servido, incluir no HTML original **após** a ponte de runtime e só depois da inspeção dos IDs/controles do protótipo:

```html
<script src="/adonai-trade/public/runtime-bridge.js"></script>
<script src="/adonai-trade/public/sede3d-menu.js"></script>
<script>
  window.adonaiTradeSedeMenu = window.AdonaiTradeSedeMenu.mount({
    runtimeBaseUrl: 'http://127.0.0.1:3107',
    pollIntervalMs: 15000
  });
</script>
```

O runtime foi ajustado para permitir CORS apenas das origens locais do Turbo `http://127.0.0.1:3000` e `http://localhost:3000`, configuráveis por `ADONAI_TRADE_ALLOWED_ORIGINS`. Essa permissão não é autenticação. A aplicação deve continuar em rede local confiável, e endpoints privilegiados continuam exigindo seus controles próprios. Testes HTTP cobrem origem permitida, origem negada e preflight.

**Importante:** esse menu é um módulo de integração criado nesta branch; não significa que já foi copiado para a instalação Windows nem incorporado ao HTML original. O HTML do Turbo e o protótipo original não estão na árvore conectada do GitHub. O passo final de instalação exige comparar o ZIP original e o HTML real, copiar o módulo para a pasta pública correta e testar visualmente sem danificar a cena 3D.

## Cliente de atualização periódica

O arquivo `public/runtime-bridge-client.js` acrescenta leitura inicial e atualização periódica (15 segundos por padrão), sem criar dados. Inclua os dois scripts depois do HTML base da sede e antes do código que recebe os eventos. O cliente publica `adonai-trade:runtime-state` no navegador; a sede precisa ligar esse evento aos componentes visuais existentes, após a inspeção do HTML original.

```html
<script src="/adonai-trade/public/runtime-bridge.js"></script>
<script src="/adonai-trade/public/runtime-bridge-client.js"></script>
<script>
  const runtimeClient = window.AdonaiTradeRuntimeClient.start({
    baseUrl: '',
    intervalMs: 15000,
    onState(state) {
      // Conectar aqui aos componentes existentes após inspecionar a sede.
      // Não inferir equipe ativa, decisão ou probabilidade.
      window.dispatchEvent(new CustomEvent('adonai-trade:runtime-state', { detail: state }));
    },
    onError(error) {
      window.dispatchEvent(new CustomEvent('adonai-trade:runtime-error', { detail: { message: error.message } }));
    }
  });
  // Se a sede for desmontada, chamar runtimeClient.stop().
</script>
```

Em falha de rede, o cliente publica um estado explícito `status: 'unavailable'`, com listas vazias e execução desabilitada, para que a interface não mantenha valores antigos como atuais. O callback `onError` também recebe a falha.

Este trecho é o ponto de integração preparado, não uma afirmação de que o HTML original já o contém. A ligação visual final depende da inspeção e alteração controlada do protótipo original.

A resposta normalizada distingue `fetchedAt` (hora local em que o cliente leu os endpoints) de `runtimeTimestamps.markets` e `runtimeTimestamps.integrations` (carimbos devolvidos pelo servidor). A hora de busca não deve ser apresentada como hora da cotação nem como prova de atualidade dos dados.

## Regras de renderização obrigatórias

1. Mostrar o modo `paper` e manter execução desabilitada.
2. Usar `providerConfigured` apenas como configuração declarada; não exibir como cotação conectada.
3. `quoteStatus: 'not_checked'` deve aparecer como “não verificado”, nunca como preço ao vivo.
4. `probability: null` significa que não há probabilidade validada fornecida pelo runtime. Não gerar um percentual substituto.
5. `activity: 'not_reported_by_runtime'` significa que a atividade real da equipe não está instrumentada. Não animar agentes como se estivessem executando trabalho real.
6. `authenticated: false` e status `not_verified` devem continuar visíveis como não verificados.
7. Erros HTTP/contrato devem produzir estado de indisponibilidade, sem manter indicadores antigos como se fossem atuais.

## Gates antes de integrar o HTML original

- [ ] Receber o ZIP original e confirmar SHA-256 esperado.
- [ ] Comparar em staging sem alterar produção; revisar todos os arquivos diferentes.
- [ ] Identificar o inicializador e os componentes 3D existentes; preservar identidade visual e navegação.
- [ ] Adicionar a ponte com alteração mínima e fallback de indisponibilidade.
- [ ] Testar endpoints e renderização em navegador, incluindo erro de rede e dados não verificados.
- [ ] Executar regressão isolada completa e registrar evidências.
- [ ] Revisar diff final antes de integrar ou publicar.

## Critério de aceite

A ponte está coberta por teste de contrato automatizado. Isso prova a transformação dos contratos simulados, não prova que o protótipo original foi conectado, que existem dados ao vivo, que probabilidades são cientificamente válidas ou que o ledger Supabase gravou eventos reais. Esses itens exigem validação separada.
