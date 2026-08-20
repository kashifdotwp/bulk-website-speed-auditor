import React, { useState } from 'react';
import { Search, Globe, Sparkles, Filter, Play, CheckSquare, Square, Copy, Check, ArrowRight, ExternalLink, Loader2, AlertCircle, Zap } from 'lucide-react';
import { searchSerpLeads, POPULAR_QUERY_TEMPLATES, QUERY_CATEGORIES } from '../services/serpFinder';

export default function SerpFinderSection({
  onStartAuditFromSerp,
  isRunning
}) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(20);
  const [excludeDirectories, setExcludeDirectories] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [discoveredLeads, setDiscoveredLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [copiedDomains, setCopiedDomains] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [presetFilter, setPresetFilter] = useState('all');
  const [region, setRegion] = useState('global');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (targetQuery = query) => {
    if (!targetQuery || targetQuery.trim().length === 0) return;
    setIsLoading(true);
    setSearchDone(true);
    setErrorMsg('');
    try {
      const results = await searchSerpLeads(targetQuery, limit, excludeDirectories, region);
      setDiscoveredLeads(results);
      setSelectedIds(new Set(results.map(r => r.id)));
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Search request failed. Try again or adjust query.');
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

  const filteredPresets = presetFilter === 'all'
    ? POPULAR_QUERY_TEMPLATES
    : POPULAR_QUERY_TEMPLATES.filter(t => t.category === presetFilter);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Search size={17} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live SERP Lead Discovery
            </h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
              Multi-Engine
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '700px' }}>
            Search <strong>any query</strong> — local businesses, SaaS tools, e-commerce brands, agencies, niche keywords — to discover live ranking websites and bulk audit their speed.
          </p>
        </div>
      </div>

      {/* Preset Category Filter Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Presets:</span>
          {QUERY_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${presetFilter === cat.id ? 'active' : ''}`}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              onClick={() => setPresetFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Preset Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {filteredPresets.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              className="filter-chip"
              style={{
                fontSize: '0.725rem',
                padding: '0.25rem 0.6rem',
                transition: 'all 0.15s ease'
              }}
              onClick={() => {
                setQuery(tmpl.query);
                handleSearch(tmpl.query);
              }}
              disabled={isLoading || isRunning}
              title={`Search: "${tmpl.query}"`}
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.4rem', fontSize: '0.9rem' }}
            placeholder="Type any search query: e.g. 'roofing contractor chicago', 'best CRM software', 'AI writing tools'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            disabled={isLoading || isRunning}
          />
        </div>

        {/* Country / Region */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
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
            <option value="global">🌐 Global</option>
            <option value="us">🇺🇸 United States</option>
            <option value="uk">🇬🇧 United Kingdom</option>
            <option value="ca">🇨🇦 Canada</option>
            <option value="au">🇦🇺 Australia</option>
            <option value="in">🇮🇳 India</option>
            <option value="de">🇩🇪 Germany</option>
            <option value="fr">🇫🇷 France</option>
            <option value="es">🇪🇸 Spain</option>
            <option value="it">🇮🇹 Italy</option>
            <option value="br">🇧🇷 Brazil</option>
            <option value="mx">🇲🇽 Mexico</option>
            <option value="nl">🇳🇱 Netherlands</option>
            <option value="nz">🇳🇿 New Zealand</option>
            <option value="ie">🇮🇪 Ireland</option>
            <option value="sg">🇸🇬 Singapore</option>
            <option value="ae">🇦🇪 UAE</option>
            <option value="pk">🇵🇰 Pakistan</option>
            <option value="ph">🇵🇭 Philippines</option>
            <option value="za">🇿🇦 South Africa</option>
          </select>
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
            <option value="20">Top 20 Sites</option>
            <option value="30">Top 30 Sites</option>
            <option value="50">Top 50 Sites</option>
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
          <span>Exclude Directories & Social</span>
        </label>

        {/* Find Button */}
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.4rem' }}
          onClick={() => handleSearch()}
          disabled={isLoading || isRunning || !query.trim()}
        >
          {isLoading ? <Loader2 size={15} className="spin-icon" /> : <Zap size={15} />}
          <span>{isLoading ? 'Searching Multi-Engine...' : 'Discover Sites'}</span>
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'var(--status-critical-bg)',
          border: '1px solid var(--status-critical-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-critical)',
          fontSize: '0.8rem'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.825rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Globe size={15} color="var(--accent-cyan)" />
                {discoveredLeads.length} Websites Discovered
              </span>

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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem', maxHeight: '460px', overflowY: 'auto' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ flexShrink: 0 }}
                      />
                      <strong style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.originalData?.company || item.domain}
                      </strong>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.35rem' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {item.domain}
                  </span>

                  {item.snippet && (
                    <p style={{
                      fontSize: '0.725rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.35',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.snippet}
                    </p>
                  )}

                  {item.title && item.title !== item.domain && (
                    <p style={{
                      fontSize: '0.675rem',
                      color: 'var(--text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontStyle: 'italic'
                    }}>
                      {item.title}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {searchDone && discoveredLeads.length === 0 && !isLoading && !errorMsg && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <AlertCircle size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            No websites found for this query
          </p>
          <p style={{ fontSize: '0.8rem' }}>
            Try a more specific or different query. Examples: <em>"best CRM software"</em>, <em>"cosmetic dentist austin"</em>, <em>"AI writing tools"</em>
          </p>
        </div>
      )}
    </div>
  );
}
