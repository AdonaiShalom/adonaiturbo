-- Adonai Trade excellence backlog and evidence registry
-- Applied to Supabase project adonaiturbo on 2026-10-17.
-- Reproducible source record; review privileges and project migration history before reapplying elsewhere.

create table if not exists adonai_trade.excellence_work_items (
  id uuid primary key default gen_random_uuid(),
  work_key text not null unique,
  component text not null check (component in ('core','audit','security','crypto','forex','b3','international','eu_sou','levi','rh','github','supabase','delivery')),
  priority text not null check (priority in ('P0','P1','P2','P3','P4')),
  title text not null,
  description text not null default '',
  status text not null default 'planned' check (status in ('planned','in_progress','blocked','verified','deferred')),
  acceptance_criteria jsonb not null default '[]'::jsonb,
  source_reference text,
  owner_role text not null default 'engineering',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  verified_at timestamptz,
  check (jsonb_typeof(acceptance_criteria) = 'array')
);

create table if not exists adonai_trade.excellence_evidence (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references adonai_trade.excellence_work_items(id) on delete restrict,
  evidence_type text not null check (evidence_type in ('github_review','supabase_inspection','automated_test','manual_test','security_review','benchmark','deployment_check','document')),
  source_reference text,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  verified boolean not null default false,
  observed_at timestamptz not null default now(),
  recorded_at timestamptz not null default now(),
  check (jsonb_typeof(details) = 'object')
);

create index if not exists excellence_work_items_status_priority_idx
  on adonai_trade.excellence_work_items (status, priority, component);
create index if not exists excellence_evidence_work_item_observed_idx
  on adonai_trade.excellence_evidence (work_item_id, observed_at desc);

alter table adonai_trade.excellence_work_items enable row level security;
alter table adonai_trade.excellence_evidence enable row level security;
revoke all on adonai_trade.excellence_work_items from public, anon, authenticated;
revoke all on adonai_trade.excellence_evidence from public, anon, authenticated;
grant all on adonai_trade.excellence_work_items to service_role;
grant all on adonai_trade.excellence_evidence to service_role;

drop policy if exists excellence_work_items_service_role_all on adonai_trade.excellence_work_items;
create policy excellence_work_items_service_role_all
  on adonai_trade.excellence_work_items for all to service_role
  using (true) with check (true);
drop policy if exists excellence_evidence_service_role_all on adonai_trade.excellence_evidence;
create policy excellence_evidence_service_role_all
  on adonai_trade.excellence_evidence for all to service_role
  using (true) with check (true);

comment on table adonai_trade.excellence_work_items is
  'Backlog controlado de engenharia de excelência do Adonai Trade; não representa prova de execução.';
comment on table adonai_trade.excellence_evidence is
  'Evidências auditáveis associadas ao backlog; verified só deve ser true após revisão verificável.';

insert into adonai_trade.excellence_work_items
(work_key,component,priority,title,description,status,acceptance_criteria,source_reference) values
('AT-001','audit','P0','Diagnosticar e reparar a cadeia de auditoria','Reproduzir a quebra histórica relatada na sequência 76 e assinaturas inválidas 77–86; preservar a cópia original e documentar causa-raiz antes de corrigir.','blocked','["reprodução isolada","causa-raiz documentada","teste de cadeia íntegra","testes negativos de alteração/replay/concorrência","nenhum dado original apagado"]'::jsonb,'Histórico de validação local relatado em 2026-10-16'),
('AT-002','security','P0','Revisar políticas RLS, grants e schemas expostos','Investigar alertas por tabela, role, grant, view e função privilegiada; não desabilitar RLS como atalho.','in_progress','["inventário de privilégios por schema/tabela","políticas justificadas por caso de uso","testes anon/authenticated/service_role","revisão de funções SECURITY DEFINER"]'::jsonb,'Supabase Security Advisor observado em 2026-10-17'),
('AT-003','core','P1','Validar runtime e contrato HTTP do Trade','Confirmar fonte executável e validar health/readiness, tarefas, resultados, erros, timeouts e autenticação serviço-a-serviço.','blocked','["server real revisado","contrato request/response testado","falha fechada em timeout","sem chamadas de corretora em modo paper"]'::jsonb,'adonai_trade.integration_status: trade_server pending'),
('AT-004','levi','P1','Comprovar integração ponta a ponta com LEVI','Validar roteamento, correlation_id, resposta, persistência de auditoria e bloqueio de entradas inválidas.','blocked','["teste LEVI→Trade reproduzível","correlation_id preservado","falha de serviço não gera ordem","evidência com timestamp"]'::jsonb,'adonai_trade.integration_status: levi pending'),
('AT-005','eu_sou','P1','Comprovar integração e persistência EU SOU','Validar contrato, autenticação, execução científica, modelo/benchmark e gravação das evidências.','blocked','["request/response validados","execução científica registrada","fonte e versão registradas","benchmark e resultado reproduzíveis"]'::jsonb,'adonai_trade.integration_status: eu_sou pending'),
('AT-006','crypto','P2','Validar mesa cripto com fixtures e custos','Testar símbolos, precisão, limites de exchange, taxas, frescor do feed e erros do provedor sem credenciais reais.','planned','["fixtures offline","validação de preço/quantidade","taxas modeladas","dados vencidos bloqueados","paper-only provado"]'::jsonb,'Plano de engenharia reversa Adonai Trade'),
('AT-007','forex','P2','Validar mesa Forex e regras de sessão','Testar bid/ask, spread, pip/lot size, conversão de moeda, sessão, feriados, rollover e slippage.','planned','["fixtures offline","custo e conversão validados","calendário validado","falhas de feed bloqueadas"]'::jsonb,'Plano de engenharia reversa Adonai Trade'),
('AT-008','b3','P2','Validar mesa nacional B3','Testar ticker, calendário de pregão, leilões, proventos/desdobramentos, atraso e limites do provedor.','planned','["fixtures versionadas","ajustes e calendário verificados","origem/licença documentadas","dados atrasados identificados"]'::jsonb,'Plano de engenharia reversa Adonai Trade'),
('AT-009','international','P2','Validar mesa internacional','Testar timezone, moedas, calendário por bolsa, corporate actions, custos e consistência entre provedores.','planned','["timestamps UTC","conversão de moeda testada","calendários versionados","divergências de fonte sinalizadas"]'::jsonb,'Plano de engenharia reversa Adonai Trade'),
('AT-010','core','P3','Criar backtest reproduzível sem vazamento temporal','Incluir custos, slippage, baseline, validação fora da amostra, walk-forward e hash dos dados/estratégia.','planned','["sem look-ahead","custos incluídos","baseline comparável","out-of-sample documentado","métricas de drawdown e risco"]'::jsonb,'Plano de engenharia reversa Adonai Trade'),
('AT-011','rh','P4','Vincular agentes RH a papéis e evidências','Definir responsabilidade, critérios de qualificação, dono, entradas/saídas, limites e avaliação por agente.','planned','["papéis verificáveis","critérios de aprovação","trilha de aprendizado","agente não promovido sem evidência"]'::jsonb,'Inventário rh_adonai observado em 2026-10-17'),
('AT-012','delivery','P4','Preparar release candidate reproduzível','Executar CI, inventário de dependências, varredura de segredos, SBOM, backup e rollback.','planned','["CI verde no commit de release","lockfile/SBOM quando aplicável","segredos ausentes","rollback ensaiado","hash do artefato"]'::jsonb,'Plano de engenharia reversa Adonai Trade')
on conflict (work_key) do nothing;

insert into adonai_trade.excellence_evidence
(work_item_id,evidence_type,source_reference,summary,details,verified)
select wi.id,'supabase_inspection','adonai_trade.integration_status @ 2026-10-17',
       'Registro de integração consultado; estado permanece pendente/degradado até teste ponta a ponta.',
       jsonb_build_object('component',i.component,'status',i.status,'details',i.details),false
from adonai_trade.integration_status i
join adonai_trade.excellence_work_items wi on wi.work_key = case i.component
  when 'levi' then 'AT-004'
  when 'eu_sou' then 'AT-005'
  when 'trade_server' then 'AT-003'
  when 'github' then 'AT-003'
end
where i.component in ('levi','eu_sou','trade_server','github')
and not exists (
  select 1 from adonai_trade.excellence_evidence e
  where e.source_reference='adonai_trade.integration_status @ 2026-10-17'
    and e.details->>'component'=i.component
);
