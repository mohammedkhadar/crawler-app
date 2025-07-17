export interface URL {
  id: string;
  url: string;
  status: 'queued' | 'running' | 'completed' | 'error' | 'stopped';
  created_at: string;
  last_crawled?: string;
  title?: string;
  html_version?: string;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  h4_count: number;
  h5_count: number;
  h6_count: number;
  internal_links: number;
  external_links: number;
  broken_links: number;
  has_login_form: boolean;
  error_message?: string;
}

export interface BrokenLink {
  id: string;
  url_id: string;
  link_url: string;
  status_code: number;
  error_message?: string;
  created_at: string;
}

export interface User {
  username: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
