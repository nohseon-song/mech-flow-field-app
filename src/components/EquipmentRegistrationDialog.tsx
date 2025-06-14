
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

const equipmentTypes = [
  '냉동기(일반)',
  '냉동기(흡수식)',
  '흡수식 냉온수기',
  '공랭식 냉동기',
  '냉각탑',
  '축열조',
  '보일러',
  '열교환기',
  '팽창탱크',
  '펌프(냉ㆍ난방)',
  '신재생에너지시스템(지열)',
  '신재생에너지시스템(태양열)',
  '신재생에너지시스템(연료전지)',
  '패키지에어컨',
  '항온항습기',
  '공기조화기',
  '팬코일유닛',
  '환기설비',
  '필터',
  '고·저수조',
  '오수정화설비',
  '물 재이용설비',
  '자동제어 시스템'
];

interface EquipmentRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (equipment: any) => void;
  onDelete: (equipmentId: number) => void;
  editingEquipment?: any;
}

const EquipmentRegistrationDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  onDelete, 
  editingEquipment 
}: EquipmentRegistrationDialogProps) => {
  const [formData, setFormData] = useState({
    equipmentType: '',
    name: '',
    location: '',
    inspectionDate: '',
    // 압축기 관련
    operatingTime: '',
    capacity: '',
    capacityLevel: '',
    dischargePressure: '',
    dischargePressureUnit: 'bar',
    suctionPressure: '',
    suctionPressureUnit: 'MPa',
    flowRate: '',
    flowRateUnit: 'm³/h',
    // 응축기 관련
    condenserInletTemp: '',
    condenserInletTempUnit: '°C',
    condenserOutletTemp: '',
    condenserOutletTempUnit: '°C',
    condenserFlowRate: '',
    condenserFlowRateUnit: 'm³/h',
    // 냉매 관련
    refrigerantType: '',
    refrigerantPressure: '',
    refrigerantPressureUnit: 'MPa',
    // 기타
    noise: '',
    noiseUnit: 'dB',
    protectionStatus: ''
  });

  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        equipmentType: editingEquipment.type || '',
        name: editingEquipment.name || '',
        location: editingEquipment.location || '',
        inspectionDate: editingEquipment.inspectionDate || '',
        operatingTime: editingEquipment.operatingTime || '',
        capacity: editingEquipment.capacity || '',
        capacityLevel: editingEquipment.capacityLevel || '',
        dischargePressure: editingEquipment.dischargePressure || '',
        dischargePressureUnit: editingEquipment.dischargePressureUnit || 'bar',
        suctionPressure: editingEquipment.suctionPressure || '',
        suctionPressureUnit: editingEquipment.suctionPressureUnit || 'MPa',
        flowRate: editingEquipment.flowRate || '',
        flowRateUnit: editingEquipment.flowRateUnit || 'm³/h',
        condenserInletTemp: editingEquipment.condenserInletTemp || '',
        condenserInletTempUnit: editingEquipment.condenserInletTempUnit || '°C',
        condenserOutletTemp: editingEquipment.condenserOutletTemp || '',
        condenserOutletTempUnit: editingEquipment.condenserOutletTempUnit || '°C',
        condenserFlowRate: editingEquipment.condenserFlowRate || '',
        condenserFlowRateUnit: editingEquipment.condenserFlowRateUnit || 'm³/h',
        refrigerantType: editingEquipment.refrigerantType || '',
        refrigerantPressure: editingEquipment.refrigerantPressure || '',
        refrigerantPressureUnit: editingEquipment.refrigerantPressureUnit || 'MPa',
        noise: editingEquipment.noise || '',
        noiseUnit: editingEquipment.noiseUnit || 'dB',
        protectionStatus: editingEquipment.protectionStatus || ''
      });
    } else {
      setFormData({
        equipmentType: '',
        name: '',
        location: '',
        inspectionDate: '',
        operatingTime: '',
        capacity: '',
        capacityLevel: '',
        dischargePressure: '',
        dischargePressureUnit: 'bar',
        suctionPressure: '',
        suctionPressureUnit: 'MPa',
        flowRate: '',
        flowRateUnit: 'm³/h',
        condenserInletTemp: '',
        condenserInletTempUnit: '°C',
        condenserOutletTemp: '',
        condenserOutletTempUnit: '°C',
        condenserFlowRate: '',
        condenserFlowRateUnit: 'm³/h',
        refrigerantType: '',
        refrigerantPressure: '',
        refrigerantPressureUnit: 'MPa',
        noise: '',
        noiseUnit: 'dB',
        protectionStatus: ''
      });
    }
  }, [editingEquipment, open]);

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      alert('설비명과 설치위치를 입력해주세요.');
      return;
    }

    onSave({
      name: formData.name,
      location: formData.location,
      inspectionDate: formData.inspectionDate || new Date().toISOString().split('T')[0],
      type: formData.equipmentType,
      ...formData
    });
  };

  const handleDelete = () => {
    if (editingEquipment) {
      onDelete(editingEquipment.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEquipment ? '설비 정보 수정' : '새 설비 등록'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipmentType">설비 종류</Label>
              <Select 
                value={formData.equipmentType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, equipmentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="설비 종류를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">설비명 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="예: 보일러 #1"
              />
            </div>

            <div>
              <Label htmlFor="location">설치위치 *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="예: 지하 1층 기계실"
              />
            </div>

            <div>
              <Label htmlFor="inspectionDate">점검일자</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
              />
            </div>
          </div>

          {/* 압축기 관련 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">압축기</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>기동 및 정지</Label>
                <Input
                  value={formData.operatingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, operatingTime: e.target.value }))}
                  placeholder="운전시간"
                />
              </div>
              
              <div>
                <Label>용량 × 대수</Label>
                <Input
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="용량 (kW)"
                />
              </div>

              <div>
                <Label>운용율(용량부)</Label>
                <Input
                  value={formData.capacityLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacityLevel: e.target.value }))}
                  placeholder="운용율 (level)"
                />
              </div>

              <div>
                <Label>토출(브라인) 압 · 유량출입</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.dischargePressure}
                    onChange={(e) => setFormData(prev => ({ ...prev, dischargePressure: e.target.value }))}
                    placeholder="압력"
                  />
                  <Select
                    value={formData.dischargePressureUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, dischargePressureUnit: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">bar</SelectItem>
                      <SelectItem value="MPa">MPa</SelectItem>
                      <SelectItem value="Pa">Pa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>압 · 유량입력</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.suctionPressure}
                    onChange={(e) => setFormData(prev => ({ ...prev, suctionPressure: e.target.value }))}
                    placeholder="압력"
                  />
                  <Select
                    value={formData.suctionPressureUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, suctionPressureUnit: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MPa">MPa</SelectItem>
                      <SelectItem value="bar">bar</SelectItem>
                      <SelectItem value="Pa">Pa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>냉수(브라인) 순환량</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.flowRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, flowRate: e.target.value }))}
                    placeholder="유량"
                  />
                  <Select
                    value={formData.flowRateUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, flowRateUnit: value }))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m³/h">m³/h</SelectItem>
                      <SelectItem value="L/min">L/min</SelectItem>
                      <SelectItem value="L/s">L/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* 응축기 관련 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">응축기</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>냉각수 입 · 출구온도</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.condenserInletTemp}
                    onChange={(e) => setFormData(prev => ({ ...prev, condenserInletTemp: e.target.value }))}
                    placeholder="입구온도"
                  />
                  <Select
                    value={formData.condenserInletTempUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condenserInletTempUnit: value }))}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="°C">°C</SelectItem>
                      <SelectItem value="K">K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>냉각수 압 · 출구압력</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.condenserOutletTemp}
                    onChange={(e) => setFormData(prev => ({ ...prev, condenserOutletTemp: e.target.value }))}
                    placeholder="출구온도"
                  />
                  <Select
                    value={formData.condenserOutletTempUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condenserOutletTempUnit: value }))}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="°C">°C</SelectItem>
                      <SelectItem value="K">K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>냉각수 순환량</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.condenserFlowRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, condenserFlowRate: e.target.value }))}
                    placeholder="유량"
                  />
                  <Select
                    value={formData.condenserFlowRateUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condenserFlowRateUnit: value }))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m³/h">m³/h</SelectItem>
                      <SelectItem value="L/min">L/min</SelectItem>
                      <SelectItem value="L/s">L/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* 냉매 관련 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">냉매</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>종류</Label>
                <Input
                  value={formData.refrigerantType}
                  onChange={(e) => setFormData(prev => ({ ...prev, refrigerantType: e.target.value }))}
                  placeholder="냉매 종류"
                />
              </div>

              <div>
                <Label>인정발명 압력 입력</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.refrigerantPressure}
                    onChange={(e) => setFormData(prev => ({ ...prev, refrigerantPressure: e.target.value }))}
                    placeholder="압력"
                  />
                  <Select
                    value={formData.refrigerantPressureUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, refrigerantPressureUnit: value }))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MPa">MPa</SelectItem>
                      <SelectItem value="bar">bar</SelectItem>
                      <SelectItem value="Pa">Pa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>소음</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.noise}
                    onChange={(e) => setFormData(prev => ({ ...prev, noise: e.target.value }))}
                    placeholder="소음"
                  />
                  <Select
                    value={formData.noiseUnit}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, noiseUnit: value }))}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dB">dB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>보호 장치</Label>
                <Input
                  value={formData.protectionStatus}
                  onChange={(e) => setFormData(prev => ({ ...prev, protectionStatus: e.target.value }))}
                  placeholder="보호 장치 상태"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <div>
            {editingEquipment && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>설비 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 설비를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentRegistrationDialog;
