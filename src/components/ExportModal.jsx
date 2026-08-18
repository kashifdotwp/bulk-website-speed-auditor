import React, { useState } from 'react';
import { X, Download, Copy, Check, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { OUTREACH_ANGLES } from '../services/pitchGenerator';
import { exportToMailmeteorCsv, downloadCsvFile } from '../services/csvHandler';

export default function ExportModal({
  isOpen,
  onClose,
  results,
  emailMap,
  categoryMap,
  drMap,
  defaultAngle = 'conversion_risk'
}) {
  const [selectedAngle, setSelectedAngle] = useState(defaultAngle);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  if (!isOpen || !results || results.length === 0) return null;

  const handleDownload = () => {
    const csvContent = exportToMailmeteorCsv(results, selectedAngle, emailMap || {}, categoryMap || {}, drMap || {});
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadCsvFile(csvContent, `mailmeteor_speed_leads_${dateStr}.csv`);
  };

  const handleCopy = () => {
    const csvContent = exportToMailmeteorCsv(results, selectedAngle, emailMap || {}, categoryMap || {}, drMap || {});
    navigator.clipboard.writeText(csvContent);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '720px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Export for Mailmeteor & Cold Outreach
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {results.length} total audited lead rows with Ahrefs DR & contact emails formatted for Mailmeteor
              </p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pitch Angle Selector for CSV */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Select Pitch Hook for Dynamic Snippets:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {OUTREACH_ANGLES.map(angle => (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => setSelectedAngle(angle.id)}
                  style={{
                    background: selectedAngle === angle.id ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-primary)',
                    border: `1px solid ${selectedAngle === angle.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem'
                  }}
                >
                  <span style={{ fontSize: '0.775rem', fontWeight: 700, color: selectedAngle === angle.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                    {angle.name}
                  </span>
                  <span style={{ fontSize: '0.675rem', color: selectedAngle === angle.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {angle.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Schema Preview */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
              Included Export Columns (Preserves all original lead data):
            </strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              <span className="badge badge-cyan">Email</span>
              <span className="badge badge-indigo">Company</span>
              <span className="badge badge-indigo">Category</span>
              <span className="badge badge-cyan">Ahrefs_DR</span>
              <span className="badge badge-indigo">Domain</span>
              <span className="badge badge-indigo">Website_URL</span>
              <span className="badge badge-indigo">Mobile_Score</span>
              <span className="badge badge-indigo">Desktop_Score</span>
              <span className="badge badge-indigo">LCP_Seconds</span>
              <span className="badge badge-indigo">Top_Bottleneck</span>
              <span className="badge badge-indigo">Outreach_Priority</span>
              <span className="badge badge-indigo">Estimated_Bounce_Increase</span>
              <span className="badge badge-cyan">&#123;&#123;Hook_Speed_Snippet&#125;&#125;</span>
              <span className="badge badge-cyan">&#123;&#123;Pitch_Email_Subject&#125;&#125;</span>
              <span className="badge badge-cyan">&#123;&#123;Pitch_Email_Body&#125;&#125;</span>
              <span className="badge" style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>+ All custom lead fields</span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              * Open Google Sheets, import this CSV, and connect directly with Mailmeteor for 50–500 cold emails/day.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopy}
              >
                {copiedSuccess ? <Check size={14} color="var(--status-good)" /> : <Copy size={14} />}
                <span>{copiedSuccess ? 'Copied to Clipboard!' : 'Copy for Google Sheets'}</span>
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownload}
              >
                <Download size={14} />
                <span>Download Mailmeteor CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
