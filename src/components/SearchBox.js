import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';

const SearchBox = ({ 
  value, 
  onChange, 
  onClear, 
  placeholder = "Search all columns...",
  className = "" 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center gap-2 max-w-md">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 h-9"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-9 px-3 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;