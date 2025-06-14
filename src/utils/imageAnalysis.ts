
import type { AnalysisResult } from '@/types/imageAnalysis';
import { loadImageToCanvas, imageToBase64 } from '@/utils/imageProcessing';
import { analyzeImageColors, analyzeImageBrightness } from '@/utils/colorAnalysis';
import { generateEquipmentDiagnosis, getDefaultAnalysis } from '@/utils/equipmentDiagnosis';

// Re-export imageToBase64 for backward compatibility
export { imageToBase64 } from '@/utils/imageProcessing';
export type { AnalysisResult } from '@/types/imageAnalysis';

// 실제 이미지 분석 수행
export const analyzeEquipmentImage = async (imageFile: File): Promise<AnalysisResult> => {
  try {
    console.log('실제 이미지 분석 시작:', imageFile.name);
    
    // 이미지를 Canvas에 로드하여 픽셀 데이터 분석
    const canvas = await loadImageToCanvas(imageFile);
    
    // 이미지 분석 실행
    const colorAnalysis = analyzeImageColors(canvas);
    const brightnessAnalysis = analyzeImageBrightness(canvas);
    
    console.log('색상 분석 결과:', colorAnalysis);
    console.log('밝기 분석 결과:', brightnessAnalysis);
    
    // 분석 결과를 기반으로 설비 진단
    const diagnosis = generateEquipmentDiagnosis(colorAnalysis, brightnessAnalysis, imageFile.name);
    
    return diagnosis;
    
  } catch (error) {
    console.error('이미지 분석 오류:', error);
    return getDefaultAnalysis(imageFile.name);
  }
};
