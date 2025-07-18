import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const TableFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const hasFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Column Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <Input
          type="text"
          placeholder="Filter URL..."
          value={filters.url}
          onChange={(e) => onFilterChange('url', e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter Title..."
          value={filters.title}
          onChange={(e) => onFilterChange('title', e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter Version..."
          value={filters.html_version}
          onChange={(e) => onFilterChange('html_version', e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter Status..."
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="h-8 text-sm"
        />
        <Input
          type="text"
          placeholder="Filter Links..."
          value={filters.links}
          onChange={(e) => onFilterChange('links', e.target.value)}
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
};

export default TableFilters;