
import type { ColorAnalysis, BrightnessAnalysis } from '@/types/imageAnalysis';

export interface ImageTypeAnalysis {
  isEquipment: boolean;
  imageType: 'equipment' | 'person' | 'document' | 'nature' | 'building' | 'unknown';
  confidence: number;
}

// 이미지 유형 감지
export const detectImageType = (colorAnalysis: ColorAnalysis, brightnessAnalysis: BrightnessAnalysis, fileName: string): ImageTypeAnalysis => {
  const { rust, metal, corrosion, paint } = colorAnalysis;
  const { brightness, contrast } = brightnessAnalysis;
  
  // 파일명 기반 사전 판단
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.includes('인물') || lowerFileName.includes('사람') || lowerFileName.includes('person')) {
    return {
      isEquipment: false,
      imageType: 'person',
      confidence: 0.9
    };
  }
  
  // 색상 패턴 기반 판단
  const totalMetallic = metal + rust + corrosion;
  const skinTonePattern = checkSkinTonePattern(colorAnalysis);
  const documentPattern = checkDocumentPattern(colorAnalysis, brightnessAnalysis);
  
  // 인물 사진 감지 (피부톤 + 높은 밝기)
  if (skinTonePattern && brightness > 200) {
    return {
      isEquipment: false,
      imageType: 'person',
      confidence: 0.85
    };
  }
  
  // 문서/텍스트 감지 (높은 밝기 + 낮은 대비)
  if (documentPattern) {
    return {
      isEquipment: false,
      imageType: 'document',
      confidence: 0.8
    };
  }
  
  // 설비 패턴 감지 (금속성 재질 + 적절한 대비)
  if (totalMetallic > 20 && contrast > 30) {
    return {
      isEquipment: true,
      imageType: 'equipment',
      confidence: 0.7
    };
  }
  
  // 기본값: 알 수 없음
  return {
    isEquipment: false,
    imageType: 'unknown',
    confidence: 0.3
  };
};

// 피부톤 패턴 감지
const checkSkinTonePattern = (colorAnalysis: ColorAnalysis): boolean => {
  // 피부톤은 일반적으로 페인트(밝은색) 범주에서 높은 비율을 보임
  return colorAnalysis.paint > 80 && colorAnalysis.metal < 30;
};

// 문서 패턴 감지
const checkDocumentPattern = (colorAnalysis: ColorAnalysis, brightnessAnalysis: BrightnessAnalysis): boolean => {
  // 문서는 높은 밝기와 높은 페인트(흰색/밝은색) 비율
  return colorAnalysis.paint > 70 && brightnessAnalysis.brightness > 220 && colorAnalysis.metal < 20;
};
