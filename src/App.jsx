import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import InputSection from './components/InputSection';
import QueueController from './components/QueueController';
import MetricsOverview from './components/MetricsOverview';
import FilterBar from './components/FilterBar';
import ResultsTable from './components/ResultsTable';
import PitchDrawer from './components/PitchDrawer';
import ExportModal from './components/ExportModal';
import SerpFinderSection from './components/SerpFinderSection';
import AnalyticsView from './components/AnalyticsView';
import ProjectDataModal from './components/ProjectDataModal';

import { AuditQueueEngine } from './services/queueEngine';
import { autoDetectCategory } from './services/categories';
import { scrapeWebsiteEmail } from './services/emailFinder';
import {
  saveApiKey,
  loadApiKey,
  saveAuditResults,
  loadAuditResults,
  clearAuditResults,
  savePreferences,
  loadPreferences,
  saveShortlistedIds,
  loadShortlistedIds,
  saveLeadStatusMap,
  loadLeadStatusMap,
  saveCategoryMap,
  loadCategoryMap,
  saveEmailMap,
  loadEmailMap
} from './services/storage';

export default function App() {
  // Navigation View: 'audit' | 'serp' | 'analytics'
  const [activeView, setActiveView] = useState('audit');

  // Theme Management (Light by default)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('nmd_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('nmd_theme', theme);
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // State Initialization
  const [apiKey, setApiKey] = useState(() => loadApiKey());
  const [prefs, setPrefs] = useState(() => loadPreferences());
  const [strategy, setStrategy] = useState(() => prefs.strategy || 'both');
  const [concurrency, setConcurrency] = useState(() => prefs.concurrency || 2);
  const [delayGap, setDelayGap] = useState(() => prefs.delayGap || 2.0);
  const [selectedPitchAngle, setSelectedPitchAngle] = useState(() => prefs.pitchAngle || 'conversion_risk');

  const [results, setResults] = useState(() => loadAuditResults());
  const [shortlistedIds, setShortlistedIds] = useState(() => loadShortlistedIds());
  const [leadStatusMap, setLeadStatusMap] = useState(() => loadLeadStatusMap());
  const [categoryMap, setCategoryMap] = useState(() => loadCategoryMap());
  const [emailMap, setEmailMap] = useState(() => loadEmailMap());
  const [emailStatusMap, setEmailStatusMap] = useState({}); // { [id]: 'scanning' | 'found' | 'not_found' }
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [queueProgress, setQueueProgress] = useState(null);

  // Modals & Drawers
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [activePitchLead, setActivePitchLead] = useState(null);

  // Filters & Sorting
  const [filterTier, setFilterTier] = useState('all'); // 'all' | 'shortlisted' | 'poor' | 'average' | 'good' | 'error'
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'saas' | 'ecommerce' | 'local' | 'agency' | 'other'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score_asc');

  // Queue Engine Ref
  const queueEngineRef = useRef(null);

  // Sync preferences on change
  useEffect(() => {
    savePreferences({ concurrency, delayGap, strategy, pitchAngle: selectedPitchAngle });
  }, [concurrency, delayGap, strategy, selectedPitchAngle]);

  // Sync results to localStorage (Zero Data Loss)
  useEffect(() => {
    saveAuditResults(results);
  }, [results]);

  // Sync shortlisted IDs
  useEffect(() => {
    saveShortlistedIds(shortlistedIds);
  }, [shortlistedIds]);

  // Sync status map
  useEffect(() => {
    saveLeadStatusMap(leadStatusMap);
  }, [leadStatusMap]);

  // Sync category map
  useEffect(() => {
    saveCategoryMap(categoryMap);
  }, [categoryMap]);

  // Sync email map
  useEffect(() => {
    saveEmailMap(emailMap);
  }, [emailMap]);

  // Auto Email Scraping Pipeline on Audit Completion
  const triggerAutoEmailScrape = async (lead) => {
    if (!lead || !lead.url || !lead.success) return;
    const id = lead.id;

    // If an email is already present in original CSV or custom emailMap, skip
    if (emailMap[id] || lead.originalData?.email) {
      setEmailStatusMap(prev => ({ ...prev, [id]: 'found' }));
      return;
    }

    setEmailStatusMap(prev => ({ ...prev, [id]: 'scanning' }));

    try {
      const res = await scrapeWebsiteEmail(lead.url);
      if (res.success && res.email) {
        setEmailMap(prev => ({ ...prev, [id]: res.email }));
        setEmailStatusMap(prev => ({ ...prev, [id]: 'found' }));
      } else {
        setEmailStatusMap(prev => ({ ...prev, [id]: 'not_found' }));
      }
    } catch {
      setEmailStatusMap(prev => ({ ...prev, [id]: 'not_found' }));
    }
  };

  // Queue Progress & Item completion handlers
  const handleStartAudit = (leads) => {
    if (!leads || leads.length === 0) return;

    const engine = new AuditQueueEngine({
      concurrency,
      delayGap,
      strategy,
      apiKey,
      onProgress: (p) => setQueueProgress({ ...p }),
      onItemComplete: (newItem) => {
        setResults(prev => {
          const existingIndex = prev.findIndex(r => r.domain === newItem.domain);
          if (existingIndex >= 0) {
            const copy = [...prev];
            copy[existingIndex] = newItem;
            return copy;
          }
          return [newItem, ...prev];
        });

        // Automatically scan website for contact email
        triggerAutoEmailScrape(newItem);
      },
      onFinish: () => {
        // Finished
      }
    });

    queueEngineRef.current = engine;
    engine.start(leads);
  };

  const handleStartAuditFromSerp = (leads) => {
    setActiveView('audit');
    handleStartAudit(leads);
  };

  const handlePause = () => {
    queueEngineRef.current?.pause();
  };

  const handleResume = () => {
    queueEngineRef.current?.resume();
  };

  const handleCancel = () => {
    queueEngineRef.current?.cancel();
    setQueueProgress(null);
  };

  // Delete Handlers
  const handleDeleteSingle = (id) => {
    setResults(prev => prev.filter(r => r.id !== id));
    setShortlistedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setEmailMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setEmailStatusMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Delete ${selectedIds.size} selected website entries?`)) {
      setResults(prev => prev.filter(r => !selectedIds.has(r.id)));
      setShortlistedIds(prev => {
        const next = new Set(prev);
        for (const id of selectedIds) next.delete(id);
        return next;
      });
      setEmailMap(prev => {
        const next = { ...prev };
        for (const id of selectedIds) delete next[id];
        return next;
      });
      setEmailStatusMap(prev => {
        const next = { ...prev };
        for (const id of selectedIds) delete next[id];
        return next;
      });
      setSelectedIds(new Set());
    }
  };

  const handleShortlistSelected = () => {
    if (selectedIds.size === 0) return;
    setShortlistedIds(prev => {
      const next = new Set(prev);
      for (const id of selectedIds) next.add(id);
      return next;
    });
    setSelectedIds(new Set());
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = filteredResults.map(r => r.id);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all audited website results?')) {
      clearAuditResults();
      setResults([]);
      setShortlistedIds(new Set());
      setLeadStatusMap({});
      setCategoryMap({});
      setEmailMap({});
      setEmailStatusMap({});
      setSelectedIds(new Set());
      setQueueProgress(null);
    }
  };

  const handleToggleShortlist = (id) => {
    setShortlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleChangeLeadStatus = (id, newStatus) => {
    setLeadStatusMap(prev => ({
      ...prev,
      [id]: newStatus
    }));
  };

  const handleChangeCategory = (id, newCategory) => {
    setCategoryMap(prev => ({
      ...prev,
      [id]: newCategory
    }));
  };

  const handleChangeEmail = (id, newEmail) => {
    setEmailMap(prev => ({
      ...prev,
      [id]: newEmail
    }));
    setEmailStatusMap(prev => ({
      ...prev,
      [id]: newEmail ? 'found' : 'not_found'
    }));
  };

  const handleRestoreProject = (newResults, newShortlisted, newStatusMap, newCategoryMap, newEmailMap) => {
    setResults(newResults);
    setShortlistedIds(newShortlisted);
    setLeadStatusMap(newStatusMap);
    if (newCategoryMap) setCategoryMap(newCategoryMap);
    if (newEmailMap) setEmailMap(newEmailMap);
  };

  const handleKeySaved = (newKey) => {
    setApiKey(newKey);
    if (queueEngineRef.current) {
      queueEngineRef.current.setApiKey(newKey);
    }
  };

  const handleConcurrencyChange = (val) => {
    setConcurrency(val);
    if (queueEngineRef.current) {
      queueEngineRef.current.setConcurrency(val);
    }
  };

  const handleDelayGapChange = (val) => {
    setDelayGap(val);
    if (queueEngineRef.current) {
      queueEngineRef.current.setDelayGap(val);
    }
  };

  const handleStrategyChange = (newStrat) => {
    setStrategy(newStrat);
    if (queueEngineRef.current) {
      queueEngineRef.current.setStrategy(newStrat);
    }
  };

  // Filter & Sort Logic
  const filteredResults = useMemo(() => {
    let list = [...results];

    // 1. Tier Filter
    if (filterTier === 'shortlisted') {
      list = list.filter(r => shortlistedIds.has(r.id));
    } else if (filterTier === 'poor') {
      list = list.filter(r => r.success && (r.mobile?.score ?? r.score ?? 0) < 50);
    } else if (filterTier === 'average') {
      list = list.filter(r => {
        const s = r.mobile?.score ?? r.score ?? 0;
        return r.success && s >= 50 && s < 90;
      });
    } else if (filterTier === 'good') {
      list = list.filter(r => {
        const s = r.mobile?.score ?? r.score ?? 0;
        return r.success && s >= 90;
      });
    } else if (filterTier === 'error') {
      list = list.filter(r => !r.success);
    }

    // 2. Category Filter
    if (filterCategory !== 'all') {
      list = list.filter(r => {
        const cat = categoryMap[r.id] || autoDetectCategory(r);
        return cat === filterCategory;
      });
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => {
        const d = (r.domain || '').toLowerCase();
        const c = (r.originalData?.company || '').toLowerCase();
        const e = (emailMap[r.id] || r.originalData?.email || '').toLowerCase();
        const city = (r.originalData?.city || '').toLowerCase();
        return d.includes(q) || c.includes(q) || e.includes(q) || city.includes(q);
      });
    }

    // 4. Sort
    list.sort((a, b) => {
      const aScore = a.mobile?.score ?? a.score ?? 999;
      const bScore = b.mobile?.score ?? b.score ?? 999;
      if (sortBy === 'score_asc') return aScore - bScore;
      if (sortBy === 'score_desc') return bScore - aScore;
      if (sortBy === 'lcp_desc') return (b.metrics?.lcp?.value || 0) - (a.metrics?.lcp?.value || 0);
      if (sortBy === 'tbt_desc') return (b.metrics?.tbt?.value || 0) - (a.metrics?.tbt?.value || 0);
      if (sortBy === 'domain_asc') return (a.domain || '').localeCompare(b.domain || '');
      return 0;
    });

    return list;
  }, [results, filterTier, filterCategory, searchQuery, sortBy, shortlistedIds, categoryMap, emailMap]);

  // Counts for Filter Chips
  const filterCounts = useMemo(() => {
    return {
      all: results.length,
      shortlisted: results.filter(r => shortlistedIds.has(r.id)).length,
      poor: results.filter(r => r.success && (r.mobile?.score ?? r.score ?? 0) < 50).length,
      average: results.filter(r => {
        const s = r.mobile?.score ?? r.score ?? 0;
        return r.success && s >= 50 && s < 90;
      }).length,
      good: results.filter(r => {
        const s = r.mobile?.score ?? r.score ?? 0;
        return r.success && s >= 90;
      }).length,
      error: results.filter(r => !r.success).length
    };
  }, [results, shortlistedIds]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { saas: 0, ecommerce: 0, local: 0, agency: 0, other: 0 };
    for (const r of results) {
      const cat = categoryMap[r.id] || autoDetectCategory(r);
      if (counts[cat] !== undefined) counts[cat]++;
      else counts.other++;
    }
    return counts;
  }, [results, categoryMap]);

  const isRunning = queueProgress?.isRunning || false;

  return (
    <div className="app-container">
      {/* Top Navbar with Tab Views */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        strategy={strategy}
        onStrategyChange={handleStrategyChange}
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onClearData={handleClearData}
        hasData={results.length > 0}
        isRunning={isRunning}
      />

      {/* VIEW 1: SERP Lead Finder */}
      {activeView === 'serp' && (
        <SerpFinderSection
          onStartAuditFromSerp={handleStartAuditFromSerp}
          isRunning={isRunning}
        />
      )}

      {/* VIEW 2: Analytics & Velocity */}
      {activeView === 'analytics' && (
        <AnalyticsView results={results} />
      )}

      {/* VIEW 3: Main Audit Engine */}
      {activeView === 'audit' && (
        <>
          {/* Input / Upload Section */}
          <InputSection
            onStartAudit={handleStartAudit}
            isRunning={isRunning}
            concurrency={concurrency}
            onConcurrencyChange={handleConcurrencyChange}
            delayGap={delayGap}
            onDelayGapChange={handleDelayGapChange}
            strategy={strategy}
            onStrategyChange={handleStrategyChange}
          />

          {/* Live Queue Progress & Controller */}
          <QueueController
            progress={queueProgress}
            onPause={handlePause}
            onResume={handleResume}
            onCancel={handleCancel}
          />

          {/* KPI Overview Cards */}
          <MetricsOverview results={results} />

          {/* Results Table Section */}
          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FilterBar
                filterTier={filterTier}
                onFilterChange={setFilterTier}
                filterCategory={filterCategory}
                onFilterCategoryChange={setFilterCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                counts={filterCounts}
                categoryCounts={categoryCounts}
                selectedIds={selectedIds}
                onDeleteSelected={handleDeleteSelected}
                onShortlistSelected={handleShortlistSelected}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                hasResults={results.length > 0}
              />

              <ResultsTable
                results={filteredResults}
                shortlistedIds={shortlistedIds}
                onToggleShortlist={handleToggleShortlist}
                leadStatusMap={leadStatusMap}
                onChangeLeadStatus={handleChangeLeadStatus}
                categoryMap={categoryMap}
                onChangeCategory={handleChangeCategory}
                emailMap={emailMap}
                emailStatusMap={emailStatusMap}
                onReScrapeEmail={triggerAutoEmailScrape}
                onChangeEmail={handleChangeEmail}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onDeleteSingle={handleDeleteSingle}
                onOpenPitchDrawer={(lead) => setActivePitchLead(lead)}
              />
            </div>
          )}
        </>
      )}

      {/* Modals & Slide-out Drawers */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentApiKey={apiKey}
        onKeySaved={handleKeySaved}
      />

      <ProjectDataModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        results={results}
        shortlistedIds={shortlistedIds}
        leadStatusMap={leadStatusMap}
        categoryMap={categoryMap}
        emailMap={emailMap}
        apiKey={apiKey}
        onRestoreProject={handleRestoreProject}
      />

      <PitchDrawer
        isOpen={!!activePitchLead}
        onClose={() => setActivePitchLead(null)}
        item={activePitchLead}
        selectedAngle={selectedPitchAngle}
        onSelectAngle={setSelectedPitchAngle}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        results={filterTier === 'shortlisted' ? filteredResults : results}
        emailMap={emailMap}
        categoryMap={categoryMap}
        defaultAngle={selectedPitchAngle}
      />
    </div>
  );
}
