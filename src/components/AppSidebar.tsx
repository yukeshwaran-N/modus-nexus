import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Map, 
  BarChart3, 
  Settings,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Network,
  LogOut // Added LogOut icon
} from "lucide-react";
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  user?: any; // Add optional user prop
  onLogout?: () => void; // Add optional logout handler
}

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
    description: "Criminal network overview"
  },
  {
    title: "Data Entry",
    icon: FileText,
    id: "data-entry",
    description: "Add criminal records"
  },
  {
    title: "Criminals",
    icon: Users,
    id: "criminals", 
    description: "Criminal database"
  },
  {
    title: "Criminal Network",
    icon: Network,
    id: "criminal-network",
    description: "Visualize connections"
  },
  {
    title: "Cases",
    icon: FileText,
    id: "cases",
    description: "Active investigations"
  },
  {
    title: "Maps",
    icon: Map,
    id: "maps",
    description: "Crime mapping & analysis"
  },
  {
    title: "Reports",
    icon: BarChart3,
    id: "reports",
    description: "Analytics & insights"
  },
];

const adminItems = [
  {
    title: "System Settings",
    icon: Settings,
    id: "settings",
    description: "Configuration"
  },
];

export function AppSidebar({ activeView, setActiveView, user, onLogout }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>
      )}

      <Sidebar 
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16 lg:w-20" : "w-64"
        } fixed lg:relative h-screen z-40 ${isMobile && !isCollapsed ? 'left-0' : '-left-full lg:left-0'}`}
      >
        {/* Sidebar Header / Logo */}
        <SidebarHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {!isCollapsed ? (
              // Show full logo when sidebar is expanded
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="ModusMapping Logo" 
                  className="h-10 w-10 object-contain"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-blue-800">
                    ModusMapping
                  </h2>
                  <p className="text-sm text-blue-600 font-semibold">
                    Tamil Nadu Police
                  </p>
                </div>
              </div>
            ) : (
              // Show only logo when sidebar is collapsed
              <img 
                src="/logo.png" 
                alt="ModusMapping Logo" 
                className="h-10 w-10 object-contain mx-auto"
              />
            )}
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="p-4">
          {/* Navigation Section */}
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3">
                NAVIGATION
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveView(item.id);
                          closeSidebar();
                        }}
                        isActive={isActive}
                        tooltip={isCollapsed ? item.title : undefined}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 transform ${
                          isActive 
                            ? "bg-blue-100 text-blue-800 border-blue-400 shadow-md"
                            : "bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-blue-800" : "text-blue-800"
                        }`} />
                        {!isCollapsed && (
                          <div className="flex flex-1 flex-col text-left">
                            <span className="text-sm font-bold">
                              {item.title}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          

          {/* Divider */}
          {!isCollapsed && (
            <hr className="my-6 border-gray-300" />
          )}

          {/* Administration Section */}
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-3">
                ADMINISTRATION
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {adminItems.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveView(item.id);
                          closeSidebar();
                        }}
                        isActive={isActive}
                        tooltip={isCollapsed ? item.title : undefined}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 transform ${
                          isActive 
                            ? "bg-blue-100 text-blue-800 border-blue-400 shadow-md"
                            : "bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-blue-800" : "text-blue-800"
                        }`} />
                        {!isCollapsed && (
                          <div className="flex flex-1 flex-col text-left">
                            <span className="text-sm font-bold">
                              {item.title}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* User Info and Logout Section */}
          {user && onLogout && (
            <SidebarGroup className="mt-auto">
              <hr className="my-6 border-gray-300" />
              <SidebarGroupContent>
                <div className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 ${
                  isCollapsed ? 'justify-center' : ''
                }`}>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500">Police Officer</p>
                    </div>
                  )}
                </div>
                
                <SidebarMenu className="space-y-2 mt-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={onLogout}
                      tooltip={isCollapsed ? "Logout" : undefined}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 transform ${
                        "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-800 hover:border-red-400 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                      }`}
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex flex-1 flex-col text-left">
                          <span className="text-sm font-bold">
                            Logout
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            Sign out of system
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Collapse/Expand Button - Desktop */}
        {!isMobile && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-200 shadow-sm"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-blue-700" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-blue-700" />
              )}
            </button>
          </div>
        )}

        {/* Mobile Overlay */}
        {isMobile && !isCollapsed && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeSidebar}
          />
        )}
      </Sidebar>
    </>
  );
}