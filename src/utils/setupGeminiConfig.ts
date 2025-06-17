
import { supabase } from '@/integrations/supabase/client';

export const setupGeminiConfig = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Usuário não autenticado, pulando configuração automática');
      return;
    }

    // Verificar se já existe uma configuração
    const { data: existingConfig } = await supabase
      .from('ai_configurations')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingConfig) {
      console.log('Configuração de IA já existe, não sobrescrevendo');
      return;
    }

    // Configurar automaticamente com Gemini 2.0 Flash-Lite
    const { error } = await supabase
      .from('ai_configurations')
      .insert({
        user_id: user.id,
        provider: 'google',
        model: 'gemini-2.0-flash-lite',
        api_key: 'AIzaSyDDUs_XA0zOgaDgAMzMqxqXtmWy-XBpxmc',
        is_active: true
      });

    if (error) {
      console.error('Erro ao configurar automaticamente:', error);
    } else {
      console.log('Gemini 2.0 Flash-Lite configurado automaticamente');
    }
  } catch (error) {
    console.error('Erro na configuração automática:', error);
  }
};
