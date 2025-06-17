
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { AiConfigForm } from '@/components/AiConfigForm';

export const AiManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Provedor de IA</CardTitle>
        <CardDescription>
          Selecione o provedor, o modelo e forneça sua chave de API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Conecte seu provedor de IA</AlertTitle>
          <AlertDescription>
            Para usar a análise de IA, adicione sua chave de API do provedor (OpenAI ou Google) abaixo.
            Sua chave é armazenada de forma segura e usada apenas para as análises da sua conta. 
            Deixar o campo em branco manterá a chave existente.
          </AlertDescription>
        </Alert>
        <AiConfigForm />
      </CardContent>
    </Card>
  );
};
