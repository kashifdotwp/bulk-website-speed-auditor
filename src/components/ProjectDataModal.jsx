import React, { useState, useRef } from 'react';
import { X, HardDrive, Download, Upload, ShieldCheck, CheckCircle2, AlertCircle, FileJson } from 'lucide-react';
import { exportProjectBackup, parseProjectBackupFile } from '../services/storage';

export default function ProjectDataModal({
  isOpen,
  onClose,
  results,
  shortlistedIds,
  shortlistOrder,
  shortlistNotes,
  shortlistOutreachStatus,
  leadStatusMap,
  categoryMap,
  emailMap,
  drMap,
  apiKey,
  ahrefsKey,
  onRestoreProject
}) {
  const [restoreStatus, setRestoreStatus] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    exportProjectBackup(
      results,
      shortlistedIds,
      leadStatusMap,
      categoryMap,
      emailMap,
      drMap,
      apiKey,
      ahrefsKey,
      shortlistOrder,
      shortlistNotes,
      shortlistOutreachStatus
    );
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setRestoreStatus({ type: 'loading', message: 'Parsing backup file...' });
    try {
      const parsed = await parseProjectBackupFile(file);
      if (!parsed.success) {
        setRestoreStatus({ type: 'error', message: parsed.error });
      } else {
        onRestoreProject(
          parsed.results,
          parsed.shortlistedIds,
          parsed.leadStatusMap,
          parsed.categoryMap,
          parsed.emailMap,
          parsed.drMap,
          parsed.shortlistOrder,
          parsed.shortlistNotes,
          parsed.shortlistOutreachStatus
        );
        setRestoreStatus({
          type: 'success',
          message: `Successfully restored ${parsed.results.length} audited sites, Ahrefs DR data, and shortlisted leads!`
        });
        setTimeout(() => {
          onClose();
          setRestoreStatus(null);
        }, 1500);
      }
    } catch (err) {
      setRestoreStatus({ type: 'error', message: `Restore failed: ${err.message}` });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <HardDrive size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Zero Data Loss & Project Persistence
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Backup and restore your full lead database, Ahrefs DR, speed scores, and outreach history.
              </p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status info */}
          <div style={{
            background: 'var(--status-good-bg)',
            border: '1px solid var(--status-good-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.8rem',
            color: 'var(--status-good)'
          }}>
            <ShieldCheck size={20} color="#059669" />
            <div>
              <strong>Auto-Persistence is Active:</strong> All audit results, Ahrefs DR scores, and emails are saved in local browser storage automatically.
            </div>
          </div>

          {/* Backup Action */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Download Full JSON Backup
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Saves all {results.length} audited sites, Ahrefs DR metrics, Core Web Vitals, and contact emails.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownloadBackup}
              disabled={results.length === 0}
            >
              <Download size={15} />
              <span>Download Backup ({results.length} Sites)</span>
            </button>
          </div>

          {/* Restore Action */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Restore Project from File
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Upload a previously exported <code>.json</code> backup to restore past audit campaigns and DR data.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
            />

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={15} />
              <span>Restore from JSON</span>
            </button>
          </div>

          {/* Restore Status Feedback */}
          {restoreStatus && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.825rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: restoreStatus.type === 'error' ? 'var(--status-critical-bg)' : 'var(--status-good-bg)',
              color: restoreStatus.type === 'error' ? 'var(--status-critical)' : 'var(--status-good)'
            }}>
              {restoreStatus.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{restoreStatus.message}</span>
            </div>
          )}

          {/* Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
