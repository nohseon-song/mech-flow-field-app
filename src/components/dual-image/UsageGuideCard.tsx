
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UsageGuideCard = () => {
  return (
    <Card className="bg-indigo-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="text-sm text-indigo-800">📋 사용 가이드</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ol className="text-xs text-indigo-700 space-y-1 list-decimal list-inside">
          <li>장비 정보 설정에서 장비 ID와 위치를 입력하세요</li>
          <li>설계 기준 이미지를 업로드하고 "텍스트 추출하기"를 클릭하세요</li>
          <li>실측 이미지를 업로드하고 "텍스트 추출하기"를 클릭하세요</li>
          <li>"분석하기"를 클릭하여 두 이미지의 데이터를 비교하세요</li>
          <li>"분석 전송"을 클릭하여 결과를 Make.com으로 전송하세요</li>
          <li>다수 장비 분석 시 장비 ID를 변경하며 반복 사용하세요</li>
        </ol>
      </CardContent>
    </Card>
  );
};

export default UsageGuideCard;
