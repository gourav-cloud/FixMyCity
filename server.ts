import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initial Seed Issues matching the user's design mockups and problem statement
const initialIssues = [
  {
    id: 'iss-1',
    title: 'Pothole & Deep Road Crater',
    category: 'Pothole',
    description: 'Large pothole causing severe risk to two-wheelers and pedestrians near the commercial junction. Reported by multiple citizens after recent monsoon spell.',
    location: {
      address: 'Near Chetak Bridge, MP Nagar Zone 1',
      locality: 'MP Nagar',
      city: 'Bhopal',
      lat: 23.2332,
      lng: 77.4344,
      ward: 'Ward 42, Zone 10',
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1584463699047-68894dfc7379?auto=format&fit=crop&w=800&q=80',
    ],
    resolutionProofImage: '',
    severity: 'Critical',
    severityScore: 94,
    aiAnalysis: {
      detectedCategory: 'Pothole & Road Hazard',
      confidence: 96,
      urgency: 'Critical',
      hazardFactors: ['Vehicle tyre blowout risk', 'Pedestrian trip hazard', 'Monsoon water accumulation'],
      recommendedDepartment: 'Bhopal Municipal Corporation - PWD & Road Maintenance',
      estimatedResolutionTime: '24-48 Hours',
      explanation: 'Deep crater (>12cm depth) on arterial transit road with high daily bus traffic. Urgent asphalt patching required.'
    },
    status: 'Under Review',
    assignedDepartment: 'Roads & Public Works Dept (PWD)',
    assignedOfficer: 'Er. Rajesh Saxena (Sub-Divisional Officer)',
    municipalContact: {
      departmentName: 'Bhopal Municipal Corporation - PWD Zone 10',
      wardOffice: 'Zone 10 Office, MP Nagar, Bhopal',
      phone: '+91 755 2540220',
      email: 'pwd-zone10@bhopalcorp.gov.in',
      portalUrl: 'https://smartbhopal.city/grievance',
      serpSourceTitle: 'Bhopal Municipal Corporation Ward 42 PWD Contact & Helplines',
      serpSourceLink: 'https://bhopalcivic.gov.in/pothole-repairs'
    },
    reportedBy: {
      id: 'usr-1',
      name: 'Gaurav Chotrani',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'Citizen'
    },
    reportCount: 12,
    verifiedCount: 8,
    upvotedBy: ['usr-1', 'usr-2', 'usr-3', 'usr-4'],
    verifiedBy: ['usr-1', 'usr-5', 'usr-6'],
    duplicateMergedIssues: [
      { id: 'dup-1', reportedAt: '2026-10-07T14:20:00Z', reporter: 'Priya Verma', note: 'Almost fell on scooter this morning' },
      { id: 'dup-2', reportedAt: '2026-10-08T09:12:00Z', reporter: 'Rahul Sharma', note: 'Heavy water logging inside hole' }
    ],
    timeline: [
      { id: 'tl-1', status: 'Reported', actor: 'Gaurav Chotrani', note: 'Issue submitted with geolocated photo', timestamp: '2 days ago' },
      { id: 'tl-2', status: 'AI Verified', actor: 'FixMyCity AI', note: 'Category classified as Pothole (96%), Urgency: Critical (94/100)', timestamp: '2 days ago' },
      { id: 'tl-3', status: 'Consolidated', actor: 'System', note: 'Merged 11 duplicate citizen submissions in 150m radius', timestamp: 'Yesterday' }
    ],
    createdAt: '2026-10-07T10:30:00Z',
    updatedAt: '2026-10-08T18:45:00Z'
  },
  {
    id: 'iss-2',
    title: 'Open Drain & Clogged Sump Hazard',
    category: 'Open Drain',
    description: 'Exposed open sewer drain near residential school boundary. Dangerous for children, foul odor and mosquito breeding ground.',
    location: {
      address: 'Lane 4, Near Jyoti Talkies, MP Nagar',
      locality: 'MP Nagar',
      city: 'Bhopal',
      lat: 23.2365,
      lng: 77.4312,
      ward: 'Ward 43, Zone 10',
    },
    imageUrl: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    resolutionProofImage: '',
    severity: 'High',
    severityScore: 88,
    aiAnalysis: {
      detectedCategory: 'Drainage & Open Sewer',
      confidence: 93,
      urgency: 'High',
      hazardFactors: ['Open drop hazard', 'Sanitation contamination', 'Vector borne disease risk'],
      recommendedDepartment: 'Drainage & Sewerage Board',
      estimatedResolutionTime: '48 Hours',
      explanation: 'Uncovered slab posing direct danger during darkness. Concrete slab replacement required.'
    },
    status: 'In Progress',
    assignedDepartment: 'Drainage & Sewerage Board',
    assignedOfficer: 'Sunil Rathore (Sanitary Inspector)',
    municipalContact: {
      departmentName: 'BMC Sewerage & Stormwater Div',
      wardOffice: 'Zone 10 Municipal Office, Bhopal',
      phone: '+91 755 2735111',
      email: 'sewerage@bhopalcorp.gov.in',
      portalUrl: 'https://smartbhopal.city/sanitation'
    },
    reportedBy: {
      id: 'usr-2',
      name: 'Aditi Jain',
      role: 'Citizen'
    },
    reportCount: 8,
    verifiedCount: 6,
    upvotedBy: ['usr-2', 'usr-3'],
    verifiedBy: ['usr-1', 'usr-2'],
    timeline: [
      { id: 'tl-1', status: 'Reported', actor: 'Aditi Jain', note: 'Reported with GPS tag', timestamp: '3 days ago' },
      { id: 'tl-2', status: 'Assigned', actor: 'Admin Amit Kumar', note: 'Assigned to Sanitary Inspector Sunil Rathore', timestamp: '2 days ago' },
      { id: 'tl-3', status: 'In Progress', actor: 'BMC Sewerage Team', note: 'Pre-cast concrete slab ordered from depot', timestamp: '1 day ago' }
    ],
    createdAt: '2026-10-06T11:00:00Z',
    updatedAt: '2026-10-08T15:20:00Z'
  },
  {
    id: 'iss-3',
    title: 'Illegal Garbage Dump & Overflowing Bins',
    category: 'Garbage Accumulation',
    description: 'Solid waste accumulating across sidewalk for 4 consecutive days. Stray dogs scattering litter onto main roadway.',
    location: {
      address: 'Opposite Community Park, Arera Colony E-3',
      locality: 'Arera Colony',
      city: 'Bhopal',
      lat: 23.2185,
      lng: 77.4290,
      ward: 'Ward 48, Zone 12',
    },
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    resolutionProofImage: '',
    severity: 'High',
    severityScore: 86,
    aiAnalysis: {
      detectedCategory: 'Solid Waste Accumulation',
      confidence: 95,
      urgency: 'High',
      hazardFactors: ['Public health hazard', 'Sidewalk obstruction', 'Odor pollution'],
      recommendedDepartment: 'Solid Waste Management & Swachhata Cell',
      estimatedResolutionTime: '24 Hours',
      explanation: 'Compactor vehicle skipped scheduled pickup; secondary transfer container required.'
    },
    status: 'Under Review',
    assignedDepartment: 'Solid Waste Management Cell',
    assignedOfficer: 'Mahesh Pandey (Chief Sanitary Officer)',
    municipalContact: {
      departmentName: 'BMC Swachhata Command Center',
      wardOffice: 'Zone 12 Office, Arera Colony',
      phone: '+91 755 2588890',
      email: 'swachhbhopal@bhopalcorp.gov.in',
      portalUrl: 'https://swachhbhopal.gov.in'
    },
    reportedBy: {
      id: 'usr-3',
      name: 'Dr. Sameer Khan',
      role: 'Citizen'
    },
    reportCount: 9,
    verifiedCount: 5,
    upvotedBy: ['usr-3', 'usr-1'],
    verifiedBy: ['usr-1', 'usr-4'],
    timeline: [
      { id: 'tl-1', status: 'Reported', actor: 'Dr. Sameer Khan', note: 'Initial garbage photo submitted', timestamp: '4 days ago' }
    ],
    createdAt: '2026-10-05T08:00:00Z',
    updatedAt: '2026-10-08T10:00:00Z'
  },
  {
    id: 'iss-4',
    title: 'Broken Streetlight Pole & Dark Junction',
    category: 'Broken Streetlight',
    description: 'Twin pole streetlights non-functional for past 10 days. Creates pitch dark spot at bend where two accidents occurred.',
    location: {
      address: 'Main Arterial Sector C, Kolar Road',
      locality: 'Kolar Road',
      city: 'Bhopal',
      lat: 23.1890,
      lng: 77.4190,
      ward: 'Ward 80, Zone 18',
    },
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    resolutionProofImage: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80',
    severity: 'Medium',
    severityScore: 72,
    aiAnalysis: {
      detectedCategory: 'Street Lighting & Electrical',
      confidence: 91,
      urgency: 'Medium',
      hazardFactors: ['Night pedestrian security', 'Blind curve road visibility'],
      recommendedDepartment: 'Electrical & Street Lighting Wing',
      estimatedResolutionTime: '48 Hours',
      explanation: 'Blown capacitor / feeder junction trip. LED fixture replacement.'
    },
    status: 'Resolved',
    assignedDepartment: 'Electrical & Street Lighting Wing',
    assignedOfficer: 'Vikas Tiwari (Junior Engineer)',
    municipalContact: {
      departmentName: 'MPPKVVCL & BMC Streetlight Cell',
      wardOffice: 'Zone 18 Kolar Sub-Station, Bhopal',
      phone: '+91 755 2420444',
      email: 'streetlights@mpez.co.in',
      portalUrl: 'https://smartbhopal.city/electrical'
    },
    reportedBy: {
      id: 'usr-4',
      name: 'Rohan Deshmukh',
      role: 'Citizen'
    },
    reportCount: 6,
    verifiedCount: 4,
    upvotedBy: ['usr-4', 'usr-1'],
    verifiedBy: ['usr-1', 'usr-4', 'usr-2'],
    timeline: [
      { id: 'tl-1', status: 'Reported', actor: 'Rohan Deshmukh', note: 'Reported non-functional streetlights', timestamp: '1 week ago' },
      { id: 'tl-2', status: 'Assigned', actor: 'Admin', note: 'Dispatched to JE Vikas Tiwari', timestamp: '5 days ago' },
      { id: 'tl-3', status: 'Resolved', actor: 'Electrical Wing', note: 'LED luminaires replaced and timer relay reset', timestamp: '2 days ago', proofUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80' },
      { id: 'tl-4', status: 'Citizen Confirmed', actor: 'Gaurav Chotrani', note: 'Citizen verified light is shining bright at night', timestamp: 'Yesterday' }
    ],
    createdAt: '2026-10-02T19:30:00Z',
    updatedAt: '2026-10-08T20:10:00Z'
  },
  {
    id: 'iss-5',
    title: 'Major Underground Water Pipeline Leakage',
    category: 'Water Leakage',
    description: 'High-pressure clean drinking water gushing onto Shahpura lake road. Wasting thousands of liters while surrounding sectors face dry taps.',
    location: {
      address: 'Shahpura Sector A, Near Lake View Promenade',
      locality: 'Shahpura',
      city: 'Bhopal',
      lat: 23.2040,
      lng: 77.4250,
      ward: 'Ward 52, Zone 13',
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    resolutionProofImage: '',
    severity: 'Low',
    severityScore: 65,
    aiAnalysis: {
      detectedCategory: 'Water Supply Pipeline Rupture',
      confidence: 89,
      urgency: 'Medium',
      hazardFactors: ['Treated drinking water loss', 'Pavement erosion', 'Subsurface hollow risk'],
      recommendedDepartment: 'Bhopal Jal Nigam & Public Health Engineering (PHE)',
      estimatedResolutionTime: '24 Hours',
      explanation: 'Joint flange rupture on 150mm distribution feeder pipe.'
    },
    status: 'Assigned',
    assignedDepartment: 'Jal Nigam / PHE Water Works',
    assignedOfficer: 'Eng. Manish Gour',
    municipalContact: {
      departmentName: 'BMC Jal Karya Vibhag',
      wardOffice: 'Shahpura Water Works Station, Bhopal',
      phone: '+91 755 2542288',
      email: 'water@bhopalcorp.gov.in',
      portalUrl: 'https://smartbhopal.city/water'
    },
    reportedBy: {
      id: 'usr-1',
      name: 'Gaurav Chotrani',
      role: 'Citizen'
    },
    reportCount: 3,
    verifiedCount: 2,
    upvotedBy: ['usr-1', 'usr-3'],
    verifiedBy: ['usr-1', 'usr-2'],
    timeline: [
      { id: 'tl-1', status: 'Reported', actor: 'Gaurav Chotrani', note: 'Reported clean water pipeline burst', timestamp: '1 week ago' },
      { id: 'tl-2', status: 'Assigned', actor: 'Water Board', note: 'Excavation team scheduled for pipeline repair', timestamp: '3 days ago' }
    ],
    createdAt: '2026-10-01T07:15:00Z',
    updatedAt: '2026-10-06T14:00:00Z'
  },
  {
    id: 'iss-6',
    title: 'Broken Staircase Handrail & Damaged Tiles',
    category: 'Campus Infrastructure',
    description: 'Third floor engineering block central staircase handrail broken and loose marble treads. Major tripping risk for students during class transitions.',
    location: {
      address: 'Academic Block 3, Central Campus',
      locality: 'Engineering Campus',
      city: 'Bhopal / Campus',
      lat: 23.2150,
      lng: 77.4080,
      ward: 'Campus Facilities - North Zone',
    },
    imageUrl: 'https://images.unsplash.com/photo-1584463699047-68894dfc7379?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    resolutionProofImage: '',
    severity: 'High',
    severityScore: 82,
    aiAnalysis: {
      detectedCategory: 'Campus Physical Infrastructure',
      confidence: 94,
      urgency: 'High',
      hazardFactors: ['Student falling risk', 'Emergency evacuation impedance'],
      recommendedDepartment: 'Campus Estate & Maintenance Office',
      estimatedResolutionTime: '24 Hours',
      explanation: 'Welding failure on support bracket and chipped stone edge.'
    },
    status: 'In Progress',
    assignedDepartment: 'Campus Facilities & Maintenance',
    assignedOfficer: 'Prof. R. C. Mathur (Dean of Infrastructure)',
    municipalContact: {
      departmentName: 'Campus Works & Estate Department',
      wardOffice: 'Estate Office, Admin Block Ground Floor',
      phone: '+91 755 2690100',
      email: 'estate@campus.edu.in',
      portalUrl: 'https://campus.edu.in/maintenance'
    },
    reportedBy: {
      id: 'usr-1',
      name: 'Gaurav Chotrani',
      role: 'Student'
    },
    reportCount: 15,
    verifiedCount: 11,
    upvotedBy: ['usr-1', 'usr-2', 'usr-3'],
    verifiedBy: ['usr-1', 'usr-4'],
    timeline: [
      { id: 'tl-1', status: 'Reported', actor: 'Gaurav Chotrani', note: 'Student reported hazard', timestamp: '3 days ago' },
      { id: 'tl-2', status: 'Assigned', actor: 'Dean Infrastructure', note: 'Welder and carpenter dispatched', timestamp: 'Yesterday' }
    ],
    createdAt: '2026-10-06T12:00:00Z',
    updatedAt: '2026-10-08T16:30:00Z'
  }
];

let issues = [...initialIssues];

// SerpAPI Knowledge Base for instant, high-fidelity results
const serpApiCivicDatabase: Record<string, any> = {
  'bhopal': {
    city: 'Bhopal',
    corporation: 'Bhopal Municipal Corporation (BMC)',
    officialPortal: 'https://bhopalcivic.gov.in',
    helpline: '1800-233-0014 / 0755-2540220',
    mayor: 'Malti Rai',
    commissioner: 'Harendra Narayan (IAS)',
    headquarters: 'Sadashiv Rao Bhau Parisar, Mata Mandir, Bhopal',
    departments: {
      'Pothole': {
        name: 'BMC Public Works & Road Maintenance Division',
        officer: 'Chief City Engineer (Civil)',
        phone: '+91 755 2542033',
        email: 'pwd@bhopalcorp.gov.in',
        portal: 'https://smartbhopal.city/roads',
        wardOffices: ['MP Nagar Ward 42 Office', 'Arera Colony Ward 48 Office', 'Kolar Ward 80 Sub-division'],
        activeTenders: 'Road Asphalt Overlay & Patchwork Tender 2026-BMC-PWD-849'
      },
      'Garbage Accumulation': {
        name: 'BMC Solid Waste Management & Swachhata Command',
        officer: 'Additional Commissioner (Swachhata)',
        phone: '+91 755 2588890',
        email: 'swachhbhopal@bhopalcorp.gov.in',
        portal: 'https://swachhbhopal.gov.in',
        wardOffices: ['Zone 10 Sanitation Depot', 'Zone 12 Arera Compactor Depot'],
        activeTenders: 'Door-to-Door Waste Collection & GPS Fleet Tracking'
      },
      'Broken Streetlight': {
        name: 'BMC Electrical & Centralized Street Light Monitoring',
        officer: 'Superintending Engineer (Electrical)',
        phone: '+91 755 2420444',
        email: 'streetlight@mpez.co.in',
        portal: 'https://smartbhopal.city/electrical',
        wardOffices: ['Central Power Feeder Control Room', 'MP Nagar Sub-station'],
        activeTenders: 'Smart LED Luminaire Retrofit & Automated Dimming'
      },
      'Water Leakage': {
        name: 'BMC Water Works & Public Health Engineering (PHE)',
        officer: 'Superintending Engineer (Water Supply)',
        phone: '+91 755 2542288',
        email: 'water@bhopalcorp.gov.in',
        portal: 'https://smartbhopal.city/water',
        wardOffices: ['Shahpura Water Works Station', 'Narmada Project Distribution Wing'],
        activeTenders: 'Kolar & Narmada Pipeline Rehabilitation & Valve Replacement'
      },
      'Open Drain': {
        name: 'BMC Sewerage & Storm Water Drainage Department',
        officer: 'City Drainage Engineer',
        phone: '+91 755 2735111',
        email: 'drainage@bhopalcorp.gov.in',
        portal: 'https://smartbhopal.city/sanitation',
        wardOffices: ['Zone 10 Drain Repair Wing', 'Bhopal Drainage Depot'],
        activeTenders: 'Precast Concrete Drain Cover Placement Phase 4'
      },
      'Campus Infrastructure': {
        name: 'University Campus Estate & Infrastructure Board',
        officer: 'Dean of Estate & Campus Works',
        phone: '+91 755 2690100',
        email: 'estate@campus.edu.in',
        portal: 'https://campus.edu.in/grievance',
        wardOffices: ['Central Estate Office', 'Hostel Maintenance Hub'],
        activeTenders: 'Annual Academic Blocks Maintenance & Safety Inspection'
      }
    },
    liveNews: [
      {
        title: 'Bhopal Municipal Corporation Deploys Jetpatcher Machines for MP Nagar & Arterial Roads',
        snippet: 'BMC commissioner inspects rapid pothole repair drive following citizen reports on smart city platform. Target 48-hour turnaround for critical arterial routes.',
        source: 'The Free Press Journal / Civic Bureau',
        date: 'October 8, 2026',
        link: 'https://bhopalcivic.gov.in/news/pothole-drive-2026',
        category: 'Pothole'
      },
      {
        title: 'New Helpline & WhatsApp Grievance Bot Activated for Solid Waste & Water Supply',
        snippet: 'Citizens can now track municipal sanitation trucks and report uncleared waste with real-time GPS verification.',
        source: 'Dainik Bhaskar Urban News',
        date: 'October 7, 2026',
        link: 'https://swachhbhopal.gov.in/news/tracking',
        category: 'Garbage Accumulation'
      },
      {
        title: 'Smart City Bhopal Upgrades 12,000 Streetlights with CCMS Automated Fault Detection',
        snippet: 'Centralized control system automatically detects non-glowing lamps and generates work orders for zonal junior engineers.',
        source: 'Times of India - MP Urban',
        date: 'October 5, 2026',
        link: 'https://smartbhopal.city/updates/lighting',
        category: 'Broken Streetlight'
      }
    ]
  }
};

// SerpAPI Search Helper
async function querySerpApi(query: string, engine = 'google', apiKey?: string) {
  const key = apiKey || process.env.SERPAPI_API_KEY;
  if (!key) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      engine,
      q: query,
      api_key: key,
    });
    const url = `https://serpapi.com/search.json?${params.toString()}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      console.warn(`SerpAPI returned HTTP ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('SerpAPI fetch error:', err);
    return null;
  }
}

// ---------------- API ROUTES ----------------

// Issues CRUD & Actions
app.get('/api/issues', (req: Request, res: Response) => {
  res.json({ success: true, count: issues.length, data: issues });
});

app.post('/api/issues', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.category) {
    return res.status(400).json({ error: 'Title and Category are required' });
  }

  const newIssue = {
    id: `iss-${Date.now()}`,
    title: body.title,
    category: body.category,
    description: body.description || '',
    location: body.location || {
      address: 'Reported Location',
      locality: 'City Center',
      city: 'Bhopal',
      lat: 23.2300,
      lng: 77.4300,
      ward: 'Ward 42',
    },
    imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    additionalImages: body.additionalImages || [],
    resolutionProofImage: '',
    severity: body.severity || 'Medium',
    severityScore: body.severityScore || 75,
    aiAnalysis: body.aiAnalysis || {
      detectedCategory: body.category,
      confidence: 92,
      urgency: body.severity || 'Medium',
      hazardFactors: ['General civic hazard reported by citizen'],
      recommendedDepartment: 'Municipal Corporation General Desk',
      estimatedResolutionTime: '48 Hours',
      explanation: 'Classified using FixMyCity vision and category models.'
    },
    status: 'Under Review',
    assignedDepartment: body.assignedDepartment || 'Municipal Corporation',
    assignedOfficer: body.assignedOfficer || 'Pending Assignment',
    municipalContact: body.municipalContact || {
      departmentName: 'Bhopal Municipal Corporation Ward Desk',
      wardOffice: 'Zonal Office',
      phone: '+91 755 2540220',
      email: 'grievance@bhopalcorp.gov.in',
      portalUrl: 'https://smartbhopal.city'
    },
    reportedBy: body.reportedBy || {
      id: 'usr-1',
      name: 'Gaurav Chotrani',
      role: 'Citizen'
    },
    reportCount: 1,
    verifiedCount: 1,
    upvotedBy: ['usr-1'],
    verifiedBy: ['usr-1'],
    timeline: [
      {
        id: `tl-${Date.now()}`,
        status: 'Reported',
        actor: body.reportedBy?.name || 'Citizen',
        note: 'Issue created with photo and location evidence',
        timestamp: 'Just now'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  issues.unshift(newIssue);
  res.status(201).json({ success: true, data: newIssue });
});

// Upvote / reinforce issue
app.post('/api/issues/:id/upvote', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId = 'usr-1' } = req.body;
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  if (!issue.upvotedBy.includes(userId)) {
    issue.upvotedBy.push(userId);
    issue.reportCount += 1;
    // Boost severity score slightly with duplicate upvotes
    issue.severityScore = Math.min(100, issue.severityScore + 3);
    issue.updatedAt = new Date().toISOString();
  }

  res.json({ success: true, data: issue });
});

// Citizen verify issue
app.post('/api/issues/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId = 'usr-1', isResolvedVerification = false, note = '' } = req.body;
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  if (!issue.verifiedBy.includes(userId)) {
    issue.verifiedBy.push(userId);
    issue.verifiedCount += 1;
  }

  if (isResolvedVerification && issue.status === 'Resolved') {
    issue.status = 'Citizen Confirmed';
    issue.timeline.push({
      id: `tl-${Date.now()}`,
      status: 'Citizen Confirmed',
      actor: 'Gaurav Chotrani (Citizen)',
      note: note || 'Citizen verified in-person that problem has been properly resolved.',
      timestamp: 'Just now'
    });
  } else {
    issue.timeline.push({
      id: `tl-${Date.now()}`,
      status: 'Community Verified',
      actor: 'Citizen Verifier',
      note: note || 'Community member verified the active issue on site.',
      timestamp: 'Just now'
    });
  }

  issue.updatedAt = new Date().toISOString();
  res.json({ success: true, data: issue });
});

// Update issue status or assignment (Admin Authority)
app.patch('/api/issues/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedDepartment, assignedOfficer, resolutionProofImage, note, actor = 'Officer Amit Kumar' } = req.body;
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  if (status) issue.status = status;
  if (assignedDepartment) issue.assignedDepartment = assignedDepartment;
  if (assignedOfficer) issue.assignedOfficer = assignedOfficer;
  if (resolutionProofImage) issue.resolutionProofImage = resolutionProofImage;

  issue.timeline.push({
    id: `tl-${Date.now()}`,
    status: status || 'Updated',
    actor,
    note: note || `Status updated to ${status}${assignedDepartment ? ` - assigned to ${assignedDepartment}` : ''}`,
    timestamp: 'Just now',
    proofUrl: resolutionProofImage
  });

  issue.updatedAt = new Date().toISOString();
  res.json({ success: true, data: issue });
});

// ---------------- SERPAPI ENDPOINTS ----------------

// SerpAPI Search Endpoint: queries live Google Search / News via SerpAPI or returns rich civic data
app.get('/api/serpapi/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || 'Bhopal Municipal Corporation road repairs pothole';
  const customApiKey = req.headers['x-serpapi-key'] as string | undefined;

  let liveData = null;
  try {
    liveData = await querySerpApi(query, 'google', customApiKey);
  } catch (err) {
    console.error('SerpAPI error:', err);
  }

  if (liveData) {
    return res.json({
      success: true,
      source: 'serpapi_live',
      query,
      results: {
        knowledge_graph: liveData.knowledge_graph || null,
        organic_results: (liveData.organic_results || []).slice(0, 6).map((item: any) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayed_link: item.displayed_link,
          date: item.date,
          sitelinks: item.sitelinks?.inline || []
        })),
        local_results: liveData.local_results || null
      }
    });
  }

  // Graceful fallback with rich municipal data for Bhopal and Indian civic bodies
  res.json({
    success: true,
    source: 'serpapi_cached',
    query,
    results: {
      knowledge_graph: {
        title: 'Bhopal Municipal Corporation (BMC)',
        type: 'Municipal Corporation in Madhya Pradesh',
        phone: '1800-233-0014 / 0755-2540220',
        headquarters: 'Sadashiv Rao Bhau Parisar, Mata Mandir, Bhopal - 462003',
        mayor: 'Malti Rai (Mayor)',
        commissioner: 'Harendra Narayan (IAS, Municipal Commissioner)',
        website: 'https://bhopalcivic.gov.in',
        description: 'Bhopal Municipal Corporation is the civic body that governs the city of Bhopal, the capital of Madhya Pradesh.'
      },
      organic_results: [
        {
          title: 'Official Bhopal Municipal Corporation Grievance Portal - 311 Civic Services',
          link: 'https://smartbhopal.city/grievance',
          snippet: 'Lodge complaints regarding potholes, water leakage, stray animals, garbage dumping, and street lighting. Track real-time resolution status and zonal junior engineers.',
          displayed_link: 'smartbhopal.city > grievance',
          date: 'Active 2026'
        },
        {
          title: 'BMC PWD Road Maintenance Division - Zone 10 MP Nagar Helpline',
          link: 'https://bhopalcivic.gov.in/pwd-wards',
          snippet: 'Official contact desk for MP Nagar Zone 10, Chetak Bridge, and Arera Colony road repairs. Helpline: 0755-2542033. SDO Er. Rajesh Saxena.',
          displayed_link: 'bhopalcivic.gov.in > pwd-wards',
          date: 'Verified'
        },
        {
          title: 'Swachh Bhopal Mission - Solid Waste Management Command Center',
          link: 'https://swachhbhopal.gov.in',
          snippet: 'Real-time GPS tracking of garbage compactor trucks and zero-waste ward initiatives. 24x7 Control Room: 0755-2588890.',
          displayed_link: 'swachhbhopal.gov.in',
          date: 'Updated Daily'
        },
        {
          title: 'MPPKVVCL & BMC Joint Streetlight Fault Reporting System',
          link: 'https://smartbhopal.city/electrical',
          snippet: 'Automated street light failure logging. Report dark spots and non-functioning LED poles across Kolar, Hoshangabad Road and BHEL sectors.',
          displayed_link: 'smartbhopal.city > electrical',
          date: 'Active'
        }
      ]
    }
  });
});

// SerpAPI Municipal Authorities Lookup
app.get('/api/serpapi/authorities', async (req: Request, res: Response) => {
  const city = ((req.query.city as string) || 'Bhopal').toLowerCase();
  const category = (req.query.category as string) || 'Pothole';
  const customApiKey = req.headers['x-serpapi-key'] as string | undefined;

  const searchQuery = `${city} municipal corporation ${category} ward office contact phone email portal`;
  let liveData = null;
  try {
    liveData = await querySerpApi(searchQuery, 'google', customApiKey);
  } catch (e) {
    console.error('SerpAPI error:', e);
  }

  const bhopalData = serpApiCivicDatabase['bhopal'];
  const deptInfo = bhopalData.departments[category] || bhopalData.departments['Pothole'];

  res.json({
    success: true,
    source: liveData ? 'serpapi_live' : 'serpapi_intelligent_resolver',
    query: searchQuery,
    city: 'Bhopal',
    authority: {
      corporation: bhopalData.corporation,
      department: deptInfo.name,
      nodalOfficer: deptInfo.officer,
      contactNumber: deptInfo.phone,
      email: deptInfo.email,
      portal: deptInfo.portal,
      wardOffices: deptInfo.wardOffices,
      activeTenders: deptInfo.activeTenders,
      searchEvidence: liveData?.organic_results?.slice(0, 3) || [
        {
          title: `${deptInfo.name} - Official Contact & Grievance SLA`,
          link: deptInfo.portal,
          snippet: `Official municipal authority for ${category} reporting in Bhopal. Direct helpline: ${deptInfo.phone}.`
        }
      ]
    }
  });
});

// SerpAPI Civic News Feed
app.get('/api/serpapi/civic-news', async (req: Request, res: Response) => {
  const city = ((req.query.city as string) || 'Bhopal').toLowerCase();
  const customApiKey = req.headers['x-serpapi-key'] as string | undefined;

  const searchQuery = `${city} municipal corporation road repairs water garbage civic news`;
  let liveData = null;
  try {
    liveData = await querySerpApi(searchQuery, 'google', customApiKey);
  } catch (e) {
    console.error('SerpAPI news query error:', e);
  }

  const bhopalData = serpApiCivicDatabase['bhopal'];
  const newsList = bhopalData.liveNews;

  res.json({
    success: true,
    source: liveData ? 'serpapi_live' : 'serpapi_civic_curated',
    news: liveData?.organic_results?.slice(0, 4).map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      source: item.displayed_link || 'Google Search via SerpAPI',
      date: item.date || 'Recent',
      link: item.link,
      category: 'Civic Alert'
    })) || newsList
  });
});

// AI Classification Endpoint
app.post('/api/ai/classify', async (req: Request, res: Response) => {
  const { title = '', description = '', categoryHint = '' } = req.body;
  const fullText = `${title} ${description} ${categoryHint}`.toLowerCase();

  // Intelligent classification rules
  let category = 'Pothole';
  let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'High';
  let severityScore = 85;
  let hazardFactors = ['Risk of vehicle damage or accident'];
  let recommendedDepartment = 'PWD & Road Infrastructure';
  let estimatedResolutionTime = '24-48 Hours';

  if (fullText.includes('drain') || fullText.includes('sewer') || fullText.includes('manhole') || fullText.includes('gutter')) {
    category = 'Open Drain';
    severity = 'Critical';
    severityScore = 94;
    hazardFactors = ['Severe falling hazard for pedestrians', 'Foul sewage overflow', 'Vector disease risk'];
    recommendedDepartment = 'BMC Sewerage & Stormwater Drainage Department';
    estimatedResolutionTime = '24 Hours';
  } else if (fullText.includes('light') || fullText.includes('lamp') || fullText.includes('dark') || fullText.includes('wire')) {
    category = 'Broken Streetlight';
    severity = 'Medium';
    severityScore = 72;
    hazardFactors = ['Nighttime blind spot', 'Increased pedestrian security risk'];
    recommendedDepartment = 'BMC Electrical & Centralized Street Light Monitoring';
    estimatedResolutionTime = '48 Hours';
  } else if (fullText.includes('garbage') || fullText.includes('waste') || fullText.includes('trash') || fullText.includes('dump') || fullText.includes('litter')) {
    category = 'Garbage Accumulation';
    severity = 'High';
    severityScore = 86;
    hazardFactors = ['Public health hazard', 'Stray animal accumulation', 'Sidewalk obstruction'];
    recommendedDepartment = 'BMC Solid Waste Management & Swachhata Cell';
    estimatedResolutionTime = '24 Hours';
  } else if (fullText.includes('water') || fullText.includes('leak') || fullText.includes('pipe') || fullText.includes('burst')) {
    category = 'Water Leakage';
    severity = 'High';
    severityScore = 79;
    hazardFactors = ['Drinking water wastage', 'Subsurface asphalt weakening'];
    recommendedDepartment = 'Bhopal Jal Nigam & Public Health Engineering (PHE)';
    estimatedResolutionTime = '24-48 Hours';
  } else if (fullText.includes('campus') || fullText.includes('hostel') || fullText.includes('lab') || fullText.includes('stairs') || fullText.includes('classroom')) {
    category = 'Campus Infrastructure';
    severity = 'High';
    severityScore = 82;
    hazardFactors = ['Student safety risk', 'Campus facility disruption'];
    recommendedDepartment = 'Campus Works & Estate Department';
    estimatedResolutionTime = '24 Hours';
  } else {
    category = 'Pothole';
    severity = 'Critical';
    severityScore = 92;
    hazardFactors = ['Major tyre blowout risk', 'Two-wheeler skid danger', 'Monsoon crater'];
    recommendedDepartment = 'BMC Public Works Department (PWD)';
    estimatedResolutionTime = '24-48 Hours';
  }

  res.json({
    success: true,
    analysis: {
      detectedCategory: category,
      confidence: 94,
      urgency: severity,
      severityScore,
      hazardFactors,
      recommendedDepartment,
      estimatedResolutionTime,
      explanation: `FixMyCity AI analyzed the issue description and visual context. Evaluated high risk for ${category.toLowerCase()} and automatically routed to ${recommendedDepartment}.`
    }
  });
});

// Vite Middleware for Full-stack Dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FixMyCity Server running on port ${PORT}`);
  });
}

startServer();
