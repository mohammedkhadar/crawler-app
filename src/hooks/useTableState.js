import { useState, useMemo } from 'react';

export const useTableState = (urls) => {
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
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
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

  const handleSelectionChange = (id) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === urls.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(urls.map(url => url.id)));
    }
  };

  const filteredUrls = useMemo(() => {
    let filtered = urls;

    // Apply global search
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase();
      filtered = filtered.filter(url => 
        url.url.toLowerCase().includes(searchLower) ||
        (url.title && url.title.toLowerCase().includes(searchLower)) ||
        (url.html_version && url.html_version.toLowerCase().includes(searchLower)) ||
        url.status.toLowerCase().includes(searchLower) ||
        url.links.toString().includes(searchLower)
      );
    }

    // Apply column filters
    filtered = filtered.filter(url => {
      return (
        (!filters.url || url.url.toLowerCase().includes(filters.url.toLowerCase())) &&
        (!filters.title || (url.title && url.title.toLowerCase().includes(filters.title.toLowerCase()))) &&
        (!filters.html_version || (url.html_version && url.html_version.toLowerCase().includes(filters.html_version.toLowerCase()))) &&
        (!filters.status || url.status.toLowerCase().includes(filters.status.toLowerCase())) &&
        (!filters.links || url.links.toString().includes(filters.links))
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'links') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [urls, globalSearch, filters, sortField, sortDirection]);

  const paginatedUrls = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUrls.slice(startIndex, endIndex);
  }, [filteredUrls, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUrls.length);

  return {
    // State
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    filters,
    globalSearch,
    selectedIds,
    
    // Computed
    filteredUrls,
    paginatedUrls,
    totalPages,
    startIndex,
    endIndex,
    
    // Actions
    setCurrentPage,
    setItemsPerPage,
    handleSort,
    handleFilterChange,
    clearFilters,
    setGlobalSearch,
    handleSelectionChange,
    handleSelectAll,
    setSelectedIds
  };
};