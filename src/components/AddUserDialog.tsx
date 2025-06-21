
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const addUserSchema = z.object({
  full_name: z.string().min(1, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (values: z.infer<typeof addUserSchema>) => {
      console.log('🔧 [AUDIT] Starting user creation process:', {
        email: values.email,
        name: values.full_name,
        timestamp: new Date().toISOString()
      });
      
      // Primeiro, obter o usuário atual para ter contexto de admin
      const { data: { user: currentUser }, error: currentUserError } = await supabase.auth.getUser();
      console.log('🔧 [AUDIT] Current user context:', { 
        currentUserId: currentUser?.id, 
        currentUserEmail: currentUser?.email,
        error: currentUserError 
      });

      // Usar a API admin do Supabase para criar o usuário
      const { data, error } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        user_metadata: {
          full_name: values.full_name,
        },
        email_confirm: true // Auto-confirmar email para admin
      });

      if (error) {
        console.error('🔧 [AUDIT] Admin createUser error:', error);
        throw error;
      }

      console.log('🔧 [AUDIT] Admin user created successfully:', {
        userId: data.user?.id,
        email: data.user?.email,
        metadata: data.user?.user_metadata
      });

      // Inserir diretamente na tabela profiles usando service role
      if (data.user) {
        console.log('🔧 [AUDIT] Attempting to insert profile for user:', data.user.id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: values.email,
            full_name: values.full_name
          })
          .select()
          .single();

        if (profileError) {
          console.error('🔧 [AUDIT] Profile creation error:', profileError);
          // Se falhar, tentar com upsert
          const { data: upsertData, error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: values.email,
              full_name: values.full_name
            })
            .select()
            .single();
          
          if (upsertError) {
            console.error('🔧 [AUDIT] Profile upsert also failed:', upsertError);
            throw upsertError;
          } else {
            console.log('🔧 [AUDIT] Profile created via upsert:', upsertData);
          }
        } else {
          console.log('🔧 [AUDIT] Profile created successfully:', profileData);
        }
      }

      return data;
    },
    onSuccess: () => {
      console.log('🔧 [AUDIT] User creation mutation succeeded');
      toast.success('Usuário criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('🔧 [AUDIT] User creation mutation failed:', error);
      toast.error(`Erro ao criar usuário: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof addUserSchema>) => {
    console.log('🔧 [AUDIT] Form submitted with values:', values);
    addUserMutation.mutate(values);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo do usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addUserMutation.isPending}>
                {addUserMutation.isPending ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
