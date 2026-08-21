import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import AhrefsBar from './components/AhrefsBar';
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
import ShortlistView from './components/ShortlistView';

import { AuditQueueEngine } from './services/queueEngine';
import { autoDetectCategory } from './services/categories';
import { scrapeWebsiteEmail } from './services/emailFinder';
import { fetchDomainRating } from './services/ahrefsApi';
import {
  saveApiKey,
  loadApiKey,
  saveAhrefsApiKey,
  loadAhrefsApiKey,
  saveAuditResults,
  loadAuditResults,
  clearAuditResults,
  savePreferences,
  loadPreferences,
  saveShortlistedIds,
  loadShortlistedIds,
  saveShortlistOrder,
  loadShortlistOrder,
  saveShortlistNotes,
  loadShortlistNotes,
  saveShortlistOutreachStatus,
  loadShortlistOutreachStatus,
  saveLeadStatusMap,
  loadLeadStatusMap,
  saveCategoryMap,
  loadCategoryMap,
  saveEmailMap,
  loadEmailMap,
  saveDrMap,
  loadDrMap
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
  const [ahrefsKey, setAhrefsKey] = useState(() => loadAhrefsApiKey());
  const [prefs, setPrefs] = useState(() => loadPreferences());
  const [strategy, setStrategy] = useState(() => prefs.strategy || 'both');
  const [concurrency, setConcurrency] = useState(() => prefs.concurrency || 2);
  const [delayGap, setDelayGap] = useState(() => prefs.delayGap || 2.0);
  const [selectedPitchAngle, setSelectedPitchAngle] = useState(() => prefs.pitchAngle || 'conversion_risk');

  const [results, setResults] = useState(() => loadAuditResults());
  const [shortlistedIds, setShortlistedIds] = useState(() => loadShortlistedIds());
  const [shortlistOrder, setShortlistOrder] = useState(() => loadShortlistOrder());
  const [shortlistNotes, setShortlistNotes] = useState(() => loadShortlistNotes());
  const [shortlistOutreachStatus, setShortlistOutreachStatus] = useState(() => loadShortlistOutreachStatus());
  const [leadStatusMap, setLeadStatusMap] = useState(() => loadLeadStatusMap());
  const [categoryMap, setCategoryMap] = useState(() => loadCategoryMap());
  const [emailMap, setEmailMap] = useState(() => loadEmailMap());
  const [emailStatusMap, setEmailStatusMap] = useState({});
  const [drMap, setDrMap] = useState(() => loadDrMap());
  const [drStatusMap, setDrStatusMap] = useState({});
  const [isFetchingAllDr, setIsFetchingAllDr] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [queueProgress, setQueueProgress] = useState(null);

  // Modals & Drawers
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [activePitchLead, setActivePitchLead] = useState(null);

  // Filters & Sorting
  const [filterTier, setFilterTier] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
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

  // Sync shortlist sequence order
  useEffect(() => {
    saveShortlistOrder(shortlistOrder);
  }, [shortlistOrder]);

  // Sync shortlist notes
  useEffect(() => {
    saveShortlistNotes(shortlistNotes);
  }, [shortlistNotes]);

  // Sync shortlist outreach statuses
  useEffect(() => {
    saveShortlistOutreachStatus(shortlistOutreachStatus);
  }, [shortlistOutreachStatus]);

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

  // Sync DR map
  useEffect(() => {
    saveDrMap(drMap);
  }, [drMap]);

  // Auto Email Scraping Pipeline on Audit Completion
  const triggerAutoEmailScrape = async (lead) => {
    if (!lead || !lead.url || !lead.success) return;
    const id = lead.id;

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

  // Ahrefs DR Fetch Pipeline on Audit Completion
  const triggerAhrefsDrFetch = async (lead, currentKey = ahrefsKey) => {
    if (!lead || !lead.domain || !currentKey || !currentKey.trim()) return;
    const id = lead.id;
    const domain = lead.domain;

    if (drMap[id] !== undefined || drMap[domain] !== undefined) return;

    setDrStatusMap(prev => ({ ...prev, [id]: 'fetching', [domain]: 'fetching' }));

    try {
      const res = await fetchDomainRating(domain, currentKey);
      if (res.success && res.domainRating !== null) {
        setDrMap(prev => ({
          ...prev,
          [id]: res.domainRating,
          [domain]: res.domainRating
        }));
        setDrStatusMap(prev => ({ ...prev, [id]: 'done', [domain]: 'done' }));
      } else {
        setDrStatusMap(prev => ({ ...prev, [id]: 'error', [domain]: 'error' }));
      }
    } catch {
      setDrStatusMap(prev => ({ ...prev, [id]: 'error', [domain]: 'error' }));
    }
  };

  const handleFetchSingleDr = async (lead) => {
    if (!ahrefsKey || !ahrefsKey.trim()) {
      setIsApiKeyModalOpen(true);
      return;
    }
    await triggerAhrefsDrFetch(lead, ahrefsKey);
  };

  const handleFetchAllDr = async () => {
    if (!ahrefsKey || !ahrefsKey.trim()) {
      setIsApiKeyModalOpen(true);
      return;
    }
    setIsFetchingAllDr(true);
    try {
      for (const r of results) {
        if (r.success && drMap[r.id] === undefined && drMap[r.domain] === undefined) {
          await triggerAhrefsDrFetch(r, ahrefsKey);
        }
      }
    } finally {
      setIsFetchingAllDr(false);
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

        // 1. Auto Email Scan
        triggerAutoEmailScrape(newItem);

        // 2. Auto Ahrefs DR Fetch (if Ahrefs key configured)
        if (ahrefsKey) {
          triggerAhrefsDrFetch(newItem, ahrefsKey);
        }
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
    setDrMap(prev => {
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
      setDrMap(prev => {
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
    setShortlistOrder(prev => {
      const next = [...prev];
      for (const id of selectedIds) {
        if (!next.includes(id)) next.push(id);
      }
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
      setShortlistOrder([]);
      setShortlistNotes({});
      setShortlistOutreachStatus({});
      setLeadStatusMap({});
      setCategoryMap({});
      setEmailMap({});
      setEmailStatusMap({});
      setDrMap({});
      setDrStatusMap({});
      setSelectedIds(new Set());
      setQueueProgress(null);
    }
  };

  const handleToggleShortlist = (id) => {
    setShortlistedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setShortlistOrder(orderPrev => orderPrev.filter(item => item !== id));
      } else {
        next.add(id);
        setShortlistOrder(orderPrev => (orderPrev.includes(id) ? orderPrev : [...orderPrev, id]));
      }
      return next;
    });
  };

  const handleUpdateShortlistStatus = (id, status) => {
    setShortlistOutreachStatus(prev => ({
      ...prev,
      [id]: status
    }));
  };

  const handleUpdateShortlistNotes = (id, notes) => {
    setShortlistNotes(prev => ({
      ...prev,
      [id]: notes
    }));
  };

  const handleRemoveFromShortlist = (id) => {
    setShortlistedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setShortlistOrder(prev => prev.filter(item => item !== id));
  };

  const handleClearAllShortlist = () => {
    setShortlistedIds(new Set());
    setShortlistOrder([]);
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

  const handleRestoreProject = (newResults, newShortlisted, newStatusMap, newCategoryMap, newEmailMap, newDrMap, newShortlistOrder, newShortlistNotes, newShortlistOutreachStatus) => {
    setResults(newResults);
    setShortlistedIds(newShortlisted);
    if (newShortlistOrder) setShortlistOrder(newShortlistOrder);
    if (newShortlistNotes) setShortlistNotes(newShortlistNotes);
    if (newShortlistOutreachStatus) setShortlistOutreachStatus(newShortlistOutreachStatus);
    setLeadStatusMap(newStatusMap);
    if (newCategoryMap) setCategoryMap(newCategoryMap);
    if (newEmailMap) setEmailMap(newEmailMap);
    if (newDrMap) setDrMap(newDrMap);
  };

  const handleKeySaved = (newKey) => {
    setApiKey(newKey);
    if (queueEngineRef.current) {
      queueEngineRef.current.setApiKey(newKey);
    }
  };

  const handleAhrefsKeySaved = (newAhrefsKey) => {
    setAhrefsKey(newAhrefsKey);
    if (newAhrefsKey && results.length > 0) {
      results.forEach(r => {
        if (drMap[r.id] === undefined && drMap[r.domain] === undefined) {
          triggerAhrefsDrFetch(r, newAhrefsKey);
        }
      });
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
        const domain = (r.domain || r.url || '').toLowerCase();
        const comp = (r.originalData?.company || '').toLowerCase();
        const city = (r.originalData?.city || '').toLowerCase();
        const email = (emailMap[r.domain] || emailMap[r.id] || r.originalData?.email || '').toLowerCase();
        return domain.includes(q) || comp.includes(q) || city.includes(q) || email.includes(q);
      });
    }

    // 4. Sort
    list.sort((a, b) => {
      const aScore = a.mobile?.score ?? a.score ?? 0;
      const bScore = b.mobile?.score ?? b.score ?? 0;

      if (sortBy === 'score_asc') return aScore - bScore;
      if (sortBy === 'score_desc') return bScore - aScore;

      if (sortBy === 'dr_desc') {
        const aDr = drMap[a.id] ?? drMap[a.domain] ?? -1;
        const bDr = drMap[b.id] ?? drMap[b.domain] ?? -1;
        return bDr - aDr;
      }
      if (sortBy === 'dr_asc') {
        const aDr = drMap[a.id] ?? drMap[a.domain] ?? 999;
        const bDr = drMap[b.id] ?? drMap[b.domain] ?? 999;
        return aDr - bDr;
      }

      if (sortBy === 'lcp_desc') {
        const aLcp = a.mobile?.cwv?.lcp?.numericValue || 0;
        const bLcp = b.mobile?.cwv?.lcp?.numericValue || 0;
        return bLcp - aLcp;
      }
      if (sortBy === 'tbt_desc') {
        const aTbt = a.mobile?.cwv?.tbt?.numericValue || 0;
        const bTbt = b.mobile?.cwv?.tbt?.numericValue || 0;
        return bTbt - aTbt;
      }
      if (sortBy === 'domain_asc') {
        return (a.domain || a.url).localeCompare(b.domain || b.url);
      }
      return 0;
    });

    return list;
  }, [results, filterTier, filterCategory, searchQuery, sortBy, shortlistedIds, categoryMap, emailMap, drMap]);

  // Counts for filter pills
  const filterCounts = useMemo(() => {
    const counts = { all: results.length, poor: 0, average: 0, good: 0, error: 0, shortlisted: shortlistedIds.size };
    results.forEach(r => {
      if (!r.success) counts.error++;
      else {
        const s = r.mobile?.score ?? r.score ?? 0;
        if (s < 50) counts.poor++;
        else if (s < 90) counts.average++;
        else counts.good++;
      }
    });
    return counts;
  }, [results, shortlistedIds]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    results.forEach(r => {
      const cat = categoryMap[r.id] || autoDetectCategory(r);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [results, categoryMap]);

  const isRunning = queueProgress?.isRunning || false;

  return (
    <div className="app-container">
      {/* App Header & Navigation */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        strategy={strategy}
        onStrategyChange={handleStrategyChange}
        apiKey={apiKey}
        ahrefsKey={ahrefsKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onClearData={handleClearData}
        hasData={results.length > 0}
        isRunning={isRunning}
        shortlistedCount={shortlistedIds.size}
      />

      {/* VIEW 1: SERP Lead Finder */}
      {activeView === 'serp' && (
        <SerpFinderSection
          onStartAuditFromSerp={handleStartAuditFromSerp}
          isRunning={isRunning}
        />
      )}

      {/* VIEW 2: Shortlisted Leads & Outreach CRM */}
      {activeView === 'shortlist' && (
        <ShortlistView
          shortlistedResults={results.filter(r => shortlistedIds.has(r.id))}
          shortlistOrder={shortlistOrder}
          shortlistNotes={shortlistNotes}
          shortlistOutreachStatus={shortlistOutreachStatus}
          onUpdateStatus={handleUpdateShortlistStatus}
          onUpdateNotes={handleUpdateShortlistNotes}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onClearAllShortlist={handleClearAllShortlist}
          onOpenPitch={(lead) => setActivePitchLead(lead)}
          categoryMap={categoryMap}
          onChangeCategory={handleChangeCategory}
          emailMap={emailMap}
          emailStatusMap={emailStatusMap}
          onSaveEmail={handleChangeEmail}
          drMap={drMap}
          drStatusMap={drStatusMap}
          onFetchSingleDr={handleFetchSingleDr}
          onDeleteSingle={handleDeleteSingle}
          onSwitchToAuditView={() => setActiveView('audit')}
        />
      )}

      {/* VIEW 3: Analytics & Velocity */}
      {activeView === 'analytics' && (
        <AnalyticsView results={results} />
      )}

      {/* VIEW 4: Main Audit Engine */}
      {activeView === 'audit' && (
        <>
          {/* Top Dedicated Ahrefs Settings Bar */}
          <AhrefsBar
            ahrefsKey={ahrefsKey}
            onSaveAhrefsKey={handleAhrefsKeySaved}
            onFetchAllDr={handleFetchAllDr}
            isFetchingDr={isFetchingAllDr}
            hasResults={results.length > 0}
          />

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
                drMap={drMap}
                drStatusMap={drStatusMap}
                onFetchSingleDr={handleFetchSingleDr}
                onChangeEmail={handleChangeEmail}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onDeleteSingle={handleDeleteSingle}
                onOpenPitchDrawer={(lead) => setActivePitchLead(lead)}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
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
        currentAhrefsKey={ahrefsKey}
        onAhrefsKeySaved={handleAhrefsKeySaved}
      />

      <ProjectDataModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        results={results}
        shortlistedIds={shortlistedIds}
        shortlistOrder={shortlistOrder}
        shortlistNotes={shortlistNotes}
        shortlistOutreachStatus={shortlistOutreachStatus}
        leadStatusMap={leadStatusMap}
        categoryMap={categoryMap}
        emailMap={emailMap}
        drMap={drMap}
        apiKey={apiKey}
        ahrefsKey={ahrefsKey}
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
        drMap={drMap}
        defaultAngle={selectedPitchAngle}
      />
    </div>
  );
}
