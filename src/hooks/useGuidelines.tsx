
import { useState, useEffect } from 'react';
import { useKnowledgeFiles } from './useKnowledgeFiles';

interface Guidelines {
  operation: string;
  knowledge: string;
}

export const useGuidelines = () => {
  const [guidelines, setGuidelines] = useState<Guidelines>({
    operation: '',
    knowledge: ''
  });
  const { getEnhancedKnowledgeGuideline } = useKnowledgeFiles();

  useEffect(() => {
    const savedGuidelines = localStorage.getItem('ai-guidelines');
    if (savedGuidelines) {
      setGuidelines(JSON.parse(savedGuidelines));
    }
  }, []);

  const getGuideline = (type: 'operation' | 'knowledge'): string => {
    const baseGuideline = guidelines[type] || '';
    
    // 지식지침의 경우 업로드된 파일 내용을 포함한 강화된 지침 반환
    if (type === 'knowledge') {
      return getEnhancedKnowledgeGuideline(baseGuideline);
    }
    
    return baseGuideline;
  };

  return { guidelines, getGuideline };
};
