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
        subject: `Quick note regarding ${domain}'s mobile load time`,
        body: `Hi ${firstName},

I was looking at ${domain} on my phone and noticed the homepage is taking about ${lcp} to fully display on mobile. Google's official PageSpeed diagnostic currently scores the site at ${score}/100.

When mobile load times exceed 3 seconds, over half of visitors click back and head to a competitor instead. The primary culprit slowing down the page is ${bottleneck}.

I recorded a quick 90-second video walkthrough showing where the delay is coming from and how to get your mobile score into the 90+ green zone without changing your website's layout.

Mind if I send the video link over?

Best,
[Your Name]`,
        snippet: `noticed ${domain}'s mobile speed score is currently ${score}/100 (LCP taking ${lcp}), largely due to ${bottleneck}`
      };

    case 'local_seo':
      return {
        subject: `Google search visibility for ${company}${citySubject}`,
        body: `Hi ${firstName},

I was researching top-rated businesses in your space${citySnippet} and noticed ${company} is currently missing out on top rankings for high-intent local searches.

Right now, a low Domain Rating (${drDisplay}) combined with a mobile speed score of ${score}/100 is signaling to Google to push nearby competitors ahead of ${domain} on both Google Maps and organic search results.

Every week, dozens of local customers ready to book are landing on your competitors' pages instead because their sites have stronger local authority signals.

I put together a quick 90-second video showing the exact searches in your market you're currently missing and 3 quick steps to fix it.

Would you be open to taking a look?

Best,
[Your Name]`,
        snippet: `noticed ${company} has strong potential but current ${drDisplay} and ${score}/100 mobile speed is holding back local Google visibility`
      };

    case 'link_building':
      return {
        subject: `Authority gap holding back ${domain}'s Google rankings`,
        body: `Hi ${firstName},

I was analyzing search rankings in your industry and noticed something interesting regarding ${domain}:

Your website content and presentation are strong, but Ahrefs currently measures your Domain Rating at ${drDisplay}. The competitors outranking you for your most valuable buyer keywords average significantly higher authority scores.

Because reputable industry publications and media sites aren't actively referencing and citing ${company}, Google hesitates to keep you at the top of page 1.

I mapped out the exact 5 high-authority industry platforms currently sending authority to your top competitors (and how ${company} can get featured on them).

Do you mind if I send over the 90-second breakdown video?

Best,
[Your Name]`,
        snippet: `identified that ${domain}'s current ${drDisplay} authority gap is preventing top page 1 rankings`
      };

    case 'ecommerce_seo':
      return {
        subject: `Quick conversion note for ${domain}`,
        body: `Hi ${firstName},

I was browsing ${domain} and noticed that your mobile product and collection pages are taking about ${lcp} to load (Google mobile score: ${score}/100).

In e-commerce, every 1-second delay in page load drops conversion rates by up to 7%. Right now, ${bottleneck} is causing shoppers to abandon their carts and buy from faster competitors instead.

I recorded a short 90-second screen recording showing the 2 code bottlenecks causing the delay and how to fix them to boost store sales.

Can I share the video walkthrough with you?

Best,
[Your Name]`,
        snippet: `spotted that ${lcp} mobile load time (${score}/100 score) caused by ${bottleneck} is hurting ${domain}'s checkout conversions`
      };

    case 'technical_seo':
      return {
        subject: `Technical performance notice for ${domain}`,
        body: `Hi ${firstName},

While running a diagnostic audit on ${domain}, I noticed a technical performance bottleneck: your Total Blocking Time (TBT) is currently ${tbt} on mobile (Score: ${score}/100 Mobile${desktopScore !== null ? `, ${desktopScore}/100 Desktop` : ''}).

The main roadblock is ${bottleneck}. When scripts block the browser for this long, Googlebot struggles to crawl new pages efficiently, and mobile visitors experience lag when tapping buttons or menus.

I put together a 2-minute visual walkthrough showing the exact scripts causing the hold-up and how your developer can resolve it in under 48 hours.

Would it be alright if I sent the video over?

Best,
[Your Name]`,
        snippet: `technical audit flagged ${tbt} Total Blocking Time on ${domain} caused by ${bottleneck}`
      };

    case 'monthly_seo':
      return {
        subject: `Organic customer acquisition for ${company}`,
        body: `Hi ${firstName},

Most businesses treat SEO like an occasional task, but the fastest-growing companies in your space use Google as their most profitable client acquisition pipeline.

Right now, ${domain} has strong potential, but your current authority (${drDisplay}) and mobile performance (${score}/100) are allowing competing brands${citySnippet} to capture ready-to-buy customers every day.

We run a full-service monthly SEO system that handles everything—technical fixes, speed optimization, authority building, and content—to systematically take market share from competitors.

I recorded a 90-second custom growth roadmap showing where ${company} is currently losing traffic and the revenue potential of fixing it.

Mind if I send the video over for you to review?

Best,
[Your Name]`,
        snippet: `mapped out a growth roadmap for ${domain} (${score}/100 speed, ${drDisplay}) to capture search traffic currently going to competitors`
      };

    case 'ai_geo':
      return {
        subject: `Is ${company} being recommended by ChatGPT and Google AI?`,
        body: `Hi ${firstName},

A growing number of potential buyers in the ${category} space are now asking ChatGPT, Perplexity, and Google AI Overviews for recommendations instead of clicking traditional search links.

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
        subject: `Mobile speed bottleneck on ${domain}`,
        body: `Hi ${firstName},

Ran a quick speed audit on ${domain}—mobile score is currently ${score}/100 with ${lcp} load time due to ${bottleneck}.

This typically inflates bounce rate by ~50%+ on mobile traffic, pushing potential clients to competitors.

Made a short 90-second video showing how to fix it in under 24 hours without redesigning the site—should I send the link over?

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
