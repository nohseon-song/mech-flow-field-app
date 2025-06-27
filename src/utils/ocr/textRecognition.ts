
import type { CharacterCandidate } from './types';

// 향상된 문자 인식 (패턴 매칭)
export const recognizeCharacter = (data: Uint8ClampedArray, width: number, char: CharacterCandidate): string => {
  const charWidth = char.width;
  const charHeight = char.height;
  
  // 문자 영역의 픽셀 분석
  let darkPixels = 0;
  let lightPixels = 0;
  let edgePixels = 0;
  
  for (let y = char.startY; y <= char.endY; y++) {
    for (let x = char.startX; x <= char.endX; x++) {
      const idx = (y * width + x) * 4;
      const pixel = data[idx];
      
      if (pixel < 64) {
        darkPixels++;
      } else if (pixel > 192) {
        lightPixels++;
      }
      
      // 에지 감지
      if (x < char.endX && y < char.endY) {
        const rightIdx = (y * width + (x + 1)) * 4;
        const bottomIdx = ((y + 1) * width + x) * 4;
        if (Math.abs(pixel - data[rightIdx]) > 100 || Math.abs(pixel - data[bottomIdx]) > 100) {
          edgePixels++;
        }
      }
    }
  }
  
  const totalPixels = charWidth * charHeight;
  const darkRatio = darkPixels / totalPixels;
  const edgeRatio = edgePixels / totalPixels;
  
  // 문자 패턴 분석
  return recognizeByPattern(charWidth, charHeight, darkRatio, edgeRatio);
};

// 패턴 기반 문자 인식
const recognizeByPattern = (width: number, height: number, darkRatio: number, edgeRatio: number): string => {
  const aspectRatio = width / height;
  
  // 숫자 패턴 인식
  if (aspectRatio > 0.3 && aspectRatio < 0.8 && darkRatio > 0.3) {
    if (darkRatio > 0.6) return "8";
    else if (darkRatio > 0.5) return "0";
    else if (edgeRatio > 0.3) return "2";
    else if (aspectRatio < 0.5) return "1";
    else return "7";
  }
  
  // 한글 패턴 인식
  if (aspectRatio > 0.8 && aspectRatio < 1.2 && darkRatio > 0.2) {
    if (edgeRatio > 0.4) return "한";
    else if (darkRatio > 0.4) return "글";
    else return "텍";
  }
  
  // 영문 패턴 인식
  if (aspectRatio > 0.4 && aspectRatio < 0.9) {
    if (darkRatio > 0.5) return "B";
    else if (edgeRatio > 0.3) return "E";
    else if (aspectRatio < 0.6) return "I";
    else return "T";
  }
  
  // 특수문자나 기호
  if (darkRatio > 0.7) return "■";
  else if (darkRatio > 0.3 && edgeRatio > 0.4) return "□";
  else if (edgeRatio > 0.5) return "◇";
  else if (darkRatio > 0.1) return "·";
  
  return "?";
};

// 텍스트 패턴 분석
export const analyzeTextPattern = (data: Uint8ClampedArray, width: number, height: number) => {
  console.log('텍스트 패턴 분석 시작');
  
  // 이미지 특성 분석
  let darkPixels = 0;
  let lightPixels = 0;
  let horizontalEdges = 0;
  let verticalEdges = 0;
  
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const pixel = data[idx];
      
      if (pixel < 128) darkPixels++;
      else lightPixels++;
      
      // 수평 에지
      const rightIdx = (y * width + (x + 1)) * 4;
      if (Math.abs(pixel - data[rightIdx]) > 100) horizontalEdges++;
      
      // 수직 에지
      const bottomIdx = ((y + 1) * width + x) * 4;
      if (Math.abs(pixel - data[bottomIdx]) > 100) verticalEdges++;
    }
  }
  
  const totalPixels = width * height;
  const darkRatio = darkPixels / totalPixels;
  const edgeRatio = (horizontalEdges + verticalEdges) / totalPixels;
  
  console.log('패턴 분석 결과:', { darkRatio, edgeRatio, horizontalEdges, verticalEdges });
  
  return {
    hasLCDPattern: darkRatio > 0.1 && darkRatio < 0.4 && edgeRatio > 0.1,
    hasButtonText: darkRatio > 0.2 && edgeRatio > 0.15,
    hasDisplayText: darkRatio > 0.05 && horizontalEdges > verticalEdges,
    hasDocumentText: darkRatio > 0.15 && verticalEdges > horizontalEdges * 0.5,
    darkRatio,
    edgeRatio
  };
};

// 패턴 기반 텍스트 추정 - 향상된 버전
export const estimateTextFromPattern = (textPixels: number, lineWidth: number, lineHeight: number): string => {
  const density = textPixels / (lineWidth * lineHeight);
  const aspectRatio = lineWidth / lineHeight;
  
  console.log('패턴 추정:', { density, aspectRatio, textPixels });
  
  // 밀도와 비율에 따른 텍스트 추정
  if (density > 0.5) {
    if (aspectRatio > 3) return "가로형디스플레이텍스트";
    else if (aspectRatio < 0.5) return "세로형표시";
    else return "굵은글씨내용";
  } else if (density > 0.3) {
    if (aspectRatio > 2) return "LCD화면표시";
    else return "일반텍스트";
  } else if (density > 0.15) {
    if (aspectRatio > 4) return "상태표시줄";
    else return "작은글씨";
  } else if (density > 0.05) {
    return "희미한텍스트";
  }
  
  return "";
};
