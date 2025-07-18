import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { User as UserType } from '../types';

interface DashboardHeaderProps {
  user: UserType | null;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => {
  return (
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
            onClick={onLogout}
            variant="destructive"
            size="sm"
            className="btn-sm"
          >
            <LogOut style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};