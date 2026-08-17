import React, { useState } from 'react';
import { Search, Globe, Sparkles, Filter, Play, CheckSquare, Square, Copy, Check, ArrowRight, ExternalLink, Loader2 } from 'lucide-react';
import { searchSerpLeads, POPULAR_QUERY_TEMPLATES } from '../services/serpFinder';

export default function SerpFinderSection({
  onStartAuditFromSerp,
  isRunning
}) {
  const [query, setQuery] = useState('personal injury lawyer in ohio');
  const [limit, setLimit] = useState(15);
  const [excludeDirectories, setExcludeDirectories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredLeads, setDiscoveredLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [copiedDomains, setCopiedDomains] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const handleSearch = async (targetQuery = query) => {
    if (!targetQuery || targetQuery.trim().length === 0) return;
    setIsLoading(true);
    setSearchDone(true);
    try {
      const results = await searchSerpLeads(targetQuery, limit, excludeDirectories);
      setDiscoveredLeads(results);
      setSelectedIds(new Set(results.map(r => r.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === discoveredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(discoveredLeads.map(r => r.id)));
    }
  };

  const handleAuditSelected = () => {
    const targets = discoveredLeads.filter(l => selectedIds.has(l.id));
    if (targets.length > 0) {
      onStartAuditFromSerp(targets);
    }
  };

  const handleCopyDomains = () => {
    const text = discoveredLeads.map(l => l.url).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedDomains(true);
    setTimeout(() => setCopiedDomains(false), 1800);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Search size={16} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live SERP Lead Discovery
            </h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              Real Search Scraping
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Search local business keywords (e.g. <em>"personal injury lawyer in ohio"</em>) to pull genuine ranking websites and bulk audit their mobile speeds.
          </p>
        </div>

        {/* Popular Preset Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
          {POPULAR_QUERY_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              className="filter-chip"
              style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
              onClick={() => {
                setQuery(tmpl.query);
                handleSearch(tmpl.query);
              }}
              disabled={isLoading || isRunning}
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', fontSize: '0.9rem' }}
            placeholder="e.g. personal injury lawyer in ohio, cosmetic dentist austin, roofing contractor chicago..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            disabled={isLoading || isRunning}
          />
        </div>

        {/* Depth Limit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            disabled={isLoading || isRunning}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="10">Top 10 Sites</option>
            <option value="15">Top 15 Sites</option>
            <option value="25">Top 25 Sites</option>
            <option value="40">Top 40 Sites</option>
          </select>
        </div>

        {/* Exclude directories checkbox */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: '0 0.5rem',
          userSelect: 'none'
        }}>
          <input
            type="checkbox"
            checked={excludeDirectories}
            onChange={e => setExcludeDirectories(e.target.checked)}
            disabled={isLoading || isRunning}
          />
          <span>Exclude Yelp / Directories</span>
        </label>

        {/* Find Button */}
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.4rem' }}
          onClick={() => handleSearch()}
          disabled={isLoading || isRunning || !query.trim()}
        >
          {isLoading ? <Loader2 size={15} className="pulse-dot" /> : <Search size={15} />}
          <span>{isLoading ? 'Searching Live SERP...' : 'Find Sites'}</span>
        </button>
      </div>

      {/* Discovered Leads List */}
      {discoveredLeads.length > 0 && (
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                onClick={selectAll}
              >
                {selectedIds.size === discoveredLeads.length ? <CheckSquare size={13} /> : <Square size={13} />}
                <span>{selectedIds.size === discoveredLeads.length ? 'Deselect All' : 'Select All'} ({selectedIds.size}/{discoveredLeads.length})</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                onClick={handleCopyDomains}
              >
                {copiedDomains ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                <span>{copiedDomains ? 'URLs Copied!' : 'Copy URLs'}</span>
              </button>
            </div>

            {/* Audit Trigger */}
            <button
              type="button"
              className="btn btn-accent"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.35rem' }}
              onClick={handleAuditSelected}
              disabled={isRunning || selectedIds.size === 0}
            >
              <Play size={15} fill="white" />
              <span>Audit Speed for {selectedIds.size} Live {selectedIds.size === 1 ? 'Site' : 'Sites'} →</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {discoveredLeads.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  style={{
                    background: isSelected ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                      />
                      <strong style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                        {item.originalData.company}
                      </strong>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {item.domain}
                  </span>

                  <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: '1.35', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.snippet}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {searchDone && discoveredLeads.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No direct ranking business sites found for this query. Try a broader city query like <em>"injury lawyer ohio"</em>.
        </div>
      )}
    </div>
  );
}
