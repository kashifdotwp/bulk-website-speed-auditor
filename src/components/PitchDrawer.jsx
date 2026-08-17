import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Send, Mail, Sparkles, ExternalLink, Flame, ShieldAlert } from 'lucide-react';
import { OUTREACH_ANGLES, generatePitch, buildMailmeteorSnippet } from '../services/pitchGenerator';

export default function PitchDrawer({
  isOpen,
  onClose,
  item,
  selectedAngle,
  onSelectAngle
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  // Update pitch content when item or angle changes
  useEffect(() => {
    if (item) {
      const pitch = generatePitch(item, selectedAngle, item.originalData || {});
      setCustomSubject(pitch.subject);
      setCustomBody(pitch.body);
    }
  }, [item, selectedAngle]);

  if (!isOpen || !item) return null;

  const orig = item.originalData || {};
  const snippet = buildMailmeteorSnippet(item);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleOpenEmail = () => {
    const to = orig.email || '';
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-right" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Mail size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cold Outreach Pitch Generator
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Target: <strong>{orig.company || item.domain}</strong> ({item.domain})
              </p>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Quick Lead Metric Card */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className={`score-badge ${item.score < 50 ? 'critical' : item.score < 90 ? 'warning' : 'good'}`} style={{ width: '38px', height: '38px', fontSize: '0.95rem' }}>
                {item.score}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Mobile Score: {item.score}/100
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  LCP: {item.metrics?.lcp?.display} • TBT: {item.metrics?.tbt?.display}
                </div>
              </div>
            </div>

            {orig.email && (
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
                Recipient: {orig.email}
              </span>
            )}
          </div>

          {/* Angle Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Select Cold Pitch Framework:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {OUTREACH_ANGLES.map(angle => (
                <button
                  key={angle.id}
                  type="button"
                  onClick={() => onSelectAngle(angle.id)}
                  style={{
                    background: selectedAngle === angle.id ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-primary)',
                    border: `1px solid ${selectedAngle === angle.id ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedAngle === angle.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {angle.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.675rem', color: selectedAngle === angle.id ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                    {angle.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Subject Line</span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                onClick={() => handleCopy(customSubject, 'subject')}
              >
                {copiedField === 'subject' ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                <span>{copiedField === 'subject' ? 'Copied' : 'Copy Subject'}</span>
              </button>
            </div>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.825rem' }}
              value={customSubject}
              onChange={e => setCustomSubject(e.target.value)}
            />
          </div>

          {/* Email Body */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Pitch Body</span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                onClick={() => handleCopy(customBody, 'body')}
              >
                {copiedField === 'body' ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                <span>{copiedField === 'body' ? 'Copied' : 'Copy Body'}</span>
              </button>
            </div>
            <textarea
              className="textarea-box"
              style={{ height: '220px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
              value={customBody}
              onChange={e => setCustomBody(e.target.value)}
            />
          </div>

          {/* Mailmeteor Merge Snippet */}
          <div style={{
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                Mailmeteor Snippet Tag: &#123;&#123;Hook_Speed_Snippet&#125;&#125;
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                onClick={() => handleCopy(snippet, 'snippet')}
              >
                {copiedField === 'snippet' ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                <span>{copiedField === 'snippet' ? 'Copied' : 'Copy Tag'}</span>
              </button>
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-primary)', fontStyle: 'italic' }}>
              "{snippet}"
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleCopy(`${customSubject}\n\n${customBody}`, 'full')}
              >
                {copiedField === 'full' ? <Check size={14} color="var(--status-good)" /> : <Copy size={14} />}
                <span>{copiedField === 'full' ? 'Full Pitch Copied!' : 'Copy Full Email'}</span>
              </button>

              <button
                type="button"
                className="btn btn-accent"
                onClick={handleOpenEmail}
              >
                <Send size={14} />
                <span>Open in Mail</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
