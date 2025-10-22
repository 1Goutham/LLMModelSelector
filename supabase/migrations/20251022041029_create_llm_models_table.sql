/*
  # Create LLM Models Database

  1. New Tables
    - `llm_models`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Model name
      - `provider` (text) - Provider/Organization (OpenAI, Anthropic, Meta, etc.)
      - `model_id` (text) - Hugging Face model ID for downloads
      - `description` (text) - Model description
      - `modality` (text[]) - Array of modalities (text, vision, audio, realtime)
      - `parameters` (text) - Parameter count (7B, 70B, 405B, etc.)
      - `context_window` (integer) - Context window size in tokens
      - `license_type` (text) - open_source, closed_source, open_weights
      - `hosting_type` (text[]) - Array: api_based, self_hosted
      - `oci_availability` (text[]) - Array: generative_ai, data_science, none
      - `best_gpu` (text[]) - Recommended GPUs (NVIDIA_H100, AMD_MI300X, etc.)
      - `features` (jsonb) - Additional features as JSON
      - `performance_metrics` (jsonb) - Benchmark scores
      - `model_card_url` (text) - Link to official model card
      - `pricing` (text) - Pricing information
      - `release_date` (date) - Model release date
      - `is_production_ready` (boolean) - Production grade status
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on `llm_models` table
    - Add policy for public read access (model catalog is public)
  
  3. Indexes
    - Index on modality for fast filtering
    - Index on license_type for filtering
    - Index on is_production_ready for filtering
*/

CREATE TABLE IF NOT EXISTS llm_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL,
  model_id text,
  description text NOT NULL,
  modality text[] NOT NULL DEFAULT '{}',
  parameters text,
  context_window integer,
  license_type text NOT NULL,
  hosting_type text[] NOT NULL DEFAULT '{}',
  oci_availability text[] NOT NULL DEFAULT '{}',
  best_gpu text[] NOT NULL DEFAULT '{}',
  features jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  model_card_url text,
  pricing text,
  release_date date,
  is_production_ready boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE llm_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view models"
  ON llm_models FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_llm_models_modality ON llm_models USING GIN(modality);
CREATE INDEX IF NOT EXISTS idx_llm_models_license ON llm_models (license_type);
CREATE INDEX IF NOT EXISTS idx_llm_models_production ON llm_models (is_production_ready);
CREATE INDEX IF NOT EXISTS idx_llm_models_oci ON llm_models USING GIN(oci_availability);

-- Insert top production-ready models
INSERT INTO llm_models (name, provider, model_id, description, modality, parameters, context_window, license_type, hosting_type, oci_availability, best_gpu, features, performance_metrics, model_card_url, pricing, release_date, is_production_ready) VALUES

-- GPT-4 Turbo
('GPT-4 Turbo', 'OpenAI', NULL, 'Most capable GPT-4 model with 128K context, superior reasoning and instruction following', ARRAY['text', 'vision'], '1.76T (estimated)', 128000, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['NVIDIA_H100', 'NVIDIA_A100'], '{"function_calling": true, "json_mode": true, "vision": true}', '{"mmlu": 86.4, "humaneval": 87.0, "gsm8k": 92.0}', 'https://platform.openai.com/docs/models/gpt-4-turbo', '$10/1M input tokens, $30/1M output tokens', '2024-04-09', true),

-- Claude 3.5 Sonnet
('Claude 3.5 Sonnet', 'Anthropic', NULL, 'Highest intelligence model with 200K context, exceptional reasoning and analysis', ARRAY['text', 'vision'], 'Undisclosed', 200000, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['NVIDIA_H100', 'NVIDIA_A100'], '{"artifacts": true, "vision": true, "extended_thinking": true}', '{"mmlu": 88.3, "humaneval": 92.0, "math": 78.0}', 'https://www.anthropic.com/claude', '$3/1M input tokens, $15/1M output tokens', '2024-10-22', true),

-- Gemini 1.5 Pro
('Gemini 1.5 Pro', 'Google', NULL, 'Long context specialist with 2M tokens, multimodal understanding', ARRAY['text', 'vision', 'audio'], 'Undisclosed', 2000000, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['TPU_v5', 'NVIDIA_H100'], '{"multimodal": true, "ultra_long_context": true, "grounding": true}', '{"mmlu": 85.9, "humaneval": 84.0, "long_context": 95.0}', 'https://deepmind.google/technologies/gemini/', '$1.25/1M input tokens, $5/1M output tokens', '2024-05-14', true),

-- Llama 3.1 405B
('Llama 3.1 405B Instruct', 'Meta', 'meta-llama/Meta-Llama-3.1-405B-Instruct', 'Largest open weights model, GPT-4 class performance with 128K context', ARRAY['text'], '405B', 128000, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_H100', 'AMD_MI300X'], '{"multilingual": true, "tool_use": true, "reasoning": true}', '{"mmlu": 87.3, "humaneval": 89.0, "gsm8k": 91.0}', 'https://huggingface.co/meta-llama/Meta-Llama-3.1-405B-Instruct', 'Free (open weights)', '2024-07-23', true),

-- Llama 3.1 70B
('Llama 3.1 70B Instruct', 'Meta', 'meta-llama/Meta-Llama-3.1-70B-Instruct', 'High performance open weights model, efficient for production deployment', ARRAY['text'], '70B', 128000, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_A100', 'NVIDIA_H100', 'AMD_MI300X'], '{"multilingual": true, "tool_use": true, "efficient": true}', '{"mmlu": 83.6, "humaneval": 80.5, "gsm8k": 84.0}', 'https://huggingface.co/meta-llama/Meta-Llama-3.1-70B-Instruct', 'Free (open weights)', '2024-07-23', true),

-- Llama 3.1 8B
('Llama 3.1 8B Instruct', 'Meta', 'meta-llama/Meta-Llama-3.1-8B-Instruct', 'Compact yet powerful model, ideal for edge deployment and cost-sensitive applications', ARRAY['text'], '8B', 128000, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['data_science'], ARRAY['NVIDIA_A100', 'NVIDIA_4090', 'AMD_MI250'], '{"multilingual": true, "efficient": true, "edge_ready": true}', '{"mmlu": 68.4, "humaneval": 72.0, "gsm8k": 76.0}', 'https://huggingface.co/meta-llama/Meta-Llama-3.1-8B-Instruct', 'Free (open weights)', '2024-07-23', true),

-- Mixtral 8x22B
('Mixtral 8x22B Instruct', 'Mistral AI', 'mistralai/Mixtral-8x22B-Instruct-v0.1', 'Sparse mixture of experts, exceptional performance with efficient inference', ARRAY['text'], '141B (8x22B MoE)', 65536, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_A100', 'NVIDIA_H100'], '{"moe": true, "efficient": true, "multilingual": true}', '{"mmlu": 77.8, "humaneval": 75.0, "gsm8k": 81.0}', 'https://huggingface.co/mistralai/Mixtral-8x22B-Instruct-v0.1', 'Free (Apache 2.0)', '2024-04-10', true),

-- Command R+
('Command R+', 'Cohere', 'CohereForAI/c4ai-command-r-plus', 'Enterprise-focused model with RAG optimization and multilingual support', ARRAY['text'], '104B', 128000, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_A100', 'NVIDIA_H100'], '{"rag_optimized": true, "multilingual": true, "grounded_generation": true}', '{"mmlu": 75.0, "retrieval": 89.0, "multilingual": 85.0}', 'https://huggingface.co/CohereForAI/c4ai-command-r-plus', 'Free (CC-BY-NC)', '2024-04-04', true),

-- Qwen 2.5 72B
('Qwen 2.5 72B Instruct', 'Alibaba', 'Qwen/Qwen2.5-72B-Instruct', 'State-of-the-art open model with exceptional coding and math capabilities', ARRAY['text'], '72B', 131072, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_A100', 'NVIDIA_H100'], '{"coding": true, "math": true, "multilingual": true}', '{"mmlu": 84.5, "humaneval": 86.0, "math": 80.0}', 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct', 'Free (Apache 2.0)', '2024-09-19', true),

-- GPT-4o
('GPT-4o', 'OpenAI', NULL, 'Multimodal flagship with real-time voice, vision, and text understanding', ARRAY['text', 'vision', 'audio', 'realtime'], '1.76T (estimated)', 128000, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['NVIDIA_H100'], '{"realtime": true, "multimodal": true, "vision": true, "audio": true}', '{"mmlu": 87.2, "humaneval": 90.2, "multimodal": 92.0}', 'https://platform.openai.com/docs/models/gpt-4o', '$2.50/1M input tokens, $10/1M output tokens', '2024-05-13', true),

-- Gemini 2.0 Flash
('Gemini 2.0 Flash', 'Google', NULL, 'Fastest multimodal model with native audio and vision understanding', ARRAY['text', 'vision', 'audio'], 'Undisclosed', 1000000, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['TPU_v5', 'NVIDIA_H100'], '{"multimodal": true, "speed_optimized": true, "native_audio": true}', '{"mmlu": 83.0, "speed": 98.0, "multimodal": 89.0}', 'https://deepmind.google/technologies/gemini/flash/', '$0.075/1M input tokens, $0.30/1M output tokens', '2024-12-11', true),

-- Phi-3.5 Mini
('Phi-3.5 Mini Instruct', 'Microsoft', 'microsoft/Phi-3.5-mini-instruct', 'Compact model with surprising capabilities, perfect for edge and mobile', ARRAY['text'], '3.8B', 128000, 'open_source', ARRAY['self_hosted'], ARRAY['data_science'], ARRAY['NVIDIA_4090', 'NVIDIA_A100', 'Apple_M_Series'], '{"compact": true, "edge_ready": true, "efficient": true}', '{"mmlu": 68.1, "humaneval": 59.0, "efficiency": 95.0}', 'https://huggingface.co/microsoft/Phi-3.5-mini-instruct', 'Free (MIT)', '2024-08-20', true),

-- DeepSeek V3
('DeepSeek-V3', 'DeepSeek', 'deepseek-ai/DeepSeek-V3', 'Cutting-edge MoE model with 671B parameters, exceptional reasoning', ARRAY['text'], '671B (37B active)', 128000, 'open_source', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_H100', 'NVIDIA_H800'], '{"moe": true, "reasoning": true, "cost_efficient": true}', '{"mmlu": 88.5, "humaneval": 90.2, "math": 82.0}', 'https://huggingface.co/deepseek-ai/DeepSeek-V3', 'Free (MIT)', '2024-12-26', true),

-- Claude 3 Opus
('Claude 3 Opus', 'Anthropic', NULL, 'Most powerful Claude model for complex analysis and creative tasks', ARRAY['text', 'vision'], 'Undisclosed', 200000, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['NVIDIA_H100'], '{"vision": true, "reasoning": true, "creative": true}', '{"mmlu": 86.8, "humaneval": 84.9, "reasoning": 90.0}', 'https://www.anthropic.com/claude', '$15/1M input tokens, $75/1M output tokens', '2024-03-04', true),

-- Grok-2
('Grok-2', 'xAI', NULL, 'Real-time information model with web search and reasoning capabilities', ARRAY['text'], 'Undisclosed', 131072, 'closed_source', ARRAY['api_based'], ARRAY['generative_ai'], ARRAY['NVIDIA_H100'], '{"web_search": true, "realtime": true, "reasoning": true}', '{"mmlu": 85.0, "humaneval": 88.0, "realtime": 95.0}', 'https://x.ai/', '$2/1M input tokens, $10/1M output tokens', '2024-08-13', true),

-- Llama 3.2 Vision 90B
('Llama 3.2 90B Vision Instruct', 'Meta', 'meta-llama/Llama-3.2-90B-Vision-Instruct', 'Open weights multimodal model with vision and text understanding', ARRAY['text', 'vision'], '90B', 128000, 'open_weights', ARRAY['api_based', 'self_hosted'], ARRAY['generative_ai', 'data_science'], ARRAY['NVIDIA_H100', 'AMD_MI300X'], '{"vision": true, "multimodal": true, "open_weights": true}', '{"mmlu": 82.0, "vision_qa": 85.0, "humaneval": 78.0}', 'https://huggingface.co/meta-llama/Llama-3.2-90B-Vision-Instruct', 'Free (open weights)', '2024-09-25', true)

ON CONFLICT DO NOTHING;