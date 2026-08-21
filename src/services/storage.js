/**
 * LocalStorage & Project Backup/Restore Service (Zero Data Loss Architecture)
 */

import { DEFAULT_GOOGLE_API_KEY } from './psiApi';

const STORAGE_KEYS = {
  API_KEY: 'nmd_psi_api_key',
  AHREFS_API_KEY: 'nmd_ahrefs_api_key',
  AUDIT_RESULTS: 'nmd_audit_results_v2',
  SHORTLISTED_IDS: 'nmd_shortlisted_ids',
  SHORTLIST_ORDER: 'nmd_shortlist_order',
  SHORTLIST_NOTES: 'nmd_shortlist_notes',
  SHORTLIST_OUTREACH_STATUS: 'nmd_shortlist_outreach_status',
  STATUS_MAP: 'nmd_lead_status_map',
  CATEGORY_MAP: 'nmd_lead_category_map',
  EMAIL_MAP: 'nmd_lead_email_map',
  DR_MAP: 'nmd_ahrefs_dr_map',
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

export function saveAhrefsApiKey(key) {
  try {
    localStorage.setItem(STORAGE_KEYS.AHREFS_API_KEY, key || '');
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadAhrefsApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEYS.AHREFS_API_KEY) || '';
  } catch {
    return '';
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

export function saveShortlistOrder(orderArray) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTLIST_ORDER, JSON.stringify(orderArray || []));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadShortlistOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTLIST_ORDER);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveShortlistNotes(notesMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTLIST_NOTES, JSON.stringify(notesMap || {}));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadShortlistNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTLIST_NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveShortlistOutreachStatus(statusMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTLIST_OUTREACH_STATUS, JSON.stringify(statusMap || {}));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadShortlistOutreachStatus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTLIST_OUTREACH_STATUS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
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

export function saveEmailMap(emailMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.EMAIL_MAP, JSON.stringify(emailMap || {}));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadEmailMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDrMap(drMap) {
  try {
    localStorage.setItem(STORAGE_KEYS.DR_MAP, JSON.stringify(drMap || {}));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export function loadDrMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DR_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearAuditResults() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUDIT_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.SHORTLISTED_IDS);
    localStorage.removeItem(STORAGE_KEYS.DR_MAP);
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
/**
 * Creates a complete JSON project backup bundle (Zero Data Loss)
 */
export function exportProjectBackup(results, shortlistedIds, leadStatusMap, categoryMap, emailMap, drMap, apiKey, ahrefsKey, shortlistOrder, shortlistNotes, shortlistOutreachStatus) {
  const backupData = {
    appName: 'Needle Mover Detector',
    version: '2.4.0',
    exportedAt: new Date().toISOString(),
    itemCount: results.length,
    results,
    shortlistedIds: Array.from(shortlistedIds),
    shortlistOrder: shortlistOrder || [],
    shortlistNotes: shortlistNotes || {},
    shortlistOutreachStatus: shortlistOutreachStatus || {},
    leadStatusMap,
    categoryMap: categoryMap || {},
    emailMap: emailMap || {},
    drMap: drMap || {},
    hasApiKey: Boolean(apiKey),
    hasAhrefsKey: Boolean(ahrefsKey)
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
          shortlistOrder: parsed.shortlistOrder || [],
          shortlistNotes: parsed.shortlistNotes || {},
          shortlistOutreachStatus: parsed.shortlistOutreachStatus || {},
          leadStatusMap: parsed.leadStatusMap || {},
          categoryMap: parsed.categoryMap || {},
          emailMap: parsed.emailMap || {},
          drMap: parsed.drMap || {},
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
