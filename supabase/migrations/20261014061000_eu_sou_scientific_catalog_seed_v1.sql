-- EU SOU scientific catalog v1: seed taxonomy, candidate tools and phase gates.
-- Idempotent metadata only. No runtime access or scientific result is asserted by these rows.

insert into eu_sou.science_domains (slug,name,parent_slug,description,domain_kind,status) values
('mathematics','Matemática científica',null,'Álgebra, cálculo, unidades, análise numérica e incerteza.','mathematics','active'),
('physics','Física',null,'Fundamentos e modelos físicos clássicos e modernos.','physics','active'),
('quantum-physics','Física quântica','physics','Estados, operadores, spin, medição, tunelamento e sistemas quânticos abertos.','quantum_physics','active'),
('quantum-computing','Computação quântica','quantum-physics','Circuitos, algoritmos, compilação, ruído, medições e comparação com métodos clássicos.','quantum_computing','active'),
('quantum-chemistry','Química quântica','quantum-physics','Estrutura eletrónica, orbitais, estados excitados e superfícies de energia.','quantum_chemistry','active'),
('materials-science','Ciência dos materiais',null,'Estruturas, composição, defeitos, propriedades e caracterização.','materials_science','active'),
('quantum-nanotechnology','Nanotecnologia quântica','materials-science','Confinamento quântico, pontos quânticos e propriedades emergentes à escala nanométrica.','quantum_nanotechnology','active'),
('nanoelectronics','Nanoeletrónica e spintrónica','quantum-nanotechnology','Transporte, dispositivos de tunelamento, spintrónica e materiais 2D.','nanoelectronics','active'),
('quantum-sensing','Sensores quânticos','quantum-physics','Sensibilidade, seletividade, calibração, ruído e incerteza de sensores.','quantum_sensing','active'),
('photonics','Óptica e fotónica','quantum-physics','Interação luz-matéria, emissão, absorção, fluorescência e fotodetetores.','photonics','active'),
('molecular-simulation','Simulação molecular',null,'Modelos moleculares; separar dinâmica clássica de métodos eletrónicos/quânticos.','molecular_simulation','active'),
('food-science','Ciência alimentar',null,'Qualidade, contaminantes, métodos analíticos e aplicações alimentares seguras.','food_science','active'),
('safety','Segurança e impacto',null,'Toxicologia, exposição, migração, risco e impacto ambiental.','safety','active'),
('scientific-computing','Computação científica',null,'Workflows, reprodutibilidade, dados, testes e proveniência.','scientific_computing','active')
on conflict (slug) do update set
 name=excluded.name, parent_slug=excluded.parent_slug, description=excluded.description,
 domain_kind=excluded.domain_kind, status=excluded.status, updated_at=now();

insert into eu_sou.scientific_tools
(slug,name,repository_url,documentation_url,tool_kind,license_spdx,supported_platforms,capabilities,limitations,review_status)
values
('qutip','QuTiP','https://github.com/qutip/qutip','https://qutip.org/','quantum_simulator','BSD-3-Clause',array['Python','Windows via compatible environment','Linux'], '["quantum states","operators","open quantum systems","time evolution"]'::jsonb,'Não substitui DFT nem simulação atomística; validar versão, escala e resultados com benchmarks.','candidate'),
('qiskit','Qiskit','https://github.com/Qiskit/qiskit','https://qiskit.org/','quantum_sdk','Apache-2.0',array['Python','Linux','Windows via compatible environment'], '["quantum circuits","transpilation","measurement","quantum information"]'::jsonb,'Simulação clássica tem limites de escala; hardware real implica custo, ruído e credenciais.','candidate'),
('pennylane','PennyLane','https://github.com/PennyLaneAI/pennylane','https://pennylane.ai/','quantum_sdk','Apache-2.0',array['Python','Linux','Windows via compatible environment'], '["hybrid quantum-classical","automatic differentiation","quantum chemistry interfaces"]'::jsonb,'Sobreposição parcial com outros SDKs; comparar com Qiskit antes de adotar ambos.','candidate'),
('pymatgen','pymatgen','https://github.com/materialsproject/pymatgen','https://pymatgen.org/','materials_analysis','MIT',array['Python','Linux','Windows'], '["crystal structures","composition","defects","surfaces","materials analysis"]'::jsonb,'Ferramenta de análise; não é, por si só, um motor DFT.','candidate'),
('matminer','matminer','https://github.com/hackingmaterials/matminer','https://hackingmaterials.lbl.gov/matminer/','materials_data','BSD-3-Clause',array['Python','Linux','Windows'], '["materials datasets","featurization","materials data mining"]'::jsonb,'Proveniência e licença de cada dataset devem ser verificadas.','candidate'),
('aiida-core','AiiDA Core','https://github.com/aiidateam/aiida-core','https://aiida-core.readthedocs.io/','workflow_engine','MIT',array['Python','Linux'], '["workflow provenance","calculation orchestration","scientific data lineage"]'::jsonb,'Pode duplicar os workflows existentes; avaliar antes de introduzir nova camada.','candidate'),
('pyiron-atomistics','pyiron_atomistics','https://github.com/pyiron/pyiron_atomistics','https://pyiron.org/','atomistic_simulation','BSD-3-Clause',array['Python','Linux'], '["atomistic workflows","materials simulation"]'::jsonb,'Confirmar executáveis externos, RAM/CPU, ambiente e licença de cada dependência.','candidate'),
('openmm','OpenMM','https://github.com/openmm/openmm','https://openmm.org/','molecular_dynamics','MIT',array['Python','Linux','Windows'], '["molecular dynamics","molecular mechanics"]'::jsonb,'Dinâmica molecular clássica; não deve ser descrito como motor quântico ou DFT.','candidate')
on conflict (slug) do update set
 name=excluded.name, repository_url=excluded.repository_url, documentation_url=excluded.documentation_url,
 tool_kind=excluded.tool_kind, license_spdx=excluded.license_spdx,
 supported_platforms=excluded.supported_platforms, capabilities=excluded.capabilities,
 limitations=excluded.limitations, review_status=excluded.review_status, updated_at=now();

insert into eu_sou.phase_checkpoints (phase_number,phase_name,status,acceptance_criteria) values
(1,'Inventário e preservação','in_progress','["Inventário local/remoto reconciliado","Backups verificáveis","Componentes ativos identificados"]'::jsonb),
(2,'Motor científico e contratos','planned','["Schemas de entrada/saída","Unidades e erros definidos","Testes científicos reproduzíveis"]'::jsonb),
(3,'Conhecimento e recuperação','planned','["Fontes rastreáveis","Benchmark de recuperação","Proveniência e licenças"]'::jsonb),
(4,'Integração EU SOU–LEVI','in_progress','["Servidor ativo testado","Quatro comandos científicos validados","Fluxo ponta a ponta rastreável"]'::jsonb),
(5,'Revalidação integral e segurança','planned','["Regressão e integração aprovadas","Permissões e RLS revistas","Plano de recuperação validado"]'::jsonb),
(6,'Expansão do conhecimento','planned','["Taxonomia aprovada","Fontes com metadados","Qualidade de recuperação medida"]'::jsonb),
(7,'Física e computação quântica','planned','["Benchmarks analíticos aprovados","Motor piloto selecionado","Simulação e hardware distinguidos"]'::jsonb),
(8,'Nanotecnologia quântica e materiais','planned','["Métodos adequados por domínio","Benchmarks reproduzidos","Segurança e incerteza documentadas"]'::jsonb),
(9,'Agentes e aplicações empresariais','planned','["Contratos de agentes definidos","Fluxos ponta a ponta testados","Fronteiras entre empresas preservadas"]'::jsonb),
(10,'Auditoria, publicação e melhoria contínua','planned','["Evidências auditáveis","Documentação e rollback","Release validada"]'::jsonb)
on conflict (phase_number) do update set
 phase_name=excluded.phase_name,
 acceptance_criteria=excluded.acceptance_criteria,
 updated_at=now();
