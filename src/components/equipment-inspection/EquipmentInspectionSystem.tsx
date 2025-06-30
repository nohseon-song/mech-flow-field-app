
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Save, Plus, FileText, Download } from 'lucide-react';
import { EQUIPMENT_TREE } from '@/data/equipmentTreeData';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

interface InspectionData {
  id: string;
  equipment: string;
  part: string;
  item: string;
  designValue: string;
  measuredValue: string;
  timestamp: string;
  notes?: string;
}

interface CustomEntry {
  id: string;
  equipment: string;
  part: string;
  item: string;
}

const EquipmentInspectionSystem = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [designValue, setDesignValue] = useState<string>('');
  const [measuredValue, setMeasuredValue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  const [inspectionData, setInspectionData] = useState<InspectionData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Custom entry states
  const [customEquipment, setCustomEquipment] = useState<string>('');
  const [customPart, setCustomPart] = useState<string>('');
  const [customItem, setCustomItem] = useState<string>('');
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);

  const availableParts = selectedEquipment ? Object.keys(EQUIPMENT_TREE[selectedEquipment as keyof typeof EQUIPMENT_TREE]) : [];
  const availableItems = selectedEquipment && selectedPart 
    ? EQUIPMENT_TREE[selectedEquipment as keyof typeof EQUIPMENT_TREE][selectedPart] || []
    : [];

  const resetForm = useCallback(() => {
    setSelectedEquipment('');
    setSelectedPart('');
    setSelectedItem('');
    setDesignValue('');
    setMeasuredValue('');
    setNotes('');
  }, []);

  const handleTempSave = () => {
    if (!selectedEquipment || !selectedPart || !selectedItem) {
      alert('설비명칭, 성능점검 부위, 세부점검 항목을 모두 선택해주세요.');
      return;
    }

    const newData: InspectionData = {
      id: Date.now().toString(),
      equipment: selectedEquipment,
      part: selectedPart,
      item: selectedItem,
      designValue,
      measuredValue,
      timestamp: new Date().toLocaleString('ko-KR'),
      notes
    };

    setInspectionData(prev => [...prev, newData]);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const item = inspectionData.find(data => data.id === id);
    if (item) {
      setSelectedEquipment(item.equipment);
      setSelectedPart(item.part);
      setSelectedItem(item.item);
      setDesignValue(item.designValue);
      setMeasuredValue(item.measuredValue);
      setNotes(item.notes || '');
      setEditingId(id);
    }
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    setInspectionData(prev => 
      prev.map(item => 
        item.id === editingId 
          ? {
              ...item,
              equipment: selectedEquipment,
              part: selectedPart,
              item: selectedItem,
              designValue,
              measuredValue,
              notes,
              timestamp: new Date().toLocaleString('ko-KR') + ' (수정됨)'
            }
          : item
      )
    );

    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      setInspectionData(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddCustomEntry = () => {
    if (!customEquipment || !customPart || !customItem) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newCustomEntry: CustomEntry = {
      id: Date.now().toString(),
      equipment: customEquipment,
      part: customPart,
      item: customItem
    };

    setCustomEntries(prev => [...prev, newCustomEntry]);
    setCustomEquipment('');
    setCustomPart('');
    setCustomItem('');
  };

  const handleDeleteCustomEntry = (id: string) => {
    setCustomEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(inspectionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `설비점검데이터_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">
            🔧 설비 성능점검 관리 시스템
          </CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-400">
            3단계 드롭다운으로 설비별 성능점검 항목을 체계적으로 관리하세요
          </p>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            설비 점검 정보 입력
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 3-Level Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="equipment">설비명칭 선택</Label>
              <Select value={selectedEquipment} onValueChange={(value) => {
                setSelectedEquipment(value);
                setSelectedPart('');
                setSelectedItem('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="설비명칭을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {Object.keys(EQUIPMENT_TREE).map((equipment) => (
                    <SelectItem key={equipment} value={equipment}>
                      {equipment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="part">성능점검 부위</Label>
              <Select 
                value={selectedPart} 
                onValueChange={(value) => {
                  setSelectedPart(value);
                  setSelectedItem('');
                }}
                disabled={!selectedEquipment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="부위를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableParts.map((part) => (
                    <SelectItem key={part} value={part}>
                      {part}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="item">세부점검 항목 (단위)</Label>
              <Select 
                value={selectedItem} 
                onValueChange={setSelectedItem}
                disabled={!selectedPart}
              >
                <SelectTrigger>
                  <SelectValue placeholder="항목을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Value Inputs */}
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designValue">설계값 입력</Label>
                <Input
                  id="designValue"
                  value={designValue}
                  onChange={(e) => setDesignValue(e.target.value)}
                  placeholder="설계 기준값을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="measuredValue">측정값 입력</Label>
                <Input
                  id="measuredValue"
                  value={measuredValue}
                  onChange={(e) => setMeasuredValue(e.target.value)}
                  placeholder="실측값을 입력하세요"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedItem && (
            <div>
              <Label htmlFor="notes">참고사항 (선택)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="추가 메모나 특이사항을 입력하세요"
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          {selectedItem && (
            <div className="flex gap-3">
              {editingId ? (
                <>
                  <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    수정 저장
                  </Button>
                  <Button onClick={() => {
                    setEditingId(null);
                    resetForm();
                  }} variant="outline">
                    취소
                  </Button>
                </>
              ) : (
                <Button onClick={handleTempSave} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  임시저장
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Entry Section */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 직접입력 등록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>설비명칭</Label>
              <Input
                value={customEquipment}
                onChange={(e) => setCustomEquipment(e.target.value)}
                placeholder="직접 입력"
              />
            </div>
            <div>
              <Label>성능점검 부위</Label>
              <Input
                value={customPart}
                onChange={(e) => setCustomPart(e.target.value)}
                placeholder="직접 입력"
              />
            </div>
            <div>
              <Label>세부점검 항목</Label>
              <Input
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                placeholder="직접 입력 (단위 포함)"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddCustomEntry} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                추가
              </Button>
            </div>
          </div>

          {customEntries.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-medium">등록된 사용자 항목:</h4>
                {customEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">
                      {entry.equipment} → {entry.part} → {entry.item}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCustomEntry(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Saved Data List */}
      {inspectionData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>임시저장 데이터 ({inspectionData.length}건)</CardTitle>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON 다운로드
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspectionData.map((data) => (
                <Card key={data.id} className="bg-gray-50 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Badge variant="secondary" className="mb-2">설비정보</Badge>
                        <p className="text-sm font-medium">{data.equipment}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{data.part}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{data.item}</p>
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2">측정값</Badge>
                        <p className="text-sm">설계값: <span className="font-medium">{data.designValue || 'N/A'}</span></p>
                        <p className="text-sm">측정값: <span className="font-medium">{data.measuredValue || 'N/A'}</span></p>
                        {data.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">메모: {data.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <Badge variant="outline" className="text-xs">{data.timestamp}</Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(data.id)}>
                            <Edit className="h-3 w-3 mr-1" />
                            수정
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(data.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
              📊 점검 현황 요약
            </h3>
            <div className="flex justify-center gap-6 text-sm">
              <span>총 저장 항목: <strong>{inspectionData.length}개</strong></span>
              <span>등록 설비: <strong>{new Set(inspectionData.map(d => d.equipment)).size}개</strong></span>
              <span>사용자 항목: <strong>{customEntries.length}개</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentInspectionSystem;
