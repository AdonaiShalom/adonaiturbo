# Adonai Trade

Módulo independente de análise e operações de mercado do ecossistema Adonai.

## Execução local
- Servidor local: `http://127.0.0.1:3100/`
- O Adonai Turbo permanece na porta `3000`.
- Este módulo não deve ser misturado ao PSM Grupo Market.

## Integrações planejadas / a validar
- GitHub: versionamento do código deste módulo.
- Supabase: schema privado `adonai_trade` no projeto Supabase `adonaiturbo`.
- EU SOU: consumir conhecimento e recomendações científicas por contrato de API explícito.
- LEVI: receber solicitações/orquestração por endpoint autenticado e auditável.

## Regras de segurança
- Não armazenar segredos, tokens ou chaves neste repositório.
- Credenciais ficam em variáveis de ambiente do servidor.
- Não conceder acesso público às tabelas de negociação.
- Não declarar uma integração ativa até testar conexão, autenticação e leitura/escrita.
