import React, { useState, useMemo } from 'react';
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
  Plus,
  RotateCw,
  AlertCircle,
  TrendingUp,
  Download,
  Send
} from 'lucide-react';
import { buildMailmeteorSnippet } from '../services/pitchGenerator';
import { CATEGORY_DEFINITIONS, autoDetectCategory } from '../services/categories';
import { getDrBadgeStyles } from '../services/ahrefsApi';

export const OUTREACH_STATUSES = [
  { id: 'not_contacted', label: '⏳ Not Contacted', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', border: '#94a3b8' },
  { id: 'pitched', label: '📤 Pitched / Sent Email', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', border: '#38bdf8' },
  { id: 'discussion', label: '💬 In Discussion', color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: '#fbbf24' },
  { id: 'confirmed', label: '✅ Confirmed / Client', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: '#34d399' },
  { id: 'not_interested', label: '❌ Not Interested', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', border: '#f87171' }
];

export default function ShortlistView({
  shortlistedResults = [],
  shortlistOrder = [],
  shortlistNotes = {},
  shortlistOutreachStatus = {},
  onUpdateStatus,
  onUpdateNotes,
  onRemoveFromShortlist,
  onClearAllShortlist,
  onOpenPitch,
  categoryMap = {},
  onChangeCategory,
  emailMap = {},
  emailStatusMap = {},
  onSaveEmail,
  drMap = {},
  drStatusMap = {},
  onFetchSingleDr,
  onDeleteSingle,
  onSwitchToAuditView
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);
  const [copiedEmailId, setCopiedEmailId] = useState(null);
  const [editingEmailId, setEditingEmailId] = useState(null);
  const [tempEmailInput, setTempEmailInput] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');

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
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyEmail = (email, id) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleStartEditEmail = (id, currentEmail) => {
    setEditingEmailId(id);
    setTempEmailInput(currentEmail || '');
  };

  const handleSaveEmail = (id) => {
    if (onSaveEmail) {
      onSaveEmail(id, tempEmailInput.trim());
    }
    setEditingEmailId(null);
  };

  const handleStartEditNote = (item) => {
    setEditingNoteId(item.id);
    setNoteDraft(shortlistNotes[item.id] || '');
  };

  const handleSaveNote = (id) => {
    if (onUpdateNotes) {
      onUpdateNotes(id, noteDraft.trim());
    }
    setEditingNoteId(null);
  };

  // Build sorted list maintaining exact user addition sequence
  const orderedList = useMemo(() => {
    const resultMap = new Map(shortlistedResults.map(r => [r.id, r]));
    const list = [];
    const seen = new Set();

    // 1. First add in saved sequence order
    for (const id of shortlistOrder) {
      if (resultMap.has(id) && !seen.has(id)) {
        list.push(resultMap.get(id));
        seen.add(id);
      }
    }

    // 2. Add any remaining items not yet in order array
    for (const item of shortlistedResults) {
      if (!seen.has(item.id)) {
        list.push(item);
        seen.add(item.id);
      }
    }

    return list;
  }, [shortlistedResults, shortlistOrder]);

  // Filter by status & search
  const filteredList = useMemo(() => {
    return orderedList.filter(item => {
      const status = shortlistOutreachStatus[item.id] || 'not_contacted';
      if (filterStatus !== 'all' && status !== filterStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const domain = (item.domain || item.url || '').toLowerCase();
        const company = (item.originalData?.company || '').toLowerCase();
        const notes = (shortlistNotes[item.id] || '').toLowerCase();
        const email = (emailMap?.[item.id] ?? emailMap?.[item.domain] ?? item.originalData?.email ?? '').toLowerCase();
        return domain.includes(q) || company.includes(q) || notes.includes(q) || email.includes(q);
      }

      return true;
    });
  }, [orderedList, filterStatus, searchQuery, shortlistOutreachStatus, shortlistNotes, emailMap]);

  // Metrics summary
  const metrics = useMemo(() => {
    const total = orderedList.length;
    let pitched = 0;
    let discussion = 0;
    let confirmed = 0;
    let notInterested = 0;
    let notContacted = 0;

    for (const item of orderedList) {
      const st = shortlistOutreachStatus[item.id] || 'not_contacted';
      if (st === 'pitched') pitched++;
      else if (st === 'discussion') discussion++;
      else if (st === 'confirmed') confirmed++;
      else if (st === 'not_interested') notInterested++;
      else notContacted++;
    }

    const contactedTotal = pitched + discussion + confirmed + notInterested;
    const progressPercent = total > 0 ? Math.round((contactedTotal / total) * 100) : 0;

    return { total, pitched, discussion, confirmed, notInterested, notContacted, progressPercent };
  }, [orderedList, shortlistOutreachStatus]);

  // Export Shortlist CSV
  const handleExportCsv = () => {
    if (orderedList.length === 0) return;

    const headers = [
      'Sequence',
      'Website',
      'Domain',
      'Company',
      'Outreach Status',
      'Mobile Score',
      'Desktop Score',
      'Ahrefs DR',
      'Contact Email',
      'Category',
      'Top Bottleneck',
      'Notes',
      'LCP',
      'TBT',
      'FCP',
      'CLS'
    ];

    const rows = orderedList.map((item, idx) => {
      const status = shortlistOutreachStatus[item.id] || 'not_contacted';
      const notes = (shortlistNotes[item.id] || '').replace(/"/g, '""');
      const email = emailMap?.[item.id] ?? emailMap?.[item.domain] ?? item.originalData?.email ?? '';
      const dr = drMap?.[item.id] ?? drMap?.[item.domain] ?? '';
      const cat = categoryMap?.[item.id] || autoDetectCategory(item);

      return [
        idx + 1,
        `"${item.url || ''}"`,
        `"${item.domain || ''}"`,
        `"${(item.originalData?.company || item.domain || '').replace(/"/g, '""')}"`,
        `"${status}"`,
        item.mobile?.score ?? item.score ?? '',
        item.desktop?.score ?? item.desktopScore ?? '',
        dr,
        `"${email}"`,
        `"${cat}"`,
        `"${(item.topBottleneck || '').replace(/"/g, '""')}"`,
        `"${notes}"`,
        `"${item.metrics?.lcp?.display || ''}"`,
        `"${item.metrics?.tbt?.display || ''}"`,
        `"${item.metrics?.fcp?.display || ''}"`,
        `"${item.metrics?.cls?.display || ''}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `shortlisted_leads_crm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Overview Top Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Star size={19} fill="white" />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Shortlisted Outreach Pipeline
              </h2>
              <span className="badge badge-amber" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {metrics.total} {metrics.total === 1 ? 'Prospect' : 'Prospects'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              High-priority opportunities saved from your audits with 100% metrics parity. Contact them one-by-one, generate tailored video pitches, and track your outreach status.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
              onClick={handleExportCsv}
              disabled={orderedList.length === 0}
              title="Export Shortlisted Leads as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            {orderedList.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', color: 'var(--status-critical)' }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all shortlisted leads?')) {
                    onClearAllShortlist();
                  }
                }}
                title="Clear all leads from shortlist"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Pipeline KPI Cards */}
        {metrics.total > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.65rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Shortlisted</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{metrics.total}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>⏳ Not Contacted</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748b' }}>{metrics.notContacted}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>📤 Pitched</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284c7' }}>{metrics.pitched}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600 }}>💬 In Discussion</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d97706' }}>{metrics.discussion}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>✅ Confirmed</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{metrics.confirmed}</div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Outreach Progress</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{metrics.progressPercent}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      {metrics.total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              onClick={() => setFilterStatus('all')}
            >
              All ({metrics.total})
            </button>
            {OUTREACH_STATUSES.map(st => {
              const count = orderedList.filter(i => (shortlistOutreachStatus[i.id] || 'not_contacted') === st.id).length;
              return (
                <button
                  key={st.id}
                  type="button"
                  className={`filter-chip ${filterStatus === st.id ? 'active' : ''}`}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                  onClick={() => setFilterStatus(st.id)}
                >
                  {st.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search className="search-icon" style={{ left: '0.65rem', width: '14px', height: '14px' }} />
            <input
              type="text"
              className="search-input"
              style={{ padding: '0.45rem 0.75rem 0.45rem 2rem', fontSize: '0.8rem', width: '100%' }}
              placeholder="Search domain, company, notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main Table / Empty State */}
      {orderedList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            marginBottom: '0.35rem'
          }}>
            <Star size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            No Shortlisted Leads Yet
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: '1.45' }}>
            When performing speed audits in the <strong>Audit Engine</strong>, click the <strong>⭐ Star</strong> icon on any website (or select multiple and click <strong>⭐ Shortlist Selected</strong>) to save them here for direct outreach.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', padding: '0.6rem 1.4rem' }}
            onClick={onSwitchToAuditView}
          >
            <span>Go to Audit Engine →</span>
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>No leads match this filter</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            onClick={() => { setFilterStatus('all'); setSearchQuery(''); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="table-wrapper glass-panel" style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: '1580px' }}>
            <thead>
              <tr>
                <th style={{ width: '38px', textAlign: 'center' }}>#</th>
                <th style={{ width: '35px', textAlign: 'center' }}>⭐</th>
                <th style={{ width: '28px' }}></th>
                <th style={{ minWidth: '200px' }}>Website / Company</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Ahrefs DR</th>
                <th style={{ minWidth: '185px' }}>Contact Email</th>
                <th style={{ width: '120px' }}>Category</th>
                <th style={{ textAlign: 'center', width: '115px' }}>Speed Scores</th>
                <th style={{ width: '145px' }}>Core Web Vitals</th>
                <th style={{ minWidth: '180px' }}>Top Bottleneck</th>
                <th style={{ textAlign: 'center', width: '85px' }}>Priority</th>
                <th style={{ width: '175px' }}>Outreach Status</th>
                <th style={{ minWidth: '200px' }}>Notes / Outreach Log</th>
                <th style={{ textAlign: 'right', width: '145px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, index) => {
                const isExpanded = expandedRows.has(item.id);
                const currentStatus = shortlistOutreachStatus[item.id] || 'not_contacted';
                const statusObj = OUTREACH_STATUSES.find(s => s.id === currentStatus) || OUTREACH_STATUSES[0];

                // Resolve Category
                const currentCatId = categoryMap?.[item.id] || autoDetectCategory(item);
                const currentCat = CATEGORY_DEFINITIONS.find(c => c.id === currentCatId) || CATEGORY_DEFINITIONS[4];

                // Resolve Ahrefs DR
                const drValue = drMap?.[item.id] ?? drMap?.[item.domain] ?? null;
                const drStatus = drStatusMap?.[item.id] || drStatusMap?.[item.domain] || (drValue !== null ? 'done' : 'idle');
                const drStyles = getDrBadgeStyles(drValue);

                // Resolve Email & Status
                const effectiveEmail = emailMap?.[item.id] ?? emailMap?.[item.domain] ?? (item.originalData?.email || '');
                const currentEmailStatus = emailStatusMap?.[item.id] || (effectiveEmail ? 'found' : 'not_scanned');
                const isEditingThisEmail = editingEmailId === item.id;
                const isEmailCopied = copiedEmailId === item.id;
                const isCopied = copiedId === item.id;

                const orig = item.originalData || {};
                const mScore = item.mobile?.score ?? item.score ?? 0;
                const dScore = item.desktop?.score ?? item.desktopScore ?? null;

                const mScoreClass = mScore < 50 ? 'critical' : mScore < 90 ? 'warning' : 'good';
                const dScoreClass = dScore !== null ? (dScore < 50 ? 'critical' : dScore < 90 ? 'warning' : 'good') : '';
                const currentNotes = shortlistNotes[item.id] || '';

                return (
                  <React.Fragment key={item.id}>
                    <tr className={mScore < 50 ? 'row-critical' : ''}>
                      {/* Sequence # */}
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {index + 1}
                      </td>

                      {/* Star Shortlist Toggle */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => onRemoveFromShortlist(item.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#f59e0b', transition: 'transform 0.15s ease' }}
                          title="Remove from Shortlist"
                        >
                          <Star size={16} fill="#f59e0b" />
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

                      {/* AHREFS DOMAIN RATING (DR) COLUMN */}
                      <td style={{ textAlign: 'center' }}>
                        {drStatus === 'fetching' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: 'var(--accent-primary)' }}>
                            <Loader2 size={11} className="spin-icon" />
                            <span>DR...</span>
                          </div>
                        ) : drValue !== null ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: drStyles.color,
                              background: drStyles.bg,
                              border: `1px solid ${drStyles.border}`
                            }}
                            title={`Ahrefs Domain Rating: ${drValue}/100`}
                          >
                            {drStyles.label}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.675rem', padding: '0.2rem 0.45rem', color: 'var(--accent-primary)' }}
                            onClick={() => onFetchSingleDr && onFetchSingleDr(item)}
                            title="Fetch Domain Rating from Ahrefs"
                          >
                            <TrendingUp size={11} />
                            <span>Get DR</span>
                          </button>
                        )}
                      </td>

                      {/* EMAIL COLUMN */}
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
                              <button
                                type="button"
                                onClick={() => copyEmail(effectiveEmail, item.id)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                                title="Copy email"
                              >
                                {isEmailCopied ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                              </button>

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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border-subtle)',
                                padding: '0.15rem 0.4rem',
                                borderRadius: 'var(--radius-sm)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                              }}
                            >
                              <AlertCircle size={10} color="#94a3b8" /> No Email
                            </span>

                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ fontSize: '0.675rem', padding: '0.15rem 0.4rem', color: 'var(--accent-primary)' }}
                              onClick={() => handleStartEditEmail(item.id, '')}
                              title="Manually enter contact email"
                            >
                              <Plus size={10} /> Add
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Category Dropdown */}
                      <td>
                        <select
                          value={currentCatId}
                          onChange={e => onChangeCategory && onChangeCategory(item.id, e.target.value)}
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
                        <div style={{ maxWidth: '180px' }}>
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

                      {/* Outreach Status Dropdown */}
                      <td>
                        <select
                          value={currentStatus}
                          onChange={e => onUpdateStatus(item.id, e.target.value)}
                          style={{
                            background: statusObj.bg,
                            color: statusObj.color,
                            border: `1px solid ${statusObj.border}`,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            padding: '0.35rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            outline: 'none',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          {OUTREACH_STATUSES.map(st => (
                            <option key={st.id} value={st.id} style={{ background: 'var(--bg-card-solid)', color: 'var(--text-primary)' }}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Notes / Outreach Log */}
                      <td>
                        {editingNoteId === item.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <input
                              type="text"
                              className="search-input"
                              style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem', width: '100%' }}
                              value={noteDraft}
                              onChange={e => setNoteDraft(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSaveNote(item.id)}
                              placeholder="e.g. Sent 90s video audit, follow up Friday..."
                              autoFocus
                            />
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: '0.25rem 0.4rem' }}
                              onClick={() => handleSaveNote(item.id)}
                            >
                              <Check size={12} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.25rem 0.4rem' }}
                              onClick={() => setEditingNoteId(null)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleStartEditNote(item)}
                            style={{
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              color: currentNotes ? 'var(--text-secondary)' : 'var(--text-muted)',
                              padding: '0.3rem 0.45rem',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px dashed var(--border-subtle)',
                              background: currentNotes ? 'rgba(0,0,0,0.02)' : 'transparent',
                              minHeight: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.35rem'
                            }}
                            title="Click to edit outreach notes"
                          >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                              {currentNotes || '+ Add note'}
                            </span>
                            <Edit2 size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                          {/* Pitch Lead */}
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: '0.725rem', padding: '0.3rem 0.55rem' }}
                            onClick={() => onOpenPitch({ ...item, resolvedEmail: effectiveEmail, ahrefsDr: drValue })}
                            title="Open Pitch Generator"
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

                          {/* Remove from Shortlist */}
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ fontSize: '0.725rem', padding: '0.3rem 0.45rem', color: '#f59e0b' }}
                            onClick={() => onRemoveFromShortlist(item.id)}
                            title="Unstar / Remove from Shortlist"
                          >
                            <Star size={12} fill="#f59e0b" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row Diagnostics (100% parity with Audit table) */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={14} style={{ background: 'var(--bg-primary)', padding: '1.25rem 1.5rem 1.5rem 2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Header Link */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>Official Analysis — {item.domain}</span>
                                <span className="badge badge-indigo">📱 Mobile: {mScore}/100</span>
                                {dScore !== null && <span className="badge badge-cyan">💻 Desktop: {dScore}/100</span>}
                                {drValue !== null && <span className="badge" style={{ background: drStyles.bg, color: drStyles.color, border: `1px solid ${drStyles.border}` }}>📈 Ahrefs DR: {drValue}/100</span>}
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

                            {/* Opportunities Table */}
                            {item.opportunities && item.opportunities.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <strong style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Top Speed Opportunities & Potential Savings:</strong>
                                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                                  <table style={{ width: '100%', fontSize: '0.775rem', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.45rem 0.75rem' }}>Opportunity</th>
                                        <th style={{ padding: '0.45rem 0.75rem' }}>Est. Savings</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.opportunities.slice(0, 5).map((opp, oIdx) => (
                                        <tr key={oIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                          <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text-primary)', fontWeight: 500 }}>{opp.title}</td>
                                          <td style={{ padding: '0.45rem 0.75rem', color: 'var(--status-critical)', fontWeight: 600 }}>{opp.displayValue || `${opp.savings} ms`}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
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
      )}
    </div>
  );
}
