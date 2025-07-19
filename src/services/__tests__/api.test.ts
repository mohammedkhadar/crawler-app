import { apiService } from '../api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('creates API service instance with proper methods', () => {
    expect(apiService).toBeDefined();
    expect(typeof apiService.get).toBe('function');
    expect(typeof apiService.post).toBe('function');
    expect(typeof apiService.put).toBe('function');
    expect(typeof apiService.delete).toBe('function');
    expect(typeof apiService.setToken).toBe('function');
    expect(typeof apiService.clearToken).toBe('function');
  });

  test('setToken stores token in localStorage', () => {
    apiService.setToken('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('clearToken removes token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    apiService.clearToken();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('GET request includes authorization header when token is set', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ data: 'test' })
    });

    apiService.setToken('test-token');
    await apiService.get('/test');

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
  });

  test('POST request sends data and includes authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ success: true })
    });

    apiService.setToken('test-token');
    const testData = { name: 'test' };
    await apiService.post('/test', testData);

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testData)
    });
  });

  test('PUT request updates data correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ updated: true })
    });

    apiService.setToken('test-token');
    const updateData = { name: 'updated' };
    await apiService.put('/test/1', updateData);

    expect(mockFetch).toHaveBeenCalledWith('/test/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(updateData)
    });
  });

  test('DELETE request works correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ deleted: true })
    });

    apiService.setToken('test-token');
    await apiService.delete('/test/1');

    expect(mockFetch).toHaveBeenCalledWith('/test/1', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });
  });

  test('handles HTTP error responses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Map()
    });

    await expect(apiService.get('/not-found')).rejects.toThrow('HTTP error! status: 404');
  });

  test('handles 401 unauthorized by clearing token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Map()
    });

    apiService.setToken('invalid-token');
    await expect(apiService.get('/protected')).rejects.toThrow('Authentication required');
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(apiService.get('/test')).rejects.toThrow('Network error');
  });

  test('returns text response when content-type is not JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'text/plain']]),
      text: async () => 'plain text response'
    });

    const result = await apiService.get('/text');
    expect(result).toBe('plain text response');
  });

  test('makes request without token when not set', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ data: 'test' })
    });

    await apiService.get('/public');

    expect(mockFetch).toHaveBeenCalledWith('/public', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });
});