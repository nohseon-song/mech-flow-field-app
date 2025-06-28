
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UsageGuideCard = () => {
  return (
    <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700">
      <CardHeader>
        <CardTitle className="text-sm text-indigo-800 dark:text-indigo-200">📋 사용 가이드</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ol className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1 list-decimal list-inside">
          <li>설비 설정에서 설비명칭과 설치위치를 입력하세요</li>
          <li>기준값(설계값) 이미지를 업로드하고 "텍스트 추출하기"를 클릭하세요</li>
          <li>측정값 이미지를 업로드하고 "텍스트 추출하기"를 클릭하세요</li>
          <li>"분석하기"를 클릭하여 AI 전문 분석을 수행하세요</li>
          <li>"PDF 다운로드"로 분석 리포트를 저장하세요</li>
          <li>"분석 전송"을 클릭하여 Make.com으로 결과를 전송하세요</li>
          <li>다수 설비 분석 시 설비명칭을 변경하며 반복 사용하세요</li>
        </ol>
        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
          💡 <strong>팁:</strong> 분석 결과와 설비 정보는 자동으로 저장되어 다음 방문시에도 유지됩니다.
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageGuideCard;
