import React, { useState, useMemo } from 'react';
import {
  Star,
  ExternalLink,
  Mail,
  Edit2,
  Check,
  X,
  FileText,
  Download,
  Trash2,
  MessageSquare,
  Sparkles,
  ArrowUpDown,
  Filter,
  Search,
  Clock,
  Send,
  UserCheck,
  XCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

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
  emailMap = {},
  onSaveEmail,
  drMap = {},
  onSwitchToAuditView
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [editingEmailId, setEditingEmailId] = useState(null);
  const [emailDraft, setEmailDraft] = useState('');
  const [copiedEmailId, setCopiedEmailId] = useState(null);

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
        const email = (emailMap[item.domain] || item.originalData?.email || '').toLowerCase();
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
      'Ahrefs DR',
      'Contact Email',
      'Notes',
      'LCP (s)',
      'FCP (s)',
      'CLS',
      'TBT (ms)',
      'Shortlisted Date'
    ];

    const rows = orderedList.map((item, idx) => {
      const status = shortlistOutreachStatus[item.id] || 'not_contacted';
      const notes = (shortlistNotes[item.id] || '').replace(/"/g, '""');
      const email = emailMap[item.domain] || item.originalData?.email || '';
      const dr = drMap[item.domain] !== undefined && drMap[item.domain] !== null ? drMap[item.domain] : '';

      return [
        idx + 1,
        `"${item.url || ''}"`,
        `"${item.domain || ''}"`,
        `"${(item.originalData?.company || item.domain || '').replace(/"/g, '""')}"`,
        `"${status}"`,
        item.mobile?.score !== undefined ? item.mobile.score : '',
        dr,
        `"${email}"`,
        `"${notes}"`,
        item.mobile?.cwv?.lcp?.displayValue || '',
        item.mobile?.cwv?.fcp?.displayValue || '',
        item.mobile?.cwv?.cls?.displayValue || '',
        item.mobile?.cwv?.tbt?.displayValue || '',
        new Date().toISOString().slice(0, 10)
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

  const handleCopyEmail = (email, id) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 1800);
  };

  const handleStartEditEmail = (item) => {
    setEditingEmailId(item.id);
    setEmailDraft(emailMap[item.domain] || item.originalData?.email || '');
  };

  const handleSaveEmail = (domain) => {
    onSaveEmail(domain, emailDraft.trim());
    setEditingEmailId(null);
  };

  const handleStartEditNote = (item) => {
    setEditingNoteId(item.id);
    setNoteDraft(shortlistNotes[item.id] || '');
  };

  const handleSaveNote = (id) => {
    onUpdateNotes(id, noteDraft.trim());
    setEditingNoteId(null);
  };

  // Helper for score badge
  const getScoreBadge = (score) => {
    if (score === undefined || score === null) return { label: 'N/A', cls: 'score-none' };
    if (score < 50) return { label: score, cls: 'score-critical' };
    if (score < 80) return { label: score, cls: 'score-poor' };
    if (score < 90) return { label: score, cls: 'score-moderate' };
    return { label: score, cls: 'score-good' };
  };

  // Helper for DR badge
  const getDrBadge = (dr) => {
    if (dr === undefined || dr === null) return { text: '—', cls: 'badge-muted' };
    const num = Number(dr);
    if (num >= 70) return { text: `DR ${num}`, cls: 'badge-emerald' };
    if (num >= 40) return { text: `DR ${num}`, cls: 'badge-indigo' };
    if (num >= 20) return { text: `DR ${num}`, cls: 'badge-amber' };
    return { text: `DR ${num}`, cls: 'badge-rose' };
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
              High-priority opportunities saved from your audits. Contact them one-by-one, generate tailored video pitches, and track your outreach status.
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
              placeholder="Search shortlisted..."
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
            When performing speed audits in the <strong>Audit Engine</strong> or searching with the <strong>SERP Lead Finder</strong>, click the <strong>⭐ Star</strong> icon on any high-opportunity website (or select multiple and click <strong>Shortlist Selected</strong>) to save them here for direct outreach.
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
          <table className="data-table" style={{ minWidth: '1380px' }}>
            <thead>
              <tr>
                <th style={{ width: '45px', textAlign: 'center' }}>#</th>
                <th style={{ minWidth: '220px' }}>Website / Company</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Speed Score</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Ahrefs DR</th>
                <th style={{ minWidth: '210px' }}>Contact Email</th>
                <th style={{ width: '190px' }}>Outreach Status</th>
                <th style={{ minWidth: '260px' }}>Notes / Outreach Log</th>
                <th style={{ width: '170px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, index) => {
                const currentStatus = shortlistOutreachStatus[item.id] || 'not_contacted';
                const statusObj = OUTREACH_STATUSES.find(s => s.id === currentStatus) || OUTREACH_STATUSES[0];
                const scoreInfo = getScoreBadge(item.mobile?.score);
                const drValue = drMap[item.domain];
                const drBadge = getDrBadge(drValue);
                const currentEmail = emailMap[item.domain] || item.originalData?.email || '';
                const currentNotes = shortlistNotes[item.id] || '';

                return (
                  <tr key={item.id} style={{ transition: 'background-color 0.15s ease' }}>
                    {/* Sequence # */}
                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {index + 1}
                    </td>

                    {/* Website / Company */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {item.originalData?.company || item.domain}
                          </span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--text-muted)', transition: 'color 0.15s ease' }}
                            title={`Visit ${item.url}`}
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {item.domain}
                        </span>
                        {item.originalData?.city && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                            📍 {item.originalData.city}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Mobile Speed Score */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                        <span className={`score-badge ${scoreInfo.cls}`} style={{ fontSize: '0.85rem', padding: '0.25rem 0.6rem' }}>
                          {scoreInfo.label}
                        </span>
                        <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Mobile</span>
                      </div>
                    </td>

                    {/* Ahrefs DR */}
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${drBadge.cls}`} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem' }}>
                        {drBadge.text}
                      </span>
                    </td>

                    {/* Contact Email */}
                    <td>
                      {editingEmailId === item.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="email"
                            className="search-input"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.775rem', width: '100%' }}
                            value={emailDraft}
                            onChange={e => setEmailDraft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEmail(item.domain)}
                            autoFocus
                            placeholder="name@company.com"
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.45rem', fontSize: '0.7rem' }}
                            onClick={() => handleSaveEmail(item.domain)}
                            title="Save Email"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.45rem', fontSize: '0.7rem' }}
                            onClick={() => setEditingEmailId(null)}
                            title="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : currentEmail ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                          <span style={{
                            fontSize: '0.775rem',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-mono)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '140px'
                          }} title={currentEmail}>
                            {currentEmail}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.2rem 0.35rem', fontSize: '0.65rem' }}
                              onClick={() => handleCopyEmail(currentEmail, item.id)}
                              title="Copy Email"
                            >
                              {copiedEmailId === item.id ? <Check size={11} color="#059669" /> : <Mail size={11} />}
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.2rem 0.35rem', fontSize: '0.65rem' }}
                              onClick={() => handleStartEditEmail(item)}
                              title="Edit Email"
                            >
                              <Edit2 size={11} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', opacity: 0.75 }}
                          onClick={() => handleStartEditEmail(item)}
                        >
                          + Add Email
                        </button>
                      )}
                    </td>

                    {/* Outreach Status Selector */}
                    <td>
                      <select
                        value={currentStatus}
                        onChange={e => onUpdateStatus(item.id, e.target.value)}
                        style={{
                          background: statusObj.bg,
                          color: statusObj.color,
                          border: `1px solid ${statusObj.border}`,
                          fontWeight: 700,
                          fontSize: '0.775rem',
                          padding: '0.35rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          outline: 'none',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        {OUTREACH_STATUSES.map(st => (
                          <option key={st.id} value={st.id} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
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
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.775rem', width: '100%' }}
                            value={noteDraft}
                            onChange={e => setNoteDraft(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveNote(item.id)}
                            placeholder="e.g. Sent 90s video audit, follow up Friday..."
                            autoFocus
                          />
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.45rem' }}
                            onClick={() => handleSaveNote(item.id)}
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.45rem' }}
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
                            padding: '0.3rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px dashed var(--border-subtle)',
                            background: currentNotes ? 'rgba(0,0,0,0.02)' : 'transparent',
                            minHeight: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.35rem'
                          }}
                          title="Click to edit outreach notes"
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                            {currentNotes || '+ Add note (e.g. Sent video audit)'}
                          </span>
                          <Edit2 size={11} style={{ opacity: 0.5, flexShrink: 0 }} />
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                        {/* Open Pitch Drawer */}
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ fontSize: '0.725rem', padding: '0.3rem 0.6rem' }}
                          onClick={() => onOpenPitch(item)}
                          title="Open Pitch Generator"
                        >
                          <Sparkles size={12} />
                          <span>Pitch</span>
                        </button>

                        {/* Mailto link */}
                        {currentEmail && (
                          <a
                            href={`mailto:${currentEmail}?subject=${encodeURIComponent(`Quick question regarding ${item.originalData?.company || item.domain} website speed`)}`}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.725rem', padding: '0.3rem 0.5rem', textDecoration: 'none' }}
                            title="Compose Email in Default Client"
                          >
                            <Send size={12} />
                          </a>
                        )}

                        {/* Unstar / Remove */}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.45rem', color: '#f59e0b' }}
                          onClick={() => onRemoveFromShortlist(item.id)}
                          title="Remove from Shortlist"
                        >
                          <Star size={13} fill="#f59e0b" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
