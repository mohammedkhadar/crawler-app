import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import URLDetailView from './URLDetailView';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, RotateCcw, User, LogOut, Play, Square, CheckSquare, Square as UncheckedSquare, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  
  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('url');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    url: '',
    title: '',
    html_version: '',
    status: '',
    links: ''
  });
  const [globalSearch, setGlobalSearch] = useState('');

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

  const fetchUrls = async () => {
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

  const addUrl = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setAdding(true);
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (response.ok) {
        setNewUrl('');
        fetchUrls();
        setError(null); // Clear any previous errors
      } else if (response.status === 409) {
        // Handle duplicate URL error
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
  };

  const deleteUrl = async (id) => {
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

  const handleBulkAction = async (action) => {
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

  const toggleSelectAll = () => {
    if (selectedIds.size === urls.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(urls.map(url => url.id)));
    }
  };

  const toggleSelectUrl = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Filter function
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Global search with fuzzy matching
  const matchesGlobalSearch = (url, searchTerm) => {
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
  const getFilteredUrls = () => {
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
  const getSortedAndPaginatedUrls = () => {
    // First filter, then sort URLs
    const filteredUrls = getFilteredUrls();
    const sorted = [...filteredUrls].sort((a, b) => {
      let aValue, bValue;
      
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
      <div style={{ borderBottom: '1px solid #ddd', padding: '20px 0', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            Web Crawler Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User style={{ width: '16px', height: '16px' }} />
              <span style={{ fontSize: '14px', color: '#666' }}>Welcome, {user?.username}</span>
            </div>
            <Button
              onClick={logout}
              variant="destructive"
              size="sm"
              className="btn-sm"
            >
              <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Logout
            </Button>
          </div>
        </div>
      </div>

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

        <Card className="card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New URL
            </CardTitle>
            <CardDescription className="text-sm">Enter a URL to crawl and analyze</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={addUrl} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL to crawl..."
                className="flex-1 h-10"
                required
              />
              <Button
                type="submit"
                disabled={adding}
                variant="gradient"
                className="h-10 px-4 btn-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                {adding ? 'Adding...' : 'Add URL'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-lg">URLs ({urls.length})</CardTitle>
                <CardDescription className="text-sm">Click on a row to view detailed analysis</CardDescription>
              </div>
            </div>
            
            {/* Global Search Box */}
            <div className="mb-4">
              <div className="flex items-center gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search all columns..."
                    value={globalSearch}
                    onChange={(e) => {
                      setGlobalSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 w-full h-9"
                  />
                </div>
                {globalSearch && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setGlobalSearch('');
                      setCurrentPage(1);
                    }}
                    className="h-9 px-3 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {selectedIds.size > 0 && (
                <div className="btn-group">
                  <Button
                    onClick={() => handleBulkAction('start')}
                    disabled={bulkActionLoading}
                    variant="outline"
                    size="sm"
                    className="btn-sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start ({selectedIds.size})
                  </Button>
                  {urls.some(url => selectedIds.has(url.id) && (url.status === 'crawling' || url.status === 'pending')) && (
                    <Button
                      onClick={() => handleBulkAction('stop')}
                      disabled={bulkActionLoading}
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
                    onClick={() => handleBulkAction('delete')}
                    disabled={bulkActionLoading}
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
          </CardHeader>
          <CardContent className="pt-0">
            {urls.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No URLs added yet. Add your first URL above!</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[5%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleSelectAll}
                          className="h-8 w-8 p-0 btn-sm"
                        >
                          {selectedIds.size === urls.length && urls.length > 0 ? 
                            <CheckSquare className="h-4 w-4" /> : 
                            <UncheckedSquare className="h-4 w-4" />
                          }
                        </Button>
                      </TableHead>
                      <TableHead className="w-[30%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('url')}
                          className="h-8 p-0 font-semibold hover:bg-transparent"
                        >
                          URL
                          {sortField === 'url' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[20%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('title')}
                          className="h-8 p-0 font-semibold hover:bg-transparent"
                        >
                          Title
                          {sortField === 'title' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[10%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('html_version')}
                          className="h-8 p-0 font-semibold hover:bg-transparent"
                        >
                          Version
                          {sortField === 'html_version' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[12%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('status')}
                          className="h-8 p-0 font-semibold hover:bg-transparent"
                        >
                          Status
                          {sortField === 'status' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[8%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort('links')}
                          className="h-8 p-0 font-semibold hover:bg-transparent"
                        >
                          Links
                          {sortField === 'links' && (
                            sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[10%]">Actions</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="w-[5%]">
                        {/* Empty cell for checkbox column */}
                      </TableHead>
                      <TableHead className="w-[30%]">
                        <Input
                          type="text"
                          placeholder="Filter by URL..."
                          value={filters.url}
                          onChange={(e) => handleFilterChange('url', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableHead>
                      <TableHead className="w-[20%]">
                        <Input
                          type="text"
                          placeholder="Filter by title..."
                          value={filters.title}
                          onChange={(e) => handleFilterChange('title', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableHead>
                      <TableHead className="w-[10%]">
                        <Input
                          type="text"
                          placeholder="Filter by version..."
                          value={filters.html_version}
                          onChange={(e) => handleFilterChange('html_version', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableHead>
                      <TableHead className="w-[12%]">
                        <select
                          value={filters.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="h-8 w-full px-2 text-sm border rounded"
                        >
                          <option value="">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="crawling">Crawling</option>
                          <option value="completed">Completed</option>
                          <option value="error">Error</option>
                          <option value="stopped">Stopped</option>
                        </select>
                      </TableHead>
                      <TableHead className="w-[8%]">
                        <Input
                          type="number"
                          placeholder="Links..."
                          value={filters.links}
                          onChange={(e) => handleFilterChange('links', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableHead>
                      <TableHead className="w-[10%]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFilters({
                              url: '',
                              title: '',
                              html_version: '',
                              status: '',
                              links: ''
                            });
                            setGlobalSearch('');
                            setCurrentPage(1);
                          }}
                          className="h-8 px-2 text-sm"
                        >
                          Clear All
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUrls.map((url) => (
                      <TableRow key={url.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectUrl(url.id);
                            }}
                            className="h-8 w-8 p-0 btn-sm"
                          >
                            {selectedIds.has(url.id) ? 
                              <CheckSquare className="h-4 w-4" /> : 
                              <UncheckedSquare className="h-4 w-4" />
                            }
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium cursor-pointer" onClick={() => setSelectedUrl(url)}>
                          <div className="table-cell-url text-sm" title={url.url}>{url.url}</div>
                        </TableCell>
                        <TableCell className="text-sm cursor-pointer" onClick={() => setSelectedUrl(url)}>
                          <div className="table-cell-title" title={url.title || 'N/A'}>{url.title || 'N/A'}</div>
                        </TableCell>
                        <TableCell className="text-sm cursor-pointer" onClick={() => setSelectedUrl(url)}>
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
                        <TableCell className="cursor-pointer" onClick={() => setSelectedUrl(url)}>
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
                              <Badge variant={
                                url.status === 'completed' 
                                  ? 'success' 
                                  : url.status === 'crawling'
                                  ? 'info'
                                  : url.status === 'error'
                                  ? 'destructive'
                                  : url.status === 'pending'
                                  ? 'warning'
                                  : 'secondary'
                              }>
                                {url.status === 'pending' ? 'Queued' : 
                                 url.status === 'crawling' ? 'Running' : 
                                 url.status === 'completed' ? 'Done' : 
                                 url.status === 'error' ? 'Error' : 
                                 url.status}
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
                        <TableCell className="text-sm cursor-pointer" onClick={() => setSelectedUrl(url)}>{url.internal_links + url.external_links}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUrl(url.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-destructive hover:text-destructive btn-sm"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {getFilteredUrls().length > 0 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Showing {paginationInfo.startIndex + 1} to {paginationInfo.endIndex} of {paginationInfo.totalItems} entries
                  </span>
                  <select 
                    value={itemsPerPage} 
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="ml-4 px-2 py-1 border rounded text-sm"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {paginationInfo.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(paginationInfo.totalPages, currentPage + 1))}
                    disabled={currentPage === paginationInfo.totalPages}
                    className="btn-sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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