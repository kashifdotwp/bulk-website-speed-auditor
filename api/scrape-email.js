/**
 * Vercel Serverless Function & Live Email Scraper
 * Extracts genuine business emails from homepage and /contact pages
 */

function cleanEmails(rawHtml, domain) {
  if (!rawHtml || typeof rawHtml !== 'string') return [];

  const found = new Set();
  const domainClean = domain.replace(/^www\./i, '').toLowerCase();

  // 1. Match mailto links: href="mailto:name@domain.com"
  const mailtoMatches = rawHtml.matchAll(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi);
  for (const m of mailtoMatches) {
    if (m[1]) found.add(m[1].toLowerCase().trim());
  }

  // 2. Match general email regex across HTML text and JSON-LD schemas
  const regexMatches = rawHtml.matchAll(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/gi);
  for (const m of regexMatches) {
    if (m[1]) found.add(m[1].toLowerCase().trim());
  }

  // Blacklist of false positives / CDNs / junk tracking emails
  const ignoredPatterns = [
    /\.(png|jpg|jpeg|gif|svg|webp|avif|css|js|woff|woff2|ttf|eot)$/i,
    /sentry\.io|wixpress\.com|cloudflare\.com|google\.com|googleapis\.com|gravatar\.com|schema\.org|wordpress\.org|wp\.com|w3\.org|github\.com|example\.com|domain\.com|email\.com|yoursite\.com/i,
    /^u00/i,
    /^2x/i,
    /^bootstrap/i
  ];

  const validEmails = Array.from(found).filter(email => {
    if (email.length > 60 || email.length < 5) return false;
    return !ignoredPatterns.some(pat => pat.test(email));
  });

  // Prioritize emails matching the target domain or standard business contact prefixes
  validEmails.sort((a, b) => {
    const aMatchesDomain = a.endsWith(`@${domainClean}`) || a.endsWith(`.${domainClean}`);
    const bMatchesDomain = b.endsWith(`@${domainClean}`) || b.endsWith(`.${domainClean}`);
    if (aMatchesDomain && !bMatchesDomain) return -1;
    if (!aMatchesDomain && bMatchesDomain) return 1;

    const rolePrefixes = /^(contact|info|hello|support|sales|team|inquiries|office|admin|help)@/i;
    const aRole = rolePrefixes.test(a);
    const bRole = rolePrefixes.test(b);
    if (aRole && !bRole) return -1;
    if (!aRole && bRole) return 1;

    return 0;
  });

  return validEmails;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body || {};
    if (!url || !url.trim()) {
      return res.status(400).json({ error: 'Website URL is required' });
    }

    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const parsed = new URL(cleanUrl);
    const domain = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    const origin = `${parsed.protocol}//${parsed.hostname}`;

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };

    // Fetch Homepage + Common Contact Paths in parallel (Max 6s timeout)
    const fetchPage = async (targetPath) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const response = await fetch(targetPath, { headers, redirect: 'follow', signal: controller.signal });
        clearTimeout(timeout);
        if (response.ok) {
          return await response.text();
        }
      } catch {
        // Ignore single path failures
      }
      return '';
    };

    const [homeHtml, contactHtml, contactUsHtml, aboutHtml] = await Promise.all([
      fetchPage(origin),
      fetchPage(`${origin}/contact`),
      fetchPage(`${origin}/contact-us`),
      fetchPage(`${origin}/about`)
    ]);

    const combinedHtml = `${homeHtml} ${contactHtml} ${contactUsHtml} ${aboutHtml}`;
    const emails = cleanEmails(combinedHtml, domain);

    return res.status(200).json({
      success: true,
      domain,
      email: emails[0] || null,
      allEmails: emails
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
