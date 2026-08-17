/**
 * Official Google PageSpeed Insights v5 Live API Client
 * Fetches 100% genuine Google Lighthouse audits (Mobile & Desktop) matching https://pagespeed.web.dev/
 */

export const DEFAULT_GOOGLE_API_KEY = 'AIzaSyAdtRzSAICTURt5hnHU6MlIUq42W_gMBe4';
const PSI_ENDPOINT = 'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';

/**
 * Normalizes input URL into a valid full URL with protocol
 */
export function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  url = url.replace(/^['"]|['"]$/g, '').trim();

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname === '/') {
      return `${parsed.protocol}//${parsed.hostname}`;
    }
    return parsed.href;
  } catch {
    return url;
  }
}

/**
 * Extracts a clean domain name for display (e.g. 'wedsads.com')
 */
export function extractDomain(url) {
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return url;
  }
}

/**
 * Extracts list of clean API keys from string
 */
export function parseApiKeyPool(rawKeys) {
  if (!rawKeys || typeof rawKeys !== 'string') return [DEFAULT_GOOGLE_API_KEY];
  const keys = rawKeys
    .split(/[\n,;]+/)
    .map(k => k.trim())
    .filter(k => k.length > 5);
  return keys.length > 0 ? keys : [DEFAULT_GOOGLE_API_KEY];
}

/**
 * Formats bytes to human readable string
 */
function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Executes a live Google PageSpeed Insights API call for a specific strategy (mobile or desktop)
 */
async function fetchGooglePsiStrategy(cleanUrl, strategy, keyPool, signal) {
  let lastError = null;

  for (let i = 0; i < keyPool.length; i++) {
    const key = keyPool[i];
    const params = new URLSearchParams({
      url: cleanUrl,
      strategy: strategy.toLowerCase(),
      category: 'performance',
      key
    });

    const startTime = Date.now();
    try {
      const response = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal
      });

      if (response.ok) {
        const data = await response.json();
        return parseLighthouseData(data, cleanUrl, strategy, Date.now() - startTime);
      } else {
        const errJson = await response.json().catch(() => ({}));
        const errMsg = errJson?.error?.message || `HTTP ${response.status} from Google PSI`;
        lastError = new Error(errMsg);
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
    }
  }

  throw lastError || new Error(`Google PageSpeed API request failed for ${strategy}`);
}

/**
 * Executes a full genuine dual-strategy speed audit (Both Mobile & Desktop)
 * @param {string} targetUrl 
 * @param {string} preferredStrategy - 'mobile' | 'desktop' | 'both'
 * @param {string|string[]} apiKeys 
 * @param {AbortSignal} signal 
 */
export async function runPageSpeedAudit(
  targetUrl,
  preferredStrategy = 'both',
  apiKeys = '',
  signal = null
) {
  const cleanUrl = normalizeUrl(targetUrl);
  const domain = extractDomain(cleanUrl);
  const keyPool = Array.isArray(apiKeys) && apiKeys.length > 0
    ? apiKeys
    : parseApiKeyPool(apiKeys);

  const startTime = Date.now();

  try {
    // 1. Fetch Mobile & Desktop from Google PSI
    // When auditing both, fetch mobile and desktop with authentic Google execution
    const [mobileData, desktopData] = await Promise.all([
      fetchGooglePsiStrategy(cleanUrl, 'mobile', keyPool, signal),
      fetchGooglePsiStrategy(cleanUrl, 'desktop', keyPool, signal).catch(err => {
        console.warn(`Desktop audit failed for ${cleanUrl}:`, err);
        return null;
      })
    ]);

    const totalDuration = Date.now() - startTime;

    return {
      success: true,
      url: cleanUrl,
      domain,
      strategy: preferredStrategy,
      mobile: mobileData,
      desktop: desktopData,
      // Default to mobile score for high-level ranking
      score: mobileData.score,
      desktopScore: desktopData?.score ?? null,
      scoreCategory: mobileData.scoreCategory,
      metrics: mobileData.metrics,
      desktopMetrics: desktopData?.metrics ?? null,
      opportunities: mobileData.opportunities,
      topBottleneck: mobileData.topBottleneck,
      secondBottleneck: mobileData.secondBottleneck,
      outreachPriority: mobileData.outreachPriority,
      leadTier: mobileData.leadTier,
      estimatedBounceIncrease: mobileData.estimatedBounceIncrease,
      auditDurationMs: totalDuration,
      auditedAt: new Date().toISOString()
    };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    return {
      success: false,
      url: cleanUrl,
      domain,
      strategy: preferredStrategy,
      error: err.message || 'Google PageSpeed Insights request failed',
      auditedAt: new Date().toISOString()
    };
  }
}

/**
 * Parses raw Google PSI Lighthouse JSON payload into structured metrics
 */
export function parseLighthouseData(psiData, url, strategy, durationMs) {
  const lighthouse = psiData?.lighthouseResult;
  const categories = lighthouse?.categories;
  const audits = lighthouse?.audits || {};

  const perfScoreRaw = categories?.performance?.score;
  const score = perfScoreRaw !== null && perfScoreRaw !== undefined
    ? Math.round(perfScoreRaw * 100)
    : 0;

  // 1. LCP (Largest Contentful Paint)
  const lcpValue = audits['largest-contentful-paint']?.numericValue;
  const lcpSeconds = lcpValue !== undefined ? +(lcpValue / 1000).toFixed(2) : 0;
  const lcpDisplay = audits['largest-contentful-paint']?.displayValue || `${lcpSeconds} s`;

  // 2. FCP (First Contentful Paint)
  const fcpValue = audits['first-contentful-paint']?.numericValue;
  const fcpSeconds = fcpValue !== undefined ? +(fcpValue / 1000).toFixed(2) : 0;
  const fcpDisplay = audits['first-contentful-paint']?.displayValue || `${fcpSeconds} s`;

  // 3. TBT (Total Blocking Time)
  const tbtValue = audits['total-blocking-time']?.numericValue;
  const tbtMs = tbtValue !== undefined ? Math.round(tbtValue) : 0;
  const tbtDisplay = audits['total-blocking-time']?.displayValue || `${tbtMs} ms`;

  // 4. CLS (Cumulative Layout Shift)
  const clsValue = audits['cumulative-layout-shift']?.numericValue;
  const clsScore = clsValue !== null && clsValue !== undefined ? +clsValue.toFixed(3) : 0;
  const clsDisplay = audits['cumulative-layout-shift']?.displayValue || `${clsScore}`;

  // 5. Speed Index
  const speedIndexValue = audits['speed-index']?.numericValue;
  const speedIndexSeconds = speedIndexValue !== undefined ? +(speedIndexValue / 1000).toFixed(2) : 0;
  const speedIndexDisplay = audits['speed-index']?.displayValue || `${speedIndexSeconds} s`;

  // Extract Exact Google Lighthouse Opportunities
  const opportunities = [];

  // Modern image formats
  const imgSavings = (audits['uses-optimized-images']?.details?.overallSavingsBytes || 0) +
                     (audits['modern-image-formats']?.details?.overallSavingsBytes || 0) +
                     (audits['responsive-images']?.details?.overallSavingsBytes || 0);
  if (imgSavings > 150 * 1024) {
    opportunities.push({
      type: 'images',
      title: 'Serve images in next-gen formats / Optimize images',
      savingsText: `~${formatBytes(imgSavings)} potential savings`,
      timeSavingsMs: audits['modern-image-formats']?.details?.overallSavingsMs || 0,
      description: 'Image formats like WebP and AVIF often provide better compression than PNG or JPEG.'
    });
  }

  // Render blocking resources
  const renderBlockingMs = audits['render-blocking-resources']?.details?.overallSavingsMs || 0;
  const renderBlockingBytes = audits['render-blocking-resources']?.details?.overallSavingsBytes || 0;
  if (renderBlockingMs > 250 || renderBlockingBytes > 50 * 1024) {
    opportunities.push({
      type: 'render_blocking',
      title: 'Eliminate render-blocking resources',
      savingsText: renderBlockingMs > 0 ? `~${(renderBlockingMs / 1000).toFixed(2)}s delay` : `~${formatBytes(renderBlockingBytes)}`,
      timeSavingsMs: renderBlockingMs,
      description: 'Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring non-critical scripts.'
    });
  }

  // Unused JavaScript
  const unusedJsBytes = audits['unused-javascript']?.details?.overallSavingsBytes || 0;
  const unusedJsMs = audits['unused-javascript']?.details?.overallSavingsMs || 0;
  if (unusedJsBytes > 100 * 1024) {
    opportunities.push({
      type: 'unused_js',
      title: 'Reduce unused JavaScript',
      savingsText: `~${formatBytes(unusedJsBytes)} unused JS`,
      timeSavingsMs: unusedJsMs,
      description: 'Reduce unused JavaScript and defer loading scripts until they are required.'
    });
  }

  // Unused CSS
  const unusedCssBytes = audits['unused-css-rules']?.details?.overallSavingsBytes || 0;
  if (unusedCssBytes > 50 * 1024) {
    opportunities.push({
      type: 'unused_css',
      title: 'Reduce unused CSS',
      savingsText: `~${formatBytes(unusedCssBytes)} unused CSS`,
      description: 'Reduce unused rules from stylesheets to reduce unnecessary bytes consumed.'
    });
  }

  // Server response time (TTFB)
  const ttfbValue = audits['server-response-time']?.numericValue || 0;
  if (ttfbValue > 600) {
    opportunities.push({
      type: 'ttfb',
      title: 'Initial server response time is slow (TTFB)',
      savingsText: `${(ttfbValue / 1000).toFixed(2)}s root document delay`,
      description: 'Server responded slowly. Keep server response time low.'
    });
  }

  // Default fallback bottleneck text
  const topBottleneck = opportunities.length > 0
    ? `${opportunities[0].title} (${opportunities[0].savingsText})`
    : (score >= 90 ? 'Optimized Performance (Passing Core Web Vitals)' : 'Asset Delivery & Script Execution');

  const secondBottleneck = opportunities.length > 1
    ? `${opportunities[1].title} (${opportunities[1].savingsText})`
    : null;

  let outreachPriority = 'Standard';
  let leadTier = 'Cold';
  if (score < 50) {
    outreachPriority = '🔥 High-Priority Lead';
    leadTier = 'Hot';
  } else if (score < 80) {
    outreachPriority = '⚡ Qualified Lead';
    leadTier = 'Warm';
  } else {
    outreachPriority = '✓ Optimized (Pass)';
    leadTier = 'Low';
  }

  let estimatedBounceIncrease = '+0%';
  if (lcpSeconds > 6) estimatedBounceIncrease = '+106%';
  else if (lcpSeconds > 4.5) estimatedBounceIncrease = '+74%';
  else if (lcpSeconds > 3) estimatedBounceIncrease = '+32%';

  return {
    strategy,
    score,
    scoreCategory: score < 50 ? 'poor' : score < 90 ? 'average' : 'good',
    metrics: {
      lcp: {
        value: lcpSeconds,
        display: lcpDisplay,
        status: lcpSeconds > 4 ? 'slow' : lcpSeconds > 2.5 ? 'avg' : 'fast'
      },
      fcp: {
        value: fcpSeconds,
        display: fcpDisplay,
        status: fcpSeconds > 3 ? 'slow' : fcpSeconds > 1.8 ? 'avg' : 'fast'
      },
      tbt: {
        value: tbtMs,
        display: tbtDisplay,
        status: tbtMs > 600 ? 'slow' : tbtMs > 200 ? 'avg' : 'fast'
      },
      cls: {
        value: clsScore,
        display: clsDisplay,
        status: clsScore > 0.25 ? 'slow' : clsScore > 0.1 ? 'avg' : 'fast'
      },
      speedIndex: {
        value: speedIndexSeconds,
        display: speedIndexDisplay,
        status: speedIndexSeconds > 5.8 ? 'slow' : speedIndexSeconds > 3.4 ? 'avg' : 'fast'
      }
    },
    opportunities,
    topBottleneck,
    secondBottleneck,
    outreachPriority,
    leadTier,
    estimatedBounceIncrease,
    auditDurationMs: durationMs
  };
}
