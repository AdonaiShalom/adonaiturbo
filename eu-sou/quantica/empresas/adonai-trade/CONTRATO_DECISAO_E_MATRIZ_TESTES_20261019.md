# Contrato de decisão e matriz de testes — EU SOU → Gate → LEVI → quatro mesas/RH
Data: 2026-10-19
Status: especificação de engenharia; ainda não implementada nem executada ponta a ponta.
Branch: work/adonai-trade-eu-sou-market-research-20261019

## 1. Separação de responsabilidades
- EU SOU: prepara hipótese/proposta científica, cálculo, evidências, probabilidades e incerteza. Pode retornar `abstain`.
- Gate determinístico independente: verifica estrutura, qualidade/frescor dos dados, versão do modelo, integridade de auditoria, custos e limites. Não prevê mercado.
- LEVI: orquestra por `correlation_id`, atribui tarefas às quatro mesas e RH, agrega respostas e registra estado; não altera a recomendação científica nem contorna o gate.
- Mesas: B3/nacional, internacional, Forex, cripto. Cada uma valida a própria fonte, sessão, moeda, instrumento, custos e convenções.
- RH: pesquisa, dados, risco, auditoria/ceticismo, paper execution e supervisão. Estado `not_reported` significa desconhecido, nunca “ativo”.

## 2. Contrato JSON mínimo para proposta do EU SOU
```json
{
  "schema_version": "1.0",
  "decision_id": "uuid",
  "correlation_id": "uuid",
  "created_at": "RFC3339 timestamp",
  "expires_at": "RFC3339 timestamp",
  "market": "b3|international|forex|crypto",
  "instrument": {"symbol": "string", "venue": "string", "quote_currency": "string"},
  "horizon": {"value": 1, "unit": "minute|hour|day|week"},
  "recommendation": "buy_candidate|sell_candidate|hold|abstain",
  "probability": {
    "event": "explicit event definition",
    "value": 0.0,
    "calibration_method": "string",
    "calibration_window": "string",
    "uncertainty": {"lower": 0.0, "upper": 1.0}
  },
  "evidence": {
    "sources": [{"url": "string", "retrieved_at": "RFC3339", "data_as_of": "RFC3339", "content_hash": "sha256"}],
    "model_version": "string",
    "model_hash": "sha256",
    "dataset_hash": "sha256",
    "baseline": "string",
    "validation_run_id": "string"
  },
  "economics": {
    "estimated_spread_bps": 0.0,
    "estimated_fees_bps": 0.0,
    "estimated_slippage_bps": 0.0,
    "net_expected_value": 0.0,
    "currency": "string"
  },
  "risk": {
    "expected_shortfall": 0.0,
    "max_drawdown_estimate": 0.0,
    "exposure_after": 0.0,
    "limit_profile": "versioned-profile-id"
  },
  "gate": {"status": "pending|pass|block", "reasons": []},
  "mode": "research|paper",
  "human_approval_required": true
}
```
The schema is illustrative and must be converted to the project's actual validator/types before use. Values are not defaults for live execution. If any required field is missing, malformed, stale, uncalibrated, or unsupported, the proposal must be blocked/abstain.

## 3. Gate rules that must be executable, not prose only
1. Allowlist `market`; symbol + venue + quote currency are mandatory.
2. All timestamps parse as RFC3339 with timezone. `data_as_of <= retrieved_at`; reject future timestamps and expired proposal.
3. Source and dataset hashes must be present and reproducible; license/terms status must be explicitly allowed.
4. Price/volume must be finite, non-null and domain-valid; do not replace missing/invalid data with zero.
5. Probability must be in [0,1], include an event/horizon and calibration evidence; otherwise no numeric probability is shown.
6. Model, dataset, feature set and validation run must be versioned. Block look-ahead leakage and train/test overlap.
7. Net expected value includes spread, fees, slippage and market-specific carry/funding/rollover when applicable.
8. Risk limits are applied to portfolio state and the proposed exposure; unavailable portfolio state means block.
9. Audit ledger health must be verified before any decision is handed off. Invalid chain or disk/memory mismatch means block all writes.
10. `mode` is restricted to research/paper in this release; live order routes and credentials must not exist in the runtime.
11. Idempotency: duplicate `decision_id` or `correlation_id` cannot trigger duplicate downstream work.
12. Every block records reason codes and is observable to LEVI and RH; failures are never silently downgraded.

## 4. Test matrix (offline fixtures first)
| Test | Fixture/action | Required result |
|---|---|---|
| Contract | missing market/symbol/horizon/model hash | reject; no downstream call |
| Timestamp | future, no timezone, expired, stale provider | block with reason |
| Provenance | absent source URL/hash/license | block |
| Numeric | NaN, infinity, null/zero invalid quote | reject; never display as verified |
| Calibration | probability without event/horizon/calibration window | abstain/no numeric confidence |
| Leakage | feature timestamp after decision time | test fails and run is invalidated |
| Economics | missing fees/slippage/funding where applicable | block or mark economics unavailable; no approval |
| Risk | portfolio unavailable, limit exceeded, stress breach | block |
| Audit | broken chain or disk differs from memory | fail closed; bytes preserved |
| Idempotency | replay same decision/correlation ID | no duplicate downstream task |
| LEVI | one mesa times out; another rejects | partial/degraded state, explicit error, no fabricated success |
| RH | role status not_reported | display not_reported, not active |
| Provider | HTTP 429/5xx, malformed JSON, oversized body, timeout | unavailable + reason; no stale quote presented as current |
| Quantum | same dataset/objective/constraints vs classical solver | report quality/time/uncertainty; no claim of advantage without repeatable improvement |
| No-order | inspect runtime routes/config for live order endpoints and keys | paper-only; no network call with financial side effect |

## 5. Market-specific fixtures
- B3: symbol with exchange suffix, BRT session/calendar, corporate-action adjustment, BRL units, Brapi missing token/rate limit.
- International: exchange-local timezone, daylight-saving boundary, SEC filing publication vs fiscal period, currency conversion and corporate actions.
- Forex: pair base/quote convention, rollover day, spread widening, holiday/session gap, Alpha Vantage rate limit; ECB/Frankfurter daily reference must remain `unverified` as intraday.
- Crypto: exchange+symbol, UTC candles, missing candle, duplicated candle, spread/depth, spot vs perpetual separation, funding interval, exchange outage.
Each fixture is synthetic or sanitized and labeled as such; it must never be presented as a live quote.

## 6. Reproducibility for quantum/nanoquantum
For every experiment store source commit, package versions/licenses, seed, dataset hash, target/constraints, classical solver/version, compute budget, repeated runs, score distribution, runtime and limitations. Use a classical baseline appropriate to the same objective. Simulated circuits do not equal quantum hardware. Nanoquantum/nanotechnology research is kept separate from market-signal prediction until a falsifiable, independently testable hypothesis is established.

## 7. Definition of done
- Unit and property-based tests pass for all gate rules.
- Four adapters pass deterministic fixtures and fail-closed provider tests.
- Full path EU SOU → gate → LEVI → each mesa/RH is traced by correlation ID with persisted audit events.
- Fault injection proves no fabricated “success” when a provider, RH, LEVI, EU SOU or audit backend fails.
- Paper-only runtime is verified by test and route/config inspection.
- Browser test confirms original 3D prototype and status fields, without claiming unreported teams are active.
- Release report includes commit/hash, CI links, test output, limitations and explicit statement that no real orders were sent.

## 8. Current evidence boundary
This document adds an implementable target contract and test plan only. It does not modify the Windows files, start port 3100/3107, validate provider credentials, execute backtests, prove quantum advantage, or authorize trading. It must be translated into code and tests in a dedicated branch and validated before the gate can be considered operational.
