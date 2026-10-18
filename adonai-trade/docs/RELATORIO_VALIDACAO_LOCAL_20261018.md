# Relatório de validação local — Adonai Trade
Data da evidência: 2026-10-18
Branch de referência: `work/adonai-trade-runtime-contracts-20261017`

## Resultado observado

Saída de PowerShell fornecida pelo usuário para `http://127.0.0.1:3100`:

- `GET /trade3d-operacional`: HTTP 200; 357.173 bytes.
- Marcador `__adNativeFetch`: presente.
- Código relacionado a Three.js/WebGL: detectado.
- `GET /api/equipes`: HTTP 200.
- `GET /api/analistas`: HTTP 200.
- `GET /api/rh`: HTTP 200.
- `GET /api/mesa`: HTTP 200.
- `GET /api/ativos`: HTTP 200; 27 itens.
- `GET /api/analise?ativo=BTCUSDT`: HTTP 200; 250 pontos.

## O que essa evidência prova

A página operacional é servida pelo runtime local, contém a ponte de dados esperada e as seis rotas GET respondem com HTTP 200 no ambiente local informado.

## Limites da evidência

Esta evidência veio da saída de terminal do usuário; não foi executada diretamente pelo conector GitHub. Ela não prova, por si só:

- renderização visual correta da cena 3D no navegador;
- compatibilidade de todos os painéis com os formatos reais das APIs;
- cotações atuais verificadas dos quatro mercados, com fonte e frescor;
- que todas as ações da interface deixaram de usar mocks;
- proxy autenticado para escrita RH;
- persistência de auditoria via runtime;
- integração ponta a ponta com LEVI e EU SOU;
- publicação ou release concluído.

## Próximos gates

1. Abrir `/trade3d-operacional` no navegador e confirmar visualmente a cena original, os painéis e erros de console.
2. Comparar cada endpoint consumido pela página com o formato do payload real; substituir mock somente com contrato e teste correspondente.
3. Validar as quatro mesas com status explícito `verified / stale / unverified / unavailable`, fonte e timestamp.
4. Provar gravação e leitura de auditoria pelo runtime e validar a proteção RLS/grants.
5. Executar testes ponta a ponta LEVI e EU SOU, com correlação e auditoria.
6. Executar `npm test`, regressão visual e rollback antes do release.

## Segurança

Modo paper/simulação; execução financeira real permanece desabilitada. Não inventar atividade de equipes nem probabilidades. A ausência de cotação verificada deve ser mostrada explicitamente.
