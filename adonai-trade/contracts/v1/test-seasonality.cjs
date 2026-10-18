'use strict';

const assert = require('node:assert/strict');
const { summarizeMonthlySeasonality } = require('../../runtime/seasonality.cjs');

const closes = [
  { period: '2022-01', close: 100 }, { period: '2022-02', close: 110 },
  { period: '2022-03', close: 99 },  { period: '2022-04', close: 108.9 },
  { period: '2023-01', close: 120 }, { period: '2023-02', close: 132 },
  { period: '2023-03', close: 118.8 }, { period: '2023-04', close: 130.68 },
  { period: '2024-01', close: 144 }, { period: '2024-02', close: 158.4 },
  { period: '2024-03', close: 142.56 }, { period: '2024-04', close: 156.816 }
];

for (const market of ['B3', 'INTERNATIONAL', 'CRYPTO', 'FOREX']) {
  const result = summarizeMonthlySeasonality({ market, instrument: 'TEST', monthlyCloses: closes, minSamples: 3 });
  assert.equal(result.ok, true);
  assert.equal(result.market, market);
  assert.equal(result.months[1].observations, 3);
  assert.ok(Math.abs(result.months[1].mean_return - 0.1) < 1e-12);
  assert.equal(result.months[1].status, 'descriptive_sample_available');
}
assert.equal(summarizeMonthlySeasonality({ market: 'UNKNOWN', instrument: 'X', monthlyCloses: closes }).reason_code, 'unsupported_market');
assert.equal(summarizeMonthlySeasonality({ market: 'B3', instrument: 'X', monthlyCloses: [{ period: '2024-01', close: 0 }, { period: '2024-02', close: 1 }] }).reason_code, 'invalid_close');
assert.equal(summarizeMonthlySeasonality({ market: 'B3', instrument: 'X', monthlyCloses: [{ period: '2024-01', close: 1 }, { period: '2024-01', close: 2 }] }).reason_code, 'duplicate_period');
const gap = summarizeMonthlySeasonality({ market: 'B3', instrument: 'X', monthlyCloses: [
  { period: '2024-01', close: 100 }, { period: '2024-03', close: 110 }
] });
assert.equal(gap.computed_monthly_returns, 0);
assert.equal(gap.skipped_gaps.length, 1);
assert.equal(gap.months[2].status, 'insufficient_sample');
console.log('PASS: seasonality analytics — four markets, month grouping, sample threshold, invalid inputs and gap handling');
