import { Issue, SerpApiAuthorityResult, SerpApiNewsItem, AiAnalysis } from '../types';

export const API_BASE = '/api';

export async function fetchIssues(): Promise<Issue[]> {
  try {
    const res = await fetch(`${API_BASE}/issues`);
    if (!res.ok) throw new Error('Failed to fetch issues');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API error, falling back to local storage or defaults:', err);
    const stored = localStorage.getItem('fixmycity_issues');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // ignore
      }
    }
    return [];
  }
}

export async function createIssue(issueData: Partial<Issue>): Promise<Issue> {
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(issueData),
    });
    if (!res.ok) throw new Error('Failed to create issue');
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error('Error creating issue:', err);
    throw err;
  }
}

export async function upvoteIssue(id: string, userId: string = 'usr-1'): Promise<Issue> {
  const res = await fetch(`${API_BASE}/issues/${id}/upvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const json = await res.json();
  return json.data;
}

export async function verifyIssue(
  id: string,
  isResolvedVerification: boolean = false,
  note: string = '',
  userId: string = 'usr-1'
): Promise<Issue> {
  const res = await fetch(`${API_BASE}/issues/${id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, isResolvedVerification, note }),
  });
  const json = await res.json();
  return json.data;
}

export async function updateIssue(
  id: string,
  updates: {
    status?: string;
    assignedDepartment?: string;
    assignedOfficer?: string;
    resolutionProofImage?: string;
    note?: string;
    actor?: string;
  }
): Promise<Issue> {
  const res = await fetch(`${API_BASE}/issues/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  return json.data;
}

export async function searchSerpApi(query: string, apiKey?: string) {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['x-serpapi-key'] = apiKey;
  }
  const res = await fetch(`${API_BASE}/serpapi/search?q=${encodeURIComponent(query)}`, { headers });
  return await res.json();
}

export async function fetchSerpApiAuthorities(city: string, category: string, apiKey?: string): Promise<SerpApiAuthorityResult> {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['x-serpapi-key'] = apiKey;
  }
  const res = await fetch(`${API_BASE}/serpapi/authorities?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`, { headers });
  const data = await res.json();
  return data.authority;
}

export async function fetchSerpApiNews(city: string, apiKey?: string): Promise<SerpApiNewsItem[]> {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['x-serpapi-key'] = apiKey;
  }
  const res = await fetch(`${API_BASE}/serpapi/civic-news?city=${encodeURIComponent(city)}`, { headers });
  const data = await res.json();
  return data.news || [];
}

export async function classifyIssueWithAI(
  title: string,
  description: string,
  categoryHint: string = ''
): Promise<AiAnalysis> {
  try {
    const res = await fetch(`${API_BASE}/ai/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, categoryHint }),
    });
    const data = await res.json();
    return data.analysis;
  } catch (err) {
    return {
      detectedCategory: categoryHint || 'Pothole',
      confidence: 90,
      urgency: 'High',
      hazardFactors: ['General civic hazard reported by citizen'],
      recommendedDepartment: 'Municipal Corporation Zonal Engineering',
      estimatedResolutionTime: '48 Hours',
      explanation: 'Classified using FixMyCity heuristic fallback.'
    };
  }
}
