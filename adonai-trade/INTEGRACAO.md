# Adonai Trade — contrato de integração

Estado verificado em 2026-10-15. Este documento registra o estado observado; não declara conexões ativas sem teste ponta a ponta.

## Separação de serviços

- Adonai Trade: porta local `3100`.
- Adonai Turbo / LEVI / EU SOU: porta local `3000`.
- PSM Grupo Market: porta local `3001`; permanece independente e fora deste escopo.
- Não publicar segredos, tokens, arquivos `.env`, chaves de auditoria, logs operacionais ou dados privados no Git.

## GitHub

- Repositório existente: `AdonaiShalom/adonaiturbo`.
- Diretório: `adonai-trade/`.
- Estado observado no branch `main`: README presente; o código executável local do Adonai Trade ainda não foi confirmado/publicado neste diretório.
- A integração deve continuar em branch/PR isolada até revisão do código local, testes e varredura de segredos.

## Supabase

- Projeto: `adonaiturbo` (ref `qyeduepihkxgrwotqnhb`).
- Schema: `adonai_trade`.
- Tabela de estado: `adonai_trade.integration_status` (RLS habilitado).
- A tabela registra estado observado; seus valores não substituem testes de conectividade, autenticação, permissões e persistência.
- Nunca expor uma chave Supabase secreta no navegador, no Git ou em logs.

## EU SOU — Cérebro

Endpoint local conhecido no Adonai Turbo:

`POST http://127.0.0.1:3000/api/eu-sou/calcular`

Estado: pendente de validação ponta a ponta pelo processo do Trade. Confirmar contrato JSON, autenticação, timeout, resposta de erro e rastreabilidade antes de considerar conectado.

## LEVI — orquestrador e registrador de auditoria

Endpoint local conhecido no Adonai Turbo:

`POST http://127.0.0.1:3000/api/levi/orquestrar`

Estado: pendente de validação ponta a ponta. Confirmar que solicitações do Trade são autorizadas, que decisões/recomendações são registradas e que falhas de auditoria não são silenciosamente ignoradas. O LEVI coordena; não deve transformar recomendações científicas ou sinais de mercado em ordens reais sem autorização explícita e salvaguardas.

## Rede e publicação

- `127.0.0.1` só aponta para a própria máquina/contêiner. Se Trade e Turbo forem implantados em serviços diferentes, substituir a URL local por uma variável de ambiente de URL privada/pública autenticada, por exemplo `ADONAI_TURBO_BASE_URL`; não codificar um endereço de produção sem verificar o ambiente.
- Webhooks do TradingView exigem endpoint público HTTPS. A documentação oficial informa que apenas portas 80 e 443 são aceitas e que a solicitação pode ser cancelada se o servidor demorar mais de 3 segundos. Portanto, a porta local 3100, por si só, não é um endpoint de webhook público.
- Não habilitar execução automática de ordens. Testar apenas com eventos simulados.

## Critérios para declarar a integração concluída

1. Código local revisado e sincronizado em branch isolada, sem segredos.
2. Configuração de ambiente documentada sem valores secretos.
3. Teste autenticado Trade → Supabase e leitura/escrita mínima verificada.
4. Testes Trade → EU SOU e Trade → LEVI aprovados, incluindo timeout, indisponibilidade e erros de autenticação.
5. Confirmação de que os eventos de auditoria são persistidos e não contêm segredos.
6. Testes externos de HTTPS para webhook e verificação de logs.
7. Revisão de segurança aprovada antes de merge/deploy.

Até que esses critérios sejam comprovados, o estado correto é **parcial / pendente de validação**.
