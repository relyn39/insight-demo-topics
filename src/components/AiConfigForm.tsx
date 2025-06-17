
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { modelOptions, providerDescriptions, getDefaultModelForProvider } from '@/constants/aiProviders';
import { useAiConfig, type AiConfigFormValues } from '@/hooks/useAiConfig';

const aiConfigSchema = z.object({
  provider: z.enum(['openai', 'google', 'claude', 'deepseek']),
  model: z.string().min(1, 'O modelo é obrigatório.'),
  api_key: z.string().optional(),
});

export const AiConfigForm = () => {
  const { config, isLoading, mutation } = useAiConfig();

  const form = useForm<AiConfigFormValues>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      provider: 'google',
      model: 'gemini-2.0-flash-lite',
      api_key: '',
    },
  });

  useEffect(() => {
    if (config) {
      let defaultModel = '';
      const provider = config.provider as keyof typeof modelOptions;
      if (modelOptions[provider]) {
        defaultModel = modelOptions[provider][0].value;
      }

      form.reset({
        provider: provider,
        model: config.model || defaultModel,
        api_key: '', // Sempre manter o campo da chave em branco ao carregar
      });
    }
  }, [config, form]);

  const watchedProvider = form.watch('provider');

  const onSubmit = (data: AiConfigFormValues) => {
    mutation.mutate(data);
    if (mutation.isSuccess) {
      form.reset({ ...form.getValues(), api_key: '' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provedor</FormLabel>
              <Select
                onValueChange={(value: 'openai' | 'google' | 'claude' | 'deepseek') => {
                  field.onChange(value);
                  const defaultModel = getDefaultModelForProvider(value);
                  form.setValue('model', defaultModel, { shouldValidate: true });
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um provedor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                  <SelectItem value="deepseek">Deepseek</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                O provedor que será usado para a análise de IA.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um modelo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(modelOptions[watchedProvider] || []).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {providerDescriptions[watchedProvider]}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="api_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave de API (Opcional)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••••••••••••••" {...field} autoComplete="new-password" />
              </FormControl>
              <FormDescription>
                Preencha apenas se desejar atualizar sua chave de API.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending || isLoading}>
          {mutation.isPending ? 'Salvando...' : 'Salvar Configuração'}
        </Button>
      </form>
    </Form>
  );
};
