import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import { CriminalsTable } from '@/components/CriminalsTable';
import { CrimeHeatmap } from '@/components/CrimeHeatmap';
import { CrimeInsightsPanel } from '@/components/CrimeInsightsPanel';
import { CriminalNetworkGraph } from '@/components/CriminalNetworkGraph';
import { LiveFeedPanel } from '@/components/LiveFeedPanel';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'criminals':
        return <CriminalsTable />;
      case 'maps':
        return <CrimeHeatmap />;
      case 'insights':
        return <CrimeInsightsPanel />;
      case 'network':
        return <CriminalNetworkGraph />;
      case 'live':
        return <LiveFeedPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;