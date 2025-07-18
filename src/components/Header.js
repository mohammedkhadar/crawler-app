import React from 'react';
import { Button } from './ui/button';
import { User, LogOut } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Web Crawler Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and analyze your crawled URLs</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm text-gray-700">{user?.username}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="h-9 px-3"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;