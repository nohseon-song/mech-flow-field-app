
import React from 'react';
import AppHeader from './AppHeader';
import DeviceSettingsCard from './DeviceSettingsCard';
import EnhancedImageUploadSection from './EnhancedImageUploadSection';
import EnhancedAnalysisControlCard from './EnhancedAnalysisControlCard';
import EnhancedAnalysisResultsCard from './EnhancedAnalysisResultsCard';
import AnalysisHistoryPanel from './AnalysisHistoryPanel';
import { AdvancedAnalysisResult } from '@/utils/advancedAnalysis';
import { type ParsedEquipmentData } from '@/utils/textDataParser';

interface EnhancedDualImageLayoutProps {
  equipmentName: string;
  location: string;
  onEquipmentNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
  
  referenceImage: File | null;
  measurementImage: File | null;
  referenceData: ParsedEquipmentData | null;
  measurementData: ParsedEquipmentData | null;
  isProcessingRef: boolean;
  isProcessingMeas: boolean;
  
  onReferenceImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMeasurementImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onProcessReferenceOCR: () => void;
  onProcessMeasurementOCR: () => void;
  
  analysisResult: AdvancedAnalysisResult | null;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  onPerformComparison: () => void;
  
  // 편집 관련
  isEditing: boolean;
  editableResult: AdvancedAnalysisResult | null;
  onStartEditing: () => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onUpdateField: (field: keyof AdvancedAnalysisResult, value: any) => void;
  onUpdateRecommendation: (index: number, value: string) => void;
  onAddRecommendation: () => void;
  onRemoveRecommendation: (index: number) => void;
  
  userComment: string;
  onUserCommentChange: (comment: string) => void;
  
  isSending: boolean;
  onSendToWebhook: () => void;
  onCopyResult: () => void;
  onRetryLastSend: () => void;
  
  webhookResponse?: any;
  lastSentData?: any;
  
  onLoadHistory: (historyItem: any) => void;
}

const EnhancedDualImageLayout = ({
  equipmentName,
  location,
  onEquipmentNameChange,
  onLocationChange,
  
  referenceImage,
  measurementImage,
  referenceData,
  measurementData,
  isProcessingRef,
  isProcessingMeas,
  
  onReferenceImageSelect,
  onMeasurementImageSelect,
  onProcessReferenceOCR,
  onProcessMeasurementOCR,
  
  analysisResult,
  isAnalyzing,
  canAnalyze,
  onPerformComparison,
  
  // 편집 관련
  isEditing,
  editableResult,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onUpdateField,
  onUpdateRecommendation,
  onAddRecommendation,
  onRemoveRecommendation,
  
  userComment,
  onUserCommentChange,
  
  isSending,
  onSendToWebhook,
  onCopyResult,
  onRetryLastSend,
  
  webhookResponse,
  lastSentData,
  
  onLoadHistory
}: EnhancedDualImageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <AppHeader />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 상단 알림 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              🚀 고도화된 AI 다중 설비 분석 시스템 v2.0
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Key:Value 자동 추출, 편집 가능한 분석 결과, 향상된 PDF 생성, Gemini AI 챗봇, 분석 이력 관리
          </p>
        </div>

        {/* 설비 설정 */}
        <DeviceSettingsCard
          equipmentName={equipmentName}
          setEquipmentName={onEquipmentNameChange}
          location={location}
          setLocation={onLocationChange}
        />

        {/* 이미지 업로드 섹션 */}
        <EnhancedImageUploadSection
          referenceImage={referenceImage}
          measurementImage={measurementImage}
          referenceData={referenceData}
          measurementData={measurementData}
          isProcessingRef={isProcessingRef}
          isProcessingMeas={isProcessingMeas}
          onReferenceImageSelect={onReferenceImageSelect}
          onMeasurementImageSelect={onMeasurementImageSelect}
          onProcessReferenceOCR={onProcessReferenceOCR}
          onProcessMeasurementOCR={onProcessMeasurementOCR}
        />

        {/* 분석 제어 */}
        <EnhancedAnalysisControlCard
          onPerformComparison={onPerformComparison}
          isAnalyzing={isAnalyzing}
          referenceData={referenceData}
          measurementData={measurementData}
          analysisResult={analysisResult}
          onSendToWebhook={onSendToWebhook}
          isSending={isSending}
          onCopyResult={onCopyResult}
          onRetryLastSend={onRetryLastSend}
          canAnalyze={canAnalyze}
          lastSentData={lastSentData}
        />

        {/* 분석 결과 */}
        {analysisResult && (
          <EnhancedAnalysisResultsCard 
            analysisResult={analysisResult}
            equipmentName={equipmentName}
            location={location}
            referenceData={referenceData}
            measurementData={measurementData}
            userComment={userComment}
            onUserCommentChange={onUserCommentChange}
            webhookResponse={webhookResponse}
            
            // 편집 관련
            isEditing={isEditing}
            editableResult={editableResult}
            onStartEditing={onStartEditing}
            onSaveEditing={onSaveEditing}
            onCancelEditing={onCancelEditing}
            onUpdateField={onUpdateField}
            onUpdateRecommendation={onUpdateRecommendation}
            onAddRecommendation={onAddRecommendation}
            onRemoveRecommendation={onRemoveRecommendation}
          />
        )}

        {/* 분석 이력 관리 */}
        <AnalysisHistoryPanel onLoadHistory={onLoadHistory} />

        {/* 사용 안내 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4">
            🎯 고도화된 기능 사용 가이드
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600 dark:text-purple-400">📊 Key:Value 추출</h4>
              <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-xs">
                <li>• 유량, 유속, 체적 자동 인식</li>
                <li>• 신호값, 위치, 상태 구분</li>
                <li>• 구조화된 데이터 표시</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600 dark:text-purple-400">✏️ 분석 결과 편집</h4>
              <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-xs">
                <li>• 실시간 분석 결과 수정</li>
                <li>• 권장사항 추가/삭제</li>
                <li>• 전송 전 최종 검토</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-600 dark:text-purple-400">📋 이력 관리</h4>
              <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-xs">
                <li>• 모든 분석 자동 저장</li>
                <li>• 이전 결과 불러오기</li>
                <li>• PDF 개별 다운로드</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDualImageLayout;
