/**
 * Live SERP Lead Finder Service
 * Multi-Engine Aggregator: DuckDuckGo HTML/Lite → Bing → Yahoo
 * Supports ALL query types: Local Business, SaaS, E-commerce, Agencies, B2B, Niche
 */

// Diverse preset queries covering multiple industries and query types
export const POPULAR_QUERY_TEMPLATES = [
  // Local Services
  { label: '⚖️ Injury Lawyers Ohio', query: 'personal injury lawyer in ohio', category: 'local' },
  { label: '🦷 Cosmetic Dentists Austin', query: 'cosmetic dentist austin texas', category: 'local' },
  { label: '🏠 Roofing Chicago', query: 'roofing contractor chicago il', category: 'local' },
  { label: '💄 Aesthetic Clinics London', query: 'aesthetic clinic london uk', category: 'local' },
  // SaaS & Tech
  { label: '🚀 Project Management SaaS', query: 'best project management software for teams', category: 'saas' },
  { label: '📧 Email Marketing Tools', query: 'email marketing automation platform', category: 'saas' },
  { label: '🤖 AI Writing Tools', query: 'AI content writing tools for marketers', category: 'saas' },
  // E-commerce
  { label: '👗 Fashion Boutiques NYC', query: 'boutique clothing store new york', category: 'ecommerce' },
  { label: '🛒 DTC Skincare Brands', query: 'direct to consumer skincare brands', category: 'ecommerce' },
  // Agencies & B2B
  { label: '📈 SEO Agencies', query: 'best SEO agency for small business', category: 'agency' },
  { label: '🎨 Web Design Agencies', query: 'web design agency for startups', category: 'agency' },
  // General / Any Query
  { label: '🔍 CRM Software', query: 'CRM software for real estate agents', category: 'saas' },
  { label: '🏥 Plastic Surgery Miami', query: 'plastic surgery clinic miami fl', category: 'local' }
];

// Category groups for filter chips in UI
export const QUERY_CATEGORIES = [
  { id: 'all', label: '🌐 All Presets' },
  { id: 'local', label: '📍 Local Business' },
  { id: 'saas', label: '🚀 SaaS / Tech' },
  { id: 'ecommerce', label: '🛒 E-commerce' },
  { id: 'agency', label: '📈 Agencies / B2B' }
];

/**
 * Searches real live ranking websites for ANY keyword query
 * @param {string} query - Keyword (e.g. "roofing contractor chicago", "best CRM software", "AI writing tools")
 * @param {number} limit - Number of leads to fetch (default 20)
 * @param {boolean} excludeDirectories - Exclude Yelp, Justia, social media etc.
 */
export async function searchSerpLeads(query, limit = 20, excludeDirectories = true, region = 'global') {
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
        excludeDirectories,
        region
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
