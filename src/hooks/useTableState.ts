import { useState, useCallback } from 'react';

type SortField = 'url' | 'title' | 'html_version' | 'status' | 'links';
type SortDirection = 'asc' | 'desc';

interface Filters {
  url: string;
  title: string;
  html_version: string;
  status: string;
  links: string;
}

interface UseTableStateReturn {
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: SortDirection;
  filters: Filters;
  globalSearch: string;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  setFilters: (filters: Filters) => void;
  setGlobalSearch: (search: string) => void;
  handleSort: (field: SortField) => void;
  clearAllFilters: () => void;
}

export const useTableState = (): UseTableStateReturn => {
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

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  }, [sortField]);

  const clearAllFilters = useCallback(() => {
    setGlobalSearch('');
    setFilters({
      url: '',
      title: '',
      html_version: '',
      status: '',
      links: ''
    });
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    filters,
    globalSearch,
    setCurrentPage,
    setItemsPerPage,
    setSortField,
    setSortDirection,
    setFilters,
    setGlobalSearch,
    handleSort,
    clearAllFilters
  };
};