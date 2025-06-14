
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onSettingsClick?: () => void;
  onAdminClick?: () => void;
}

const Header = ({ onSettingsClick, onAdminClick }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">CheckMake-PRO mini</h1>
            <p className="text-sm text-slate-600">기계설비성능점검 + 유지관리</p>
            {user && (
              <p className="text-xs text-blue-600">{user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onAdminClick}
              >
                <Shield className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onSettingsClick}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
