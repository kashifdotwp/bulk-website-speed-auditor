/**
 * Complete Tier-1 Geography Database
 * Covers USA (50 States + DC), UK (Regions & Counties), Canada (10 Provinces + 3 Territories), Australia (6 States + 2 Territories)
 * Includes estimated recent population figures and top commercial target cities
 */

export const TIER1_GEOGRAPHY = {
  us: {
    countryName: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    totalPopulation: '335,000,000',
    marketTier: 'Tier 1 Mega Market',
    currency: 'USD ($)',
    states: [
      {
        name: 'California',
        code: 'CA',
        population: '38,965,000',
        topCities: [
          { name: 'Los Angeles', population: '3,820,000', tier: 'Major Metro' },
          { name: 'San Diego', population: '1,385,000', tier: 'Major Metro' },
          { name: 'San Jose', population: '970,000', tier: 'Tech Hub' },
          { name: 'San Francisco', population: '808,000', tier: 'Tech Hub' },
          { name: 'Fresno', population: '545,000', tier: 'Regional Hub' },
          { name: 'Sacramento', population: '525,000', tier: 'State Capital' },
          { name: 'Long Beach', population: '450,000', tier: 'Coastal Metro' },
          { name: 'Oakland', population: '430,000', tier: 'Bay Area' },
          { name: 'Bakersfield', population: '410,000', tier: 'Regional Hub' },
          { name: 'Anaheim', population: '345,000', tier: 'Orange County' }
        ]
      },
      {
        name: 'Texas',
        code: 'TX',
        population: '30,500,000',
        topCities: [
          { name: 'Houston', population: '2,305,000', tier: 'Major Metro' },
          { name: 'San Antonio', population: '1,495,000', tier: 'Major Metro' },
          { name: 'Dallas', population: '1,300,000', tier: 'Major Metro' },
          { name: 'Austin', population: '975,000', tier: 'Tech & Capital' },
          { name: 'Fort Worth', population: '960,000', tier: 'DFW Metro' },
          { name: 'El Paso', population: '678,000', tier: 'Border Metro' },
          { name: 'Arlington', population: '395,000', tier: 'DFW Metro' },
          { name: 'Plano', population: '288,000', tier: 'High Income Suburb' }
        ]
      },
      {
        name: 'Florida',
        code: 'FL',
        population: '22,610,000',
        topCities: [
          { name: 'Jacksonville', population: '971,000', tier: 'Major Metro' },
          { name: 'Miami', population: '450,000', tier: 'Mega Metro (6.2M Metro)' },
          { name: 'Tampa', population: '398,000', tier: 'Tampa Bay Metro' },
          { name: 'Orlando', population: '316,000', tier: 'Tourism & Tech' },
          { name: 'St. Petersburg', population: '260,000', tier: 'Tampa Bay' },
          { name: 'Fort Lauderdale', population: '183,000', tier: 'South FL Metro' },
          { name: 'Cape Coral', population: '216,000', tier: 'Booming Suburb' }
        ]
      },
      {
        name: 'New York',
        code: 'NY',
        population: '19,570,000',
        topCities: [
          { name: 'New York City', population: '8,260,000', tier: 'Financial Capital' },
          { name: 'Buffalo', population: '276,000', tier: 'Upstate Hub' },
          { name: 'Rochester', population: '210,000', tier: 'Upstate Metro' },
          { name: 'Yonkers', population: '208,000', tier: 'NYC Metro' },
          { name: 'Syracuse', population: '146,000', tier: 'Upstate Metro' },
          { name: 'Albany', population: '100,000', tier: 'State Capital' }
        ]
      },
      {
        name: 'Pennsylvania',
        code: 'PA',
        population: '12,970,000',
        topCities: [
          { name: 'Philadelphia', population: '1,567,000', tier: 'Major Metro' },
          { name: 'Pittsburgh', population: '302,000', tier: 'Tech & Healthcare' },
          { name: 'Allentown', population: '125,000', tier: 'Lehigh Valley' },
          { name: 'Erie', population: '94,000', tier: 'Great Lakes' },
          { name: 'Reading', population: '95,000', tier: 'Regional Hub' }
        ]
      },
      {
        name: 'Illinois',
        code: 'IL',
        population: '12,550,000',
        topCities: [
          { name: 'Chicago', population: '2,665,000', tier: 'Major Metro' },
          { name: 'Aurora', population: '178,000', tier: 'Chicago Suburb' },
          { name: 'Naperville', population: '150,000', tier: 'High Income Suburb' },
          { name: 'Rockford', population: '147,000', tier: 'Northern IL' },
          { name: 'Joliet', population: '150,000', tier: 'Logistics Hub' },
          { name: 'Springfield', population: '113,000', tier: 'State Capital' }
        ]
      },
      {
        name: 'Ohio',
        code: 'OH',
        population: '11,785,000',
        topCities: [
          { name: 'Columbus', population: '907,000', tier: 'Booming Capital' },
          { name: 'Cleveland', population: '368,000', tier: 'Major Metro' },
          { name: 'Cincinnati', population: '309,000', tier: 'Major Metro' },
          { name: 'Toledo', population: '268,000', tier: 'Manufacturing Hub' },
          { name: 'Akron', population: '189,000', tier: 'Northeast OH' }
        ]
      },
      {
        name: 'Georgia',
        code: 'GA',
        population: '11,030,000',
        topCities: [
          { name: 'Atlanta', population: '500,000', tier: 'Mega Metro (6.1M Metro)' },
          { name: 'Augusta', population: '202,000', tier: 'Medical & Cyber Hub' },
          { name: 'Columbus', population: '205,000', tier: 'Western GA' },
          { name: 'Macon', population: '157,000', tier: 'Central GA' },
          { name: 'Savannah', population: '148,000', tier: 'Coastal & Port' }
        ]
      },
      {
        name: 'North Carolina',
        code: 'NC',
        population: '10,835,000',
        topCities: [
          { name: 'Charlotte', population: '897,000', tier: 'Banking Capital' },
          { name: 'Raleigh', population: '475,000', tier: 'Research Triangle' },
          { name: 'Greensboro', population: '301,000', tier: 'Piedmont Triad' },
          { name: 'Durham', population: '290,000', tier: 'Research Triangle' },
          { name: 'Winston-Salem', population: '251,000', tier: 'Piedmont Triad' }
        ]
      },
      {
        name: 'Michigan',
        code: 'MI',
        population: '10,037,000',
        topCities: [
          { name: 'Detroit', population: '620,000', tier: 'Automotive Hub (4.3M Metro)' },
          { name: 'Grand Rapids', population: '197,000', tier: 'West Michigan Hub' },
          { name: 'Warren', population: '138,000', tier: 'Detroit Suburb' },
          { name: 'Sterling Heights', population: '133,000', tier: 'Detroit Suburb' },
          { name: 'Ann Arbor', population: '121,000', tier: 'University & Tech Hub' }
        ]
      },
      {
        name: 'New Jersey',
        code: 'NJ',
        population: '9,290,000',
        topCities: [
          { name: 'Newark', population: '307,000', tier: 'NYC Metro' },
          { name: 'Jersey City', population: '287,000', tier: 'Finance & NYC Hub' },
          { name: 'Paterson', population: '157,000', tier: 'North Jersey' },
          { name: 'Elizabeth', population: '135,000', tier: 'Port & Logistics' }
        ]
      },
      {
        name: 'Virginia',
        code: 'VA',
        population: '8,715,000',
        topCities: [
          { name: 'Virginia Beach', population: '455,000', tier: 'Coastal Metro' },
          { name: 'Chesapeake', population: '252,000', tier: 'Hampton Roads' },
          { name: 'Norfolk', population: '235,000', tier: 'Naval & Port Metro' },
          { name: 'Richmond', population: '227,000', tier: 'State Capital' },
          { name: 'Alexandria / Arlington', population: '390,000', tier: 'DC Metro (High Income)' }
        ]
      },
      {
        name: 'Washington',
        code: 'WA',
        population: '7,812,000',
        topCities: [
          { name: 'Seattle', population: '750,000', tier: 'Global Tech Hub (4.0M Metro)' },
          { name: 'Spokane', population: '230,000', tier: 'Eastern WA Hub' },
          { name: 'Tacoma', population: '220,000', tier: 'Puget Sound Metro' },
          { name: 'Vancouver', population: '193,000', tier: 'Portland Metro' },
          { name: 'Bellevue', population: '152,000', tier: 'High-Tech & High Income' }
        ]
      },
      {
        name: 'Arizona',
        code: 'AZ',
        population: '7,430,000',
        topCities: [
          { name: 'Phoenix', population: '1,650,000', tier: 'Major Metro (5.0M Valley)' },
          { name: 'Tucson', population: '545,000', tier: 'Southern AZ Hub' },
          { name: 'Mesa', population: '510,000', tier: 'East Valley Metro' },
          { name: 'Chandler', population: '280,000', tier: 'Tech Corridor' },
          { name: 'Scottsdale', population: '243,000', tier: 'Luxury & High Income' }
        ]
      },
      {
        name: 'Tennessee',
        code: 'TN',
        population: '7,125,000',
        topCities: [
          { name: 'Nashville', population: '690,000', tier: 'Healthcare & Entertainment Capital' },
          { name: 'Memphis', population: '625,000', tier: 'Logistics Hub' },
          { name: 'Knoxville', population: '192,000', tier: 'East TN Hub' },
          { name: 'Chattanooga', population: '183,000', tier: 'Tech & Gig City' },
          { name: 'Clarksville', population: '170,000', tier: 'Booming Metro' }
        ]
      },
      {
        name: 'Massachusetts',
        code: 'MA',
        population: '7,000,000',
        topCities: [
          { name: 'Boston', population: '655,000', tier: 'Biotech & Education Capital' },
          { name: 'Worcester', population: '205,000', tier: 'Central MA Hub' },
          { name: 'Springfield', population: '154,000', tier: 'Western MA' },
          { name: 'Cambridge', population: '118,000', tier: 'Biotech & MIT/Harvard' }
        ]
      },
      {
        name: 'Indiana',
        code: 'IN',
        population: '6,860,000',
        topCities: [
          { name: 'Indianapolis', population: '880,000', tier: 'Major Metro' },
          { name: 'Fort Wayne', population: '265,000', tier: 'Northeast IN' },
          { name: 'Evansville', population: '116,000', tier: 'Southern IN' },
          { name: 'South Bend', population: '103,000', tier: 'Notre Dame & North IN' }
        ]
      },
      {
        name: 'Missouri',
        code: 'MO',
        population: '6,195,000',
        topCities: [
          { name: 'Kansas City', population: '510,000', tier: 'Major Metro (2.2M Metro)' },
          { name: 'St. Louis', population: '290,000', tier: 'Major Metro (2.8M Metro)' },
          { name: 'Springfield', population: '170,000', tier: 'Ozarks Hub' },
          { name: 'Columbia', population: '127,000', tier: 'University City' }
        ]
      },
      {
        name: 'Maryland',
        code: 'MD',
        population: '6,165,000',
        topCities: [
          { name: 'Baltimore', population: '570,000', tier: 'Major Metro' },
          { name: 'Frederick', population: '82,000', tier: 'Biotech Corridor' },
          { name: 'Rockville / Bethesda', population: '150,000', tier: 'DC Metro (Wealthy)' }
        ]
      },
      {
        name: 'Wisconsin',
        code: 'WI',
        population: '5,910,000',
        topCities: [
          { name: 'Milwaukee', population: '565,000', tier: 'Major Metro' },
          { name: 'Madison', population: '270,000', tier: 'State Capital & Tech' },
          { name: 'Green Bay', population: '106,000', tier: 'Northeast WI' }
        ]
      },
      {
        name: 'Colorado',
        code: 'CO',
        population: '5,875,000',
        topCities: [
          { name: 'Denver', population: '715,000', tier: 'Tech & Mountain Metro' },
          { name: 'Colorado Springs', population: '485,000', tier: 'Defense & Aerospace' },
          { name: 'Aurora', population: '390,000', tier: 'Denver Suburb' },
          { name: 'Fort Collins', population: '170,000', tier: 'Northern CO' },
          { name: 'Boulder', population: '105,000', tier: 'High-Income Tech Hub' }
        ]
      },
      {
        name: 'Minnesota',
        code: 'MN',
        population: '5,735,000',
        topCities: [
          { name: 'Minneapolis', population: '425,000', tier: 'Twin Cities Metro' },
          { name: 'St. Paul', population: '305,000', tier: 'State Capital' },
          { name: 'Rochester', population: '122,000', tier: 'Mayo Clinic Global Hub' }
        ]
      },
      {
        name: 'South Carolina',
        code: 'SC',
        population: '5,370,000',
        topCities: [
          { name: 'Charleston', population: '155,000', tier: 'Coastal & Tourism Hub' },
          { name: 'Columbia', population: '140,000', tier: 'State Capital' },
          { name: 'Greenville', population: '72,000', tier: 'Booming Upstate Metro' }
        ]
      },
      {
        name: 'Alabama',
        code: 'AL',
        population: '5,100,000',
        topCities: [
          { name: 'Huntsville', population: '220,000', tier: 'Aerospace & Tech Hub' },
          { name: 'Birmingham', population: '197,000', tier: 'Healthcare & Finance' },
          { name: 'Montgomery', population: '198,000', tier: 'State Capital' },
          { name: 'Mobile', population: '185,000', tier: 'Gulf Coast Port' }
        ]
      },
      {
        name: 'Louisiana',
        code: 'LA',
        population: '4,590,000',
        topCities: [
          { name: 'New Orleans', population: '370,000', tier: 'Major Tourism & Port' },
          { name: 'Baton Rouge', population: '220,000', tier: 'State Capital' },
          { name: 'Shreveport', population: '180,000', tier: 'Northwest LA' },
          { name: 'Lafayette', population: '122,000', tier: 'Cajun Heartland Hub' }
        ]
      },
      {
        name: 'Kentucky',
        code: 'KY',
        population: '4,525,000',
        topCities: [
          { name: 'Louisville', population: '625,000', tier: 'Logistics & Healthcare' },
          { name: 'Lexington', population: '320,000', tier: 'Bluegrass & University' },
          { name: 'Bowling Green', population: '75,000', tier: 'Automotive Hub' }
        ]
      },
      {
        name: 'Oregon',
        code: 'OR',
        population: '4,230,000',
        topCities: [
          { name: 'Portland', population: '635,000', tier: 'Pacific NW Metro' },
          { name: 'Eugene', population: '178,000', tier: 'University & Tech' },
          { name: 'Salem', population: '179,000', tier: 'State Capital' },
          { name: 'Bend', population: '102,000', tier: 'High-Income Outdoor Hub' }
        ]
      },
      {
        name: 'Oklahoma',
        code: 'OK',
        population: '4,050,000',
        topCities: [
          { name: 'Oklahoma City', population: '695,000', tier: 'Energy & Aviation Capital' },
          { name: 'Tulsa', population: '411,000', tier: 'Energy & Tech Hub' },
          { name: 'Norman', population: '128,000', tier: 'University City' }
        ]
      },
      {
        name: 'Connecticut',
        code: 'CT',
        population: '3,615,000',
        topCities: [
          { name: 'Bridgeport', population: '148,000', tier: 'NYC Metro' },
          { name: 'Stamford', population: '136,000', tier: 'Finance Hub' },
          { name: 'New Haven', population: '135,000', tier: 'Yale & Biotech' },
          { name: 'Hartford', population: '120,000', tier: 'Insurance Capital' },
          { name: 'Greenwich', population: '63,000', tier: 'Ultra-High Wealth' }
        ]
      },
      {
        name: 'Utah',
        code: 'UT',
        population: '3,420,000',
        topCities: [
          { name: 'Salt Lake City', population: '205,000', tier: 'Silicon Slopes (1.2M Metro)' },
          { name: 'West Valley City', population: '138,000', tier: 'SLC Suburb' },
          { name: 'Provo', population: '115,000', tier: 'Tech Hub & University' },
          { name: 'St. George', population: '100,000', tier: 'Fastest Growing Hub' }
        ]
      },
      {
        name: 'Nevada',
        code: 'NV',
        population: '3,195,000',
        topCities: [
          { name: 'Las Vegas', population: '655,000', tier: 'Mega Hospitality (2.3M Metro)' },
          { name: 'Henderson', population: '325,000', tier: 'High Income Vegas Suburb' },
          { name: 'Reno', population: '270,000', tier: 'Tech & Logistics Hub' }
        ]
      },
      {
        name: 'Arkansas',
        code: 'AR',
        population: '3,065,000',
        topCities: [
          { name: 'Little Rock', population: '202,000', tier: 'State Capital' },
          { name: 'Northwest Arkansas (Bentonville/Fayetteville)', population: '380,000', tier: 'Corporate HQ Corridor' }
        ]
      },
      {
        name: 'Kansas',
        code: 'KS',
        population: '2,940,000',
        topCities: [
          { name: 'Wichita', population: '395,000', tier: 'Aviation Capital' },
          { name: 'Overland Park', population: '197,000', tier: 'KC Wealthy Suburb' }
        ]
      },
      {
        name: 'New Mexico',
        code: 'NM',
        population: '2,115,000',
        topCities: [
          { name: 'Albuquerque', population: '560,000', tier: 'Major Metro' },
          { name: 'Santa Fe', population: '88,000', tier: 'Arts & Capital' }
        ]
      },
      {
        name: 'Nebraska',
        code: 'NE',
        population: '1,970,000',
        topCities: [
          { name: 'Omaha', population: '485,000', tier: 'Finance & Insurance Hub' },
          { name: 'Lincoln', population: '295,000', tier: 'State Capital & University' }
        ]
      },
      {
        name: 'Idaho',
        code: 'ID',
        population: '1,965,000',
        topCities: [
          { name: 'Boise', population: '240,000', tier: 'Booming Tech Metro (800K Metro)' },
          { name: 'Meridian', population: '130,000', tier: 'Fast Growing Suburb' }
        ]
      },
      {
        name: 'Hawaii',
        code: 'HI',
        population: '1,440,000',
        topCities: [
          { name: 'Honolulu', population: '345,000', tier: 'Pacific Tourism & Naval' }
        ]
      },
      {
        name: 'District of Columbia',
        code: 'DC',
        population: '680,000',
        topCities: [
          { name: 'Washington', population: '680,000', tier: 'National Capital (6.3M Metro)' }
        ]
      }
    ]
  },

  uk: {
    countryName: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    totalPopulation: '67,800,000',
    marketTier: 'Tier 1 European Powerhouse',
    currency: 'GBP (£)',
    states: [
      {
        name: 'Greater London',
        code: 'ENG-LDN',
        population: '8,900,000',
        topCities: [
          { name: 'Central London', population: '1,500,000', tier: 'Global Financial Hub' },
          { name: 'Croydon', population: '385,000', tier: 'South London Metro' },
          { name: 'Barnet', population: '395,000', tier: 'North London Metro' },
          { name: 'Ealing', population: '340,000', tier: 'West London Metro' },
          { name: 'Bromley', population: '330,000', tier: 'Southeast London' },
          { name: 'Richmond upon Thames', population: '200,000', tier: 'High Income Wealth Hub' }
        ]
      },
      {
        name: 'West Midlands',
        code: 'ENG-WM',
        population: '2,940,000',
        topCities: [
          { name: 'Birmingham', population: '1,150,000', tier: 'Second City (Major Metro)' },
          { name: 'Coventry', population: '350,000', tier: 'Automotive & Tech' },
          { name: 'Wolverhampton', population: '265,000', tier: 'Industrial Hub' },
          { name: 'Solihull', population: '215,000', tier: 'High Income Suburb' }
        ]
      },
      {
        name: 'Greater Manchester',
        code: 'ENG-GM',
        population: '2,870,000',
        topCities: [
          { name: 'Manchester', population: '555,000', tier: 'Northern Powerhouse Hub' },
          { name: 'Salford', population: '270,000', tier: 'MediaCity & Tech' },
          { name: 'Stockport', population: '295,000', tier: 'South Manchester' },
          { name: 'Bolton', population: '285,000', tier: 'North Manchester' }
        ]
      },
      {
        name: 'West Yorkshire',
        code: 'ENG-WY',
        population: '2,350,000',
        topCities: [
          { name: 'Leeds', population: '815,000', tier: 'Major Financial & Legal Center' },
          { name: 'Bradford', population: '545,000', tier: 'Industrial Metro' },
          { name: 'Wakefield', population: '350,000', tier: 'Logistics Hub' }
        ]
      },
      {
        name: 'Scotland (Central Belt & Highlands)',
        code: 'SCT',
        population: '5,440,000',
        topCities: [
          { name: 'Glasgow', population: '635,000', tier: 'Major Metro & Commercial Hub' },
          { name: 'Edinburgh', population: '530,000', tier: 'Scottish Capital & Financial Center' },
          { name: 'Aberdeen', population: '230,000', tier: 'Energy & Offshore Oil Hub' },
          { name: 'Dundee', population: '150,000', tier: 'Biotech & Gaming Hub' }
        ]
      },
      {
        name: 'Merseyside & North West',
        code: 'ENG-NW',
        population: '1,430,000',
        topCities: [
          { name: 'Liverpool', population: '500,000', tier: 'Major Port & Culture Hub' },
          { name: 'Birkenhead / Wirral', population: '320,000', tier: 'Mersey Waterfront' }
        ]
      },
      {
        name: 'South Yorkshire & East Midlands',
        code: 'ENG-EM',
        population: '2,400,000',
        topCities: [
          { name: 'Sheffield', population: '585,000', tier: 'Advanced Manufacturing Hub' },
          { name: 'Nottingham', population: '330,000', tier: 'Midlands Commercial Hub' },
          { name: 'Leicester', population: '370,000', tier: 'Midlands Manufacturing' },
          { name: 'Derby', population: '260,000', tier: 'Aerospace & Rail Hub' }
        ]
      },
      {
        name: 'South West & Bristol Channel',
        code: 'ENG-SW',
        population: '2,100,000',
        topCities: [
          { name: 'Bristol', population: '475,000', tier: 'Tech & Aerospace Capital' },
          { name: 'Plymouth', population: '265,000', tier: 'South Coast Port' },
          { name: 'Bath', population: '105,000', tier: 'High-Wealth Tourism' }
        ]
      },
      {
        name: 'South Coast (Hampshire & Sussex)',
        code: 'ENG-SC',
        population: '2,800,000',
        topCities: [
          { name: 'Southampton', population: '255,000', tier: 'Cruise & Shipping Port' },
          { name: 'Portsmouth', population: '240,000', tier: 'Naval Port' },
          { name: 'Brighton and Hove', population: '280,000', tier: 'Digital & Creative Hub' }
        ]
      },
      {
        name: 'Wales',
        code: 'WLS',
        population: '3,110,000',
        topCities: [
          { name: 'Cardiff', population: '365,000', tier: 'Welsh Capital & Financial Center' },
          { name: 'Swansea', population: '245,000', tier: 'Coastal Hub' },
          { name: 'Newport', population: '160,000', tier: 'South Wales Corridor' }
        ]
      },
      {
        name: 'Northern Ireland',
        code: 'NIR',
        population: '1,910,000',
        topCities: [
          { name: 'Belfast', population: '345,000', tier: 'Capital & Tech Center' },
          { name: 'Derry / Londonderry', population: '85,000', tier: 'Northwest Hub' }
        ]
      }
    ]
  },

  canada: {
    countryName: 'Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    totalPopulation: '40,500,000',
    marketTier: 'Tier 1 Wealth Market',
    currency: 'CAD ($)',
    states: [
      {
        name: 'Ontario',
        code: 'ON',
        population: '15,600,000',
        topCities: [
          { name: 'Toronto', population: '2,800,000', tier: 'Financial Capital (6.4M GTA)' },
          { name: 'Ottawa', population: '1,020,000', tier: 'National Capital' },
          { name: 'Mississauga', population: '720,000', tier: 'GTA Corporate Hub' },
          { name: 'Brampton', population: '660,000', tier: 'Fast Growing GTA' },
          { name: 'Hamilton', population: '575,000', tier: 'Steel & Healthcare' },
          { name: 'London', population: '425,000', tier: 'Southwestern ON' },
          { name: 'Kitchener-Waterloo', population: '530,000', tier: 'Canada Silicon Valley' },
          { name: 'Markham / Vaughan', population: '680,000', tier: 'High-Tech & High Wealth GTA' }
        ]
      },
      {
        name: 'Quebec',
        code: 'QC',
        population: '8,950,000',
        topCities: [
          { name: 'Montreal', population: '1,780,000', tier: 'Major Metro & AI Hub (4.3M Metro)' },
          { name: 'Quebec City', population: '550,000', tier: 'Provincial Capital' },
          { name: 'Laval', population: '440,000', tier: 'Montreal Suburb' },
          { name: 'Gatineau', population: '290,000', tier: 'National Capital Region' },
          { name: 'Longueuil', population: '255,000', tier: 'Montreal South Shore' }
        ]
      },
      {
        name: 'British Columbia',
        code: 'BC',
        population: '5,550,000',
        topCities: [
          { name: 'Vancouver', population: '675,000', tier: 'Global Hub (2.7M Metro)' },
          { name: 'Surrey', population: '570,000', tier: 'Fastest Growing Metro Hub' },
          { name: 'Burnaby', population: '250,000', tier: 'Tech & Metro Vancouver' },
          { name: 'Richmond', population: '210,000', tier: 'Trade & Airport Hub' },
          { name: 'Victoria', population: '395,000', tier: 'BC Capital (Metro)' },
          { name: 'Kelowna', population: '155,000', tier: 'Okanagan Wealth & Tech Hub' }
        ]
      },
      {
        name: 'Alberta',
        code: 'AB',
        population: '4,800,000',
        topCities: [
          { name: 'Calgary', population: '1,310,000', tier: 'Energy & Corporate HQ Capital' },
          { name: 'Edmonton', population: '1,015,000', tier: 'Provincial Capital & Petrochem' },
          { name: 'Red Deer', population: '105,000', tier: 'Central Alberta Hub' },
          { name: 'Lethbridge', population: '102,000', tier: 'Southern AB Hub' }
        ]
      },
      {
        name: 'Manitoba',
        code: 'MB',
        population: '1,450,000',
        topCities: [
          { name: 'Winnipeg', population: '750,000', tier: 'Prairie Logistics & Finance' },
          { name: 'Brandon', population: '52,000', tier: 'Western MB Hub' }
        ]
      },
      {
        name: 'Saskatchewan',
        code: 'SK',
        population: '1,225,000',
        topCities: [
          { name: 'Saskatoon', population: '275,000', tier: 'AgTech & Mining Hub' },
          { name: 'Regina', population: '230,000', tier: 'Provincial Capital' }
        ]
      },
      {
        name: 'Nova Scotia',
        code: 'NS',
        population: '1,060,000',
        topCities: [
          { name: 'Halifax', population: '445,000', tier: 'Atlantic Canada Financial & Ocean Hub' }
        ]
      },
      {
        name: 'New Brunswick',
        code: 'NB',
        population: '840,000',
        topCities: [
          { name: 'Moncton', population: '80,000', tier: 'Maritime Hub' },
          { name: 'Saint John', population: '70,000', tier: 'Industrial Port' },
          { name: 'Fredericton', population: '63,000', tier: 'Provincial Capital' }
        ]
      },
      {
        name: 'Newfoundland and Labrador',
        code: 'NL',
        population: '540,000',
        topCities: [
          { name: "St. John's", population: '115,000', tier: 'Provincial Capital & Offshore Hub' }
        ]
      }
    ]
  },

  australia: {
    countryName: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    totalPopulation: '26,700,000',
    marketTier: 'Tier 1 High-Ticket Market',
    currency: 'AUD ($)',
    states: [
      {
        name: 'New South Wales',
        code: 'NSW',
        population: '8,340,000',
        topCities: [
          { name: 'Sydney', population: '5,310,000', tier: 'Global Financial & Tech Hub' },
          { name: 'Newcastle', population: '490,000', tier: 'Hunter Valley Industrial Port' },
          { name: 'Central Coast (Gosford)', population: '340,000', tier: 'Sydney Coastal Corridor' },
          { name: 'Wollongong', population: '310,000', tier: 'South Coast Tech & Port' },
          { name: 'Parramatta', population: '260,000', tier: 'Sydney Western CBD' }
        ]
      },
      {
        name: 'Victoria',
        code: 'VIC',
        population: '6,810,000',
        topCities: [
          { name: 'Melbourne', population: '5,100,000', tier: 'Commercial & Cultural Capital' },
          { name: 'Geelong', population: '275,000', tier: 'Bellarine Coastal Hub' },
          { name: 'Ballarat', population: '115,000', tier: 'Goldfields Regional Hub' },
          { name: 'Bendigo', population: '105,000', tier: 'Central Victoria Hub' }
        ]
      },
      {
        name: 'Queensland',
        code: 'QLD',
        population: '5,460,000',
        topCities: [
          { name: 'Brisbane', population: '2,600,000', tier: 'Booming Olympic Capital' },
          { name: 'Gold Coast', population: '710,000', tier: 'Tourism, Tech & Coastal Metro' },
          { name: 'Sunshine Coast', population: '395,000', tier: 'High-Growth Coastal Hub' },
          { name: 'Townsville', population: '185,000', tier: 'North QLD Defense & Mining' },
          { name: 'Cairns', population: '160,000', tier: 'Great Barrier Reef Hub' },
          { name: 'Toowoomba', population: '145,000', tier: 'Darling Downs Hub' }
        ]
      },
      {
        name: 'Western Australia',
        code: 'WA',
        population: '2,880,000',
        topCities: [
          { name: 'Perth', population: '2,225,000', tier: 'Mining, Resources & Tech Capital' },
          { name: 'Mandurah', population: '100,000', tier: 'South Perth Coastal' },
          { name: 'Bunbury', population: '78,000', tier: 'Southwest Hub' }
        ]
      },
      {
        name: 'South Australia',
        code: 'SA',
        population: '1,850,000',
        topCities: [
          { name: 'Adelaide', population: '1,415,000', tier: 'Defense, Biotech & Wine Capital' },
          { name: 'Mount Gambier', population: '30,000', tier: 'Limestone Coast Hub' }
        ]
      },
      {
        name: 'Tasmania',
        code: 'TAS',
        population: '575,000',
        topCities: [
          { name: 'Hobart', population: '250,000', tier: 'State Capital & Tourism Hub' },
          { name: 'Launceston', population: '90,000', tier: 'Northern Tasmania Hub' }
        ]
      },
      {
        name: 'Australian Capital Territory',
        code: 'ACT',
        population: '465,000',
        topCities: [
          { name: 'Canberra', population: '465,000', tier: 'National Capital (Highest Income)' }
        ]
      },
      {
        name: 'Northern Territory',
        code: 'NT',
        population: '255,000',
        topCities: [
          { name: 'Darwin', population: '150,000', tier: 'Top End Port & Capital' },
          { name: 'Alice Springs', population: '27,000', tier: 'Red Centre Hub' }
        ]
      }
    ]
  }
};
