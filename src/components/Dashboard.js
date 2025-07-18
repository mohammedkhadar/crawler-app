import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUrlData } from '../hooks/useUrlData';
import { useTableState } from '../hooks/useTableState';
import URLDetailView from './URLDetailView';
import Header from './Header';
import URLForm from './URLForm';
import SearchBox from './SearchBox';
import TableFilters from './TableFilters';
import BulkActions from './BulkActions';
import URLTable from './URLTable';
import Pagination from './Pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { urls, loading, error, addUrl, deleteUrl, crawlUrl, stopCrawl, bulkAction } = useUrlData();
  const tableState = useTableState(urls);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [adding, setAdding] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleAddUrl = async (url) => {
    setAdding(true);
    const result = await addUrl(url);
    setAdding(false);
    
    if (!result.success) {
      setLocalError(result.error);
    } else {
      setLocalError(null);
    }
  };

  const handleBulkAction = async (action) => {
    if (tableState.selectedIds.size === 0) return;

    setBulkActionLoading(true);
    const result = await bulkAction(action, tableState.selectedIds);
    setBulkActionLoading(false);
    
    if (result.success) {
      tableState.setSelectedIds(new Set());
    }
  };

  const handleAction = async (action, id) => {
    let result;
    switch (action) {
      case 'crawl':
        result = await crawlUrl(id);
        break;
      case 'stop':
        result = await stopCrawl(id);
        break;
      case 'delete':
        result = await deleteUrl(id);
        break;
      case 'retry':
        result = await crawlUrl(id);
        break;
      default:
        return;
    }
  };

  if (selectedUrl) {
    return (
      <URLDetailView
        url={selectedUrl}
        onBack={() => setSelectedUrl(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header user={user} onLogout={logout} />
        
        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error || localError}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <URLForm onAddUrl={handleAddUrl} isAdding={adding} />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">URLs Overview</CardTitle>
                    <CardDescription className="text-sm">Click on a row to view detailed analysis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <SearchBox
                  value={tableState.globalSearch}
                  onChange={(e) => {
                    tableState.setGlobalSearch(e.target.value);
                    tableState.setCurrentPage(1);
                  }}
                  onClear={() => {
                    tableState.setGlobalSearch('');
                    tableState.setCurrentPage(1);
                  }}
                />

                <TableFilters
                  filters={tableState.filters}
                  onFilterChange={tableState.handleFilterChange}
                  onClearFilters={tableState.clearFilters}
                />

                <BulkActions
                  selectedIds={tableState.selectedIds}
                  urls={urls}
                  onBulkAction={handleBulkAction}
                  isLoading={bulkActionLoading}
                />

                <URLTable
                  urls={tableState.paginatedUrls}
                  selectedIds={tableState.selectedIds}
                  onSelectionChange={tableState.handleSelectionChange}
                  onSelectAll={tableState.handleSelectAll}
                  onRowClick={setSelectedUrl}
                  onAction={handleAction}
                  sortField={tableState.sortField}
                  sortDirection={tableState.sortDirection}
                  onSort={tableState.handleSort}
                />

                <Pagination
                  currentPage={tableState.currentPage}
                  totalPages={tableState.totalPages}
                  onPageChange={tableState.setCurrentPage}
                  startIndex={tableState.startIndex}
                  endIndex={tableState.endIndex}
                  totalItems={tableState.filteredUrls.length}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;