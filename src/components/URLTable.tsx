import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckSquare, Square, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { URL } from '../types';

type SortField = 'url' | 'title' | 'html_version' | 'status' | 'links';
type SortDirection = 'asc' | 'desc';

interface URLTableProps {
  urls: URL[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectUrl: (url: URL) => void;
  onDeleteUrl: (id: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const URLTable: React.FC<URLTableProps> = ({
  urls,
  selectedIds,
  onToggleSelect,
  onSelectUrl,
  onDeleteUrl,
  sortField,
  sortDirection,
  onSort
}) => {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'crawling':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getHTMLVersionColor = (version: string) => {
    switch (version) {
      case 'HTML5':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'HTML4':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'XHTML':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12 text-center">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('url')}>
              <div className="flex items-center gap-2">
                <span>URL</span>
                <SortIcon field="url" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('title')}>
              <div className="flex items-center gap-2">
                <span>Title</span>
                <SortIcon field="title" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('html_version')}>
              <div className="flex items-center gap-2">
                <span>Version</span>
                <SortIcon field="html_version" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('status')}>
              <div className="flex items-center gap-2">
                <span>Status</span>
                <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('links')}>
              <div className="flex items-center gap-2">
                <span>Links</span>
                <SortIcon field="links" />
              </div>
            </TableHead>
            <TableHead className="w-16 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urls.map((url) => (
            <TableRow 
              key={url.id} 
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onToggleSelect(url.id);
                  }}
                  className="h-8 w-8 p-0 btn-sm"
                >
                  {selectedIds.has(url.id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="font-medium cursor-pointer max-w-xs" onClick={() => onSelectUrl(url)}>
                <div className="truncate pr-2" title={url.url}>
                  {url.url}
                </div>
              </TableCell>
              <TableCell className="text-sm cursor-pointer max-w-xs" onClick={() => onSelectUrl(url)}>
                <div className="truncate pr-2" title={url.title || 'No title'}>
                  {url.title || 'No title'}
                </div>
              </TableCell>
              <TableCell className="text-sm cursor-pointer" onClick={() => onSelectUrl(url)}>
                <div className="flex items-center">
                  {url.html_version && (
                    <Badge className={`text-xs px-2 py-1 ${getHTMLVersionColor(url.html_version)}`}>
                      {url.html_version}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm cursor-pointer" onClick={() => onSelectUrl(url)}>
                <Badge className={`text-xs px-2 py-1 ${getStatusColor(url.status)}`}>
                  {url.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm cursor-pointer" onClick={() => onSelectUrl(url)}>
                {(url.internal_links || 0) + (url.external_links || 0)}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDeleteUrl(url.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 btn-sm"
                  >
                    <Trash2 className="h-4 w-4" />
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