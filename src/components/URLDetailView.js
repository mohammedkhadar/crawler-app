import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const URLDetailView = ({ url, onClose }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">URL Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* URL Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">URL Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">URL:</span>
                <p className="font-medium break-all">{url.url}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Title:</span>
                <p className="font-medium">{url.title || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">HTML Version:</span>
                <p className="font-medium">{url.html_version || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  url.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : url.status === 'running'
                    ? 'bg-blue-100 text-blue-800'
                    : url.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {url.status}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Crawled:</span>
                <p className="font-medium">
                  {url.last_crawled ? new Date(url.last_crawled).toLocaleString() : 'Never'}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Has Login Form:</span>
                <p className="font-medium">{url.has_login_form ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Heading Counts */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Heading Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{url.h1_count || 0}</div>
                <div className="text-sm text-gray-600">H1 Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{url.h2_count || 0}</div>
                <div className="text-sm text-gray-600">H2 Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{url.h3_count || 0}</div>
                <div className="text-sm text-gray-600">H3 Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{url.h4_count || 0}</div>
                <div className="text-sm text-gray-600">H4 Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{url.h5_count || 0}</div>
                <div className="text-sm text-gray-600">H5 Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{url.h6_count || 0}</div>
                <div className="text-sm text-gray-600">H6 Tags</div>
              </div>
            </div>
          </div>

          {/* Links Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Links Distribution</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <canvas id="linksChart" width="200" height="200"></canvas>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Internal Links: {url.internal_links || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">External Links: {url.external_links || 0}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Broken Links: {url.broken_links || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Broken Links */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Broken Links</h3>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : brokenLinks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No broken links found</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {brokenLinks.map((link, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium break-all">{link.link_url}</p>
                        {link.error_message && (
                          <p className="text-xs text-gray-600 mt-1">{link.error_message}</p>
                        )}
                      </div>
                      <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        {link.status_code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {url.error_message && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 text-red-800">Error Message</h3>
              <p className="text-red-700">{url.error_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLDetailView;