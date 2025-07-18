import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import URLDetailView from './URLDetailView';
import URLTable from './URLTable';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, User, LogOut } from 'lucide-react';

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
                className="h-10 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                {adding ? 'Adding...' : 'Add URL'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">URLs ({urls.length})</CardTitle>
                <CardDescription className="text-sm">Click on a row to view detailed analysis</CardDescription>
              </div>
              {selectedIds.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBulkAction('start')}
                    disabled={bulkActionLoading}
                    variant="outline"
                    size="sm"
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
              <URLTable
                urls={urls}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onBulkAction={handleBulkAction}
                bulkActionLoading={bulkActionLoading}
                onViewDetails={setSelectedUrl}
                onDeleteUrl={deleteUrl}
              />
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