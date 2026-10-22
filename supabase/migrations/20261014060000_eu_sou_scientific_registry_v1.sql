-- EU SOU scientific registry v1
-- Additive only: scientific metadata and reproducibility records.
-- Does not store proprietary company payloads or raw user conversations.
-- Runtime access must go through the trusted backend using service_role.
-- Keep schema out of PostgREST exposed schemas unless a separate access review approves it.

create schema if not exists eu_sou;

create table if not exists eu_sou.science_domains (
  slug text primary key,
  name text not null,
  parent_slug text references eu_sou.science_domains(slug),
  description text not null default '',
  domain_kind text not null check (domain_kind in (
    'mathematics','physics','quantum_physics','quantum_computing',
    'quantum_chemistry','materials_science','quantum_nanotechnology',
    'nanoelectronics','quantum_sensing','photonics','molecular_simulation',
    'food_science','safety','scientific_computing','other'
  )),
  status text not null default 'planned' check (status in ('planned','active','deprecated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eu_sou.scientific_sources (
  id uuid primary key default gen_random_uuid(),
  canonical_url text,
  doi text,
  title text not null,
  authors text[] not null default '{}',
  publisher text,
  published_at date,
  accessed_at timestamptz not null default now(),
  source_type text not null check (source_type in (
    'paper','preprint','book','dataset','software','standard','official_document','experiment','other'
  )),
  license text,
  content_hash text,
  trust_level text not null default 'unreviewed' check (trust_level in (
    'unreviewed','reviewed','validated','rejected'
  )),
  review_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique nulls not distinct (doi)
);

create table if not exists eu_sou.source_domain_links (
  source_id uuid not null references eu_sou.scientific_sources(id) on delete cascade,
  domain_slug text not null references eu_sou.science_domains(slug),
  relevance text not null default 'supporting' check (relevance in ('primary','supporting','contradicting','context')),
  primary key (source_id, domain_slug, relevance)
);

create table if not exists eu_sou.scientific_tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  repository_url text,
  documentation_url text,
  tool_kind text not null check (tool_kind in (
    'quantum_simulator','quantum_sdk','quantum_chemistry','dft_engine',
    'atomistic_simulation','materials_analysis','materials_data',
    'workflow_engine','molecular_dynamics','sensor_model','other'
  )),
  license_spdx text,
  supported_platforms text[] not null default '{}',
  runtime_requirements jsonb not null default '{}'::jsonb,
  capabilities jsonb not null default '[]'::jsonb,
  limitations text not null default '',
  review_status text not null default 'candidate' check (review_status in (
    'candidate','approved_for_pilot','validated','rejected','deprecated'
  )),
  pinned_version text,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eu_sou.scientific_models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  domain_slug text not null references eu_sou.science_domains(slug),
  method text not null,
  tool_id uuid references eu_sou.scientific_tools(id),
  model_version text not null,
  assumptions jsonb not null default '[]'::jsonb,
  parameters_schema jsonb not null default '{}'::jsonb,
  expected_outputs jsonb not null default '{}'::jsonb,
  limitations text not null default '',
  validation_status text not null default 'unvalidated' check (validation_status in (
    'unvalidated','in_testing','validated','rejected','deprecated'
  )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eu_sou.validation_benchmarks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  domain_slug text not null references eu_sou.science_domains(slug),
  description text not null default '',
  reference_source_id uuid references eu_sou.scientific_sources(id),
  expected_result jsonb not null,
  tolerance jsonb not null default '{}'::jsonb,
  test_definition jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','approved','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists eu_sou.scientific_runs (
  id uuid primary key default gen_random_uuid(),
  correlation_id uuid not null default gen_random_uuid(),
  consumer_project text not null default 'eu_sou' check (consumer_project in (
    'eu_sou','adonai_turbo','adonai_lab','adonai_financas',
    'adonai_trade','adonai_marketing_digital','psm_grupo_market'
  )),
  model_id uuid references eu_sou.scientific_models(id),
  benchmark_id uuid references eu_sou.validation_benchmarks(id),
  execution_kind text not null check (execution_kind in (
    'calculation','classical_simulation','quantum_simulation','quantum_hardware',
    'data_analysis','retrieval','validation','experiment_analysis'
  )),
  status text not null default 'queued' check (status in (
    'queued','running','succeeded','failed','rejected','cancelled'
  )),
  software_versions jsonb not null default '{}'::jsonb,
  parameters jsonb not null default '{}'::jsonb,
  input_hash text,
  output_hash text,
  result_summary jsonb not null default '{}'::jsonb,
  uncertainty jsonb not null default '{}'::jsonb,
  limitations text not null default '',
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  check (finished_at is null or started_at is null or finished_at >= started_at)
);

create table if not exists eu_sou.run_evidence (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references eu_sou.scientific_runs(id) on delete cascade,
  source_id uuid references eu_sou.scientific_sources(id),
  evidence_kind text not null check (evidence_kind in (
    'literature','analytical_reference','independent_benchmark','experimental_measurement',
    'simulation_output','dataset','reviewer_note'
  )),
  claim text not null,
  supports_claim boolean not null default true,
  confidence numeric(5,4) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists eu_sou.phase_checkpoints (
  phase_number smallint primary key check (phase_number between 1 and 10),
  phase_name text not null,
  status text not null default 'planned' check (status in (
    'planned','in_progress','blocked','passed','accepted'
  )),
  acceptance_criteria jsonb not null default '[]'::jsonb,
  evidence_refs jsonb not null default '[]'::jsonb,
  blockers jsonb not null default '[]'::jsonb,
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists scientific_sources_trust_idx
  on eu_sou.scientific_sources (trust_level, source_type);
create index if not exists scientific_sources_accessed_idx
  on eu_sou.scientific_sources (accessed_at desc);
create index if not exists scientific_runs_project_status_idx
  on eu_sou.scientific_runs (consumer_project, status, created_at desc);
create index if not exists scientific_runs_correlation_idx
  on eu_sou.scientific_runs (correlation_id);
create index if not exists run_evidence_run_idx
  on eu_sou.run_evidence (run_id, created_at);
create index if not exists scientific_models_domain_status_idx
  on eu_sou.scientific_models (domain_slug, validation_status);

comment on schema eu_sou is
  'Scientific knowledge, provenance and validation records for the EU SOU core. Backend-only access by default.';
comment on table eu_sou.scientific_sources is
  'Bibliographic/source metadata only; store full licensed documents in the approved document store.';
comment on table eu_sou.scientific_runs is
  'Reproducibility metadata; do not place secrets or proprietary company payloads in parameters/results.';
comment on table eu_sou.phase_checkpoints is
  'Phase acceptance evidence. A phase is passed only after external test evidence is reviewed.';

alter table eu_sou.science_domains enable row level security;
alter table eu_sou.scientific_sources enable row level security;
alter table eu_sou.source_domain_links enable row level security;
alter table eu_sou.scientific_tools enable row level security;
alter table eu_sou.scientific_models enable row level security;
alter table eu_sou.validation_benchmarks enable row level security;
alter table eu_sou.scientific_runs enable row level security;
alter table eu_sou.run_evidence enable row level security;
alter table eu_sou.phase_checkpoints enable row level security;

revoke all on schema eu_sou from public, anon, authenticated;
grant usage on schema eu_sou to service_role;
revoke all on all tables in schema eu_sou from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema eu_sou to service_role;
alter default privileges in schema eu_sou revoke all on tables from public, anon, authenticated;
alter default privileges in schema eu_sou grant select, insert, update, delete on tables to service_role;
