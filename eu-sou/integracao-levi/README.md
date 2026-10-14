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

## Próximo teste

Inspecionar as rotas e os contratos existentes antes de modificar o código. Executar primeiro um teste por texto com identificador de correlação e logs; depois testar voz e reprodução de áudio. Preservar a configuração atual da voz do LEVI, salvo solicitação explícita do responsável.

Não marcar a integração como concluída até que o fluxo completo tenha sido validado.