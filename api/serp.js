/**
 * Multi-Engine SERP Aggregator & Web Discovery API (Vercel Serverless)
 * Cascades: DuckDuckGo HTML → DuckDuckGo Lite → Bing
 * Supports ALL query types with country/region filtering
 */

const KNOWN_DIRECTORIES = new Set([
  'yelp.com', 'yellowpages.com', 'superpages.com', 'angi.com', 'angieslist.com',
  'thumbtack.com', 'homeadvisor.com', 'houzz.com', 'bbb.org', 'expertise.com',
  'mapquest.com', 'manta.com', 'citysearch.com', 'merchantcircle.com',
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'linkedin.com',
  'pinterest.com', 'youtube.com', 'tiktok.com', 'wikipedia.org', 'wikimedia.org',
  'reddit.com', 'quora.com', 'amazon.com', 'ebay.com', 'walmart.com', 'target.com',
  'tripadvisor.com', 'justia.com', 'findlaw.com', 'avvo.com', 'lawyers.com',
  'apple.com', 'google.com', 'bing.com', 'duckduckgo.com', 'yahoo.com'
]);

function isDirDomain(domain) {
  if (!domain) return true;
  const d = domain.toLowerCase().replace(/^www\./i, '');
  if (KNOWN_DIRECTORIES.has(d)) return true;
  for (const dir of KNOWN_DIRECTORIES) {
    if (d.endsWith('.' + dir)) return true;
  }
  return false;
}

function cleanHtml(raw) {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function extractCompany(title, domain) {
  if (!title || title.trim().length === 0) {
    return domainToName(domain);
  }
  const parts = title.split(/\s*[-–—|:•»]\s*/);
  if (parts.length > 0 && parts[0].trim().length >= 2 && parts[0].trim().length <= 55) {
    if (!/^(10|top\s*\d|best|the\s+best|find|how\s+to|what\s+is|updated)/i.test(parts[0].trim())) {
      return parts[0].trim();
    }
  }
  return domainToName(domain);
}

function domainToName(domain) {
  if (!domain) return '';
  const base = domain.replace(/\.(com|org|net|co\.uk|io|ai|biz|us|law|app|dev|co|me|ca|uk|info)$/i, '');
  return base.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// DDG region codes for country filtering
const DDG_REGIONS = {
  'us': 'us-en',
  'uk': 'uk-en',
  'ca': 'ca-en',
  'au': 'au-en',
  'in': 'in-en',
  'de': 'de-de',
  'fr': 'fr-fr',
  'es': 'es-es',
  'it': 'it-it',
  'br': 'br-pt',
  'mx': 'mx-es',
  'nl': 'nl-nl',
  'se': 'se-sv',
  'no': 'no-no',
  'dk': 'dk-da',
  'nz': 'nz-en',
  'ie': 'ie-en',
  'sg': 'sg-en',
  'za': 'za-en',
  'ae': 'ae-en',
  'pk': 'pk-en',
  'ph': 'ph-en',
  'global': ''
};

/**
 * Engine 1: DuckDuckGo HTML scraper
 */
async function fetchDuckDuckGoHTML(query, region) {
  const results = [];
  try {
    const params = { q: query };
    if (region && DDG_REGIONS[region]) {
      params.kl = DDG_REGIONS[region];
    }

    const res = await fetch('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      body: new URLSearchParams(params)
    });

    if (!res.ok) return results;

    const html = await res.text();

    // Parse title links: <a class="result__a" href="URL">Title</a>
    const titleRegex = /class="result__a"\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetRegex = /class="result__snippet"\s+href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

    let match;
    const hrefs = [];
    const titles = [];

    while ((match = titleRegex.exec(html)) !== null) {
      let rawHref = match[1];
      // Handle DDG redirect URLs
      const uddg = rawHref.match(/uddg=([^&]+)/);
      const cleanUrl = uddg ? decodeURIComponent(uddg[1]) : rawHref;
      if (cleanUrl && cleanUrl.startsWith('http')) {
        hrefs.push(cleanUrl);
        titles.push(cleanHtml(match[2]));
      }
    }

    const snippets = [];
    while ((match = snippetRegex.exec(html)) !== null) {
      snippets.push(cleanHtml(match[1]));
    }

    for (let i = 0; i < hrefs.length; i++) {
      results.push({
        url: hrefs[i],
        title: titles[i] || '',
        snippet: snippets[i] || ''
      });
    }
  } catch (e) {
    // Engine failed, continue to fallback
  }
  return results;
}

/**
 * Engine 2: DuckDuckGo Lite fallback
 */
async function fetchDuckDuckGoLite(query) {
  const results = [];
  try {
    const res = await fetch('https://lite.duckduckgo.com/lite/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      body: new URLSearchParams({ q: query })
    });

    if (!res.ok) return results;

    const html = await res.text();

    // DDG Lite has a simpler structure with result-link class
    const linkRegex = /class="result-link"\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    const snippetRegex = /class="result-snippet"[^>]*>([\s\S]*?)<\/td>/gi;

    let match;
    const hrefs = [];
    const titles = [];

    while ((match = linkRegex.exec(html)) !== null) {
      let rawHref = match[1];
      const uddg = rawHref.match(/uddg=([^&]+)/);
      const cleanUrl = uddg ? decodeURIComponent(uddg[1]) : rawHref;
      if (cleanUrl && cleanUrl.startsWith('http')) {
        hrefs.push(cleanUrl);
        titles.push(cleanHtml(match[2]));
      }
    }

    const snippets = [];
    while ((match = snippetRegex.exec(html)) !== null) {
      snippets.push(cleanHtml(match[1]));
    }

    for (let i = 0; i < hrefs.length; i++) {
      results.push({
        url: hrefs[i],
        title: titles[i] || '',
        snippet: snippets[i] || ''
      });
    }
  } catch (e) {}
  return results;
}

/**
 * Engine 3: Bing fallback
 */
async function fetchBing(query) {
  const results = [];
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(`https://www.bing.com/search?q=${encoded}&setmkt=en-US&setlang=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!res.ok) return results;

    const html = await res.text();

    // Bing result structure: <li class="b_algo"><h2><a href="URL">Title</a></h2>...<p>Snippet</p>
    const bingRegex = /<li\s+class="b_algo"[^>]*>[\s\S]*?<h2><a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>[\s\S]*?(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi;
    let match;
    while ((match = bingRegex.exec(html)) !== null) {
      if (match[1] && match[1].startsWith('http') && !match[1].includes('bing.com') && !match[1].includes('microsoft.com')) {
        results.push({
          url: match[1],
          title: cleanHtml(match[2]),
          snippet: cleanHtml(match[3] || '')
        });
      }
    }
  } catch (e) {}
  return results;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, limit = 20, excludeDirectories = true, region = 'global' } = req.body || {};
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanQuery = query.trim();

    // 1. Try DDG HTML first
    let rawResults = await fetchDuckDuckGoHTML(cleanQuery, region);

    // 2. If few results, try DDG Lite
    if (rawResults.length < 5) {
      const liteResults = await fetchDuckDuckGoLite(cleanQuery);
      rawResults = [...rawResults, ...liteResults];
    }

    // 3. If still few, try Bing
    if (rawResults.length < 5) {
      const bingResults = await fetchBing(cleanQuery);
      rawResults = [...rawResults, ...bingResults];
    }

    // 4. Normalize, filter directories, deduplicate
    const finalLeads = [];
    const seenDomains = new Set();

    for (let i = 0; i < rawResults.length && finalLeads.length < limit; i++) {
      const item = rawResults[i];
      let url = item.url;

      try {
        if (!url.startsWith('http')) url = 'https://' + url;
        const parsed = new URL(url);
        const domain = parsed.hostname.replace(/^www\./i, '').toLowerCase();

        if (!domain || domain.length < 3 || !domain.includes('.')) continue;
        if (excludeDirectories && isDirDomain(domain)) continue;
        if (seenDomains.has(domain)) continue;
        seenDomains.add(domain);

        const company = extractCompany(item.title, domain);
        const cityMatch = cleanQuery.match(/(?:in|near|for|around)\s+([a-zA-Z\s,]+)/i);
        const detectedCity = cityMatch ? cityMatch[1].trim() : '';

        finalLeads.push({
          id: `serp_${Date.now()}_${finalLeads.length + 1}`,
          url,
          domain,
          title: item.title || domain,
          snippet: item.snippet || `Ranking result for: "${cleanQuery}"`,
          originalData: {
            website: url,
            domain,
            company,
            city: detectedCity,
            industry: cleanQuery,
            source: `Live SERP: "${cleanQuery}"`
          }
        });
      } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      query: cleanQuery,
      region: region || 'global',
      enginesUsed: rawResults.length > 0 ? 'DDG' : 'multi',
      totalFound: finalLeads.length,
      leads: finalLeads
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
