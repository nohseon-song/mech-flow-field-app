import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, ClipboardCheck, BarChart3, History, AlertTriangle, CheckCircle, Sparkles, Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EquipmentRegistrationDialog from '@/components/EquipmentRegistrationDialog';
import EquipmentDetailsDialog from '@/components/EquipmentDetailsDialog';

const Index = () => {
  const navigate = useNavigate();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [equipmentData, setEquipmentData] = useState([
    {
      id: 1,
      name: "보일러 #1",
      location: "지하 1층 기계실",
      inspectionDate: "2024-06-13"
    },
    {
      id: 2,
      name: "냉각탑 #2", 
      location: "옥상",
      inspectionDate: "2024-06-10"
    },
    {
      id: 3,
      name: "송풍기 #A",
      location: "3층 기계실", 
      inspectionDate: "2024-06-12"
    },
    {
      id: 4,
      name: "압축기 #3",
      location: "2층 공장동",
      inspectionDate: "2024-06-11"
    }
  ]);

  const handleEquipmentSave = (equipmentInfo) => {
    if (editingEquipment) {
      setEquipmentData(prev => prev.map(item => 
        item.id === editingEquipment.id ? { ...item, ...equipmentInfo } : item
      ));
    } else {
      const newEquipment = {
        id: Date.now(),
        ...equipmentInfo
      };
      setEquipmentData(prev => [...prev, newEquipment]);
    }
    setIsRegistrationOpen(false);
    setEditingEquipment(null);
  };

  const handleEquipmentEdit = (equipment) => {
    setEditingEquipment(equipment);
    setIsRegistrationOpen(true);
  };

  const handleEquipmentDelete = (equipmentId) => {
    setEquipmentData(prev => prev.filter(item => item.id !== equipmentId));
  };

  const handleEquipmentNameClick = (equipment) => {
    setSelectedEquipment(equipment);
    setIsDetailsOpen(true);
  };

  const handleDetailsEdit = (equipment) => {
    setEditingEquipment(equipment);
    setIsRegistrationOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
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

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* AI Features */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              <span className="font-bold">AI 스마트 기능</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs font-extrabold">
                NEW
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => navigate('/ai')}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI 기능 둘러보기
            </Button>
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-600" />
                설비 현황
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{equipmentData.length}대</Badge>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setEditingEquipment(null);
                    setIsRegistrationOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  설비등록
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-bold">명칭</TableHead>
                    <TableHead className="text-xs font-bold">설치위치</TableHead>
                    <TableHead className="text-xs font-bold">점검일자</TableHead>
                    <TableHead className="text-xs font-bold w-16">편집</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentData.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell 
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                        onClick={() => handleEquipmentNameClick(equipment)}
                      >
                        {equipment.name}
                      </TableCell>
                      <TableCell className="text-xs">{equipment.location}</TableCell>
                      <TableCell className="text-xs">{equipment.inspectionDate}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEquipmentEdit(equipment)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-slate-600" />
              최근 활동
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">보일러 #1 점검 완료</p>
                <p className="text-xs text-slate-600">2시간 전</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">압축기 #3 이상 감지</p>
                <p className="text-xs text-slate-600">5시간 전</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EquipmentRegistrationDialog
        open={isRegistrationOpen}
        onOpenChange={setIsRegistrationOpen}
        onSave={handleEquipmentSave}
        onDelete={handleEquipmentDelete}
        editingEquipment={editingEquipment}
      />

      <EquipmentDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        equipment={selectedEquipment}
        onEdit={handleDetailsEdit}
      />
    </div>
  );
};

export default Index;
