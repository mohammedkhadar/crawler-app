import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import URLDetailView from './URLDetailView';
import { DashboardHeader } from './DashboardHeader';
import { URLForm } from './URLForm';
import { URLTable } from './URLTable';
import { URL } from '../types';

type SortField = 'url' | 'title' | 'html_version' | 'status' | 'links';
type SortDirection = 'asc' | 'desc';

interface Filters {
  url: string;
  title: string;
  html_version: string;
  status: string;
  links: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [urls, setUrls] = useState<URL[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<URL | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);
  
  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortField, setSortField] = useState<SortField>('url');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState<Filters>({
    url: '',
    title: '',
    html_version: '',
    status: '',
    links: ''
  });
  const [globalSearch, setGlobalSearch] = useState<string>('');

  useEffect(() => {
    fetchUrls();
  }, []);

  useEffect(() => {
    // Start continuous polling for real-time updates
    const interval = setInterval(() => {
      fetchUrls();
    }, 2000); // Poll every 2 seconds

    setPollingInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []); // Empty dependency array to prevent recreating interval

  // Stop polling when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const fetchUrls = async (): Promise<void> => {
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
  };

  const deleteUrl = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        fetchUrls();
      }
    } catch (err) {
      setError('Failed to delete URL');
    }
  };

  const handleBulkAction = async (action: string): Promise<void> => {
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
        setSelectedIds(new Set());
        fetchUrls();
      }
    } catch (err) {
      setError(`Failed to ${action} URLs`);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const toggleSelectAll = (): void => {
    if (selectedIds.size === urls.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(urls.map(url => url.id)));
    }
  };

  const toggleSelectUrl = (id: string): void => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Sorting function
  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Filter function
  const handleFilterChange = (field: keyof Filters, value: string): void => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Global search with fuzzy matching
  const matchesGlobalSearch = (url: URL, searchTerm: string): boolean => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const searchableText = [
      url.url,
      url.title || '',
      url.html_version || '',
      url.status,
      ((url.internal_links || 0) + (url.external_links || 0)).toString()
    ].join(' ').toLowerCase();
    
    // Simple fuzzy matching: check if all characters in search term appear in order
    let searchIndex = 0;
    for (let i = 0; i < searchableText.length && searchIndex < searchLower.length; i++) {
      if (searchableText[i] === searchLower[searchIndex]) {
        searchIndex++;
      }
    }
    
    // Also check for direct substring matches (prefix matching)
    const directMatch = searchableText.includes(searchLower);
    
    return searchIndex === searchLower.length || directMatch;
  };

  // Get filtered URLs
  const getFilteredUrls = (): URL[] => {
    return urls.filter(url => {
      // Global search filter
      if (!matchesGlobalSearch(url, globalSearch)) {
        return false;
      }
      
      // Column-specific filters
      const matchesUrl = url.url.toLowerCase().includes(filters.url.toLowerCase());
      const matchesTitle = (url.title || '').toLowerCase().includes(filters.title.toLowerCase());
      const matchesHtmlVersion = (url.html_version || '').toLowerCase().includes(filters.html_version.toLowerCase());
      const matchesStatus = url.status.toLowerCase().includes(filters.status.toLowerCase());
      
      let matchesLinks = true;
      if (filters.links) {
        const totalLinks = (url.internal_links || 0) + (url.external_links || 0);
        matchesLinks = totalLinks.toString().includes(filters.links);
      }
      
      return matchesUrl && matchesTitle && matchesHtmlVersion && matchesStatus && matchesLinks;
    });
  };

  // Get sorted and paginated data
  const getSortedAndPaginatedUrls = (): URL[] => {
    // First filter, then sort URLs
    const filteredUrls = getFilteredUrls();
    const sorted = [...filteredUrls].sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortField === 'links') {
        // For links, calculate total links count
        aValue = (a.internal_links || 0) + (a.external_links || 0);
        bValue = (b.internal_links || 0) + (b.external_links || 0);
        
        // Numeric comparison for links
        if (sortDirection === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      } else {
        // String comparison for other fields
        aValue = a[sortField];
        bValue = b[sortField];
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';
        
        // Convert to string for comparison
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      }
    });

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sorted.slice(startIndex, endIndex);
  };

  // Get pagination info
  const getPaginationInfo = () => {
    const filteredUrls = getFilteredUrls();
    const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredUrls.length);
    
    return {
      totalPages,
      startIndex,
      endIndex,
      totalItems: filteredUrls.length
    };
  };

  const handleURLAdded = () => {
    fetchUrls();
    setError(null);
  };

  const handleGlobalSearchChange = (value: string) => {
    setGlobalSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      url: '',
      title: '',
      html_version: '',
      status: '',
      links: ''
    });
    setGlobalSearch('');
    setCurrentPage(1);
  };

  const paginatedUrls = getSortedAndPaginatedUrls();
  const paginationInfo = getPaginationInfo();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <DashboardHeader user={user} onLogout={logout} />

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

        <URLForm 
          user={user} 
          onURLAdded={handleURLAdded} 
          onError={setError}
        />

        <URLTable
          urls={urls}
          paginatedUrls={paginatedUrls}
          paginationInfo={paginationInfo}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sortField={sortField}
          sortDirection={sortDirection}
          filters={filters}
          globalSearch={globalSearch}
          selectedIds={selectedIds}
          bulkActionLoading={bulkActionLoading}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          onGlobalSearchChange={handleGlobalSearchChange}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectUrl={toggleSelectUrl}
          onBulkAction={handleBulkAction}
          onDeleteUrl={deleteUrl}
          onViewDetails={setSelectedUrl}
          onClearFilters={handleClearFilters}
        />

        {selectedUrl && (
          <URLDetailView 
            url={selectedUrl} 
            onClose={() => setSelectedUrl(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;