# RH Adonai — arquitetura e plano de aprendizado controlado

Data: 2026-10-14  
Branch: `feature/rh-adonai-5-empresas`

## Escopo

O RH Adonai atende somente estas cinco empresas: Adonai Turbo, Adonai Marketing Digital, Adonai Finanças, Adonai Lab e Adonai Trade. O PSM Grupo Market permanece fora deste módulo, com dados, credenciais, backend e permissões próprios.

## Hierarquia inicial

- **Direção de RH** — priorização, governança e prestação de contas.
- **Especialistas funcionais** — recrutamento; integração; capacitação; desempenho; relações humanas; administração; analytics de pessoas.
- **Controles independentes** — privacidade/compliance; pesquisa EU SOU; validação e testes; auditoria de recomendações.
- **EU SOU** pesquisa e sintetiza conhecimento com proveniência; **LEVI** encaminha tarefas e recomendações aos agentes da empresa correta. Nenhum agente recebe autorização implícita para executar alterações em produção.

## Quantidade inicial de agentes

12 funções lógicas no protótipo. A quantidade é um ponto de partida operacional, não uma afirmação de que sejam 12 processos autônomos já implantados. Consolidar ou separar agentes somente após medir volume, latência, qualidade, custo e segregação de acesso.

## Categorias do menu RH Adonai

1. Talentos e recrutamento
2. Treinamento e desenvolvimento
3. Desempenho e carreira
4. Pessoas, clima e segurança
5. Administração e conformidade
6. Inteligência e melhoria contínua

## Pipeline de aprendizado

1. Descobrir fontes públicas e repositórios; registrar URL, licença, versão/commit, data e finalidade.
2. Revisar manualmente dependências, licença, segurança, privacidade e instruções potencialmente maliciosas. Nunca executar código público não revisado no ambiente de produção.
3. Importar conhecimento permitido para um conjunto isolado, com proveniência e hash.
4. Definir hipótese, baseline, conjunto de avaliação e métricas antes de qualquer mudança.
5. Executar testes e regressões em sandbox; comparar resultado com baseline e manter registro de falhas.
6. Produzir recomendação versionada com evidências, limitações, riscos, testes e plano de rollback.
7. Submeter à revisão humana responsável. Só depois da aprovação, promover a versão para o ambiente autorizado.
8. Monitorar resultados e reverter automaticamente apenas mudanças previamente autorizadas e com rollback seguro.

## Salvaguardas de RH

- Não automatizar decisões finais de contratação, demissão, remuneração, promoção ou avaliação individual.
- Não inferir características sensíveis; evitar triagem discriminatória e documentar critérios relacionados ao cargo.
- Minimizar dados pessoais, restringir acesso por empresa e função, registrar auditoria e definir retenção.
- Não enviar CVs, avaliações ou outros dados pessoais a modelos externos sem autorização, base legal, contrato e controles adequados.
- As conexões visuais na teia representam relações de supervisão/revisão, não permissões técnicas.
- Recomendações precisam citar evidências verificáveis; ausência de evidência deve aparecer como pendência.

## Estado de implementação desta entrega

- A aba/menu RH Adonai foi adicionada ao HTML público numa branch de trabalho.
- O protótipo apresenta 12 nós de agentes, conexões SVG animadas com perspectiva 3D CSS, seleção de agentes, seleção de empresa, categorias expansíveis e registro local de ações.
- Os registros atuais usam `localStorage` no navegador e são apenas um protótipo; ainda não há persistência no Supabase, autenticação, autorização real por empresa, rotas backend do RH ou integração de execução com LEVI.
- A interface não deve ser tratada como RH operacional nem armazenar dados reais de candidatos/funcionários até implementar e testar autenticação, políticas de acesso, auditoria e armazenamento protegido.
- A revisão de sintaxe JavaScript do HTML passou; testes funcionais no navegador, responsividade, acessibilidade, segurança e integração de ponta a ponta ainda são pendentes.
