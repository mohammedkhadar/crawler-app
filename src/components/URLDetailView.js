import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, ExternalLink, Globe, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const URLDetailView = ({ url, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  const { user } = useAuth();
  const [brokenLinks, setBrokenLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrokenLinks();
  }, [url.id]);

  const fetchBrokenLinks = async () => {
    try {
      const response = await fetch(`/api/urls/${url.id}/broken-links`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBrokenLinks(data || []);
      }
    } catch (err) {
      setError('Failed to fetch broken links');
    } finally {
      setLoading(false);
    }
  };

  const createChart = () => {
    const canvas = document.getElementById('linksChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const total = url.internal_links + url.external_links;
    
    if (total === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('No links found', canvas.width / 2, canvas.height / 2);
      return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const internalAngle = (url.internal_links / total) * 2 * Math.PI;
    const externalAngle = (url.external_links / total) * 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw internal links slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, internalAngle);
    ctx.closePath();
    ctx.fillStyle = '#3b82f6';
    ctx.fill();

    // Draw external links slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, internalAngle, internalAngle + externalAngle);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Draw labels
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    
    if (url.internal_links > 0) {
      const internalLabelAngle = internalAngle / 2;
      const internalLabelX = centerX + Math.cos(internalLabelAngle) * (radius * 0.7);
      const internalLabelY = centerY + Math.sin(internalLabelAngle) * (radius * 0.7);
      ctx.fillText(`${url.internal_links}`, internalLabelX, internalLabelY);
    }
    
    if (url.external_links > 0) {
      const externalLabelAngle = internalAngle + (externalAngle / 2);
      const externalLabelX = centerX + Math.cos(externalLabelAngle) * (radius * 0.7);
      const externalLabelY = centerY + Math.sin(externalLabelAngle) * (radius * 0.7);
      ctx.fillText(`${url.external_links}`, externalLabelX, externalLabelY);
    }
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(createChart, 100);
    }
  }, [loading, url]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">URL Details</DialogTitle>
          <DialogDescription className="text-sm">
            Comprehensive analysis for {url.url}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                URL Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">URL:</span>
                  <p className="text-sm break-all">{url.url}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Title:</span>
                  <p className="text-sm">{url.title || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">HTML Version:</span>
                  <p className="text-sm">{url.html_version || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Status:</span>
                  <Badge variant={
                    url.status === 'completed' 
                      ? 'success' 
                      : url.status === 'running'
                      ? 'info'
                      : url.status === 'failed'
                      ? 'destructive'
                      : 'warning'
                  }>
                    {url.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {url.status === 'running' && <Clock className="h-3 w-3 mr-1" />}
                    {url.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {url.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Last Crawled:</span>
                  <p className="text-sm">
                    {url.last_crawled ? new Date(url.last_crawled).toLocaleString() : 'Never'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Has Login Form:</span>
                  <p className="text-sm">{url.has_login_form ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heading Counts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Heading Analysis</CardTitle>
              <CardDescription className="text-sm">Distribution of HTML heading tags</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">{url.h1_count || 0}</div>
                  <div className="text-sm text-muted-foreground">H1 Tags</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">{url.h2_count || 0}</div>
                  <div className="text-sm text-muted-foreground">H2 Tags</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">{url.h3_count || 0}</div>
                  <div className="text-sm text-muted-foreground">H3 Tags</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">{url.h4_count || 0}</div>
                  <div className="text-sm text-muted-foreground">H4 Tags</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-red-600">{url.h5_count || 0}</div>
                  <div className="text-sm text-muted-foreground">H5 Tags</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-gray-600">{url.h6_count || 0}</div>
                  <div className="text-sm text-muted-foreground">H6 Tags</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Links Distribution</CardTitle>
              <CardDescription className="text-sm">Visual breakdown of internal vs external links</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex-shrink-0">
                  <canvas id="linksChart" width="200" height="200"></canvas>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm">Internal Links: <span className="font-semibold">{url.internal_links || 0}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">External Links: <span className="font-semibold">{url.external_links || 0}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-sm">Broken Links: <span className="font-semibold">{url.broken_links || 0}</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Broken Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5" />
                Broken Links
              </CardTitle>
              <CardDescription className="text-sm">Links that returned error status codes</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : error ? (
                <div className="text-destructive text-center py-8">{error}</div>
              ) : brokenLinks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No broken links found</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {brokenLinks.map((link, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium break-all">{link.link_url}</p>
                          {link.error_message && (
                            <p className="text-xs text-muted-foreground mt-1">{link.error_message}</p>
                          )}
                        </div>
                        <Badge variant="destructive" className="flex-shrink-0">
                          {link.status_code}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {url.error_message && (
            <Card className="border-destructive">
              <CardHeader className="pb-3">
                <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5" />
                  Error Message
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-destructive text-sm">{url.error_message}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default URLDetailView;