import { useState, useCallback } from 'react';
import { URL } from '../types';

interface UseUrlManagementReturn {
  urls: URL[];
  selectedIds: Set<string>;
  bulkActionLoading: boolean;
  setUrls: (urls: URL[]) => void;
  setSelectedIds: (ids: Set<string>) => void;
  setBulkActionLoading: (loading: boolean) => void;
  toggleSelectUrl: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
}

export const useUrlManagement = (): UseUrlManagementReturn => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);

  const toggleSelectUrl = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.size === urls.length) {
        return new Set();
      } else {
        return new Set(urls.map(url => url.id));
      }
    });
  }, [urls]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    urls,
    selectedIds,
    bulkActionLoading,
    setUrls,
    setSelectedIds,
    setBulkActionLoading,
    toggleSelectUrl,
    toggleSelectAll,
    clearSelection
  };
};