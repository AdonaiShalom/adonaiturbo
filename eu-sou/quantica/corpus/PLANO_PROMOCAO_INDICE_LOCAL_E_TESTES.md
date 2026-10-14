# EU SOU — Plano de promoção segura do corpus local
Data: 2026-10-14
Status: preparado; execução local bloqueada por ausência de canal de shell/localhost nesta sessão.

## Alvo
- Projeto: `C:\AdonaiTurbo`
- Biblioteca: `frontend\eu-sou-completo\biblioteca-local`
- Corpus: `eu-sou/quantica/corpus/CORPUS_INTEGRADO_CINCO_EMPRESAS_2026-10-14.md`
- Serviço de busca: `http://127.0.0.1:8765`
- LEVI: `backend\levi-core.js`
- API Adonai Turbo: `http://localhost:3000`

## Procedimento obrigatório
1. Baixar o corpus do GitHub para uma pasta de staging, nunca direto sobre o índice ativo.
2. Guardar cópia datada do `index.joblib` ativo e registrar SHA-256.
3. Confirmar o caminho de carregamento do índice em `biblioteca-local\server.py`.
4. Usar o ingest.py existente apenas em staging, apontando explicitamente para a pasta de documentos autorizada.
5. Inspecionar quantidade de documentos, fontes e trechos e conferir que os cinco módulos empresariais estão presentes.
6. Executar testes de recuperação abaixo no índice de staging.
7. Promover o índice somente se todos os testes obrigatórios passarem; manter rollback.
8. Reiniciar o serviço de busca de forma controlada e validar `/health` e `/search`.
9. Reiniciar Adonai Turbo pelo procedimento habitual e validar consulta LEVI → EU SOU via `:3000`.
10. Registrar evidências no Supabase e neste status. Não marcar fase concluída sem logs/resultados.

## Consultas de aceitação
- Física: `equacao de Schrodinger oscilador harmonico energia ponto zero`
- Nanotecnologia: `pontos quanticos nanofotonica nanoestrutura sensores quanticos`
- Laboratório: `PySCF DFT estrutura eletronica convergencia`
- Marketing: `teste A/B causalidade mensuracao tendencias tecnologia`
- Finanças: `risco financeiro cenarios drawdown sensibilidade tecnologia quantica`
- Trade: `QUBO Ising backtesting slippage otimizacao baseline classico`
- Adonai Turbo: `recuperacao cientifica score fonte proveniencia latencia`

## Critérios mínimos
- Cada consulta retorna pelo menos um documento pertinente dos módulos/fonte corretos.
- Não aceitar apenas correspondência lexical com “quantum” ou criptografia pós-quântica quando a pergunta é física/nanotecnologia.
- Registrar top-k, nome de arquivo, trecho, score e latência.
- Resposta do LEVI cita o material recuperado e admite falta de evidência quando não há correspondência.
- Testar indisponibilidade/timeout sem alucinação.
- Não instalar automaticamente QuTiP, PySCF, DeepChem, AiiDA, PennyLane, Cirq, Kwant ou Qiskit Finance; manter candidatos até revisão de dependências/licenças e piloto isolado.

## Estado confirmado
- Cinco módulos empresariais publicados no GitHub.
- Corpus consolidado publicado no GitHub.
- Catálogo Supabase inclui documentos e candidatos a ferramentas; estados permanecem não validados/candidatos.
- Ainda não há evidência de ingestão no índice local nem de resposta do LEVI com este corpus.
