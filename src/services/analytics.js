/**
 * Analytics and Historical Timeframe Engine
 * Computes audit volume, qualified lead ratios, and velocity over hours, days, weeks, and months
 */

export const TIMEFRAMES = [
  { id: '1h', label: 'Past 1 Hour', ms: 60 * 60 * 1000 },
  { id: '24h', label: 'Past 24 Hours', ms: 24 * 60 * 60 * 1000 },
  { id: '7d', label: 'Past 7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { id: '30d', label: 'Past 30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { id: 'all', label: 'All-Time Total', ms: Infinity }
];

export function filterResultsByTimeframe(results, timeframeId = 'all') {
  if (!results || results.length === 0) return [];
  if (timeframeId === 'all') return results;

  const tf = TIMEFRAMES.find(t => t.id === timeframeId);
  if (!tf || tf.ms === Infinity) return results;

  const cutoff = Date.now() - tf.ms;
  return results.filter(r => {
    const itemDate = r.auditedAt ? new Date(r.auditedAt).getTime() : Date.now();
    return itemDate >= cutoff;
  });
}

export function computeAnalyticsStats(results, timeframeId = 'all') {
  const list = filterResultsByTimeframe(results, timeframeId);
  const total = list.length;
  const successful = list.filter(r => r.success);
  const failed = list.filter(r => !r.success);

  const slowLeads = successful.filter(r => r.score < 50);
  const averageSites = successful.filter(r => r.score >= 50 && r.score < 90);
  const goodSites = successful.filter(r => r.score >= 90);

  const avgScore = successful.length > 0
    ? Math.round(successful.reduce((acc, curr) => acc + (curr.score || 0), 0) / successful.length)
    : 0;

  const avgLcp = successful.length > 0
    ? +(successful.reduce((acc, curr) => acc + (curr.metrics?.lcp?.value || 0), 0) / successful.length).toFixed(2)
    : 0;

  // Bottleneck frequencies
  const bottleneckCounts = {};
  successful.forEach(r => {
    if (r.opportunities && r.opportunities.length > 0) {
      const title = r.opportunities[0].title;
      bottleneckCounts[title] = (bottleneckCounts[title] || 0) + 1;
    }
  });

  const topBottlenecks = Object.entries(bottleneckCounts)
    .map(([title, count]) => ({ title, count, pct: Math.round((count / (successful.length || 1)) * 100) }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    successfulCount: successful.length,
    failedCount: failed.length,
    slowLeadsCount: slowLeads.length,
    slowLeadsPct: total > 0 ? Math.round((slowLeads.length / total) * 100) : 0,
    averageSitesCount: averageSites.length,
    goodSitesCount: goodSites.length,
    avgScore,
    avgLcp,
    topBottlenecks,
    filteredItems: list
  };
}
