# ADONAI LAB — pasta de conhecimento quântico do EU SOU

**Estado:** especificação de conhecimento versionada; ingestão na biblioteca local e execução por agentes ainda precisam de validação.  
**Escopo:** Pesquisa e simulação de física quântica e nanodispositivos.  
**Princípio:** o EU SOU fornece evidências e métodos; LEVI orquestra; agentes executam apenas tarefas autorizadas.

## 1. Conhecimento que o EU SOU deve disponibilizar
Mecânica quântica; equação de Schrödinger; química quântica/DFT; tight-binding e transporte; pontos quânticos, nanofios, poços e materiais 2D; nanoeletrônica; nanofotônica; sensores/metrologia; fabricação e caracterização; análise SEM; segurança de nanomateriais.

## 2. Agentes e hierarquia operacional
Agente bibliográfico rastreia fontes; modelagem define equações; simulação executa ferramentas; metrologia quantifica erro; experimento caracteriza amostras; reprodutibilidade valida; segurança controla procedimentos.

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
Registrar material/geometria, parâmetros, unidades, método, versão, convergência, sensibilidade, baseline, incerteza e proveniência. Separar resultado teórico, simulado, observado e replicado.

## 5. Limites e segurança
Não declarar simulação como experimento. Verificar licença e segurança de dados/materiais antes do uso.

## 6. Requisitos de sincronização
- GitHub: versionar este documento, corpus, schemas e testes; não versionar segredos.
- Supabase: manter fontes, ferramentas, domínios, estado de revisão e proveniência; sincronização idempotente.
- Biblioteca local EU SOU: ingerir o conteúdo e validar recuperação por perguntas representativas.
- LEVI / servidor 3000: consultar a API EU SOU e citar resultados; testar indisponibilidade, timeout e ausência de evidência.
- Não declarar esta pasta como conhecimento carregado até comprovação por teste de recuperação.
