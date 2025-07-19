import {
  formatDate,
  formatRelativeTime,
  isValidURL,
  getStatusColor,
  getStatusIcon,
  truncateText,
  debounce,
  calculatePercentage,
  sortBy,
  filterBy,
  searchBy,
  generateId,
  classNames,
  formatNumber
} from '../helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    test('formats valid date string correctly', () => {
      const testDate = '2023-01-01T12:00:00Z';
      const result = formatDate(testDate);
      
      expect(result).toContain('Jan');
      expect(result).toContain('2023');
    });

    test('handles invalid date gracefully', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-01-01T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('shows "Just now" for very recent times', () => {
      const recent = new Date(Date.now() - 30000).toISOString(); // 30 seconds ago
      expect(formatRelativeTime(recent)).toBe('Just now');
    });
  });

  describe('isValidURL', () => {
    test('validates HTTP and HTTPS URLs', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://test.com')).toBe(true);
      expect(isValidURL('https://subdomain.example.com/path?query=1')).toBe(true);
    });

    test('rejects invalid URLs', () => {
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('example.com')).toBe(false);
      expect(isValidURL('')).toBe(false);
    });
  });

  describe('getStatusColor', () => {
    test('returns correct colors for all statuses', () => {
      expect(getStatusColor('completed')).toBe('green');
      expect(getStatusColor('pending')).toBe('yellow');
      expect(getStatusColor('crawling')).toBe('blue');
      expect(getStatusColor('failed')).toBe('red');
      expect(getStatusColor('stopped')).toBe('gray');
      expect(getStatusColor('unknown')).toBe('gray');
    });
  });

  describe('getStatusIcon', () => {
    test('returns correct icons for all statuses', () => {
      expect(getStatusIcon('pending')).toBe('clock');
      expect(getStatusIcon('crawling')).toBe('loader');
      expect(getStatusIcon('completed')).toBe('check');
      expect(getStatusIcon('failed')).toBe('x');
      expect(getStatusIcon('stopped')).toBe('square');
    });
  });

  describe('truncateText', () => {
    test('truncates long text with ellipsis', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23);
    });

    test('returns original text if shorter than limit', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    test('cancels previous calls when called repeatedly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('first');
      jest.advanceTimersByTime(500);
      debouncedFn('second');
      jest.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('calculatePercentage', () => {
    test('calculates percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(33, 100)).toBe(33);
      expect(calculatePercentage(1, 3)).toBe(33);
    });

    test('handles zero total', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });

  describe('sortBy', () => {
    const testArray = [
      { name: 'John', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 }
    ];

    test('sorts array in ascending order by default', () => {
      const sorted = sortBy(testArray, 'age');
      expect(sorted.map(item => item.age)).toEqual([25, 30, 35]);
    });

    test('sorts array in descending order', () => {
      const sorted = sortBy(testArray, 'age', 'desc');
      expect(sorted.map(item => item.age)).toEqual([35, 30, 25]);
    });
  });

  describe('filterBy', () => {
    const testArray = [
      { status: 'active', type: 'user' },
      { status: 'inactive', type: 'user' },
      { status: 'active', type: 'admin' }
    ];

    test('filters array by key-value pair', () => {
      const filtered = filterBy(testArray, 'status', 'active');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.status === 'active')).toBe(true);
    });
  });

  describe('searchBy', () => {
    const testArray = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@test.com' }
    ];

    test('searches across multiple keys', () => {
      const results = searchBy(testArray, ['name', 'email'], 'john');
      expect(results).toHaveLength(2);
    });

    test('is case insensitive', () => {
      const results = searchBy(testArray, ['name'], 'JANE');
      expect(results).toHaveLength(1);
    });
  });

  describe('generateId', () => {
    test('generates a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    test('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('classNames', () => {
    test('combines multiple class names', () => {
      const result = classNames('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    test('filters out falsy values', () => {
      const result = classNames('class1', null, undefined, false, 'class2');
      expect(result).toBe('class1 class2');
    });
  });

  describe('formatNumber', () => {
    test('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
    });
  });
});