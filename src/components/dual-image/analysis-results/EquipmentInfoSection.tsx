
import React from 'react';
import { Clock, MapPin, Settings } from 'lucide-react';

interface EquipmentInfoSectionProps {
  equipmentName: string;
  location: string;
  timestamp: string;
}

const EquipmentInfoSection = ({ equipmentName, location, timestamp }: EquipmentInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-blue-500" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">설비명칭</p>
          <p className="font-medium text-gray-900 dark:text-white">{equipmentName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-green-500" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">설치위치</p>
          <p className="font-medium text-gray-900 dark:text-white">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-purple-500" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">분석일시</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {new Date(timestamp).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquipmentInfoSection;
