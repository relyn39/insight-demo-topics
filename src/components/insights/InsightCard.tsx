
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTribes } from '@/hooks/useTribes';
import { Insight } from '@/types/insights';
import { EditInsightTags } from './EditInsightTags';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Pencil, TrendingUp, AlertCircle, Target, Lightbulb, X, Users } from 'lucide-react';

const iconMap = {
  trend: TrendingUp,
  alert: AlertCircle,
  opportunity: Target,
  other: Lightbulb,
};

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard = ({ insight }: InsightCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateOpportunityDialog, setShowCreateOpportunityDialog] = useState(false);
  const [selectedTribeId, setSelectedTribeId] = useState('');
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { tribes, squads } = useTribes();

  const updateInsightMutation = useMutation({
    mutationFn: async ({ insightId, tags }: { insightId: string; tags: string[] }) => {
      const { data, error } = await supabase.from('insights').update({ tags }).eq('id', insightId).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
      toast({ title: 'Sucesso!', description: 'As tags foram atualizadas.' });
      setIsEditing(false);
    },
    onError: (err: Error) => {
      toast({ title: 'Erro ao atualizar tags', description: err.message, variant: 'destructive' });
    },
  });

  const rejectInsightMutation = useMutation({
    mutationFn: async (insightId: string) => {
      const { error } = await supabase
        .from('insights')
        .update({ status: 'rejected' })
        .eq('id', insightId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Insight rejeitado', description: 'O insight foi removido das sugestões.' });
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro ao rejeitar insight', description: err.message, variant: 'destructive' });
    },
  });

  const createOpportunityMutation = useMutation({
    mutationFn: async ({ title, description, tribeId, squadId }: { 
      title: string; 
      description: string | null;
      tribeId?: string;
      squadId?: string;
    }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado.");
        
        // Criar oportunidade
        const { error: opportunityError } = await supabase.from('product_opportunities').insert({
          title: title,
          description: description,
          user_id: user.id,
          status: 'backlog',
          tribe_id: tribeId || null,
          squad_id: squadId || null,
        });
        if (opportunityError) throw opportunityError;

        // Marcar insight como convertido
        const { error: insightError } = await supabase
          .from('insights')
          .update({ status: 'converted' })
          .eq('id', insight.id);
        if (insightError) throw insightError;
        
        return title;
    },
    onSuccess: (title) => {
        toast({ title: "Oportunidade Criada!", description: `"${title}" foi adicionado ao seu roadmap.` });
        queryClient.invalidateQueries({ queryKey: ['product_opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
        setShowCreateOpportunityDialog(false);
        setSelectedTribeId('');
        setSelectedSquadId('');
    },
    onError: (err: Error) => {
        toast({ title: "Erro ao criar oportunidade", description: err.message, variant: 'destructive' });
    },
  });

  const handleSaveTags = (tagInputValue: string) => {
    const tags = tagInputValue.split(',').map((t) => t.trim()).filter(Boolean);
    updateInsightMutation.mutate({ insightId: insight.id, tags });
  };

  const handleCreateOpportunity = () => {
    createOpportunityMutation.mutate({
      title: insight.title,
      description: insight.description,
      tribeId: selectedTribeId,
      squadId: selectedSquadId,
    });
  };

  const filteredSquads = squads.filter(squad => 
    !selectedTribeId || squad.tribe_id === selectedTribeId
  );
  
  const Icon = iconMap[insight.type] || Lightbulb;
  const severityColors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300',
    warning: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
  };

  return (
    <>
      <div className={`p-4 rounded-lg border ${severityColors[insight.severity]}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
              <p className="text-sm opacity-90 mb-2">{insight.description}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => rejectInsightMutation.mutate(insight.id)}
            disabled={rejectInsightMutation.isPending}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isEditing ? (
          <EditInsightTags
            initialValue={insight.tags?.join(', ') || ''}
            onSave={handleSaveTags}
            onCancel={() => setIsEditing(false)}
            isSaving={updateInsightMutation.isPending}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {insight.tags && insight.tags.length > 0 ? (
              insight.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-background/50">
                  {tag}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">Sem tags</p>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
              <span className="sr-only">Editar tags</span>
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5 dark:border-white/10">
          {insight.action && (
              <span className="text-xs text-muted-foreground italic max-w-[50%]">{insight.action}</span>
          )}
          <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateOpportunityDialog(true)}
              disabled={createOpportunityMutation.isPending}
              className="ml-auto"
          >
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Oportunidade
          </Button>
        </div>
      </div>

      <Dialog open={showCreateOpportunityDialog} onOpenChange={setShowCreateOpportunityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Criar Oportunidade
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <p className="text-sm text-muted-foreground mt-1">{insight.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tribe-select">Tribo (opcional)</Label>
                <Select value={selectedTribeId} onValueChange={(value) => {
                  setSelectedTribeId(value);
                  setSelectedSquadId(''); // Reset squad when tribe changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma tribo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma tribo</SelectItem>
                    {tribes.map((tribe) => (
                      <SelectItem key={tribe.id} value={tribe.id}>
                        {tribe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="squad-select">Squad (opcional)</Label>
                <Select 
                  value={selectedSquadId} 
                  onValueChange={setSelectedSquadId}
                  disabled={!selectedTribeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma squad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma squad</SelectItem>
                    {filteredSquads.map((squad) => (
                      <SelectItem key={squad.id} value={squad.id}>
                        {squad.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateOpportunityDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateOpportunity} disabled={createOpportunityMutation.isPending}>
                {createOpportunityMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Criar Oportunidade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
