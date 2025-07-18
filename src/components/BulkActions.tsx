import React from 'react';
import { Button } from './ui/button';
import { Play, Square, Trash2, CheckSquare, Square as UncheckedSquare } from 'lucide-react';
import { URL } from '../types';

interface BulkActionsProps {
  urls: URL[];
  selectedIds: Set<string>;
  onToggleSelectAll: () => void;
  onBulkAction: (action: string) => Promise<void>;
  loading: boolean;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  urls,
  selectedIds,
  onToggleSelectAll,
  onBulkAction,
  loading
}) => {
  const allSelected = selectedIds.size === urls.length && urls.length > 0;
  const someSelected = selectedIds.size > 0 && selectedIds.size < urls.length;
  const hasActiveCrawls = urls.some(url => selectedIds.has(url.id) && (url.status === 'crawling' || url.status === 'pending'));

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button
        onClick={onToggleSelectAll}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 btn-sm"
      >
        {allSelected ? (
          <CheckSquare className="h-4 w-4" />
        ) : someSelected ? (
          <div className="h-4 w-4 border border-gray-400 bg-gray-200 rounded-sm flex items-center justify-center">
            <div className="h-2 w-2 bg-gray-600 rounded-sm"></div>
          </div>
        ) : (
          <UncheckedSquare className="h-4 w-4" />
        )}
      </Button>
      
      <span className="text-sm text-gray-600">
        {selectedIds.size} selected
      </span>

      {selectedIds.size > 0 && (
        <div className="btn-group">
          <Button
            onClick={() => onBulkAction('start')}
            disabled={loading}
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
              disabled={loading}
              variant="outline"
              size="sm"
              className="btn-sm"
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
            disabled={loading}
            variant="destructive"
            size="sm"
            className="btn-sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedIds.size})
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkActions;