/**
 * LocalStorage & Project Backup/Restore Service (Zero Data Loss Architecture)
 */

import { DEFAULT_GOOGLE_API_KEY } from './psiApi';

const STORAGE_KEYS = {
  API_KEY: 'nmd_psi_api_key',
  AUDIT_RESULTS: 'nmd_audit_results_v2',
  SHORTLISTED_IDS: 'nmd_shortlisted_ids',
  STATUS_MAP: 'nmd_lead_status_map',
  CATEGORY_MAP: 'nmd_lead_category_map',
  CONCURRENCY: 'nmd_concurrency_pref',
  DELAY_GAP: 'nmd_delay_gap_pref',
  STRATEGY: 'nmd_strategy_pref',
  SELECTED_ANGLE: 'nmd_selected_pitch_angle',
  SESSIONS: 'nmd_saved_sessions'
};

export function saveApiKey(key) {
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key || '');
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadApiKey() {
  try {
    const key = localStorage.getItem(STORAGE_KEYS.API_KEY);
    return key !== null ? key : DEFAULT_GOOGLE_API_KEY;
  } catch {
    return DEFAULT_GOOGLE_API_KEY;
  }
}

export function saveAuditResults(results) {
  try {
    localStorage.setItem(STORAGE_KEYS.AUDIT_RESULTS, JSON.stringify(results || []));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadAuditResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveShortlistedIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTLISTED_IDS, JSON.stringify(Array.from(ids || [])));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadShortlistedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTLISTED_IDS);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function saveLeadStatusMap(statusMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATUS_MAP, JSON.stringify(statusMap || {}));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadLeadStatusMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATUS_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCategoryMap(catMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_MAP, JSON.stringify(catMap || {}));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadCategoryMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORY_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearAuditResults() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUDIT_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.SHORTLISTED_IDS);
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function savePreferences({ concurrency, delayGap, strategy, pitchAngle }) {
  try {
    if (concurrency) localStorage.setItem(STORAGE_KEYS.CONCURRENCY, String(concurrency));
    if (delayGap !== undefined) localStorage.setItem(STORAGE_KEYS.DELAY_GAP, String(delayGap));
    if (strategy) localStorage.setItem(STORAGE_KEYS.STRATEGY, strategy);
    if (pitchAngle) localStorage.setItem(STORAGE_KEYS.SELECTED_ANGLE, pitchAngle);
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadPreferences() {
  try {
    return {
      concurrency: parseInt(localStorage.getItem(STORAGE_KEYS.CONCURRENCY) || '2', 10),
      delayGap: parseFloat(localStorage.getItem(STORAGE_KEYS.DELAY_GAP) || '2.0'),
      strategy: localStorage.getItem(STORAGE_KEYS.STRATEGY) || 'both',
      pitchAngle: localStorage.getItem(STORAGE_KEYS.SELECTED_ANGLE) || 'conversion_risk'
    };
  } catch {
    return { concurrency: 2, delayGap: 2.0, strategy: 'both', pitchAngle: 'conversion_risk' };
  }
}

/**
 * Creates a complete JSON project backup bundle (Zero Data Loss)
 */
export function exportProjectBackup(results, shortlistedIds, leadStatusMap, categoryMap, apiKey) {
  const backupData = {
    appName: 'Needle Mover Detector',
    version: '2.1.0',
    exportedAt: new Date().toISOString(),
    itemCount: results.length,
    results,
    shortlistedIds: Array.from(shortlistedIds),
    leadStatusMap,
    categoryMap: categoryMap || {},
    hasApiKey: Boolean(apiKey)
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `needle_mover_project_backup_${dateStr}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Restores project data from an uploaded backup JSON file
 */
export function parseProjectBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.results || !Array.isArray(parsed.results)) {
          return resolve({ success: false, error: 'Invalid backup file structure: missing results array.' });
        }
        resolve({
          success: true,
          results: parsed.results,
          shortlistedIds: new Set(parsed.shortlistedIds || []),
          leadStatusMap: parsed.leadStatusMap || {},
          categoryMap: parsed.categoryMap || {},
          exportedAt: parsed.exportedAt
        });
      } catch (err) {
        resolve({ success: false, error: `Failed to parse backup JSON: ${err.message}` });
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
}
