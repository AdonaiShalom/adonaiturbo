import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKLOG_PATH = ROOT / "adonai-trade" / "docs" / "EXCELLENCE_BACKLOG.json"
BOARD_PATH = ROOT / "adonai-trade" / "docs" / "EXCELLENCE_EXECUTION_BOARD.md"
SCHEMA_PATH = ROOT / "adonai-trade" / "docs" / "EXCELLENCE_SCHEMA_CONTRACT.md"
ARCH_REVIEW_PATH = ROOT / "adonai-trade" / "docs" / "OPEN_SOURCE_ENGINEERING_REVIEW.md"
WORKFLOW_PATH = ROOT / ".github" / "workflows" / "adonai-trade-quality.yml"
MIGRATION_1 = ROOT / "supabase" / "migrations" / "20261017145301_adonai_trade_excellence_backlog_and_evidence.sql"
MIGRATION_2 = ROOT / "supabase" / "migrations" / "20261017150214_adonai_trade_excellence_integrity_guards.sql"
MIGRATION_3 = ROOT / "supabase" / "migrations" / "20261017150842_adonai_trade_verified_requires_technical_evidence.sql"
MIGRATION_4 = ROOT / "supabase" / "migrations" / "20261017150927_adonai_trade_verified_evidence_type.sql"
PGTAP_PATH = ROOT / "supabase" / "tests" / "adonai_trade_excellence_integrity.test.sql"

EXPECTED_IDS = [f"AT-{number:03d}" for number in range(1, 13)]
ALLOWED_STATUS = {"planned", "in_progress", "blocked", "verified", "deferred"}
ALLOWED_PRIORITY = {"P0", "P1", "P2", "P3", "P4"}


class ExcellenceBacklogTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.backlog = json.loads(BACKLOG_PATH.read_text(encoding="utf-8"))
        cls.board = BOARD_PATH.read_text(encoding="utf-8")
        cls.schema = SCHEMA_PATH.read_text(encoding="utf-8")
        cls.arch_review = ARCH_REVIEW_PATH.read_text(encoding="utf-8")
        cls.workflow = WORKFLOW_PATH.read_text(encoding="utf-8")

    def test_backlog_has_stable_unique_ids(self):
        ids = [item["id"] for item in self.backlog["work_items"]]
        self.assertEqual(ids, EXPECTED_IDS)
        self.assertEqual(len(ids), len(set(ids)))

    def test_each_item_has_acceptance_criteria_and_valid_state(self):
        for item in self.backlog["work_items"]:
            with self.subTest(work_key=item["id"]):
                self.assertIn(item["status"], ALLOWED_STATUS)
                self.assertIn(item["priority"], ALLOWED_PRIORITY)
                self.assertTrue(item["title"].strip())
                self.assertGreater(len(item["acceptance"]), 0)
                self.assertTrue(item["evidence_required"])
                self.assertEqual(item["supabase_key"], item["id"])

    def test_execution_guardrails_remain_paper_only(self):
        guards = self.backlog["guardrails"]
        self.assertEqual(guards["execution_mode"], "paper")
        self.assertIs(guards["live_orders_enabled"], False)
        self.assertIs(guards["merge_to_main_without_review"], False)
        self.assertIs(guards["supabase_rls_must_remain_enabled"], True)

    def test_execution_board_contains_all_canonical_ids(self):
        for work_key in EXPECTED_IDS:
            with self.subTest(work_key=work_key):
                self.assertIn(work_key, self.board)

    def test_schema_contract_documents_integrity_rules(self):
        self.assertIn("append-only", self.schema)
        self.assertIn("RLS", self.schema)
        self.assertIn("verified", self.schema)
        self.assertIn("excellence_evidence", self.schema)

    def test_open_source_review_and_supply_chain_pinning(self):
        self.assertIn("OpenTradex", self.arch_review)
        self.assertIn("ALTA", self.arch_review)
        self.assertIn("TradingAgents", self.arch_review)
        self.assertIn("paper-only", self.arch_review)
        self.assertIn("11bd71901bbe5b1630ceea73d27597364c9af683", self.workflow)
        self.assertIn("42375524e23c412d93fb67b49958b491fce71c38", self.workflow)

    def test_migrations_and_regression_test_exist(self):
        for path in (MIGRATION_1, MIGRATION_2, MIGRATION_3, MIGRATION_4, PGTAP_PATH):
            with self.subTest(path=path.name):
                self.assertTrue(path.is_file(), f"Missing versioned artifact: {path}")
        sql_1 = MIGRATION_1.read_text(encoding="utf-8").lower()
        sql_2 = MIGRATION_2.read_text(encoding="utf-8").lower()
        sql_3 = MIGRATION_3.read_text(encoding="utf-8").lower()
        sql_4 = MIGRATION_4.read_text(encoding="utf-8").lower()
        pgtap = PGTAP_PATH.read_text(encoding="utf-8").lower()
        self.assertIn("enable row level security", sql_1)
        self.assertIn("append-only", sql_2)
        self.assertIn("technical/test evidence", sql_3)
        self.assertIn("not valid", sql_4)
        self.assertIn("plan(14)", pgtap)
        self.assertIn("throws_ok", pgtap)


if __name__ == "__main__":
    unittest.main()
