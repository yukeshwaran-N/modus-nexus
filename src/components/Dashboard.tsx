import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { CriminalsTable } from '@/components/CriminalsTable';
import { CriminalNetworkGraph } from '@/components/CriminalNetworkGraph';
import { CrimeHeatmap } from '@/components/CrimeHeatmap';
import { LiveFeedPanel } from '@/components/LiveFeedPanel';
import { CrimeInsightsPanel } from '@/components/CrimeInsightsPanel';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeView) {
      case 'criminals':
        return <CriminalsTable />;
      case 'maps':
        return <CrimeHeatmap />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-2">
              <CriminalNetworkGraph />
            </div>
            <div className="space-y-6">
              <CrimeInsightsPanel />
              <LiveFeedPanel />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}