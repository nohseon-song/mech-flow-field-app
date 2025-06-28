
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitCompare, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const AppHeader = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <GitCompare className="h-6 w-6 text-indigo-600" />
                AI 다중 설비 분석
              </h1>
              <p className="text-sm text-slate-600 dark:text-gray-300">기준값과 측정값 자동 비교 및 진단</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="ml-auto"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
