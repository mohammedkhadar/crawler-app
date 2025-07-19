// Additional API service helper tests
describe('API Service Helpers', () => {
  describe('URL utilities', () => {
    const buildURL = (base: string, path: string) => `${base}${path}`;
    const isValidURL = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    test('builds URLs correctly', () => {
      expect(buildURL('/api', '/urls')).toBe('/api/urls');
      expect(buildURL('https://api.com', '/data')).toBe('https://api.com/data');
    });

    test('validates URLs correctly', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://test.com')).toBe(true);
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('Response utilities', () => {
    const parseJSON = (text: string) => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    };

    const isSuccessResponse = (status: number) => status >= 200 && status < 300;

    test('parses valid JSON', () => {
      const result = parseJSON('{"name": "test"}');
      expect(result).toEqual({ name: 'test' });
    });

    test('returns null for invalid JSON', () => {
      const result = parseJSON('invalid json');
      expect(result).toBeNull();
    });

    test('identifies success status codes', () => {
      expect(isSuccessResponse(200)).toBe(true);
      expect(isSuccessResponse(201)).toBe(true);
      expect(isSuccessResponse(299)).toBe(true);
      expect(isSuccessResponse(300)).toBe(false);
      expect(isSuccessResponse(404)).toBe(false);
      expect(isSuccessResponse(500)).toBe(false);
    });
  });

  describe('Data transformation', () => {
    const transformURLData = (data: any[]) => 
      data.map(item => ({
        ...item,
        displayName: `${item.url} (${item.status})`
      }));

    const filterByStatus = (urls: any[], status: string) =>
      urls.filter(url => url.status === status);

    test('transforms URL data correctly', () => {
      const input = [
        { id: 1, url: 'https://test.com', status: 'active' },
        { id: 2, url: 'https://example.com', status: 'inactive' }
      ];

      const result = transformURLData(input);

      expect(result).toHaveLength(2);
      expect(result[0].displayName).toBe('https://test.com (active)');
      expect(result[1].displayName).toBe('https://example.com (inactive)');
    });

    test('filters URLs by status', () => {
      const urls = [
        { id: 1, status: 'active' },
        { id: 2, status: 'inactive' },
        { id: 3, status: 'active' }
      ];

      const activeUrls = filterByStatus(urls, 'active');
      expect(activeUrls).toHaveLength(2);
      expect(activeUrls.every(url => url.status === 'active')).toBe(true);
    });
  });
});