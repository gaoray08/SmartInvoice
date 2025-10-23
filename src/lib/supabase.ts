import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface InvoiceLog {
  id: string;
  filename: string;
  file_size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  uploaded_at: string;
  completed_at: string | null;
  created_at: string;
  amount: number;
  document_type: 'Sale Order' | 'Purchase Order';
  extracted_data: any;
}
