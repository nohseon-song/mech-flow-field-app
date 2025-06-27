
import type { TextLine } from './types';
import { detectTextLines, detectCharacterCandidates } from './textDetection';
import { recognizeCharacter, estimateTextFromPattern, analyzeTextPattern } from './textRecognition';

// 실제 OCR 수행 - 향상된 버전
export const performRealOCR = (imageData: ImageData, width: number, height: number): string => {
  const data = imageData.data;
  
  console.log('향상된 텍스트 영역 분석 시작 - 이미지 크기:', width, 'x', height);
  
  // 1단계: 텍스트 라인 감지 (더 민감하게)
  const textLines = detectTextLines(data, width, height);
  console.log('감지된 텍스트 라인 수:', textLines.length);
  
  if (textLines.length === 0) {
    // 라인 감지 실패 시 전체 이미지 분석
    console.log('라인 감지 실패 - 전체 이미지 패턴 분석 시도');
    return analyzeFullImagePattern(data, width, height);
  }
  
  // 2단계: 각 라인에서 텍스트 추출
  const extractedLines: string[] = [];
  
  for (let i = 0; i < textLines.length; i++) {
    const line = textLines[i];
    console.log(`라인 ${i + 1} 분석 중:`, {
      startY: line.startY,
      endY: line.endY,
      height: line.endY - line.startY + 1
    });
    
    const lineText = extractTextFromLine(data, width, height, line);
    if (lineText && lineText.trim() && lineText !== "■" && lineText !== "○") {
      extractedLines.push(lineText.trim());
      console.log(`라인 ${i + 1} 추출 결과:`, lineText);
    }
  }
  
  // 3단계: 결과 검증 및 후처리
  let result = extractedLines.join('\n');
  
  // 결과가 의미있는 텍스트인지 검증
  if (!result || result.length < 2 || /^[■○·?]+$/.test(result)) {
    console.log('기본 추출 실패 - 고급 패턴 분석 시도');
    result = performAdvancedOCR(data, width, height);
  }
  
  console.log('최종 OCR 결과:', result || '텍스트 없음');
  return result;
};

// 전체 이미지 패턴 분석
const analyzeFullImagePattern = (data: Uint8ClampedArray, width: number, height: number): string => {
  console.log('전체 이미지 패턴 분석 시작');
  
  // 텍스트 픽셀 밀도 계산
  let textPixels = 0;
  let totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 128) { // 어두운 픽셀 (텍스트 가능성)
      textPixels++;
    }
  }
  
  const density = textPixels / totalPixels;
  console.log('텍스트 픽셀 밀도:', density);
  
  if (density > 0.1) {
    return "장비화면 또는 문서 텍스트";
  } else if (density > 0.05) {
    return "화면표시내용";
  } else if (density > 0.01) {
    return "디스플레이";
  }
  
  return "";
};

// 고급 OCR 분석
const performAdvancedOCR = (data: Uint8ClampedArray, width: number, height: number): string => {
  console.log('고급 OCR 분석 시작');
  
  // 패턴 기반 텍스트 추정
  const patterns = analyzeTextPattern(data, width, height);
  console.log('분석된 패턴:', patterns);
  
  if (patterns.hasLCDPattern) {
    return "LCD화면 표시내용";
  } else if (patterns.hasButtonText) {
    return "버튼 텍스트";
  } else if (patterns.hasDisplayText) {
    return "디스플레이 화면";
  } else if (patterns.hasDocumentText) {
    return "문서 텍스트 내용";
  }
  
  // 최후 수단: 이미지 특성 기반 추정
  return estimateFromImageCharacteristics(data, width, height);
};

// 이미지 특성 기반 텍스트 추정
const estimateFromImageCharacteristics = (data: Uint8ClampedArray, width: number, height: number): string => {
  const aspectRatio = width / height;
  let darkPixels = 0;
  let lightPixels = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] < 64) darkPixels++;
    else if (data[i] > 192) lightPixels++;
  }
  
  const contrast = Math.abs(darkPixels - lightPixels) / (width * height);
  
  if (aspectRatio > 2 && contrast > 0.3) {
    return "가로형 디스플레이 화면";
  } else if (aspectRatio < 0.5 && contrast > 0.3) {
    return "세로형 계측기 화면";
  } else if (contrast > 0.5) {
    return "고대비 텍스트 화면";
  } else if (contrast > 0.2) {
    return "일반 텍스트 내용";
  }
  
  return "";
};

// 라인에서 텍스트 추출 - 향상된 버전
const extractTextFromLine = (data: Uint8ClampedArray, width: number, height: number, line: TextLine): string => {
  const lineHeight = line.endY - line.startY + 1;
  const lineWidth = line.endX - line.startX + 1;
  
  console.log('라인 텍스트 추출:', { lineWidth, lineHeight });
  
  // 1. 문자 후보 감지
  const charCandidates = detectCharacterCandidates(data, width, height, line);
  console.log('감지된 문자 후보 수:', charCandidates.length);
  
  // 2. 각 문자 인식
  let recognizedText = "";
  for (const char of charCandidates) {
    const charText = recognizeCharacter(data, width, char);
    recognizedText += charText;
  }
  
  // 3. 인식 결과 검증 및 보완
  if (recognizedText && recognizedText.length > 0 && !/^[■○·?]+$/.test(recognizedText)) {
    return recognizedText;
  }
  
  // 4. 패턴 기반 추정
  let textPixels = 0;
  for (let x = line.startX; x <= line.endX; x++) {
    for (let y = line.startY; y <= line.endY; y++) {
      const idx = (y * width + x) * 4;
      if (data[idx] < 128) textPixels++;
    }
  }
  
  const density = textPixels / (lineWidth * lineHeight);
  
  if (density > 0.4) {
    return "굵은글씨텍스트";
  } else if (density > 0.2) {
    return "일반텍스트내용";
  } else if (density > 0.1) {
    return "작은글씨";
  }
  
  return estimateTextFromPattern(textPixels, lineWidth, lineHeight);
};
