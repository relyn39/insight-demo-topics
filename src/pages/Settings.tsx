
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Database, BrainCircuit, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const isMainSettings = location.pathname === '/settings';

  if (!isMainSettings) {
    return <Outlet />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Configurações</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/settings/integrations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Integrações
              </CardTitle>
              <CardDescription>
                Configure suas integrações com Jira, Notion, Zoho e outras ferramentas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie conexões e sincronização de dados
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/settings/ai">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                Inteligência Artificial
              </CardTitle>
              <CardDescription>
                Configure os provedores de IA para análise de feedbacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                OpenAI, Google, Claude e outros modelos
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/settings/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Usuários
              </CardTitle>
              <CardDescription>
                Gerencie usuários, tribos e squads da organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Controle de acesso e organização
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
