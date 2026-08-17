import React from 'react';
import { Pause, Play, Square, Clock, Activity, CheckCircle2, ShieldCheck } from 'lucide-react';

function formatEta(seconds) {
  if (!seconds || seconds <= 0) return 'calculating...';
  if (seconds < 60) return `~${seconds}s remaining`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `~${mins}m ${secs}s remaining`;
}

export default function QueueController({
  progress,
  onPause,
  onResume,
  onCancel
}) {
  if (!progress || (!progress.isRunning && progress.completed === 0 && !progress.isPaused)) {
    return null;
  }

  const {
    total,
    completed,
    activeUrls,
    progressPct,
    etaSeconds,
    delayGap = 2.0,
    isPaused,
    isRunning
  } = progress;

  const isDone = completed >= total && total > 0 && !isRunning;

  return (
    <div className="glass-panel queue-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isRunning && !isPaused && <span className="pulse-dot" />}
          {isDone && <CheckCircle2 size={18} color="var(--status-good)" />}
          <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {isDone ? '🎉 Batch Audit Completed!' : isPaused ? '⏸️ Queue Paused' : '⚡ Official Google PSI Live Audit in Progress...'}
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            [{completed}/{total} sites] ({progressPct}%)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isDone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Clock size={14} color="var(--accent-primary)" />
              <span>{formatEta(etaSeconds)}</span>
              {delayGap > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({delayGap}s rate pause)</span>}
            </div>
          )}

          {/* Controls */}
          {isRunning && !isPaused && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={onPause}
            >
              <Pause size={13} /> Pause
            </button>
          )}

          {isPaused && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={onResume}
            >
              <Play size={13} /> Resume
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              type="button"
              className="btn btn-danger"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              onClick={onCancel}
            >
              <Square size={13} /> Stop
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="progress-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
        />
      </div>

      {/* Active Ticker */}
      {activeUrls && activeUrls.length > 0 && !isDone && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Activity size={13} color="var(--accent-cyan)" /> Auditing via Google Lighthouse 13.4.1:
          </span>
          {activeUrls.map((u, i) => (
            <span
              key={i}
              className="badge badge-cyan"
              style={{ fontSize: '0.725rem' }}
            >
              {u.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
