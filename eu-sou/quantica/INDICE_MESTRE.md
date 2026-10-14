# EU SOU — Índice mestre das cinco pastas empresariais
**Data:** 2026-10-14  
**Status:** estrutura documental publicada no GitHub e catalogada no Supabase; ingestão local e consulta por LEVI ainda não validadas.

## Estrutura
```text
eu-sou/
└── quantica/
    ├── corpus/
    │   └── NUCLEO_CIENTIFICO_QUANTICA_NANOTECNOLOGIA.md
    ├── empresas/
    │   ├── adonai-turbo/README.md
    │   ├── adonai-marketing-digital/README.md
    │   ├── adonai-financas/README.md
    │   ├── adonai-lab/README.md
    │   └── adonai-trade/README.md
    ├── PLANO_ESTRATEGICO_CINCO_OPERACOES.md
    └── INDICE_MESTRE.md
```

## Pastas empresariais
1. [Adonai Turbo](./empresas/adonai-turbo/README.md) — integração, recuperação científica, API, segurança e qualidade.
2. [Adonai Marketing Digital](./empresas/adonai-marketing-digital/README.md) — tendências, estatística, experimentação e alegações científicas.
3. [Adonai Finanças](./empresas/adonai-financas/README.md) — probabilidade, otimização, risco e avaliação crítica de tecnologias.
4. [Adonai Lab](./empresas/adonai-lab/README.md) — física quântica, nanomateriais, simulações, metrologia e experimentos.
5. [Adonai Trade](./empresas/adonai-trade/README.md) — pesquisa quantitativa, QUBO/Ising quando adequado, backtests e controles. **Não instalado até prova.**

## Conteúdo compartilhado
- [Corpus científico inicial](../corpus/NUCLEO_CIENTIFICO_QUANTICA_NANOTECNOLOGIA.md)
- [Plano estratégico e tendências](../PLANO_ESTRATEGICO_CINCO_OPERACOES.md)
- Fontes públicas de referência: QuTiP, Kwant, OSSCAR, PennyLane, Qiskit Finance, quacc, OpenQDC, NIST e National Nanotechnology Initiative. Ver o plano para links, uso pretendido e limites.

## Como o conhecimento deve chegar aos sistemas
- **GitHub:** fonte versionada dos documentos e critérios de validação.
- **Supabase:** catálogo de documentos/fontes/domínios, estado de revisão e metadados. Catalogar um link não significa que o texto completo foi ingerido.
- **Biblioteca local EU SOU:** deve ingerir os documentos e reconstruir o índice em diretório de trabalho com backup e testes, sem sobrescrever o índice atual antes da validação.
- **LEVI / servidor 3000:** deve consultar a API do EU SOU e utilizar evidências recuperadas; não responder com base apenas no catálogo.
- **Agentes:** usar apenas os documentos e ações permitidos à empresa correspondente. PSM Grupo Market fica isolado.

## Protocolo de atualização
1. Registrar fonte, URL, data, versão/commit, licença, método de extração e hash.
2. Revisar confiabilidade e aplicabilidade antes de indexar.
3. Atualizar o catálogo Supabase de forma idempotente.
4. Ingerir numa cópia/versionamento separado do índice ativo.
5. Testar consultas representativas por pasta, relevância e origem.
6. Testar LEVI → EU SOU em :3000 com fonte citada, timeout e ausência de resultado.
7. Só então promover índice e documentar rollback.

## Limites
Este índice organiza conhecimento e especificações. Não prova que as pastas estejam sincronizadas com a biblioteca local, que agentes estejam instalados, nem que o servidor 3000 já esteja consultando o conteúdo. Essas etapas precisam de testes verificáveis.
