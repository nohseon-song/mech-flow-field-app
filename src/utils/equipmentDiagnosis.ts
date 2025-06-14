
import type { AnalysisResult, ColorAnalysis, BrightnessAnalysis } from '@/types/imageAnalysis';

// 분석 결과를 기반으로 설비 진단 생성
export const generateEquipmentDiagnosis = (colorAnalysis: ColorAnalysis, brightnessAnalysis: BrightnessAnalysis, fileName: string): AnalysisResult => {
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
