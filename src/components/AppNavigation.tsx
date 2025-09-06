// src/components/AppNavigation.tsx
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderSearch, 
  Map, 
  Database, 
  Users, 
  Network, 
  FileText, 
  BarChart3,
  Radio 
} from 'lucide-react';

const AppNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Criminal network overview' },
    { path: '/data-entry', icon: Database, label: 'Data Entry', description: 'Add criminal records' },
    { path: '/criminals', icon: Users, label: 'Criminals', description: 'Criminal database' },
    { path: '/cases', icon: FolderSearch, label: 'Cases', description: 'Active investigations' },
    { path: '/heatmap', icon: Map, label: 'Maps', description: 'Crime mapping & analysis' },
    { path: '/network', icon: Network, label: 'Network', description: 'Criminal connections' },
    { path: '/reports', icon: FileText, label: 'Reports', description: 'Analytics & insights' },
    { path: '/insights', icon: BarChart3, label: 'Insights', description: 'Crime pattern analysis' },
    { path: '/live-feed', icon: Radio, label: 'Live Feed', description: 'Real-time monitoring' },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5 mr-3" />
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default AppNavigation;