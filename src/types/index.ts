export type IssueCategory =
  | 'Pothole'
  | 'Broken Streetlight'
  | 'Water Leakage'
  | 'Garbage Accumulation'
  | 'Open Drain'
  | 'Traffic & Safety'
  | 'Campus Infrastructure'
  | 'Other';

export type IssueSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IssueStatus =
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Citizen Confirmed';

export interface LocationInfo {
  address: string;
  locality: string;
  city: string;
  lat: number;
  lng: number;
  ward?: string;
}

export interface AiAnalysis {
  detectedCategory: string;
  confidence: number;
  urgency: IssueSeverity;
  severityScore?: number;
  hazardFactors: string[];
  recommendedDepartment: string;
  estimatedResolutionTime: string;
  explanation: string;
}

export interface MunicipalContact {
  departmentName: string;
  wardOffice: string;
  phone: string;
  email: string;
  portalUrl: string;
  serpSourceTitle?: string;
  serpSourceLink?: string;
}

export interface TimelineEvent {
  id: string;
  status: string;
  actor: string;
  note: string;
  timestamp: string;
  proofUrl?: string;
}

export interface Issue {
  id: string;
  title: string;
  category: IssueCategory;
  description: string;
  location: LocationInfo;
  imageUrl: string;
  additionalImages?: string[];
  resolutionProofImage?: string;
  severity: IssueSeverity;
  severityScore: number;
  aiAnalysis: AiAnalysis;
  status: IssueStatus;
  assignedDepartment: string;
  assignedOfficer?: string;
  municipalContact?: MunicipalContact;
  reportedBy: {
    id: string;
    name: string;
    avatar?: string;
    role: 'Citizen' | 'Student' | 'Faculty' | 'Authority';
  };
  reportCount: number;
  verifiedCount: number;
  upvotedBy: string[];
  verifiedBy: string[];
  duplicateMergedIssues?: Array<{
    id: string;
    reportedAt: string;
    reporter: string;
    note: string;
  }>;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface SerpApiNewsItem {
  title: string;
  snippet: string;
  source: string;
  date: string;
  link: string;
  category: string;
}

export interface SerpApiAuthorityResult {
  corporation: string;
  department: string;
  nodalOfficer: string;
  contactNumber: string;
  email: string;
  portal: string;
  wardOffices: string[];
  activeTenders?: string;
  searchEvidence: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}
