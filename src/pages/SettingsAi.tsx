
import React from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AiManager } from '@/components/AiManager';

const SettingsAi = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/78ca95af-4763-4050-8671-a00f99ef9220.png" alt="Feedback-Hub Logo" className="h-8 w-8 object-contain block dark:hidden" />
                <img src="/lovable-uploads/a29f8301-8f7b-48e8-be65-36b51d7c7c66.png" alt="Feedback-Hub Logo" className="h-8 w-8 object-contain hidden dark:block" />
                <span className="text-lg font-semibold">Configurações</span>
              </div>
            </div>
            <ThemeToggle />
          </header>
          
          <main className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Inteligência Artificial</h2>
                <p className="text-muted-foreground">
                  Configure seu provedor de LLM para análise automática de feedbacks.
                </p>
              </div>
              
              <AiManager />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SettingsAi;
