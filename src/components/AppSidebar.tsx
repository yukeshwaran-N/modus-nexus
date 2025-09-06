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
  ChevronRight
} from "lucide-react";
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

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-blue-800">
                  ModusMapping
                </h2>
                <p className="text-sm text-blue-600 font-semibold">
                  Tamil Nadu Police
                </p>
              </div>
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
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border ${
                          isActive 
                            ? "bg-blue-700 text-white border-blue-800 shadow-lg" 
                            : "bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400 hover:shadow-md"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-white" : "text-blue-600"
                        }`} />
                        {!isCollapsed && (
                          <div className="flex flex-1 flex-col text-left">
                            <span className="text-sm font-bold">
                              {item.title}
                            </span>
                            <span className="text-xs text-blue-600 mt-0.5">
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
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border ${
                          isActive 
                            ? "bg-blue-700 text-white border-blue-800 shadow-lg" 
                            : "bg-white text-blue-900 border-blue-200 hover:bg-blue-100 hover:text-blue-800 hover:border-blue-400 hover:shadow-md"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-white" : "text-blue-600"
                        }`} />
                        {!isCollapsed && (
                          <div className="flex flex-1 flex-col text-left">
                            <span className="text-sm font-bold">
                              {item.title}
                            </span>
                            <span className="text-xs text-blue-600 mt-0.5">
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