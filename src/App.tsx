// src/App.tsx
import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import { CriminalsTable } from '@/components/CriminalsTable';
import { CrimeHeatmap } from '@/components/CrimeHeatmap';
import { CrimeInsightsPanel } from '@/components/CrimeInsightsPanel';
import { CriminalNetworkGraph } from '@/components/CriminalNetworkGraph';
import { LiveFeedPanel } from '@/components/LiveFeedPanel';
import { CriminalDataEntry } from "@/components/CriminalDataEntry";
import Chatbot from './components/Chatbot';

// Define the CriminalRecord interface
interface CriminalRecord {
  id: string;
  case_id: string;
  name: string;
  age?: number;
  gender?: string;
  phone_number?: string;
  email?: string;
  crime_type: string;
  last_location: string;
  current_status?: string;
  risk_level?: string;
  total_cases?: number;
  arrest_date?: string;
  modus_operandi?: string;
  tools_used?: string;
  associates?: string;
  address?: string;
  [key: string]: any;
}

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [chatbotInitialMessage, setChatbotInitialMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [criminalDataForAnalysis, setCriminalDataForAnalysis] = useState<CriminalRecord | null>(null);

  const handleAskAI = (criminalData: CriminalRecord) => {
    setChatbotInitialMessage(`Analyze criminal: ${criminalData.name}`);
    setCriminalDataForAnalysis(criminalData);
    setShowChatbot(true);
  };

  const renderContent = () => {
    switch (activeView) {
      case "criminals":
        return <CriminalsTable onAskAI={handleAskAI} />;
      case "maps":
        return <CrimeHeatmap />;
      case "insights":
        return <CrimeInsightsPanel />;
      case "network":
        return <CriminalNetworkGraph />;
      case "live":
        return <LiveFeedPanel />;
      case "data-entry":
        return <CriminalDataEntry />;
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
        
        {/* Add Chatbot here */}
        {showChatbot && (
          <Chatbot 
            setActiveView={setActiveView}
            initialMessage={chatbotInitialMessage}
            criminalData={criminalDataForAnalysis}
            onClose={() => {
              setShowChatbot(false);
              setCriminalDataForAnalysis(null);
            }}
          />
        )}
      </div>
    </SidebarProvider>
  );
}

export default App;