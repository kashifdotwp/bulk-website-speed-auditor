/**
 * Cold Outreach Pitch Generator & Snippet Synthesizer
 * Formatted for Mailmeteor, Apollo, Instantly, and Gmail cold outreach
 */

export const OUTREACH_ANGLES = [
  {
    id: 'conversion_risk',
    name: '🎯 Conversion & Bounce Rate Risk',
    badge: 'Highest Reply Rate',
    description: 'Focuses on lost customers, mobile bounce rate, and revenue leakage caused by slow LCP.'
  },
  {
    id: 'seo_penalty',
    name: '📈 Core Web Vitals & SEO Penalty',
    badge: 'Best for Agencies / SEO',
    description: 'Highlights Google’s mobile-first indexing penalties and search ranking suppression.'
  },
  {
    id: 'quick_fix',
    name: '⚡ Quick-Fix / Low-Hanging Fruit',
    badge: 'Easiest Yes',
    description: 'Shows exact asset savings (e.g. 2.4MB images) that can be fixed in 24 hours without redesign.'
  },
  {
    id: 'founder_short',
    name: '📱 3-Line Executive Founder Pitch',
    badge: 'Mobile-Optimized',
    description: 'Ultra-concise 3-line pitch designed for busy CEOs and founders scanning on mobile.'
  }
];

/**
 * Generates a clean personalized pitch string given audit data and lead context
 */
export function generatePitch(item, angleId = 'conversion_risk', leadData = {}) {
  const firstName = leadData.first_name || leadData.firstName || leadData.First_Name || 'there';
  const company = leadData.company || leadData.company_name || leadData.Company || item.domain || 'your company';
  const city = leadData.city || leadData.City || '';
  const domain = item.domain || 'your website';
  const score = item.score ?? 35;
  const lcp = item.metrics?.lcp?.display || '4.8 s';
  const bottleneck = item.topBottleneck || 'uncompressed assets and render-blocking scripts';
  const bounce = item.estimatedBounceIncrease || '+74%';

  const citySnippet = city ? ` in ${city}` : '';

  switch (angleId) {
    case 'conversion_risk':
      return {
        subject: `Quick question regarding ${domain}'s mobile load speed${citySnippet}`,
        body: `Hey ${firstName},

I was looking at ${domain} earlier and noticed something that might be costing you leads.

I ran a quick Google PageSpeed diagnostic on your mobile site—it currently scores ${score}/100 with a Largest Contentful Paint (LCP) of ${lcp}. Google's mobile benchmark shows page delays like this cause an estimated ${bounce} surge in visitor bounce rates before prospective clients even see your offer.

The main bottleneck appears to be ${bottleneck}.

I put together a quick 90-second Loom recording showing the 2 specific code fixes to get your mobile score into the 90+ green zone. 

Would you be open to taking a look?

Best,
[Your Name]
[Your Title / Agency]`,
        snippet: `noticed ${domain}'s mobile speed score is currently ${score}/100 (LCP taking ${lcp}), largely due to ${bottleneck}`
      };

    case 'seo_penalty':
      return {
        subject: `Core Web Vitals diagnostic for ${domain}`,
        body: `Hey ${firstName},

Reaching out because Google's latest algorithm update is actively penalizing sites failing Core Web Vitals, and ${company}'s mobile site is currently flagged at ${score}/100.

Your mobile page is taking ${lcp} to render the main content, triggered primarily by ${bottleneck}. 

When mobile speed is under 50, Google significantly suppresses organic visibility and Maps rankings against faster local competitors.

We recently helped a similar brand optimize their mobile score from 38 to 94 in under 48 hours without changing their visual layout.

Mind if I send over the step-by-step audit showing how to resolve this?

Cheers,
[Your Name]`,
        snippet: `Google PageSpeed flagged ${domain}'s mobile performance at ${score}/100 with an LCP of ${lcp} caused by ${bottleneck}`
      };

    case 'quick_fix':
      return {
        subject: `Quick 24hr speed fix for ${domain}`,
        body: `Hey ${firstName},

Saw ${domain} and ran a fast diagnostic through Google's Lighthouse engine. 

Your mobile performance score is ${score}/100, but the great news is that ~80% of the delay comes down to one quick fix: ${bottleneck}.

You don't need a site redesign or new theme—just deferring these blocking assets and compressing the payload would drop your load time from ${lcp} to under 1.8s.

I already mapped out the exact files causing the bottleneck. Want me to send over the PDF checklist?

Best,
[Your Name]`,
        snippet: `identified that ${bottleneck} is holding ${domain}'s mobile speed back at ${score}/100`
      };

    case 'founder_short':
    default:
      return {
        subject: `Mobile speed bottleneck on ${domain}`,
        body: `Hey ${firstName},

Ran a quick speed audit on ${domain}—mobile score is at ${score}/100 with ${lcp} load time due to ${bottleneck}.

This typically inflates bounce rate by ${bounce} on mobile ad traffic and organic visits.

Made a short 2-minute video showing how to fix it in under 24 hours—should I send the link over?

Best,
[Your Name]`,
        snippet: `mobile score is currently ${score}/100 (${lcp} LCP) caused by ${bottleneck}`
      };
  }
}

/**
 * Builds dynamic Mailmeteor merge tag value for {{Hook_Speed_Snippet}}
 */
export function buildMailmeteorSnippet(item) {
  if (!item || !item.success) {
    return `noticed a couple of performance bottlenecks on your mobile site that could be hurting conversion`;
  }
  const score = item.score ?? 35;
  const lcp = item.metrics?.lcp?.display || '4.5s';
  const bottleneck = item.topBottleneck || 'heavy uncompressed assets';
  
  if (score < 50) {
    return `noticed your mobile score is currently at ${score}/100 with a ${lcp} load time, primarily slowed down by ${bottleneck}`;
  } else if (score < 80) {
    return `noticed your mobile speed score is ${score}/100, where ${bottleneck} is adding unnecessary delay`;
  }
  return `audited your site speed (${score}/100) and spotted a couple of minor Core Web Vitals quick-wins`;
}
