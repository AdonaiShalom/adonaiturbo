-- EU SOU ANCORA: isolated additive storage.
-- Applied to Supabase project adonaiturbo. Does not move or alter existing public objects.
CREATE SCHEMA IF NOT EXISTS eu_sou;
COMMENT ON SCHEMA eu_sou IS 'Dados isolados do Cérebro EU SOU; componente do Adonai Turbo, separado do PSM Grupo Market.';

CREATE TABLE IF NOT EXISTS eu_sou.anchor_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  event_seq bigint NOT NULL DEFAULT 0 CHECK (event_seq >= 0),
  event_hash text NOT NULL DEFAULT repeat('0', 64) CHECK (event_hash ~ '^[0-9a-f]{64}$'),
  checkpoint_hash text NOT NULL DEFAULT repeat('0', 64) CHECK (checkpoint_hash ~ '^[0-9a-f]{64}$'),
  format_version integer NOT NULL DEFAULT 1 CHECK (format_version > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO eu_sou.anchor_state (singleton)
VALUES (true)
ON CONFLICT (singleton) DO NOTHING;

CREATE TABLE IF NOT EXISTS eu_sou.anchor_history (
  event_seq bigint PRIMARY KEY CHECK (event_seq > 0),
  previous_event_hash text NOT NULL CHECK (previous_event_hash ~ '^[0-9a-f]{64}$'),
  event_hash text NOT NULL CHECK (event_hash ~ '^[0-9a-f]{64}$'),
  checkpoint_hash text NOT NULL CHECK (checkpoint_hash ~ '^[0-9a-f]{64}$'),
  format_version integer NOT NULL CHECK (format_version > 0),
  request_id uuid NOT NULL UNIQUE,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  previous_checkpoint_hash text NOT NULL CHECK (previous_checkpoint_hash ~ '^[0-9a-f]{64}$')
);

ALTER TABLE eu_sou.anchor_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_sou.anchor_history ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON SCHEMA eu_sou FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA eu_sou TO service_role;
REVOKE ALL ON TABLE eu_sou.anchor_state, eu_sou.anchor_history FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE eu_sou.anchor_state TO service_role;
GRANT SELECT, INSERT ON TABLE eu_sou.anchor_history TO service_role;

COMMENT ON TABLE eu_sou.anchor_state IS 'Estado corrente da âncora de integridade EU SOU.';
COMMENT ON TABLE eu_sou.anchor_history IS 'Histórico encadeado e idempotente da âncora EU SOU.';
