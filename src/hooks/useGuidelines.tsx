
import { useState, useEffect } from 'react';

interface Guidelines {
  operation: string;
  knowledge: string;
}

export const useGuidelines = () => {
  const [guidelines, setGuidelines] = useState<Guidelines>({
    operation: '',
    knowledge: ''
  });

  useEffect(() => {
    const savedGuidelines = localStorage.getItem('ai-guidelines');
    if (savedGuidelines) {
      setGuidelines(JSON.parse(savedGuidelines));
    }
  }, []);

  const getGuideline = (type: 'operation' | 'knowledge'): string => {
    return guidelines[type] || '';
  };

  return { guidelines, getGuideline };
};
