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

export const filterUrls = (urls: URL[], filters: Filters, globalSearch: string): URL[] => {
  return urls.filter(url => {
    // Global search - check if search term exists in any field
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase();
      const searchableFields = [
        url.url,
        url.title || '',
        url.html_version || '',
        url.status,
        String((url.internal_links || 0) + (url.external_links || 0))
      ];
      
      const matchesGlobalSearch = searchableFields.some(field => 
        field.toLowerCase().includes(searchLower)
      );
      
      if (!matchesGlobalSearch) return false;
    }

    // Column-specific filters
    const matchesUrl = !filters.url || url.url.toLowerCase().includes(filters.url.toLowerCase());
    const matchesTitle = !filters.title || (url.title || '').toLowerCase().includes(filters.title.toLowerCase());
    const matchesVersion = !filters.html_version || (url.html_version || '').toLowerCase().includes(filters.html_version.toLowerCase());
    const matchesStatus = !filters.status || url.status.toLowerCase().includes(filters.status.toLowerCase());
    const matchesLinks = !filters.links || String((url.internal_links || 0) + (url.external_links || 0)).includes(filters.links);

    return matchesUrl && matchesTitle && matchesVersion && matchesStatus && matchesLinks;
  });
};

export const sortUrls = (urls: URL[], sortField: SortField, sortDirection: SortDirection): URL[] => {
  return [...urls].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // Handle special case for 'links' field
    if (sortField === 'links') {
      aValue = (a.internal_links || 0) + (a.external_links || 0);
      bValue = (b.internal_links || 0) + (b.external_links || 0);
      
      if (sortDirection === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else {
      // String comparison for other fields
      switch (sortField) {
        case 'url':
          aValue = a.url;
          bValue = b.url;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'html_version':
          aValue = a.html_version;
          bValue = b.html_version;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = '';
          bValue = '';
      }
      
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
};

export const paginateUrls = (urls: URL[], currentPage: number, itemsPerPage: number): URL[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return urls.slice(startIndex, endIndex);
};

export const getPaginationInfo = (totalItems: number, currentPage: number, itemsPerPage: number) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    totalPages,
    startIndex,
    endIndex,
    totalItems
  };
};