import { cn } from '../utils';

describe('Utility Functions', () => {
  describe('cn (class name utility)', () => {
    test('combines multiple class names', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    test('handles conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );
      
      expect(result).toBe('base-class active-class');
    });

    test('filters out undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toBe('class1 class2');
    });

    test('handles empty strings', () => {
      const result = cn('class1', '', 'class2');
      expect(result).toBe('class1 class2');
    });

    test('works with single class', () => {
      const result = cn('single-class');
      expect(result).toBe('single-class');
    });

    test('handles no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    test('merges tailwind classes correctly', () => {
      // Test with conflicting classes (latest should win)
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toContain('bg-blue-500');
    });

    test('preserves non-conflicting classes', () => {
      const result = cn('text-white', 'font-bold', 'bg-blue-500');
      expect(result).toContain('text-white');
      expect(result).toContain('font-bold');
      expect(result).toContain('bg-blue-500');
    });

    test('handles arrays of classes', () => {
      const classes = ['class1', 'class2'];
      const result = cn(...classes, 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    test('works with template literals', () => {
      const variant = 'primary';
      const size = 'lg';
      const result = cn(`btn-${variant}`, `btn-${size}`);
      expect(result).toBe('btn-primary btn-lg');
    });

    test('handles complex conditional scenarios', () => {
      const props = {
        variant: 'primary',
        size: 'lg',
        disabled: false,
        loading: true
      };
      
      const result = cn(
        'btn',
        `btn-${props.variant}`,
        `btn-${props.size}`,
        props.disabled && 'btn-disabled',
        props.loading && 'btn-loading'
      );
      
      expect(result).toBe('btn btn-primary btn-lg btn-loading');
    });
  });
});