// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import Dashboard from '@/components/Dashboard';
import { CriminalsTable } from '@/components/CriminalsTable';
import { CrimeHeatmap } from '@/components/CrimeHeatmap';
import { CrimeInsightsPanel } from '@/components/CrimeInsightsPanel';
import { CriminalNetworkGraph } from '@/components/CriminalNetworkGraph';
import { LiveFeedPanel } from '@/components/LiveFeedPanel';
import { CriminalDataEntry } from "@/components/CriminalDataEntry";
import { CriminalReport } from "@/components/CriminalReport";
import { SystemSettings } from "@/components/SystemSettings";
import Chatbot from './components/Chatbot';
import { Cases } from './components/Cases'; // Cases component imported

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

// Component to sync sidebar state with routing
function RouteSync({ setActiveView }: { setActiveView: (view: string) => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract view from pathname and set active view
    const path = location.pathname.substring(1); // Remove leading slash
    if (path) {
      setActiveView(path);
    } else {
      setActiveView('dashboard');
    }
  }, [location.pathname, setActiveView]);

  return null;
}

// Main App Content with Routing
function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [chatbotInitialMessage, setChatbotInitialMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [criminalDataForAnalysis, setCriminalDataForAnalysis] = useState<CriminalRecord | null>(null);

  const handleAskAI = (criminalData: CriminalRecord) => {
    setChatbotInitialMessage(`Analyze criminal: ${criminalData.name}`);
    setCriminalDataForAnalysis(criminalData);
    setShowChatbot(true);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    // Navigate to the corresponding route
    if (view === 'dashboard') {
      window.location.href = '/';
    } else {
      window.location.href = `/${view}`;
    }
  };

  return (
    <SidebarProvider>
      <RouteSync setActiveView={setActiveView} />
      
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeView={activeView} setActiveView={handleViewChange} />
        
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route 
              path="/criminals" 
              element={<CriminalsTable onAskAI={handleAskAI} />} 
            />
            <Route path="/maps" element={<CrimeHeatmap />} />
            <Route path="/insights" element={<CrimeInsightsPanel />} />
            <Route path="/network" element={<CriminalNetworkGraph />} />
            <Route path="/criminal-network" element={<CriminalNetworkGraph />} />
            <Route path="/live" element={<LiveFeedPanel />} />
            <Route path="/data-entry" element={<CriminalDataEntry />} />
            <Route path="/reports" element={<CriminalReport />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/cases" element={<Cases />} /> {/* Changed to use Cases component */}
          </Routes>
        </div>
        
        {/* Add Chatbot here */}
        {showChatbot && (
          <Chatbot 
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

// Main App wrapper with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;