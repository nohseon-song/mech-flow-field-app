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
    // 추가 설비 정보
    manufacturer: '',
    modelNumber: '',
    coolingCapacity: '',
    currentVoltage: '',
    // 압축기 관련
    operatingMethod: '',
    capacity: '',
    lubricantLevel: '',
    // 증발기 관련
    chilledWaterInletTemp: '',
    chilledWaterInletTempUnit: '℃',
    chilledWaterOutletTemp: '',
    chilledWaterOutletTempUnit: '℃',
    chilledWaterInletPressure: '',
    chilledWaterInletPressureUnit: 'MPa',
    chilledWaterOutletPressure: '',
    chilledWaterOutletPressureUnit: 'MPa',
    chilledWaterFlowRate: '',
    chilledWaterFlowRateUnit: 'm³/h',
    // 응축기 관련
    coolingWaterInletTemp: '',
    coolingWaterInletTempUnit: '℃',
    coolingWaterOutletTemp: '',
    coolingWaterOutletTempUnit: '℃',
    coolingWaterInletPressure: '',
    coolingWaterInletPressureUnit: 'MPa',
    coolingWaterOutletPressure: '',
    coolingWaterOutletPressureUnit: 'MPa',
    coolingWaterFlowRate: '',
    coolingWaterFlowRateUnit: 'm³/h',
    // 냉매 관련
    refrigerantType: '',
    // 안전밸브 설정 압력
    safetyValvePressure: '',
    safetyValvePressureUnit: 'MPa',
    // 소음
    noise: '',
    noiseUnit: 'dB',
    // 보호장치
    protectionDevice: ''
  });

  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        equipmentType: editingEquipment.type || '',
        name: editingEquipment.name || '',
        location: editingEquipment.location || '',
        inspectionDate: editingEquipment.inspectionDate || '',
        manufacturer: editingEquipment.manufacturer || '',
        modelNumber: editingEquipment.modelNumber || '',
        coolingCapacity: editingEquipment.coolingCapacity || '',
        currentVoltage: editingEquipment.currentVoltage || '',
        operatingMethod: editingEquipment.operatingMethod || '',
        capacity: editingEquipment.capacity || '',
        lubricantLevel: editingEquipment.lubricantLevel || '',
        chilledWaterInletTemp: editingEquipment.chilledWaterInletTemp || '',
        chilledWaterInletTempUnit: editingEquipment.chilledWaterInletTempUnit || '℃',
        chilledWaterOutletTemp: editingEquipment.chilledWaterOutletTemp || '',
        chilledWaterOutletTempUnit: editingEquipment.chilledWaterOutletTempUnit || '℃',
        chilledWaterInletPressure: editingEquipment.chilledWaterInletPressure || '',
        chilledWaterInletPressureUnit: editingEquipment.chilledWaterInletPressureUnit || 'MPa',
        chilledWaterOutletPressure: editingEquipment.chilledWaterOutletPressure || '',
        chilledWaterOutletPressureUnit: editingEquipment.chilledWaterOutletPressureUnit || 'MPa',
        chilledWaterFlowRate: editingEquipment.chilledWaterFlowRate || '',
        chilledWaterFlowRateUnit: editingEquipment.chilledWaterFlowRateUnit || 'm³/h',
        coolingWaterInletTemp: editingEquipment.coolingWaterInletTemp || '',
        coolingWaterInletTempUnit: editingEquipment.coolingWaterInletTempUnit || '℃',
        coolingWaterOutletTemp: editingEquipment.coolingWaterOutletTemp || '',
        coolingWaterOutletTempUnit: editingEquipment.coolingWaterOutletTempUnit || '℃',
        coolingWaterInletPressure: editingEquipment.coolingWaterInletPressure || '',
        coolingWaterInletPressureUnit: editingEquipment.coolingWaterInletPressureUnit || 'MPa',
        coolingWaterOutletPressure: editingEquipment.coolingWaterOutletPressure || '',
        coolingWaterOutletPressureUnit: editingEquipment.coolingWaterOutletPressureUnit || 'MPa',
        coolingWaterFlowRate: editingEquipment.coolingWaterFlowRate || '',
        coolingWaterFlowRateUnit: editingEquipment.coolingWaterFlowRateUnit || 'm³/h',
        refrigerantType: editingEquipment.refrigerantType || '',
        safetyValvePressure: editingEquipment.safetyValvePressure || '',
        safetyValvePressureUnit: editingEquipment.safetyValvePressureUnit || 'MPa',
        noise: editingEquipment.noise || '',
        noiseUnit: editingEquipment.noiseUnit || 'dB',
        protectionDevice: editingEquipment.protectionDevice || ''
      });
    } else {
      setFormData({
        equipmentType: '',
        name: '',
        location: '',
        inspectionDate: '',
        manufacturer: '',
        modelNumber: '',
        coolingCapacity: '',
        currentVoltage: '',
        operatingMethod: '',
        capacity: '',
        lubricantLevel: '',
        chilledWaterInletTemp: '',
        chilledWaterInletTempUnit: '℃',
        chilledWaterOutletTemp: '',
        chilledWaterOutletTempUnit: '℃',
        chilledWaterInletPressure: '',
        chilledWaterInletPressureUnit: 'MPa',
        chilledWaterOutletPressure: '',
        chilledWaterOutletPressureUnit: 'MPa',
        chilledWaterFlowRate: '',
        chilledWaterFlowRateUnit: 'm³/h',
        coolingWaterInletTemp: '',
        coolingWaterInletTempUnit: '℃',
        coolingWaterOutletTemp: '',
        coolingWaterOutletTempUnit: '℃',
        coolingWaterInletPressure: '',
        coolingWaterInletPressureUnit: 'MPa',
        coolingWaterOutletPressure: '',
        coolingWaterOutletPressureUnit: 'MPa',
        coolingWaterFlowRate: '',
        coolingWaterFlowRateUnit: 'm³/h',
        refrigerantType: '',
        safetyValvePressure: '',
        safetyValvePressureUnit: 'MPa',
        noise: '',
        noiseUnit: 'dB',
        protectionDevice: ''
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manufacturer">제조회사</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                  placeholder="제조회사"
                />
              </div>

              <div>
                <Label htmlFor="modelNumber">모델번호</Label>
                <Input
                  id="modelNumber"
                  value={formData.modelNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelNumber: e.target.value }))}
                  placeholder="모델번호"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coolingCapacity">냉동능력(kW/usRT)</Label>
                <Input
                  id="coolingCapacity"
                  value={formData.coolingCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, coolingCapacity: e.target.value }))}
                  placeholder="냉동능력"
                />
              </div>

              <div>
                <Label htmlFor="currentVoltage">전류/전압(A/V)</Label>
                <Input
                  id="currentVoltage"
                  value={formData.currentVoltage}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentVoltage: e.target.value }))}
                  placeholder="전류/전압"
                />
              </div>
            </div>
          </div>

          {/* 압축기 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">압축기</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>기동방식</Label>
                  <Select
                    value={formData.operatingMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, operatingMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="기동방식을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="압축식">압축식</SelectItem>
                      <SelectItem value="스크롤식">스크롤식</SelectItem>
                      <SelectItem value="왕복동식">왕복동식</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>출력(KW)</Label>
                  <Input
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    placeholder="출력 (kW)"
                  />
                </div>

                <div>
                  <Label>윤활유(충전량) Level</Label>
                  <Select
                    value={formData.lubricantLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, lubricantLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="레벨을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="상">상</SelectItem>
                      <SelectItem value="중">중</SelectItem>
                      <SelectItem value="하">하</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* 증발기 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">증발기</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>냉수(브라인) 입·출구온도</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData.chilledWaterInletTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, chilledWaterInletTemp: e.target.value }))}
                        placeholder="입구온도"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[24px]">℃</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={formData.chilledWaterOutletTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, chilledWaterOutletTemp: e.target.value }))}
                        placeholder="출구온도"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[24px]">℃</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>냉수(브라인) 입·출구압력</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData.chilledWaterInletPressure}
                        onChange={(e) => setFormData(prev => ({ ...prev, chilledWaterInletPressure: e.target.value }))}
                        placeholder="입구압력"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[36px]">MPa</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={formData.chilledWaterOutletPressure}
                        onChange={(e) => setFormData(prev => ({ ...prev, chilledWaterOutletPressure: e.target.value }))}
                        placeholder="출구압력"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[36px]">MPa</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>냉수(브라인) 순환량</Label>
                  <div className="flex gap-2 max-w-md">
                    <Input
                      value={formData.chilledWaterFlowRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, chilledWaterFlowRate: e.target.value }))}
                      placeholder="순환량"
                    />
                    <span className="flex items-center text-sm text-gray-500 min-w-[48px]">m³/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 응축기 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">응축기</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>냉각수 입·출구온도</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData.coolingWaterInletTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, coolingWaterInletTemp: e.target.value }))}
                        placeholder="입구온도"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[24px]">℃</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={formData.coolingWaterOutletTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, coolingWaterOutletTemp: e.target.value }))}
                        placeholder="출구온도"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[24px]">℃</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>냉각수 입·출구압력</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex gap-2">
                      <Input
                        value={formData.coolingWaterInletPressure}
                        onChange={(e) => setFormData(prev => ({ ...prev, coolingWaterInletPressure: e.target.value }))}
                        placeholder="입구압력"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[36px]">MPa</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={formData.coolingWaterOutletPressure}
                        onChange={(e) => setFormData(prev => ({ ...prev, coolingWaterOutletPressure: e.target.value }))}
                        placeholder="출구압력"
                      />
                      <span className="flex items-center text-sm text-gray-500 min-w-[36px]">MPa</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>냉각수 순환량</Label>
                  <div className="flex gap-2 max-w-md">
                    <Input
                      value={formData.coolingWaterFlowRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, coolingWaterFlowRate: e.target.value }))}
                      placeholder="순환량"
                    />
                    <span className="flex items-center text-sm text-gray-500 min-w-[48px]">m³/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 냉매 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">냉매</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>종류</Label>
                <Input
                  value={formData.refrigerantType}
                  onChange={(e) => setFormData(prev => ({ ...prev, refrigerantType: e.target.value }))}
                  placeholder="냉매 종류"
                />
              </div>
            </div>
          </div>

          {/* 안전밸브 설정 압력 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">안전밸브 설정 압력</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>압력</Label>
                <div className="flex gap-2 max-w-md">
                  <Input
                    value={formData.safetyValvePressure}
                    onChange={(e) => setFormData(prev => ({ ...prev, safetyValvePressure: e.target.value }))}
                    placeholder="압력"
                  />
                  <span className="flex items-center text-sm text-gray-500 min-w-[36px]">MPa</span>
                </div>
              </div>
            </div>
          </div>

          {/* 소음 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">소음</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>소음</Label>
                <div className="flex gap-2 max-w-md">
                  <Input
                    value={formData.noise}
                    onChange={(e) => setFormData(prev => ({ ...prev, noise: e.target.value }))}
                    placeholder="소음"
                  />
                  <span className="flex items-center text-sm text-gray-500 min-w-[24px]">dB</span>
                </div>
              </div>
            </div>
          </div>

          {/* 보호장치 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">보호장치</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>보호장치</Label>
                <Input
                  value={formData.protectionDevice}
                  onChange={(e) => setFormData(prev => ({ ...prev, protectionDevice: e.target.value }))}
                  placeholder="보호장치"
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
