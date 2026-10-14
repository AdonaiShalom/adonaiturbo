# EU SOU — Fundamentos técnicos de física quântica e nanotecnologia
Versão 1.0 · 2026-10-14 · Síntese educacional original com referências para estudo; não substitui revisão científica nem validação experimental.

## 1. Modelo de conhecimento e evidência
O EU SOU deve separar (a) princípios consolidados, (b) aproximações/modelos, (c) resultados de simulação, (d) resultados experimentais, (e) hipóteses e (f) tendências. Cada resposta técnica deve indicar categoria, fonte, versão, unidade, suposições e limitações. Um resultado de simulação não é uma medição nem prova vantagem quântica.

## 2. Fundamentos
- Estado quântico: vetor normalizado em espaço de Hilbert; para sistemas mistos, matriz densidade ρ, positiva e com traço 1.
- Observável: operador Hermitiano. Valores medidos são autovalores; probabilidades vêm da regra de Born.
- Evolução isolada: equação de Schrödinger iℏ∂t|ψ⟩=H|ψ⟩. Para H independente do tempo, estados estacionários satisfazem Hψ=Eψ.
- Superposição não significa que qualquer estado produza qualquer resultado; amplitudes interferem e a medição segue probabilidades.
- Emaranhamento: estado conjunto que não se separa em produto de estados dos subsistemas. Não permite comunicação superluminal.
- Incerteza: ΔAΔB ≥ 1/2 |⟨[A,B]⟩| para observáveis A e B no estado considerado.
- Decoerência: perda de coerência observável por interação com ambiente; não deve ser confundida automaticamente com todo o problema de medição.
- Sistemas abertos: dinâmica efetiva pode usar equações mestras, por exemplo Lindblad, quando as hipóteses de Markov, aproximações e condições de validade forem adequadas.

## 3. Oscilador harmônico quântico
H=p²/(2m)+mω²x²/2; níveis E_n=ℏω(n+1/2), n=0,1,2,… A energia do estado fundamental é E_0=ℏω/2, não zero. Escala característica de comprimento x₀=√(ℏ/(2mω)) conforme convenção de amplitude do estado fundamental. Verificar unidades, definição de ω e convenção de x₀ antes de comparar fórmulas.

## 4. Tunelamento e confinamento
Tunelamento é a transmissão através de uma região classicamente proibida, dependente da forma/altura/largura da barreira e da energia. Em nanoescala, confinamento altera níveis permitidos e propriedades ópticas/eletrônicas. Não concluir que qualquer nanopartícula exibe comportamento idêntico: tamanho, composição, forma, superfície, defeitos, ambiente e temperatura importam.

## 5. Pontos quânticos e materiais 2D
Pontos quânticos podem apresentar níveis eletrônicos discretos associados ao confinamento; propriedades dependem de material, tamanho, estrutura, superfície e passivação. Grafeno e outros materiais 2D têm estruturas de bandas e respostas dependentes de composição, empilhamento, defeitos, substrato e condições de fabricação. Diferenciar previsão teórica, amostra fabricada e desempenho de dispositivo.

## 6. Estrutura eletrônica e DFT
DFT calcula propriedades eletrônicas a partir da densidade, com aproximações para o funcional de troca-correlação. Um relatório reproduzível registra geometria, composição, carga, multiplicidade, funcional, base/pseudopotencial, malha k quando aplicável, cutoff, condições de contorno, critérios de convergência, versão do código e análise de sensibilidade. Convergência numérica não garante exatidão física; comparação com benchmark/experimento é necessária.

## 7. Transporte quântico
Modelos tight-binding e formalismo de transporte (por exemplo, funções de Green fora do equilíbrio) dependem de Hamiltoniano, contatos, acoplamentos, condições de contorno e regime de coerência. Relatar transmissão, condutância e unidades, além de testar casos limite. Kwant é uma ferramenta especializada, não um simulador universal de todo material.

## 8. Sensoriamento quântico e metrologia
Sensores baseados em estados quânticos podem explorar coerência, spin, interferência ou estados comprimidos. Desempenho real exige modelo de ruído, largura de banda, calibração, deriva, temperatura, preparação/leitura do estado e comparação com sensores clássicos. “Sensibilidade quântica” não implica automaticamente vantagem no sistema completo.

## 9. Algoritmos e computação quântica
Qubits, portas, circuitos, ruído, compilação e medição precisam ser distinguidos de simulação clássica. QAOA/VQE e métodos híbridos exigem especificar encoding, ansatz, função custo, otimizador, número de shots, ruído e baseline clássico. Vantagem só pode ser alegada para uma tarefa definida, métrica justa, recursos comparáveis e evidência reproduzível.

## 10. Regras de cálculo e segurança epistemológica
1. Mostrar equações e definições das variáveis quando úteis.
2. Conferir unidades dimensionais.
3. Registrar hipóteses e domínio de validade.
4. Comparar com solução analítica em casos pequenos.
5. Fazer teste de convergência e análise de sensibilidade.
6. Reportar incerteza e não confundir precisão numérica com exatidão.
7. Citar a fonte primária e a versão usada.
8. Se não houver evidência, responder “não confirmado pelo acervo atual”.

## Referências técnicas iniciais
- MIT OpenCourseWare, Quantum Physics I/II: https://ocw.mit.edu
- QuTiP: https://github.com/qutip/qutip
- Kwant: https://github.com/kwant-project/kwant
- PySCF: https://github.com/pyscf/pyscf
- AiiDA Common Workflows: https://github.com/aiidateam/aiida-common-workflows
- NIST: https://www.nist.gov/quantum-information-science
- NSF quantum information science: https://www.nsf.gov/focus-areas/quantum

Status: síntese de conhecimento documentada. As fontes e os métodos precisam de revisão formal antes de serem marcados como validados no catálogo científico.