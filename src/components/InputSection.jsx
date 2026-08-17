import React, { useState, useRef } from 'react';
import { Link2, UploadCloud, FileText, CheckCircle2, AlertCircle, Play, Clock, ShieldCheck } from 'lucide-react';
import { parseRawUrlText, parseCsvFile } from '../services/csvHandler';

export default function InputSection({
  onStartAudit,
  isRunning,
  concurrency,
  onConcurrencyChange,
  delayGap,
  onDelayGapChange,
  strategy,
  onStrategyChange
}) {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'csv'
  const [rawText, setRawText] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [csvLeads, setCsvLeads] = useState([]);
  const [detectedColumns, setDetectedColumns] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Parse pasted URLs on change
  const pastedLeads = parseRawUrlText(rawText);

  // Handle CSV file selection
  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMsg('');
    try {
      const result = await parseCsvFile(file);
      if (result.error) {
        setErrorMsg(result.error);
        setCsvLeads([]);
        setDetectedColumns(null);
      } else {
        setCsvFile(file);
        setCsvLeads(result.leads);
        setDetectedColumns(result.detectedColumns);
      }
    } catch (err) {
      setErrorMsg(`Failed to parse CSV: ${err.message}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleStart = () => {
    setErrorMsg('');
    const targetLeads = activeTab === 'paste' ? pastedLeads : csvLeads;
    if (targetLeads.length === 0) {
      setErrorMsg('Please provide at least one website URL to audit.');
      return;
    }
    onStartAudit(targetLeads);
  };

  const activeLeadCount = activeTab === 'paste' ? pastedLeads.length : csvLeads.length;

  // Calculate estimated total time for batch
  const estimatedSeconds = activeLeadCount > 0
    ? Math.round((activeLeadCount * (strategy === 'both' ? 14 : 9) + (activeLeadCount * delayGap)) / Math.max(1, concurrency))
    : 0;

  const formatEstimatedTime = (sec) => {
    if (sec < 60) return `~${sec}s`;
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return rem > 0 ? `~${mins}m ${rem}s` : `~${mins}m`;
  };

  return (
    <div className="glass-panel input-card">
      <div className="tab-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'paste' ? 'active' : ''}`}
          onClick={() => { setActiveTab('paste'); setErrorMsg(''); }}
        >
          <Link2 size={16} /> Paste URLs ({pastedLeads.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'csv' ? 'active' : ''}`}
          onClick={() => { setActiveTab('csv'); setErrorMsg(''); }}
        >
          <UploadCloud size={16} /> Upload Lead CSV {csvLeads.length > 0 ? `(${csvLeads.length})` : ''}
        </button>
      </div>

      {activeTab === 'paste' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Enter or paste 1–500 website URLs (one per line or comma-separated):
            </span>
          </div>
          <textarea
            className="textarea-box"
            placeholder="https://wedsads.com/&#10;https://example.com&#10;..."
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            disabled={isRunning}
          />
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
          />

          {!csvFile ? (
            <div
              className={`dropzone ${isDragging ? 'active' : ''}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="dropzone-icon" />
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Click to upload or drag & drop CSV file
                </strong>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Supports Apollo, Outscraper, Hunter, Google Maps scraper exports (Preserves all lead columns)
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <FileText size={20} color="var(--accent-primary)" />
                  <div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{csvFile.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                      ({csvLeads.length} target websites found)
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  onClick={() => { setCsvFile(null); setCsvLeads([]); setDetectedColumns(null); }}
                >
                  Change File
                </button>
              </div>

              {detectedColumns && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <span className="badge badge-indigo">✓ Website: {detectedColumns.url}</span>
                  {detectedColumns.email && <span className="badge badge-cyan">✓ Email: {detectedColumns.email}</span>}
                  {detectedColumns.firstName && <span className="badge badge-cyan">✓ First Name: {detectedColumns.firstName}</span>}
                  {detectedColumns.company && <span className="badge badge-cyan">✓ Company: {detectedColumns.company}</span>}
                  {detectedColumns.city && <span className="badge badge-cyan">✓ City: {detectedColumns.city}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--status-critical)',
          fontSize: '0.8rem',
          marginTop: '0.75rem',
          background: 'var(--status-critical-bg)',
          border: '1px solid var(--status-critical-border)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Audit Settings Bar */}
      <div className="input-actions-bar" style={{ background: 'var(--bg-primary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Strategy Mode */}
          <div className="concurrency-picker">
            <span style={{ fontWeight: 600 }}>Device Audit:</span>
            <select
              value={strategy}
              onChange={e => onStrategyChange(e.target.value)}
              disabled={isRunning}
            >
              <option value="both">📱 Mobile & 💻 Desktop (Full Audit)</option>
              <option value="mobile">📱 Mobile Only</option>
              <option value="desktop">💻 Desktop Only</option>
            </select>
          </div>

          {/* Concurrency Workers */}
          <div className="concurrency-picker">
            <span style={{ fontWeight: 600 }}>Workers:</span>
            <select
              value={concurrency}
              onChange={e => onConcurrencyChange(Number(e.target.value))}
              disabled={isRunning}
            >
              <option value="1">1 Worker (Safe / Strict Sequential)</option>
              <option value="2">2 Workers (Recommended)</option>
              <option value="3">3 Workers</option>
              <option value="4">4 Workers (Fast)</option>
            </select>
          </div>

          {/* Rate Limit Pause Gap */}
          <div className="concurrency-picker">
            <span style={{ fontWeight: 600 }}>Google Rate Pause:</span>
            <select
              value={delayGap}
              onChange={e => onDelayGapChange(Number(e.target.value))}
              disabled={isRunning}
            >
              <option value="1.0">1.0s Gap</option>
              <option value="2.0">2.0s Gap (Safe for Batches)</option>
              <option value="3.5">3.5s Gap</option>
              <option value="5.0">5.0s Gap (Heavy Batches)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {activeLeadCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              <Clock size={14} color="var(--accent-primary)" />
              <span>Est. Time: <strong style={{ color: 'var(--text-primary)' }}>{formatEstimatedTime(estimatedSeconds)}</strong></span>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.6rem', fontSize: '0.875rem' }}
            onClick={handleStart}
            disabled={isRunning || activeLeadCount === 0}
          >
            <Play size={15} fill="white" />
            <span>Start Live Audit ({activeLeadCount} {activeLeadCount === 1 ? 'Site' : 'Sites'})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
