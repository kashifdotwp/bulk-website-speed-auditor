import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  Copy,
  Check,
  Flame,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Star,
  Smartphone,
  Monitor,
  Trash2,
  Tag,
  Edit2,
  Search,
  Loader2,
  Plus
} from 'lucide-react';
import { buildMailmeteorSnippet } from '../services/pitchGenerator';
import { CATEGORY_DEFINITIONS, autoDetectCategory } from '../services/categories';
import { scrapeWebsiteEmail } from '../services/emailFinder';

export const LEAD_STATUS_OPTIONS = [
  { id: 'new', label: 'New Lead', color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
  { id: 'pitched', label: 'Pitched 📨', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' },
  { id: 'replied', label: 'Replied 💬', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)' },
  { id: 'won', label: 'Client Won 🏆', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
  { id: 'archived', label: 'Archived 📁', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' }
];

export default function ResultsTable({
  results,
  shortlistedIds,
  onToggleShortlist,
  leadStatusMap,
  onChangeLeadStatus,
  categoryMap,
  onChangeCategory,
  emailMap,
  onChangeEmail,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onDeleteSingle,
  onOpenPitchDrawer
}) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [copiedEmailId, setCopiedEmailId] = useState(null);
  const [editingEmailId, setEditingEmailId] = useState(null);
  const [tempEmailInput, setTempEmailInput] = useState('');
  const [scrapingEmailIds, setScrapingEmailIds] = useState(new Set());

  const toggleRow = (id) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copySnippet = (item) => {
    const snippet = buildMailmeteorSnippet(item);
    navigator.clipboard.writeText(snippet);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const copyEmail = (email, id) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 1800);
  };

  const handleStartEditEmail = (id, currentEmail) => {
    setEditingEmailId(id);
    setTempEmailInput(currentEmail || '');
  };

  const handleSaveEmail = (id) => {
    onChangeEmail(id, tempEmailInput.trim());
    setEditingEmailId(null);
    setTempEmailInput('');
  };

  const handleAutoScrapeEmail = async (item) => {
    const id = item.id;
    setScrapingEmailIds(prev => new Set(prev).add(id));
    try {
      const res = await scrapeWebsiteEmail(item.url);
      if (res.success && res.email) {
        onChangeEmail(id, res.email);
        setTempEmailInput(res.email);
      } else {
        alert(`No public email found on ${item.domain}. You can enter it manually.`);
      }
    } catch {
      alert(`Could not scrape email for ${item.domain}`);
    } finally {
      setScrapingEmailIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const allSelected = results.length > 0 && results.every(r => selectedIds?.has(r.id));

  if (!results || results.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileText size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No Matching Websites</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
          Try clearing search filters, or paste new website URLs to start a live speed audit.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '35px', textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={e => onToggleSelectAll(e.target.checked)}
                style={{ cursor: 'pointer' }}
                title="Select all"
              />
            </th>
            <th style={{ width: '35px', textAlign: 'center' }}>⭐</th>
            <th style={{ width: '30px' }}></th>
            <th>Website / Company</th>
            <th style={{ width: '210px' }}>Contact Email</th>
            <th style={{ width: '120px' }}>Category</th>
            <th style={{ textAlign: 'center', width: '125px' }}>Speed Scores</th>
            <th>Core Web Vitals</th>
            <th>Top Bottleneck</th>
            <th style={{ textAlign: 'center', width: '100px' }}>Priority</th>
            <th style={{ textAlign: 'center', width: '110px' }}>Status</th>
            <th style={{ textAlign: 'right', width: '175px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item) => {
            const isExpanded = expandedRows.has(item.id);
            const isStarred = shortlistedIds?.has(item.id);
            const isSelected = selectedIds?.has(item.id);
            const currentStatusId = leadStatusMap?.[item.id] || 'new';
            const currentStatus = LEAD_STATUS_OPTIONS.find(s => s.id === currentStatusId) || LEAD_STATUS_OPTIONS[0];

            // Resolve Category
            const currentCatId = categoryMap?.[item.id] || autoDetectCategory(item);
            const currentCat = CATEGORY_DEFINITIONS.find(c => c.id === currentCatId) || CATEGORY_DEFINITIONS[4];

            // Resolve Email
            const effectiveEmail = emailMap?.[item.id] ?? (item.originalData?.email || '');
            const isEditingThisEmail = editingEmailId === item.id;
            const isScrapingThisEmail = scrapingEmailIds.has(item.id);
            const isEmailCopied = copiedEmailId === item.id;

            const orig = item.originalData || {};
            const mScore = item.mobile?.score ?? item.score ?? 0;
            const dScore = item.desktop?.score ?? item.desktopScore ?? null;

            const mScoreClass = mScore < 50 ? 'critical' : mScore < 90 ? 'warning' : 'good';
            const dScoreClass = dScore !== null ? (dScore < 50 ? 'critical' : dScore < 90 ? 'warning' : 'good') : '';
            const isCopied = copiedId === item.id;

            if (!item.success) {
              return (
                <tr key={item.id} style={{ background: 'var(--status-critical-bg)' }}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(isSelected)}
                      onChange={() => onToggleSelect(item.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(item.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isStarred ? '#f59e0b' : 'var(--text-muted)' }}
                    >
                      <Star size={16} fill={isStarred ? '#f59e0b' : 'transparent'} />
                    </button>
                  </td>
                  <td></td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--status-critical)' }}>{item.domain || item.url}</span>
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        {item.url} <ExternalLink size={10} />
                      </a>
                    </div>
                  </td>
                  <td colSpan={7} style={{ color: 'var(--status-critical)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <AlertTriangle size={15} />
                      <span>Audit Failed: {item.error || 'Domain unreachable'}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ color: 'var(--status-critical)', padding: '0.35rem 0.5rem' }}
                      onClick={() => onDeleteSingle(item.id)}
                      title="Delete from list"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            }

            return (
              <React.Fragment key={item.id}>
                <tr className={mScore < 50 ? 'row-critical' : ''}>
                  {/* Select Checkbox */}
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(isSelected)}
                      onChange={() => onToggleSelect(item.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>

                  {/* Star Shortlist */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(item.id)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isStarred ? '#f59e0b' : 'var(--text-muted)', transition: 'transform 0.15s ease' }}
                      title={isStarred ? 'Remove from Shortlist' : 'Add to Shortlist'}
                    >
                      <Star size={16} fill={isStarred ? '#f59e0b' : 'transparent'} />
                    </button>
                  </td>

                  {/* Expand toggle */}
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleRow(item.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Toggle detailed Mobile & Desktop diagnostics"
                    >
                      {isExpanded ? <ChevronDown size={17} color="var(--accent-primary)" /> : <ChevronRight size={17} />}
                    </button>
                  </td>

                  {/* Domain & Company info */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                          {orig.company || item.domain}
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}
                          title="Open live website"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {item.domain}
                        </span>
                        {orig.city && (
                          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            • {orig.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* EMAIL COLUMN: Live Scraper & Manual Edit */}
                  <td>
                    {isEditingThisEmail ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <input
                            type="email"
                            placeholder="e.g. info@domain.com"
                            value={tempEmailInput}
                            onChange={e => setTempEmailInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEmail(item.id); }}
                            style={{
                              background: 'var(--bg-input)',
                              border: '1px solid var(--accent-primary)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.25rem 0.45rem',
                              fontSize: '0.75rem',
                              color: 'var(--text-primary)',
                              width: '100%',
                              outline: 'none'
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.45rem', fontSize: '0.7rem' }}
                            onClick={() => handleSaveEmail(item.id)}
                            title="Save Email"
                          >
                            <Check size={12} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.675rem', padding: '0.2rem 0.45rem', color: 'var(--accent-primary)' }}
                            onClick={() => handleAutoScrapeEmail(item)}
                            disabled={isScrapingThisEmail}
                          >
                            {isScrapingThisEmail ? <Loader2 size={11} className="spin-icon" /> : <Search size={11} />}
                            <span>{isScrapingThisEmail ? 'Scraping...' : 'Auto-Scrape'}</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.675rem', padding: '0.2rem 0.45rem' }}
                            onClick={() => setEditingEmailId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : effectiveEmail ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <a
                          href={`mailto:${effectiveEmail}`}
                          className="badge badge-cyan"
                          style={{
                            fontSize: '0.725rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            textDecoration: 'none',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={`Send email to ${effectiveEmail}`}
                        >
                          <Mail size={11} />
                          <span>{effectiveEmail}</span>
                        </a>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          {/* Copy Email */}
                          <button
                            type="button"
                            onClick={() => copyEmail(effectiveEmail, item.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                            title="Copy email"
                          >
                            {isEmailCopied ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                          </button>

                          {/* Edit Email */}
                          <button
                            type="button"
                            onClick={() => handleStartEditEmail(item.id, effectiveEmail)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                            title="Edit email address"
                          >
                            <Edit2 size={11} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', color: 'var(--accent-primary)', borderStyle: 'dashed' }}
                          onClick={() => handleAutoScrapeEmail(item)}
                          disabled={isScrapingThisEmail}
                          title="Scrape contact email from website"
                        >
                          {isScrapingThisEmail ? <Loader2 size={11} className="spin-icon" /> : <Search size={11} />}
                          <span>{isScrapingThisEmail ? 'Scraping...' : 'Find Email'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEditEmail(item.id, '')}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.7rem' }}
                          title="Manually add email"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Category Dropdown */}
                  <td>
                    <select
                      value={currentCatId}
                      onChange={e => onChangeCategory(item.id, e.target.value)}
                      style={{
                        background: currentCat.bg,
                        color: currentCat.color,
                        border: `1px solid ${currentCat.color}40`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.25rem 0.45rem',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                      title="Change business category"
                    >
                      {CATEGORY_DEFINITIONS.map(cat => (
                        <option key={cat.id} value={cat.id} style={{ background: 'var(--bg-card-solid)', color: 'var(--text-primary)' }}>
                          {cat.badge}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Mobile & Desktop Scores */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }} title="Google PSI Mobile Performance">
                        <div className={`score-badge ${mScoreClass}`} style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                          {mScore}
                        </div>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <Smartphone size={9} /> Mobile
                        </span>
                      </div>

                      {dScore !== null && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }} title="Google PSI Desktop Performance">
                          <div className={`score-badge ${dScoreClass}`} style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
                            {dScore}
                          </div>
                          <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Monitor size={9} /> Desktop
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Core Web Vitals */}
                  <td>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(60px, 1fr))', gap: '0.3rem 0.55rem' }}>
                      <div className="cwv-chip">
                        <span className="cwv-label">LCP</span>
                        <span className={`cwv-val ${item.metrics?.lcp?.status}`}>
                          {item.metrics?.lcp?.display || 'N/A'}
                        </span>
                      </div>
                      <div className="cwv-chip">
                        <span className="cwv-label">TBT</span>
                        <span className={`cwv-val ${item.metrics?.tbt?.status}`}>
                          {item.metrics?.tbt?.display || 'N/A'}
                        </span>
                      </div>
                      <div className="cwv-chip">
                        <span className="cwv-label">FCP</span>
                        <span className={`cwv-val ${item.metrics?.fcp?.status}`}>
                          {item.metrics?.fcp?.display || 'N/A'}
                        </span>
                      </div>
                      <div className="cwv-chip">
                        <span className="cwv-label">CLS</span>
                        <span className={`cwv-val ${item.metrics?.cls?.status}`}>
                          {item.metrics?.cls?.display || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Top Bottleneck */}
                  <td>
                    <div style={{ maxWidth: '200px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: '1.3' }}>
                        {item.topBottleneck}
                      </div>
                    </div>
                  </td>

                  {/* Priority Tag */}
                  <td style={{ textAlign: 'center' }}>
                    {mScore < 50 ? (
                      <span className="priority-pill hot">
                        <Flame size={11} fill="var(--status-critical)" />
                        <span>High</span>
                      </span>
                    ) : mScore < 90 ? (
                      <span className="priority-pill warm">
                        <Zap size={11} />
                        <span>Warm</span>
                      </span>
                    ) : (
                      <span className="priority-pill pass">
                        <CheckCircle2 size={11} />
                        <span>Pass</span>
                      </span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td style={{ textAlign: 'center' }}>
                    <select
                      value={currentStatusId}
                      onChange={e => onChangeLeadStatus(item.id, e.target.value)}
                      style={{
                        background: currentStatus.bg,
                        color: currentStatus.color,
                        border: `1px solid ${currentStatus.color}40`,
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.2rem 0.4rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {LEAD_STATUS_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id} style={{ background: 'var(--bg-card-solid)', color: 'var(--text-primary)' }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                      {/* Pitch Lead */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ fontSize: '0.725rem', padding: '0.3rem 0.55rem' }}
                        onClick={() => onOpenPitchDrawer({ ...item, resolvedEmail: effectiveEmail })}
                      >
                        <Mail size={12} />
                        <span>Pitch</span>
                      </button>

                      {/* Copy Snippet */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.725rem', padding: '0.3rem 0.45rem' }}
                        onClick={() => copySnippet(item)}
                        title="Copy dynamic Mailmeteor hook snippet"
                      >
                        {isCopied ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.725rem', padding: '0.3rem 0.45rem', color: 'var(--status-critical)' }}
                        onClick={() => onDeleteSingle(item.id)}
                        title="Delete website from list"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row Diagnostics */}
                {isExpanded && (
                  <tr>
                    <td colSpan={12} style={{ background: 'var(--bg-primary)', padding: '1.25rem 1.5rem 1.5rem 2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Header Link */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Official Google Lighthouse Analysis — {item.domain}</span>
                            <span className="badge badge-indigo">📱 Mobile: {mScore}/100</span>
                            {dScore !== null && <span className="badge badge-cyan">💻 Desktop: {dScore}/100</span>}
                            <span className="badge" style={{ background: currentCat.bg, color: currentCat.color }}>{currentCat.badge}</span>
                            {effectiveEmail && <span className="badge badge-cyan"><Mail size={11} style={{ marginRight: '3px' }} /> {effectiveEmail}</span>}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <a
                              href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(item.url)}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--accent-primary)', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'underline' }}
                            >
                              Open in Google PageSpeed Insights <ExternalLink size={12} />
                            </a>
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ fontSize: '0.725rem', padding: '0.2rem 0.55rem' }}
                              onClick={() => onDeleteSingle(item.id)}
                            >
                              <Trash2 size={11} /> Delete Site
                            </button>
                          </div>
                        </div>

                        {/* Dual Device CWV Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                          {/* Mobile Box */}
                          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                              <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Smartphone size={14} color="var(--accent-primary)" /> Mobile Core Web Vitals
                              </strong>
                              <span className={`badge ${mScore < 50 ? 'badge-critical' : 'badge-indigo'}`}>
                                Score: {mScore}/100
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.775rem' }}>
                              <div>FCP: <strong className={item.metrics?.fcp?.status}>{item.metrics?.fcp?.display}</strong></div>
                              <div>LCP: <strong className={item.metrics?.lcp?.status}>{item.metrics?.lcp?.display}</strong></div>
                              <div>TBT: <strong className={item.metrics?.tbt?.status}>{item.metrics?.tbt?.display}</strong></div>
                              <div>CLS: <strong className={item.metrics?.cls?.status}>{item.metrics?.cls?.display}</strong></div>
                              <div>Speed Index: <strong>{item.metrics?.speedIndex?.display}</strong></div>
                            </div>
                          </div>

                          {/* Desktop Box */}
                          {item.desktop && (
                            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                                <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <Monitor size={14} color="var(--accent-cyan)" /> Desktop Core Web Vitals
                                </strong>
                                <span className={`badge ${dScore < 50 ? 'badge-critical' : 'badge-cyan'}`}>
                                  Score: {dScore}/100
                                </span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.775rem' }}>
                                <div>FCP: <strong className={item.desktopMetrics?.fcp?.status}>{item.desktopMetrics?.fcp?.display}</strong></div>
                                <div>LCP: <strong className={item.desktopMetrics?.lcp?.status}>{item.desktopMetrics?.lcp?.display}</strong></div>
                                <div>TBT: <strong className={item.desktopMetrics?.tbt?.status}>{item.desktopMetrics?.tbt?.display}</strong></div>
                                <div>CLS: <strong className={item.desktopMetrics?.cls?.status}>{item.desktopMetrics?.cls?.display}</strong></div>
                                <div>Speed Index: <strong>{item.desktopMetrics?.speedIndex?.display}</strong></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Google Opportunities List */}
                        {item.opportunities && item.opportunities.length > 0 ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                            {item.opportunities.map((opp, idx) => (
                              <div
                                key={idx}
                                style={{
                                  background: 'var(--bg-card)',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: 'var(--radius-md)',
                                  padding: '0.85rem 1rem',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                  <strong style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>{opp.title}</strong>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-warning)' }}>
                                    {opp.savingsText}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                  {opp.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            No critical speed bottlenecks found. Page is highly optimized.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
