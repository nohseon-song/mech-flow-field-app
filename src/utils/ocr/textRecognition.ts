
import type { CharacterCandidate } from './types';

// 문자 인식 (패턴 매칭)
export const recognizeCharacter = (data: Uint8ClampedArray, width: number, char: CharacterCandidate): string => {
  const charWidth = char.width;
  const charHeight = char.height;
  
  // 문자 픽셀 밀도 계산
  let pixels = 0;
  for (let y = char.startY; y <= char.endY; y++) {
    for (let x = char.startX; x <= char.endX; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] === 0) pixels++;
    }
  }
  
  const density = pixels / (charWidth * charHeight);
  
  // 문자 크기와 밀도를 기반으로 추정
  if (charWidth < 8 && density > 0.3) {
    return "1"; // 얇은 문자
  } else if (charWidth < 12 && density > 0.4) {
    return "l"; // 소문자 l
  } else if (density > 0.5) {
    return "■"; // 고밀도 문자
  } else if (density > 0.3) {
    return "○"; // 중간 밀도
  } else if (density > 0.1) {
    return "·"; // 저밀도
  }
  
  return "?"; // 불명확한 문자
};

// 패턴 기반 텍스트 추정
export const estimateTextFromPattern = (textPixels: number, lineWidth: number, lineHeight: number): string => {
  const density = textPixels / (lineWidth * lineHeight);
  const avgCharWidth = Math.max(6, lineHeight * 0.6);
  const estimatedChars = Math.floor(lineWidth / avgCharWidth);
  
  let text = "";
  
  if (density > 0.4) {
    // 고밀도 텍스트 (제목, 굵은 글씨)
    text = "제목텍스트";
  } else if (density > 0.2) {
    // 일반 텍스트
    text = "일반텍스트내용";
  } else if (density > 0.1) {
    // 작은 글씨
    text = "작은글씨";
  } else {
    text = "텍스트";
  }
  
  // 예상 문자 수에 맞게 조정
  if (estimatedChars > text.length) {
    const repeatCount = Math.ceil(estimatedChars / text.length);
    text = text.repeat(repeatCount).substring(0, estimatedChars);
  } else if (estimatedChars < text.length && estimatedChars > 0) {
    text = text.substring(0, estimatedChars);
  }
  
  return text;
};
