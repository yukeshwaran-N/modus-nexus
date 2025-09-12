// File: src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import { Cases } from './components/Cases';
import { SetupWizard } from '@/components/SetupWizard';
import { EncryptionTest } from '@/components/EncryptionTest';
import { AuthProvider, useAuth } from './context/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import PoliceOfficerAdmin from './components/PoliceOfficerAdmin';
import LoadingSpinner from './components/LoadingSpinner';
import { useEffect, useState } from 'react';

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
  [key: string]: string | number | undefined;
}

// Extend Window interface for encryption key
declare global {
  interface Window {
    ENCRYPTION_KEY: string;
  }
}

// Component to sync sidebar state with routing
function RouteSync({ setActiveView }: { setActiveView: (view: string) => void }) {
  const location = window.location;
  const navigate = useNavigate();

  useEffect(() => {
    // Extract view from pathname and set active view
    const path = location.pathname.substring(1);
    if (path) {
      setActiveView(path);
    } else {
      setActiveView('dashboard');
    }
  }, [location.pathname, setActiveView, navigate]);

  return null;
}

// Main App Content with Routing
function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [chatbotInitialMessage, setChatbotInitialMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [criminalDataForAnalysis, setCriminalDataForAnalysis] = useState<CriminalRecord | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();

  // Set encryption key for browser environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use Vite environment variable first (most secure)
      if (import.meta.env.VITE_ENCRYPTION_KEY) {
        window.ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
        console.log('Encryption key loaded from Vite environment');
        return;
      }
      
      // Use global variable (set by Vite config)
      if (typeof globalThis !== 'undefined' && (globalThis as any).ENCRYPTION_KEY) {
        window.ENCRYPTION_KEY = (globalThis as any).ENCRYPTION_KEY;
        console.log('Encryption key loaded from global variable');
        return;
      }
      
      // Fallback to meta tag
      const metaKey = document.querySelector('meta[name="encryption-key"]');
      if (metaKey) {
        const key = metaKey.getAttribute('content');
        if (key) {
          window.ENCRYPTION_KEY = key;
          console.log('Encryption key loaded from meta tag');
          return;
        }
      }
      
      // Final fallback for development
      window.ENCRYPTION_KEY = 'dev-encryption-key-32-chars-long!';
      console.log('Using development fallback encryption key');
    }
  }, []);

  const handleAskAI = (criminalData: CriminalRecord) => {
    setChatbotInitialMessage(`Analyze criminal: ${criminalData.name}`);
    setCriminalDataForAnalysis(criminalData);
    setShowChatbot(true);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${view}`);
    }
  };

  // Calculate main content margin based on sidebar state
  const mainContentMargin = isMobile 
    ? "ml-0" 
    : isSidebarCollapsed 
      ? "ml-20" 
      : "ml-64";

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return <LoadingSpinner />;
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Show main app if authenticated
  return (
    <SidebarProvider>
      <RouteSync setActiveView={setActiveView} />
      
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeView={activeView} 
          setActiveView={handleViewChange}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobile={isMobile}
          setIsMobile={setIsMobile}
        />
        
        {/* Main content with dynamic margin */}
        <div className={`flex-1 overflow-auto transition-all duration-300 ${mainContentMargin}`}>
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
            <Route path="/live" element={<LiveFeedPanel />} />
            <Route path="/data-entry" element={<CriminalDataEntry />} />
            <Route path="/criminal-network" element={<CriminalNetworkGraph />} />
            <Route path="/reports" element={<CriminalReport />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/setup" element={<SetupWizard />} />
            <Route path="/encryption-test" element={<EncryptionTest />} />
            <Route path="/admin/officers" element={<PoliceOfficerAdmin />} />
          </Routes>
        </div>
        
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
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;