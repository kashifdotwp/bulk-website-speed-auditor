/**
 * Frontend Ahrefs Service
 * Queries Ahrefs Domain Rating (DR) API via /api/ahrefs-dr
 */

export async function fetchDomainRating(domain, apiKey) {
  if (!domain || !apiKey) {
    return { success: false, error: 'Domain and Ahrefs API Key required' };
  }

  const cleanDomain = domain
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .trim()
    .toLowerCase();

  try {
    const response = await fetch('/api/ahrefs-dr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: cleanDomain, apiKey })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      return {
        success: true,
        domain: cleanDomain,
        domainRating: data.domainRating,
        ahrefsRank: data.ahrefsRank
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to fetch Ahrefs DR'
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Network error fetching Ahrefs DR'
    };
  }
}

export function getDrBadgeStyles(dr) {
  if (dr === null || dr === undefined) {
    return { color: 'var(--text-muted)', bg: 'var(--bg-primary)', border: 'var(--border-subtle)', label: 'N/A' };
  }
  const num = Number(dr);
  if (num >= 65) {
    return { color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.3)', label: `DR ${num}` };
  }
  if (num >= 35) {
    return { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', border: 'rgba(2, 132, 199, 0.3)', label: `DR ${num}` };
  }
  if (num >= 10) {
    return { color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.3)', label: `DR ${num}` };
  }
  return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.25)', label: `DR ${num}` };
}
