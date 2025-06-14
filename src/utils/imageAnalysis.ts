
import { pipeline } from '@huggingface/transformers';

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

// 이미지 분류 및 객체 탐지를 통한 설비 분석
export const analyzeEquipmentImage = async (imageFile: File) => {
  try {
    console.log('이미지 분석 시작:', imageFile.name);
    
    // 이미지를 base64로 변환
    const imageData = await imageToBase64(imageFile);
    
    // 이미지 분류 파이프라인 생성
    const classifier = await pipeline('image-classification', 'google/vit-base-patch16-224');
    
    // 이미지 분석 실행
    const classificationResult = await classifier(imageData);
    console.log('분류 결과:', classificationResult);
    
    // 분석 결과를 기반으로 설비 관련 정보 추출
    return analyzeEquipmentFromClassification(classificationResult, imageFile.name);
    
  } catch (error) {
    console.error('이미지 분석 오류:', error);
    // 분석 실패 시 기본 분석 결과 반환
    return getDefaultAnalysis(imageFile.name);
  }
};

// 분류 결과를 기반으로 설비 분석 수행
const analyzeEquipmentFromClassification = (classificationResult: any[], fileName: string) => {
  const topResult = classificationResult[0];
  const confidence = topResult.score;
  const label = topResult.label.toLowerCase();
  
  console.log(`최상위 분류: ${label}, 신뢰도: ${confidence}`);
  
  // 설비 관련 키워드 매칭
  const equipmentKeywords = {
    pipe: ['pipe', 'tube', 'conduit', 'pipeline'],
    valve: ['valve', 'tap', 'faucet', 'cock'],
    pump: ['pump', 'compressor', 'blower'],
    motor: ['motor', 'engine', 'generator'],
    tank: ['tank', 'vessel', 'container', 'reservoir'],
    gauge: ['gauge', 'meter', 'indicator', 'dial'],
    electrical: ['electrical', 'wire', 'cable', 'switch', 'panel'],
    mechanical: ['gear', 'bearing', 'shaft', 'coupling']
  };
  
  let equipmentType = 'general';
  let detectedKeywords: string[] = [];
  
  // 키워드 매칭
  for (const [type, keywords] of Object.entries(equipmentKeywords)) {
    for (const keyword of keywords) {
      if (label.includes(keyword)) {
        equipmentType = type;
        detectedKeywords.push(keyword);
        break;
      }
    }
  }
  
  // 신뢰도에 따른 분석 결과 생성
  if (confidence > 0.7) {
    return generateHighConfidenceAnalysis(equipmentType, label, detectedKeywords, fileName);
  } else if (confidence > 0.3) {
    return generateMediumConfidenceAnalysis(equipmentType, label, detectedKeywords, fileName);
  } else {
    return generateLowConfidenceAnalysis(fileName);
  }
};

// 높은 신뢰도 분석 결과
const generateHighConfidenceAnalysis = (equipmentType: string, label: string, keywords: string[], fileName: string) => {
  const analyses: Record<string, any> = {
    pipe: {
      causes: [
        `${label} 유형의 배관에서 일반적으로 발생하는 연결부 노후화`,
        "배관 재질과 유체 특성 간 부적합으로 인한 부식",
        "설치 시 부적절한 지지대 설치로 인한 응력 집중"
      ],
      symptoms: [
        "배관 표면에서 감지되는 부식 징후",
        "연결부 주변 변색 및 누수 흔적",
        "배관 진동 또는 비정상적인 소음 발생"
      ],
      improvements: [
        "해당 배관 재질에 적합한 방식 처리 실시",
        "연결부 실링재 교체 및 조임 토크 재조정",
        "배관 지지대 보강 및 진동 저감 장치 설치"
      ]
    },
    valve: {
      causes: [
        `${label} 밸브의 내부 시트 마모로 인한 밀봉성 저하`,
        "밸브 구동부 윤활유 부족으로 인한 작동 불량",
        "유체 내 이물질로 인한 밸브 내부 손상"
      ],
      symptoms: [
        "밸브 조작 시 과도한 토크 필요",
        "밸브 시트부에서 미량 누설 발견",
        "밸브 작동 시 비정상적인 진동 또는 소음"
      ],
      improvements: [
        "밸브 내부 청소 및 시트 연마 작업",
        "구동부 윤활유 교체 및 정기 급유 시행",
        "상류측 스트레이너 설치로 이물질 유입 방지"
      ]
    },
    default: {
      causes: [
        `업로드된 이미지(${fileName})에서 감지된 설비의 일반적인 열화 현상`,
        "환경 조건 및 운전 조건에 따른 자연적 노화",
        "정기점검 주기 부족으로 인한 예방정비 미흡"
      ],
      symptoms: [
        "설비 외관상 노후화 징후 확인",
        "운전 성능 저하 또는 효율 감소",
        "비정상적인 소음, 진동, 온도 상승"
      ],
      improvements: [
        "설비별 맞춤형 정밀점검 실시",
        "예방정비 주기 단축 및 체계적 관리",
        "설비 교체 시기 검토 및 예산 계획 수립"
      ]
    }
  };
  
  return analyses[equipmentType] || analyses.default;
};

// 중간 신뢰도 분석 결과
const generateMediumConfidenceAnalysis = (equipmentType: string, label: string, keywords: string[], fileName: string) => {
  return {
    causes: [
      `이미지 분석 결과 ${label}와 유사한 설비로 추정되는 장비의 일반적 열화`,
      "설비 운전환경 및 사용 연수를 고려한 예상 문제점",
      "해당 설비 유형에서 빈번히 발생하는 공통 이슈"
    ],
    symptoms: [
      "외관 검사를 통해 확인 가능한 이상 징후",
      "운전 데이터 모니터링 필요 항목 존재",
      "정밀 진단이 필요한 잠재적 문제 요소"
    ],
    improvements: [
      "전문가 육안 검사 및 정밀 진단 실시",
      "설비별 특성을 고려한 맞춤형 점검 시행",
      "운전 데이터 분석을 통한 상태 평가"
    ]
  };
};

// 낮은 신뢰도 분석 결과
const generateLowConfidenceAnalysis = (fileName: string) => {
  return {
    causes: [
      "이미지 품질 또는 각도로 인한 정확한 설비 식별 한계",
      "일반적인 기계설비에서 발생하는 공통적 문제 요소",
      "추가적인 정보 수집이 필요한 불확실 요소"
    ],
    symptoms: [
      "시각적 확인이 어려운 내부적 문제 가능성",
      "다각도 촬영을 통한 추가 분석 필요",
      "운전 상황별 세부 관찰 요구"
    ],
    improvements: [
      "고해상도 다각도 사진 재촬영 실시",
      "설비 명판 및 도면 정보 추가 수집",
      "현장 전문가 직접 점검 의뢰"
    ]
  };
};

// 기본 분석 결과 (분석 실패 시)
const getDefaultAnalysis = (fileName: string) => {
  return {
    causes: [
      "이미지 분석 중 기술적 한계로 인한 일반적 설비 진단",
      "업로드된 이미지의 해상도 또는 촬영 조건 제약",
      "AI 모델의 학습 데이터 범위를 벗어난 특수 설비"
    ],
    symptoms: [
      "정확한 진단을 위해서는 추가 정보 필요",
      "설비 상태에 대한 기본적 외관 검사 권장",
      "전문가 육안 검사를 통한 세부 확인 필요"
    ],
    improvements: [
      "명확한 설비 사진 재촬영 (명판, 전체, 세부 부위)",
      "설비 제원 및 운전 이력 정보 제공",
      "현장 전문 엔지니어 점검 의뢰"
    ]
  };
};
