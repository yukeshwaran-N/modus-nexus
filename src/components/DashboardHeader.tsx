import { useState } from 'react';
import { Search, Bell, User, Menu, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-card border-b border-card-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Sidebar Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="h-9 w-9" />
          
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search criminals, cases, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                EN
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>हिन्दी (Hindi)</DropdownMenuItem>
              <DropdownMenuItem>Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Recent Alerts</h3>
              </div>
              <DropdownMenuItem className="p-3">
                <div>
                  <p className="font-medium">High-risk suspect identified</p>
                  <p className="text-sm text-muted-foreground">John Doe flagged in downtown area</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div>
                  <p className="font-medium">New criminal association detected</p>
                  <p className="text-sm text-muted-foreground">Network analysis reveals new connection</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div>
                  <p className="font-medium">Case update required</p>
                  <p className="text-sm text-muted-foreground">Case #2024-0156 needs review</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Officer Johnson</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-3 border-b">
                <p className="font-medium">Officer Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Investigator • Badge #4521</p>
              </div>
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Security Preferences</DropdownMenuItem>
              <DropdownMenuItem>Activity Log</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}