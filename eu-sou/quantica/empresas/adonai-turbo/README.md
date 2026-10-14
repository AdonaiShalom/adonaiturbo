# ADONAI TURBO — pasta de conhecimento quântico do EU SOU

**Estado:** especificação de conhecimento versionada; ingestão na biblioteca local e execução por agentes ainda precisam de validação.  
**Escopo:** Integração, plataforma e orquestração.  
**Princípio:** o EU SOU fornece evidências e métodos; LEVI orquestra; agentes executam apenas tarefas autorizadas.

## 1. Conhecimento que o EU SOU deve disponibilizar
Busca científica com recuperação híbrida; fontes/trechos/score; API versionada do EU SOU; observabilidade; segurança e criptografia pós-quântica; validação de respostas e fallback.

## 2. Agentes e hierarquia operacional
LEVI coordena. Agente de conhecimento consulta EU SOU; integração chama apenas APIs autorizadas; qualidade testa recuperação e regressões; segurança valida permissões/segredos; release publica apenas artefatos aprovados.

## 3. Fontes públicas de referência para engenharia reversa responsável
- QuTiP — https://github.com/qutip/qutip
- Kwant — https://github.com/kwant-project/kwant
- OSSCAR Quantum Mechanics — https://github.com/osscar-org/quantum-mechanics
- PennyLane — https://github.com/PennyLaneAI/pennylane
- Qiskit Finance — https://github.com/qiskit-community/qiskit-finance
- quacc — https://github.com/Quantum-Accelerators/quacc
- OpenQDC — https://github.com/valence-labs/openQDC
- NIST Quantum Science — https://www.nist.gov/quantum-science
- National Nanotechnology Initiative — https://www.nano.gov/

As fontes são pontos de partida, não endossos. Conferir versão, manutenção, licença, dependências e aplicabilidade antes de instalar ou reproduzir.

## 4. Critérios de validação
Teste consultas sobre Schrödinger, qubits, pontos quânticos e criptografia pós-quântica. Respostas científicas precisam de fontes; baixa relevância deve gerar lacuna, não alucinação. Verificar timeout, versão do índice, health e logs.

## 5. Limites e segurança
Não conceder acesso irrestrito a shell, segredos ou dados de outras empresas. Separar PSM Grupo Market.

## 6. Requisitos de sincronização
- GitHub: versionar este documento, corpus, schemas e testes; não versionar segredos.
- Supabase: manter fontes, ferramentas, domínios, estado de revisão e proveniência; sincronização idempotente.
- Biblioteca local EU SOU: ingerir o conteúdo e validar recuperação por perguntas representativas.
- LEVI / servidor 3000: consultar a API EU SOU e citar resultados; testar indisponibilidade, timeout e ausência de evidência.
- Não declarar esta pasta como conhecimento carregado até comprovação por teste de recuperação.
