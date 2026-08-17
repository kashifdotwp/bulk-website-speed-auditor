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
    const { query, limit = 15, excludeDirectories = true } = req.body || {};
    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cleanQuery = query.trim();
    const exclusions = excludeDirectories
      ? ' -site:justia.com -site:yelp.com -site:findlaw.com -site:avvo.com -site:lawyers.com -site:superpages.com -site:yellowpages.com -site:bbb.org -site:angi.com -site:thumbtack.com -site:wikipedia.org -site:facebook.com'
      : '';

    const fullQuery = `${cleanQuery}${exclusions}`;

    const ddgRes = await fetch('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: new URLSearchParams({ q: fullQuery })
    });

    const html = await ddgRes.text();
    const blocks = html.split(/class="result\s+results_links/gi);
    const leads = [];
    const seenDomains = new Set();

    for (let i = 1; i < blocks.length && leads.length < limit; i++) {
      const b = blocks[i];
      const urlMatch = b.match(/class="result__snippet"[^>]*href="([^"]+)"/i) || b.match(/class="result__url"[^>]*href="([^"]+)"/i);
      const titleMatch = b.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/i);
      const snippetMatch = b.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);

      if (urlMatch) {
        let rawHref = urlMatch[1];
        const uddg = rawHref.match(/uddg=([^&]+)/);
        const cleanUrl = uddg ? decodeURIComponent(uddg[1]) : rawHref;

        try {
          const parsed = new URL(cleanUrl);
          const domain = parsed.hostname.replace(/^www\./i, '').toLowerCase();

          if (!domain.includes('duckduckgo') && !domain.includes('google') && !seenDomains.has(domain)) {
            seenDomains.add(domain);
            const rawTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim() : domain;
            const rawSnippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim() : '';

            // Extract clean company name from title
            let company = rawTitle.split(/[-–|:•]/)[0].trim();
            if (!company || company.length > 50) {
              company = domain.replace(/\.(com|org|net|co\.uk|io|ai|biz|us|law)$/i, '').replace(/[-_]/g, ' ');
              company = company.replace(/\b\w/g, l => l.toUpperCase());
            }

            leads.push({
              id: `serp_${Date.now()}_${i}`,
              url: cleanUrl,
              domain,
              title: rawTitle,
              snippet: rawSnippet,
              originalData: {
                website: cleanUrl,
                domain,
                company,
                city: cleanQuery.match(/(?:in|near|for)\s+([a-zA-Z\s]+)/i)?.[1]?.trim() || '',
                industry: cleanQuery,
                source: `Live SERP: "${cleanQuery}"`
              }
            });
          }
        } catch (e) {}
      }
    }

    return res.status(200).json({ success: true, leads });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
