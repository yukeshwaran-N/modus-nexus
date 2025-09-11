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
    <header className="h-16 border-b-2 border-primary bg-gradient-to-r from-background to-muted px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-primary hover:text-secondary transition-colors" />
        <h1 className="government-header text-primary">Law Enforcement Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
          <Input
            placeholder="Search criminals, cases, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 w-96 h-12 bg-background/90 backdrop-blur-sm border-2 border-primary/20 focus:border-primary text-base font-medium rounded-lg shadow-md"
          />
        </div>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Globe className="h-5 w-5" />
              தமிழ்
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>தமிழ் (Tamil)</DropdownMenuItem>
            <DropdownMenuItem>हिन्दी (Hindi)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative h-12 w-12 rounded-full hover:bg-accent/20">
          <Bell className="h-6 w-6 text-primary" />
          <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 text-xs bg-secondary text-secondary-foreground shadow-sm">
            3
          </Badge>
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-12 px-4 rounded-lg border-2 border-transparent hover:border-accent hover:bg-accent/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground mr-3">
                <User className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline font-semibold text-primary">Inspector Kumar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-3 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
              <p className="font-bold text-primary">Inspector Rajesh Kumar</p>
              <p className="text-sm text-muted-foreground">Tamil Nadu Police • Badge #TN4521</p>
              <p className="text-xs text-accent">District Crime Branch</p>
            </div>
            <DropdownMenuItem className="font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="font-medium">Security Preferences</DropdownMenuItem>
            <DropdownMenuItem className="font-medium">Activity Log</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive font-medium">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}