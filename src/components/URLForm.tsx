import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

interface URLFormProps {
  onAddUrl: (url: string) => Promise<void>;
  loading?: boolean;
}

const URLForm: React.FC<URLFormProps> = ({ onAddUrl, loading = false }) => {
  const [newUrl, setNewUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    await onAddUrl(newUrl);
    setNewUrl('');
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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
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
            disabled={loading}
            variant="gradient"
            className="h-10 px-4 btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add URL'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default URLForm;