export interface User {
  username: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface URL {
  id: number;
  url: string;
  title: string;
  html_version: string;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  h4_count: number;
  h5_count: number;
  h6_count: number;
  internal_links: number;
  external_links: number;
  has_login_form: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface URLAnalysis {
  id: number;
  url: string;
  title: string;
  html_version: string;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  h4_count: number;
  h5_count: number;
  h6_count: number;
  internal_links: number;
  external_links: number;
  has_login_form: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BrokenLink {
  id: number;
  url_id: number;
  link_url: string;
  status_code: number;
  error: string;
  created_at: string;
}