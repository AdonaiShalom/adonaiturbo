-- EU SOU search retrieval v1: accent normalization and OR fallback for multi-term queries.
CREATE OR REPLACE FUNCTION eu_sou.search_knowledge(
  p_query text,
  p_company_scope text DEFAULT NULL::text,
  p_limit integer DEFAULT 5
)
RETURNS TABLE(id uuid, slug text, company_scope text, domain_slug text, title text, content text, source_url text, status text, rank real)
LANGUAGE sql STABLE
SET search_path TO 'eu_sou', 'public'
AS $function$
  WITH normalized_input AS (
    SELECT translate(lower(coalesce(p_query, '')),
      'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc') AS query_text
  ),
  terms AS (
    SELECT DISTINCT token
    FROM normalized_input n
    CROSS JOIN LATERAL regexp_split_to_table(n.query_text, '[^[:alnum:]]+') AS token
    WHERE length(token) >= 3
      AND token NOT IN ('para','com','dos','das','uma','uns','por','que','the','and','for','from','with','into','this','that','how','what','when','where')
  ),
  query_parts AS (
    SELECT websearch_to_tsquery('simple', query_text) AS strict_query,
      (SELECT string_agg(plainto_tsquery('simple', token)::text, ' | ') FROM terms) AS loose_query_text
    FROM normalized_input
  ),
  query_ready AS (
    SELECT strict_query,
      CASE WHEN nullif(loose_query_text, '') IS NULL THEN NULL::tsquery
           ELSE to_tsquery('simple', loose_query_text) END AS loose_query
    FROM query_parts
  ),
  documents AS (
    SELECT k.*,
      to_tsvector('simple', translate(lower(coalesce(k.title,'') || ' ' || coalesce(k.content,'') || ' ' || coalesce(k.domain_slug,'')),
        'áàâãäéèêëíìîïóòôõöúùûüç', 'aaaaaeeeeiiiiooooouuuuc')) AS document_vector
    FROM eu_sou.knowledge_chunks k
    WHERE k.status IN ('curated','reviewed','validated')
      AND (p_company_scope IS NULL OR k.company_scope IN ('shared', p_company_scope))
  )
  SELECT d.id, d.slug, d.company_scope, d.domain_slug, d.title, d.content, d.source_url, d.status,
    (2 * ts_rank(d.document_vector, q.strict_query) + coalesce(ts_rank(d.document_vector, q.loose_query), 0))::real AS rank
  FROM documents d CROSS JOIN query_ready q
  WHERE (numnode(q.strict_query) > 0 AND d.document_vector @@ q.strict_query)
     OR (q.loose_query IS NOT NULL AND d.document_vector @@ q.loose_query)
  ORDER BY rank DESC, d.updated_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 5), 10));
$function$;
