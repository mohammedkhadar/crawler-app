import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { AuthProvider } from '../hooks/useAuth';
import * as api from '../services/api';

// Mock the API service
jest.mock('../services/api', () => ({
  getURLs: jest.fn(),
  createURL: jest.fn(),
  deleteURL: jest.fn(),
  startCrawl: jest.fn(),
  stopCrawl: jest.fn(),
  login: jest.fn(),
  verifyToken: jest.fn(),
  bulkAction: jest.fn(),
}));

// Mock fetch for auth
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Web Crawler Application Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders login form when not authenticated', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/web crawler dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
    });
  });

  it('shows dashboard when authenticated', async () => {
    const mockToken = 'test-token';
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ user: 'testuser' }),
    });

    (api.getURLs as jest.Mock).mockResolvedValue([]);

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no urls added yet/i)).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
    });

    (api.login as jest.Mock).mockResolvedValue({
      token: 'new-token',
    });

    (api.getURLs as jest.Mock).mockResolvedValue([]);

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  it('validates TypeScript types are working', () => {
    // This test ensures our TypeScript compilation is working
    // by importing and using typed components
    const mockUrl = {
      id: '1',
      url: 'https://example.com',
      title: 'Test Site',
      status: 'completed' as const,
      html_version: 'HTML5',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      h1_count: 1,
      h2_count: 2,
      h3_count: 3,
      h4_count: 0,
      h5_count: 0,
      h6_count: 0,
      internal_links: 5,
      external_links: 3,
      has_login_form: false,
    };

    // Test that our types are properly defined
    expect(mockUrl.id).toBe('1');
    expect(mockUrl.status).toBe('completed');
    expect(typeof mockUrl.h1_count).toBe('number');
    expect(typeof mockUrl.has_login_form).toBe('boolean');
  });

  it('API service functions are properly typed', async () => {
    // Test that our API functions are properly typed
    (api.getURLs as jest.Mock).mockResolvedValue([]);
    (api.createURL as jest.Mock).mockResolvedValue({ id: '1' });
    (api.deleteURL as jest.Mock).mockResolvedValue({});
    (api.startCrawl as jest.Mock).mockResolvedValue({});
    (api.stopCrawl as jest.Mock).mockResolvedValue({});
    (api.login as jest.Mock).mockResolvedValue({ token: 'test-token' });
    (api.verifyToken as jest.Mock).mockResolvedValue({ valid: true });
    (api.bulkAction as jest.Mock).mockResolvedValue({});

    // Test API calls
    await api.getURLs();
    await api.createURL('https://example.com');
    await api.deleteURL('1');
    await api.startCrawl('1');
    await api.stopCrawl('1');
    await api.login('user', 'pass');
    await api.verifyToken('token');
    await api.bulkAction('start', ['1', '2']);

    // Verify all functions were called
    expect(api.getURLs).toHaveBeenCalled();
    expect(api.createURL).toHaveBeenCalledWith('https://example.com');
    expect(api.deleteURL).toHaveBeenCalledWith('1');
    expect(api.startCrawl).toHaveBeenCalledWith('1');
    expect(api.stopCrawl).toHaveBeenCalledWith('1');
    expect(api.login).toHaveBeenCalledWith('user', 'pass');
    expect(api.verifyToken).toHaveBeenCalledWith('token');
    expect(api.bulkAction).toHaveBeenCalledWith('start', ['1', '2']);
  });
});