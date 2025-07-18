import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock the API service
jest.mock('../../services/api', () => ({
  login: jest.fn(),
  verifyToken: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('initializes with no authentication', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('initializes with stored token', () => {
    mockLocalStorage.getItem.mockReturnValue('stored-token');
    const { verifyToken } = require('../../services/api');
    verifyToken.mockResolvedValue({ valid: true, user: 'testuser' });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
  });

  it('handles successful login', async () => {
    const { login } = require('../../services/api');
    login.mockResolvedValue({ token: 'new-token' });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login('testuser', 'password123');
      expect(success).toBe(true);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'new-token');
  });

  it('handles login failure', async () => {
    const { login } = require('../../services/api');
    login.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login('testuser', 'wrongpassword');
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Invalid credentials');
  });

  it('handles logout', () => {
    mockLocalStorage.getItem.mockReturnValue('stored-token');
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('handles token verification failure', async () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-token');
    const { verifyToken } = require('../../services/api');
    verifyToken.mockRejectedValue(new Error('Invalid token'));

    const { result } = renderHook(() => useAuth());

    // Wait for token verification to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
  });
});