import React, { useState, useEffect } from 'react';
import { TrendingUp, Check, Key, ShieldCheck, Loader2, RefreshCw } from 'lucide-react';
import { saveAhrefsApiKey } from '../services/storage';

export default function AhrefsBar({
  ahrefsKey,
  onSaveAhrefsKey,
  onFetchAllDr,
  isFetchingDr,
  hasResults
}) {
  const [keyInput, setKeyInput] = useState(ahrefsKey || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeyInput(ahrefsKey || '');
  }, [ahrefsKey]);

  const handleSave = (e) => {
    e?.preventDefault();
    const clean = keyInput.trim();
    saveAhrefsApiKey(clean);
    onSaveAhrefsKey(clean);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <TrendingUp size={16} />
        </div>
        <div>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Ahrefs Domain Rating (DR) Settings
            {ahrefsKey ? (
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                <ShieldCheck size={10} style={{ marginRight: '2px' }} /> Active
              </span>
            ) : (
              <span className="badge" style={{ fontSize: '0.65rem', background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                Optional
              </span>
            )}
          </span>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Queries Ahrefs v3 API to show Domain Rating (0-100) and sort leads by SEO authority
          </p>
        </div>
      </div>

      {/* Input & Save Action */}
      <form onSubmit={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="password"
            className="search-input"
            placeholder="Enter Ahrefs API Key / Token"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem 0.65rem',
              fontSize: '0.775rem',
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem' }}
        >
          {saved ? <Check size={13} /> : <Key size={13} />}
          <span>{saved ? 'Saved!' : 'Save Key'}</span>
        </button>

        {hasResults && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem', color: 'var(--accent-primary)' }}
            onClick={onFetchAllDr}
            disabled={isFetchingDr}
            title="Fetch Ahrefs Domain Rating for all websites on screen"
          >
            {isFetchingDr ? <Loader2 size={13} className="spin-icon" /> : <RefreshCw size={13} />}
            <span>{isFetchingDr ? 'Fetching DRs...' : 'Fetch All DRs'}</span>
          </button>
        )}
      </form>
    </div>
  );
}
