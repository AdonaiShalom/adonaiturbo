# Adonai Trade

Módulo independente de análise e operações de mercado do ecossistema Adonai.

## Execução local
- Servidor local: `http://127.0.0.1:3100/`
- O Adonai Turbo permanece na porta `3000`.
- Este módulo não deve ser misturado ao PSM Grupo Market.

## Estado das integrações
Consulte [INTEGRACAO.md](./INTEGRACAO.md) para o estado verificado, os contratos conhecidos e os critérios necessários para considerar cada integração ativa.

- GitHub: o diretório existe; o código executável local ainda não foi confirmado/publicado neste diretório.
- Supabase: schema `adonai_trade` e tabela de estado existem no projeto `adonaiturbo`; a conexão de runtime do processo Trade ainda precisa de teste.
- EU SOU: endpoint local conhecido, integração ponta a ponta pendente de validação.
- LEVI: endpoint local conhecido, integração ponta a ponta pendente de validação.

## Regras de segurança
- Não armazenar segredos, tokens ou chaves neste repositório.
- Credenciais ficam em variáveis de ambiente do servidor.
- Não conceder acesso público às tabelas de negociação.
- Não declarar uma integração ativa até testar conexão, autenticação e leitura/escrita.
