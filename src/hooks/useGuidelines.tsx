
import { useState, useEffect } from 'react';
import { useKnowledgeFiles } from './useKnowledgeFiles';
import { useAuth } from './useAuth';

interface Guidelines {
  operation: string;
  knowledge: string;
}

export const useGuidelines = () => {
  const { user } = useAuth();
  const [guidelines, setGuidelines] = useState<Guidelines>({
    operation: '',
    knowledge: ''
  });
  const { getEnhancedKnowledgeGuideline } = useKnowledgeFiles();

  useEffect(() => {
    if (user) {
      // 사용자별 지침 로드
      const userGuidelinesKey = `ai-guidelines-${user.id}`;
      const savedGuidelines = localStorage.getItem(userGuidelinesKey);
      
      if (savedGuidelines) {
        setGuidelines(JSON.parse(savedGuidelines));
      } else {
        // 사용자별 지침이 없으면 전역 지침 확인 (호환성)
        const globalGuidelines = localStorage.getItem('ai-guidelines');
        if (globalGuidelines) {
          setGuidelines(JSON.parse(globalGuidelines));
        }
      }
    } else {
      // 로그인하지 않은 경우 빈 지침
      setGuidelines({
        operation: '',
        knowledge: ''
      });
    }
  }, [user]);

  const getGuideline = (type: 'operation' | 'knowledge'): string => {
    // 로그인하지 않은 사용자는 지침 사용 불가
    if (!user) {
      return '';
    }
    
    const baseGuideline = guidelines[type] || '';
    
    // 지식지침의 경우 업로드된 파일 내용을 포함한 강화된 지침 반환
    if (type === 'knowledge') {
      return getEnhancedKnowledgeGuideline(baseGuideline);
    }
    
    return baseGuideline;
  };

  return { guidelines, getGuideline };
};
