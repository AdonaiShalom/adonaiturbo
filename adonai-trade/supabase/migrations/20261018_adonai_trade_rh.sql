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


create or replace function adonai_trade.rh_create_task_with_audit(
  p_task_key text, p_title text, p_role_key text, p_market text default null, p_evidence jsonb default '{}'::jsonb
) returns jsonb
language plpgsql security definer
set search_path = adonai_trade, public
as $
declare v_task adonai_trade.rh_tasks;
begin
  if length(trim(p_task_key)) < 3 or length(p_task_key) > 80 then raise exception 'invalid_task_key'; end if;
  if length(trim(p_title)) < 3 or length(p_title) > 240 then raise exception 'invalid_task_title'; end if;
  if p_market is not null and p_market not in ('CRYPTO','FOREX','B3','INTERNATIONAL') then raise exception 'invalid_market'; end if;
  insert into adonai_trade.rh_tasks(task_key,title,role_key,market,status,evidence)
  values(trim(p_task_key),trim(p_title),p_role_key,p_market,'queued',coalesce(p_evidence,'{}'::jsonb))
  returning * into v_task;
  insert into adonai_trade.runtime_audit_events(event_id,created_at,service,service_version,task_id,market,decision,reason_codes,details)
  values(gen_random_uuid(),now(),'adonai-trade','0.1.0',v_task.task_id,v_task.market,'proposal_only',
    jsonb_build_array('rh_task_created','task_persisted','paper_only'),
    jsonb_build_object('event_type','rh_task_created','task_key',v_task.task_key,'role_key',v_task.role_key,'status',v_task.status,'execution_performed',false));
  return to_jsonb(v_task);
end;
$;

create or replace function adonai_trade.rh_update_task_status_with_audit(
  p_task_id uuid, p_status text, p_evidence jsonb default null
) returns jsonb
language plpgsql security definer
set search_path = adonai_trade, public
as $
declare v_task adonai_trade.rh_tasks;
begin
  if p_status not in ('queued','in_progress','blocked','review','completed','cancelled') then raise exception 'invalid_task_status'; end if;
  update adonai_trade.rh_tasks
    set status=p_status,
        evidence=case when p_evidence is null then evidence else evidence || p_evidence end,
        updated_at=now(),
        completed_at=case when p_status='completed' then now() when p_status in ('queued','in_progress','blocked','review') then null else completed_at end
    where task_id=p_task_id
    returning * into v_task;
  if not found then raise exception 'task_not_found'; end if;
  insert into adonai_trade.runtime_audit_events(event_id,created_at,service,service_version,task_id,market,decision,reason_codes,details)
  values(gen_random_uuid(),now(),'adonai-trade','0.1.0',v_task.task_id,v_task.market,'proposal_only',
    jsonb_build_array('rh_task_status_updated','task_status_persisted','paper_only'),
    jsonb_build_object('event_type','rh_task_status_updated','task_key',v_task.task_key,'role_key',v_task.role_key,'status',v_task.status,'execution_performed',false));
  return to_jsonb(v_task);
end;
$;

revoke all on function adonai_trade.rh_create_task_with_audit(text,text,text,text,jsonb) from public, anon, authenticated;
revoke all on function adonai_trade.rh_update_task_status_with_audit(uuid,text,jsonb) from public, anon, authenticated;
grant execute on function adonai_trade.rh_create_task_with_audit(text,text,text,text,jsonb) to service_role;
grant execute on function adonai_trade.rh_update_task_status_with_audit(uuid,text,jsonb) to service_role;

commit;
