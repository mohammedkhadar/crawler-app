import React from 'react';
import { CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { TableHead, TableHeader, TableRow } from './ui/table';

type SortField = 'url' | 'title' | 'html_version' | 'status' | 'links';
type SortDirection = 'asc' | 'desc';

interface URLTableHeaderProps {
  selectedIds: Set<string>;
  totalUrls: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onToggleSelectAll: () => void;
  onSort: (field: SortField) => void;
}

export const URLTableHeader: React.FC<URLTableHeaderProps> = ({
  selectedIds,
  totalUrls,
  sortField,
  sortDirection,
  onToggleSelectAll,
  onSort
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
    </TableHeader>
  );
};