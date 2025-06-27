
import type { TextLine } from './types';
import { detectTextLines, detectCharacterCandidates } from './textDetection';
import { recognizeCharacter, estimateTextFromPattern } from './textRecognition';

// 실제 OCR 수행
export const performRealOCR = (imageData: ImageData, width: number, height: number): string => {
  const data = imageData.data;
  
  console.log('텍스트 영역 분석 시작');
  
  // 텍스트 라인 감지
  const textLines = detectTextLines(data, width, height);
  console.log('감지된 텍스트 라인 수:', textLines.length);
  
  if (textLines.length === 0) {
    return "";
  }
  
  // 각 라인에서 텍스트 추출
  const extractedLines: string[] = [];
  
  for (const line of textLines) {
    const lineText = extractTextFromLine(data, width, height, line);
    if (lineText && lineText.trim()) {
      extractedLines.push(lineText.trim());
      console.log('추출된 라인:', lineText);
    }
  }
  
  const result = extractedLines.join('\n');
  console.log('최종 추출 결과:', result);
  
  return result;
};

// 라인에서 텍스트 추출
const extractTextFromLine = (data: Uint8ClampedArray, width: number, height: number, line: TextLine): string => {
  // 문자 패턴 분석을 통한 텍스트 추정
  const lineHeight = line.endY - line.startY + 1;
  const lineWidth = line.endX - line.startX + 1;
  
  // 라인 내 텍스트 픽셀 분석
  let textPixels = 0;
  const charCandidates = detectCharacterCandidates(data, width, height, line);
  
  for (let x = line.startX; x <= line.endX; x++) {
    for (let y = line.startY; y <= line.endY; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] === 0) {
        textPixels++;
      }
    }
  }
  
  // 문자 인식
  let recognizedText = "";
  for (const char of charCandidates) {
    const charText = recognizeCharacter(data, width, char);
    recognizedText += charText;
  }
  
  // 텍스트가 없으면 기본 패턴 기반 추정
  if (!recognizedText && textPixels > 0) {
    recognizedText = estimateTextFromPattern(textPixels, lineWidth, lineHeight);
  }
  
  return recognizedText;
};
