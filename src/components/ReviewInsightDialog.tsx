
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Constants } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

const insightSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  action: z.string().optional(),
  type: z.enum(Constants.public.Enums.insight_type),
  severity: z.enum(Constants.public.Enums.insight_severity),
  tags: z.array(z.string()).optional(),
});

export type InsightFormData = z.infer<typeof insightSchema>;

interface ReviewInsightDialogProps {
  insight: InsightFormData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: InsightFormData) => void;
  isSaving: boolean;
}

const typeTranslations = {
  'trend': 'Tendência',
  'alert': 'Alerta',
  'opportunity': 'Oportunidade',
  'other': 'Outro'
};

const severityTranslations = {
  'info': 'Informação',
  'warning': 'Aviso',
  'success': 'Sucesso',
  'error': 'Erro'
};

export const ReviewInsightDialog: React.FC<ReviewInsightDialogProps> = ({
  insight,
  open,
  onOpenChange,
  onSave,
  isSaving,
}) => {
  const form = useForm<InsightFormData>({
    resolver: zodResolver(insightSchema),
    defaultValues: {
      tags: []
    }
  });

  const [newTag, setNewTag] = React.useState('');

  useEffect(() => {
    if (insight) {
      form.reset({
        ...insight,
        tags: insight.tags || []
      });
    }
  }, [insight, form]);

  const onSubmit = (data: InsightFormData) => {
    onSave(data);
  };

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues('tags') || [];
      if (!currentTags.includes(newTag.trim())) {
        form.setValue('tags', [...currentTags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Revisar e Aprovar Insight</DialogTitle>
          <DialogDescription>
            Edite os campos abaixo conforme necessário e clique em "Salvar Insight" para aprovar.
          </DialogDescription>
        </DialogHeader>
        {insight && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Melhoria na exportação de dados" {...field} />
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
                      <Textarea
                        placeholder="Ex: Múltiplos usuários relatam dificuldades..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Constants.public.Enums.insight_type.map(type => (
                            <SelectItem key={type} value={type}>
                              {typeTranslations[type as keyof typeof typeTranslations]}
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
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a severidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Constants.public.Enums.insight_severity.map(sev => (
                            <SelectItem key={sev} value={sev}>
                              {severityTranslations[sev as keyof typeof severityTranslations]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ação Sugerida</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Priorizar reformulação do recurso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <FormLabel>Palavras-chave / Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.watch('tags') || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Insight
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
