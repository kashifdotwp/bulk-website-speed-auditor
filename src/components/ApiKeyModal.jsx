import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, X, Shield, ExternalLink, AlertTriangle, Layers, Zap, TrendingUp } from 'lucide-react';
import { parseApiKeyPool } from '../services/psiApi';
import {
  saveApiKey as persistApiKey,
  saveAhrefsApiKey as persistAhrefsApiKey,
  loadAhrefsApiKey
} from '../services/storage';

export default function ApiKeyModal({
  isOpen,
  onClose,
  currentApiKey,
  onKeySaved,
  currentAhrefsKey,
  onAhrefsKeySaved
}) {
  const [activeTab, setActiveTab] = useState('ahrefs'); // 'ahrefs' | 'google'
  const [keyInput, setKeyInput] = useState(currentApiKey || '');
  const [ahrefsInput, setAhrefsInput] = useState(currentAhrefsKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyInput(currentApiKey || '');
    setAhrefsInput(currentAhrefsKey || loadAhrefsApiKey() || '');
  }, [currentApiKey, currentAhrefsKey, isOpen]);

  if (!isOpen) return null;

  const keyCount = parseApiKeyPool(keyInput).length;

  const handleSave = (e) => {
    e.preventDefault();
    const cleanGoogle = keyInput.trim();
    const cleanAhrefs = ahrefsInput.trim();

    persistApiKey(cleanGoogle);
    persistAhrefsApiKey(cleanAhrefs);

    if (onKeySaved) onKeySaved(cleanGoogle);
    if (onAhrefsKeySaved) onAhrefsKeySaved(cleanAhrefs);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleRemoveAhrefs = () => {
    persistAhrefsApiKey('');
    if (onAhrefsKeySaved) onAhrefsKeySaved('');
    setAhrefsInput('');
  };

  const handleRemoveGoogle = () => {
    persistApiKey('');
    if (onKeySaved) onKeySaved('');
    setKeyInput('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>API Keys & Integrations</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Configure Ahrefs Domain Rating (DR) & Google PageSpeed Insights
              </p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.5rem', background: 'var(--bg-primary)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ahrefs')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'ahrefs' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'ahrefs' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <TrendingUp size={15} />
            <span>Ahrefs API (Domain Rating)</span>
            {ahrefsInput.trim() && <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Active</span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'google' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'google' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Zap size={15} />
            <span>Google PageSpeed API</span>
            {keyInput.trim() && <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>Active</span>}
          </button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* TAB 1: AHREFS API */}
          {activeTab === 'ahrefs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Enter Ahrefs API Key / Bearer Token:
                  </label>
                  {ahrefsInput.trim() ? (
                    <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                      Key Configured
                    </span>
                  ) : (
                    <span className="badge" style={{ fontSize: '0.7rem', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
                      Optional
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  className="search-input"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                  placeholder="Paste your Ahrefs API Token (Bearer ...)"
                  value={ahrefsInput}
                  onChange={e => setAhrefsInput(e.target.value)}
                />
              </div>

              {/* Info Guide */}
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontSize: '0.775rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.825rem' }}>
                  <TrendingUp size={16} /> How Ahrefs Domain Rating (DR) Works:
                </div>
                <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', margin: 0 }}>
                  <li>Queries Ahrefs official API endpoint: <code>https://api.ahrefs.com/v3/public/domain-rating-free</code>.</li>
                  <li>Automatically fetches each audited website's <strong>Domain Rating (0-100)</strong>.</li>
                  <li>Displays the DR score in the new <strong>Ahrefs DR</strong> column and supports 1-click sorting.</li>
                  <li>Get your API token at: <a href="https://ahrefs.com/api" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>ahrefs.com/api <ExternalLink size={11} style={{ display: 'inline' }} /></a>.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE PAGESPEED API */}
          {activeTab === 'google' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Google Cloud PSI API Key(s) — Paste one or multiple keys:
                  </label>
                  <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                    {keyCount} {keyCount === 1 ? 'Key Detected' : 'Keys in Rotation Pool'}
                  </span>
                </div>
                <textarea
                  className="textarea-box"
                  style={{ height: '90px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  placeholder="AIzaSy... (paste one or multiple keys, separated by commas or newlines)"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                />
              </div>

              {/* Fallback Banner */}
              <div style={{
                background: 'rgba(79, 70, 229, 0.08)',
                border: '1px solid rgba(79, 70, 229, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.8rem',
                color: 'var(--text-primary)'
              }}>
                <Zap size={20} color="var(--accent-primary)" />
                <div>
                  <strong>Default Official Key Included:</strong> 25,000 free Google audits/day is pre-configured and active.
                </div>
              </div>
            </div>
          )}

          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-good)', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> Settings saved to local storage!
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {activeTab === 'ahrefs' && ahrefsInput ? (
              <button type="button" className="btn btn-danger" onClick={handleRemoveAhrefs}>
                Clear Ahrefs Key
              </button>
            ) : activeTab === 'google' && currentApiKey ? (
              <button type="button" className="btn btn-danger" onClick={handleRemoveGoogle}>
                Clear Google Keys
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Apply Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
