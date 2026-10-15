-- RH Adonai: private data model for the five Adonai companies.
-- PSM Grupo Market is intentionally excluded.
create schema if not exists rh_adonai;
revoke all on schema rh_adonai from public, anon, authenticated;
grant usage on schema rh_adonai to service_role;

create table if not exists rh_adonai.companies (
  slug text primary key check (slug in ('adonai-turbo','adonai-marketing-digital','adonai-financas','adonai-lab','adonai-trade')),
  display_name text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
insert into rh_adonai.companies(slug,display_name) values
 ('adonai-turbo','Adonai Turbo'),
 ('adonai-marketing-digital','Adonai Marketing Digital'),
 ('adonai-financas','Adonai Finanças'),
 ('adonai-lab','Adonai Lab'),
 ('adonai-trade','Adonai Trade')
on conflict (slug) do update set display_name=excluded.display_name;

create table if not exists rh_adonai.agents (
 agent_key text primary key, name text not null, role_name text not null,
 function_description text not null, reports_to text,
 control_type text not null default 'operational'
  check (control_type in ('operational','independent_control','research','governance')),
 active boolean not null default true, created_at timestamptz not null default now(),
 foreign key (reports_to) references rh_adonai.agents(agent_key)
);
insert into rh_adonai.agents(agent_key,name,role_name,function_description,reports_to,control_type) values
 ('direcao','Direção de RH','Direção','Governança, prioridades e prestação de contas',null,'governance'),
 ('recrutamento','Recrutamento','Especialista','Vagas, critérios estruturados e triagem assistida','direcao','operational'),
 ('integracao','Integração','Especialista','Onboarding e documentação inicial','direcao','operational'),
 ('capacitacao','Capacitação','Especialista','Trilhas, cursos e avaliação de aprendizagem','direcao','operational'),
 ('desempenho','Desempenho','Especialista','Metas, feedback e desenvolvimento profissional','direcao','operational'),
 ('relacoes','Relações humanas','Especialista','Atendimento, clima, mediação e bem-estar','direcao','operational'),
 ('administracao','Administração','Especialista','Políticas, jornadas, benefícios e documentos','direcao','operational'),
 ('privacidade','Privacidade e compliance','Controle independente','LGPD, segregação de acesso e auditoria','direcao','independent_control'),
 ('dados','Analytics de pessoas','Especialista','Indicadores agregados e planejamento de capacidade','direcao','operational'),
 ('pesquisa','Pesquisa EU SOU','Pesquisa','Pesquisa pública, origem e licenças','direcao','research'),
 ('validacao','Validação e testes','Controle','Testes em sandbox, métricas e regressão','direcao','independent_control'),
 ('auditoria','Auditoria de recomendações','Controle independente','Revisão de evidências, riscos e aprovações','direcao','independent_control')
on conflict (agent_key) do update set name=excluded.name,role_name=excluded.role_name,
 function_description=excluded.function_description,reports_to=excluded.reports_to,control_type=excluded.control_type;

create table if not exists rh_adonai.agent_assignments (
 company_slug text not null references rh_adonai.companies(slug),
 agent_key text not null references rh_adonai.agents(agent_key),
 assigned_by text not null default 'rh-adonai-bootstrap',
 active boolean not null default true, created_at timestamptz not null default now(),
 primary key(company_slug,agent_key)
);
insert into rh_adonai.agent_assignments(company_slug,agent_key)
select c.slug,a.agent_key from rh_adonai.companies c cross join rh_adonai.agents a
on conflict (company_slug,agent_key) do nothing;

create table if not exists rh_adonai.activity_log (
 id uuid primary key default gen_random_uuid(),
 company_slug text not null references rh_adonai.companies(slug),
 agent_key text references rh_adonai.agents(agent_key),
 activity_type text not null check(activity_type in ('training','research','sandbox_test','review_requested','scope_changed','task_created','system')),
 title text not null, details jsonb not null default '{}'::jsonb,
 status text not null default 'recorded' check(status in ('recorded','pending_review','approved','rejected','failed')),
 correlation_id uuid not null default gen_random_uuid(), created_at timestamptz not null default now()
);
create index if not exists activity_log_company_created_idx on rh_adonai.activity_log(company_slug,created_at desc);

create table if not exists rh_adonai.recommendations (
 id uuid primary key default gen_random_uuid(),
 company_slug text not null references rh_adonai.companies(slug),
 agent_key text not null references rh_adonai.agents(agent_key),
 title text not null, rationale text not null,
 evidence jsonb not null default '[]'::jsonb, risks jsonb not null default '[]'::jsonb,
 validation jsonb not null default '{}'::jsonb,
 status text not null default 'pending_review' check(status in ('draft','pending_review','approved','rejected','implemented','rolled_back')),
 reviewer text, reviewed_at timestamptz, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists recommendations_company_status_idx on rh_adonai.recommendations(company_slug,status,created_at desc);

create table if not exists rh_adonai.learning_runs (
 id uuid primary key default gen_random_uuid(),
 company_slug text references rh_adonai.companies(slug),
 source_url text not null, source_title text not null, source_license text,
 source_version text, content_hash text, hypothesis text not null,
 baseline jsonb not null default '{}'::jsonb, metrics jsonb not null default '{}'::jsonb,
 sandbox_only boolean not null default true,
 status text not null default 'queued' check(status in ('queued','reviewing_source','testing','passed','failed','needs_human_review','approved','rejected')),
 findings jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), completed_at timestamptz
);
create index if not exists learning_runs_company_status_idx on rh_adonai.learning_runs(company_slug,status,created_at desc);

alter table rh_adonai.companies enable row level security;
alter table rh_adonai.agents enable row level security;
alter table rh_adonai.agent_assignments enable row level security;
alter table rh_adonai.activity_log enable row level security;
alter table rh_adonai.recommendations enable row level security;
alter table rh_adonai.learning_runs enable row level security;
revoke all on all tables in schema rh_adonai from public, anon, authenticated;
revoke all on all sequences in schema rh_adonai from public, anon, authenticated;
grant select,insert,update,delete on all tables in schema rh_adonai to service_role;
grant usage,select on all sequences in schema rh_adonai to service_role;
alter default privileges in schema rh_adonai revoke all on tables from public, anon, authenticated;
alter default privileges in schema rh_adonai grant select,insert,update,delete on tables to service_role;
