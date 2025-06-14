
export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'measurement';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  unit?: string;
  category?: string;
}

export interface EquipmentForm {
  id: string;
  name: string;
  fields: FormField[];
}

export const EQUIPMENT_TYPES = [
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
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];
