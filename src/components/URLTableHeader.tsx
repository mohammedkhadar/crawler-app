import React from 'react';
import { CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TableHead, TableHeader, TableRow } from './ui/table';

type SortField = 'url' | 'title' | 'html_version' | 'status' | 'links';
type SortDirection = 'asc' | 'desc';

interface Filters {
  url: string;
  title: string;
  html_version: string;
  status: string;
  links: string;
}

interface URLTableHeaderProps {
  selectedIds: Set<string>;
  totalUrls: number;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: Filters;
  onToggleSelectAll: () => void;
  onSort: (field: SortField) => void;
  onFilterChange: (field: keyof Filters, value: string) => void;
  onClearFilters: () => void;
}

export const URLTableHeader: React.FC<URLTableHeaderProps> = ({
  selectedIds,
  totalUrls,
  sortField,
  sortDirection,
  filters,
  onToggleSelectAll,
  onSort,
  onFilterChange,
  onClearFilters
}) => {
  const renderSortButton = (field: SortField, label: string) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className="h-8 p-0 font-semibold hover:bg-transparent"
    >
      {label}
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[5%]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSelectAll}
            className="h-8 w-8 p-0 btn-sm"
          >
            {selectedIds.size === totalUrls && totalUrls > 0 ? 
              <CheckSquare className="h-4 w-4" /> : 
              <Square className="h-4 w-4" />
            }
          </Button>
        </TableHead>
        <TableHead className="w-[30%]">
          {renderSortButton('url', 'URL')}
        </TableHead>
        <TableHead className="w-[20%]">
          {renderSortButton('title', 'Title')}
        </TableHead>
        <TableHead className="w-[10%]">
          {renderSortButton('html_version', 'Version')}
        </TableHead>
        <TableHead className="w-[12%]">
          {renderSortButton('status', 'Status')}
        </TableHead>
        <TableHead className="w-[8%]">
          {renderSortButton('links', 'Links')}
        </TableHead>
        <TableHead className="w-[10%]">Actions</TableHead>
      </TableRow>
      <TableRow className="border-b bg-gray-50/50">
        <TableHead className="w-[5%]"></TableHead>
        <TableHead className="w-[30%] p-2">
          <Input
            type="text"
            placeholder="Filter by URL..."
            value={filters.url}
            onChange={(e) => onFilterChange('url', e.target.value)}
            className="h-8 text-sm"
          />
        </TableHead>
        <TableHead className="w-[20%] p-2">
          <Input
            type="text"
            placeholder="Filter by title..."
            value={filters.title}
            onChange={(e) => onFilterChange('title', e.target.value)}
            className="h-8 text-sm"
          />
        </TableHead>
        <TableHead className="w-[10%] p-2">
          <Input
            type="text"
            placeholder="Filter by version..."
            value={filters.html_version}
            onChange={(e) => onFilterChange('html_version', e.target.value)}
            className="h-8 text-sm"
          />
        </TableHead>
        <TableHead className="w-[12%] p-2">
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
        </TableHead>
        <TableHead className="w-[8%] p-2">
          <Input
            type="number"
            placeholder="Links..."
            value={filters.links}
            onChange={(e) => onFilterChange('links', e.target.value)}
            className="h-8 text-sm"
          />
        </TableHead>
        <TableHead className="w-[10%] p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-sm"
          >
            Clear All
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};