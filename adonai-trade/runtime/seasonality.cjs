'use strict';

const MARKETS = new Set(['B3', 'INTERNATIONAL', 'CRYPTO', 'FOREX']);

function fail(code, details = {}) {
  return { ok: false, status: 'blocked', reason_code: code, ...details };
}

/**
 * Summarizes historical calendar-month returns for one market/instrument.
 * Input rows are month-end closes: [{ period: 'YYYY-MM', close: number }].
 * A monthly return is only computed when the immediately preceding month exists.
 * This is descriptive analysis, not a forecast or a trading signal.
 */
function summarizeMonthlySeasonality({ market, instrument, monthlyCloses, minSamples = 3 }) {
  if (!MARKETS.has(market)) return fail('unsupported_market');
  if (typeof instrument !== 'string' || !instrument.trim()) return fail('instrument_required');
  if (!Array.isArray(monthlyCloses) || monthlyCloses.length < 2) return fail('insufficient_history');
  if (!Number.isInteger(minSamples) || minSamples < 2 || minSamples > 100) return fail('invalid_min_samples');

  const rows = [];
  const seen = new Set();
  for (const item of monthlyCloses) {
    if (!item || typeof item.period !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(item.period)) {
      return fail('invalid_period');
    }
    if (seen.has(item.period)) return fail('duplicate_period', { period: item.period });
    if (typeof item.close !== 'number' || !Number.isFinite(item.close) || item.close <= 0) {
      return fail('invalid_close', { period: item.period });
    }
    seen.add(item.period);
    rows.push({ period: item.period, close: item.close, ordinal: Number(item.period.slice(0, 4)) * 12 + Number(item.period.slice(5, 7)) - 1 });
  }
  rows.sort((a, b) => a.ordinal - b.ordinal);

  const monthly = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1, observations: 0, positive: 0, returns: []
  }));
  const skippedGaps = [];
  for (let i = 1; i < rows.length; i += 1) {
    const prev = rows[i - 1];
    const curr = rows[i];
    if (curr.ordinal - prev.ordinal !== 1) {
      skippedGaps.push({ from: prev.period, to: curr.period });
      continue;
    }
    const monthNumber = Number(curr.period.slice(5, 7));
    const entry = monthly[monthNumber - 1];
    const value = curr.close / prev.close - 1;
    entry.returns.push(value);
    entry.observations += 1;
    if (value > 0) entry.positive += 1;
  }

  const summary = monthly.map((item) => {
    const n = item.returns.length;
    const mean = n ? item.returns.reduce((sum, x) => sum + x, 0) / n : null;
    const variance = n > 1
      ? item.returns.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (n - 1)
      : null;
    return {
      month: item.month,
      observations: n,
      mean_return: mean,
      median_return: n ? median(item.returns) : null,
      positive_rate: n ? item.positive / n : null,
      sample_stddev: variance === null ? null : Math.sqrt(variance),
      status: n >= minSamples ? 'descriptive_sample_available' : 'insufficient_sample'
    };
  });

  return {
    ok: true,
    status: 'completed',
    analysis_type: 'historical_calendar_month_seasonality',
    market,
    instrument: instrument.trim(),
    currency_units: 'decimal_return',
    min_samples: minSamples,
    periods_supplied: rows.length,
    first_period: rows[0].period,
    last_period: rows[rows.length - 1].period,
    computed_monthly_returns: summary.reduce((sum, item) => sum + item.observations, 0),
    skipped_gaps: skippedGaps,
    months: summary,
    limitations: [
      'Historical descriptive statistics only; not a forecast or guarantee.',
      'Returns are calculated only where adjacent calendar months are both present.',
      'No fees, slippage, dividends, corporate actions, funding, or FX conversion are applied.',
      'Validate source provenance, market-specific calendars, and adjusted-price semantics before operational use.'
    ]
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

module.exports = { summarizeMonthlySeasonality };
