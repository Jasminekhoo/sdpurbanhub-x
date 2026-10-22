export const PRODUCT_INFO = {
  name: 'UrbanHub-X',
  tagline: 'Care that responds. A community that includes everyone.',
  track: 'Sime Darby Property Hackathon — People Track',
  mission: 'UrbanHub-X helps a residential community respond to residents who need support—including elderly people, children, and OKU residents—without making smartphone ownership a requirement.'
};

export const DEMO_ACCOUNTS = {
  resident: {
    email: 'resident@livincare.demo',
    password: 'Resident123!',
    role: 'user',
    name: 'Alex Chen',
    relationship: 'Head of Household / Family Caregiver',
    property: 'Aster Residence',
    unit: 'Tower B · Unit 12-08',
    phone: '+60 12-389 4521',
    emergencyContact: 'Elena Chen (+60 12-998 1234)',
    card: {
      number: 'NFC-8821-AR',
      token: 'TK-8821-99B4',
      status: 'Active', // 'Active' | 'Temporarily Blocked'
      lastTapped: 'Today, 08:42 AM (Tower B Turnstile #2)',
      registeredDate: '12 Oct 2025'
    }
  },
  admin: {
    email: 'admin@livincare.demo',
    password: 'Admin123!',
    role: 'admin',
    name: 'Sarah Wong',
    roleTitle: 'Duty Operations Manager',
    staffId: 'SDP-MGR-042',
    property: 'Aster Residence Operations Console'
  }
};

export const FAMILY_DEPENDANTS = [
  {
    id: 'dep-1',
    name: 'Robert Chen',
    relation: 'Elderly Parent (Age 74)',
    category: 'Elderly resident',
    unit: 'Tower B · Unit 12-08',
    primaryDevice: 'Home Console / Help Point (No smartphone)',
    accessibilityNeed: 'Mobility support & gentle ramp access',
    consentStatus: 'Consent Granted by Resident',
    activeRequest: null
  },
  {
    id: 'dep-2',
    name: 'Chloe Chen',
    relation: 'Child (Age 9)',
    category: 'Child',
    unit: 'Tower B · Unit 12-08',
    primaryDevice: 'NFC Smart Tag Keyfob',
    accessibilityNeed: 'Escort & perimeter safety check',
    consentStatus: 'Parental Consent Active',
    activeRequest: null
  }
];

export const STAFF_RESPONDERS = [
  { id: 'st-1', name: 'Officer Farhan', role: 'Security & Rapid Response Lead' },
  { id: 'st-2', name: 'Zul', role: 'Facilities & Maintenance' },
  { id: 'st-3', name: 'Nurse Sarah', role: 'Community First Aid & Care' },
  { id: 'st-4', name: 'Mei Ling', role: 'Resident Concierge & Support' },
  { id: 'st-5', name: 'Faizal', role: 'Accessibility & Grounds Officer' }
];

export const INITIAL_REQUESTS = [
  {
    id: 'LC-1001',
    type: 'SOS',
    category: 'Medical or urgent assistance',
    who: 'Elderly resident',
    personName: 'Robert Chen (via Home Console)',
    description: 'Elderly parent felt sudden dizziness near kitchen; triggered Home Console SOS button.',
    location: 'Home unit (Tower B · Unit 12-08)',
    priority: 'Urgent',
    residentName: 'Alex Chen',
    unit: 'Tower B · Unit 12-08',
    createdAt: '2026-10-17T11:20:00.000Z',
    status: 'Assistance on the way', // 'Received' | 'Assigned' | 'Assistance on the way' | 'Resolved'
    assignedTo: 'Nurse Sarah (Community First Aid & Care)',
    activityHistory: [
      {
        action: 'Case Received',
        actorRole: 'Home Console SOS Trigger',
        timestamp: '17 Oct 2026, 11:20 AM',
        note: 'Urgent Home Console SOS broadcast for elderly resident Robert Chen.'
      },
      {
        action: 'Alert Acknowledged',
        actorRole: 'Admin Console',
        timestamp: '17 Oct 2026, 11:21 AM',
        note: 'Duty Manager acknowledged incident; dispatched first aid.'
      },
      {
        action: 'Assigned Responder',
        actorRole: 'Admin Console',
        timestamp: '17 Oct 2026, 11:23 AM',
        note: 'Nurse Sarah assigned with on-site first aid kit.'
      },
      {
        action: 'Status Updated to Assistance on the way',
        actorRole: 'Admin Console',
        timestamp: '17 Oct 2026, 11:24 AM',
        note: 'Responder en route to Level 12.'
      }
    ]
  },
  {
    id: 'LC-1000',
    type: 'Accessibility',
    category: 'Mobility or accessibility assistance',
    who: 'Person with disability (OKU)',
    personName: 'Encik Harun',
    description: 'Temporary ramp deployment requested at Tower B lobby entrance for wheelchair access.',
    location: 'Lobby',
    priority: 'Normal',
    residentName: 'Encik Harun',
    unit: 'Tower B · Unit 04-11',
    createdAt: '2026-10-16T14:15:00.000Z',
    status: 'Resolved',
    assignedTo: 'Zul (Facilities & Maintenance)',
    activityHistory: [
      {
        action: 'Case Received',
        actorRole: 'Resident App',
        timestamp: '16 Oct 2026, 02:15 PM',
        note: 'OKU accessibility request submitted for lobby ramp setup.'
      },
      {
        action: 'Assigned Responder',
        actorRole: 'Admin Console',
        timestamp: '16 Oct 2026, 02:30 PM',
        note: 'Assigned Zul for facility deployment.'
      },
      {
        action: 'Status Updated to Resolved',
        actorRole: 'Admin Console',
        timestamp: '16 Oct 2026, 04:40 PM',
        note: 'Temporary ramp deployed and safety slope verified.'
      }
    ]
  },
  {
    id: 'LC-0998',
    type: 'Facility',
    category: 'Damaged ramp / accessibility barrier',
    who: 'Myself',
    personName: 'Kavitha R.',
    description: 'Clubhouse level 3 accessible lift button sensitivity issue reported.',
    location: 'Lift',
    priority: 'Normal',
    residentName: 'Kavitha R.',
    unit: 'Tower A · Unit 08-02',
    createdAt: '2026-10-15T09:00:00.000Z',
    status: 'Assigned',
    assignedTo: 'Faizal (Accessibility & Grounds Officer)',
    activityHistory: [
      {
        action: 'Case Received',
        actorRole: 'Resident App',
        timestamp: '15 Oct 2026, 09:00 AM',
        note: 'Facility issue logged via Report an Issue.'
      },
      {
        action: 'Assigned Responder',
        actorRole: 'Admin Console',
        timestamp: '15 Oct 2026, 09:45 AM',
        note: 'Lift contractor notified for scheduled inspection.'
      }
    ]
  }
];

export const INITIAL_FACILITY_REPORTS = [
  {
    id: 'FAC-201',
    category: 'Damaged ramp / accessibility barrier',
    location: 'Tower B Podium Walkway',
    description: 'Rubber anti-slip tread coming loose near wheelchair turning corner.',
    status: 'In Progress',
    reportedBy: 'Alex Chen',
    reportedAt: '17 Oct 2026, 09:15 AM'
  },
  {
    id: 'FAC-200',
    category: 'Broken lighting',
    location: 'Basement 1 Car Park (Bay 42-48)',
    description: 'Two overhead LED battens flickering; dark patch near disabled parking bay.',
    status: 'Scheduled',
    reportedBy: 'Tan Sri Lim',
    reportedAt: '16 Oct 2026, 06:30 PM'
  },
  {
    id: 'FAC-198',
    category: 'Lift out of service',
    location: 'Tower A Service Lift #3',
    description: 'Lift showing door sensor calibration fault code.',
    status: 'Resolved',
    reportedBy: 'Guardhouse Desk',
    reportedAt: '15 Oct 2026, 11:00 AM'
  }
];

export const NFC_RECORDS = [
  {
    cardId: 'TK-8821-99B4',
    residentName: 'Alex Chen',
    unit: 'Tower B · Unit 12-08',
    status: 'Active',
    lastEvent: 'Turnstile #2 Tap (Valid)'
  },
  {
    cardId: 'TK-4412-11A0',
    residentName: 'Robert Chen',
    unit: 'Tower B · Unit 12-08',
    status: 'Active',
    lastEvent: 'Ground Floor Lobby Door (Valid)'
  },
  {
    cardId: 'TK-9023-77F2',
    residentName: 'Chloe Chen (Keyfob)',
    unit: 'Tower B · Unit 12-08',
    status: 'Active',
    lastEvent: 'Playground Gate Tap (Valid)'
  },
  {
    cardId: 'TK-3319-55D8',
    residentName: 'Encik Harun',
    unit: 'Tower B · Unit 04-11',
    status: 'Active',
    lastEvent: 'Accessible Lift Reader (Valid)'
  }
];

export const RESIDENT_SUPPORT_LIST = [
  {
    id: 'sup-1',
    name: 'Robert Chen',
    unit: 'Tower B · Unit 12-08',
    category: 'Elderly resident',
    supportProfile: 'Requires step-free route; prefers voice/in-person response.',
    hasHomeConsole: true,
    familyCaregiver: 'Alex Chen (Son)',
    consentActive: true
  },
  {
    id: 'sup-2',
    name: 'Chloe Chen',
    unit: 'Tower B · Unit 12-08',
    category: 'Child',
    supportProfile: 'Authorized for compound play; notify parent on security tag ping.',
    hasHomeConsole: true,
    familyCaregiver: 'Alex Chen (Father)',
    consentActive: true
  },
  {
    id: 'sup-3',
    name: 'Encik Harun',
    unit: 'Tower B · Unit 04-11',
    category: 'Person with disability (OKU)',
    supportProfile: 'Wheelchair user; ramp assistance during heavy rain.',
    hasHomeConsole: false,
    familyCaregiver: 'Nurul Harun (Daughter)',
    consentActive: true
  }
];

export const SUSTAINABILITY_KPIS = [
  {
    title: 'Issues Reported & Resolved',
    value: '48 / 52',
    unit: 'cases',
    badge: 'Illustrative Prototype Indicator',
    description: 'Community facility and proactive accessibility issues successfully closed.'
  },
  {
    title: 'Digital Reports (Paper Reduction)',
    value: '310',
    unit: 'sheets avoided',
    badge: 'Illustrative Prototype Indicator',
    description: 'Replaces physical carbon incident logbooks and paper concierge chits.'
  },
  {
    title: 'Accessibility Issues Addressed',
    value: '19',
    unit: 'barriers resolved',
    badge: 'Illustrative Prototype Indicator',
    description: 'Wheelchair ramp adjustments, sensory tactile guide fixes, lift buttons.'
  },
  {
    title: 'Assistance Requests Completed',
    value: '84',
    unit: 'support dispatches',
    badge: 'Illustrative Prototype Indicator',
    description: 'Senior citizen check-ins, medical first-aid response, OKU ramp deploys.'
  }
];

// Basic Mall Concept Preview Data (Section 7)
export const MALL_CONCEPT = {
  name: 'KL East Mall & Retail Hub',
  operator: 'Sime Darby Property Retail Division',
  categories: [
    { id: 'c1', name: 'Concierge & Information', icon: 'HelpCircle', desc: 'Customer service counter at Main Atrium L1' },
    { id: 'c2', name: 'Accessibility & Mobility Loan', icon: 'Accessibility', desc: 'Complimentary wheelchair, motorized scooter & pram loans' },
    { id: 'c3', name: 'Safe Escort to Parking', icon: 'Shield', desc: 'Security escort assistance for seniors, OKU, and lone shoppers' },
    { id: 'c4', name: 'Lost Child / Family Meetpoint', icon: 'Users', desc: 'Designated safe family reconnection point at Customer Care' }
  ]
};
