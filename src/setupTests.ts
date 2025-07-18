import '@testing-library/jest-dom';
import React from 'react';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Plus: jest.fn(() => React.createElement('div', { 'data-testid': 'plus-icon' }, 'Plus')),
  Search: jest.fn(() => React.createElement('div', { 'data-testid': 'search-icon' }, 'Search')),
  X: jest.fn(() => React.createElement('div', { 'data-testid': 'x-icon' }, 'X')),
  Edit: jest.fn(() => React.createElement('div', { 'data-testid': 'edit-icon' }, 'Edit')),
  Trash2: jest.fn(() => React.createElement('div', { 'data-testid': 'trash-icon' }, 'Trash2')),
  Play: jest.fn(() => React.createElement('div', { 'data-testid': 'play-icon' }, 'Play')),
  Square: jest.fn(() => React.createElement('div', { 'data-testid': 'square-icon' }, 'Square')),
  ExternalLink: jest.fn(() => React.createElement('div', { 'data-testid': 'external-link-icon' }, 'ExternalLink')),
  ChevronUp: jest.fn(() => React.createElement('div', { 'data-testid': 'chevron-up-icon' }, 'ChevronUp')),
  ChevronDown: jest.fn(() => React.createElement('div', { 'data-testid': 'chevron-down-icon' }, 'ChevronDown')),
  ChevronLeft: jest.fn(() => React.createElement('div', { 'data-testid': 'chevron-left-icon' }, 'ChevronLeft')),
  ChevronRight: jest.fn(() => React.createElement('div', { 'data-testid': 'chevron-right-icon' }, 'ChevronRight')),
  Filter: jest.fn(() => React.createElement('div', { 'data-testid': 'filter-icon' }, 'Filter')),
  RefreshCw: jest.fn(() => React.createElement('div', { 'data-testid': 'refresh-icon' }, 'RefreshCw')),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords() { return []; }
};