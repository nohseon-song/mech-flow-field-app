
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  onSettingsClick?: () => void;
  onAdminClick?: () => void;
}

const Header = ({ onSettingsClick, onAdminClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      toggleTheme();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">CheckMake-PRO mini</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">기계설비성능점검 + 유지관리</p>
            {user && (
              <p className="text-xs text-blue-600 dark:text-blue-400">{user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {user && (
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
              onClick={handleSettingsClick}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
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
