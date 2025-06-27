
// 고급 이미지 전처리
export const advancedImagePreprocessing = (imageData: ImageData): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  console.log('이미지 전처리 시작');
  
  // 1. Grayscale 변환 및 대비 향상
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    
    // 대비 향상 (1.5배)
    const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.5 + 128));
    
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }
  
  // 2. 적응형 임계값 처리
  const threshold = calculateOptimalThreshold(data, width, height);
  applyAdaptiveThreshold(data, width, height, threshold);
  
  // 3. 노이즈 제거 및 선명화
  const denoised = advancedNoiseReduction(data, width, height);
  
  console.log('이미지 전처리 완료');
  return new ImageData(denoised, width, height);
};

// 최적 임계값 계산 (Otsu's method 기반)
export const calculateOptimalThreshold = (data: Uint8ClampedArray, width: number, height: number): number => {
  const histogram = new Array(256).fill(0);
  const totalPixels = width * height;
  
  // 히스토그램 생성
  for (let i = 0; i < data.length; i += 4) {
    histogram[data[i]]++;
  }
  
  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }
  
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 0;
  
  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    
    wF = totalPixels - wB;
    if (wF === 0) break;
    
    sumB += t * histogram[t];
    
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    
    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = t;
    }
  }
  
  return threshold;
};

// 적응형 임계값 적용
export const applyAdaptiveThreshold = (data: Uint8ClampedArray, width: number, height: number, globalThreshold: number): void => {
  const windowSize = Math.max(15, Math.min(width, height) / 10);
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // 지역 임계값 계산
      let localSum = 0;
      let localCount = 0;
      
      for (let dy = -halfWindow; dy <= halfWindow; dy++) {
        for (let dx = -halfWindow; dx <= halfWindow; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const localIdx = (ny * width + nx) * 4;
            localSum += data[localIdx];
            localCount++;
          }
        }
      }
      
      const localThreshold = localSum / localCount;
      const finalThreshold = (localThreshold + globalThreshold) / 2;
      
      const value = data[idx] > finalThreshold ? 255 : 0;
      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
    }
  }
};

// 고급 노이즈 제거
export const advancedNoiseReduction = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(data);
  
  // 모폴로지 연산 (Opening)
  const temp = new Uint8ClampedArray(data);
  
  // Erosion
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      let minValue = 255;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
          minValue = Math.min(minValue, data[neighborIdx]);
        }
      }
      
      temp[idx] = minValue;
      temp[idx + 1] = minValue;
      temp[idx + 2] = minValue;
    }
  }
  
  // Dilation
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      let maxValue = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
          maxValue = Math.max(maxValue, temp[neighborIdx]);
        }
      }
      
      result[idx] = maxValue;
      result[idx + 1] = maxValue;
      result[idx + 2] = maxValue;
    }
  }
  
  return result;
};
