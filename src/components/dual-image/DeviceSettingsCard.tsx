
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface DeviceSettingsCardProps {
  deviceId: string;
  setDeviceId: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
}

const DeviceSettingsCard = ({
  deviceId,
  setDeviceId,
  location,
  setLocation,
  webhookUrl,
  setWebhookUrl
}: DeviceSettingsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          ⚙️ 장비 정보 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">장비 ID</label>
            <Input
              placeholder="장비 고유 식별자 (예: TUF-001)"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
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
        <div>
          <label className="block text-sm font-medium mb-2">Webhook URL</label>
          <Input
            placeholder="Make.com Webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceSettingsCard;
