
import type { ColorAnalysis, BrightnessAnalysis } from '@/types/imageAnalysis';

// 이미지 색상 분석을 통한 설비 상태 추정
export const analyzeImageColors = (canvas: HTMLCanvasElement): ColorAnalysis => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let rustPixels = 0;
  let metalPixels = 0;
  let corrosionPixels = 0;
  let paintPixels = 0;
  let totalPixels = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    totalPixels++;
    
    // 녹 색상 감지 (갈색, 주황색 계열)
    if (r > 100 && r > g && r > b && g < 100) {
      rustPixels++;
    }
    // 금속 색상 감지 (회색, 은색 계열)
    else if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30 && r > 100) {
      metalPixels++;
    }
    // 부식 색상 감지 (어두운 갈색, 검은색 계열)
    else if (r < 80 && g < 60 && b < 50 && r > g && r > b) {
      corrosionPixels++;
    }
    // 페인트 색상 감지 (밝은 색상)
    else if (r > 150 || g > 150 || b > 150) {
      paintPixels++;
    }
  }
  
  return {
    rust: (rustPixels / totalPixels) * 100,
    metal: (metalPixels / totalPixels) * 100,
    corrosion: (corrosionPixels / totalPixels) * 100,
    paint: (paintPixels / totalPixels) * 100
  };
};

// 이미지 밝기 및 대비 분석
export const analyzeImageBrightness = (canvas: HTMLCanvasElement): BrightnessAnalysis => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  let totalBrightness = 0;
  let brightnessValues: number[] = [];
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    totalBrightness += brightness;
    brightnessValues.push(brightness);
  }
  
  const avgBrightness = totalBrightness / (data.length / 4);
  
  // 대비 계산 (표준편차)
  const variance = brightnessValues.reduce((sum, brightness) => {
    return sum + Math.pow(brightness - avgBrightness, 2);
  }, 0) / brightnessValues.length;
  
  const contrast = Math.sqrt(variance);
  
  return {
    brightness: avgBrightness,
    contrast: contrast
  };
};
