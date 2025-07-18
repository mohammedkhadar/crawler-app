import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUrlData = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

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
      } else {
        setError('Failed to fetch URLs');
      }
    } catch (err) {
      setError('Error fetching URLs');
    } finally {
      setLoading(false);
    }
  };

  const addUrl = async (url) => {
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
        fetchUrls();
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to add URL' };
      }
    } catch (err) {
      return { success: false, error: 'Error adding URL' };
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
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete URL' };
      }
    } catch (err) {
      return { success: false, error: 'Error deleting URL' };
    }
  };

  const crawlUrl = async (id) => {
    try {
      const response = await fetch(`/api/urls/${id}/crawl`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        fetchUrls();
        return { success: true };
      } else {
        return { success: false, error: 'Failed to start crawling' };
      }
    } catch (err) {
      return { success: false, error: 'Error starting crawl' };
    }
  };

  const stopCrawl = async (id) => {
    try {
      const response = await fetch(`/api/urls/${id}/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        fetchUrls();
        return { success: true };
      } else {
        return { success: false, error: 'Failed to stop crawling' };
      }
    } catch (err) {
      return { success: false, error: 'Error stopping crawl' };
    }
  };

  const bulkAction = async (action, ids) => {
    try {
      const response = await fetch('/api/urls/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ action, ids: Array.from(ids) }),
      });
      if (response.ok) {
        fetchUrls();
        return { success: true };
      } else {
        return { success: false, error: `Failed to ${action} URLs` };
      }
    } catch (err) {
      return { success: false, error: `Error performing ${action}` };
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchUrls();
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      const interval = setInterval(() => {
        fetchUrls();
      }, 2000);
      setPollingInterval(interval);
      return () => clearInterval(interval);
    }
  }, [user?.token]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return {
    urls,
    loading,
    error,
    addUrl,
    deleteUrl,
    crawlUrl,
    stopCrawl,
    bulkAction,
    refetch: fetchUrls
  };
};