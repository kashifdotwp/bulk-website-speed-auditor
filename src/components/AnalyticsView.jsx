import React, { useState } from 'react';
import { BarChart3, Clock, Flame, CheckCircle2, Zap, AlertTriangle, TrendingUp, Calendar, Download } from 'lucide-react';
import { TIMEFRAMES, computeAnalyticsStats } from '../services/analytics';
import { exportToMailmeteorCsv, downloadCsvFile } from '../services/csvHandler';

export default function AnalyticsView({ results }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const stats = computeAnalyticsStats(results, selectedTimeframe);

  const handleExportTimeframe = () => {
    if (stats.filteredItems.length === 0) return;
    const csvContent = exportToMailmeteorCsv(stats.filteredItems, 'conversion_risk');
    downloadCsvFile(csvContent, `audit_analytics_${selectedTimeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Timeframe Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BarChart3 size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Audit Velocity & Historical Analytics
            </h3>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Track audit volume, qualified lead conversion ratios, and bottleneck distribution across timeframes.
          </p>
        </div>

        {/* Timeframe selector buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.id}
              type="button"
              className={`strategy-btn ${selectedTimeframe === tf.id ? 'active' : ''}`}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}
              onClick={() => setSelectedTimeframe(tf.id)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards for Timeframe */}
      <div className="metrics-grid">
        {/* 1. Timeframe Volume */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span>Audits in Timeframe</span>
            <Clock size={16} color="#4f46e5" />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.total}</span>
            <span className="metric-sub">sites tested</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {stats.successfulCount} successful • {stats.failedCount} errors
          </div>
        </div>

        {/* 2. Slow Qualified Leads */}
        <div className="metric-card critical">
          <div className="metric-card-header">
            <span style={{ color: 'var(--status-critical)' }}>🔥 Slow Leads (&lt;50 Score)</span>
            <Flame size={16} color="#dc2626" />
          </div>
          <div className="metric-value-row">
            <span className="metric-value" style={{ color: 'var(--status-critical)' }}>{stats.slowLeadsCount}</span>
            <span className="metric-sub" style={{ color: 'var(--status-critical)' }}>({stats.slowLeadsPct}% qualified)</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--status-critical)' }}>
            High-converting cold pitch targets
          </div>
        </div>

        {/* 3. Average Score */}
        <div className={`metric-card ${stats.avgScore < 50 ? 'critical' : stats.avgScore < 85 ? 'warning' : 'good'}`}>
          <div className="metric-card-header">
            <span>Average Speed Score</span>
            <TrendingUp size={16} color="#0284c7" />
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{stats.avgScore}</span>
            <span className="metric-sub">/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Average LCP: <strong style={{ color: 'var(--text-primary)' }}>{stats.avgLcp}s</strong>
          </div>
        </div>

        {/* 4. Tier Breakdown */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span>Lead Quality Breakdown</span>
            <Zap size={16} color="#d97706" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--status-critical)' }}>🔴 Poor (&lt;50):</span>
              <strong>{stats.slowLeadsCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--status-warning)' }}>🟡 Average (50-89):</span>
              <strong>{stats.averageSitesCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--status-good)' }}>🟢 Good (90+):</span>
              <strong>{stats.goodSitesCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Top Bottlenecks Frequency Breakdown */}
      {stats.topBottlenecks.length > 0 && (
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              Top Bottlenecks Detected in Selected Timeframe
            </strong>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Based on {stats.successfulCount} audited sites
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {stats.topBottlenecks.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.title}</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{item.count} sites ({item.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #0284c7)', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Action */}
      {stats.total > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
            onClick={handleExportTimeframe}
          >
            <Download size={14} />
            <span>Download CSV for {TIMEFRAMES.find(t => t.id === selectedTimeframe)?.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
