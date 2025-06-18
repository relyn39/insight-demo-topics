
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTribes } from '@/hooks/useTribes';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Users } from 'lucide-react';

interface CreateOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insightTitle: string;
  insightDescription: string | null;
  insightId: string;
}

export const CreateOpportunityDialog = ({ 
  open, 
  onOpenChange, 
  insightTitle, 
  insightDescription, 
  insightId 
}: CreateOpportunityDialogProps) => {
  const [selectedTribeId, setSelectedTribeId] = useState('');
  const [selectedSquadId, setSelectedSquadId] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { tribes, squads } = useTribes();

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
          .eq('id', insightId);
        if (insightError) throw insightError;
        
        return title;
    },
    onSuccess: (title) => {
        toast({ title: "Oportunidade Criada!", description: `"${title}" foi adicionado ao seu roadmap.` });
        queryClient.invalidateQueries({ queryKey: ['product_opportunities'] });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
        queryClient.invalidateQueries({ queryKey: ['insights-as-topics'] });
        onOpenChange(false);
        setSelectedTribeId('');
        setSelectedSquadId('');
    },
    onError: (err: Error) => {
        toast({ title: "Erro ao criar oportunidade", description: err.message, variant: 'destructive' });
    },
  });

  const handleCreateOpportunity = () => {
    createOpportunityMutation.mutate({
      title: insightTitle,
      description: insightDescription,
      tribeId: selectedTribeId === 'none' ? '' : selectedTribeId,
      squadId: selectedSquadId === 'none' ? '' : selectedSquadId,
    });
  };

  const filteredSquads = squads.filter(squad => 
    !selectedTribeId || selectedTribeId === 'none' || squad.tribe_id === selectedTribeId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <p className="text-sm text-muted-foreground mt-1">{insightTitle}</p>
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
                  <SelectItem value="none">Nenhuma tribo</SelectItem>
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
                disabled={!selectedTribeId || selectedTribeId === 'none'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma squad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma squad</SelectItem>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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
  );
};
