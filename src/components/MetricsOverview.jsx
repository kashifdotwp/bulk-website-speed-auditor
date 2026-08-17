import React from 'react';
import { Globe, Flame, Gauge, AlertOctagon, TrendingUp } from 'lucide-react';

export default function MetricsOverview({ results }) {
  if (!results || results.length === 0) return null;

  const validResults = results.filter(r => r.success);
  const total = results.length;
  const slowCount = validResults.filter(r => r.score < 50).length;
  const slowPct = total > 0 ? Math.round((slowCount / total) * 100) : 0;

  // Average Score
  const avgScore = validResults.length > 0
    ? Math.round(validResults.reduce((acc, curr) => acc + (curr.score || 0), 0) / validResults.length)
    : 0;

  // Find most frequent bottleneck
  const bottleneckCounts = {};
  for (const r of validResults) {
    if (r.opportunities && r.opportunities.length > 0) {
      const topOpp = r.opportunities[0].title;
      bottleneckCounts[topOpp] = (bottleneckCounts[topOpp] || 0) + 1;
    }
  }

  let mostCommonBottleneck = 'Uncompressed Images / Scripts';
  let maxCount = 0;
  for (const [title, count] of Object.entries(bottleneckCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonBottleneck = title;
    }
  }

  // Calculate Average LCP
  const avgLcp = validResults.length > 0
    ? (validResults.reduce((acc, curr) => acc + (curr.metrics?.lcp?.value || 0), 0) / validResults.length).toFixed(1)
    : 0;

  return (
    <div className="metrics-grid">
      {/* 1. Total Audited */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>Total Websites Audited</span>
          <Globe size={18} color="#4f46e5" />
        </div>
        <div className="metric-value-row">
          <span className="metric-value">{total}</span>
          <span className="metric-sub">domains analyzed</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {validResults.length} successful • {total - validResults.length} errors
        </div>
      </div>

      {/* 2. Slow Websites (High Priority Leads) */}
      <div className="metric-card critical">
        <div className="metric-card-header">
          <span style={{ color: 'var(--status-critical)' }}>🔥 Slow Leads (&lt;50 Score)</span>
          <Flame size={18} color="#dc2626" />
        </div>
        <div className="metric-value-row">
          <span className="metric-value" style={{ color: 'var(--status-critical)' }}>{slowCount}</span>
          <span className="metric-sub" style={{ color: 'var(--status-critical)' }}>({slowPct}% of batch)</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--status-critical)' }}>
          Prime candidates for high-converting cold outreach
        </div>
      </div>

      {/* 3. Average Speed Score */}
      <div className={`metric-card ${avgScore < 50 ? 'critical' : avgScore < 85 ? 'warning' : 'good'}`}>
        <div className="metric-card-header">
          <span>Average Performance Score</span>
          <Gauge size={18} color={avgScore < 50 ? '#dc2626' : avgScore < 85 ? '#d97706' : '#059669'} />
        </div>
        <div className="metric-value-row">
          <span className="metric-value" style={{
            color: avgScore < 50 ? 'var(--status-critical)' : avgScore < 85 ? 'var(--status-warning)' : 'var(--status-good)'
          }}>
            {avgScore}
          </span>
          <span className="metric-sub">/ 100 benchmark</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Avg Mobile LCP: <strong style={{ color: 'var(--text-primary)' }}>{avgLcp}s</strong>
        </div>
      </div>

      {/* 4. Top Common Bottleneck */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>Top Common Bottleneck</span>
          <AlertOctagon size={18} color="#0284c7" />
        </div>
        <div style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: '1.3',
          marginTop: '0.25rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {mostCommonBottleneck}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Affects {maxCount > 0 ? `${Math.round((maxCount / validResults.length) * 100)}% of tested sites` : 'multiple audited targets'}
        </div>
      </div>
    </div>
  );
}
