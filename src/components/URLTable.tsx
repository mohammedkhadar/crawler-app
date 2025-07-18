import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody } from './ui/table';
import { URLTableFilters } from './URLTableFilters';
import { URLTableActions } from './URLTableActions';
import { URLTableHeader } from './URLTableHeader';
import { URLTableRow } from './URLTableRow';
import { URLTablePagination } from './URLTablePagination';
import { URL } from '../types';

type SortField = 'url' | 'title' | 'html_version' | 'status' | 'links';
type SortDirection = 'asc' | 'desc';

interface Filters {
  url: string;
  title: string;
  html_version: string;
  status: string;
  links: string;
}

interface PaginationInfo {
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

interface URLTableProps {
  urls: URL[];
  paginatedUrls: URL[];
  paginationInfo: PaginationInfo;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: Filters;
  globalSearch: string;
  selectedIds: Set<string>;
  bulkActionLoading: boolean;
  onSort: (field: SortField) => void;
  onFilterChange: (field: keyof Filters, value: string) => void;
  onGlobalSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onToggleSelectAll: () => void;
  onToggleSelectUrl: (id: string) => void;
  onBulkAction: (action: string) => void;
  onDeleteUrl: (id: string) => void;
  onViewDetails: (url: URL) => void;
  onClearFilters: () => void;
}

export const URLTable: React.FC<URLTableProps> = ({
  urls,
  paginatedUrls,
  paginationInfo,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  filters,
  globalSearch,
  selectedIds,
  bulkActionLoading,
  onSort,
  onFilterChange,
  onGlobalSearchChange,
  onPageChange,
  onItemsPerPageChange,
  onToggleSelectAll,
  onToggleSelectUrl,
  onBulkAction,
  onDeleteUrl,
  onViewDetails,
  onClearFilters
}) => {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <CardTitle className="text-lg">URLs ({urls.length})</CardTitle>
            <CardDescription className="text-sm">Click on a row to view detailed analysis</CardDescription>
          </div>
        </div>
        
        <URLTableFilters
          globalSearch={globalSearch}
          onGlobalSearchChange={onGlobalSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearAll={onClearFilters}
        />
        
        <URLTableActions
          selectedIds={selectedIds}
          urls={urls}
          bulkActionLoading={bulkActionLoading}
          onBulkAction={onBulkAction}
        />
      </CardHeader>
      
      <CardContent className="pt-0">
        {urls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No URLs added yet. Add your first URL above!</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <URLTableHeader
                selectedIds={selectedIds}
                totalUrls={urls.length}
                sortField={sortField}
                sortDirection={sortDirection}
                filters={filters}
                onToggleSelectAll={onToggleSelectAll}
                onSort={onSort}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
              />
              <TableBody>
                {paginatedUrls.map((url) => (
                  <URLTableRow
                    key={url.id}
                    url={url}
                    isSelected={selectedIds.has(url.id)}
                    onSelect={onToggleSelectUrl}
                    onDelete={onDeleteUrl}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <URLTablePagination
          paginationInfo={paginationInfo}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </CardContent>
    </Card>
  );
};