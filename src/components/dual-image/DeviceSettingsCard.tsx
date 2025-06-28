
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface DeviceSettingsCardProps {
  equipmentName: string;
  setEquipmentName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}

const DeviceSettingsCard = ({
  equipmentName,
  setEquipmentName,
  location,
  setLocation
}: DeviceSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          ⚙️ 설비 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">설비명칭</label>
            <Input
              placeholder="설비 이름 또는 식별코드 (예: TUF-001)"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">설치 위치</label>
            <Input
              placeholder="현장명 또는 위치코드"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceSettingsCard;
