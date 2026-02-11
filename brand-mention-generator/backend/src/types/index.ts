export interface Portal {
  id: string;
  name: string;
  url: string;
  search_url: string;
  type: PortalType;
  authority: AuthorityLevel;
  language: string;
  active: boolean;
  discovered_at: string;
}

export type PortalType = 'news' | 'library' | 'government' | 'education' | 'archive' | 'commerce' | 'other';

export type AuthorityLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface SearchResult {
  portal_id: string;
  portal_name: string;
  query: string;
  found: boolean;
  snippet?: string;
  result_url?: string;
  screenshot?: string;
  relevance_score: number;
  validated: boolean;
  searched_at: string;
}

export interface SearchQuery {
  portalUrl: string;
  query: string;
}

export interface BatchSearchRequest {
  queries: string[];
  limit?: number;
  portalTypes?: PortalType[];
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  score: number;
  suggested_improvements?: string[];
}
