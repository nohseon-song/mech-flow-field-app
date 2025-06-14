
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">CheckMake-PRO mini</h1>
            <p className="text-sm text-slate-600">기계설비성능점검 + 유지관리</p>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
