import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Play, Square, Trash2, RotateCcw, ChevronUp, ChevronDown, CheckSquare, Square as UncheckedSquare } from 'lucide-react';

const URLTable = ({ 
  urls, 
  selectedIds, 
  onSelectionChange, 
  onSelectAll, 
  onRowClick, 
  onAction,
  sortField, 
  sortDirection, 
  onSort 
}) => {
  const allSelected = urls.length > 0 && urls.every(url => selectedIds.has(url.id));
  const someSelected = urls.some(url => selectedIds.has(url.id));

  const renderSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? (
        <ChevronUp className="h-4 w-4 ml-1" />
      ) : (
        <ChevronDown className="h-4 w-4 ml-1" />
      );
    }
    return null;
  };

  const SortableHeader = ({ field, children }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {children}
        {renderSortIcon(field)}
      </div>
    </TableHead>
  );

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'crawling': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'error': 'bg-red-100 text-red-800',
      'stopped': 'bg-gray-100 text-gray-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getVersionBadge = (version) => {
    if (!version) return null;
    const majorVersion = version.split('.')[0];
    const variants = {
      '4': 'bg-red-100 text-red-800',
      '5': 'bg-orange-100 text-orange-800'
    };
    return variants[majorVersion] || 'bg-blue-100 text-blue-800';
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectAll}
                className="h-6 w-6 p-0"
              >
                {allSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : someSelected ? (
                  <div className="h-4 w-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-sm"></div>
                  </div>
                ) : (
                  <UncheckedSquare className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <SortableHeader field="url">URL</SortableHeader>
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="html_version">Version</SortableHeader>
            <SortableHeader field="status">Status</SortableHeader>
            <SortableHeader field="links">Links</SortableHeader>
            <TableHead className="w-32 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url) => (
            <TableRow 
              key={url.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={(e) => {
                if (e.target.type !== 'checkbox' && !e.target.closest('button')) {
                  onRowClick(url);
                }
              }}
            >
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectionChange(url.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  {selectedIds.has(url.id) ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <UncheckedSquare className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="truncate" title={url.url}>
                <div className="truncate">{truncateText(url.url, 40)}</div>
              </TableCell>
              <TableCell className="truncate" title={url.title}>
                <div className="truncate">{truncateText(url.title, 30)}</div>
              </TableCell>
              <TableCell>
                {url.html_version && (
                  <Badge className={getVersionBadge(url.html_version)}>
                    {url.html_version}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadge(url.status)}>
                  {url.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {url.links || 0}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {url.status === 'crawling' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction('stop', url.id);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction('crawl', url.id);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction('retry', url.id);
                    }}
                    className="h-7 w-7 p-0"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction('delete', url.id);
                    }}
                    className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default URLTable;