
import type { Database } from '@/integrations/supabase/types';

type AIProvider = Database['public']['Enums']['ai_provider'];

export const modelOptions = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o (Mais poderoso)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Rápido e econômico)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  ],
  google: [
    { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite (Mais rápido e eficiente)' },
    { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro (Mais poderoso)' },
    { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash (Rápido e econômico)' },
    { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro' },
  ],
  claude: [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Mais poderoso)' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet (Equilibrado)' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Rápido e econômico)' },
  ],
  deepseek: [
    { value: 'deepseek-chat', label: 'DeepSeek Chat (Modelo de Chat)' },
    { value: 'deepseek-coder', label: 'DeepSeek Coder (Modelo de Código)' },
  ],
} as const;

export const providerDescriptions = {
  openai: 'O modelo da OpenAI que será usado para a análise.',
  google: 'O modelo do Google que será usado para a análise.',
  claude: 'O modelo da Anthropic (Claude) que será usado para a análise.',
  deepseek: 'O modelo da Deepseek que será usado para a análise.',
} as const;

export const getDefaultModelForProvider = (provider: keyof typeof modelOptions): string => {
  switch (provider) {
    case 'openai':
      return 'gpt-4o-mini';
    case 'google':
      return 'gemini-2.0-flash-lite';
    case 'claude':
      return 'claude-3-haiku-20240307';
    case 'deepseek':
      return 'deepseek-chat';
    default:
      return 'gemini-2.0-flash-lite';
  }
};
