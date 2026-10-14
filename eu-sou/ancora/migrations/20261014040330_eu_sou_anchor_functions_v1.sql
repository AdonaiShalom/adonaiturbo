-- EU SOU anchor functions: private implementation + service_role-only RPC facade.
-- Keeps eu_sou schema unexposed; existing public tables are untouched.
CREATE OR REPLACE FUNCTION eu_sou.anchor_advance(
  p_expected_seq bigint,
  p_expected_event_hash text,
  p_expected_checkpoint_hash text,
  p_new_seq bigint,
  p_new_event_hash text,
  p_new_checkpoint_hash text,
  p_format_version integer,
  p_request_id uuid
) RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_state eu_sou.anchor_state%ROWTYPE;
  v_existing eu_sou.anchor_history%ROWTYPE;
BEGIN
  IF p_expected_seq IS NULL OR p_expected_seq < 0
     OR p_new_seq IS NULL OR p_new_seq <> p_expected_seq + 1
     OR p_format_version IS NULL OR p_format_version < 1
     OR p_request_id IS NULL
     OR p_expected_event_hash IS NULL OR p_expected_event_hash !~ '^[0-9a-f]{64}$'
     OR p_expected_checkpoint_hash IS NULL OR p_expected_checkpoint_hash !~ '^[0-9a-f]{64}$'
     OR p_new_event_hash IS NULL OR p_new_event_hash !~ '^[0-9a-f]{64}$'
     OR p_new_checkpoint_hash IS NULL OR p_new_checkpoint_hash !~ '^[0-9a-f]{64}$'
  THEN
    RAISE EXCEPTION 'EU SOU anchor: invalid arguments' USING ERRCODE = '22023';
  END IF;

  SELECT h.* INTO v_existing
  FROM eu_sou.anchor_history AS h
  WHERE h.request_id = p_request_id;

  IF FOUND THEN
    IF v_existing.event_seq <> p_new_seq
       OR v_existing.previous_event_hash <> p_expected_event_hash
       OR v_existing.previous_checkpoint_hash <> p_expected_checkpoint_hash
       OR v_existing.event_hash <> p_new_event_hash
       OR v_existing.checkpoint_hash <> p_new_checkpoint_hash
       OR v_existing.format_version <> p_format_version
    THEN
      RAISE EXCEPTION 'EU SOU anchor: request_id reused with different payload'
        USING ERRCODE = '23505';
    END IF;
    RETURN v_existing.event_seq;
  END IF;

  SELECT s.* INTO STRICT v_state
  FROM eu_sou.anchor_state AS s
  WHERE s.singleton = true
  FOR UPDATE;

  IF v_state.event_seq <> p_expected_seq
     OR v_state.event_hash <> p_expected_event_hash
     OR v_state.checkpoint_hash <> p_expected_checkpoint_hash
  THEN
    RAISE EXCEPTION 'EU SOU anchor: state conflict'
      USING ERRCODE = '40001';
  END IF;

  INSERT INTO eu_sou.anchor_history (
    event_seq, previous_event_hash, event_hash, checkpoint_hash,
    format_version, request_id, previous_checkpoint_hash
  ) VALUES (
    p_new_seq, p_expected_event_hash, p_new_event_hash, p_new_checkpoint_hash,
    p_format_version, p_request_id, p_expected_checkpoint_hash
  );

  UPDATE eu_sou.anchor_state
  SET event_seq = p_new_seq,
      event_hash = p_new_event_hash,
      checkpoint_hash = p_new_checkpoint_hash,
      format_version = p_format_version,
      updated_at = pg_catalog.now()
  WHERE singleton = true;

  RETURN p_new_seq;
END;
$function$;

CREATE OR REPLACE FUNCTION eu_sou.anchor_read()
RETURNS TABLE (
  event_seq bigint,
  event_hash text,
  checkpoint_hash text,
  format_version integer,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT s.event_seq, s.event_hash, s.checkpoint_hash, s.format_version, s.updated_at
  FROM eu_sou.anchor_state AS s
  WHERE s.singleton = true;
$function$;

REVOKE ALL ON FUNCTION eu_sou.anchor_advance(bigint,text,text,bigint,text,text,integer,uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION eu_sou.anchor_read() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION eu_sou.anchor_advance(bigint,text,text,bigint,text,text,integer,uuid) TO service_role;
GRANT EXECUTE ON FUNCTION eu_sou.anchor_read() TO service_role;

CREATE OR REPLACE FUNCTION public.eu_sou_anchor_advance(
  p_expected_seq bigint,
  p_expected_event_hash text,
  p_expected_checkpoint_hash text,
  p_new_seq bigint,
  p_new_event_hash text,
  p_new_checkpoint_hash text,
  p_format_version integer,
  p_request_id uuid
) RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT eu_sou.anchor_advance(
    p_expected_seq, p_expected_event_hash, p_expected_checkpoint_hash,
    p_new_seq, p_new_event_hash, p_new_checkpoint_hash, p_format_version, p_request_id
  );
$function$;

CREATE OR REPLACE FUNCTION public.eu_sou_anchor_read()
RETURNS TABLE (
  event_seq bigint,
  event_hash text,
  checkpoint_hash text,
  format_version integer,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT * FROM eu_sou.anchor_read();
$function$;

REVOKE ALL ON FUNCTION public.eu_sou_anchor_advance(bigint,text,text,bigint,text,text,integer,uuid)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.eu_sou_anchor_read() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.eu_sou_anchor_advance(bigint,text,text,bigint,text,text,integer,uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.eu_sou_anchor_read() TO service_role;
