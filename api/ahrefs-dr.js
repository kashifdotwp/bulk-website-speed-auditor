/**
 * Vercel Serverless Function: Ahrefs Domain Rating (DR) API Proxy
 * Handles CORS and queries Ahrefs v3 API securely
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { domain, apiKey } = req.body || {};
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const cleanDomain = domain
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .trim()
      .toLowerCase();

    if (!apiKey || !apiKey.trim()) {
      return res.status(400).json({ error: 'Ahrefs API key is required' });
    }

    const token = apiKey.trim();

    // 1. Try public domain-rating-free endpoint
    const urlFree = `https://api.ahrefs.com/v3/public/domain-rating-free?target=${encodeURIComponent(cleanDomain)}`;
    
    let ahrefsRes = await fetch(urlFree, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    // 2. If free endpoint returns 404 or fails, try standard site-explorer domain-rating endpoint
    if (!ahrefsRes.ok) {
      const today = new Date().toISOString().slice(0, 10);
      const urlStandard = `https://api.ahrefs.com/v3/site-explorer/domain-rating?target=${encodeURIComponent(cleanDomain)}&date=${today}`;
      ahrefsRes = await fetch(urlStandard, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
    }

    if (ahrefsRes.ok) {
      const data = await ahrefsRes.json();
      // Extract DR from response (e.g. data.domain_rating, data.domainRating, or data.domain_rating?.domain_rating)
      const dr = data.domain_rating?.domain_rating ??
                 data.domain_rating ??
                 data.domainRating ??
                 data.dr ??
                 data.rating ??
                 (typeof data === 'number' ? data : null);

      const ahrefsRank = data.domain_rating?.ahrefs_rank ?? data.ahrefs_rank ?? null;

      return res.status(200).json({
        success: true,
        domain: cleanDomain,
        domainRating: dr !== null ? Math.round(Number(dr)) : null,
        ahrefsRank,
        rawData: data
      });
    } else {
      const errorText = await ahrefsRes.text().catch(() => '');
      return res.status(ahrefsRes.status).json({
        success: false,
        error: `Ahrefs API returned HTTP ${ahrefsRes.status}: ${errorText}`
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
