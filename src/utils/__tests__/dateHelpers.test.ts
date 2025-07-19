// Simple utility function tests
describe('Date Utility Functions', () => {
  describe('Date formatting', () => {
    test('formats date correctly', () => {
      const testDate = new Date('2023-01-01T12:00:00Z');
      const formatted = testDate.toLocaleDateString();
      
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });

    test('handles current date', () => {
      const now = new Date();
      const formatted = now.toISOString();
      
      expect(formatted).toContain('T');
      expect(formatted).toContain('Z');
    });
  });

  describe('String utilities', () => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const truncate = (str: string, length: number) => 
      str.length > length ? str.substring(0, length) + '...' : str;

    test('capitalizes string correctly', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
      expect(capitalize('')).toBe('');
    });

    test('truncates long strings', () => {
      const longString = 'This is a very long string that needs truncation';
      const result = truncate(longString, 10);
      
      expect(result).toBe('This is a ...');
      expect(result.length).toBe(13);
    });

    test('does not truncate short strings', () => {
      const shortString = 'Short';
      const result = truncate(shortString, 10);
      
      expect(result).toBe('Short');
    });
  });

  describe('Number utilities', () => {
    const formatNumber = (num: number) => num.toLocaleString();
    const isEven = (num: number) => num % 2 === 0;

    test('formats numbers with commas', () => {
      expect(formatNumber(1000)).toContain('1');
      expect(formatNumber(1234567)).toContain(',');
    });

    test('checks if number is even', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(3)).toBe(false);
      expect(isEven(0)).toBe(true);
    });
  });
});