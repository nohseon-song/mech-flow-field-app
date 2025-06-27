
export interface OCRResult {
  extractedText: string;
  confidence: number;
  boundingBoxes?: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface TextLine {
  startY: number;
  endY: number;
  startX: number;
  endX: number;
}

export interface CharacterCandidate {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  width: number;
  height: number;
}
