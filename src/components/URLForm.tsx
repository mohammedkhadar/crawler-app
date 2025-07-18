import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from '../types';

interface URLFormProps {
  user: User | null;
  onURLAdded: () => void;
  onError: (error: string) => void;
}

export const URLForm: React.FC<URLFormProps> = ({ user, onURLAdded, onError }) => {
  const [newUrl, setNewUrl] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const addUrl = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
        onURLAdded();
        onError(''); // Clear any previous errors
      } else if (response.status === 409) {
        // Handle duplicate URL error
        const errorData = await response.json();
        onError(errorData.error || 'This URL already exists');
      } else {
        onError('Failed to add URL');
      }
    } catch (err) {
      onError('Failed to add URL');
    } finally {
      setAdding(false);
    }
  };

  return (
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
            variant="default"
            className="h-10 px-4 btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            {adding ? 'Adding...' : 'Add URL'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};