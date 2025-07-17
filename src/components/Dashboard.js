import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import URLDetailView from './URLDetailView';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, RotateCcw, User, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

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
      }
    } catch (err) {
      setError('Failed to crawl URL');
    }
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
            <CardTitle className="text-lg">URLs ({urls.length})</CardTitle>
            <CardDescription className="text-sm">Click on a row to view detailed analysis</CardDescription>
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
                      <TableHead className="w-[35%]">URL</TableHead>
                      <TableHead className="w-[20%]">Title</TableHead>
                      <TableHead className="w-[12%]">HTML Version</TableHead>
                      <TableHead className="w-[12%]">Status</TableHead>
                      <TableHead className="w-[8%]">Links</TableHead>
                      <TableHead className="w-[13%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls.map((url) => (
                      <TableRow key={url.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedUrl(url)}>
                        <TableCell className="font-medium">
                          <div className="max-w-xs truncate text-sm">{url.url}</div>
                        </TableCell>
                        <TableCell className="text-sm">{url.title || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{url.html_version || 'N/A'}</TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {url.status === 'queued' && (
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
                            {url.status === 'failed' && (
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
                                  : url.status === 'failed'
                                  ? 'destructive'
                                  : url.status === 'queued'
                                  ? 'warning'
                                  : 'secondary'
                              }>
                                {url.status === 'queued' ? 'Queued' : 
                                 url.status === 'crawling' ? 'Running' : 
                                 url.status === 'completed' ? 'Done' : 
                                 url.status === 'failed' ? 'Error' : 
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
                        <TableCell className="text-sm">{url.internal_links + url.external_links}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                crawlUrl(url.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUrl(url.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-destructive hover:text-destructive"
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