import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Map, 
  BarChart3, 
  Settings,
  Shield,
  Search
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
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === 'collapsed';

  return (
    <Sidebar className={`authority-gradient ${collapsed ? "w-16" : "w-64"} border-r border-sidebar-border`}>
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-gradient-to-r from-sidebar-background to-secondary">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground shadow-gold">
            <Shield className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground font-noto-sans tracking-wide">ModusMapping</h2>
              <p className="text-xs text-accent font-medium">Tamil Nadu Police</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                      ${activeView === item.id 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                    `}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 mb-2">
            {!collapsed && "Administration"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                      ${activeView === item.id 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }
                    `}
                    tooltip={collapsed ? item.title : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}