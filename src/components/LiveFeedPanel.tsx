import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, User, MapPin } from 'lucide-react';

// Mock live feed data
const mockFeedData = [
  {
    id: 1,
    type: 'alert',
    title: 'High-risk suspect identified',
    description: 'Marcus Rodriguez spotted in downtown area',
    timestamp: '2 minutes ago',
    severity: 'high',
    location: 'Downtown District'
  },
  {
    id: 2,
    type: 'update',
    title: 'Case status updated',
    description: 'Case #2024-0156 moved to investigation phase',
    timestamp: '15 minutes ago',
    severity: 'medium',
    location: 'HQ'
  },
  {
    id: 3,
    type: 'arrest',
    title: 'Arrest made',
    description: 'David Kumar taken into custody',
    timestamp: '1 hour ago',
    severity: 'high',
    location: 'Business District'
  },
  {
    id: 4,
    type: 'report',
    title: 'New crime reported',
    description: 'Burglary reported on 5th Street',
    timestamp: '2 hours ago',
    severity: 'medium',
    location: '5th Street'
  },
  {
    id: 5,
    type: 'intel',
    title: 'Intelligence update',
    description: 'New criminal association detected',
    timestamp: '3 hours ago',
    severity: 'low',
    location: 'Network Analysis'
  }
];

export function LiveFeedPanel() {
  const [feedItems, setFeedItems] = useState(mockFeedData);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // In a real app, this would fetch from an API
      console.log('Checking for new feed updates...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'arrest': return <User className="h-4 w-4" />;
      case 'report': return <MapPin className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'text-destructive';
      case 'arrest': return 'text-accent';
      case 'report': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="law-enforcement-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Live Feed</CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {feedItems.map((item) => (
          <div key={item.id} className="border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <Badge variant={getSeverityBadgeVariant(item.severity)} className="text-xs">
                    {item.severity}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.timestamp}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" className="w-full">
            Load More Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}