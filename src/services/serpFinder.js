/**
 * Live SERP Lead Finder Service
 * Connects to live search engine via backend API to pull real live business websites
 */

// Popular niche query templates for 1-click discovery
export const POPULAR_QUERY_TEMPLATES = [
  { label: '⚖️ Ohio Injury Lawyers', query: 'personal injury lawyer in ohio' },
  { label: '🦷 Austin Cosmetic Dentists', query: 'cosmetic dentist austin texas' },
  { label: '🏠 Chicago Roofing Contractors', query: 'roofing contractor chicago il' },
  { label: '❄️ Dallas HVAC Services', query: 'commercial hvac repair dallas tx' },
  { label: '💄 London Aesthetic Clinics', query: 'aesthetic clinic london uk' },
  { label: '🛍️ Miami Boutique Fashion', query: 'boutique clothing store miami fl' }
];

/**
 * Searches real live ranking websites for any niche keyword query
 * @param {string} query - Keyword (e.g. "personal injury lawyer in ohio")
 * @param {number} limit - Number of leads to fetch
 * @param {boolean} excludeDirectories - Exclude Yelp, Justia, YellowPages
 */
export async function searchSerpLeads(query, limit = 15, excludeDirectories = true) {
  if (!query || !query.trim()) return [];

  try {
    const response = await fetch('/api/serp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query.trim(),
        limit,
        excludeDirectories
      })
    });

    if (!response.ok) {
      throw new Error(`Search request returned status ${response.status}`);
    }

    const data = await response.json();
    return data.leads || [];
  } catch (err) {
    console.error('SERP Search Error:', err);
    throw err;
  }
}
