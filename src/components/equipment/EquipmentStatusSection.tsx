
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Download, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Equipment {
  id: number;
  name: string;
  location: string;
  type: string;
  status: 'normal' | 'warning' | 'critical';
  lastInspection: string;
  nextInspection: string;
  installedDate: string;
  notes: string;
}

const EquipmentStatusSection = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    location: '',
    type: '',
    status: 'normal',
    notes: ''
  });

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedEquipment = localStorage.getItem('equipmentList');
    if (savedEquipment) {
      try {
        setEquipmentList(JSON.parse(savedEquipment));
      } catch (error) {
        console.error('설비 데이터 로드 오류:', error);
        initializeDefaultEquipment();
      }
    } else {
      initializeDefaultEquipment();
    }
  }, []);

  // 기본 설비 데이터 초기화
  const initializeDefaultEquipment = () => {
    const defaultEquipment: Equipment[] = [
      {
        id: 1,
        name: '냉각수 순환펌프 #1',
        location: '기계실 A동',
        type: '펌프',
        status: 'normal',
        lastInspection: '2024-01-15',
        nextInspection: '2024-04-15',
        installedDate: '2022-03-10',
        notes: '정상 운전 중'
      },
      {
        id: 2,
        name: '공기압축기 #2',
        location: '유틸리티 동',
        type: '압축기',
        status: 'warning',
        lastInspection: '2024-01-20',
        nextInspection: '2024-03-20',
        installedDate: '2021-08-15',
        notes: '진동 수치 주의 관찰'
      },
      {
        id: 3,
        name: '열교환기 HX-101',
        location: '공정동 2층',
        type: '열교환기',
        status: 'normal',
        lastInspection: '2024-01-25',
        nextInspection: '2024-07-25',
        installedDate: '2020-12-05',
        notes: '효율 양호'
      }
    ];
    setEquipmentList(defaultEquipment);
    localStorage.setItem('equipmentList', JSON.stringify(defaultEquipment));
  };

  // 데이터 저장
  const saveEquipmentList = (newList: Equipment[]) => {
    setEquipmentList(newList);
    localStorage.setItem('equipmentList', JSON.stringify(newList));
  };

  // 설비 추가
  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.location) {
      toast({
        title: "입력 오류",
        description: "설비명과 위치는 필수 입력 항목입니다.",
        variant: "destructive"
      });
      return;
    }

    const equipment: Equipment = {
      id: Date.now(),
      name: newEquipment.name,
      location: newEquipment.location,
      type: newEquipment.type || '기타',
      status: (newEquipment.status as Equipment['status']) || 'normal',
      lastInspection: new Date().toISOString().split('T')[0],
      nextInspection: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      installedDate: new Date().toISOString().split('T')[0],
      notes: newEquipment.notes || ''
    };

    const newList = [...equipmentList, equipment];
    saveEquipmentList(newList);

    setNewEquipment({
      name: '',
      location: '',
      type: '',
      status: 'normal',
      notes: ''
    });
    setIsAddDialogOpen(false);

    toast({
      title: "설비 등록 완료",
      description: `${equipment.name}이(가) 성공적으로 등록되었습니다.`
    });
  };

  // 설비 편집
  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingEquipment) return;

    const updatedList = equipmentList.map(eq => 
      eq.id === editingEquipment.id ? editingEquipment : eq
    );
    saveEquipmentList(updatedList);
    setIsEditDialogOpen(false);
    setEditingEquipment(null);

    toast({
      title: "설비 정보 수정",
      description: "설비 정보가 성공적으로 수정되었습니다."
    });
  };

  // 설비 삭제
  const handleDeleteEquipment = (id: number) => {
    if (window.confirm('이 설비를 삭제하시겠습니까?')) {
      const newList = equipmentList.filter(eq => eq.id !== id);
      saveEquipmentList(newList);

      toast({
        title: "설비 삭제",
        description: "설비가 성공적으로 삭제되었습니다."
      });
    }
  };

  // 전체 데이터 다운로드
  const handleDownloadAll = () => {
    const csvContent = [
      ['설비명', '위치', '종류', '상태', '마지막점검', '다음점검', '설치일자', '비고'].join(','),
      ...equipmentList.map(eq => [
        eq.name,
        eq.location,
        eq.type,
        eq.status,
        eq.lastInspection,
        eq.nextInspection,
        eq.installedDate,
        eq.notes
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `equipment_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "다운로드 완료",
      description: "설비 목록이 CSV 파일로 다운로드되었습니다."
    });
  };

  // 상태별 색상
  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Equipment['status']) => {
    switch (status) {
      case 'normal': return '정상';
      case 'warning': return '주의';
      case 'critical': return '위험';
      default: return '미확인';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                설비 현황 관리
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                등록된 설비 목록을 관리하고 상태를 모니터링하세요
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
              총 {equipmentList.length}대
            </Badge>
            <Button 
              onClick={handleDownloadAll}
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              전체 다운로드
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  설비 등록
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>새 설비 등록</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">설비명 *</Label>
                    <Input
                      id="name"
                      value={newEquipment.name || ''}
                      onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                      placeholder="예: 냉각수 순환펌프 #1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">위치 *</Label>
                    <Input
                      id="location"
                      value={newEquipment.location || ''}
                      onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                      placeholder="예: 기계실 A동"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">종류</Label>
                    <Input
                      id="type"
                      value={newEquipment.type || ''}
                      onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})}
                      placeholder="예: 펌프, 압축기, 열교환기"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">비고</Label>
                    <Input
                      id="notes"
                      value={newEquipment.notes || ''}
                      onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                      placeholder="추가 정보 입력"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      취소
                    </Button>
                    <Button onClick={handleAddEquipment}>
                      등록
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">설비명</TableHead>
                <TableHead className="font-semibold">위치</TableHead>
                <TableHead className="font-semibold">상태</TableHead>
                <TableHead className="font-semibold">마지막 점검</TableHead>
                <TableHead className="font-semibold">다음 점검</TableHead>
                <TableHead className="font-semibold text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Settings className="h-8 w-8 text-gray-400" />
                      <p>등록된 설비가 없습니다</p>
                      <p className="text-sm">새로운 설비를 등록해보세요</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                equipmentList.map((equipment) => (
                  <TableRow key={equipment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold text-blue-600">{equipment.name}</div>
                        <div className="text-sm text-gray-500">{equipment.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {equipment.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(equipment.status)}>
                        {getStatusText(equipment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {equipment.lastInspection}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {equipment.nextInspection}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEquipment(equipment)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEquipment(equipment.id)}
                          className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 편집 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>설비 정보 수정</DialogTitle>
            </DialogHeader>
            {editingEquipment && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">설비명</Label>
                  <Input
                    id="edit-name"
                    value={editingEquipment.name}
                    onChange={(e) => setEditingEquipment({...editingEquipment, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-location">위치</Label>
                  <Input
                    id="edit-location"
                    value={editingEquipment.location}
                    onChange={(e) => setEditingEquipment({...editingEquipment, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">종류</Label>
                  <Input
                    id="edit-type"
                    value={editingEquipment.type}
                    onChange={(e) => setEditingEquipment({...editingEquipment, type: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">상태</Label>
                  <select
                    id="edit-status"
                    value={editingEquipment.status}
                    onChange={(e) => setEditingEquipment({...editingEquipment, status: e.target.value as Equipment['status']})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="normal">정상</option>
                    <option value="warning">주의</option>
                    <option value="critical">위험</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-notes">비고</Label>
                  <Input
                    id="edit-notes"
                    value={editingEquipment.notes}
                    onChange={(e) => setEditingEquipment({...editingEquipment, notes: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    저장
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EquipmentStatusSection;
