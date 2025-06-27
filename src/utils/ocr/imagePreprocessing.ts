
// 장비 화면 및 문서 최적화 이미지 전처리
export const advancedImagePreprocessing = (imageData: ImageData): ImageData => {
  const data = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  console.log('장비 화면 최적화 전처리 시작 - 크기:', width, 'x', height);
  
  // 1. Grayscale 변환 및 대비 향상 (더 강하게)
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    
    // 더 강한 대비 향상 (2.0배)
    const enhanced = Math.min(255, Math.max(0, (gray - 128) * 2.0 + 128));
    
    data[i] = enhanced;
    data[i + 1] = enhanced;
    data[i + 2] = enhanced;
  }
  
  // 2. LCD/LED 화면 반사 제거
  const deglared = removeLCDGlare(data, width, height);
  
  // 3. 적응형 임계값 처리 (더 민감하게)
  const threshold = calculateOptimalThreshold(deglared, width, height);
  console.log('계산된 최적 임계값:', threshold);
  applyAdaptiveThreshold(deglared, width, height, threshold - 20); // 더 낮은 임계값
  
  // 4. 고급 노이즈 제거 및 선명화
  const denoised = advancedNoiseReduction(deglared, width, height);
  const sharpened = applySharpeningFilter(denoised, width, height);
  
  console.log('장비 화면 최적화 전처리 완료');
  return new ImageData(sharpened, width, height);
};

// LCD/LED 화면 반사 제거
const removeLCDGlare = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(data);
  
  // 지역적 밝기 정규화
  const windowSize = Math.min(width, height) / 8;
  const halfWindow = Math.floor(windowSize / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // 지역 평균 계산
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
      
      const localAvg = localSum / localCount;
      const pixel = data[idx];
      
      // 반사 제거: 지역 평균보다 과도하게 밝은 픽셀 보정
      if (pixel > localAvg + 50) {
        const corrected = Math.min(255, localAvg + (pixel - localAvg) * 0.3);
        result[idx] = corrected;
        result[idx + 1] = corrected;
        result[idx + 2] = corrected;
      }
    }
  }
  
  return result;
};

// 최적 임계값 계산 (Otsu's method 개선)
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
  let threshold = 128; // 기본값
  
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
  
  console.log('Otsu 임계값:', threshold);
  return threshold;
};

// 적응형 임계값 적용 (더 세밀하게)
export const applyAdaptiveThreshold = (data: Uint8ClampedArray, width: number, height: number, globalThreshold: number): void => {
  const windowSize = Math.max(9, Math.min(width, height) / 15); // 더 작은 윈도우
  const halfWindow = Math.floor(windowSize / 2);
  
  console.log('적응형 임계값 윈도우 크기:', windowSize);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // 지역 임계값 계산
      let localSum = 0;
      let localCount = 0;
      let localMax = 0;
      let localMin = 255;
      
      for (let dy = -halfWindow; dy <= halfWindow; dy++) {
        for (let dx = -halfWindow; dx <= halfWindow; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const localIdx = (ny * width + nx) * 4;
            const pixel = data[localIdx];
            localSum += pixel;
            localCount++;
            localMax = Math.max(localMax, pixel);
            localMin = Math.min(localMin, pixel);
          }
        }
      }
      
      const localAvg = localSum / localCount;
      const localRange = localMax - localMin;
      
      // 동적 임계값 계산
      let threshold = localAvg;
      if (localRange > 50) {
        threshold = (localAvg + globalThreshold) / 2;
      } else {
        threshold = localAvg - 10; // 저대비 영역에서 더 민감하게
      }
      
      const value = data[idx] > threshold ? 255 : 0;
      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
    }
  }
};

// 고급 노이즈 제거 (모폴로지 연산 개선)
export const advancedNoiseReduction = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
  console.log('고급 노이즈 제거 시작');
  
  // 1단계: 작은 노이즈 제거 (Opening)
  let temp = new Uint8ClampedArray(data);
  
  // Erosion (3x3 커널)
  const eroded = new Uint8ClampedArray(data);
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
      
      eroded[idx] = minValue;
      eroded[idx + 1] = minValue;
      eroded[idx + 2] = minValue;
    }
  }
  
  // Dilation (3x3 커널)
  const result = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      let maxValue = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const neighborIdx = ((y + dy) * width + (x + dx)) * 4;
          maxValue = Math.max(maxValue, eroded[neighborIdx]);
        }
      }
      
      result[idx] = maxValue;
      result[idx + 1] = maxValue;
      result[idx + 2] = maxValue;
    }
  }
  
  return result;
};

// 선명화 필터 적용
const applySharpeningFilter = (data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(data);
  
  // 언샤프 마스킹 필터
  const kernel = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      let sum = 0;
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const neighborIdx = ((y + ky - 1) * width + (x + kx - 1)) * 4;
          sum += data[neighborIdx] * kernel[ky][kx];
        }
      }
      
      const sharpened = Math.min(255, Math.max(0, sum));
      result[idx] = sharpened;
      result[idx + 1] = sharpened;
      result[idx + 2] = sharpened;
    }
  }
  
  return result;
};
