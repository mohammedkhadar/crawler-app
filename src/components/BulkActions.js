import React from 'react';
import { Button } from './ui/button';
import { Play, Square, Trash2 } from 'lucide-react';

const BulkActions = ({ 
  selectedIds, 
  urls, 
  onBulkAction, 
  isLoading 
}) => {
  const selectedUrls = urls.filter(url => selectedIds.has(url.id));
  const hasActiveUrls = selectedUrls.some(url => url.status === 'crawling');

  if (selectedIds.size === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">
        {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
      </span>
      
      <div className="flex items-center gap-2 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('start')}
          disabled={isLoading}
          className="h-8 px-3"
        >
          <Play className="h-4 w-4 mr-1" />
          Start
        </Button>
        
        {hasActiveUrls && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('stop')}
            disabled={isLoading}
            className="h-8 px-3"
          >
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAction('delete')}
          disabled={isLoading}
          className="h-8 px-3 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;