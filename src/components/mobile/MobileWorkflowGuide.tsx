
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Settings } from 'lucide-react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

const MobileWorkflowGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      title: '현장 도착 확인',
      description: '작업 현장에 도착했는지 확인하고 안전 점검을 실시합니다.',
      completed: false,
      required: true,
    },
    {
      id: 2,
      title: '설비 점검 준비',
      description: '점검할 설비를 확인하고 필요한 도구를 준비합니다.',
      completed: false,
      required: true,
    },
    {
      id: 3,
      title: '외관 점검',
      description: '설비의 외관 상태를 육안으로 점검합니다.',
      completed: false,
      required: true,
    },
    {
      id: 4,
      title: '성능 측정',
      description: '설비의 성능 지표를 측정하고 기록합니다.',
      completed: false,
      required: true,
    },
    {
      id: 5,
      title: '이상 사항 기록',
      description: '발견된 이상 사항이나 개선점을 기록합니다.',
      completed: false,
      required: false,
    },
    {
      id: 6,
      title: '점검 완료 보고',
      description: '점검 결과를 정리하고 보고서를 작성합니다.',
      completed: false,
      required: true,
    },
  ]);

  const handleStepComplete = (stepId: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-4">
      {/* 진행률 표시 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">작업 진행률</span>
            <span className="text-sm font-bold text-blue-800">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-blue-700">
            <span>{completedSteps}개 완료</span>
            <span>총 {steps.length}단계</span>
          </div>
        </CardContent>
      </Card>

      {/* 현재 단계 표시 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              단계 {currentStep + 1}: {steps[currentStep].title}
            </CardTitle>
            <Badge variant={steps[currentStep].required ? 'default' : 'secondary'}>
              {steps[currentStep].required ? '필수' : '선택'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
          
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant={steps[currentStep].completed ? 'default' : 'outline'}
              onClick={() => handleStepComplete(steps[currentStep].id)}
              className="flex-1"
            >
              {steps[currentStep].completed ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  완료됨
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4 mr-2" />
                  완료 표시
                </>
              )}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 단계
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={currentStep === steps.length - 1}
              className="flex-1"
            >
              다음 단계
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 전체 단계 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">전체 작업 단계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  index === currentStep 
                    ? 'border-blue-500 bg-blue-50' 
                    : step.completed 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className={`h-5 w-5 ${index === currentStep ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${step.completed ? 'text-green-800' : index === currentStep ? 'text-blue-800' : 'text-gray-800'}`}>
                      {step.title}
                    </span>
                    {step.required && (
                      <Badge variant="outline" className="text-xs">필수</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileWorkflowGuide;
