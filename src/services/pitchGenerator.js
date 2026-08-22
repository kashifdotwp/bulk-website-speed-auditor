/**
 * High-Converting Cold Outreach Pitch Generator & Snippet Synthesizer
 * Formatted for Mailmeteor, Apollo, Instantly, Lemlist, and Gmail cold outreach
 * 100% row-data aligned with zero friction permission CTAs
 */

export const OUTREACH_ANGLES = [
  {
    id: 'speed_cwv',
    name: '⚡ Website Speed & Core Web Vitals',
    badge: 'Highest Reply Rate',
    description: 'Focuses on lost customers, mobile bounce rate, and revenue leakage caused by slow LCP and scripts.'
  },
  {
    id: 'local_seo',
    name: '📍 Local SEO & Google Maps',
    badge: 'Best for Local Businesses',
    description: 'Highlights local buyers in their city calling nearby competitors because of authority and speed gaps.'
  },
  {
    id: 'link_building',
    name: '🔗 Link Building & Ahrefs DR Authority',
    badge: 'Authority Gap Pitch',
    description: 'Highlights that low Domain Rating is preventing Google from ranking their great content on page 1.'
  },
  {
    id: 'ecommerce_seo',
    name: '🛒 E-Commerce SEO & Sales',
    badge: 'Best for DTC / Stores',
    description: 'Focuses on product/collection page lag driving cart abandonment and lost shopper conversions.'
  },
  {
    id: 'technical_seo',
    name: '⚙️ Technical SEO & Crawlability',
    badge: 'Code & Index Health',
    description: 'Identifies render-blocking scripts and high TBT blocking Googlebot crawl efficiency and user UX.'
  },
  {
    id: 'monthly_seo',
    name: '📈 Complete Monthly Managed SEO',
    badge: 'All-In-One Partner',
    description: 'Frames SEO as a hands-off, monthly revenue-generating acquisition pipeline that overtakes rivals.'
  },
  {
    id: 'ai_geo',
    name: '🤖 AI Search & GEO (ChatGPT / Google AI)',
    badge: 'Modern Search Angle',
    description: 'Optimizes entity authority so ChatGPT Search, Perplexity, and Google AI Overviews cite their brand.'
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
export function generatePitch(item = {}, angleId = 'speed_cwv', leadData = {}) {
  const firstName = leadData.first_name || leadData.firstName || leadData.First_Name || 'there';
  const company = item.originalData?.company || leadData.company || leadData.company_name || item.domain || 'your company';
  const domain = item.domain || item.url || 'your website';
  const city = item.originalData?.city || leadData.city || leadData.City || '';
  
  const score = item.mobile?.score ?? item.score ?? 35;
  const desktopScore = item.desktop?.score ?? item.desktopScore ?? null;
  const lcp = item.metrics?.lcp?.display || item.mobile?.cwv?.lcp?.displayValue || '4.8s';
  const tbt = item.metrics?.tbt?.display || item.mobile?.cwv?.tbt?.displayValue || '500ms';
  const bottleneck = item.topBottleneck || 'render-blocking scripts and uncompressed assets';
  const category = item.category || item.originalData?.industry || 'your industry';

  // Format DR
  let drDisplay = 'low authority';
  const rawDr = item.ahrefsDr ?? item.originalData?.ahrefsDr ?? null;
  if (rawDr !== null && rawDr !== undefined && rawDr !== '') {
    drDisplay = String(rawDr).toUpperCase().startsWith('DR') ? String(rawDr) : `DR ${rawDr}`;
  }

  const citySnippet = city ? ` in ${city}` : '';
  const citySubject = city ? ` in ${city}` : '';

  switch (angleId) {
    case 'speed_cwv':
      return {
        subject: `Quick note regarding ${domain}'s loading speed`,
        body: `Hi ${firstName},

I was looking at ${domain} today and noticed a major loading delay on mobile that is likely handing your potential customers straight to your competitors.

I ran a quick speed test—right now, the site is scoring ${score}/100 on mobile${desktopScore !== null ? ` and ${desktopScore}/100 on desktop` : ''}.

When a site takes more than 3 seconds to open, most visitors assume it is broken and hit the back button before they even see your services.

If you are spending any money on marketing, SEO, or paid ads right now, a huge chunk of that budget is just bleeding out through abandoned clicks.

I found the exact bottleneck that is slowing everything down (${bottleneck}). I recorded a quick 2-minute video showing where the issue is and how to fix it without redesigning your website.

Mind if I send the link?

Best,
[Your Name]`,
        snippet: `noticed a major loading delay on ${domain} (${score}/100 mobile speed) caused by ${bottleneck}`
      };

    case 'local_seo':
      return {
        subject: `Quick question regarding ${company}'s Google visibility${citySubject}`,
        body: `Hi ${firstName},

I was researching top-rated businesses${citySnippet} and noticed ${company} is currently missing out on top rankings for high-intent local searches.

Right now, a low Domain Rating (${drDisplay}) combined with a mobile speed score of ${score}/100 is signaling to Google to push nearby competitors ahead of ${domain} on both Google Maps and search results.

When local searchers hit a page that takes more than 3 seconds to open, they click the back button and call the next competitor on the map. Potential clients are actively slipping straight into competitors' pockets.

I put together a quick 90-second video breakdown showing the exact local searches in your market you're currently missing and how to claim those top spots.

Would you be open to taking a look?

Best,
[Your Name]`,
        snippet: `noticed ${company} has strong potential but current ${drDisplay} and ${score}/100 mobile speed is holding back local Google visibility`
      };

    case 'link_building':
      return {
        subject: `Authority gap holding back ${domain}'s Google rankings`,
        body: `Hi ${firstName},

I was analyzing search rankings in your industry and noticed something holding ${domain} back from the top spots on Google:

Your website content and presentation look great, but Ahrefs currently measures your Domain Rating at ${drDisplay}. The competitors currently outranking you for your most valuable buyer keywords average significantly higher authority scores.

Because trusted industry publications and media sites aren't actively referencing and citing ${company}, Google hesitates to keep your pages at the top of page 1—meaning high-value customers are finding competitors first.

I mapped out the exact 5 high-authority industry platforms currently sending authority to your top competitors (and how we can get ${company} featured on them).

Mind if I send over the 2-minute video walkthrough?

Best,
[Your Name]`,
        snippet: `identified that ${domain}'s current ${drDisplay} authority gap is preventing top page 1 rankings`
      };

    case 'ecommerce_seo':
      return {
        subject: `Conversion & speed note for ${domain}`,
        body: `Hi ${firstName},

I was browsing ${domain} on my phone today and noticed a noticeable loading delay that is likely hurting your store's sales and conversion rate.

I ran a quick test—your store is currently scoring ${score}/100 on mobile${desktopScore !== null ? ` and ${desktopScore}/100 on desktop` : ''}. In e-commerce, when pages take more than 3 seconds to load, over 50% of mobile shoppers abandon their carts and buy from faster competitors instead.

If you are running any ads or SEO campaigns, that ad spend is bleeding out through abandoned visits. The primary bottleneck holding back your load speed is ${bottleneck}.

I recorded a short 2-minute video showing the 2 code bottlenecks slowing down your store and how to fix them to lift conversion rates.

Can I share the video link with you?

Best,
[Your Name]`,
        snippet: `noticed store pages taking over 3 seconds to load (${score}/100 score) caused by ${bottleneck}`
      };

    case 'technical_seo':
      return {
        subject: `Technical performance notice for ${domain}`,
        body: `Hi ${firstName},

While running a diagnostic audit on ${domain}, I noticed a technical performance bottleneck that is likely hurting your Google crawl health and visitor experience.

Right now, the site scores ${score}/100 on mobile${desktopScore !== null ? ` and ${desktopScore}/100 on desktop` : ''}, with Total Blocking Time measured at ${tbt}. The primary culprit is ${bottleneck}.

When code blocks the browser for this long, mobile visitors experience tap delays and assume the site is unresponsive, while Googlebot struggles to crawl and index your newest pages.

I recorded a quick 2-minute visual walkthrough showing the exact scripts causing the hold-up and how your developer can resolve it in under 48 hours.

Would it be alright if I sent the video link over?

Best,
[Your Name]`,
        snippet: `technical audit flagged ${tbt} Total Blocking Time on ${domain} caused by ${bottleneck}`
      };

    case 'monthly_seo':
      return {
        subject: `Organic customer acquisition for ${company}`,
        body: `Hi ${firstName},

Most businesses treat SEO like an occasional checklist, but the fastest-growing companies in your space use Google as their primary customer acquisition pipeline.

Right now, ${domain} has strong potential, but your current authority (${drDisplay}) and mobile performance (${score}/100) are allowing competing brands${citySnippet} to capture ready-to-buy customers every single day.

When potential clients search for your services and hit delays over 3 seconds, they click back and hand their business straight to your competitors.

We build hands-off, monthly SEO engines that fix technical bottlenecks, build real authority, and systematically take market share from competitors.

I recorded a 2-minute custom growth roadmap showing where ${company} is currently losing traffic and the revenue potential of fixing it.

Mind if I send the video over for you to review?

Best,
[Your Name]`,
        snippet: `mapped out a growth roadmap for ${domain} (${score}/100 speed, ${drDisplay}) to capture search traffic currently going to competitors`
      };

    case 'ai_geo':
      return {
        subject: `Is ${company} being recommended by ChatGPT and Google AI?`,
        body: `Hi ${firstName},

A rapidly growing number of buyers in the ${category} space are now asking ChatGPT, Perplexity, and Google AI Overviews for recommendations instead of clicking traditional search links.

When AI engines generate recommendations for your services, they prioritize websites with strong authority signals and clear entity citations. Right now, because ${domain}'s Domain Rating is ${drDisplay}, AI models are citing competing brands when buyers ask for recommendations.

We specialize in Generative Engine Optimization (GEO)—optimizing your brand entity so AI search engines cite and recommend ${company} as the top authority.

I recorded a 2-minute screen recording showing what AI models currently say when asked about your industry and how to get your brand recommended.

Can I share the video link with you?

Best,
[Your Name]`,
        snippet: `analyzed ${domain}'s AI search presence (${drDisplay} authority) and how ChatGPT and Google AI Overviews cite competitors`
      };

    case 'founder_short':
    default:
      return {
        subject: `Quick note regarding ${domain}'s loading speed`,
        body: `Hi ${firstName},

I was looking at ${domain} today and noticed a major loading delay on mobile (${score}/100 score) that is likely handing potential customers straight to your competitors.

When pages take more than 3 seconds to open, visitors assume it is broken and bounce before seeing your services. The main bottleneck is ${bottleneck}.

I recorded a quick 2-minute video showing where the issue is and how to fix it without redesigning your site. Mind if I send the link?

Best,
[Your Name]`,
        snippet: `noticed mobile load delay (${score}/100 score) on ${domain} caused by ${bottleneck}`
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
  const score = item.mobile?.score ?? item.score ?? 35;
  const bottleneck = item.topBottleneck || 'heavy uncompressed assets';
  
  if (score < 50) {
    return `noticed your site takes more than 3 seconds to open on mobile (${score}/100 score), primarily slowed down by ${bottleneck}`;
  } else if (score < 80) {
    return `noticed your mobile speed score is ${score}/100, where ${bottleneck} is adding unnecessary delay`;
  }
  return `audited your site speed (${score}/100) and spotted a couple of quick Core Web Vitals optimizations`;
}
