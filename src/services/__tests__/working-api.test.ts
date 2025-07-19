import { apiService } from '../api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('can create api service instance', () => {
    expect(apiService).toBeDefined();
    expect(typeof apiService.get).toBe('function');
    expect(typeof apiService.post).toBe('function');
    expect(typeof apiService.put).toBe('function');
    expect(typeof apiService.delete).toBe('function');
  });

  test('sets token correctly', () => {
    apiService.setToken('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('clears token correctly', () => {
    localStorage.setItem('token', 'test-token');
    apiService.clearToken();
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('makes GET request with proper headers', async () => {
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

  test('makes POST request with data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ success: true })
    });

    const testData = { name: 'test' };
    await apiService.post('/test', testData);

    expect(mockFetch).toHaveBeenCalledWith('/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
  });
});