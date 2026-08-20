/**
 * High-Reliability Multi-Engine SERP Aggregator & Web Lead Discovery API
 * Engines: DuckDuckGo GET (Browser-Emulated) + Yahoo Search + Bing + Fallbacks
 * Supports ALL Query Types: Local Business, SaaS, E-commerce, Agencies, B2B, and Niche Brands
 */

const KNOWN_DIRECTORIES = new Set([
  'yelp.com', 'yellowpages.com', 'superpages.com', 'angi.com', 'angieslist.com',
  'thumbtack.com', 'homeadvisor.com', 'houzz.com', 'bbb.org', 'expertise.com',
  'mapquest.com', 'manta.com', 'citysearch.com', 'merchantcircle.com',
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'linkedin.com',
  'pinterest.com', 'youtube.com', 'tiktok.com', 'wikipedia.org', 'wikimedia.org',
  'reddit.com', 'quora.com', 'amazon.com', 'ebay.com', 'walmart.com', 'target.com',
  'tripadvisor.com', 'justia.com', 'findlaw.com', 'avvo.com', 'lawyers.com',
  'apple.com', 'google.com', 'bing.com', 'duckduckgo.com', 'yahoo.com',
  'uservoice.com', 'microsoft.com', 'trustpilot.com', 'glassdoor.com'
]);

function isDirDomain(domain) {
  if (!domain) return true;
  const d = domain.toLowerCase().replace(/^www\./i, '');
  if (KNOWN_DIRECTORIES.has(d)) return true;
  for (const dir of KNOWN_DIRECTORIES) {
    if (d === dir || d.endsWith('.' + dir)) return true;
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
  const clean = cleanHtml(title);
  const parts = clean.split(/\s*[-–—|:•»]\s*/);
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

// Region codes for DuckDuckGo
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
  'nz': 'nz-en',
  'ie': 'ie-en',
  'sg': 'sg-en',
  'ae': 'ae-en',
  'pk': 'pk-en',
  'ph': 'ph-en',
  'za': 'za-en',
  'global': ''
};

/**
 * Engine 1: DuckDuckGo GET with full browser navigation emulation
 */
async function fetchDuckDuckGo(query, region) {
  const results = [];
  try {
    let url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    if (region && DDG_REGIONS[region]) {
      url += `&kl=${DDG_REGIONS[region]}`;
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (res.ok) {
      const html = await res.text();
      const titleRegex = /class="result__a"\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      const snippetRegex = /class="result__snippet"\s+href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

      let match;
      const hrefs = [];
      const titles = [];

      while ((match = titleRegex.exec(html)) !== null) {
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
    }
  } catch (e) {}
  return results;
}

/**
 * Engine 2: Yahoo Search Engine (High-converting real organic results)
 */
async function fetchYahoo(query) {
  const results = [];
  try {
    const res = await fetch(`https://search.yahoo.com/search?p=${encodeURIComponent(query)}&nojs=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (res.ok) {
      const html = await res.text();
      // Yahoo redirect format: /RU=url/RK=...
      const ruRegex = /<a[^>]+href="([^"]*\/RU=([^/"]+)[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
      let m;
      while ((m = ruRegex.exec(html)) !== null) {
        const rawUrl = decodeURIComponent(m[2]);
        const anchorText = cleanHtml(m[3]);
        if (rawUrl.startsWith('http') && !rawUrl.includes('yahoo.com') && anchorText.length > 3) {
          results.push({
            url: rawUrl,
            title: anchorText,
            snippet: `Ranking result for query: "${query}"`
          });
        }
      }
    }
  } catch (e) {}
  return results;
}

/**
 * Engine 3: Bing Search Fallback
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

    if (res.ok) {
      const html = await res.text();
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
    }
  } catch (e) {}
  return results;
}

export default async function handler(req, res) {
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

    // 1. DuckDuckGo GET (Browser emulated)
    let rawResults = await fetchDuckDuckGo(cleanQuery, region);

    // 2. Combine with Yahoo Search for maximum coverage
    if (rawResults.length < limit) {
      const yahooResults = await fetchYahoo(cleanQuery);
      rawResults = [...rawResults, ...yahooResults];
    }

    // 3. Fallback to Bing if needed
    if (rawResults.length < 5) {
      const bingResults = await fetchBing(cleanQuery);
      rawResults = [...rawResults, ...bingResults];
    }

    // 4. Normalize, filter directories, deduplicate by root domain
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
      totalFound: finalLeads.length,
      leads: finalLeads
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
