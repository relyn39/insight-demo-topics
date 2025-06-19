
import React from 'react';
import { IntegrationsManager } from '@/components/IntegrationsManager';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const SettingsIntegrations = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold">Gerenciar Integrações</h1>
        </div>
        <IntegrationsManager />
      </main>
    </SidebarProvider>
  );
};

export default SettingsIntegrations;
