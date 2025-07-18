import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus } from 'lucide-react';

const URLForm = ({ onAddUrl, isAdding }) => {
  const [newUrl, setNewUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newUrl.trim()) {
      await onAddUrl(newUrl);
      setNewUrl('');
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
            disabled={isAdding}
            variant="gradient"
            className="h-10 px-4 btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add URL'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default URLForm;