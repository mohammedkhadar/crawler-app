import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Square,
  Trash2,
  CheckSquare,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const columnHelper = createColumnHelper();

const URLTable = ({ 
  urls, 
  selectedIds, 
  onSelectionChange, 
  onBulkAction, 
  bulkActionLoading,
  onViewDetails,
  onDeleteUrl
}) => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const allIds = new Set(urls.map(url => url.id));
            if (selectedIds.size === urls.length && urls.length > 0) {
              onSelectionChange(new Set());
            } else {
              onSelectionChange(allIds);
            }
          }}
          className="h-8 w-8 p-0"
        >
          {selectedIds.size === urls.length && urls.length > 0 ? 
            <CheckSquare className="h-4 w-4" /> : 
            <Square className="h-4 w-4" />
          }
        </Button>
      ),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            const newSelectedIds = new Set(selectedIds);
            if (selectedIds.has(row.original.id)) {
              newSelectedIds.delete(row.original.id);
            } else {
              newSelectedIds.add(row.original.id);
            }
            onSelectionChange(newSelectedIds);
          }}
          className="h-8 w-8 p-0"
        >
          {selectedIds.has(row.original.id) ? 
            <CheckSquare className="h-4 w-4" /> : 
            <Square className="h-4 w-4" />
          }
        </Button>
      ),
      size: 50,
    }),
    columnHelper.accessor('url', {
      header: 'URL',
      cell: ({ getValue }) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <a href={getValue()} target="_blank" rel="noopener noreferrer" 
             style={{ color: '#007bff', textDecoration: 'none' }}
             onClick={(e) => e.stopPropagation()}>
            {getValue()}
            <ExternalLink className="inline h-3 w-3 ml-1" />
          </a>
        </div>
      ),
      size: 300,
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ getValue }) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {getValue() || 'N/A'}
        </div>
      ),
      size: 200,
    }),
    columnHelper.accessor('html_version', {
      header: 'HTML Version',
      cell: ({ getValue }) => getValue() || 'N/A',
      size: 100,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        const getStatusColor = (status) => {
          switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'crawling': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            case 'stopped': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
      size: 100,
    }),
    columnHelper.accessor((row) => row.internal_links + row.external_links, {
      id: 'total_links',
      header: 'Links',
      cell: ({ row }) => (
        <div style={{ fontSize: '13px' }}>
          <div>Int: {row.original.internal_links}</div>
          <div>Ext: {row.original.external_links}</div>
        </div>
      ),
      size: 80,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(row.original);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteUrl(row.original.id);
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      size: 100,
    }),
  ], [urls, selectedIds, onSelectionChange, onViewDetails, onDeleteUrl]);

  const table = useReactTable({
    data: urls,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  const SortIcon = ({ column }) => {
    const sorted = column.getIsSorted();
    if (sorted === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sorted === 'desc') return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="w-full">
      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
          <Button
            onClick={() => onBulkAction('start')}
            disabled={bulkActionLoading}
            variant="outline"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Start ({selectedIds.size})
          </Button>
          {urls.some(url => selectedIds.has(url.id) && (url.status === 'crawling' || url.status === 'pending')) && (
            <Button
              onClick={() => onBulkAction('stop')}
              disabled={bulkActionLoading}
              variant="outline"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop ({Array.from(selectedIds).filter(id => {
                const url = urls.find(u => u.id === id);
                return url && (url.status === 'crawling' || url.status === 'pending');
              }).length})
            </Button>
          )}
          <Button
            onClick={() => onBulkAction('delete')}
            disabled={bulkActionLoading}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedIds.size})
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <SortIcon column={header.column} />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetails(row.original)}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-4 text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-gray-700">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getPrePaginationRowModel().rows.length
          )}{' '}
          of {table.getPrePaginationRowModel().rows.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex w-20 items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default URLTable;