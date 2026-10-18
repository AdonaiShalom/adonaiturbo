begin;

create table if not exists adonai_trade.rh_roles (
  role_key text primary key,
  label text not null,
  purpose text not null,
  permissions jsonb not null default '[]'::jsonb,
  activity_status text not null default 'not_reported'
    check (activity_status in ('not_reported','active','paused','blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists adonai_trade.rh_tasks (
  task_id uuid primary key default gen_random_uuid(),
  task_key text not null unique,
  title text not null,
  role_key text not null references adonai_trade.rh_roles(role_key),
  market text check (market is null or market in ('CRYPTO','FOREX','B3','INTERNATIONAL')),
  status text not null default 'queued'
    check (status in ('queued','in_progress','blocked','review','completed','cancelled')),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table adonai_trade.rh_roles enable row level security;
alter table adonai_trade.rh_tasks enable row level security;
revoke all on adonai_trade.rh_roles from anon, authenticated;
revoke all on adonai_trade.rh_tasks from anon, authenticated;
grant select on adonai_trade.rh_roles to service_role;
grant select, insert, update on adonai_trade.rh_tasks to service_role;

insert into adonai_trade.rh_roles (role_key,label,purpose,permissions,activity_status) values
 ('orchestrator','Orquestração / LEVI','Distribuir tarefas, exigir evidência e coordenar as quatro mesas','["read","analysis","task_routing"]'::jsonb,'not_reported'),
 ('risk','Risco e conformidade','Aplicar limites, bloquear dados inválidos e revisar decisões','["read","risk_review","block"]'::jsonb,'not_reported'),
 ('research','Pesquisa e inteligência','Analisar fontes e cenários com origem e timestamp','["read","analysis"]'::jsonb,'not_reported'),
 ('market_data','Dados de mercado','Validar provedores, frescor e qualidade de dados','["read","data_validation"]'::jsonb,'not_reported'),
 ('paper_execution','Simulação / paper','Registrar propostas simuladas sem enviar ordens reais','["read","paper_simulation"]'::jsonb,'not_reported'),
 ('audit','Auditoria e ceticismo','Revisar rastreabilidade, evidências e premissas','["read","audit_review","block"]'::jsonb,'not_reported'),
 ('human_supervisor','Supervisão humana','Revisar exceções e aprovar alterações de configuração','["read","approval_required"]'::jsonb,'not_reported')
on conflict (role_key) do update set label=excluded.label,purpose=excluded.purpose,permissions=excluded.permissions,updated_at=now();

comment on table adonai_trade.rh_roles is 'Catalogo de funcoes RH; activity_status not_reported nao significa agente ativo.';
comment on table adonai_trade.rh_tasks is 'Tarefas RH reais; cada registro representa trabalho persistido e rastreavel.';

commit;
