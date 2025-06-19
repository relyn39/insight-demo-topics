
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTribes } from '@/hooks/useTribes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, PlusCircle } from 'lucide-react';

const opportunitySchema = z.object({
  title: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().optional(),
  tribe_id: z.string().optional(),
  squad_id: z.string().optional(),
});

type OpportunityFormValues = z.infer<typeof opportunitySchema>;

const AddOpportunityDialog = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { tribes, squads } = useTribes();

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: '',
      description: '',
      tribe_id: '',
      squad_id: '',
    },
  });

  const createOpportunityMutation = useMutation({
    mutationFn: async (values: OpportunityFormValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');
      
      const { error } = await supabase.from('product_opportunities').insert({
        title: values.title,
        description: values.description || null,
        user_id: user.id,
        status: 'backlog',
        tribe_id: values.tribe_id === 'none' ? null : values.tribe_id || null,
        squad_id: values.squad_id === 'none' ? null : values.squad_id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Sucesso!", description: "Oportunidade criada e adicionada ao backlog." });
      queryClient.invalidateQueries({ queryKey: ['product_opportunities'] });
      setOpen(false);
      form.reset();
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao criar oportunidade", description: err.message, variant: 'destructive' });
    },
  });

  const onSubmit = (values: OpportunityFormValues) => {
    createOpportunityMutation.mutate(values);
  };

  const selectedTribeId = form.watch('tribe_id');
  const filteredSquads = squads.filter(squad => 
    !selectedTribeId || selectedTribeId === 'none' || squad.tribe_id === selectedTribeId
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Oportunidade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Oportunidade</DialogTitle>
          <DialogDescription>
            Adicione uma nova oportunidade ao seu roadmap. Ela será inserida na coluna "Backlog".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Integrar com calendário" {...field} />
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
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a oportunidade em mais detalhes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tribe_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tribo (opcional)</FormLabel>
                    <Select value={field.value} onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('squad_id', '');
                    }}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma tribo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma tribo</SelectItem>
                        {tribes.map((tribe) => (
                          <SelectItem key={tribe.id} value={tribe.id}>
                            {tribe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="squad_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Squad (opcional)</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                      disabled={!selectedTribeId || selectedTribeId === 'none'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma squad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma squad</SelectItem>
                        {filteredSquads.map((squad) => (
                          <SelectItem key={squad.id} value={squad.id}>
                            {squad.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createOpportunityMutation.isPending}>
                {createOpportunityMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Oportunidade
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOpportunityDialog;
