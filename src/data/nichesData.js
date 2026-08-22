/**
 * Master Cold Outreach Niches Database
 * 60+ Local Business Niches categorized by Client Value / Pay-Per-Call CPC
 * 35+ E-Commerce Niches categorized by AOV & Profit Margin
 */

export const LOCAL_BUSINESS_NICHES = [
  // ==================== HIGH-TICKET ($2,500 – $50,000+ per deal | CPC $40 – $150+) ====================
  {
    id: 'water_damage',
    name: 'Water Damage Restoration',
    category: 'Home Services & Emergency',
    ticketTier: 'high',
    avgJobValue: '$3,500 – $12,000',
    cpcRange: '$65 – $180',
    leadValue: '$150 – $400 / call',
    keywords: ['water damage restoration', 'emergency flood cleanup', 'sewage extraction', 'water mitigation services'],
    pitchHook: 'Emergency flood victims call the first 3 results on Google within 5 minutes—slow mobile sites lose $5,000+ jobs instantly.'
  },
  {
    id: 'roofing_replacement',
    name: 'Roofing Replacement & Repair',
    category: 'Construction & Remodeling',
    ticketTier: 'high',
    avgJobValue: '$7,500 – $22,000',
    cpcRange: '$45 – $120',
    leadValue: '$120 – $300 / call',
    keywords: ['roofing contractor', 'roof replacement', 'emergency roof repair', 'commercial roofing company'],
    pitchHook: 'Homeowners investing $10k+ on a new roof bounce from slow sites and call the highest-rated contractor on Google Maps.'
  },
  {
    id: 'mold_remediation',
    name: 'Mold Remediation & Removal',
    category: 'Home Services & Emergency',
    ticketTier: 'high',
    avgJobValue: '$2,500 – $8,000',
    cpcRange: '$50 – $130',
    leadValue: '$120 – $280 / call',
    keywords: ['mold remediation', 'black mold removal', 'toxic mold inspection', 'commercial mold cleanup'],
    pitchHook: 'Health-conscious homeowners want immediate credibility; poor mobile speed signals an unmaintained business.'
  },
  {
    id: 'foundation_repair',
    name: 'Foundation Repair & Waterproofing',
    category: 'Construction & Remodeling',
    ticketTier: 'high',
    avgJobValue: '$4,500 – $18,000',
    cpcRange: '$40 – $110',
    leadValue: '$100 – $250 / call',
    keywords: ['foundation repair', 'basement waterproofing', 'house leveling', 'crawl space encapsulation'],
    pitchHook: 'High-ticket structural repairs require top authority; competitors ranking #1 capture 60%+ of phone inquiries.'
  },
  {
    id: 'personal_injury',
    name: 'Personal Injury Law',
    category: 'Legal Services',
    ticketTier: 'high',
    avgJobValue: '$10,000 – $100,000+',
    cpcRange: '$120 – $400+',
    leadValue: '$300 – $1,000+ / call',
    keywords: ['personal injury lawyer', 'car accident attorney', 'slip and fall lawyer', 'truck accident attorney'],
    pitchHook: 'With Google CPCs over $150/click, a 3-second delay wastes thousands in ad budget through abandoned clicks.'
  },
  {
    id: 'criminal_defense',
    name: 'Criminal Defense Law',
    category: 'Legal Services',
    ticketTier: 'high',
    avgJobValue: '$3,500 – $25,000',
    cpcRange: '$75 – $200',
    leadValue: '$150 – $400 / call',
    keywords: ['criminal defense attorney', 'DUI lawyer', 'drug defense lawyer', 'federal criminal defense'],
    pitchHook: 'People searching in crisis call the immediate top result; high mobile bounce rate costs five-figure retainers.'
  },
  {
    id: 'medical_malpractice',
    name: 'Medical Malpractice Law',
    category: 'Legal Services',
    ticketTier: 'high',
    avgJobValue: '$25,000 – $250,000+',
    cpcRange: '$110 – $350',
    leadValue: '$250 – $800 / call',
    keywords: ['medical malpractice attorney', 'birth injury lawyer', 'surgical error attorney', 'hospital negligence law firm'],
    pitchHook: 'Massive case settlements require top-tier website authority and speed to convert selective high-value clients.'
  },
  {
    id: 'cosmetic_surgery',
    name: 'Cosmetic & Plastic Surgery',
    category: 'Healthcare & Aesthetics',
    ticketTier: 'high',
    avgJobValue: '$6,000 – $25,000',
    cpcRange: '$35 – $95',
    leadValue: '$100 – $350 / consultation',
    keywords: ['plastic surgeon', 'rhinoplasty surgeon', 'breast augmentation clinic', 'facelift specialist'],
    pitchHook: 'Patients paying $10k+ out-of-pocket demand a luxury digital experience; lagging pages send them to rival clinics.'
  },
  {
    id: 'dental_implants',
    name: 'Dental Implants & Orthodontics',
    category: 'Healthcare & Aesthetics',
    ticketTier: 'high',
    avgJobValue: '$3,000 – $30,000',
    cpcRange: '$30 – $85',
    leadValue: '$80 – $250 / consultation',
    keywords: ['dental implants', 'All on 4 dental implants', 'invisalign dentist', 'cosmetic dentistry clinic'],
    pitchHook: 'Patients comparing full-mouth reconstruction call the dental clinic with the fastest, clearest mobile booking flow.'
  },
  {
    id: 'solar_installation',
    name: 'Solar Panel Installation',
    category: 'Clean Energy & Home',
    ticketTier: 'high',
    avgJobValue: '$15,000 – $45,000',
    cpcRange: '$40 – $120',
    leadValue: '$100 – $300 / lead',
    keywords: ['solar panel installation', 'residential solar company', 'commercial solar installers', 'solar battery backup'],
    pitchHook: 'Solar buyers request quotes from the top 2 sites on Google; speed bottlenecks bleed paid search budgets.'
  },
  {
    id: 'hvac_replacement',
    name: 'HVAC Full System Replacement',
    category: 'Home Services & Climate',
    ticketTier: 'high',
    avgJobValue: '$6,500 – $18,000',
    cpcRange: '$35 – $95',
    leadValue: '$90 – $220 / call',
    keywords: ['hvac installation', 'new furnace cost', 'commercial ac replacement', 'heat pump installation'],
    pitchHook: 'When an AC breaks in peak summer, homeowners call the first fast-loading local company they find.'
  },
  {
    id: 'swimming_pool_construction',
    name: 'Inground Swimming Pool Construction',
    category: 'Luxury Home & Outdoor',
    ticketTier: 'high',
    avgJobValue: '$40,000 – $150,000+',
    cpcRange: '$30 – $80',
    leadValue: '$150 – $400 / inquiry',
    keywords: ['custom pool builder', 'inground pool contractor', 'gunite pool company', 'luxury backyard design'],
    pitchHook: 'High-net-worth homeowners won’t wait for laggy photo galleries; fast visual performance drives luxury contracts.'
  },
  {
    id: 'kitchen_bath_remodeling',
    name: 'Luxury Kitchen & Bath Remodeling',
    category: 'Construction & Remodeling',
    ticketTier: 'high',
    avgJobValue: '$20,000 – $85,000',
    cpcRange: '$25 – $65',
    leadValue: '$80 – $200 / inquiry',
    keywords: ['kitchen remodeling contractor', 'custom bathroom renovation', 'home remodeling company', 'cabinet refacing'],
    pitchHook: 'Remodeling clients compare portfolio visuals on mobile; uncompressed heavy images crush page load speed.'
  },
  {
    id: 'commercial_asbestos',
    name: 'Commercial Asbestos & Hazmat Abatement',
    category: 'Commercial Services',
    ticketTier: 'high',
    avgJobValue: '$5,000 – $50,000+',
    cpcRange: '$45 – $110',
    leadValue: '$120 – $350 / quote',
    keywords: ['asbestos removal contractor', 'commercial hazmat abatement', 'lead paint remediation', 'environmental cleanup company'],
    pitchHook: 'General contractors hiring abatement teams need instant compliance credibility and responsive contact portals.'
  },
  {
    id: 'commercial_paving',
    name: 'Commercial Asphalt Paving & Concrete',
    category: 'Commercial Services',
    ticketTier: 'high',
    avgJobValue: '$8,000 – $60,000',
    cpcRange: '$30 – $75',
    leadValue: '$100 – $250 / quote',
    keywords: ['commercial paving contractor', 'asphalt parking lot paving', 'concrete commercial paving', 'sealcoating company'],
    pitchHook: 'Property managers request 3 bids from Google search; poor mobile usability knocks companies off the bid list.'
  },
  {
    id: 'commercial_roofing',
    name: 'Commercial Flat Roofing',
    category: 'Commercial Services',
    ticketTier: 'high',
    avgJobValue: '$15,000 – $120,000+',
    cpcRange: '$55 – $140',
    leadValue: '$180 – $450 / lead',
    keywords: ['commercial flat roofing', 'TPO roofing contractor', 'industrial roof repair', 'commercial roof coating'],
    pitchHook: 'Building owners researching $50k+ roof repairs choose contractors with strong domain authority and fast technical UX.'
  },
  {
    id: 'private_investigation',
    name: 'Private Investigation & Corporate Security',
    category: 'Professional Services',
    ticketTier: 'high',
    avgJobValue: '$2,500 – $15,000',
    cpcRange: '$25 – $70',
    leadValue: '$80 – $200 / consultation',
    keywords: ['private investigator', 'corporate fraud investigation', 'infidelity investigator', 'asset search private detective'],
    pitchHook: 'Discreet, high-stakes clients demand immediate confidence and fast, secure contact mechanisms.'
  },
  {
    id: 'fertility_clinic',
    name: 'Fertility & IVF Clinics',
    category: 'Healthcare & Aesthetics',
    ticketTier: 'high',
    avgJobValue: '$12,000 – $35,000',
    cpcRange: '$35 – $90',
    leadValue: '$120 – $300 / consultation',
    keywords: ['fertility clinic', 'IVF doctor', 'egg freezing clinic', 'fertility specialist'],
    pitchHook: 'Emotional and high-investment healthcare decisions require pristine speed, zero errors, and authoritative search placement.'
  },

  // ==================== MEDIUM-TICKET ($500 – $2,500 per deal | CPC $15 – $45) ====================
  {
    id: 'plumbing_emergency',
    name: 'Emergency Plumbing & Drain Cleaning',
    category: 'Home Services & Emergency',
    ticketTier: 'medium',
    avgJobValue: '$450 – $2,200',
    cpcRange: '$28 – $75',
    leadValue: '$55 – $140 / call',
    keywords: ['emergency plumber', 'drain cleaning service', 'water heater repair', 'sewer line replacement'],
    pitchHook: 'Burst pipes require immediate action—if the site takes >3s to load, the homeowner calls the next plumber.'
  },
  {
    id: 'tree_service',
    name: 'Tree Removal & Arborist Services',
    category: 'Home Services & Outdoor',
    ticketTier: 'medium',
    avgJobValue: '$750 – $3,500',
    cpcRange: '$22 – $55',
    leadValue: '$45 – $120 / call',
    keywords: ['tree removal service', 'emergency tree service', 'tree trimming arborist', 'stump grinding company'],
    pitchHook: 'Storm damage creates sudden spikes in search demand; ranking in the local 3-pack captures the majority of calls.'
  },
  {
    id: 'electrician',
    name: 'Electrician & Electrical Panel Upgrade',
    category: 'Home Services & Electrical',
    ticketTier: 'medium',
    avgJobValue: '$500 – $2,800',
    cpcRange: '$20 – $60',
    leadValue: '$40 – $110 / call',
    keywords: ['licensed electrician', 'electrical panel upgrade', 'ev charger installation', 'emergency electrician'],
    pitchHook: 'Homeowners installing EV chargers or panel upgrades search locally and hire high-authority electricians.'
  },
  {
    id: 'garage_doors',
    name: 'Garage Door Repair & Installation',
    category: 'Home Services & Construction',
    ticketTier: 'medium',
    avgJobValue: '$400 – $2,200',
    cpcRange: '$22 – $65',
    leadValue: '$40 – $95 / call',
    keywords: ['garage door repair', 'broken garage door spring', 'garage door opener installation', 'new garage doors'],
    pitchHook: 'Trapped cars mean instant calls—a 3-second mobile lag loses the repair job to nearby rivals.'
  },
  {
    id: 'concrete_pavers',
    name: 'Concrete Driveways & Patio Pavers',
    category: 'Construction & Outdoor',
    ticketTier: 'medium',
    avgJobValue: '$3,000 – $12,000',
    cpcRange: '$18 – $48',
    leadValue: '$50 – $130 / lead',
    keywords: ['concrete driveway contractor', 'paver patio installer', 'stamped concrete company', 'driveway replacement'],
    pitchHook: 'Outdoor remodeling buyers want fast-loading photo portfolios and instant quote forms on mobile.'
  },
  {
    id: 'painting_contractor',
    name: 'Interior & Exterior House Painting',
    category: 'Home Improvement',
    ticketTier: 'medium',
    avgJobValue: '$2,000 – $7,500',
    cpcRange: '$18 – $42',
    leadValue: '$40 – $95 / estimate',
    keywords: ['house painter', 'interior painting contractor', 'exterior house painting', 'cabinet painting company'],
    pitchHook: 'High competition in local painting means speed and Google Maps reviews determine who gets the estimate call.'
  },
  {
    id: 'flooring_installation',
    name: 'Hardwood, Tile & Epoxy Flooring',
    category: 'Home Improvement',
    ticketTier: 'medium',
    avgJobValue: '$2,500 – $9,000',
    cpcRange: '$16 – $40',
    leadValue: '$35 – $85 / estimate',
    keywords: ['flooring installation', 'hardwood floor refinishing', 'epoxy garage floor installer', 'tile flooring contractor'],
    pitchHook: 'Homeowners researching floor estimates browse multiple sites; fast mobile responsiveness converts higher.'
  },
  {
    id: 'pest_control',
    name: 'Pest Control & Termite Extermination',
    category: 'Home Services & Climate',
    ticketTier: 'medium',
    avgJobValue: '$400 – $2,000',
    cpcRange: '$18 – $55',
    leadValue: '$35 – $80 / call',
    keywords: ['pest control service', 'termite inspection company', 'bed bug exterminator', 'rodent control near me'],
    pitchHook: 'Termite and bed bug infestations cause immediate urgency; top 3 Google Maps placement wins the customer.'
  },
  {
    id: 'locksmith_emergency',
    name: 'Automotive & Commercial Locksmith',
    category: 'Emergency Services',
    ticketTier: 'medium',
    avgJobValue: '$150 – $750',
    cpcRange: '$22 – $65',
    leadValue: '$30 – $75 / call',
    keywords: ['emergency locksmith', 'car lockout service', 'commercial lock rekey', 'key fob replacement'],
    pitchHook: 'Lockout clients tap the first clickable phone number on mobile; delays over 2s forfeit the immediate job.'
  },
  {
    id: 'auto_body_collision',
    name: 'Auto Body & Collision Repair',
    category: 'Automotive Services',
    ticketTier: 'medium',
    avgJobValue: '$1,500 – $6,000',
    cpcRange: '$15 – $38',
    leadValue: '$45 – $110 / inquiry',
    keywords: ['auto body shop', 'collision repair center', 'car paint repair', 'bumper repair shop'],
    pitchHook: 'Accident victims search right after a crash; clear mobile insurance claims instructions win the repair work.'
  },
  {
    id: 'auto_tint_detailing',
    name: 'Car Window Tinting & Ceramic Coating',
    category: 'Automotive Services',
    ticketTier: 'medium',
    avgJobValue: '$350 – $2,200',
    cpcRange: '$10 – $28',
    leadValue: '$25 – $65 / booking',
    keywords: ['ceramic coating car', 'window tinting near me', 'paint protection film installer', 'auto detailing studio'],
    pitchHook: 'Car enthusiasts booking $1k+ ceramic coatings expect a sleek, ultra-fast website reflecting craftsmanship.'
  },
  {
    id: 'chiropractor',
    name: 'Chiropractic & Spine Clinics',
    category: 'Healthcare & Wellness',
    ticketTier: 'medium',
    avgJobValue: '$600 – $2,500 / year',
    cpcRange: '$12 – $32',
    leadValue: '$30 – $75 / patient',
    keywords: ['chiropractor near me', 'sciatica treatment clinic', 'neck pain relief chiropractor', 'car accident chiropractor'],
    pitchHook: 'Patients with acute pain want seamless 1-click booking without friction or mobile layout shift.'
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy & Sports Rehab',
    category: 'Healthcare & Wellness',
    ticketTier: 'medium',
    avgJobValue: '$800 – $3,000 / program',
    cpcRange: '$14 – $35',
    leadValue: '$35 – $80 / patient',
    keywords: ['physiotherapy clinic', 'sports physical therapy', 'post surgery rehab clinic', 'knee pain physical therapist'],
    pitchHook: 'Athletes and injured patients book with clinics that provide instant mobile therapist bios and booking.'
  },
  {
    id: 'audiologist_hearing',
    name: 'Hearing Aid & Audiology Clinics',
    category: 'Healthcare & Wellness',
    ticketTier: 'medium',
    avgJobValue: '$2,000 – $6,500',
    cpcRange: '$20 – $55',
    leadValue: '$60 – $150 / consultation',
    keywords: ['hearing aid clinic', 'audiologist near me', 'hearing test appointment', 'tinnitus treatment specialist'],
    pitchHook: 'Older demographics require clear typography, fast load times, and simple phone contact buttons.'
  },
  {
    id: 'estate_planning_law',
    name: 'Estate Planning & Probate Law',
    category: 'Legal Services',
    ticketTier: 'medium',
    avgJobValue: '$2,000 – $7,500',
    cpcRange: '$25 – $65',
    leadValue: '$60 – $140 / consultation',
    keywords: ['estate planning attorney', 'probate lawyer', 'living trust attorney', 'will and trust lawyer'],
    pitchHook: 'Families researching wills and trusts compare 2-3 local attorneys; authority and site speed seal the consultation.'
  },
  {
    id: 'cpa_accounting',
    name: 'Tax Planning & Business CPA',
    category: 'Financial & Business',
    ticketTier: 'medium',
    avgJobValue: '$1,500 – $8,000 / year',
    cpcRange: '$18 – $50',
    leadValue: '$50 – $120 / client',
    keywords: ['small business cpa', 'tax planning accountant', 'corporate tax accountant', 'bookkeeping service company'],
    pitchHook: 'Business owners looking for tax savings demand modern, secure client portals and responsive websites.'
  },

  // ==================== LOW-TICKET / HIGH-FREQUENCY ($100 – $500 per job | CPC $5 – $18) ====================
  {
    id: 'house_cleaning',
    name: 'Residential House Cleaning & Maids',
    category: 'Home Services & Recurring',
    ticketTier: 'low',
    avgJobValue: '$150 – $350 / visit',
    cpcRange: '$8 – $22',
    leadValue: '$20 – $50 / booking',
    keywords: ['house cleaning service', 'maid service near me', 'deep home cleaning company', 'move out cleaning service'],
    pitchHook: 'Recurring monthly clients are won by the cleanest, fastest mobile online booking calculator.'
  },
  {
    id: 'lawn_care',
    name: 'Lawn Care & Landscaping Maintenance',
    category: 'Home Services & Recurring',
    ticketTier: 'low',
    avgJobValue: '$120 – $400 / month',
    cpcRange: '$6 – $18',
    leadValue: '$18 – $40 / quote',
    keywords: ['lawn care service', 'landscaping company near me', 'lawn mowing contractor', 'yard cleanup service'],
    pitchHook: 'Neighborhood homeowners look for local contractors in spring; fast mobile contact forms win seasonal contracts.'
  },
  {
    id: 'pressure_washing',
    name: 'Pressure Washing & Gutter Cleaning',
    category: 'Home Maintenance',
    ticketTier: 'low',
    avgJobValue: '$200 – $650',
    cpcRange: '$7 – $20',
    leadValue: '$20 – $45 / quote',
    keywords: ['pressure washing company', 'gutter cleaning service', 'driveway pressure washing', 'roof soft wash'],
    pitchHook: 'Quick visual before/after proof converts visitors if pages load instantly without layout delay.'
  },
  {
    id: 'mobile_detailing',
    name: 'Mobile Car Detailing',
    category: 'Automotive Services',
    ticketTier: 'low',
    avgJobValue: '$120 – $350',
    cpcRange: '$5 – $15',
    leadValue: '$15 – $35 / booking',
    keywords: ['mobile car detailing', 'mobile car wash near me', 'interior car detailing service', 'mobile auto spa'],
    pitchHook: 'Mobile searchers want same-day or weekend appointments—frictionless SMS/phone buttons win the booking.'
  },
  {
    id: 'junk_removal',
    name: 'Junk Removal & Hauling',
    category: 'Home Services & Moving',
    ticketTier: 'low',
    avgJobValue: '$180 – $750',
    cpcRange: '$12 – $32',
    leadValue: '$25 – $60 / call',
    keywords: ['junk removal service', 'furniture haul away', 'appliance removal company', 'garage cleanout service'],
    pitchHook: 'Customers clearing out homes call the top Google Maps listing with clear pricing and instant call buttons.'
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair Services',
    category: 'Home Services & Emergency',
    ticketTier: 'low',
    avgJobValue: '$150 – $450',
    cpcRange: '$14 – $35',
    leadValue: '$25 – $55 / call',
    keywords: ['refrigerator repair near me', 'washing machine repair', 'oven appliance repair', 'dryer repair technician'],
    pitchHook: 'A broken fridge or washer needs same-day repair; sluggish pages lose the customer in under 3 seconds.'
  },
  {
    id: 'carpet_cleaning',
    name: 'Carpet & Upholstery Cleaning',
    category: 'Home Services',
    ticketTier: 'low',
    avgJobValue: '$160 – $450',
    cpcRange: '$9 – $24',
    leadValue: '$20 – $45 / booking',
    keywords: ['carpet cleaning company', 'steam carpet cleaning', 'upholstery cleaning service', 'pet odor carpet cleaner'],
    pitchHook: 'Instant pricing calculators and transparent room pricing convert mobile traffic into booked jobs.'
  }
];

export const ECOMMERCE_NICHES = [
  // ==================== HIGH AOV / HIGH MARGIN ($300 – $3,000+ AOV | 40%–70% Margin) ====================
  {
    id: 'luxury_furniture',
    name: 'Luxury Ergonomic & Custom Furniture',
    ticketTier: 'high',
    avgAov: '$650 – $3,500',
    profitMargin: '45% – 70%',
    conversionImpact: 'High',
    keywords: ['ergonomic office chair', 'custom standing desk', 'luxury sectional sofa', 'solid wood dining table'],
    pitchHook: 'Shoppers spending $1k+ on furniture demand instant 3D model loads and rapid high-res image rendering.'
  },
  {
    id: 'high_end_audio',
    name: 'High-End Home Audio & HiFi',
    ticketTier: 'high',
    avgAov: '$450 – $2,800',
    profitMargin: '40% – 60%',
    conversionImpact: 'High',
    keywords: ['audiophile headphones', 'tube amplifier hifi', 'wireless bookshelf speakers', 'home theater sound system'],
    pitchHook: 'Tech-savvy audiophiles bounce from bloated Shopify stores; 1-second delay kills premium checkout rates.'
  },
  {
    id: 'fine_jewelry',
    name: 'Custom Fine Jewelry & Lab Diamonds',
    ticketTier: 'high',
    avgAov: '$800 – $5,000+',
    profitMargin: '50% – 75%',
    conversionImpact: 'High',
    keywords: ['lab grown diamond ring', 'custom engagement rings', 'solid gold jewelry', 'fine gemstone necklace'],
    pitchHook: 'Trust is paramount for 4-figure jewelry transactions—slow, glitchy collection pages destroy buyer confidence.'
  },
  {
    id: 'commercial_gym_gear',
    name: 'Home Gym Equipment & Squat Racks',
    ticketTier: 'high',
    avgAov: '$500 – $3,200',
    profitMargin: '35% – 55%',
    conversionImpact: 'High',
    keywords: ['commercial power rack', 'adjustable dumbbells set', 'olympic barbell weight plates', 'cardio rowing machine'],
    pitchHook: 'High-intent fitness enthusiasts comparing equipment specs bounce when product page JavaScript lags.'
  },
  {
    id: 'saunas_cold_plunges',
    name: 'Infrared Saunas & Cold Plunge Tubs',
    ticketTier: 'high',
    avgAov: '$1,200 – $6,500',
    profitMargin: '45% – 65%',
    conversionImpact: 'High',
    keywords: ['infrared home sauna', 'commercial cold plunge tub', 'outdoor barrel sauna', 'ice bath chiller unit'],
    pitchHook: 'Rapidly trending wellness niche where top organic search placement captures $3k+ orders without ad spend.'
  },
  {
    id: 'electric_bikes',
    name: 'Electric Bikes & Commuter Scooters',
    ticketTier: 'high',
    avgAov: '$900 – $3,500',
    profitMargin: '35% – 50%',
    conversionImpact: 'High',
    keywords: ['fat tire electric bike', 'long range commuter ebike', 'electric folding scooter', 'cargo ebike family'],
    pitchHook: 'Heavy video and 360-degree review widgets slow collection pages, inflating bounce rates on mobile ad campaigns.'
  },
  {
    id: 'espresso_machines',
    name: 'Specialty Espresso Machines & Grinders',
    ticketTier: 'high',
    avgAov: '$450 – $2,400',
    profitMargin: '35% – 55%',
    conversionImpact: 'High',
    keywords: ['dual boiler espresso machine', 'precision coffee grinder', 'prosumer espresso maker', 'manual lever espresso'],
    pitchHook: 'Specialty coffee hobbyists obsess over specs; fast category navigation directly drives higher checkout conversion.'
  },
  {
    id: 'leather_goods',
    name: 'Full-Grain Leather Bags & Luggage',
    ticketTier: 'high',
    avgAov: '$250 – $950',
    profitMargin: '55% – 75%',
    conversionImpact: 'High',
    keywords: ['full grain leather briefcase', 'leather travel duffle bag', 'handmade leather backpack', 'luxury leather wallet'],
    pitchHook: 'Heritage aesthetic requires crisp mobile typography and rapid high-resolution product zooms.'
  },

  // ==================== MEDIUM AOV ($75 – $300 AOV | 30%–55% Margin) ====================
  {
    id: 'supplements_nootropics',
    name: 'Nootropics & Clean Supplements',
    ticketTier: 'medium',
    avgAov: '$75 – $190',
    profitMargin: '50% – 75%',
    conversionImpact: 'Critical',
    keywords: ['nootropic brain supplement', 'organic mushroom powder', 'electrolyte hydration mix', 'grass fed whey protein'],
    pitchHook: 'Heavy paid ad traffic from Meta/TikTok bleeds budget if mobile landing pages score under 50 on Google PSI.'
  },
  {
    id: 'clean_skincare',
    name: 'Organic Skincare & Clean Cosmetics',
    ticketTier: 'medium',
    avgAov: '$65 – $170',
    profitMargin: '60% – 80%',
    conversionImpact: 'Critical',
    keywords: ['clean facial serum', 'mineral spf sunscreen', 'organic anti aging cream', 'retinol alternative botanical'],
    pitchHook: 'Beauty shoppers compare ingredients quickly; layout shifts and slow script rendering kill subscription signups.'
  },
  {
    id: 'performance_activewear',
    name: 'Performance Activewear & Gym Apparel',
    ticketTier: 'medium',
    avgAov: '$80 – $220',
    profitMargin: '50% – 70%',
    conversionImpact: 'Critical',
    keywords: ['seamless compression leggings', 'gym workout shorts men', 'moisture wicking training hoodie', 'athleisure joggers'],
    pitchHook: 'Fast sizing selectors and instant color-swatch switching prevent drop-offs on high-traffic product pages.'
  },
  {
    id: 'specialty_pet_nutrition',
    name: 'Raw & Freeze-Dried Pet Nutrition',
    ticketTier: 'medium',
    avgAov: '$70 – $210 / month',
    profitMargin: '40% – 60%',
    conversionImpact: 'Medium',
    keywords: ['freeze dried raw dog food', 'grain free organic cat food', 'orthopedic dog bed memory foam', 'pet joint supplement'],
    pitchHook: 'Pet parents ordering high-ticket monthly subscriptions demand fast, seamless checkout experiences.'
  },
  {
    id: 'outdoor_camping_gear',
    name: 'Ultralight Camping & Outdoor Gear',
    ticketTier: 'medium',
    avgAov: '$110 – $380',
    profitMargin: '40% – 60%',
    conversionImpact: 'Medium',
    keywords: ['ultralight backpacking tent', 'down sleeping bag 20 degree', 'titanium camping cookware', 'hiking backpack 50l'],
    pitchHook: 'Technical backpackers evaluate gear comparison tables; slow rendering drives them to REI or Amazon.'
  },
  {
    id: 'smart_home_devices',
    name: 'Smart Home Gadgets & Security',
    ticketTier: 'medium',
    avgAov: '$90 – $290',
    profitMargin: '35% – 55%',
    conversionImpact: 'Medium',
    keywords: ['smart video doorbell wireless', 'wifi mesh router system', 'smart air purifier hepa', 'automated smart blinds'],
    pitchHook: 'Tech buyers check page speed as an implicit trust indicator for whether the hardware itself is high quality.'
  },

  // ==================== VOLUME / LOW AOV ($25 – $75 AOV | 20%–45% Margin) ====================
  {
    id: 'phone_accessories',
    name: 'MagSafe Phone Cases & Wallets',
    ticketTier: 'low',
    avgAov: '$35 – $85',
    profitMargin: '50% – 75%',
    conversionImpact: 'Critical',
    keywords: ['magsafe leather phone case', 'minimalist card wallet phone', 'tempered glass screen protector', 'wireless charging dock'],
    pitchHook: 'Impulse purchase niche—every 500ms delay cuts impulse buying rates by double digits on social ad traffic.'
  },
  {
    id: 'candles_home_fragrance',
    name: 'Soy Scented Candles & Diffusers',
    ticketTier: 'low',
    avgAov: '$35 – $95',
    profitMargin: '60% – 80%',
    conversionImpact: 'Medium',
    keywords: ['hand poured soy candle', 'reed diffuser essential oil', 'luxury home fragrance candle', 'wooden wick scented candle'],
    pitchHook: 'Sensory branding needs instant visual load so imagery and scent descriptions capture the buyer immediately.'
  },
  {
    id: 'specialty_coffee_beans',
    name: 'Artisan Whole Bean Coffee Subscriptions',
    ticketTier: 'low',
    avgAov: '$30 – $75 / month',
    profitMargin: '45% – 65%',
    conversionImpact: 'Medium',
    keywords: ['single origin coffee beans', 'specialty coffee subscription', 'light roast ethiopian coffee', 'fresh roasted whole bean'],
    pitchHook: 'Subscription onboarding funnels must load in under 1.5s to maximize monthly recurring customer acquisition.'
  }
];
