
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useTribes } from '@/hooks/useTribes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OpportunityData {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'próximo' | 'em_andamento' | 'concluído';
  tribe_id?: string;
  squad_id?: string;
}

interface EditOpportunityDialogProps {
  opportunity: OpportunityData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'próximo', label: 'Próximo' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluído', label: 'Concluído' },
];

export const EditOpportunityDialog = ({ opportunity, open, onOpenChange }: EditOpportunityDialogProps) => {
  const { tribes, squads } = useTribes();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'backlog' as OpportunityData['status'],
    tribe_id: '',
    squad_id: '',
  });

  const [isCreatingJiraEpic, setIsCreatingJiraEpic] = useState(false);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || '',
        description: opportunity.description || '',
        status: opportunity.status || 'backlog',
        tribe_id: opportunity.tribe_id || 'none',
        squad_id: opportunity.squad_id || 'none',
      });
    }
  }, [opportunity]);

  const updateOpportunityMutation = useMutation({
    mutationFn: async (data: Partial<OpportunityData>) => {
      if (!opportunity) throw new Error('Oportunidade não encontrada');
      
      const { error } = await supabase
        .from('product_opportunities')
        .update(data)
        .eq('id', opportunity.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Sucesso', description: 'Oportunidade atualizada com sucesso' });
      queryClient.invalidateQueries({ queryKey: ['product_opportunities'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const handleSave = () => {
    updateOpportunityMutation.mutate({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      tribe_id: formData.tribe_id === 'none' ? null : formData.tribe_id,
      squad_id: formData.squad_id === 'none' ? null : formData.squad_id,
    });
  };

  const handleCreateJiraEpic = () => {
    if (!formData.title) {
      toast({ title: 'Erro', description: 'Título é obrigatório para criar épico no Jira', variant: 'destructive' });
      return;
    }

    setIsCreatingJiraEpic(true);
    
    // Construir URL do Jira com dados preenchidos
    const jiraBaseUrl = 'https://pltsci.atlassian.net';
    const createIssueUrl = `${jiraBaseUrl}/secure/CreateIssue.jspa`;
    
    // Parâmetros para pré-preencher o formulário do Jira
    const params = new URLSearchParams({
      issuetype: '10000', // Epic issue type ID (pode variar)
      summary: formData.title,
      description: formData.description || '',
    });

    // Abrir em nova aba
    window.open(`${createIssueUrl}?${params.toString()}`, '_blank');
    
    setIsCreatingJiraEpic(false);
    
    toast({ 
      title: 'Redirecionando para o Jira', 
      description: 'Uma nova aba foi aberta com os dados da oportunidade preenchidos.' 
    });
  };

  const filteredSquads = squads.filter(squad => 
    !formData.tribe_id || formData.tribe_id === 'none' || squad.tribe_id === formData.tribe_id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Oportunidade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título da oportunidade"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da oportunidade"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tribe">Tribo</Label>
              <Select 
                value={formData.tribe_id} 
                onValueChange={(value) => setFormData({ ...formData, tribe_id: value, squad_id: 'none' })}
              >
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
              <Label htmlFor="squad">Squad</Label>
              <Select 
                value={formData.squad_id} 
                onValueChange={(value) => setFormData({ ...formData, squad_id: value })}
                disabled={!formData.tribe_id || formData.tribe_id === 'none'}
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

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCreateJiraEpic}
              disabled={isCreatingJiraEpic || !formData.title}
            >
              {isCreatingJiraEpic ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Transformar em Épico (Jira)
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={updateOpportunityMutation.isPending}>
                {updateOpportunityMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
