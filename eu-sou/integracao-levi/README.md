# Integração com LEVI

Definir contratos de recomendação com fontes e timestamps, método, hipóteses, alternativas, incerteza, riscos, aprovações e condições de parada. A documentação não habilita execução autônoma.

## Estado da validação — 2026-10-13

A rota de orquestração do LEVI respondeu HTTP 200 em teste anterior. Esse resultado, isoladamente, não comprova a comunicação ponta a ponta entre LEVI e o Cérebro EU SOU.

Ainda falta registrar um teste reproduzível que comprove:
1. A pergunta recebida pelo LEVI.
2. O encaminhamento explícito ao endpoint correto do EU SOU.
3. A resposta do EU SOU e a origem das evidências utilizadas.
4. O retorno da resposta ao LEVI.
5. A reprodução em áudio quando a pergunta é feita por voz.

Eventos anteriores de escuta contínua e transcrição no navegador não são prova suficiente de que uma pergunta científica falada seja encaminhada ao EU SOU e respondida por áudio.

## Registro histórico das subfases 4.1–4.3
O estado histórico e os critérios de continuidade estão consolidados em [PLANO_MESTRE_E_CHECKLIST.md](../PLANO_MESTRE_E_CHECKLIST.md): 4.1 foi registrada como validada; 4.2 foi aprovada em teste anterior com `levi: true`, `motor: "eu-sou"` e `validar_matematica` → `APROVADO`; 4.3 permanece parcial até que fontes, trechos recuperados e respostas sejam rastreados com evidências reproduzíveis. Repetir os testes é revalidação, não uma afirmação de que o trabalho anterior nunca ocorreu.

## Próximo teste — alinhamento Adonai Trade (2026-10-20)

A suíte de contratos do runtime isolado Adonai Trade passou no GitHub Actions, incluindo a verificação autenticada da trilha. Isso valida os contratos do runtime isolado, não a comunicação real com o backend local.

A árvore deste repositório não contém `backend/server.js`, `backend/levi-core.js` nem `backend/eu-sou-api.js`; portanto, não é possível verificar ou modificar as rotas locais de produção a partir deste repositório. O runtime Adonai Trade continua declarando EU SOU/LEVI como `not_verified`, corretamente: URL configurada não é prova de conectividade.

### Próxima ação obrigatória

1. No host Windows que executa os serviços, inspecionar sem alterações os handlers reais de `/api/levi/orquestrar` e `/api/eu-sou/calcular` e registrar os formatos de entrada/saída.
2. Executar uma consulta de teste por texto, com `correlation_id` único, confirmando pergunta → encaminhamento do LEVI → cálculo/resposta do EU SOU → retorno do LEVI. Capturar somente status, tempos, IDs de correlação e códigos de erro; não imprimir chaves nem respostas brutas que possam conter segredos.
3. Repetir para cada uma das quatro mesas apenas no modo paper e com adaptadores de cotação em leitura. Confirmar que RH e auditoria persistem eventos reais correlacionados.
4. Testar bloqueios: indisponibilidade, resposta malformada, dados vencidos, ausência de autorização, veto de risco e falha de auditoria.
5. Só depois implementar o adaptador de integração no runtime e marcar uma conexão como verificada.

Preservar a configuração atual da voz do LEVI. Não habilitar ordens reais. Não marcar a integração como concluída até que o fluxo completo tenha sido validado com evidência reproduzível.