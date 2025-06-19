
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

const formSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  description: z.string().optional(),
  customer_name: z.string().optional(),
  interviewee_name: z.string().optional(),
  conversation_at: z.string().optional(),
});

type AddManualFeedbackFormValues = z.infer<typeof formSchema>;

export const AddManualFeedback = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<AddManualFeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      customer_name: '',
      interviewee_name: '',
      conversation_at: '',
    },
  });

  const updateLatestItemsFromFeedback = async (feedbackData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      console.log('Updating latest items for feedback:', feedbackData.title);
      
      // Buscar itens existentes para atualizar contagem
      const { data: existingItems } = await supabase
        .from('latest_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('title', feedbackData.title);

      if (existingItems && existingItems.length > 0) {
        // Atualizar item existente
        const existingItem = existingItems[0];
        const { error } = await supabase
          .from('latest_items')
          .update({
            count: existingItem.count + 1,
            updated_at: new Date().toISOString(),
            change_percentage: Math.floor(Math.random() * 20) - 10
          })
          .eq('id', existingItem.id);
          
        if (error) {
          console.error('Error updating existing latest_item:', error);
        } else {
          console.log('Updated existing latest item');
        }
      } else {
        // Criar novo item
        const { error } = await supabase
          .from('latest_items')
          .insert({
            user_id: user.id,
            title: feedbackData.title,
            count: 1,
            sentiment: 'neutral',
            change_percentage: Math.floor(Math.random() * 20) - 10,
            keywords: []
          });
          
        if (error) {
          console.error('Error creating new latest_item:', error);
        } else {
          console.log('Created new latest item');
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar latest_items:', error);
    }
  };

  const onSubmit = async (values: AddManualFeedbackFormValues) => {
    console.log('Submitting manual feedback:', values);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const feedbackData: Database['public']['Tables']['feedbacks']['Insert'] = {
        title: values.title,
        description: values.description || null,
        customer_name: values.customer_name || null,
        interviewee_name: values.interviewee_name || null,
        conversation_at: values.conversation_at ? new Date(values.conversation_at).toISOString() : null,
        user_id: user.id,
        source: 'manual',
        status: 'new',
      };

      console.log('Inserting feedback:', feedbackData);

      const { data, error } = await supabase.from('feedbacks').insert(feedbackData).select();

      if (error) {
        console.error('Error inserting feedback:', error);
        throw error;
      }

      console.log('Feedback inserted successfully:', data);

      // Atualizar latest_items
      await updateLatestItemsFromFeedback(feedbackData);

      toast({
        title: 'Sucesso!',
        description: 'Feedback adicionado manualmente.',
      });
      
      // Invalidar queries para atualizar as listas
      await queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      await queryClient.invalidateQueries({ queryKey: ['latest-items'] });
      await queryClient.invalidateQueries();
      
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Error in onSubmit:', error);
      toast({
        title: 'Erro ao adicionar feedback',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Resumo do feedback" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px]" placeholder="Detalhes do feedback (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Cliente (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Empresa Acme" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewee_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Entrevistado (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conversation_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e Hora da Conversa (opcional)</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Feedback'
          )}
        </Button>
      </form>
    </Form>
  );
};
