import React from 'react';
import { Search, Flame, Zap, CheckCircle2, AlertCircle, ArrowUpDown, Download, Star, Trash2, Tag, TrendingUp } from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../services/categories';

export default function FilterBar({
  filterTier,
  onFilterChange,
  filterCategory,
  onFilterCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  counts,
  categoryCounts,
  selectedIds,
  onDeleteSelected,
  onShortlistSelected,
  onOpenExportModal,
  hasResults
}) {
  const selectedCount = selectedIds?.size || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Tier Filter Chips */}
      <div className="filter-bar">
        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip ${filterTier === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All Sites ({counts.all})
          </button>

          <button
            type="button"
            className={`filter-chip ${filterTier === 'shortlisted' ? 'active' : ''}`}
            style={filterTier === 'shortlisted' ? { background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', borderColor: '#f59e0b' } : {}}
            onClick={() => onFilterChange('shortlisted')}
          >
            <Star size={13} fill={filterTier === 'shortlisted' ? '#fbbf24' : 'transparent'} color="#fbbf24" />
            <span>⭐ Shortlisted ({counts.shortlisted})</span>
          </button>

          <button
            type="button"
            className={`filter-chip chip-critical ${filterTier === 'poor' ? 'active' : ''}`}
            onClick={() => onFilterChange('poor')}
          >
            <Flame size={13} color="#ef4444" />
            <span>🔥 High-Priority ({counts.poor})</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filterTier === 'average' ? 'active' : ''}`}
            onClick={() => onFilterChange('average')}
          >
            <Zap size={13} color="#f59e0b" />
            <span>⚡ Qualified ({counts.average})</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${filterTier === 'good' ? 'active' : ''}`}
            onClick={() => onFilterChange('good')}
          >
            <CheckCircle2 size={13} color="#10b981" />
            <span>🟢 Fast ({counts.good})</span>
          </button>

          {counts.error > 0 && (
            <button
              type="button"
              className={`filter-chip ${filterTier === 'error' ? 'active' : ''}`}
              onClick={() => onFilterChange('error')}
            >
              <AlertCircle size={13} color="#94a3b8" />
              <span>Errors ({counts.error})</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search */}
          <div className="filter-search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search domain, company, city..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <ArrowUpDown size={14} />
            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="score_asc">Lowest Speed Score (Worst Leads 🔥)</option>
              <option value="score_desc">Highest Speed Score</option>
              <option value="dr_desc">📈 Ahrefs DR: Highest First (High Authority)</option>
              <option value="dr_asc">📉 Ahrefs DR: Lowest First (Low Authority)</option>
              <option value="lcp_desc">Slowest LCP First</option>
              <option value="tbt_desc">Highest Blocking Time (TBT)</option>
              <option value="domain_asc">Domain (A to Z)</option>
            </select>
          </div>

          {/* Export Button */}
          {hasResults && (
            <button
              type="button"
              className="btn btn-accent"
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
              onClick={onOpenExportModal}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Category Filter Pills + Bulk Selection Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        background: 'var(--bg-card)',
        padding: '0.5rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.25rem' }}>
            <Tag size={13} /> Category:
          </span>

          <button
            type="button"
            className={`filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
            onClick={() => onFilterCategoryChange('all')}
          >
            All Categories ({counts.all})
          </button>

          {CATEGORY_DEFINITIONS.map(cat => {
            const count = categoryCounts?.[cat.id] || 0;
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`filter-chip ${isActive ? 'active' : ''}`}
                style={{
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.75rem',
                  borderColor: isActive ? cat.color : 'transparent',
                  background: isActive ? cat.bg : 'var(--bg-input)',
                  color: isActive ? cat.color : 'var(--text-secondary)'
                }}
                onClick={() => onFilterCategoryChange(cat.id)}
              >
                {cat.badge} ({count})
              </button>
            );
          })}
        </div>

        {/* Bulk Action Buttons (when items selected) */}
        {selectedCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
              {selectedCount} selected
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
              onClick={onShortlistSelected}
            >
              <Star size={12} fill="#f59e0b" color="#f59e0b" /> Star Selected
            </button>

            <button
              type="button"
              className="btn btn-danger"
              style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem' }}
              onClick={onDeleteSelected}
            >
              <Trash2 size={12} /> Delete Selected ({selectedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
