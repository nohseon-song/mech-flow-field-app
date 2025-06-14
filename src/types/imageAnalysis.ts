
// Type definitions for image analysis results
export interface AnalysisResult {
  causes: string[];
  symptoms: string[];
  improvements: string[];
}

export interface ColorAnalysis {
  rust: number;
  metal: number;
  corrosion: number;
  paint: number;
}

export interface BrightnessAnalysis {
  brightness: number;
  contrast: number;
}
