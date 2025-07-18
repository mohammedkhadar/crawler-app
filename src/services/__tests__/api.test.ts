import { getURLs, createURL, deleteURL, startCrawl, stopCrawl, login, verifyToken } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getURLs', () => {
    it('fetches URLs successfully', async () => {
      const mockURLs = [
        { id: 1, url: 'https://example.com', title: 'Example' }
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockURLs,
      });

      const result = await getURLs();

      expect(fetch).toHaveBeenCalledWith('/api/urls', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer null',
        },
      });
      expect(result).toEqual(mockURLs);
    });

    it('handles fetch errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getURLs()).rejects.toThrow('Failed to fetch URLs');
    });
  });

  describe('createURL', () => {
    it('creates URL successfully', async () => {
      const mockURL = { id: 1, url: 'https://example.com' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockURL,
      });

      const result = await createURL('https://example.com');

      expect(fetch).toHaveBeenCalledWith('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer null',
        },
        body: JSON.stringify({ url: 'https://example.com' }),
      });
      expect(result).toEqual(mockURL);
    });

    it('handles duplicate URL error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
      });

      await expect(createURL('https://example.com')).rejects.toThrow('URL already exists');
    });
  });

  describe('deleteURL', () => {
    it('deletes URL successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await deleteURL(1);

      expect(fetch).toHaveBeenCalledWith('/api/urls/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer null',
        },
      });
    });
  });

  describe('startCrawl', () => {
    it('starts crawl successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Crawl started' }),
      });

      const result = await startCrawl(1);

      expect(fetch).toHaveBeenCalledWith('/api/urls/1/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer null',
        },
      });
      expect(result).toEqual({ message: 'Crawl started' });
    });
  });

  describe('stopCrawl', () => {
    it('stops crawl successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Crawl stopped' }),
      });

      const result = await stopCrawl(1);

      expect(fetch).toHaveBeenCalledWith('/api/urls/1/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer null',
        },
      });
      expect(result).toEqual({ message: 'Crawl stopped' });
    });
  });

  describe('login', () => {
    it('logs in successfully', async () => {
      const mockResponse = { token: 'test-token' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await login('test@example.com', 'password123');

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles login failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('verifyToken', () => {
    it('verifies token successfully', async () => {
      const mockResponse = { valid: true };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await verifyToken('test-token');

      expect(fetch).toHaveBeenCalledWith('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('handles token verification failure', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(verifyToken('invalid-token')).rejects.toThrow('Token verification failed');
    });
  });
});