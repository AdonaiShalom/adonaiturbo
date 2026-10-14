-- EU SOU scientific search regression suite.
-- Read-only; execute in Supabase SQL editor. Expected outcome: every row passes.
WITH cases AS (
  SELECT 'physics' AS test_name, 'equacao Schrodinger oscilador harmonico energia ponto zero'::text AS q, NULL::text AS scope, true AS expect_result
  UNION ALL SELECT 'nanotechnology_lab', 'pontos quanticos nanofios materiais 2D DFT', 'adonai-lab', true
  UNION ALL SELECT 'marketing_scope', 'alegacao cientifica randomizacao grupo controle campanha', 'adonai-marketing-digital', true
  UNION ALL SELECT 'finance_scope', 'QUBO Ising risco VaR drawdown slippage', 'adonai-financas', true
  UNION ALL SELECT 'trade_scope', 'walk-forward backtesting paper trading kill switch', 'adonai-trade', true
  UNION ALL SELECT 'turbo_scope', 'RAG observabilidade proveniencia latencia rollback', 'adonai-turbo', true
  UNION ALL SELECT 'unknown_query', 'xyzabcqwerty zzzunknown qqq', 'adonai-lab', false
  UNION ALL SELECT 'empty_query', '', NULL, false
),
results AS (
  SELECT c.test_name, c.expect_result, k.id, k.slug, k.company_scope
  FROM cases c
  LEFT JOIN LATERAL eu_sou.search_knowledge(c.q, c.scope, 10) k ON true
),
summary AS (
  SELECT test_name, expect_result, count(id)::int AS result_count,
         bool_or(id IS NOT NULL) AS has_result
  FROM results GROUP BY test_name, expect_result
),
scope_check AS (
  SELECT count(*)::int AS wrong_scope_company_hits
  FROM eu_sou.search_knowledge(
    'alegacao cientifica randomizacao grupo controle campanha',
    'adonai-financas', 10
  )
  WHERE company_scope = 'adonai-marketing-digital'
),
limit_check AS (
  SELECT count(*)::int AS result_count
  FROM eu_sou.search_knowledge('quantum risco otimização', NULL, 50)
)
SELECT s.test_name, s.result_count,
       CASE WHEN s.has_result = s.expect_result THEN 'PASS' ELSE 'FAIL' END AS outcome
FROM summary s
UNION ALL
SELECT 'company_scope_isolation', wrong_scope_company_hits,
       CASE WHEN wrong_scope_company_hits = 0 THEN 'PASS' ELSE 'FAIL' END
FROM scope_check
UNION ALL
SELECT 'limit_max_10', result_count,
       CASE WHEN result_count <= 10 THEN 'PASS' ELSE 'FAIL' END
FROM limit_check
ORDER BY 1;
