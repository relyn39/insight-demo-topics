
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type AIProvider = Database['public']['Enums']['ai_provider'];

export interface AiConfigFormValues {
  provider: 'openai' | 'google' | 'claude' | 'deepseek';
  model: string;
  api_key?: string;
}

const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  return user.id;
};

export const useAiConfig = () => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['aiConfig'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('ai_configurations')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: AiConfigFormValues) => {
      const userId = await getUserId();
      
      const dataToUpsert: Database['public']['Tables']['ai_configurations']['Insert'] = { 
        user_id: userId,
        provider: values.provider as AIProvider,
        model: values.model,
        updated_at: new Date().toISOString()
      };

      if (values.api_key && values.api_key.trim() !== '') {
        dataToUpsert.api_key = values.api_key;
      }

      const { data, error } = await supabase
        .from('ai_configurations')
        .upsert(dataToUpsert, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Configuração de IA salva com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['aiConfig'] });
    },
    onError: (error) => {
      toast.error('Erro ao salvar configuração: ' + error.message);
    }
  });

  return {
    config,
    isLoading,
    mutation,
  };
};
