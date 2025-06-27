
import type { TextLine, CharacterCandidate } from './types';

// 향상된 텍스트 라인 감지
export const detectTextLines = (data: Uint8ClampedArray, width: number, height: number): TextLine[] => {
  const lines = [];
  
  console.log('텍스트 라인 감지 시작 - 더 민감한 알고리즘 사용');
  
  // 수평 투영 히스토그램 (더 민감하게)
  const horizontalProfile = new Array(height).fill(0);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // 더 넓은 범위의 픽셀을 텍스트로 인식
      if (data[idx] < 160) { // 임계값을 높여서 더 많은 픽셀 포함
        horizontalProfile[y]++;
      }
    }
  }
  
  // 동적 임계값 계산
  const avgPixelsPerLine = horizontalProfile.reduce((a, b) => a + b, 0) / height;
  const minTextPixels = Math.max(1, Math.min(width * 0.01, avgPixelsPerLine * 0.1)); // 더 낮은 임계값
  
  console.log('동적 임계값:', minTextPixels, '평균 픽셀/라인:', avgPixelsPerLine);
  
  // 텍스트 라인 식별 (연속성 고려)
  let inTextLine = false;
  let lineStart = 0;
  let consecutiveEmptyLines = 0;
  
  for (let y = 0; y < height; y++) {
    const hasText = horizontalProfile[y] >= minTextPixels;
    
    if (hasText) {
      if (!inTextLine) {
        inTextLine = true;
        lineStart = y;
      }
      consecutiveEmptyLines = 0;
    } else {
      consecutiveEmptyLines++;
      
      // 연속된 빈 라인이 3줄 이상이면 라인 종료
      if (inTextLine && consecutiveEmptyLines >= 3) {
        inTextLine = false;
        const lineEnd = y - consecutiveEmptyLines;
        if (lineEnd - lineStart >= 2) { // 최소 라인 높이 완화
          lines.push({
            startY: lineStart,
            endY: lineEnd,
            startX: findLineStartX(data, width, lineStart, lineEnd),
            endX: findLineEndX(data, width, lineStart, lineEnd)
          });
        }
      }
    }
  }
  
  // 마지막 라인 처리
  if (inTextLine && height - lineStart >= 2) {
    lines.push({
      startY: lineStart,
      endY: height - 1,
      startX: findLineStartX(data, width, lineStart, height - 1),
      endX: findLineEndX(data, width, lineStart, height - 1)
    });
  }
  
  console.log('감지된 라인 상세:', lines.map((line, i) => ({
    index: i,
    height: line.endY - line.startY + 1,
    width: line.endX - line.startX + 1
  })));
  
  return lines;
};

// 라인의 시작 X 좌표 찾기
const findLineStartX = (data: Uint8ClampedArray, width: number, startY: number, endY: number): number => {
  for (let x = 0; x < width; x++) {
    for (let y = startY; y <= endY; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 160) {
        return Math.max(0, x - 2); // 여백 포함
      }
    }
  }
  return 0;
};

// 라인의 끝 X 좌표 찾기
const findLineEndX = (data: Uint8ClampedArray, width: number, startY: number, endY: number): number => {
  for (let x = width - 1; x >= 0; x--) {
    for (let y = startY; y <= endY; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 160) {
        return Math.min(width - 1, x + 2); // 여백 포함
      }
    }
  }
  return width - 1;
};

// 향상된 문자 후보 감지
export const detectCharacterCandidates = (
  data: Uint8ClampedArray, 
  width: number, 
  height: number, 
  line: TextLine
): CharacterCandidate[] => {
  const lineHeight = line.endY - line.startY + 1;
  const lineWidth = line.endX - line.startX + 1;
  const charCandidates: CharacterCandidate[] = [];
  
  console.log('문자 후보 감지:', { lineWidth, lineHeight });
  
  // 수직 투영을 통한 문자 영역 감지 (더 민감하게)
  const verticalProfile = new Array(lineWidth).fill(0);
  
  for (let x = line.startX; x <= line.endX; x++) {
    for (let y = line.startY; y <= line.endY; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 160) { // 더 높은 임계값
        verticalProfile[x - line.startX]++;
      }
    }
  }
  
  // 동적 최소 문자 픽셀 수
  const avgPixelsPerColumn = verticalProfile.reduce((a, b) => a + b, 0) / lineWidth;
  const minCharPixels = Math.max(1, Math.min(lineHeight * 0.2, avgPixelsPerColumn * 0.1));
  
  console.log('문자 감지 임계값:', minCharPixels);
  
  // 문자 경계 감지 (연속성 고려)
  let inChar = false;
  let charStart = 0;
  let consecutiveEmptyColumns = 0;
  
  for (let x = 0; x < lineWidth; x++) {
    const hasChar = verticalProfile[x] >= minCharPixels;
    
    if (hasChar) {
      if (!inChar) {
        inChar = true;
        charStart = x;
      }
      consecutiveEmptyColumns = 0;
    } else {
      consecutiveEmptyColumns++;
      
      // 연속된 빈 컬럼이 2개 이상이면 문자 종료
      if (inChar && consecutiveEmptyColumns >= 2) {
        inChar = false;
        const charEnd = x - consecutiveEmptyColumns;
        const charWidth = charEnd - charStart;
        
        if (charWidth >= 2) { // 최소 문자 폭 완화
          charCandidates.push({
            startX: line.startX + charStart,
            endX: line.startX + charEnd - 1,
            startY: line.startY,
            endY: line.endY,
            width: charWidth,
            height: lineHeight
          });
        }
      }
    }
  }
  
  // 마지막 문자 처리
  if (inChar) {
    const charWidth = lineWidth - charStart;
    if (charWidth >= 2) {
      charCandidates.push({
        startX: line.startX + charStart,
        endX: line.endX,
        startY: line.startY,
        endY: line.endY,
        width: charWidth,
        height: lineHeight
      });
    }
  }
  
  console.log('감지된 문자 후보:', charCandidates.length, '개');
  
  return charCandidates;
};
