/**
 * Realistic Mock Leads and Pre-Audited Datasets for Instant Demo & Testing
 */

export const MOCK_AUDIT_LEADS = [
  {
    id: 'lead_demo_1',
    success: true,
    url: 'https://austindentalstudio.com',
    domain: 'austindentalstudio.com',
    strategy: 'mobile',
    score: 28,
    scoreCategory: 'poor',
    metrics: {
      lcp: { value: 6.4, display: '6.4 s', status: 'slow' },
      fcp: { value: 3.2, display: '3.2 s', status: 'slow' },
      tbt: { value: 890, display: '890 ms', status: 'slow' },
      cls: { value: 0.28, display: '0.280', status: 'slow' },
      speedIndex: { value: 5.9, display: '5.9 s' }
    },
    opportunities: [
      {
        type: 'images',
        title: 'Uncompressed Hero Banner Images',
        savingsText: '~3.4 MB savings',
        timeSavingsMs: 2400,
        description: 'Large PNG hero sliders uploaded without compression or WebP conversion.'
      },
      {
        type: 'render_blocking',
        title: 'Render-Blocking Font & Style Sheets',
        savingsText: '~1.6s delay',
        timeSavingsMs: 1600,
        description: '5 external Google Fonts stylesheets loaded synchronously in the head tag.'
      }
    ],
    topBottleneck: 'Uncompressed Hero Banner Images (~3.4 MB savings)',
    secondBottleneck: 'Render-Blocking Font & Style Sheets (~1.6s delay)',
    outreachPriority: '🔥 High-Priority Lead',
    leadTier: 'Hot',
    estimatedBounceIncrease: '+106%',
    auditDurationMs: 9400,
    auditedAt: new Date(Date.now() - 3600000).toISOString(),
    originalData: {
      first_name: 'Dr. Marcus',
      company: 'Austin Dental Studio',
      city: 'Austin, TX',
      email: 'marcus@austindentalstudio.com',
      industry: 'Healthcare / Dental'
    }
  },
  {
    id: 'lead_demo_2',
    success: true,
    url: 'https://chicagoprimeroofing.com',
    domain: 'chicagoprimeroofing.com',
    strategy: 'mobile',
    score: 34,
    scoreCategory: 'poor',
    metrics: {
      lcp: { value: 5.2, display: '5.2 s', status: 'slow' },
      fcp: { value: 2.8, display: '2.8 s', status: 'slow' },
      tbt: { value: 640, display: '640 ms', status: 'slow' },
      cls: { value: 0.19, display: '0.190', status: 'avg' },
      speedIndex: { value: 4.8, display: '4.8 s' }
    },
    opportunities: [
      {
        type: 'render_blocking',
        title: 'Render-Blocking jQuery & Slider Scripts',
        savingsText: '~1.8s delay',
        timeSavingsMs: 1800,
        description: 'Outdated Revolution Slider and jQuery scripts executed before DOM content.'
      },
      {
        type: 'images',
        title: 'Oversized Project Portfolio Photos',
        savingsText: '~2.8 MB savings',
        timeSavingsMs: 1400,
        description: '4K camera photos embedded in gallery without thumbnail generation.'
      }
    ],
    topBottleneck: 'Render-Blocking jQuery & Slider Scripts (~1.8s delay)',
    secondBottleneck: 'Oversized Project Portfolio Photos (~2.8 MB savings)',
    outreachPriority: '🔥 High-Priority Lead',
    leadTier: 'Hot',
    estimatedBounceIncrease: '+74%',
    auditDurationMs: 8200,
    auditedAt: new Date(Date.now() - 7200000).toISOString(),
    originalData: {
      first_name: 'David',
      company: 'Chicago Prime Roofing',
      city: 'Chicago, IL',
      email: 'david@chicagoprimeroofing.com',
      industry: 'Roofing & Construction'
    }
  },
  {
    id: 'lead_demo_3',
    success: true,
    url: 'https://londonaestheticclinic.co.uk',
    domain: 'londonaestheticclinic.co.uk',
    strategy: 'mobile',
    score: 22,
    scoreCategory: 'poor',
    metrics: {
      lcp: { value: 7.1, display: '7.1 s', status: 'slow' },
      fcp: { value: 3.9, display: '3.9 s', status: 'slow' },
      tbt: { value: 1120, display: '1,120 ms', status: 'slow' },
      cls: { value: 0.35, display: '0.350', status: 'slow' },
      speedIndex: { value: 6.8, display: '6.8 s' }
    },
    opportunities: [
      {
        type: 'unused_js',
        title: 'Heavy Third-Party Chat & Tracking Scripts',
        savingsText: '~1.2 MB unused JS',
        timeSavingsMs: 2900,
        description: 'Multiple tracking pixels, Hotjar, and live chat widgets loading on mobile landing.'
      },
      {
        type: 'images',
        title: 'Unoptimized Before & After Galleries',
        savingsText: '~4.1 MB savings',
        timeSavingsMs: 2200,
        description: 'Non-responsive image assets served to mobile viewport.'
      }
    ],
    topBottleneck: 'Heavy Third-Party Chat & Tracking Scripts (~1.2 MB unused JS)',
    secondBottleneck: 'Unoptimized Before & After Galleries (~4.1 MB savings)',
    outreachPriority: '🔥 High-Priority Lead',
    leadTier: 'Hot',
    estimatedBounceIncrease: '+106%',
    auditDurationMs: 11200,
    auditedAt: new Date(Date.now() - 14400000).toISOString(),
    originalData: {
      first_name: 'Dr. Sophia',
      company: 'London Aesthetic Clinic',
      city: 'London, UK',
      email: 'sophia.williams@londonaestheticclinic.co.uk',
      industry: 'Cosmetic Medicine'
    }
  },
  {
    id: 'lead_demo_4',
    success: true,
    url: 'https://dallashvacpros.net',
    domain: 'dallashvacpros.net',
    strategy: 'mobile',
    score: 41,
    scoreCategory: 'poor',
    metrics: {
      lcp: { value: 4.9, display: '4.9 s', status: 'slow' },
      fcp: { value: 2.4, display: '2.4 s', status: 'slow' },
      tbt: { value: 480, display: '480 ms', status: 'avg' },
      cls: { value: 0.12, display: '0.120', status: 'avg' },
      speedIndex: { value: 4.1, display: '4.1 s' }
    },
    opportunities: [
      {
        type: 'images',
        title: 'Uncompressed Service Badges & Stock Photos',
        savingsText: '~1.9 MB savings',
        timeSavingsMs: 1300,
        description: 'High-res stock imagery used in header and service grids.'
      },
      {
        type: 'ttfb',
        title: 'Slow Shared Server Response Time',
        savingsText: '1.2s initial response',
        timeSavingsMs: 900,
        description: 'Shared GoDaddy hosting causing TTFB latency.'
      }
    ],
    topBottleneck: 'Uncompressed Service Badges & Stock Photos (~1.9 MB savings)',
    secondBottleneck: 'Slow Shared Server Response Time (1.2s initial response)',
    outreachPriority: '🔥 High-Priority Lead',
    leadTier: 'Hot',
    estimatedBounceIncrease: '+74%',
    auditDurationMs: 7800,
    auditedAt: new Date(Date.now() - 18000000).toISOString(),
    originalData: {
      first_name: 'Brad',
      company: 'Dallas HVAC Pros',
      city: 'Dallas, TX',
      email: 'brad@dallashvacpros.net',
      industry: 'HVAC & Plumbing'
    }
  },
  {
    id: 'lead_demo_5',
    success: true,
    url: 'https://miamibeachboutique.shop',
    domain: 'miamibeachboutique.shop',
    strategy: 'mobile',
    score: 38,
    scoreCategory: 'poor',
    metrics: {
      lcp: { value: 5.6, display: '5.6 s', status: 'slow' },
      fcp: { value: 2.9, display: '2.9 s', status: 'slow' },
      tbt: { value: 920, display: '920 ms', status: 'slow' },
      cls: { value: 0.22, display: '0.220', status: 'avg' },
      speedIndex: { value: 5.3, display: '5.3 s' }
    },
    opportunities: [
      {
        type: 'unused_js',
        title: 'Shopify App Bloat & Abandoned Cart Scripts',
        savingsText: '~850 KB unused JS',
        timeSavingsMs: 2100,
        description: '7 inactive Shopify app script tags still loading on theme.liquid.'
      }
    ],
    topBottleneck: 'Shopify App Bloat & Abandoned Cart Scripts (~850 KB unused JS)',
    secondBottleneck: null,
    outreachPriority: '🔥 High-Priority Lead',
    leadTier: 'Hot',
    estimatedBounceIncrease: '+74%',
    auditDurationMs: 8900,
    auditedAt: new Date(Date.now() - 25000000).toISOString(),
    originalData: {
      first_name: 'Elena',
      company: 'Miami Beach Boutique',
      city: 'Miami, FL',
      email: 'elena@miamibeachboutique.shop',
      industry: 'E-Commerce Fashion'
    }
  },
  {
    id: 'lead_demo_6',
    success: true,
    url: 'https://manhattanlegalfirm.com',
    domain: 'manhattanlegalfirm.com',
    strategy: 'mobile',
    score: 64,
    scoreCategory: 'average',
    metrics: {
      lcp: { value: 3.4, display: '3.4 s', status: 'avg' },
      fcp: { value: 1.7, display: '1.7 s', status: 'fast' },
      tbt: { value: 280, display: '280 ms', status: 'avg' },
      cls: { value: 0.04, display: '0.040', status: 'fast' },
      speedIndex: { value: 3.1, display: '3.1 s' }
    },
    opportunities: [
      {
        type: 'render_blocking',
        title: 'Unminified Custom CSS Stylesheet',
        savingsText: '~450ms delay',
        timeSavingsMs: 450,
        description: 'Minifying and inlining critical CSS will push score past 85.'
      }
    ],
    topBottleneck: 'Unminified Custom CSS Stylesheet (~450ms delay)',
    secondBottleneck: null,
    outreachPriority: '⚡ Qualified Lead',
    leadTier: 'Warm',
    estimatedBounceIncrease: '+32%',
    auditDurationMs: 6400,
    auditedAt: new Date(Date.now() - 32000000).toISOString(),
    originalData: {
      first_name: 'Jonathan',
      company: 'Manhattan Legal Group',
      city: 'New York, NY',
      email: 'j.sterling@manhattanlegalfirm.com',
      industry: 'Legal Services'
    }
  },
  {
    id: 'lead_demo_7',
    success: true,
    url: 'https://seattleclouddev.io',
    domain: 'seattleclouddev.io',
    strategy: 'mobile',
    score: 93,
    scoreCategory: 'good',
    metrics: {
      lcp: { value: 1.4, display: '1.4 s', status: 'fast' },
      fcp: { value: 0.9, display: '0.9 s', status: 'fast' },
      tbt: { value: 40, display: '40 ms', status: 'fast' },
      cls: { value: 0.005, display: '0.005', status: 'fast' },
      speedIndex: { value: 1.2, display: '1.2 s' }
    },
    opportunities: [],
    topBottleneck: 'Minor asset delivery inefficiencies',
    secondBottleneck: null,
    outreachPriority: '✓ Optimized (Pass)',
    leadTier: 'Low',
    estimatedBounceIncrease: '+0%',
    auditDurationMs: 4100,
    auditedAt: new Date(Date.now() - 40000000).toISOString(),
    originalData: {
      first_name: 'Alex',
      company: 'Seattle Cloud Dev',
      city: 'Seattle, WA',
      email: 'alex@seattleclouddev.io',
      industry: 'Software / SaaS'
    }
  }
];
