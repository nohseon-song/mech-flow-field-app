
// 텍스트 신뢰도 계산
export const calculateTextConfidence = (extractedText: string, imageData: ImageData): number => {
  if (!extractedText || extractedText === "이 이미지에는 추출 가능한 텍스트가 없습니다.") {
    return 0.1;
  }
  
  const textLength = extractedText.length;
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // 이미지 품질 평가
  let edgeCount = 0;
  let textPixels = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === 0) textPixels++; // 검은색 픽셀 (텍스트)
    
    // 에지 감지
    if (i < data.length - 4) {
      const diff = Math.abs(data[i] - data[i + 4]);
      if (diff > 100) edgeCount++;
    }
  }
  
  const textDensity = textPixels / (width * height);
  const edgeDensity = edgeCount / (width * height);
  
  // 신뢰도 계산
  let confidence = 0.3; // 기본 신뢰도
  
  // 텍스트 길이 점수
  confidence += Math.min(0.3, textLength / 50);
  
  // 텍스트 밀도 점수
  confidence += Math.min(0.2, textDensity * 100);
  
  // 이미지 선명도 점수
  confidence += Math.min(0.2, edgeDensity * 1000);
  
  return Math.min(0.95, confidence);
};
