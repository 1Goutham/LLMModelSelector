import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  model_id: string | null;
  description: string;
  modality: string[];
  parameters: string | null;
  context_window: number | null;
  license_type: string;
  hosting_type: string[];
  oci_availability: string[];
  best_gpu: string[];
  features: Record<string,unknown>;
  performance_metrics: Record<string, number>;
  model_card_url: string | null;
  pricing: string | null;
  release_date: string | null;
  is_production_ready: boolean;
  created_at: string;
}
