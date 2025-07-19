import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';

// Mock the API service
jest.mock('../../services/api', () => ({
  apiService: {
    post: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn()
  }
}));

import { apiService } from '../../services/api';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('initial state shows not authenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  test('login function updates authentication state', async () => {
    const mockResponse = { token: 'mock-token' };
    (apiService.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password');
    });

    expect(apiService.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'testuser',
      password: 'password'
    });
    expect(apiService.setToken).toHaveBeenCalledWith('mock-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('login handles authentication failure', async () => {
    (apiService.post as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('testuser', 'wrongpassword');
      } catch (error) {
        expect(error).toEqual(new Error('Invalid credentials'));
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  test('logout clears authentication state', async () => {
    // First login
    const mockResponse = { token: 'mock-token' };
    (apiService.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('testuser', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      result.current.logout();
    });

    expect(apiService.clearToken).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('verifies token on mount when token exists', async () => {
    localStorage.setItem('token', 'existing-token');
    (apiService.post as jest.Mock).mockResolvedValueOnce({ valid: true });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Wait for verification to complete
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  test('handles token verification failure', async () => {
    localStorage.setItem('token', 'invalid-token');
    (apiService.post as jest.Mock).mockRejectedValueOnce(new Error('Token invalid'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Wait for verification to complete
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  test('shows loading state during authentication', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Mock a slow login
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });
    (apiService.post as jest.Mock).mockReturnValueOnce(loginPromise);

    act(() => {
      result.current.login('testuser', 'password');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveLogin({ token: 'test-token' });
      await loginPromise;
    });

    expect(result.current.loading).toBe(false);
  });
});