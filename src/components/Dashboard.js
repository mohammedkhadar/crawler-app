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

  useEffect(() => {
    fetchUrls();
  }, []);

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
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold">Web Crawler Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
              </div>
              <Button
                onClick={logout}
                variant="destructive"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New URL</CardTitle>
            <CardDescription>Enter a URL to crawl and analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addUrl} className="flex gap-4">
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL to crawl..."
                className="flex-1"
                required
              />
              <Button
                type="submit"
                disabled={adding}
              >
                <Plus className="h-4 w-4 mr-2" />
                {adding ? 'Adding...' : 'Add URL'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>URLs ({urls.length})</CardTitle>
            <CardDescription>Click on a row to view detailed analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {urls.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No URLs added yet. Add your first URL above!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>HTML Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.id} className="cursor-pointer" onClick={() => setSelectedUrl(url)}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate">{url.url}</div>
                      </TableCell>
                      <TableCell>{url.title || 'N/A'}</TableCell>
                      <TableCell>{url.html_version || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          url.status === 'completed' 
                            ? 'success' 
                            : url.status === 'crawling'
                            ? 'info'
                            : url.status === 'failed'
                            ? 'destructive'
                            : 'warning'
                        }>
                          {url.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{url.internal_links + url.external_links}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              crawlUrl(url.id);
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Crawl
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUrl(url.id);
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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