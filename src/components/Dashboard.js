import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);

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
        setUrls(data);
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Web Crawler Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New URL</h2>
          <form onSubmit={addUrl} className="flex gap-4">
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter URL to crawl..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              disabled={adding}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add URL'}
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">URLs ({urls.length})</h2>
          </div>
          
          {urls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No URLs added yet. Add your first URL above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Links
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{url.url}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{url.title || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          url.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : url.status === 'crawling'
                            ? 'bg-blue-100 text-blue-800'
                            : url.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {url.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {url.internal_links + url.external_links}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => crawlUrl(url.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Crawl
                          </button>
                          <button
                            onClick={() => deleteUrl(url.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;