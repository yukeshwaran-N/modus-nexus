import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Map, 
  BarChart3, 
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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
  useSidebar,
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
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      {/* Sidebar Header / Logo */}
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-800">
                ModusMapping
              </h2>
              <p className="text-xs text-gray-600 font-medium">
                Tamil Nadu Police
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel>
              NAVIGATION
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      isActive={isActive}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`flex items-center gap-3 transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-current"}`} />
                      {!isCollapsed && (
                        <div className="flex flex-1 flex-col text-left space-y-1">
                          <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-800"}`}>
                            {item.title}
                          </span>
                          <span className={`text-xs leading-tight ${isActive ? "text-blue-100" : "text-gray-500"}`}>
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
          <hr className="my-6 border-gray-200 mx-2" />
        )}

        {/* Administration Section */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel>
              ADMINISTRATION
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveView(item.id)}
                      isActive={isActive}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={`flex items-center gap-3 transition-all duration-200 ${
                        isActive 
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-current"}`} />
                      {!isCollapsed && (
                        <div className="flex flex-1 flex-col text-left space-y-1">
                          <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-800"}`}>
                            {item.title}
                          </span>
                          <span className={`text-xs leading-tight ${isActive ? "text-blue-100" : "text-gray-500"}`}>
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

      {/* Collapse/Expand Button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>
    </Sidebar>
  );
}