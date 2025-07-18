export interface URL {
  id: string;
  url: string;
  title?: string;
  html_version?: string;
  status: 'pending' | 'crawling' | 'completed' | 'error' | 'stopped';
  internal_links?: number;
  external_links?: number;
  has_forms?: boolean;
  has_login_form?: boolean;
  created_at?: string;
  updated_at?: string;
  last_crawled?: string;
  error_message?: string;
  h1_count?: number;
  h2_count?: number;
  h3_count?: number;
  h4_count?: number;
  h5_count?: number;
  h6_count?: number;
  broken_links?: number;
}

export interface BrokenLink {
  id: string;
  url_id: string;
  link_url: string;
  error_message: string;
  status_code?: number;
  created_at: string;
}

export interface User {
  token: string;
  username?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}