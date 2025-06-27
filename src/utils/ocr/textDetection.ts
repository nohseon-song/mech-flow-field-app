
import type { TextLine, CharacterCandidate } from './types';

// 텍스트 라인 감지
export const detectTextLines = (data: Uint8ClampedArray, width: number, height: number): TextLine[] => {
  const lines = [];
  
  // 수평 투영 히스토그램
  const horizontalProfile = new Array(height).fill(0);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx] === 0) { // 검은색 픽셀 (텍스트)
        horizontalProfile[y]++;
      }
    }
  }
  
  // 텍스트가 있는 라인 식별
  const minTextPixels = Math.max(2, width * 0.005); // 최소 텍스트 픽셀 수
  let inTextLine = false;
  let lineStart = 0;
  
  for (let y = 0; y < height; y++) {
    const hasText = horizontalProfile[y] >= minTextPixels;
    
    if (hasText && !inTextLine) {
      inTextLine = true;
      lineStart = y;
    } else if (!hasText && inTextLine) {
      inTextLine = false;
      if (y - lineStart > 5) { // 최소 라인 높이
        lines.push({
          startY: lineStart,
          endY: y - 1,
          startX: 0,
          endX: width - 1
        });
      }
    }
  }
  
  // 마지막 라인 처리
  if (inTextLine && height - lineStart > 5) {
    lines.push({
      startY: lineStart,
      endY: height - 1,
      startX: 0,
      endX: width - 1
    });
  }
  
  return lines;
};

// 문자 후보 감지
export const detectCharacterCandidates = (
  data: Uint8ClampedArray, 
  width: number, 
  height: number, 
  line: TextLine
): CharacterCandidate[] => {
  const lineHeight = line.endY - line.startY + 1;
  const lineWidth = line.endX - line.startX + 1;
  const charCandidates: CharacterCandidate[] = [];
  
  // 수직 투영을 통한 문자 영역 감지
  const verticalProfile = new Array(lineWidth).fill(0);
  
  for (let x = line.startX; x <= line.endX; x++) {
    for (let y = line.startY; y <= line.endY; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] === 0) {
        verticalProfile[x - line.startX]++;
      }
    }
  }
  
  // 문자 경계 감지
  const minCharPixels = Math.max(1, lineHeight * 0.3);
  let inChar = false;
  let charStart = 0;
  
  for (let x = 0; x < lineWidth; x++) {
    const hasChar = verticalProfile[x] >= minCharPixels;
    
    if (hasChar && !inChar) {
      inChar = true;
      charStart = x;
    } else if (!hasChar && inChar) {
      inChar = false;
      const charWidth = x - charStart;
      if (charWidth >= 3) { // 최소 문자 폭
        charCandidates.push({
          startX: line.startX + charStart,
          endX: line.startX + x - 1,
          startY: line.startY,
          endY: line.endY,
          width: charWidth,
          height: lineHeight
        });
      }
    }
  }
  
  // 마지막 문자 처리
  if (inChar) {
    const charWidth = lineWidth - charStart;
    if (charWidth >= 3) {
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
  
  return charCandidates;
};
