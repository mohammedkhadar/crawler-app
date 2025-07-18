import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUrlManagement } from '../hooks/useUrlManagement';
import { useTableState } from '../hooks/useTableState';
import { usePolling } from '../hooks/usePolling';
import { filterUrls, sortUrls, paginateUrls, getPaginationInfo } from '../utils/tableUtils';
import URLDetailView from './URLDetailView';
import DashboardHeader from './DashboardHeader';
import URLForm from './URLForm';
import SearchAndFilters from './SearchAndFilters';
import BulkActions from './BulkActions';
import URLTable from './URLTable';
import Pagination from './Pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { URL } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<URL | null>(null);

  // Custom hooks for state management
  const {
    urls,
    selectedIds,
    bulkActionLoading,
    setUrls,
    setBulkActionLoading,
    toggleSelectUrl,
    toggleSelectAll,
    clearSelection
  } = useUrlManagement();

  const {
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    filters,
    globalSearch,
    setCurrentPage,
    setItemsPerPage,
    setFilters,
    setGlobalSearch,
    handleSort,
    clearAllFilters
  } = useTableState();

  // API functions
  const fetchUrls = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/urls', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUrls(data.urls || []);
      }
    } catch (err) {
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  }, [user?.token, setUrls]);

  const handleAddUrl = useCallback(async (url: string): Promise<void> => {
    setAdding(true);
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        await fetchUrls();
        setError(null);
      } else if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error || 'This URL already exists');
      } else {
        setError('Failed to add URL');
      }
    } catch (err) {
      setError('Failed to add URL');
    } finally {
      setAdding(false);
    }
  }, [user?.token, fetchUrls]);

  const handleDeleteUrl = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        await fetchUrls();
      }
    } catch (err) {
      setError('Failed to delete URL');
    }
  }, [user?.token, fetchUrls]);

  const handleBulkAction = useCallback(async (action: string): Promise<void> => {
    if (selectedIds.size === 0) return;

    setBulkActionLoading(true);
    try {
      const response = await fetch('/api/urls/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          action: action,
          ids: Array.from(selectedIds)
        }),
      });

      if (response.ok) {
        clearSelection();
        await fetchUrls();
      }
    } catch (err) {
      setError(`Failed to ${action} URLs`);
    } finally {
      setBulkActionLoading(false);
    }
  }, [selectedIds, user?.token, setBulkActionLoading, clearSelection, fetchUrls]);

  // Effects
  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Polling for real-time updates
  usePolling(fetchUrls, { interval: 2000, enabled: !loading });

  // Data processing
  const filteredUrls = filterUrls(urls, filters, globalSearch);
  const sortedUrls = sortUrls(filteredUrls, sortField, sortDirection);
  const paginatedUrls = paginateUrls(sortedUrls, currentPage, itemsPerPage);
  const paginationInfo = getPaginationInfo(filteredUrls.length, currentPage, itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, globalSearch, setCurrentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedUrl) {
    return (
      <URLDetailView
        url={selectedUrl}
        onClose={() => setSelectedUrl(null)}
      />
    );
  }

  return (
    <div className="container">
      <DashboardHeader 
        username={user?.username || 'User'} 
        onLogout={logout} 
      />

      <div className="space-y-20">
        {error && (
          <div style={{ 
            background: '#fee', 
            border: '1px solid #f99', 
            color: '#c33',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <URLForm onAddUrl={handleAddUrl} loading={adding} />

        <Card className="card-hover">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-lg">URLs ({urls.length})</CardTitle>
                <CardDescription className="text-sm">Click on a row to view detailed analysis</CardDescription>
              </div>
            </div>
            
            <SearchAndFilters
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              filters={filters}
              setFilters={setFilters}
              onClearAll={clearAllFilters}
            />
          </CardHeader>

          <CardContent className="pt-0">
            <BulkActions
              urls={urls}
              selectedIds={selectedIds}
              onToggleSelectAll={toggleSelectAll}
              onBulkAction={handleBulkAction}
              loading={bulkActionLoading}
            />

            <URLTable
              urls={paginatedUrls}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelectUrl}
              onSelectUrl={setSelectedUrl}
              onDeleteUrl={handleDeleteUrl}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo.totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={paginationInfo.totalItems}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;