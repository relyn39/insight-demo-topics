
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, Users, Building } from 'lucide-react';
import { useTribes } from '@/hooks/useTribes';
import { CreateTribeData, CreateSquadData } from '@/types/tribes';

export const TribesManagement = () => {
  const { tribes, squads, isLoading, createTribe, createSquad, updateTribe, updateSquad, deleteTribe, deleteSquad } = useTribes();
  const [showTribeDialog, setShowTribeDialog] = useState(false);
  const [showSquadDialog, setShowSquadDialog] = useState(false);
  const [editingTribe, setEditingTribe] = useState<any>(null);
  const [editingSquad, setEditingSquad] = useState<any>(null);

  const [tribeForm, setTribeForm] = useState<CreateTribeData>({ name: '', description: '' });
  const [squadForm, setSquadForm] = useState<CreateSquadData>({ name: '', description: '', tribe_id: '', jira_board_url: '' });

  const handleCreateTribe = async () => {
    if (!tribeForm.name) return;
    await createTribe.mutateAsync(tribeForm);
    setTribeForm({ name: '', description: '' });
    setShowTribeDialog(false);
  };

  const handleCreateSquad = async () => {
    if (!squadForm.name || !squadForm.tribe_id) return;
    await createSquad.mutateAsync(squadForm);
    setSquadForm({ name: '', description: '', tribe_id: '', jira_board_url: '' });
    setShowSquadDialog(false);
  };

  const handleUpdateTribe = async () => {
    if (!editingTribe || !tribeForm.name) return;
    await updateTribe.mutateAsync({ id: editingTribe.id, data: tribeForm });
    setEditingTribe(null);
    setTribeForm({ name: '', description: '' });
  };

  const handleUpdateSquad = async () => {
    if (!editingSquad || !squadForm.name || !squadForm.tribe_id) return;
    await updateSquad.mutateAsync({ id: editingSquad.id, data: squadForm });
    setEditingSquad(null);
    setSquadForm({ name: '', description: '', tribe_id: '', jira_board_url: '' });
  };

  const startEditTribe = (tribe: any) => {
    setEditingTribe(tribe);
    setTribeForm({ name: tribe.name, description: tribe.description || '' });
  };

  const startEditSquad = (squad: any) => {
    setEditingSquad(squad);
    setSquadForm({ 
      name: squad.name, 
      description: squad.description || '', 
      tribe_id: squad.tribe_id,
      jira_board_url: squad.jira_board_url || ''
    });
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Tribos e Squads</h2>
        <div className="space-x-2">
          <Dialog open={showTribeDialog} onOpenChange={setShowTribeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Building className="mr-2 h-4 w-4" />
                Nova Tribo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Tribo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tribe-name">Nome</Label>
                  <Input
                    id="tribe-name"
                    value={tribeForm.name}
                    onChange={(e) => setTribeForm({ ...tribeForm, name: e.target.value })}
                    placeholder="Nome da tribo"
                  />
                </div>
                <div>
                  <Label htmlFor="tribe-description">Descrição</Label>
                  <Textarea
                    id="tribe-description"
                    value={tribeForm.description}
                    onChange={(e) => setTribeForm({ ...tribeForm, description: e.target.value })}
                    placeholder="Descrição da tribo"
                  />
                </div>
                <Button onClick={handleCreateTribe} disabled={createTribe.isPending}>
                  {createTribe.isPending ? 'Criando...' : 'Criar Tribo'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showSquadDialog} onOpenChange={setShowSquadDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Nova Squad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Squad</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="squad-tribe">Tribo</Label>
                  <Select value={squadForm.tribe_id} onValueChange={(value) => setSquadForm({ ...squadForm, tribe_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tribo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tribes.map((tribe) => (
                        <SelectItem key={tribe.id} value={tribe.id}>
                          {tribe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="squad-name">Nome</Label>
                  <Input
                    id="squad-name"
                    value={squadForm.name}
                    onChange={(e) => setSquadForm({ ...squadForm, name: e.target.value })}
                    placeholder="Nome da squad"
                  />
                </div>
                <div>
                  <Label htmlFor="squad-description">Descrição</Label>
                  <Textarea
                    id="squad-description"
                    value={squadForm.description}
                    onChange={(e) => setSquadForm({ ...squadForm, description: e.target.value })}
                    placeholder="Descrição da squad"
                  />
                </div>
                <div>
                  <Label htmlFor="squad-jira">URL do Quadro Jira</Label>
                  <Input
                    id="squad-jira"
                    value={squadForm.jira_board_url}
                    onChange={(e) => setSquadForm({ ...squadForm, jira_board_url: e.target.value })}
                    placeholder="https://pltsci.atlassian.net/..."
                  />
                </div>
                <Button onClick={handleCreateSquad} disabled={createSquad.isPending}>
                  {createSquad.isPending ? 'Criando...' : 'Criar Squad'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Tribos ({tribes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tribes.map((tribe) => (
                <div key={tribe.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{tribe.name}</h4>
                    {tribe.description && <p className="text-sm text-muted-foreground">{tribe.description}</p>}
                  </div>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEditTribe(tribe)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteTribe.mutate(tribe.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Squads ({squads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {squads.map((squad) => (
                <div key={squad.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{squad.name}</h4>
                    <p className="text-xs text-muted-foreground">{squad.tribe?.name}</p>
                    {squad.description && <p className="text-sm text-muted-foreground">{squad.description}</p>}
                  </div>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEditSquad(squad)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteSquad.mutate(squad.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Tribe Dialog */}
      <Dialog open={!!editingTribe} onOpenChange={() => setEditingTribe(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tribo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tribe-name">Nome</Label>
              <Input
                id="edit-tribe-name"
                value={tribeForm.name}
                onChange={(e) => setTribeForm({ ...tribeForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-tribe-description">Descrição</Label>
              <Textarea
                id="edit-tribe-description"
                value={tribeForm.description}
                onChange={(e) => setTribeForm({ ...tribeForm, description: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdateTribe} disabled={updateTribe.isPending}>
              {updateTribe.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Squad Dialog */}
      <Dialog open={!!editingSquad} onOpenChange={() => setEditingSquad(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Squad</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-squad-tribe">Tribo</Label>
              <Select value={squadForm.tribe_id} onValueChange={(value) => setSquadForm({ ...squadForm, tribe_id: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tribes.map((tribe) => (
                    <SelectItem key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-squad-name">Nome</Label>
              <Input
                id="edit-squad-name"
                value={squadForm.name}
                onChange={(e) => setSquadForm({ ...squadForm, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-squad-description">Descrição</Label>
              <Textarea
                id="edit-squad-description"
                value={squadForm.description}
                onChange={(e) => setSquadForm({ ...squadForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-squad-jira">URL do Quadro Jira</Label>
              <Input
                id="edit-squad-jira"
                value={squadForm.jira_board_url}
                onChange={(e) => setSquadForm({ ...squadForm, jira_board_url: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdateSquad} disabled={updateSquad.isPending}>
              {updateSquad.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
