// 이미지를 base64로 변환하는 함수
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Type definitions for image analysis results
export interface AnalysisResult {
  causes: string[];
  symptoms: string[];
  improvements: string[];
}

interface ColorAnalysis {
  rust: number;
  metal: number;
  corrosion: number;
  paint: number;
}

interface BrightnessAnalysis {
  brightness: number;
  contrast: number;
}

// 이미지 색상 분석을 통한 설비 상태 추정
const analyzeImageColors = (canvas: HTMLCanvasElement): ColorAnalysis => {
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
const analyzeImageBrightness = (canvas: HTMLCanvasElement): BrightnessAnalysis => {
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

// 실제 이미지 분석 수행
export const analyzeEquipmentImage = async (imageFile: File): Promise<AnalysisResult> => {
  try {
    console.log('실제 이미지 분석 시작:', imageFile.name);
    
    // 이미지를 Canvas에 로드하여 픽셀 데이터 분석
    const imageUrl = URL.createObjectURL(imageFile);
    const img = new Image();
    
    return new Promise<AnalysisResult>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // 이미지 크기 조정 (분석 성능 향상)
        const maxSize = 400;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // 이미지 분석 실행
        const colorAnalysis = analyzeImageColors(canvas);
        const brightnessAnalysis = analyzeImageBrightness(canvas);
        
        console.log('색상 분석 결과:', colorAnalysis);
        console.log('밝기 분석 결과:', brightnessAnalysis);
        
        // 분석 결과를 기반으로 설비 진단
        const diagnosis = generateEquipmentDiagnosis(colorAnalysis, brightnessAnalysis, imageFile.name);
        
        URL.revokeObjectURL(imageUrl);
        resolve(diagnosis);
      };
      
      img.onerror = () => {
        console.error('이미지 로드 실패');
        URL.revokeObjectURL(imageUrl);
        resolve(getDefaultAnalysis(imageFile.name));
      };
      
      img.src = imageUrl;
    });
    
  } catch (error) {
    console.error('이미지 분석 오류:', error);
    return getDefaultAnalysis(imageFile.name);
  }
};

// 분석 결과를 기반으로 설비 진단 생성
const generateEquipmentDiagnosis = (colorAnalysis: ColorAnalysis, brightnessAnalysis: BrightnessAnalysis, fileName: string): AnalysisResult => {
  const { rust, metal, corrosion, paint } = colorAnalysis;
  const { brightness, contrast } = brightnessAnalysis;
  
  console.log(`진단 생성: 녹 ${rust.toFixed(1)}%, 금속 ${metal.toFixed(1)}%, 부식 ${corrosion.toFixed(1)}%, 페인트 ${paint.toFixed(1)}%`);
  
  // 상태 평가
  const hasRustIssue = rust > 5;
  const hasCorrosionIssue = corrosion > 3;
  const hasPaintIssue = paint < 20 && rust > 2;
  const isDarkImage = brightness < 100;
  const hasLowContrast = contrast < 50;
  
  let causes: string[] = [];
  let symptoms: string[] = [];
  let improvements: string[] = [];
  
  // 녹 문제 진단
  if (hasRustIssue) {
    causes.push(`이미지 분석 결과 ${rust.toFixed(1)}%의 녹 색상이 감지되어 산화 진행 확인`);
    symptoms.push("설비 표면의 적갈색 변색 및 녹 발생 징후");
    improvements.push("녹 제거 작업 후 방청 처리 및 보호 코팅 적용");
  }
  
  // 부식 문제 진단
  if (hasCorrosionIssue) {
    causes.push(`이미지에서 ${corrosion.toFixed(1)}%의 부식 색상 패턴이 감지됨`);
    symptoms.push("설비 표면의 어두운 변색 및 부식 진행 흔적");
    improvements.push("부식 부위 연마 및 교체, 부식 방지 처리 강화");
  }
  
  // 도장 상태 문제
  if (hasPaintIssue) {
    causes.push(`페인트 피복률 ${paint.toFixed(1)}%로 도장막 손상 추정`);
    symptoms.push("도장막 박리, 벗겨짐 또는 변색 현상");
    improvements.push("기존 도장 제거 후 신규 방식 도장 시공");
  }
  
  // 일반적인 노후화
  if (!hasRustIssue && !hasCorrosionIssue && metal > 30) {
    causes.push("금속 표면이 주로 감지되어 일반적인 설비 노후화 추정");
    symptoms.push("설비 외관상 자연적인 노화 현상");
    improvements.push("정기적인 청소 및 예방 정비 시행");
  }
  
  // 이미지 품질 관련 보완
  if (isDarkImage) {
    symptoms.push("이미지가 어두워 정밀 진단에 제약이 있음");
    improvements.push("밝은 조명 하에서 고화질 재촬영 권장");
  }
  
  if (hasLowContrast) {
    symptoms.push("이미지 대비가 낮아 세부 결함 식별이 어려움");
    improvements.push("다각도 촬영 및 접근 촬영으로 세부 확인");
  }
  
  // 기본값 설정 (아무 문제가 감지되지 않은 경우)
  if (causes.length === 0) {
    causes.push("이미지 분석 결과 특별한 이상 징후는 감지되지 않음");
    symptoms.push("육안상 양호한 상태로 판단됨");
    improvements.push("현재 상태 유지를 위한 정기 점검 지속");
  }
  
  return {
    causes,
    symptoms,
    improvements
  };
};

// 기본 분석 결과 (분석 실패 시)
const getDefaultAnalysis = (fileName: string): AnalysisResult => {
  return {
    causes: [
      "이미지 분석 중 기술적 한계로 인한 일반적 설비 진단",
      "업로드된 이미지의 해상도 또는 촬영 조건 제약",
      "정확한 진단을 위해서는 추가 정보 필요"
    ],
    symptoms: [
      "시각적 확인이 어려운 내부적 문제 가능성",
      "다각도 촬영을 통한 추가 분석 필요",
      "설비 상세 정보 확인 권장"
    ],
    improvements: [
      "고해상도 다각도 사진 재촬영 실시",
      "설비 명판 및 도면 정보 추가 수집",
      "현장 전문가 직접 점검 의뢰"
    ]
  };
};
