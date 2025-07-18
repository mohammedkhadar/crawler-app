import React from 'react';
import { X } from 'lucide-react';
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
    </>
  );
};

