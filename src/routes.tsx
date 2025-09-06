// src/routes.tsx
import { Routes, Route } from 'react-router-dom';
import { PageLayout } from './components/PageLayout';
import Dashboard from './components/Dashboard';
import Cases from './components/Cases';
import CrimeHeatmap from './components/CrimeHeatmap';
import CriminalDataEntry from './components/CriminalDataEntry';
import CriminalsTable from './components/CriminalsTable';
import CriminalNetworkGraph from './components/CriminalNetworkGraph';
import CriminalReport from './components/CriminalReport';
import CrimeInsightsPanel from './components/CrimeInsightsPanel';
import LiveFeedPanel from './components/LiveFeedPanel';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout title="Dashboard"><Dashboard /></PageLayout>} />
      <Route path="/dashboard" element={<PageLayout title="Dashboard"><Dashboard /></PageLayout>} />
      <Route path="/cases" element={<PageLayout title="Cases"><Cases /></PageLayout>} />
      <Route path="/heatmap" element={<PageLayout title="Crime Heatmap"><CrimeHeatmap /></PageLayout>} />
      <Route path="/data-entry" element={<PageLayout title="Data Entry"><CriminalDataEntry /></PageLayout>} />
      <Route path="/criminals" element={<PageLayout title="Criminal Database"><CriminalsTable /></PageLayout>} />
      <Route path="/network" element={<PageLayout title="Criminal Network"><CriminalNetworkGraph /></PageLayout>} />
      <Route path="/reports" element={<PageLayout title="Reports"><CriminalReport /></PageLayout>} />
      <Route path="/insights" element={<PageLayout title="Insights"><CrimeInsightsPanel /></PageLayout>} />
      <Route path="/live-feed" element={<PageLayout title="Live Feed"><LiveFeedPanel /></PageLayout>} />
    </Routes>
  );
};