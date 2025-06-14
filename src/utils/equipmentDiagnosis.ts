
import type { AnalysisResult, ColorAnalysis, BrightnessAnalysis } from '@/types/imageAnalysis';
import { detectImageType } from './imageTypeDetection';

// 분석 결과를 기반으로 설비 진단 생성
export const generateEquipmentDiagnosis = (colorAnalysis: ColorAnalysis, brightnessAnalysis: BrightnessAnalysis, fileName: string): AnalysisResult => {
  // 먼저 이미지 유형 판단
  const imageTypeAnalysis = detectImageType(colorAnalysis, brightnessAnalysis, fileName);
  
  console.log('이미지 유형 분석:', imageTypeAnalysis);
  
  // 설비가 아닌 경우 적절한 안내 제공
  if (!imageTypeAnalysis.isEquipment) {
    return generateNonEquipmentResponse(imageTypeAnalysis, fileName);
  }
  
  // 설비인 경우 기존 진단 로직 수행
  const { rust, metal, corrosion, paint } = colorAnalysis;
  const { brightness, contrast } = brightnessAnalysis;
  
  console.log(`설비 진단 생성: 녹 ${rust.toFixed(1)}%, 금속 ${metal.toFixed(1)}%, 부식 ${corrosion.toFixed(1)}%, 페인트 ${paint.toFixed(1)}%`);
  
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

// 설비가 아닌 이미지에 대한 응답 생성
const generateNonEquipmentResponse = (imageTypeAnalysis: any, fileName: string): AnalysisResult => {
  switch (imageTypeAnalysis.imageType) {
    case 'person':
      return {
        causes: [
          "업로드된 이미지가 인물 사진으로 판단됩니다",
          "설비 진단 시스템은 기계, 장비, 시설물 분석에 특화되어 있습니다",
          "인물 사진은 설비 상태 분석 대상이 아닙니다"
        ],
        symptoms: [
          "이미지에서 설비 관련 요소가 감지되지 않음",
          "인물의 얼굴이나 신체 부위가 주요 구성 요소임",
          "금속, 기계 부품 등 설비 특징이 부족함"
        ],
        improvements: [
          "분석하려는 설비(기계, 장비, 시설물)의 사진을 업로드해주세요",
          "설비 전체 또는 문제가 의심되는 부위를 명확히 촬영",
          "충분한 조명과 선명한 화질로 재촬영 권장"
        ]
      };
      
    case 'document':
      return {
        causes: [
          "업로드된 이미지가 문서나 텍스트로 판단됩니다",
          "설비 진단 시스템은 물리적 장비 분석용입니다",
          "문서 이미지는 설비 상태 진단 범위에 해당하지 않습니다"
        ],
        symptoms: [
          "이미지에서 물리적 설비 요소가 감지되지 않음",
          "주로 텍스트나 도면으로 구성된 내용",
          "3차원 물체의 특성이 부족함"
        ],
        improvements: [
          "실제 설비(펌프, 모터, 배관, 탱크 등)의 사진을 촬영해주세요",
          "문서가 아닌 현장 설비 직접 촬영 필요",
          "설비 명판이나 도면보다는 실물 장비 사진 업로드"
        ]
      };
      
    default:
      return {
        causes: [
          "업로드된 이미지에서 명확한 설비 요소가 감지되지 않습니다",
          "이미지 유형이 설비 진단에 적합하지 않을 수 있습니다",
          "분석 시스템이 인식할 수 있는 설비 특징이 부족합니다"
        ],
        symptoms: [
          "금속, 기계 부품 등 설비 특성이 충분히 감지되지 않음",
          "이미지 해상도나 촬영 각도의 한계 가능성",
          "설비가 아닌 다른 대상일 가능성"
        ],
        improvements: [
          "분석 대상이 설비(기계, 장비, 시설)인지 확인해주세요",
          "설비 전체가 명확히 보이도록 재촬영",
          "적절한 거리와 조명에서 고화질로 촬영"
        ]
      };
  }
};

// 기본 분석 결과 (분석 실패 시)
export const getDefaultAnalysis = (fileName: string): AnalysisResult => {
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
