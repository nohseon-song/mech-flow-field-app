-- Add google_doc_id column to reports table for Google Docs integration
ALTER TABLE public.reports 
ADD COLUMN google_doc_id TEXT,
ADD COLUMN google_sheet_id TEXT,
ADD COLUMN document_url TEXT;