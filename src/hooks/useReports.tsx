import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Report {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReports(data || []);
    } catch (error: any) {
      toast({
        title: '보고서 로드 실패',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async (title: string, content: string) => {
    if (!user) {
      toast({
        title: '로그인 필요',
        description: '보고서 저장을 위해 로그인해주세요.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .insert([
          {
            user_id: user.id,
            title,
            content,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '보고서 저장 완료',
        description: '보고서가 성공적으로 저장되었습니다.',
      });

      await fetchReports(); // Refresh the list
      return data;
    } catch (error: any) {
      toast({
        title: '보고서 저장 실패',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: '보고서 삭제 완료',
        description: '보고서가 성공적으로 삭제되었습니다.',
      });

      await fetchReports(); // Refresh the list
      return true;
    } catch (error: any) {
      toast({
        title: '보고서 삭제 실패',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  return {
    reports,
    loading,
    saveReport,
    deleteReport,
    fetchReports,
  };
};