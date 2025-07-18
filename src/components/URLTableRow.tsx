import React from 'react';
import { Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { TableCell, TableRow } from './ui/table';
import { URL } from '../types';

interface URLTableRowProps {
  url: URL;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (url: URL) => void;
}

export const URLTableRow: React.FC<URLTableRowProps> = ({
  url,
  isSelected,
  onSelect,
  onDelete,
  onViewDetails
}) => {
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(url.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(url.id);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'crawling':
        return 'info';
      case 'error':
        return 'destructive';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Queued';
      case 'crawling':
        return 'Running';
      case 'completed':
        return 'Done';
      case 'error':
        return 'Error';
      default:
        return status;
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectClick}
          className="h-8 w-8 p-0 btn-sm"
        >
          {isSelected ? 
            <CheckSquare className="h-4 w-4" /> : 
            <Square className="h-4 w-4" />
          }
        </Button>
      </TableCell>
      <TableCell className="font-medium cursor-pointer" onClick={() => onViewDetails(url)}>
        <div className="table-cell-url text-sm" title={url.url}>{url.url}</div>
      </TableCell>
      <TableCell className="text-sm cursor-pointer" onClick={() => onViewDetails(url)}>
        <div className="table-cell-title" title={url.title || 'N/A'}>{url.title || 'N/A'}</div>
      </TableCell>
      <TableCell className="text-sm cursor-pointer" onClick={() => onViewDetails(url)}>
        <div className="table-cell-html-version" title={url.html_version || 'N/A'}>
          <span style={{ 
            backgroundColor: url.html_version ? '#e3f2fd' : '#f5f5f5',
            color: url.html_version ? '#1976d2' : '#666',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {url.html_version || 'N/A'}
          </span>
        </div>
      </TableCell>
      <TableCell className="cursor-pointer" onClick={() => onViewDetails(url)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {url.status === 'pending' && (
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#f59e0b',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
          )}
          {url.status === 'crawling' && (
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'pulse 1s infinite'
            }} />
          )}
          {url.status === 'completed' && (
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }} />
          )}
          {url.status === 'error' && (
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }} />
          )}
          <div style={{ minWidth: '80px' }}>
            <Badge variant={getStatusVariant(url.status)}>
              {getStatusDisplay(url.status)}
            </Badge>
            {url.status === 'crawling' && (
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: '100%', 
                  height: '100%',
                  backgroundColor: '#3b82f6',
                  animation: 'progress-bar 2s infinite'
                }} />
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm cursor-pointer" onClick={() => onViewDetails(url)}>
        {(url.internal_links || 0) + (url.external_links || 0)}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-destructive hover:text-destructive btn-sm"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};