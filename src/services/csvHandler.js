import Papa from 'papaparse';
import { normalizeUrl, extractDomain } from './psiApi';
import { generatePitch, buildMailmeteorSnippet } from './pitchGenerator';

/**
 * Normalizes an array of raw URLs (from textarea) into lead objects
 */
export function parseRawUrlText(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text
    .split(/\r?\n|,/)
    .map(line => line.trim())
    .filter(line => line.length > 3);

  const seenDomains = new Set();
  const leads = [];

  for (const line of lines) {
    // Avoid comments or empty lines
    if (line.startsWith('#') || line.startsWith('//')) continue;

    const normalized = normalizeUrl(line);
    const domain = extractDomain(normalized);

    if (domain && !seenDomains.has(domain.toLowerCase())) {
      seenDomains.add(domain.toLowerCase());
      leads.push({
        id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        url: normalized,
        domain: domain,
        originalData: {
          website: normalized,
          domain: domain
        }
      });
    }
  }

  return leads;
}

/**
 * Intelligent CSV header mapping
 */
function findMatchingKey(rowKeys, potentialMatches) {
  for (const pm of potentialMatches) {
    const found = rowKeys.find(k => k.trim().toLowerCase() === pm.toLowerCase());
    if (found) return found;
  }
  // Try partial match
  for (const pm of potentialMatches) {
    const found = rowKeys.find(k => k.trim().toLowerCase().includes(pm.toLowerCase()));
    if (found) return found;
  }
  return null;
}

/**
 * Parses uploaded CSV file and extracts leads while preserving all custom columns
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          return resolve({ leads: [], headers: [], error: 'CSV file is empty' });
        }

        const headers = results.meta.fields || [];
        const urlKey = findMatchingKey(headers, ['website', 'url', 'site', 'domain', 'web url', 'company url', 'link']);
        const emailKey = findMatchingKey(headers, ['email', 'e-mail', 'mail', 'contact email', 'decision maker email', 'work email']);
        const firstNameKey = findMatchingKey(headers, ['first_name', 'first name', 'firstname', 'first', 'contact name', 'name', 'lead name']);
        const companyKey = findMatchingKey(headers, ['company', 'company_name', 'company name', 'business', 'business name', 'organization']);
        const cityKey = findMatchingKey(headers, ['city', 'location', 'state', 'town']);

        if (!urlKey) {
          return resolve({
            leads: [],
            headers,
            error: 'Could not find a Website/URL/Domain column in the uploaded CSV. Please check column headers.'
          });
        }

        const seenDomains = new Set();
        const leads = [];

        for (const row of results.data) {
          const rawUrl = row[urlKey];
          if (!rawUrl || rawUrl.trim().length < 3) continue;

          const normalized = normalizeUrl(rawUrl);
          const domain = extractDomain(normalized);

          if (domain && !seenDomains.has(domain.toLowerCase())) {
            seenDomains.add(domain.toLowerCase());

            const extractedData = {
              website: normalized,
              domain: domain,
              email: emailKey ? (row[emailKey] || '').trim() : '',
              first_name: firstNameKey ? (row[firstNameKey] || '').trim() : '',
              company: companyKey ? (row[companyKey] || '').trim() : domain,
              city: cityKey ? (row[cityKey] || '').trim() : '',
              ...row // Preserve all other user columns
            };

            leads.push({
              id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
              url: normalized,
              domain: domain,
              originalData: extractedData
            });
          }
        }

        resolve({
          leads,
          headers,
          detectedColumns: {
            url: urlKey,
            email: emailKey,
            firstName: firstNameKey,
            company: companyKey,
            city: cityKey
          },
          error: null
        });
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * Formats audited results into a downloadable CSV for Mailmeteor & cold email tools
 */
export function exportToMailmeteorCsv(auditResults, angleId = 'conversion_risk') {
  if (!auditResults || auditResults.length === 0) return '';

  const exportRows = auditResults.map(item => {
    const orig = item.originalData || {};
    const pitch = generatePitch(item, angleId, orig);
    const snippet = buildMailmeteorSnippet(item);

    return {
      ...orig, // Preserve all uploaded lead columns
      Domain: item.domain || '',
      Website_URL: item.url || '',
      Audit_Status: item.success ? 'Success' : 'Failed',
      Mobile_Score: item.score ?? 'N/A',
      Score_Category: item.scoreCategory ? item.scoreCategory.toUpperCase() : 'N/A',
      LCP_Seconds: item.metrics?.lcp?.value ?? 'N/A',
      FCP_Seconds: item.metrics?.fcp?.value ?? 'N/A',
      TBT_Milliseconds: item.metrics?.tbt?.value ?? 'N/A',
      CLS_Score: item.metrics?.cls?.value ?? 'N/A',
      Top_Bottleneck: item.topBottleneck || 'N/A',
      Second_Bottleneck: item.secondBottleneck || 'None',
      Outreach_Priority: item.outreachPriority || 'Standard',
      Lead_Tier: item.leadTier || 'Cold',
      Estimated_Bounce_Increase: item.estimatedBounceIncrease || 'N/A',
      Hook_Speed_Snippet: snippet,
      Pitch_Email_Subject: pitch.subject,
      Pitch_Email_Body: pitch.body
    };
  });

  return Papa.unparse(exportRows);
}

/**
 * Triggers browser download for a CSV string
 */
export function downloadCsvFile(csvString, filename = 'mailmeteor_speed_audit_leads.csv') {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
