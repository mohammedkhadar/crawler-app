import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Filters {
  url: string;
  title: string;
  html_version: string;
  status: string;
  links: string;
}

interface URLTableFiltersProps {
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  filters: Filters;
  onFilterChange: (field: keyof Filters, value: string) => void;
  onClearAll: () => void;
}

export const URLTableFilters: React.FC<URLTableFiltersProps> = ({
  globalSearch,
  onGlobalSearchChange,
  filters,
  onFilterChange,
  onClearAll
}) => {
  return (
    <>
      {/* Global Search Box */}
      <div className="mb-4">
        <div className="flex items-center gap-2 max-w-md">
          <Input
            type="text"
            placeholder="Search all columns..."
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            className="flex-1 h-9"
          />
          {globalSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGlobalSearchChange('')}
              className="h-9 px-3 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Column Filters Row */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        <div></div> {/* Empty for checkbox column */}
        <Input
          type="text"
          placeholder="Filter by URL..."
          value={filters.url}
          onChange={(e) => onFilterChange('url', e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter by title..."
          value={filters.title}
          onChange={(e) => onFilterChange('title', e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter by version..."
          value={filters.html_version}
          onChange={(e) => onFilterChange('html_version', e.target.value)}
          className="h-8 text-sm"
        />
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="h-8 w-full px-2 text-sm border rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="crawling">Crawling</option>
          <option value="completed">Completed</option>
          <option value="error">Error</option>
          <option value="stopped">Stopped</option>
        </select>
        <Input
          type="number"
          placeholder="Links..."
          value={filters.links}
          onChange={(e) => onFilterChange('links', e.target.value)}
          className="h-8 text-sm"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 px-2 text-sm"
        >
          Clear All
        </Button>
      </div>
    </>
  );
};