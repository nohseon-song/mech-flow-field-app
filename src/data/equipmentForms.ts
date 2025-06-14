
import { EquipmentForm } from '@/types/equipment';

export const defaultEquipmentForms: EquipmentForm[] = [
  {
    id: 'chiller-general',
    name: '냉동기(일반)',
    fields: [
      { id: 'name', name: 'name', label: '설비명', type: 'text', required: true, placeholder: '예: 냉동기 #1' },
      { id: 'location', name: 'location', label: '설치위치', type: 'text', required: true, placeholder: '예: 지하 1층 기계실' },
      { id: 'inspectionDate', name: 'inspectionDate', label: '점검일자', type: 'date' },
      { id: 'manufacturer', name: 'manufacturer', label: '제조회사', type: 'text', placeholder: '제조회사' },
      { id: 'modelNumber', name: 'modelNumber', label: '모델번호', type: 'text', placeholder: '모델번호' },
      { id: 'coolingCapacity', name: 'coolingCapacity', label: '냉동능력', type: 'text', placeholder: '냉동능력', unit: 'kW/usRT' },
      { id: 'currentVoltage', name: 'currentVoltage', label: '전류/전압', type: 'text', placeholder: '전류/전압', unit: 'A/V' },
      { id: 'operatingMethod', name: 'operatingMethod', label: '기동방식', type: 'select', options: ['압축식', '스크롤식', '왕복동식', '기타'], category: '압축기' },
      { id: 'capacity', name: 'capacity', label: '출력', type: 'text', placeholder: '출력', unit: 'kW', category: '압축기' },
      { id: 'lubricantLevel', name: 'lubricantLevel', label: '윤활유(충전량) Level', type: 'select', options: ['상', '중', '하'], category: '압축기' },
      { id: 'chilledWaterInletTemp', name: 'chilledWaterInletTemp', label: '냉수(브라인) 입구온도', type: 'measurement', unit: '℃', category: '증발기' },
      { id: 'chilledWaterOutletTemp', name: 'chilledWaterOutletTemp', label: '냉수(브라인) 출구온도', type: 'measurement', unit: '℃', category: '증발기' },
      { id: 'chilledWaterInletPressure', name: 'chilledWaterInletPressure', label: '냉수(브라인) 입구압력', type: 'measurement', unit: 'MPa', category: '증발기' },
      { id: 'chilledWaterOutletPressure', name: 'chilledWaterOutletPressure', label: '냉수(브라인) 출구압력', type: 'measurement', unit: 'MPa', category: '증발기' },
      { id: 'chilledWaterFlowRate', name: 'chilledWaterFlowRate', label: '냉수(브라인) 순환량', type: 'measurement', unit: 'm³/h', category: '증발기' },
      { id: 'coolingWaterInletTemp', name: 'coolingWaterInletTemp', label: '냉각수 입구온도', type: 'measurement', unit: '℃', category: '응축기' },
      { id: 'coolingWaterOutletTemp', name: 'coolingWaterOutletTemp', label: '냉각수 출구온도', type: 'measurement', unit: '℃', category: '응축기' },
      { id: 'coolingWaterInletPressure', name: 'coolingWaterInletPressure', label: '냉각수 입구압력', type: 'measurement', unit: 'MPa', category: '응축기' },
      { id: 'coolingWaterOutletPressure', name: 'coolingWaterOutletPressure', label: '냉각수 출구압력', type: 'measurement', unit: 'MPa', category: '응축기' },
      { id: 'coolingWaterFlowRate', name: 'coolingWaterFlowRate', label: '냉각수 순환량', type: 'measurement', unit: 'm³/h', category: '응축기' },
      { id: 'refrigerantType', name: 'refrigerantType', label: '냉매 종류', type: 'text', placeholder: '냉매 종류', category: '냉매' },
      { id: 'safetyValvePressure', name: 'safetyValvePressure', label: '안전밸브 설정 압력', type: 'measurement', unit: 'MPa', category: '안전밸브 설정 압력' },
      { id: 'noise', name: 'noise', label: '소음', type: 'measurement', unit: 'dB', category: '소음' },
      { id: 'protectionDevice', name: 'protectionDevice', label: '보호장치', type: 'text', placeholder: '보호장치', category: '보호장치' }
    ]
  },
  {
    id: 'chiller-absorption',
    name: '냉동기(흡수식)',
    fields: [
      { id: 'name', name: 'name', label: '설비명', type: 'text', required: true, placeholder: '예: 흡수식냉동기 #1' },
      { id: 'location', name: 'location', label: '설치위치', type: 'text', required: true, placeholder: '예: 지하 1층 기계실' },
      { id: 'inspectionDate', name: 'inspectionDate', label: '점검일자', type: 'date' },
      { id: 'manufacturer', name: 'manufacturer', label: '제조회사', type: 'text', placeholder: '제조회사' },
      { id: 'modelNumber', name: 'modelNumber', label: '모델번호', type: 'text', placeholder: '모델번호' },
      { id: 'coolingCapacity', name: 'coolingCapacity', label: '냉동능력', type: 'text', placeholder: '냉동능력', unit: 'kW/usRT' },
      { id: 'heatSource', name: 'heatSource', label: '열원', type: 'select', options: ['증기', '온수', '직화'], category: '흡수기' },
      { id: 'absorberTemp', name: 'absorberTemp', label: '흡수기 온도', type: 'measurement', unit: '℃', category: '흡수기' },
      { id: 'generatorTemp', name: 'generatorTemp', label: '재생기 온도', type: 'measurement', unit: '℃', category: '재생기' }
    ]
  },
  {
    id: 'boiler',
    name: '보일러',
    fields: [
      { id: 'name', name: 'name', label: '설비명', type: 'text', required: true, placeholder: '예: 보일러 #1' },
      { id: 'location', name: 'location', label: '설치위치', type: 'text', required: true, placeholder: '예: 지하 1층 기계실' },
      { id: 'inspectionDate', name: 'inspectionDate', label: '점검일자', type: 'date' },
      { id: 'manufacturer', name: 'manufacturer', label: '제조회사', type: 'text', placeholder: '제조회사' },
      { id: 'modelNumber', name: 'modelNumber', label: '모델번호', type: 'text', placeholder: '모델번호' },
      { id: 'capacity', name: 'capacity', label: '용량', type: 'text', placeholder: '용량', unit: 'kW' },
      { id: 'fuelType', name: 'fuelType', label: '연료종류', type: 'select', options: ['가스', '경유', '중유', '전기'], category: '연소기' },
      { id: 'steamPressure', name: 'steamPressure', label: '증기압력', type: 'measurement', unit: 'MPa', category: '증기' },
      { id: 'waterLevel', name: 'waterLevel', label: '수위', type: 'select', options: ['정상', '주의', '위험'], category: '급수' }
    ]
  }
];

// 나머지 설비 타입들을 위한 기본 양식
export const getDefaultFormForEquipmentType = (equipmentType: string): EquipmentForm => {
  const existingForm = defaultEquipmentForms.find(form => form.name === equipmentType);
  if (existingForm) return existingForm;

  // 기본 양식 반환
  return {
    id: equipmentType.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: equipmentType,
    fields: [
      { id: 'name', name: 'name', label: '설비명', type: 'text', required: true, placeholder: `예: ${equipmentType} #1` },
      { id: 'location', name: 'location', label: '설치위치', type: 'text', required: true, placeholder: '예: 지하 1층 기계실' },
      { id: 'inspectionDate', name: 'inspectionDate', label: '점검일자', type: 'date' },
      { id: 'manufacturer', name: 'manufacturer', label: '제조회사', type: 'text', placeholder: '제조회사' },
      { id: 'modelNumber', name: 'modelNumber', label: '모델번호', type: 'text', placeholder: '모델번호' }
    ]
  };
};
