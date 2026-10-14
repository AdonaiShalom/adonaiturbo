# LEVI — auditoria e integração

## Objectivo
Auditar o orquestrador LEVI do Adonai Turbo, preservar identidade/voz e manter cada módulo dentro do seu âmbito. Esta pasta é documentação e plano de trabalho; não substitui o código executável que está em `C:\AdonaiTurbo`.

## Limite verificado nesta sessão
O repositório GitHub `AdonaiShalom/adonaiturbo` na branch `main` é a edição FreeLLMAPI/Vercel e não contém `backend/levi-core.js` nem `backend/server.js` nos caminhos esperados. Portanto, não é uma cópia verificável do backend local que serve `http://localhost:3000`. Não alterar o backend por suposição.

## Estado
- [x] Criada pasta documental `LEVI`.
- [x] Branch de trabalho isolada baseada em `main`: `feature/levi-auditoria-integracao-limpa`.
- [ ] Inventariar o backend local real: `backend/server.js`, `backend/levi-core.js`, `backend/.env` (nunca partilhar valores secretos), módulos carregados e rotas.
- [ ] Confirmar identidade, prompt, motor escolhido e fallback sem alterar a voz configurada.
- [ ] Mapear integrações autorizadas: motor científico EU SOU, Supabase do projecto Adonai Turbo e módulos internos.
- [ ] Confirmar ausência de referências cruzadas ou acesso ao projecto PSM Grupo Market.
- [ ] Rever autenticação, validação de entrada, timeouts, tratamento de erros, registos e limites de execução.
- [ ] Implementar mudanças pequenas em módulo separado, com backup e testes.
- [ ] Testar endpoint local, pedidos inválidos, indisponibilidade do motor, fallback e idempotência onde aplicável.
- [ ] Documentar evidência dos testes e abrir PR para revisão.
- [ ] Só publicar depois de validação ponta a ponta.

## Arquitectura recomendada
- LEVI é o orquestrador, não o dono dos dados científicos nem das credenciais de outros módulos.
- A integração com a âncora EU SOU deve ser feita por uma interface de backend dedicada, usando credenciais de servidor e sem as expor ao browser.
- O motor científico existente `backend/eu-sou-api.js` deve continuar independente da API de orquestração LEVI.
- PSM Grupo Market permanece projecto separado; não reutilizar tabelas, variáveis, credenciais, portas ou lógica específica do PSM.
- Não criar tabelas ou funções SQL adicionais para LEVI sem requisito demonstrado.

## Critério de conclusão
Só marcar como concluído depois de o backend local real ter sido inspeccionado e os testes de integração executados. A documentação e a branch, por si só, não significam que a auditoria técnica esteja concluída.
