import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GoogleDocData {
  title: string;
  content: string;
}

export interface GoogleSheetData {
  title: string;
  range?: string;
  values?: string[][];
}

export const useGoogleAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callGoogleDocsAPI = async (action: string, data: any) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('로그인이 필요합니다.');
      }

      const { data: result, error } = await supabase.functions.invoke('google-docs-api', {
        body: { action, data },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.message || "Google Docs API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const callGoogleSheetsAPI = async (action: string, data: any) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('로그인이 필요합니다.');
      }

      const { data: result, error } = await supabase.functions.invoke('google-sheets-api', {
        body: { action, data },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      return result;
    } catch (error: any) {
      toast({
        title: "오류",
        description: error.message || "Google Sheets API 호출 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createGoogleDoc = async (docData: GoogleDocData) => {
    const result = await callGoogleDocsAPI('create_document', docData);
    if (result.success) {
      toast({
        title: "성공",
        description: "Google 문서가 생성되었습니다.",
      });
    }
    return result;
  };

  const getGoogleDoc = async (documentId: string) => {
    return await callGoogleDocsAPI('get_document', { documentId });
  };

  const createGoogleSheet = async (sheetData: GoogleSheetData) => {
    const result = await callGoogleSheetsAPI('create_spreadsheet', sheetData);
    if (result.success) {
      toast({
        title: "성공",
        description: "Google 스프레드시트가 생성되었습니다.",
      });
    }
    return result;
  };

  const updateGoogleSheetValues = async (spreadsheetId: string, range: string, values: string[][]) => {
    return await callGoogleSheetsAPI('update_values', { spreadsheetId, range, values });
  };

  const getGoogleSheetValues = async (spreadsheetId: string, range: string) => {
    return await callGoogleSheetsAPI('get_values', { spreadsheetId, range });
  };

  return {
    isLoading,
    createGoogleDoc,
    getGoogleDoc,
    createGoogleSheet,
    updateGoogleSheetValues,
    getGoogleSheetValues,
  };
};