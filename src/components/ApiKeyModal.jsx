import React, { useState } from 'react';
import { Key, CheckCircle, X, Shield, ExternalLink, AlertTriangle, Layers, Zap } from 'lucide-react';
import { parseApiKeyPool } from '../services/psiApi';
import { saveApiKey as persistApiKey } from '../services/storage';

export default function ApiKeyModal({ isOpen, onClose, currentApiKey, onKeySaved }) {
  const [keyInput, setKeyInput] = useState(currentApiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const keyCount = parseApiKeyPool(keyInput).length;

  const handleSave = (e) => {
    e.preventDefault();
    const clean = keyInput.trim();
    persistApiKey(clean);
    onKeySaved(clean);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleRemove = () => {
    persistApiKey('');
    onKeySaved('');
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
              background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Google PageSpeed API Key & Rotation Pool</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Supports multiple rotating API keys + Live Direct Analyzer
              </p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

          {/* Smart Fallback Banner */}
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
              <strong>Live Direct Speed Analyzer Active:</strong> If Google API key is empty or rate-limited, the system directly audits target domains in real-time measuring TTFB and analyzing asset payloads.
            </div>
          </div>

          {/* Quota Optimization Guide */}
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
              <Shield size={16} /> How to get a Google PageSpeed API Key (25,000 free audits/day):
            </div>
            <ol style={{ paddingLeft: '1.25rem', lineHeight: '1.6' }}>
              <li>Open Google Cloud Console for project <strong>optical-unison-497018-i1</strong> (or create a new free project).</li>
              <li>Go to <strong>APIs & Services &gt; Credentials &gt; Create Credentials &gt; API Key</strong>.</li>
              <li>Enable <strong>PageSpeed Insights API</strong> in the API Library.</li>
              <li>Paste the `AIzaSy...` key here for direct Google Lighthouse reports.</li>
            </ol>
          </div>

          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-good)', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> API Key Pool saved successfully!
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            {currentApiKey ? (
              <button type="button" className="btn btn-danger" onClick={handleRemove}>
                Clear Keys
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Apply Key Pool
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
