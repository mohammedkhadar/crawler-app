import React from 'react';
import { Play, Square, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { URL } from '../types';

interface URLTableActionsProps {
  selectedIds: Set<string>;
  urls: URL[];
  bulkActionLoading: boolean;
  onBulkAction: (action: string) => void;
}

export const URLTableActions: React.FC<URLTableActionsProps> = ({
  selectedIds,
  urls,
  bulkActionLoading,
  onBulkAction
}) => {
  if (selectedIds.size === 0) return null;

  const hasActiveCrawls = urls.some(url => 
    selectedIds.has(url.id) && (url.status === 'crawling' || url.status === 'pending')
  );

  const activeCount = Array.from(selectedIds).filter(id => {
    const url = urls.find(u => u.id === id);
    return url && (url.status === 'crawling' || url.status === 'pending');
  }).length;

  // Debug logging
  console.log('URLTableActions - selectedIds:', Array.from(selectedIds));
  console.log('URLTableActions - hasActiveCrawls:', hasActiveCrawls);
  console.log('URLTableActions - activeCount:', activeCount);
  console.log('URLTableActions - selected URLs statuses:', Array.from(selectedIds).map(id => {
    const url = urls.find(u => u.id === id);
    return { id, status: url?.status };
  }));

  return (
    <div className="flex justify-between items-center pt-6 mt-4">
      <div className="btn-group">
        <Button
          onClick={() => onBulkAction('start')}
          disabled={bulkActionLoading}
          variant="outline"
          size="sm"
          className="btn-sm"
        >
          <Play className="h-4 w-4 mr-2" />
          Start ({selectedIds.size})
        </Button>
        {hasActiveCrawls && (
          <Button
            onClick={() => onBulkAction('stop')}
            disabled={bulkActionLoading}
            variant="outline"
            size="sm"
            className="btn-sm"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop ({activeCount})
          </Button>
        )}
        <Button
          onClick={() => onBulkAction('delete')}
          disabled={bulkActionLoading}
          variant="destructive"
          size="sm"
          className="btn-sm"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete ({selectedIds.size})
        </Button>
      </div>
    </div>
  );
};