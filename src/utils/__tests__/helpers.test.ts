import { 
  formatDate, 
  formatRelativeTime, 
  isValidURL, 
  truncateText, 
  getStatusColor, 
  getStatusIcon,
  debounce,
  calculatePercentage,
  sortBy,
  filterBy,
  searchBy,
  generateId,
  classNames
} from '../helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2023-01-01T12:00:00Z';
      const result = formatDate(date);
      expect(result).toMatch(/Jan 1, 2023/);
    });

    it('handles invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    it('shows "Just now" for very recent dates', () => {
      const now = new Date();
      const result = formatRelativeTime(now.toISOString());
      expect(result).toBe('Just now');
    });

    it('shows minutes ago', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo.toISOString());
      expect(result).toBe('5 minutes ago');
    });

    it('shows hours ago', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo.toISOString());
      expect(result).toBe('2 hours ago');
    });
  });

  describe('isValidURL', () => {
    it('validates correct URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://example.com')).toBe(true);
      expect(isValidURL('https://subdomain.example.com')).toBe(true);
      expect(isValidURL('https://example.com/path')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidURL('invalid-url')).toBe(false);
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      expect(result).toBe('This is a very lo...');
    });

    it('returns original text if shorter than limit', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);
      expect(result).toBe('Short text');
    });

    it('handles empty text', () => {
      const result = truncateText('', 20);
      expect(result).toBe('');
    });
  });

  describe('getStatusColor', () => {
    it('returns correct colors for different statuses', () => {
      expect(getStatusColor('completed')).toBe('bg-green-100 text-green-800');
      expect(getStatusColor('running')).toBe('bg-blue-100 text-blue-800');
      expect(getStatusColor('error')).toBe('bg-red-100 text-red-800');
      expect(getStatusColor('queued')).toBe('bg-yellow-100 text-yellow-800');
    });

    it('returns default color for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getStatusIcon', () => {
    it('returns correct icons for different statuses', () => {
      expect(getStatusIcon('completed')).toBe('fas fa-check-circle');
      expect(getStatusIcon('running')).toBe('fas fa-spinner fa-spin');
      expect(getStatusIcon('error')).toBe('fas fa-exclamation-circle');
      expect(getStatusIcon('queued')).toBe('fas fa-clock');
    });
  });

  describe('debounce', () => {
    it('debounces function calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33);
    });

    it('handles zero total', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });

  describe('sortBy', () => {
    const testData = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 }
    ];

    it('sorts ascending by default', () => {
      const result = sortBy(testData, 'name');
      expect(result[0].name).toBe('Alice');
      expect(result[2].name).toBe('Charlie');
    });

    it('sorts descending when specified', () => {
      const result = sortBy(testData, 'age', 'desc');
      expect(result[0].age).toBe(35);
      expect(result[2].age).toBe(25);
    });
  });

  describe('filterBy', () => {
    const testData = [
      { status: 'completed', id: 1 },
      { status: 'running', id: 2 },
      { status: 'completed', id: 3 }
    ];

    it('filters by value', () => {
      const result = filterBy(testData, 'status', 'completed');
      expect(result).toHaveLength(2);
      expect(result.every(item => item.status === 'completed')).toBe(true);
    });
  });

  describe('searchBy', () => {
    const testData = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@test.com' },
      { name: 'Charlie', email: 'charlie@example.com' }
    ];

    it('searches by multiple keys', () => {
      const result = searchBy(testData, ['name', 'email'], 'alice');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });

    it('searches case-insensitively', () => {
      const result = searchBy(testData, ['name'], 'ALICE');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alice');
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('classNames', () => {
    it('merges class names correctly', () => {
      const result = classNames('base', 'additional');
      expect(result).toBe('base additional');
    });

    it('filters out falsy values', () => {
      const result = classNames('base', null, undefined, false, 'valid');
      expect(result).toBe('base valid');
    });
  });
});