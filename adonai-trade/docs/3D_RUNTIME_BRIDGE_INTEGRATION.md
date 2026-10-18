# Adonai Trade — integração da sede 3D com o runtime

## Estado desta entrega

Este documento especifica a ligação segura entre o runtime HTTP e o protótipo original da sede 3D. **Não afirma que o HTML original já foi modificado**: o protótipo precisa passar pela rotina de recebimento e comparação por hash antes de qualquer alteração.

## Contrato disponível

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

Este trecho é o ponto de integração preparado, não uma afirmação de que o HTML original já o contém. A ligação visual final depende da inspeção e alteração controlada do protótipo original.

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
