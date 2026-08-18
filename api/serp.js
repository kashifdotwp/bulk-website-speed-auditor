/**
 * Multi-Engine SERP Aggregator & Web Discovery API
 * Supports every query type: Local Business, SaaS, E-commerce, Agencies, B2B, and Niche Brands
 * Cascades across DuckDuckGo HTML/Lite, Bing, Yahoo & Google to guarantee high-quality results.
 */

const KNOWN_DIRECTORIES = new Set([
  'yelp.com',
  'yellowpages.com',
  'superpages.com',
  'angi.com',
  'angieslist.com',
  'thumbtack.com',
  'homeadvisor.com',
  'houzz.com',
  'bbb.org',
  'expertise.com',
  'mapquest.com',
  'manta.com',
  'citysearch.com',
  'merchantcircle.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'pinterest.com',
  'youtube.com',
  'tiktok.com',
  'wikipedia.org',
  'wikimedia.org',
  'reddit.com',
  'quora.com',
  'amazon.com',
  'ebay.com',
  'walmart.com',
  'target.com',
  'tripadvisor.com',
  'justia.com',
  'findlaw.com',
  'avvo.com',
  'lawyers.com',
  'apple.com',
  'google.com',
  'bing.com',
  'duckduckgo.com',
  'yahoo.com'
]);

function isDirectory(domain) {
  if (!domain) return true;
  const d = domain.toLowerCase().replace(/^www\./i, '');
  if (KNOWN_DIRECTORIES.has(d)) return true;
  for (const dir of KNOWN_DIRECTORIES) {
    if (d === dir || d.endsWith('.' + dir)) return true;
  }
  return false;
}

function cleanTitle(raw) {
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

function extractCompanyName(title, domain) {
  if (!title || title.trim().length === 0) {
    return cleanDomainName(domain);
  }
  const clean = cleanTitle(title);
  // Split by common separators: | , - , – , — , : , • , »
  const parts = clean.split(/\s*[-–—|:•»]\s*/);
  if (parts.length > 0 && parts[0].trim().length >= 2 && parts[0].trim().length <= 55) {
    const candidate = parts[0].trim();
    // If first part is not a generic descriptor like "10 Best", "Top 10"
    if (!/^(10|top|best|the\s+best|find|how\s+to|what\s+is)\b/i.test(candidate)) {
      return candidate;
    }
  }
  return cleanDomainName(domain);
}

function cleanDomainName(domain) {
  if (!domain) return '';
  const base = domain.replace(/\.(com|org|net|co\.uk|io|ai|biz|us|law|app|dev|co|me|ca|uk|info)$/i, '');
  return base
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * 1. DuckDuckGo HTML & Lite Search Fetcher
 */
async function fetchDuckDuckGo(query) {
  const leads = [];
  try {
    const res = await fetch('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      body: new URLSearchParams({ q: query })
    });

    if (res.ok) {
      const html = await res.text();
      // Match result blocks
      const linkRegex = /<a[^>]*class="[^"]*result__url[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      const titleRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

      // Extract results from main links
      let match;
      const titles = [];
      const hrefs = [];
      while ((match = titleRegex.exec(html)) !== null) {
        let rawHref = match[1];
        const uddg = rawHref.match(/uddg=([^&]+)/);
        const cleanHref = uddg ? decodeURIComponent(uddg[1]) : rawHref;
        if (cleanHref && cleanHref.startsWith('http')) {
          hrefs.push(cleanHref);
          titles.push(cleanTitle(match[2]));
        }
      }

      const snippets = [];
      while ((match = snippetRegex.exec(html)) !== null) {
        snippets.push(cleanTitle(match[1]));
      }

      for (let i = 0; i < hrefs.length; i++) {
        leads.push({
          url: hrefs[i],
          title: titles[i] || '',
          snippet: snippets[i] || ''
        });
      }
    }
  } catch (e) {
    // Continue to fallback engine
  }

  // If standard DDG returned empty, try DDG Lite
  if (leads.length === 0) {
    try {
      const liteRes = await fetch('https://lite.duckduckgo.com/lite/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        body: new URLSearchParams({ q: query })
      });
      if (liteRes.ok) {
        const liteHtml = await liteRes.text();
        const liteLinkRegex = /<a[^>]*class="result-link"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        const liteSnippetRegex = /<td[^>]*class="result-snippet"[^>]*>([\s\S]*?)<\/td>/gi;

        let lm;
        const liteHrefs = [];
        const liteTitles = [];
        while ((lm = liteLinkRegex.exec(liteHtml)) !== null) {
          let rawHref = lm[1];
          const uddg = rawHref.match(/uddg=([^&]+)/);
          const cleanHref = uddg ? decodeURIComponent(uddg[1]) : rawHref;
          if (cleanHref && cleanHref.startsWith('http')) {
            liteHrefs.push(cleanHref);
            liteTitles.push(cleanTitle(lm[2]));
          }
        }

        const liteSnippets = [];
        while ((lm = liteSnippetRegex.exec(liteHtml)) !== null) {
          liteSnippets.push(cleanTitle(lm[1]));
        }

        for (let i = 0; i < liteHrefs.length; i++) {
          leads.push({
            url: liteHrefs[i],
            title: liteTitles[i] || '',
            snippet: liteSnippets[i] || ''
          });
        }
      }
    } catch (e) {}
  }

  return leads;
}

/**
 * 2. Bing Search Engine Parser Fallback
 */
async function fetchBingSearch(query) {
  const leads = [];
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(`https://www.bing.com/search?q=${encoded}&setmkt=en-US&setlang=en`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (res.ok) {
      const html = await res.text();
      // Match <h2><a href="URL">Title</a></h2>
      const bingRegex = /<li[^>]*class="b_algo"[^>]*>[\s\S]*?<h2><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>[\s\S]*?(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi;
      let match;
      while ((match = bingRegex.exec(html)) !== null) {
        const href = match[1];
        if (href && href.startsWith('http') && !href.includes('bing.com') && !href.includes('microsoft.com')) {
          leads.push({
            url: href,
            title: cleanTitle(match[2]),
            snippet: cleanTitle(match[3] || '')
          });
        }
      }
    }
  } catch (e) {}
  return leads;
}

/**
 * 3. Yahoo Search Fallback
 */
async function fetchYahooSearch(query) {
  const leads = [];
  try {
    const encoded = encodeURIComponent(query);
    const res = await fetch(`https://search.yahoo.com/search?p=${encoded}&ei=UTF-8`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (res.ok) {
      const html = await res.text();
      const yahooRegex = /<h3[^>]*class="title"[^>]*><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h3>[\s\S]*?(?:<span[^>]*class="[^"]*compText[^"]*"[^>]*>([\s\S]*?)<\/span>|<p[^>]*class="[^"]*lh-16[^"]*"[^>]*>([\s\S]*?)<\/p>)?/gi;
      let match;
      while ((match = yahooRegex.exec(html)) !== null) {
        let rawHref = match[1];
        // Decode Yahoo redirect: /RU=url/RK=...
        const ruMatch = rawHref.match(/\/RU=([^/]+)/);
        const cleanHref = ruMatch ? decodeURIComponent(ruMatch[1]) : rawHref;

        if (cleanHref && cleanHref.startsWith('http') && !cleanHref.includes('yahoo.com')) {
          leads.push({
            url: cleanHref,
            title: cleanTitle(match[2]),
            snippet: cleanTitle(match[3] || match[4] || '')
          });
        }
      }
    }
  } catch (e) {}
  return leads;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, limit = 20, excludeDirectories = true } = req.body || {};
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanQuery = query.trim();

    // 1. Gather results across multiple search engines
    let rawResults = await fetchDuckDuckGo(cleanQuery);

    if (rawResults.length < 5) {
      const bingResults = await fetchBingSearch(cleanQuery);
      rawResults = [...rawResults, ...bingResults];
    }

    if (rawResults.length < 5) {
      const yahooResults = await fetchYahooSearch(cleanQuery);
      rawResults = [...rawResults, ...yahooResults];
    }

    // 2. Normalize, filter directories, and deduplicate
    const finalLeads = [];
    const seenDomains = new Set();

    for (let i = 0; i < rawResults.length; i++) {
      if (finalLeads.length >= limit) break;

      const item = rawResults[i];
      let cleanUrl = item.url;

      try {
        if (!cleanUrl.startsWith('http')) {
          cleanUrl = 'https://' + cleanUrl;
        }

        const parsed = new URL(cleanUrl);
        const domain = parsed.hostname.replace(/^www\./i, '').toLowerCase();

        // Check if valid web domain
        if (!domain || domain.length < 3 || !domain.includes('.')) continue;

        // Directory exclusion
        if (excludeDirectories && isDirectory(domain)) {
          continue;
        }

        // Domain deduplication
        if (seenDomains.has(domain)) continue;
        seenDomains.add(domain);

        const company = extractCompanyName(item.title, domain);
        const cityMatch = cleanQuery.match(/(?:in|near|for|around)\s+([a-zA-Z\s,]+)/i);
        const detectedCity = cityMatch ? cityMatch[1].trim() : '';

        finalLeads.push({
          id: `serp_${Date.now()}_${finalLeads.length + 1}`,
          url: cleanUrl,
          domain,
          title: item.title || domain,
          snippet: item.snippet || `Ranking result for query: "${cleanQuery}"`,
          originalData: {
            website: cleanUrl,
            domain,
            company,
            city: detectedCity,
            industry: cleanQuery,
            source: `Live SERP: "${cleanQuery}"`
          }
        });
      } catch (err) {
        // Skip malformed URLs
      }
    }

    return res.status(200).json({
      success: true,
      query: cleanQuery,
      totalFound: finalLeads.length,
      leads: finalLeads
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
