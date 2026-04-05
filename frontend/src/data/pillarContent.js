/**
 * Pillar page copy is aligned with *Odisha Vision 2036 & 2047* (Executive Summary
 * and full Vision Document), Planning & Convergence Department, Government of Odisha.
 */

export const PILLAR_ORDER = [
  "people-first",
  "rural-power",
  "prosperity",
  "tech-lead",
  "legacy",
  "governance",
];

/** @typedef {{ title: string, description: string, icon: 'barChart' | 'checkCircle' | 'alertCircle' | 'users', keyBenefits: [string, string, string] }} SectorTabCard */
/** @typedef {{ title: string, location: string, date: string, achievement: string, story: string, impact: string }} StrategicInitiativeCard */
/**
 * @typedef {Object} PillarContent
 * @property {string} title
 * @property {string} documentPillarName
 * @property {string} color
 * @property {{ summary: string, keyObjectives: string[], cards: { targetBeneficiaries: string, geographicCoverage: string, timeline: string, status: string } }} overview
 * @property {SectorTabCard[]} sectorTabCards
 * @property {{ title: string, location: string, date: string, achievement: string, story: string, impact: string }[]} featureGoalCards
 * @property {{ title: string, location: string, date: string, achievement: string, story: string, impact: string }[]} themeCards
 * @property {StrategicInitiativeCard[]} strategicInitiativeCards
 * @property {{
 *   summary: string,
 *   keyAchievements: { title: string, metricBadge: string, description: string, recommendation: string }[],
 *   areasForImprovement: { title: string, priority: 'HIGH' | 'MEDIUM', gapMetric: string, challenge: string, recommendation: string, nextSteps: [string, string, string] }[],
 *   keyTrends: { direction: 'up' | 'neutral', headline: string, detail: string }[],
 *   predictedOutcomes: { ifNoAction: string, ifActionTaken: string }
 * }} insightsPanel
 */

/** @type {Record<string, PillarContent>} */
export const pillarContentBySlug = {
  "people-first": {
    title: "People First",
    documentPillarName: "People First",
    color: "#F26522",
    overview: {
      summary:
        "Development begins and ends with people. This pillar champions equality, dignity, and opportunity for all-especially women, youth, and vulnerable communities-through holistic human development: quality education, healthcare, nutrition, and livelihoods. The Vision anchors wellness and equity (life expectancy, maternal and child health, learning outcomes, multidimensional poverty reduction) so economic growth reaches every household.",
      keyObjectives: [
        "Excel among the top three States on SDG 5 (gender equality) and raise female labour force participation to at least 70%.",
        "Scale women-led livelihoods via SHGs and MSMEs with safety, skilling, and market linkages (SUBHADRA, Lakhpati Didi, enabling infrastructure).",
        "Deliver quality schooling through higher education, NEP-aligned reforms, and Skilled in Odisha for global-ready workforce.",
        "Transform healthcare, nutrition, and youth sports/wellness so outcomes match 2036–2047 wellness targets in the Vision document.",
        "Ensure inclusive growth for tribal communities and PVTGs through education, health, and livelihood pathways.",
      ],
      cards: {
        targetBeneficiaries:
          "All citizens, with priority for women and girls, youth, children, tribal & PVTG communities, SHG members, and marginalised groups served by health, education, nutrition, and social protection programmes.",
        geographicCoverage:
          "All 30 districts-urban and rural-through schools, anganwadis, health facilities, higher education institutions, and statewide skilling and safety initiatives.",
        timeline: "June 2025 (Vision unveiled) - milestone years 2036 & 2047 - ongoing implementation across departments.",
        status: "Active",
      },
    },
    sectorTabCards: [
      {
        title: "Human Development KPI Cockpit",
        description:
          "Real-time view of People First outcomes-SDG 5 progress, female LFPR, school GER, IMR/MMR, nutrition, and higher-education milestones-with district-wise drill-down aligned to Vision 2036–2047 targets.",
        icon: "barChart",
        keyBenefits: [
          "Live tracking of social-sector KPIs",
          "District and block drill-down",
          "Early warning on slipping indicators",
        ],
      },
      {
        title: "Women-Led Programme Verification Stack",
        description:
          "Digital verification for SUBHADRA, Lakhpati Didi, SHG-led enterprises, and workplace enablers (creches, safety infrastructure)-linking disbursement and compliance to Vision gender-equality goals.",
        icon: "checkCircle",
        keyBenefits: [
          "Auditable benefit and compliance trails",
          "Reduced leakage and duplication",
          "Faster grievance-linked reconciliation",
        ],
      },
      {
        title: "Inclusion & Coverage Gap Radar",
        description:
          "Surfaces children and households under-covered by schooling, ICDS, health outreach, or tribal/PVTG livelihood programmes-so resources target the Vision’s inclusive-growth chapters.",
        icon: "alertCircle",
        keyBenefits: [
          "Priority lists for re-engagement",
          "Tribal and PVTG hotspot mapping",
          "Cross-department intervention triggers",
        ],
      },
      {
        title: "Frontline Service Performance Tracking",
        description:
          "Monitors anganwadi, health facility, and skilling-centre reach, visit cadence, and service quality-supporting Healthy Odisha, nutrition, and Skilled in Odisha delivery at scale.",
        icon: "users",
        keyBenefits: [
          "Performance benchmarking by district",
          "Quality assurance and supervision",
          "Training-need identification",
        ],
      },
    ],
    featureGoalCards: [
      {
        title: "Women-Led Growth: Excellence in Inclusion",
        location: "SUBHADRA, SHGs & MSMEs · All 30 districts",
        date: "June 2025",
        achievement:
          "Vision commits Odisha to top-three performance on SDG 5 and ≥70% female labour force participation-with SUBHADRA, Lakhpati Didi, and SHG scale-up as flagship levers.",
        story:
          "The People First pillar treats women-led growth as central to Viksit Odisha: safety infrastructure (e.g. pink zones), creches, digital job platforms, and end-to-end SHG support (branding, markets, mentorship) are sequenced so livelihood gains are measurable and sustained-not one-off schemes.",
        impact:
          "Higher FLFP and women-led enterprise revenue strengthen household resilience, reduce multidimensional poverty, and align social outcomes with the State’s 2036–2047 economic ambition.",
      },
      {
        title: "Education, Health & Nutrition: Lifelong Foundations",
        location: "Schools, anganwadis & HEIs · Urban & rural Odisha",
        date: "2025–2047",
        achievement:
          "Integrated delivery across quality schooling, NEP-aligned higher education, Skilled in Odisha, Healthy Odisha, and nutrition-toward literacy, GER, IMR/MMR, and child nutrition targets in the Vision.",
        story:
          "Chapters on education, skills, health, nutrition, and youth sports are bundled so the same child can progress from early learning to work-ready skills; tribal and PVTG pathways include residential complexes and targeted livelihood coverage.",
        impact:
          "A healthier, better-educated workforce raises productivity and equity, making growth inclusive before per capita income crosses the Vision’s USD 28k trajectory by 2047.",
      },
    ],
    themeCards: [
      {
        title: "People Before Numbers: The Moral Core of the Vision",
        location: "People First foundation · Statewide social sectors",
        date: "June 2025",
        achievement:
          "Odisha Vision 2036 & 2047 states that no headline economy target matters unless people are healthy, educated, safe, and able to participate fully in work and civic life.",
        story:
          "The document frames Viksit Odisha as inseparable from human capability: literacy, life expectancy, maternal and child survival, nutrition, and dignity are not add-ons to GSDP-they are the test of whether growth is legitimate. Programmes are therefore judged by whether they expand real choices for women, youth, and marginalised groups.",
        impact:
          "Policy and budget debates shift from output alone to lived outcomes, keeping the State accountable to citizens as the Vision matures through 2036 and 2047.",
      },
      {
        title: "One System: Education, Health, Women & Nutrition Together",
        location: "Cross-sector convergence · All 30 districts",
        date: "2036–2047",
        achievement:
          "Women-led growth, schooling, skills, Healthy Odisha, and nutrition are designed as mutually reinforcing-not parallel silos-so demographic dividend and social justice rise together.",
        story:
          "Rather than isolated schemes, the Vision bundles chapters so a girl’s path from anganwadi to classroom to workplace is coherent: SUBHADRA and Lakhpati Didi link to skills and MSMEs; safety and creches enable labour-market entry; tribal pathways connect culture with opportunity.",
        impact:
          "Faster human development raises productivity and equity at once-reducing multidimensional poverty while supplying the talent Odisha needs for a USD 1.5 tn economy.",
      },
    ],
    strategicInitiativeCards: [
      {
        title: "Safety & Enabling Workplaces",
        location: "Women’s employment · Urban & industrial areas",
        date: "June 2025",
        achievement:
          "Statewide roll-out of physical and digital safety infrastructure so women can enter and stay in formal work without fear or friction.",
        story:
          "The initiative bundles pink zones, rapid emergency response, workplace crèches and sanitation, verified digital job platforms, gender pay parity monitoring, viability-gap funding for women-centric skilling, and gender badges for inclusive employers-mirroring the Vision’s women-led growth chapter.",
        impact:
          "Target FLFP ≥70%, reduced workplace harassment incidents, higher retention of women in formal payrolls, faster placement-to-offer conversion on digital job rails.",
      },
      {
        title: "SHG & MSME Ladder",
        location: "Livelihood clusters · All 30 districts",
        date: "2025–2047",
        achievement:
          "End-to-end ladder from group enterprise to market-ready women-led MSMEs with brand, credit, and export linkages.",
        story:
          "SHGs receive branding, market linkage, production expansion, diversification, and mentorship; large-buyer and e-commerce tie-ins are standardised so Lakhpati Didi and SUBHADRA outcomes compound into durable firms.",
        impact:
          "Higher share of women-led MSMEs in formal credit, rising average revenue per SHG enterprise, expanded product SKUs in priority sectors.",
      },
      {
        title: "Rights, Rehabilitation & Behaviour Change",
        location: "Protection services · State + district cells",
        date: "2025–2036",
        achievement:
          "Survivor-centred legal aid, counselling, rehabilitation, and statewide SBCC so rights are operational-not only on paper.",
        story:
          "One-stop support integrates police, courts, shelter, health, and livelihood bridges; mass campaigns shift norms on child marriage, violence, and cyber safety in line with SDG 5 ambition.",
        impact:
          "Faster case registration-to-support timelines, higher conviction-support completion, measurable attitude shifts in high-risk cohorts.",
      },
      {
        title: "Tribal Inclusion Pathways",
        location: "ITDA & ST-PVTG blocks · Residential campuses",
        date: "2036 milestone",
        achievement:
          "Residential education complexes and tribal livelihood corridors toward 100% relevant household coverage where the Vision specifies.",
        story:
          "Culture-preserving livelihood models pair with health, education, and employment so PVTGs do not face false trade-offs between identity and opportunity.",
        impact:
          "Higher tribal GER and completion rates, documented livelihood uptake per complex, reduced outmigration from priority habitations.",
      },
    ],
    insightsPanel: {
      summary:
        "People First aligns Odisha’s centenary milestones with equity: multidimensional poverty reduction, women-led development through SUBHADRA-scale transfers, and education expansion from foundational learning through higher secondary and tertiary access. The pillar ties SDG 5, FLFP, and social protection convergence into a single human-capital trajectory to 2047.",
      keyAchievements: [
        {
          title: "Vision milestones anchored",
          metricBadge: "2036 Statehood & 2047 Independence centenaries",
          description:
            "Program framing links every outcome to Odisha’s 100-year narratives, keeping long-horizon accountability in health, education, and women’s agency.",
          recommendation:
            "Maintain outcome dashboards tagged to centenary milestones and publish annual People First scorecards.",
        },
        {
          title: "Equity ambition (directional)",
          metricBadge: "Multidimensional poverty → under 5% trajectory",
          description:
            "The Vision sets a steep but clear poverty-reduction path alongside FLFP and nutrition goals-illustrative of Odisha’s social contract through 2047.",
          recommendation:
            "Cross-walk MPI indicators with SUBHADRA, nutrition, and schooling programs for joint targeting.",
        },
        {
          title: "Education pipeline",
          metricBadge: "GER & disadvantaged-group access expansion",
          description:
            "Higher secondary and tertiary enrolment, literacy, and inclusion for SC/ST and girls are bundled as competitiveness enablers, not standalone schemes.",
          recommendation:
            "Scale bridge courses and career counselling in high-dropout blocks; track GER by gender and social group.",
        },
      ],
      areasForImprovement: [
        {
          title: "Female labour force participation gap",
          priority: "HIGH",
          gapMetric: "FLFP below national aspiration (directional)",
          challenge:
            "Women’s economic participation remains a binding constraint; cash transfers alone do not convert to sustained workforce entry without childcare, skilling, and employer linkages.",
          recommendation:
            "Bundle SUBHADRA follow-up with certified short skilling, creches in industrial zones, and women’s enterprise market access.",
          nextSteps: [
            "Map districts with lowest FLFP and highest out-migration of male workers.",
            "Pilot integrated hubs (skill + childcare + placement) in two divisions.",
            "Track quarterly FLFP proxy indicators with gender-disaggregated placement data.",
          ],
        },
      ],
      keyTrends: [
        {
          direction: "up",
          headline: "Women-led cash transfer scale",
          detail: "SUBHADRA-class programs widen coverage and deepen bank-account linkage.",
        },
        {
          direction: "up",
          headline: "Schooling participation (directional)",
          detail: "GER and transition rates improving where convergence with nutrition and WASH is strong.",
        },
        {
          direction: "neutral",
          headline: "Multidimensional poverty",
          detail: "Reduction path credible but requires sustained MPI-aligned multisector delivery.",
        },
      ],
      predictedOutcomes: {
        ifNoAction:
          "Poverty and FLFP gaps may persist past 2036 milestones, weakening human-capital gains before the 2047 vision horizon.",
        ifActionTaken:
          "Odisha can approach document equity targets-MPI under 5% directional, stronger FLFP, and GER leadership-with SDG 5 and education indices in the top tier of States.",
      },
    },
  },

  "rural-power": {
    title: "Rural Power",
    documentPillarName: "Rural Empowerment",
    color: "#10B981",
    overview: {
      summary:
        "With most Odishans living in villages, rural transformation is essential. Rural Empowerment raises incomes, upgrades infrastructure, secures water, and creates sustainable non-farm jobs-making every village a centre of opportunity. It combines inclusive agriculture, animal husbandry, fisheries and the blue economy, water security, and rural renaissance in living standards.",
      keyObjectives: [
        "Rank among the top five States in per capita farmer income and lead five globally competitive, export-ready crop value chains.",
        "Digitally map and monitor 100% of farmland, subsidies, and extension; scale irrigation, climate-smart practices, and PM-KUSUM solarisation where viable.",
        "Grow FPO, SHG, and cooperative-led platforms for inputs, credit, and markets; strengthen post-harvest cold chains and packhouses.",
        "Scale animal husbandry (milk, meat, eggs) and veterinary outreach; develop fisheries and aquaculture under the blue economy.",
        "Advance water security and rural ease of living to support non-farm employment and resilient communities.",
      ],
      cards: {
        targetBeneficiaries:
          "Small and marginal farmers, FPOs, SHGs, livestock rearers, fishers and coastal communities, and rural workers in on-farm and non-farm rural employment.",
        geographicCoverage:
          "All rural districts and villages; agricultural heartlands and irrigation command areas; 480 km+ coastline and inland water-linked production systems.",
        timeline: "June 2025 (Vision unveiled) - agriculture & rural outcome milestones through 2036 to 2047 - ongoing.",
        status: "Active",
      },
    },
    sectorTabCards: [
      {
        title: "Agriculture & Value Chain Command Deck",
        description:
          "Interactive dashboard for farmer income, five priority value chains, cropping intensity, irrigation coverage, and climate-smart adoption-mapped to Rural Empowerment outcomes in the Vision document.",
        icon: "barChart",
        keyBenefits: [
          "Crop and mandi intelligence by district",
          "FPO / SHG platform uptake tracking",
          "Export-readiness and yield benchmarks",
        ],
      },
      {
        title: "Farmland & Subsidy Integrity Layer",
        description:
          "Digital verification of land parcels, subsidy beneficiaries, and extension services-supporting the Vision target to map and monitor 100% of farmland and programme delivery.",
        icon: "checkCircle",
        keyBenefits: [
          "Traceable subsidy and input delivery",
          "PM-KUSUM and scheme eligibility checks",
          "Audit-ready field evidence",
        ],
      },
      {
        title: "Water & Post-Harvest Gap Analysis",
        description:
          "Identifies irrigation gaps, water-stressed blocks, cold-chain voids, and packhouse shortfalls-matching Water Security and post-harvest chapters of the Vision.",
        icon: "alertCircle",
        keyBenefits: [
          "Priority capital works lists",
          "Perishables loss reduction focus",
          "Climate-risk corridor views",
        ],
      },
      {
        title: "Extension & Blue Economy Field Tracker",
        description:
          "Tracks veterinary outreach, fisheries and aquaculture production, and rural non-farm employment-linking field staff activity to Animal Husbandry and blue-economy goals.",
        icon: "users",
        keyBenefits: [
          "Coast and inland catchment views",
          "Livestock service coverage metrics",
          "Rural workforce deployment insights",
        ],
      },
    ],
    featureGoalCards: [
      {
        title: "Inclusive Agriculture: Value Chains That Pay",
        location: "DAFE value chains & FPO platforms · Agri heartlands",
        date: "June 2025",
        achievement:
          "Odisha targets top-five per capita farmer income, five export-ready priority crops, 100% digital mapping of farmland and subsidies, and deep irrigation/cropping-intensity gains by 2047.",
        story:
          "Centres of Excellence, climate-smart extension, Land Leasing Act support for women farmers, PM-KUSUM solarisation, and a strengthened Marketing Cell connect farmers from seed to premium markets-reducing risk through price-gap support and FPO/SHG-led planning.",
        impact:
          "Higher farm incomes and lower post-harvest loss anchor rural demand for industry and services, balancing the State’s urban industrial push with inclusive village-level prosperity.",
      },
      {
        title: "Blue Economy & Water Security: Resilient Countryside",
        location: "Coastal & inland waters · All rural blocks",
        date: "2025–2047",
        achievement:
          "Scale fisheries and aquaculture; expand animal husbandry (milk, meat, eggs) to top-tier States; harden water security and rural ease of living for non-farm jobs.",
        story:
          "Rural Renaissance chapters link coastal productivity with veterinary outreach, water governance, and village infrastructure so climate shocks do not erase agricultural gains.",
        impact:
          "Diversified rural incomes reduce distress migration, strengthen food security, and protect the natural asset base on which Odisha’s long-term GSDP targets depend.",
      },
    ],
    themeCards: [
      {
        title: "Villages as Engines, Not Left-Behind Places",
        location: "Rural Empowerment · Agriculture & non-farm rural economy",
        date: "June 2025",
        achievement:
          "The Vision positions rural transformation as the structural counterpart to urban industrial growth: without productive villages and sound natural-resource foundations, GSDP targets cannot be inclusive or durable.",
        story:
          "Most Odishans still live in villages; the pillar raises incomes, infrastructure, water security, and non-farm jobs so every village becomes a centre of opportunity. Urban corridors and mega-parks succeed only when rural purchasing power and stability keep pace.",
        impact:
          "Balanced spatial development reduces distress migration, steadies food systems, and widens the domestic market for industry and services.",
      },
      {
        title: "Water, Blue Economy & Post-Harvest as Shared Safety Nets",
        location: "Coast, command areas & mandi networks",
        date: "2025–2047",
        achievement:
          "Water security, fisheries and aquaculture, animal husbandry, and post-harvest cold chains are explicit levers to de-risk farmers and raise value capture within Odisha.",
        story:
          "Climate shocks and price volatility hit smallholders first; the Vision responds with irrigation depth, climate-smart extension, coastal productivity, and logistics that cut waste-so risk is shared across the State, not borne only by rural households.",
        impact:
          "More stable rural incomes protect the social contract and the tax base that finance urban and industrial ambition.",
      },
    ],
    strategicInitiativeCards: [
      {
        title: "Priority Crop Value Chains",
        location: "DAFE · Five export-ready crops",
        date: "June 2025",
        achievement:
          "Integrated seed-to-market chains with CoEs for seed, millet science, and farmer training, plus price-gap support and traceable marketing.",
        story:
          "A strengthened Marketing Cell and digital traceability connect mandis to premium buyers; FPOs and SHGs co-own planning so shifts in cropping are de-risked and repeatable across districts.",
        impact:
          "Top-5 per capita farmer income rank, five globally competitive crops live, 100% digital farm & subsidy map progress, higher realisation per quintal.",
      },
      {
        title: "Climate, Land & Precision Agriculture",
        location: "Agro-met & block teams · All agro-ecozones",
        date: "2025–2047",
        achievement:
          "Climate Resilience Cell operational; Land Leasing Act unlocks women and tenant farmers; drones and smart soil testing at scale.",
        story:
          "Adaptive advisories, prescription farming, and expanded irrigation reduce yield volatility; land rights data integrates with credit and insurance workflows.",
        impact:
          "Irrigation coverage targets on track, cropping intensity toward 250% by 2047, reduced crop-loss years, women’s share of managed farmland rising to 50%.",
      },
      {
        title: "Post-Harvest Scale-Up",
        location: "Cold chain grid · Rural packhouses",
        date: "2036 milestone",
        achievement:
          "58+ new cold storages and rural packhouses cutting waste and protecting farmer prices during glut seasons.",
        story:
          "Logistics links tie production belts to processing and ports so perishables move on predictable SLAs; private co-investment is bundled with public backbone.",
        impact:
          "Lower post-harvest loss %, higher farmer price capture, fewer distress sales in peak harvest windows.",
      },
      {
        title: "Animal Husbandry & Veterinary Surge",
        location: "Livestock belt · Coast to western districts",
        date: "2025–2047",
        achievement:
          "Top-five egg State; four-fold milk and meat growth; veterinary outreach benchmarked with national leaders.",
        story:
          "AI and doorstep services, breed improvement, and fodder security programmes align with dairy and poultry clusters; fishers parallel-track under blue economy chapters.",
        impact:
          "Higher protein availability, supplemental farm income per household, veterinary visit coverage targets met block-wise.",
      },
    ],
    insightsPanel: {
      summary:
        "Rural Power connects farmer income, irrigation, animal husbandry, fisheries, and water security into one village-centred growth story. Stepped targets on per capita farmer income, irrigated area, and cropping intensity (~250% by 2047) show the shift from subsistence to competitive, climate-smart agriculture and blue economy jobs.",
      keyAchievements: [
        {
          title: "Farmer income pathway",
          metricBadge: "Per capita farmer income → Vision table trajectory to 2047",
          description:
            "Document tables map a stepped climb from today’s base toward ₹15,000 (per Vision unit)-linking MSP reforms, FPOs, and value chains.",
          recommendation:
            "Prioritise five export-ready value chains with cold chain and quality labs in producer clusters.",
        },
        {
          title: "Irrigation & water security",
          metricBadge: "High irrigated-area coverage by 2047 (directional)",
          description:
            "Micro-irrigation, watershed works, and Jal Jeevan-style coverage reduce rainfall risk and stabilise kharif/rabi planning.",
          recommendation:
            "Integrate groundwater recharge maps with crop advisories and solar pump load management.",
        },
        {
          title: "Cropping intensity & diversification",
          metricBadge: "Cropping intensity toward 250% by 2047",
          description:
            "Higher intensity reflects double/triple cropping, horticulture, and non-farm rural enterprises-not input stacking alone.",
          recommendation:
            "Incentivise millets, oilseeds, and pulses in water-stressed blocks; tie to ODOP and export corridors.",
        },
      ],
      areasForImprovement: [
        {
          title: "Climate & market volatility",
          priority: "HIGH",
          gapMetric: "Yield & price shocks vs. income targets",
          challenge:
            "Extreme weather and thin markets can erode income gains even when area under irrigation rises; smallholders need predictable offtake and insurance.",
          recommendation:
            "Mandate block-level risk dashboards (drought, flood, pest) tied to crop insurance and warehouse receipt financing.",
          nextSteps: [
            "Digitise plot-level advisories with 7-day weather and pest alerts in top 100 blocks.",
            "Expand FPO–aggregator contracts for the five flagship value chains.",
            "Pilot parametric insurance pay-outs linked to satellite indices in coastal districts.",
          ],
        },
      ],
      keyTrends: [
        {
          direction: "up",
          headline: "Irrigation asset creation",
          detail: "Micro-irrigation and community tanks rising in Vision capital plans.",
        },
        {
          direction: "up",
          headline: "Livestock & fisheries GVA",
          detail: "Protein security programs lift non-crop rural incomes where implemented end-to-end.",
        },
        {
          direction: "neutral",
          headline: "Input costs",
          detail: "Fertiliser and fuel volatility requires efficiency programs and bio-input scale-up.",
        },
      ],
      predictedOutcomes: {
        ifNoAction:
          "Income targets slip; farmers remain exposed to single-crop risk and weak post-harvest infrastructure.",
        ifActionTaken:
          "Odisha can rank among top States on per capita farmer income with resilient 250% cropping intensity and export-ready chains by 2047.",
      },
    },
  },

  prosperity: {
    title: "Prosperity",
    documentPillarName: "Prosperity for All",
    color: "#3B82F6",
    overview: {
      summary:
        "Prosperity for All frames Odisha’s path to a USD 1.5 trillion economy by 2047 through jobs, value addition, urban expansion, and inclusive industry. Manufacturing, sustainable mining and metals, logistics and connectivity, cities, energy, services, and startups form the sectoral spine for GSVA and employment, supported by ~INR 100 lakh crore cumulative investment envisaged in the Vision.",
      keyObjectives: [
        "Achieve top-five manufacturing GSVA and two major green industry hubs; attract INR 30+ lakh crore manufacturing investment over 15–20 years with doubled manufacturing employment.",
        "Raise Odisha’s share of India’s exports to 7.5% by 2047 (5% by 2036) and rank in the top three for ease of doing business by 2036.",
        "Build industrial mega-parks, MSME clusters, and export-ready supply chains in employment-intensive sectors (e.g. textiles, food processing).",
        "Harness mineral wealth responsibly; scale logistics, ports, rail, and warehousing for regional integration.",
        "Drive urbanisation as a growth engine alongside energy transition, service-sector jobs, and Startup Odisha.",
      ],
      cards: {
        targetBeneficiaries:
          "MSME entrepreneurs and workers, large-industry employees, urban residents, investors, startups, and the workforce in logistics, construction, trade, and energy.",
        geographicCoverage:
          "Industrial mega-parks and corridors; mining and downstream processing belts; urban growth centres; ports and multi-modal networks-all 30 districts linked through connectivity and services.",
        timeline: "June 2025 (Vision unveiled) - stepped targets through 2036 - full 2047 economic and jobs trajectory.",
        status: "Active",
      },
    },
    sectorTabCards: [
      {
        title: "Manufacturing & Investment War Room",
        description:
          "Real-time view of mega-park investments, manufacturing GSVA, green hubs, export share, and employment-intensive sectors-tied to Prosperity for All and the Vision’s INR 30+ lakh crore manufacturing pathway.",
        icon: "barChart",
        keyBenefits: [
          "Project milestone and employment tracking",
          "Export and EoDB rank monitoring",
          "Sector-wise capital inflow views",
        ],
      },
      {
        title: "EoDB & Clearance Verification Console",
        description:
          "Digital trail for approvals, inspections, and statutory compliance-supporting the move from sixth to top-three ease of doing business and sub-10-day start-up targets in the Vision.",
        icon: "checkCircle",
        keyBenefits: [
          "Time-stamped approval workflows",
          "Investor-ready transparency",
          "Labour welfare compliance checks",
        ],
      },
      {
        title: "MSME & Mineral Value-Chain Gap Finder",
        description:
          "Surfaces MSMEs lacking formal credit, certification, or export linkages, and tracks downstream gaps in mining and metals-aligned with diversification goals in the Vision.",
        icon: "alertCircle",
        keyBenefits: [
          "Cluster-wise remediation lists",
          "Supply-chain financing triggers",
          "Downstream investment nudges",
        ],
      },
      {
        title: "Urban & Logistics Workforce Tracker",
        description:
          "Monitors skilling, deployment, and safety outcomes for workers in construction, logistics, ports, energy, and services-supporting urbanisation and jobs chapters of the Vision.",
        icon: "users",
        keyBenefits: [
          "City-region labour dashboards",
          "Port and corridor staffing views",
          "Training pipeline alignment",
        ],
      },
    ],
    featureGoalCards: [
      {
        title: "Manufacturing Mission: Jobs at Scale",
        location: "Mega-parks & thrust sectors · Industrial corridors",
        date: "June 2025",
        achievement:
          "Vision targets top-five manufacturing GSVA, two major green industry hubs, INR 30+ lakh crore manufacturing investment in 15–20 years, and doubled manufacturing employment with strong labour welfare.",
        story:
          "Plug-and-play mega-parks (1,000–3,000 ha), shared services, worker housing, and a CM-led GoM on ease of doing business convert mineral advantage into downstream jobs-especially in textiles, food processing, and MSME-led supply chains.",
        impact:
          "Manufacturing-led jobs lift non-farm employment toward the Vision’s ~24 mn jobs by 2047 and raise Odisha’s share of national exports to 7.5%.",
      },
      {
        title: "Investment Climate: From Sixth to Top Three",
        location: "Single window & district clusters · Statewide",
        date: "2036 milestone",
        achievement:
          "Move from sixth to top three in India’s ease of doing business; compress business start timelines; mainstream ESG in industrial policy.",
        story:
          "MSME clusters, supply-chain finance, export programmes, and quality certification tie large anchor units to local vendors-while logistics, ports, and urban infrastructure absorb the workforce.",
        impact:
          "Predictable regulation and fast approvals attract private capital (70–75% of the ~INR 100 lakh crore cumulative investment envelope), accelerating the USD 1.5 tn economy goal.",
      },
    ],
    themeCards: [
      {
        title: "From Mineral Wealth to Diversified, Productive Prosperity",
        location: "Prosperity for All · Industry, MSMEs & services",
        date: "June 2025",
        achievement:
          "The Vision couples headline GSDP ambition with jobs, exports, and green industrialisation so natural-resource endowment translates into diversified, high-productivity activity-not only raw extraction.",
        story:
          "Manufacturing mega-parks, MSME clusters, logistics, urbanisation, and energy transition are sequenced so workers and small firms capture more value. Ease of doing business and labour welfare move in tandem with investment attraction.",
        impact:
          "Odisha shifts toward employment-intensive, export-linked growth compatible with the Vision’s incremental job creation to 2047.",
      },
      {
        title: "Capital at Scale: Public Catalyst, Private Majority",
        location: "Investment envelope · Statewide & corridors",
        date: "2036–2047",
        achievement:
          "Roughly INR 100 lakh crore cumulative investment to 2047-with 70–75% from the corporate sector-anchors manufacturing, utilities, and services as the largest GSDP multipliers.",
        story:
          "Government focuses on de-risking early infrastructure, social sectors, and facilitation while Vision Bonds and pooled funds channel long-term capital. The theme is confidence: transparent rules, fast land and approvals, and ESG-aligned industry.",
        impact:
          "Sustained capital formation closes the gap between today’s GSDP and the USD 1.5 tn endpoint without sacrificing inclusion or environment.",
      },
    ],
    strategicInitiativeCards: [
      {
        title: "Manufacturing Mission & Mega-Parks",
        location: "Thrust-sector corridors · Multi-district",
        date: "June 2025",
        achievement:
          "1,000–3,000 ha mega-parks with plug-and-play utilities, shared BDS, worker housing, tool rooms, and facilitated land assembly.",
        story:
          "Anchor investors receive predictable plug-in timelines; State holds master planning, environmental compliance, and labour housing so projects move from MOU to production faster.",
        impact:
          "Manufacturing GSVA rank top 5, 2+ green industry hubs live, employment multiplier per crore capex, INR 30+ L cr manufacturing pipeline mobilised.",
      },
      {
        title: "MSME & Export Deepening",
        location: "District clusters · Port-linked nodes",
        date: "2025–2047",
        achievement:
          "Mandatory in-State procurement levers, supply-chain finance, export desks, and global certification for MSME batches.",
        story:
          "Cluster managers connect MSMEs to large-unit BOMs; export insurance and logistics subsidies de-risk first shipments; quality labs cut rejection rates.",
        impact:
          "Odisha export share → 5% by 2036, 7.5% by 2047, MSME formal credit access >60%, new export SKUs per year.",
      },
      {
        title: "EoDB & Workforce Surge",
        location: "CM-GoM · Skill hubs statewide",
        date: "2036 milestone",
        achievement:
          "Regulatory streamlining under Hon’ble CM-led GoM; 30+ lakh workers skilled for advanced manufacturing with safety and social security.",
        story:
          "Single digital compliance calendar, risk-based inspection, and joint skilling with industry ensure workers meet fab, logistics, and green-tech needs.",
        impact:
          "EoDB rank top 3 by 2036, business start <10 days, lost-time injury rate down, apprenticeship throughput up.",
      },
      {
        title: "Industrial Delivery Command",
        location: "State PMO · Investor relations",
        date: "2025–2047",
        achievement:
          "PMO-style milestone tracking for large projects; proactive domestic and global roadshows with post-landing care.",
        story:
          "Red-, amber-, green-status dashboards feed CM office; land, power, and forest clearances are pre-cleared in park envelopes where possible.",
        impact:
          "Median project commissioning months reduced, stranded-asset count down, repeat investors % up year-on-year.",
      },
    ],
    insightsPanel: {
      summary:
        "Prosperity for All scales Odisha from ~USD 113 bn GSDP toward a USD 1.5 trillion economy by 2047, with ~INR 100 lakh crore cumulative investment, 1 crore+ incremental jobs, and urbanisation from 17% to 60%. Manufacturing, mining & metals, logistics, cities, energy, and services form the GSVA spine.",
      keyAchievements: [
        {
          title: "Macro trajectory",
          metricBadge: "GSDP ~USD 113 bn → USD 1.5 tn by 2047",
          description:
            "Executive summary framing ties sectoral targets to national and global benchmarks for Odisha’s middle-income transition.",
          recommendation:
            "Publish an annual investor-ready pipeline book with bankable DPRs and single-window SLAs.",
        },
        {
          title: "Jobs envelope",
          metricBadge: "1 cr+ incremental jobs (directional)",
          description:
            "Employment ambition spans MSME, manufacturing, services, and construction linked to urban and industrial corridor growth.",
          recommendation:
            "Align ITI/placement with anchor tenants in each major industrial park.",
        },
        {
          title: "Urban transition",
          metricBadge: "Urbanisation 17% → 60% by 2047",
          description:
            "City governance, metro rail, housing, and utilities are treated as productivity multipliers, not sprawl.",
          recommendation:
            "Ring-fence municipal own-source revenue reforms and transit-oriented development around major hubs.",
        },
      ],
      areasForImprovement: [
        {
          title: "Investment absorption & land readiness",
          priority: "HIGH",
          gapMetric: "Pipeline vs. commissioned capacity",
          challenge:
            "Large vision numbers require contiguous land, clearances, and power/water ahead of investor roadshows; delays strand GSVA and jobs.",
          recommendation:
            "Land banks with pre-cleared environmental and utility trunking; quarterly “ready-to-build” hectare targets.",
          nextSteps: [
            "Publish district-wise land bank GIS with encumbrance status.",
            "Bundle power-wheeling and water allocation letters with industrial plot allotment.",
            "Track median months from MoU to commercial production by sector.",
          ],
        },
      ],
      keyTrends: [
        {
          direction: "up",
          headline: "Manufacturing & logistics share",
          detail: "Port-rail-road integration lifts tradeable sectors in Vision scenarios.",
        },
        {
          direction: "up",
          headline: "Startup & services depth",
          detail: "IT/ITES and financial services add high-productivity jobs in urban corridors.",
        },
        {
          direction: "neutral",
          headline: "Commodity cycles",
          detail: "Mining & metals GSVA remains sensitive to global prices-diversification reduces volatility.",
        },
      ],
      predictedOutcomes: {
        ifNoAction:
          "GSDP growth undershoots; urban strain rises without matching infrastructure and jobs in secondary cities.",
        ifActionTaken:
          "Odisha can approach the USD 1.5 tn envelope with diversified exports, resilient cities, and 1 cr+ jobs aligned to Vision tables.",
      },
    },
  },

  "tech-lead": {
    title: "Tech Lead",
    documentPillarName: "Technology Leading the Way",
    color: "#8B5CF6",
    overview: {
      summary:
        "Technology Leading the Way positions Odisha for a knowledge-driven economy: startups, research, HEIs as hubs of excellence, and industry–academia partnerships that power semiconductors, electronics, defence manufacturing, IT/ITES, and deep tech. The Vision raises R&D spending, publications, and patents from today’s low base to globally competitive levels by 2047.",
      keyObjectives: [
        "Rank among the top five States on NITI Aayog’s India Innovation Index.",
        "Raise combined public and private R&D expenditure to 3.5% of GSDP by 2047 (2.5% by 2036).",
        "Scale tier-one research publications and patent filings per the Vision outcome tables (including 50,000+ patents annually by 2047).",
        "Operationalise ORIF and strengthen HEI incubation-with targets for startups and women-led ventures.",
        "Attract premier research institutions and deepen industry-driven R&D for advanced manufacturing and digital services.",
      ],
      cards: {
        targetBeneficiaries:
          "Researchers, faculty and students in HEIs, startup founders and teams, IT/ITES and deep-tech workforce, and enterprises adopting R&D and digital tools.",
        geographicCoverage:
          "Statewide digital backbone; universities and CoEs; innovation and GCC-style clusters as envisaged in employment and sector projections.",
        timeline: "June 2025 (Vision unveiled) - innovation milestones 2029 → 2036 → 2047.",
        status: "Active",
      },
    },
    sectorTabCards: [
      {
        title: "Innovation & R&D Intensity Dashboard",
        description:
          "Tracks India Innovation Index rank, R&D as % of GSDP, tier-one publications per million population, and patent velocity-matching Technology Leading the Way outcome tables in the Vision.",
        icon: "barChart",
        keyBenefits: [
          "Public vs private R&D split views",
          "District / institution comparisons",
          "2047 milestone gap alerts",
        ],
      },
      {
        title: "Research Output & ORIF Verification",
        description:
          "Verifies HEI research output, ORIF disbursements, and industry–academia project milestones-supporting the Vision’s ORIF and CoE narrative.",
        icon: "checkCircle",
        keyBenefits: [
          "Grant and milestone attestation",
          "Duplicate funding prevention",
          "IP filing linkage",
        ],
      },
      {
        title: "Startup & Deep-Tech Pipeline Radar",
        description:
          "Highlights sectors with thin startup density, low women-led venture share, or missing deep-tech anchors (semiconductors, electronics, defence)-per high-priority manufacturing vectors.",
        icon: "alertCircle",
        keyBenefits: [
          "Incubation seat and capital gap lists",
          "Women-founder inclusion tracking",
          "Sectoral white-space mapping",
        ],
      },
      {
        title: "Digital Adoption & Talent Observatory",
        description:
          "Monitors IT/ITES and advanced-industry employment, digital skills throughput, and GCC-style ecosystem growth referenced in statewide employment exhibits.",
        icon: "users",
        keyBenefits: [
          "Skills-to-jobs match scores",
          "Employer demand heatmaps",
          "Reskilling campaign triggers",
        ],
      },
    ],
    featureGoalCards: [
      {
        title: "Innovation Index & R&D Intensity",
        location: "HEIs, labs & industry R&D · Statewide",
        date: "June 2025",
        achievement:
          "Reach top five on NITI Aayog’s India Innovation Index; lift R&D spending to 3.5% of GSDP by 2047 (2.5% by 2036); scale tier-one publications and patents per Vision tables.",
        story:
          "HEIs become Centres of Excellence; ORIF funds breakthrough research; industry–academia partnerships address semiconductors, electronics, defence, and green materials-closing the gap where R&D was under 1% of GSDP.",
        impact:
          "Higher knowledge intensity moves Odisha up global value chains and supports the employment shift toward IT/ITES and advanced industries in the Vision’s job projections.",
      },
      {
        title: "Startups, Patents & Women-Led Ventures",
        location: "Incubators & Startup Odisha · District + Bhubaneswar hub",
        date: "2025–2047",
        achievement:
          "Build a deep startup and venture pipeline-including targets for women-led startups-and align patent filings toward 50,000+ annually by 2047.",
        story:
          "Incubation at HEIs, venture investment, and State Startup Ranking improvements create repeatable paths from lab to market, with sectoral focus where Odisha can lead (deep tech, climate tech, advanced manufacturing).",
        impact:
          "Entrepreneurial density raises GSVA in services, attracts GCC-style investment, and diversifies the economy beyond extractives.",
      },
    ],
    themeCards: [
      {
        title: "From Resources to Knowledge-Intensive Value",
        location: "Technology Leading the Way · R&D & advanced industry",
        date: "June 2025",
        achievement:
          "The pillar is the bridge between Odisha’s raw materials and its aspiration to lead in semiconductors, electronics, defence manufacturing, IT/ITES, and deep tech.",
        story:
          "Low historical R&D spend is replaced by ORIF, HEI Centres of Excellence, and industry–academia programmes so discovery and deployment happen in-State-not only in headquarters elsewhere.",
        impact:
          "Higher value capture per tonne of ore and per worker hour moves Odisha up global chains and supports services-led employment in the Vision’s job scenarios.",
      },
      {
        title: "Startups, Patents & Inclusive Innovation Culture",
        location: "HEIs, incubators & venture partners",
        date: "2025–2047",
        achievement:
          "Startup and patent targets in the document are tied to HEI incubation, venture depth, and explicit inclusion of women-led ventures.",
        story:
          "Innovation is treated as a mass participation sport: ranking gains on the State Startup Index, tier-one publications, and annual patent volume are tracked alongside gender diversity in founding teams.",
        impact:
          "A broader entrepreneurial base spreads prosperity beyond capital cities and reduces dependence on a narrow set of industries.",
      },
    ],
    strategicInitiativeCards: [
      {
        title: "HEI-Led Innovation Culture",
        location: "Universities & autonomous colleges",
        date: "June 2025",
        achievement:
          "Centres of Excellence and thematic knowledge hubs graduate researchers who publish and patent on State priority problems.",
        story:
          "Curriculum, lab sharing, and sabbatical industry immersion align HEIs with semiconductor, climate-tech, and advanced manufacturing roadmaps.",
        impact:
          "Tier-1 publications per million population → 2,000 by 2036, 4,000 by 2047, PhD completion rates up, industry co-authored papers share up.",
      },
      {
        title: "Industry–Academia R&D Programmes",
        location: "Applied research centres · Park-adjacent campuses",
        date: "2025–2036",
        achievement:
          "Joint labs and IP agreements so firms co-fund TRL advancement and absorb technology locally.",
        story:
          "Challenge funds invite industry problem statements; HEIs bid with matched faculty time; outputs default to Odisha-first licensing.",
        impact:
          "Higher industrial R&D spend as % of firm revenue, faster tech absorption index, reduced import content in priority products.",
      },
      {
        title: "Odisha Research & Innovation Fund (ORIF)",
        location: "Finance & STI departments",
        date: "2025–2047",
        achievement:
          "Ring-fenced corpus for frontier research, grand challenges, and risky early science with milestone-based disbursement.",
        story:
          "ORIF runs parallel tracks-moonshot, social innovation, and climate-reviewed by independent technical panels with conflict-of-interest rules.",
        impact:
          "R&D intensity → 2.5% GSDP by 2036, 3.5% by 2047, rising private co-funding per ORIF rupee disbursed.",
      },
      {
        title: "Startup & Venture Ecosystem",
        location: "Incubators · Startup Odisha",
        date: "2029–2047",
        achievement:
          "Incubation seats, angel/VC catalysis, and State Startup Ranking climb with women-led venture quotas.",
        story:
          "Founder schools, sandbox regulation for fintech-healthtech, and GCC partnerships provide exit pathways beyond State borders.",
        impact:
          "Startups ’000 → 40 by 2047, jobs from startups → 12 lakh, women-led startups → 50% of total by 2047, patents filed → 50,000/year.",
      },
    ],
    insightsPanel: {
      summary:
        "Tech Lead targets a knowledge economy: R&D intensity from ~0% toward 3.5% of GSDP, Innovation Index rank from 16th to top 5, and patents from hundreds to 50,000/year. Startups, semiconductors, electronics, defence manufacturing, IT/ITES, and HEI–industry partnerships anchor the pathway.",
      keyAchievements: [
        {
          title: "R&D intensity pathway",
          metricBadge: "0% → 3.5% of GSDP (Vision tables)",
          description:
            "Stepped public and private R&D spending aims to close the gap with leading innovation States.",
          recommendation:
            "Create a State R&D matching fund for corporate labs and HEI centres of excellence.",
        },
        {
          title: "Innovation Index climb",
          metricBadge: "Rank 16th → Top 5 by 2047 (directional)",
          description:
            "Milestones at 2029, 2036, and 2047 align policy, procurement, and talent pipelines.",
          recommendation:
            "Mandate challenge-based procurement for deeptech and defence offsets into Odisha startups.",
        },
        {
          title: "IP & startups",
          metricBadge: "Patents 567 → 50,000/year; startups & jobs (Vision)",
          description:
            "Patenting velocity and startup density are treated as compounding assets for semiconductors, electronics, and IT/ITES.",
          recommendation:
            "Fast-track IP cells in each university and subsidise first patent filings for MSMEs.",
        },
      ],
      areasForImprovement: [
        {
          title: "Talent depth vs. ambition",
          priority: "HIGH",
          gapMetric: "PhD & postdoc pipeline vs. 50k patents/year",
          challenge:
            "Without scaling faculty research, fab-adjacent skills, and industry residencies, R&D targets remain aspirational on paper.",
          recommendation:
            "Twin every flagship HEI department with an industry R&D chair and mandatory student startup credits.",
          nextSteps: [
            "Audit semiconductor/electronics skill gaps by district and align ITI/polytechnic tracks.",
            "Fund 500 industry PhDs with joint IP agreements.",
            "Launch a statewide startup–vendor meet for defence and electronics supply chains.",
          ],
        },
      ],
      keyTrends: [
        {
          direction: "up",
          headline: "Startup density",
          detail: "Vision targets thousands of startups and lakhs of jobs from the ecosystem.",
        },
        {
          direction: "up",
          headline: "Industry–academia MoUs",
          detail: "Defence and electronics corridors pull applied research into production.",
        },
        {
          direction: "neutral",
          headline: "Global tech cycles",
          detail: "Semiconductor demand shifts require flexible incentive design and workforce agility.",
        },
      ],
      predictedOutcomes: {
        ifNoAction:
          "Odisha risks remaining a consumer of technology with low patent share and weak deeptech scale-up.",
        ifActionTaken:
          "Top-5 Innovation Index, 3.5% R&D/GSDP, and 50,000 patents/year become plausible with sustained HEI and industry co-investment.",
      },
    },
  },

  legacy: {
    title: "Legacy",
    documentPillarName: "Our Legacy – Our Pride",
    color: "#F59E0B",
    overview: {
      summary:
        "Our Legacy – Our Pride turns heritage, Odia language, and culture into economic opportunity: tourism, crafts, handloom, festivals, and digital heritage platforms strengthen Odia Asmita while creating jobs and revenue. The Vision links Jagannath culture, UNESCO-class heritage, model museums, and destination development to measurable footfall and GSVA contributions.",
      keyObjectives: [
        "Preserve and promote Jagannath culture nationally and globally; develop 100% of identified heritage sites with sustainable financing.",
        "Become a top-five eco-cultural tourism destination in Asia with 15 world-class destinations; scale domestic and foreign arrivals and hotel keys.",
        "Grow artisan and handloom villages, CoEs (e.g. Pattachitra, Dhokra), and digital marketplaces for culture and crafts.",
        "Elevate flagship festivals and Prabasi Odia Divas; expand language policy, research, and artifact conservation.",
        "Create lakhs of direct tourism jobs by 2047 with skilled hospitality and heritage interpretation.",
      ],
      cards: {
        targetBeneficiaries:
          "Artisans, weavers, cultural institutions, youth in heritage skills, tourists (domestic and foreign), and the global Odia diaspora.",
        geographicCoverage:
          "Heritage sites and museums; craft villages; coastal, eco-cultural and spiritual circuits across districts; statewide festival and digital heritage reach.",
        timeline: "June 2025 (Vision unveiled) - tourism and culture targets stepping through 2036 to 2047.",
        status: "Active",
      },
    },
    sectorTabCards: [
      {
        title: "Tourism & Footfall Intelligence Hub",
        description:
          "Live view of domestic and foreign arrivals, length of stay, high-spending visitors, and hotel keys-aligned to Think India, Think Odisha and Vision tourism targets to 2047.",
        icon: "barChart",
        keyBenefits: [
          "Destination-wise load and seasonality",
          "Revenue and employment proxies",
          "Carrying-capacity monitoring",
        ],
      },
      {
        title: "Heritage Asset & Festival Compliance Tracker",
        description:
          "Digital registry for identified heritage sites, museum projects, Jagannath interpretation assets, and flagship festivals (Rath Yatra, Bali Jatra, etc.) with conservation milestones.",
        icon: "checkCircle",
        keyBenefits: [
          "100% site development milestone tracking",
          "PPP and financing milestone proof",
          "Event safety and quality checkpoints",
        ],
      },
      {
        title: "Artisan & Craft Coverage Gap Map",
        description:
          "Surfaces craft villages, CoEs (Pattachitra, Dhokra, handloom), and digital marketplace gaps-supporting the Vision’s culture-economy and Odia Asmita chapters.",
        icon: "alertCircle",
        keyBenefits: [
          "Artisan livelihood priority lists",
          "Export and GI readiness gaps",
          "Heritage village roll-out pacing",
        ],
      },
      {
        title: "Cultural Workforce & Experience Tracker",
        description:
          "Tracks guides, interpreters, hospitality staff, and field teams delivering heritage walks, eco-tourism, and digital heritage experiences across districts.",
        icon: "users",
        keyBenefits: [
          "Quality-of-experience benchmarks",
          "Training and certification gaps",
          "District hosting readiness scores",
        ],
      },
    ],
    featureGoalCards: [
      {
        title: "Premier Tourism: Think India, Think Odisha",
        location: "Eco-cultural circuits · Coastal & heritage destinations",
        date: "June 2025",
        achievement:
          "Top-five eco-cultural hub in Asia with 15 world-class destinations; five crore domestic and seven lakh foreign arrivals; 25,000 star hotel keys and 25 lakh+ direct tourism jobs by 2047.",
        story:
          "Integrated hubs combine beaches, forests, temples, and crafts; carrying-capacity tools prevent overcrowding; high-spending visitor segments are nurtured through quality infrastructure and events (Rath Yatra, Bali Jatra, Prabasi Odia Divas).",
        impact:
          "Tourism GSVA and employment diversify the economy while global visibility reinforces investment and diaspora remittance-led development in the Vision.",
      },
      {
        title: "Odia Asmita: Heritage, Crafts & Language",
        location: "Craft villages & museums · All districts",
        date: "2025–2047",
        achievement:
          "100% of identified heritage sites developed with sustainable finance; global recognition for tangible/intangible heritage; model museums and digital heritage platforms at lakhs of annual visits.",
        story:
          "Pattachitra, Dhokra, handloom CoEs, Asmita/Sanskruti Bhawans, Jagannath Interpretation Centre, and Odia language policy turn culture into livelihoods without diluting identity.",
        impact:
          "Culture-related services multiply revenue (Vision directional 10× path), employ youth and women artisans, and strengthen soft power for Odisha globally.",
      },
    ],
    themeCards: [
      {
        title: "Identity and GDP: Culture as Economic Strategy",
        location: "Our Legacy – Our Pride · Heritage & tourism",
        date: "June 2025",
        achievement:
          "The Vision rejects a false choice between modernisation and Odia identity: Rath Yatra, crafts villages, UNESCO-class pathways, and creative industries are integrated into measurable GSVA.",
        story:
          "Jagannath culture, handloom and handicraft CoEs, heritage sites, and festivals are not nostalgia projects-they are exportable experiences and livelihood platforms for lakhs of artisans and hospitality workers.",
        impact:
          "Pride and prosperity reinforce each other: global visitors and diaspora engagement fund conservation and jobs at home.",
      },
      {
        title: "Digital Heritage: Scale Without Losing Soul",
        location: "Museums, temples & artisan marketplaces",
        date: "2025–2047",
        achievement:
          "Virtual tours, temple management systems, and unified e-commerce for crafts are explicit scaling levers in the Vision.",
        story:
          "Technology extends reach-five lakh+ annual digital visits, interpretation centres, and online sales-while physical conservation and language policy keep authenticity intact.",
        impact:
          "Smaller towns and artisans access national and global demand without migrating; culture revenue grows on a measurable trajectory to 2047.",
      },
    ],
    strategicInitiativeCards: [
      {
        title: "Crafts Economy & Centres of Excellence",
        location: "Handloom & handicraft villages · District CoEs",
        date: "June 2025",
        achievement:
          "Model villages and CoEs (Pattachitra, Dhokra, brass/bell metal) with Asmita/Sanskruti Bhawans and G2G cultural exchanges.",
        story:
          "Artisans receive design IP, loom upgrades, and e-commerce onboarding; tourism circuits schedule fixed buying days to stabilise income.",
        impact:
          "Target INR 700 Cr annual craft revenue, artisan jobs bank fill-rate, export order growth %, GI registrations added.",
      },
      {
        title: "Heritage & Museums Programme",
        location: "State monuments · Jagannath precinct",
        date: "2036 milestone",
        achievement:
          "20+ globally spotlighted sites, five technology-enabled model museums, Shree Jagannath Museum & Interpretation Centre, themed heritage villages.",
        story:
          "PPP conservation, 3D documentation, and night tourism pilots extend dwell time; virtual tours feed global marketing funnels.",
        impact:
          "UNESCO-type listings ↑, museum footfall ↑, heritage employment FTEs ↑, satisfaction scores on visitor surveys.",
      },
      {
        title: "Festivals & Events Calendar",
        location: "Statewide circuit · Puri to western Odisha",
        date: "2025–2047",
        achievement:
          "Year-round calendar engineered to capture ≥10% of tourist footfall; Rath Yatra, Bali Jatra, Dhanu Yatra, Khandagiri Mela upgraded; Prabasi Odia Divas biennial global draw.",
        story:
          "Event OS handles crowd, safety, waste, and vendor formalisation; diaspora chapters co-host satellite editions abroad.",
        impact:
          "Festival-attributed room-nights ↑, high-spending tourist share ↑, local vendor GST registrations ↑.",
      },
      {
        title: "Odia Language, Research & Artifacts",
        location: "Culture department · Digital archive",
        date: "2025–2047",
        achievement:
          "Policy, financing, and expert advisory for language, research, and artifact collection with sustainable financing cell.",
        story:
          "Grants for lexicography, oral history, and tribal scripts; digitised corpus feeds education and tourism interpretation layers.",
        impact:
          "Odia learning resources indexed, artifact digitisation %, research publications on Odisha studies ↑, diaspora engagement KPIs.",
      },
    ],
    insightsPanel: {
      summary:
        "Legacy turns culture, language, and heritage into economic multipliers: a 10× trajectory for culture/heritage-related GSVA, rising UNESCO-class listings, and scaled tourist footfall. Jagannath culture, crafts, handloom, festivals, and digital heritage platforms reinforce Odia Asmita while creating jobs.",
      keyAchievements: [
        {
          title: "Culture GSVA multiplier",
          metricBadge: "10× revenue from culture/heritage services (directional)",
          description:
            "Vision tables link museums, destinations, and creative industries to measurable GSVA-not only footfall counts.",
          recommendation:
            "Package heritage circuits with homestay standards and artisan e-commerce on a single tourism OS.",
        },
        {
          title: "UNESCO & heritage capital",
          metricBadge: "Rising tangible & intangible listings to 2047",
          description:
            "Stepped dossiers for sites, crafts, and festivals build global brand equity and conservation finance.",
          recommendation:
            "Create a State heritage dossier office with legal and community consent workflows.",
        },
        {
          title: "Tourist arrivals",
          metricBadge: "Domestic & foreign targets scaled in Vision tables",
          description:
            "Connectivity upgrades and event marketing lift arrivals when paired with sanitation, safety, and interpretation.",
          recommendation:
            "Air/rail peak-season capacity plans tied to crowd management and local vendor licensing.",
        },
      ],
      areasForImprovement: [
        {
          title: "Visitor experience & carrying capacity",
          priority: "MEDIUM",
          gapMetric: "Service quality vs. footfall growth",
          challenge:
            "Rapid footfall without waste, mobility, and crowd plans can damage sites and dilute premium positioning.",
          recommendation:
            "Mandate carrying-capacity studies and timed entry for mega festivals; invest in multilingual guides.",
          nextSteps: [
            "Pilot smart queuing and real-time occupancy at Puri-class destinations.",
            "Train 10,000 certified local guides and interpreters.",
            "Link CSR to heritage upkeep with audited maintenance ledgers.",
          ],
        },
      ],
      keyTrends: [
        {
          direction: "up",
          headline: "Spiritual & cultural tourism",
          detail: "Integrated circuits lift average stay and spend in Vision scenarios.",
        },
        {
          direction: "up",
          headline: "Handloom & crafts exports",
          detail: "GI-tagged products gain from e-commerce and design collaborations.",
        },
        {
          direction: "neutral",
          headline: "Seasonality",
          detail: "Monsoon and festival peaks require year-round programming to smooth revenues.",
        },
      ],
      predictedOutcomes: {
        ifNoAction:
          "Heritage assets face congestion and wear without commensurate revenue capture for communities.",
        ifActionTaken:
          "10× culture GSVA and UNESCO momentum become credible with disciplined destination management and digital storytelling.",
      },
    },
  },

  governance: {
    title: "Governance",
    documentPillarName: "People-Centric Governance",
    color: "#1E3A8A",
    overview: {
      summary:
        "People-Centric Governance is the delivery backbone: transparent, digital-first public services, disaster resilience, and institutional reform so every citizen receives services with dignity, speed, and accountability. The Vision targets leading ranks on good-governance and SDG indices, full mandatory e-services on Odisha One, near-zero grievance pendency, and representative policing.",
      keyObjectives: [
        "Lead on DARPG’s Good Governance Index and rank in the top three on India’s SDG Index.",
        "Deliver 100% mandatory e-services through Odisha One and advance paperless administration.",
        "Achieve near-zero grievance pendency via centralised, accountable redress systems.",
        "Modernise land administration (faceless, seamless) and strengthen empathetic, citizen-centric law and order-including ≥50% women in the police force by 2047.",
        "Scale disaster management and real-time governance capacity for climate-resilient, rapid response.",
      ],
      cards: {
        targetBeneficiaries:
          "All residents and businesses using public services; grievance petitioners; communities in disaster-prone areas; civil servants and frontline delivery staff.",
        geographicCoverage:
          "Entire state-state, district, and local institutions; unified digital platforms and last-mile service points in all 30 districts.",
        timeline: "June 2025 (Vision unveiled) - continuous reform and digitisation through 2036–2047 horizons.",
        status: "Active",
      },
    },
    sectorTabCards: [
      {
        title: "Odisha One & E-Service Delivery Deck",
        description:
          "Monitors mandatory service availability, transaction success, and digital uptake on Odisha One-supporting the Vision goal of 100% mandatory e-services and paperless administration.",
        icon: "barChart",
        keyBenefits: [
          "Department-wise digital saturation",
          "Citizen journey funnel views",
          "SLA breach alerting",
        ],
      },
      {
        title: "Benefit & Entitlement Verification Layer",
        description:
          "Digital verification for social security, land-related services, and business licences-reducing fraud and aligning with faceless, seamless governance in the Vision.",
        icon: "checkCircle",
        keyBenefits: [
          "Aadhaar / DigiLocker-linked proofs",
          "Duplicate beneficiary detection",
          "Audit-ready service trails",
        ],
      },
      {
        title: "Grievance & Land Pendency Radar",
        description:
          "Surfaces backlog pockets for public grievances, land mutations, and court-linked land disputes-toward near-zero pendency targets in the Vision.",
        icon: "alertCircle",
        keyBenefits: [
          "Escalation and root-cause tagging",
          "District officer accountability views",
          "Disaster-period surge monitoring",
        ],
      },
      {
        title: "Disaster & Policing Field Response Tracker",
        description:
          "Tracks response times, asset readiness, and gender representation in policing (≥50% women by 2047)-linking disaster management and empathetic law-and-order chapters.",
        icon: "users",
        keyBenefits: [
          "Incident-to-response timelines",
          "Force diversity dashboards",
          "Relief and resilience deployment maps",
        ],
      },
    ],
    featureGoalCards: [
      {
        title: "Seamless Digital Public Services",
        location: "Odisha One · All departments & districts",
        date: "June 2025",
        achievement:
          "Deliver 100% mandatory e-services on Odisha One; advance paperless administration; target leading rank on DARPG Good Governance Index and top three on India SDG Index.",
        story:
          "Faceless land workflows, saturated citizen and business services, and continuous capability building replace queue culture with predictable, auditable delivery-freeing time for productive activity.",
        impact:
          "Trust in government raises compliance, speeds investment, and ensures social schemes reach intended beneficiaries-critical for the Vision’s inclusion and growth dual goals.",
      },
      {
        title: "Grievance Zero & Resilient Response",
        location: "State control room · District magistrates",
        date: "2025–2047",
        achievement:
          "Near-zero grievance pendency; empathetic, accountable policing with ≥50% women in the force by 2047; disaster response aligned to climate resilience.",
        story:
          "Centralised grievance spine, land-record reforms, and real-time disaster coordination build on Odisha’s known disaster model while modernising law and order for citizen dignity.",
        impact:
          "Faster redress and safer communities reduce friction costs for business and households, underpinning Odisha’s reputation as India’s trusted capital and governance destination.",
      },
    ],
    themeCards: [
      {
        title: "Delivery Institutions as the Real Competitive Advantage",
        location: "People-Centric Governance · Land, police, grievance, disaster",
        date: "June 2025",
        achievement:
          "The Vision states that trillion-dollar goals require institutions that deliver: land records, policing, grievances, and disaster response must match private-sector expectations of speed and fairness.",
        story:
          "Faceless land workflows, Odisha One saturation, centralised grievance redress, and climate-ready disaster systems are not back-office issues-they determine whether citizens trust the State and whether firms invest.",
        impact:
          "Lower transaction costs and faster justice-equivalent service raise both citizen welfare and investor confidence.",
      },
      {
        title: "Trust as Capital: Digital, Empathetic, Accountable",
        location: "State & district administration · All 30 districts",
        date: "2036–2047",
        achievement:
          "Governance reform is tied to capital attraction: predictable, digital, and empathetic administration rewards both households and investors.",
        story:
          "DARPG and SDG index ambitions, near-zero grievance pendency, and representative policing (including women’s share in the force) signal that Odisha competes on governance quality-not only on subsidies.",
        impact:
          "A trustworthy State lowers risk premia for projects and social programmes alike, compounding the Vision’s growth and inclusion goals.",
      },
    ],
    strategicInitiativeCards: [
      {
        title: "Faceless, Seamless Land Administration",
        location: "Revenue & disaster departments · All tehsils",
        date: "June 2025",
        achievement:
          "End-to-end digital mutation, map-based records, and service-level timelines that remove rent-seeking touchpoints.",
        story:
          "Citizens and firms track applications like parcels; integration with courts and banks cuts duplicate disputes; field surveys use drone+GIS verification.",
        impact:
          "Mutation TAT down %, bribe reports down, registered transactions up, farmer land collateralisation up.",
      },
      {
        title: "Empathetic Law & Order",
        location: "Police & traffic directorates",
        date: "2025–2047",
        achievement:
          "Community policing, bias training, and diversity hiring so force reflects population-including ≥50% women by 2047.",
        story:
          "ERSS-112, women help-desks, and body-worn pilot programmes pair with mental-health support for personnel; data dashboards track response equity.",
        impact:
          "911/112 response minutes ↓, public trust index ↑, women officer share trajectory on plan, custodial complaints ↓.",
      },
      {
        title: "Centralised Grievance Management",
        location: "CM grievance cell · Line departments",
        date: "2036 milestone",
        achievement:
          "Single spine for intake, routing, escalation, and closure with near-zero pendency as Vision outcome.",
        story:
          "NLP triage, root-cause tagging, and officer accountability scores feed into annual performance; repeat grievance themes trigger policy fixes.",
        impact:
          "Median resolution days ↓, reopen rate ↓, citizen satisfaction % ↑, top-3 SDG index rank path.",
      },
      {
        title: "Paperless Odisha & Saturated E-Services",
        location: "Odisha One · 100% mandatory services",
        date: "2025–2047",
        achievement:
          "Every mandatory service API-available, mobile-first, and auditable; continuous capability uplift for frontline staff.",
        story:
          "Department digitisation charters include change management; common payment, signature, and document vault reduce repeat uploads.",
        impact:
          "Digital transaction share → 100% mandatory, department SLA adherence %, DARPG Good Governance Index rank → leading State, cost-per-transaction ↓.",
      },
    ],
    insightsPanel: {
      summary:
        "Governance is the delivery backbone: 100% mandatory e-services on Odisha One, near-zero grievance pendency, top-tier good-governance and SDG ranks, and ≥50% women in police. Transparency, disaster resilience, and institutional reform underpin every other pillar.",
      keyAchievements: [
        {
          title: "Digital service envelope",
          metricBadge: "100% mandatory services via Odisha One by 2047",
          description:
            "Single-window access reduces cost, time, and discretion for citizens and businesses.",
          recommendation:
            "Publish API catalogues and third-party audit of uptime and transaction success rates.",
        },
        {
          title: "Grievance redressal",
          metricBadge: "Near-zero pendency (Vision outcome)",
          description:
            "Time-bound closure builds trust and cuts repeat escalations across departments.",
          recommendation:
            "Automated escalation to Secretary-level for breaches beyond statutory timelines.",
        },
        {
          title: "Representative policing",
          metricBadge: "Women in police ≥ 50%",
          description:
            "Inclusive law enforcement improves reporting on gender crimes and community trust.",
          recommendation:
            "Fast-track recruitment, retention, and station-level facilities for women officers.",
        },
      ],
      areasForImprovement: [
        {
          title: "Last-mile digital inclusion",
          priority: "HIGH",
          gapMetric: "Connectivity & literacy vs. 100% e-services",
          challenge:
            "Mandatory online services can exclude vulnerable users without assisted service centres, voice interfaces, and reliable connectivity.",
          recommendation:
            "Mandate assisted service counters in every GP and urban ward with biometric fallback.",
          nextSteps: [
            "Map uncovered villages for 4G/fibre and satellite backhaul where needed.",
            "Train 50,000 digital saksham frontline workers for Odisha One navigation.",
            "Localise top 50 services into Odia voice-first flows.",
          ],
        },
      ],
      keyTrends: [
        {
          direction: "up",
          headline: "Transaction digitisation",
          detail: "Share of G2C and G2B payments on digital rails rises in Vision metrics.",
        },
        {
          direction: "up",
          headline: "Disaster resilience integration",
          detail: "Early warning and last-mile drills embedded in panchayat plans.",
        },
        {
          direction: "neutral",
          headline: "Cybersecurity load",
          detail: "Full digital delivery increases need for zero-trust and citizen data protection.",
        },
      ],
      predictedOutcomes: {
        ifNoAction:
          "Service exclusion and grievance backlogs could widen trust deficits despite portal launches.",
        ifActionTaken:
          "Odisha can reach leading-State ranks on good governance and SDG indices with universal, dignified digital access.",
      },
    },
  },
};

export function getPillarContent(slug) {
  return pillarContentBySlug[slug] || null;
}

export function getAllPillarSummaries() {
  return PILLAR_ORDER.map((slug) => {
    const p = pillarContentBySlug[slug];
    return {
      slug,
      title: p.title,
      color: p.color,
      documentPillarName: p.documentPillarName,
      overviewPreview: p.overview.summary,
    };
  });
}
