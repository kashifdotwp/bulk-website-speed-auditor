import {
  Zap,
  Smartphone,
  Monitor,
  Key,
  Trash2,
  ShieldCheck,
  Search,
  BarChart3,
  HardDrive,
  LayoutDashboard,
  Sun,
  Moon,
  TrendingUp,
  Star
} from 'lucide-react';

export default function Header({
  activeView,
  onViewChange,
  theme,
  onToggleTheme,
  strategy,
  onStrategyChange,
  apiKey,
  ahrefsKey,
  onOpenApiKeyModal,
  onOpenBackupModal,
  onClearData,
  hasData,
  isRunning,
  shortlistedCount = 0
}) {
  const hasAnyKey = Boolean(apiKey || ahrefsKey);

  return (
    <header className="header-nav" style={{ flexWrap: 'wrap', gap: '0.85rem' }}>
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Zap size={22} />
        </div>
        <div>
          <div className="brand-title">
            Needle Mover Detector
            <span className="badge badge-indigo" style={{ fontSize: '0.675rem', padding: '0.15rem 0.45rem' }}>
              PRO v2.3
            </span>
          </div>
          <div className="brand-subtitle">
            Bulk Speed Auditor & Ahrefs DR Outreach Engine
          </div>
        </div>
      </div>

      {/* Main Navigation Views */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-primary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`strategy-btn ${activeView === 'audit' ? 'active' : ''}`}
          onClick={() => onViewChange('audit')}
        >
          <LayoutDashboard size={14} /> Audit Engine
        </button>

        <button
          type="button"
          className={`strategy-btn ${activeView === 'serp' ? 'active' : ''}`}
          onClick={() => onViewChange('serp')}
        >
          <Search size={14} /> SERP Lead Finder
        </button>

        <button
          type="button"
          className={`strategy-btn ${activeView === 'shortlist' ? 'active' : ''}`}
          onClick={() => onViewChange('shortlist')}
          style={{
            position: 'relative',
            color: activeView === 'shortlist' ? 'var(--text-primary)' : shortlistedCount > 0 ? '#d97706' : 'inherit'
          }}
        >
          <Star size={14} fill={shortlistedCount > 0 ? '#f59e0b' : 'none'} color={shortlistedCount > 0 ? '#f59e0b' : 'currentColor'} />
          <span>Shortlisted</span>
          {shortlistedCount > 0 && (
            <span style={{
              background: activeView === 'shortlist' ? 'var(--accent-primary)' : '#f59e0b',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.05rem 0.4rem',
              borderRadius: '999px',
              marginLeft: '0.2rem'
            }}>
              {shortlistedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className={`strategy-btn ${activeView === 'analytics' ? 'active' : ''}`}
          onClick={() => onViewChange('analytics')}
        >
          <BarChart3 size={14} /> Analytics
        </button>
      </div>

      <div className="header-actions">
        {/* Strategy Selector */}
        <div className="strategy-toggle">
          <button
            type="button"
            className={`strategy-btn ${strategy === 'mobile' ? 'active' : ''}`}
            onClick={() => onStrategyChange('mobile')}
            disabled={isRunning}
            title="Mobile (Recommended for SEO outreach)"
          >
            <Smartphone size={13} /> Mobile
          </button>
          <button
            type="button"
            className={`strategy-btn ${strategy === 'desktop' ? 'active' : ''}`}
            onClick={() => onStrategyChange('desktop')}
            disabled={isRunning}
            title="Desktop Performance"
          >
            <Monitor size={13} /> Desktop
          </button>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.45rem 0.65rem' }}
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={15} color="#475569" /> : <Sun size={15} color="#fbbf24" />}
        </button>

        {/* API Key Modal Button */}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
          onClick={onOpenApiKeyModal}
          title="Configure Ahrefs DR & Google PageSpeed API Keys"
        >
          {hasAnyKey ? (
            <>
              <ShieldCheck size={14} color="#059669" />
              <span>{ahrefsKey ? 'Ahrefs + PSI Active' : 'Key Active'}</span>
            </>
          ) : (
            <>
              <Key size={14} />
              <span>API Keys</span>
            </>
          )}
        </button>

        {/* Persistence / Backup Button */}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.8rem' }}
          onClick={onOpenBackupModal}
          title="Backup and Restore Project Data (Zero Data Loss)"
        >
          <HardDrive size={14} color="#0284c7" />
          <span>Save/Backup</span>
        </button>

        {/* Clear Data */}
        {hasData && (
          <button
            type="button"
            className="btn btn-danger"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
            onClick={onClearData}
            disabled={isRunning}
            title="Clear all audited results"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
