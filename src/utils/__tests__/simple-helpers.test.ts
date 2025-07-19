import { formatNumber, isValidURL, getStatusColor, truncateText } from '../helpers';

describe('Helper Functions', () => {
  describe('formatNumber', () => {
    test('formats numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('isValidURL', () => {
    test('validates URLs correctly', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://test.com')).toBe(true);
      expect(isValidURL('not-a-url')).toBe(false);
      expect(isValidURL('')).toBe(false);
      expect(isValidURL('example.com')).toBe(false);
    });
  });

  describe('getStatusColor', () => {
    test('returns correct colors', () => {
      expect(getStatusColor('completed')).toBe('green');
      expect(getStatusColor('pending')).toBe('yellow');
      expect(getStatusColor('crawling')).toBe('blue');
      expect(getStatusColor('failed')).toBe('red');
      expect(getStatusColor('stopped')).toBe('gray');
      expect(getStatusColor('unknown')).toBe('gray');
    });
  });

  describe('truncateText', () => {
    test('truncates text correctly', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBeLessThanOrEqual(23);
    });

    test('returns original text if short', () => {
      expect(truncateText('Short', 20)).toBe('Short');
    });
  });
});