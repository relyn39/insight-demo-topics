
import React from 'react';
import { AiManager } from '@/components/AiManager';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

const SettingsAi = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <SidebarTrigger />
          <h1 className="text-3xl font-bold">Configurações de IA</h1>
        </div>
        <AiManager />
      </main>
    </SidebarProvider>
  );
};

export default SettingsAi;
