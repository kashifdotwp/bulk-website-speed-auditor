import React, { useState, useMemo } from 'react';
import { Search, Sparkles, DollarSign, Target, Copy, Check, ArrowRight, ExternalLink, Filter, Layers, ShoppingBag, Building2 } from 'lucide-react';
import { LOCAL_BUSINESS_NICHES, ECOMMERCE_NICHES } from '../data/nichesData';

export default function NichesView({ onSelectNicheForSerp }) {
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'ecom'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [copiedId, setCopiedId] = useState(null);

  // Filtered Niches List
  const filteredNiches = useMemo(() => {
    const list = activeTab === 'local' ? LOCAL_BUSINESS_NICHES : ECOMMERCE_NICHES;
    const q = searchQuery.toLowerCase().trim();

    return list.filter(niche => {
      // Tier match
      if (selectedTier !== 'all' && niche.ticketTier !== selectedTier) {
        return false;
      }
      // Search match
      if (!q) return true;
      const matchName = niche.name.toLowerCase().includes(q);
      const matchCategory = niche.category?.toLowerCase().includes(q) || false;
      const matchKeywords = niche.keywords?.some(k => k.toLowerCase().includes(q)) || false;
      const matchHook = niche.pitchHook?.toLowerCase().includes(q) || false;
      return matchName || matchCategory || matchKeywords || matchHook;
    });
  }, [activeTab, searchQuery, selectedTier]);

  const handleCopyKeywords = (niche) => {
    const text = niche.keywords.join(', ');
    navigator.clipboard.writeText(text);
    setCopiedId(niche.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleLaunchSerp = (niche) => {
    const primaryQuery = niche.keywords[0] || niche.name;
    if (onSelectNicheForSerp) {
      onSelectNicheForSerp(primaryQuery);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.25rem' }}>
      {/* View Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.25)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <Target size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
              🎯 Prospecting Niches Directory
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Comprehensive cold outreach targeting reference: 60+ Local Service Niches & 35+ High-Converting E-Commerce Verticals.
            </p>
          </div>
        </div>

        {/* Global Stats Counter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>LOCAL NICHES</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{LOCAL_BUSINESS_NICHES.length}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>E-COM NICHES</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>{ECOMMERCE_NICHES.length}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>HIGH-TICKET VERTICALS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
              {LOCAL_BUSINESS_NICHES.filter(n => n.ticketTier === 'high').length + ECOMMERCE_NICHES.filter(n => n.ticketTier === 'high').length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Switcher & Filter Controls */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        {/* Tab Switcher: Local vs E-Com */}
        <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className={`strategy-btn ${activeTab === 'local' ? 'active' : ''}`}
            onClick={() => { setActiveTab('local'); setSelectedTier('all'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem' }}
          >
            <Building2 size={15} />
            <span>Local Services ({LOCAL_BUSINESS_NICHES.length})</span>
          </button>
          <button
            type="button"
            className={`strategy-btn ${activeTab === 'ecom' ? 'active' : ''}`}
            onClick={() => { setActiveTab('ecom'); setSelectedTier('all'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem' }}
          >
            <ShoppingBag size={15} />
            <span>E-Commerce ({ECOMMERCE_NICHES.length})</span>
          </button>
        </div>

        {/* Tier Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.2rem' }}>
            <Filter size={12} style={{ display: 'inline', marginRight: '3px' }} /> Tier:
          </span>
          <button
            type="button"
            className={`btn ${selectedTier === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            onClick={() => setSelectedTier('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`btn ${selectedTier === 'high' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            onClick={() => setSelectedTier('high')}
          >
            🔥 High-Ticket / High AOV
          </button>
          <button
            type="button"
            className={`btn ${selectedTier === 'medium' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            onClick={() => setSelectedTier('medium')}
          >
            ⚡ Mid-Ticket / Mid AOV
          </button>
          <button
            type="button"
            className={`btn ${selectedTier === 'low' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
            onClick={() => setSelectedTier('low')}
          >
            🧹 Volume / Low-Ticket
          </button>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="search-input"
            style={{ width: '100%', paddingLeft: '2.1rem', fontSize: '0.825rem' }}
            placeholder={`Search ${activeTab === 'local' ? 'local niches' : 'e-commerce verticals'} or keywords...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Showing count */}
      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
        Showing <strong>{filteredNiches.length}</strong> {activeTab === 'local' ? 'local business' : 'e-commerce'} targeting niches:
      </div>

      {/* Niches Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '1rem'
      }}>
        {filteredNiches.map(niche => {
          const isHigh = niche.ticketTier === 'high';
          const isMed = niche.ticketTier === 'medium';

          return (
            <div
              key={niche.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                {/* Top Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span className={`badge ${isHigh ? 'badge-amber' : isMed ? 'badge-indigo' : 'badge-cyan'}`} style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    {isHigh ? '🔥 High-Ticket' : isMed ? '⚡ Mid-Ticket' : '🧹 Volume / Fast-Turn'}
                  </span>
                  {niche.category && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {niche.category}
                    </span>
                  )}
                  {niche.profitMargin && (
                    <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                      {niche.profitMargin} Margin
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem' }}>
                  {niche.name}
                </h3>

                {/* Financial Metrics Strip */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.85rem',
                  background: 'var(--bg-primary)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap'
                }}>
                  {niche.avgJobValue && (
                    <div style={{ fontSize: '0.725rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Avg Deal: </span>
                      <strong style={{ color: '#10b981' }}>{niche.avgJobValue}</strong>
                    </div>
                  )}
                  {niche.avgAov && (
                    <div style={{ fontSize: '0.725rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Avg AOV: </span>
                      <strong style={{ color: '#10b981' }}>{niche.avgAov}</strong>
                    </div>
                  )}
                  {niche.cpcRange && (
                    <div style={{ fontSize: '0.725rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Google CPC: </span>
                      <strong style={{ color: 'var(--accent-primary)' }}>{niche.cpcRange}</strong>
                    </div>
                  )}
                  {niche.leadValue && (
                    <div style={{ fontSize: '0.725rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Pay-Per-Call: </span>
                      <strong style={{ color: '#f59e0b' }}>{niche.leadValue}</strong>
                    </div>
                  )}
                </div>

                {/* Pitch Hook */}
                <div style={{
                  fontSize: '0.775rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.85rem',
                  lineHeight: '1.4',
                  fontStyle: 'italic',
                  borderLeft: '2px solid var(--accent-primary)',
                  paddingLeft: '0.55rem'
                }}>
                  "{niche.pitchHook}"
                </div>

                {/* Keywords Chips */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Target Search Queries:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {niche.keywords.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.7rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.45rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.4rem 0.6rem', justifyContent: 'center' }}
                  onClick={() => handleLaunchSerp(niche)}
                >
                  <Search size={12} />
                  <span>Find in SERP</span>
                  <ArrowRight size={12} />
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
                  onClick={() => handleCopyKeywords(niche)}
                  title="Copy search query keywords to clipboard"
                >
                  {copiedId === niche.id ? <Check size={12} color="var(--status-good)" /> : <Copy size={12} />}
                  <span>{copiedId === niche.id ? 'Copied' : 'Keywords'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
