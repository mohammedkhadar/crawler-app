import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface Filters {
  url: string;
  title: string;
  html_version: string;
  status: string;
  links: string;
}

interface SearchAndFiltersProps {
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onClearAll: () => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  globalSearch,
  setGlobalSearch,
  filters,
  setFilters,
  onClearAll
}) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = globalSearch || Object.values(filters).some(filter => filter.trim() !== '');

  return (
    <div className="space-y-4">
      {/* Global Search Box */}
      <div className="flex items-center gap-2 max-w-md">
        <Input
          type="text"
          placeholder="Search all columns..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="flex-1 h-9"
        />
        {hasActiveFilters && (
          <Button
            onClick={onClearAll}
            variant="outline"
            size="sm"
            className="px-3 h-9 btn-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Column Filters */}
      <div className="flex flex-wrap gap-2">
        <Input
          type="text"
          placeholder="Filter by URL..."
          value={filters.url}
          onChange={(e) => handleFilterChange('url', e.target.value)}
          className="w-40 h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter by Title..."
          value={filters.title}
          onChange={(e) => handleFilterChange('title', e.target.value)}
          className="w-40 h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter by Version..."
          value={filters.html_version}
          onChange={(e) => handleFilterChange('html_version', e.target.value)}
          className="w-40 h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter by Status..."
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-40 h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter by Links..."
          value={filters.links}
          onChange={(e) => handleFilterChange('links', e.target.value)}
          className="w-40 h-8 text-sm"
        />
      </div>
    </div>
  );
};

export default SearchAndFilters;