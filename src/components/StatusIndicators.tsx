import React from 'react';
import { Badge } from './ui/badge';
import { URL } from '../types';

interface StatusIndicatorsProps {
  urls: URL[];
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ urls }) => {
  const statusCounts = urls.reduce((acc, url) => {
    acc[url.status] = (acc[url.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalUrls = urls.length;
  const completedUrls = statusCounts['completed'] || 0;
  const crawlingUrls = statusCounts['crawling'] || 0;
  const pendingUrls = statusCounts['pending'] || 0;
  const errorUrls = statusCounts['error'] || 0;
  const stoppedUrls = statusCounts['stopped'] || 0;

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="text-2xl font-bold text-gray-900">{totalUrls}</div>
        <div className="text-sm text-gray-600">Total URLs</div>
      </div>
      
      {completedUrls > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedUrls}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor('completed')}`}>
              ✓
            </Badge>
          </div>
        </div>
      )}
      
      {crawlingUrls > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{crawlingUrls}</div>
              <div className="text-sm text-gray-600">Crawling</div>
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor('crawling')}`}>
              ⟳
            </Badge>
          </div>
        </div>
      )}
      
      {pendingUrls > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{pendingUrls}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor('pending')}`}>
              ⏳
            </Badge>
          </div>
        </div>
      )}
      
      {errorUrls > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{errorUrls}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor('error')}`}>
              ✗
            </Badge>
          </div>
        </div>
      )}
      
      {stoppedUrls > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-600">{stoppedUrls}</div>
              <div className="text-sm text-gray-600">Stopped</div>
            </div>
            <Badge className={`text-xs px-2 py-1 ${getStatusColor('stopped')}`}>
              ⏹
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusIndicators;