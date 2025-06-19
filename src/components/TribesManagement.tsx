
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, UserPlus, Building, Edit, Trash2 } from 'lucide-react';
import { AddUserDialog } from './AddUserDialog';
import { useTribes } from '@/hooks/useTribes';
import { Tribe, Squad, CreateTribeData, CreateSquadData } from '@/types/tribes';

export const TribesManagement = () => {
  const [showAddTribeDialog, setShowAddTribeDialog] = useState(false);
  const [showAddSquadDialog, setShowAddSquadDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [editingTribe, setEditingTribe] = useState<Tribe | null>(null);
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null);
  const [selectedTribeForSquad, setSelectedTribeForSquad] = useState<string>('');

  const { tribes, squads, isLoading, createTribe, createSquad, updateTribe, updateSquad, deleteTribe, deleteSquad } = useTribes();
  const [tribeForm, setTribeForm] = useState<CreateTribeData>({ name: '', description: '' });
  const [squadForm, setSquadForm] = useState<CreateSquadData>({ name: '', description: '', tribe_id: '', jira_board_url: '' });

  const handleCreateTribe = async () => {
    if (!tribeForm.name) return;
    await createTribe.mutateAsync(tribeForm);
    setTribeForm({ name: '', description: '' });
    setShowAddTribeDialog(false);
  };

  const handleCreateSquad = async () => {
    if (!squadForm.name || !squadForm.tribe_id) return;
    await createSquad.mutateAsync(squadForm);
    setSquadForm({ name: '', description: '', tribe_id: '', jira_board_url: '' });
    setShowAddSquadDialog(false);
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
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="tribes">Tribos</TabsTrigger>
          <TabsTrigger value="squads">Squads</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gerenciar Usuários
                </CardTitle>
                <CardDescription>
                  Adicione e gerencie usuários do sistema
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddUserDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>A lista de usuários será implementada em breve.</p>
                <p className="text-sm">Por enquanto, você pode adicionar novos usuários usando o botão acima.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tribes" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="squads" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <AddUserDialog 
        open={showAddUserDialog} 
        onOpenChange={setShowAddUserDialog}
      />
      
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

export default TribesManagement;
