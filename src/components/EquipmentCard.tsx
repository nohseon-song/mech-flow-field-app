
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Equipment {
  id: number;
  name: string;
  type: string;
  status: string;
  lastCheck: string;
  nextCheck: string;
  location: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '정상':
        return 'bg-green-100 text-green-800';
      case '점검필요':
        return 'bg-yellow-100 text-yellow-800';
      case '이상':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '정상':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case '점검필요':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case '이상':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">{equipment.name}</h3>
            <p className="text-sm text-slate-600">{equipment.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(equipment.status)}>
              {getStatusIcon(equipment.status)}
              <span className="ml-1">{equipment.status}</span>
            </Badge>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>{equipment.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>마지막 점검: {equipment.lastCheck}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>다음 점검: {equipment.nextCheck}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
            점검 시작
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            이력 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
