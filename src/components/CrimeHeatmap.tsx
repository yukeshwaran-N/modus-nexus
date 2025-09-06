import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, MapPin, Filter } from 'lucide-react';

// Mock crime data
const mockCrimeData = [
  { id: 1, type: 'Drug Trafficking', lat: 40.7589, lng: -73.9851, severity: 'high', time: '2 hours ago' },
  { id: 2, type: 'Assault', lat: 40.7614, lng: -73.9776, severity: 'medium', time: '4 hours ago' },
  { id: 3, type: 'Burglary', lat: 40.7505, lng: -73.9934, severity: 'low', time: '6 hours ago' },
  { id: 4, type: 'Robbery', lat: 40.7549, lng: -73.9840, severity: 'high', time: '8 hours ago' },
  { id: 5, type: 'Fraud', lat: 40.7580, lng: -73.9855, severity: 'medium', time: '12 hours ago' },
];

export function CrimeHeatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedCrime, setSelectedCrime] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState('heatmap');

  useEffect(() => {
    // Initialize map visualization
    if (mapRef.current) {
      // This would typically use Leaflet or similar mapping library
      // For now, we'll create a visual representation
      renderMap();
    }
  }, []);

  const renderMap = () => {
    // Simulated map rendering
    console.log('Rendering crime heatmap with', mockCrimeData.length, 'data points');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
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

  return (
    <div className="space-y-6">
      <Card className="law-enforcement-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Crime Heatmap</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant={activeLayer === 'heatmap' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveLayer('heatmap')}
              >
                <Layers className="h-4 w-4 mr-2" />
                Heatmap
              </Button>
              <Button 
                variant={activeLayer === 'points' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveLayer('points')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Points
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <div 
                ref={mapRef}
                className="h-[500px] bg-muted/20 border border-border rounded-lg relative overflow-hidden"
              >
                {/* Simulated map background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                  {/* Street grid overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* Crime points */}
                  {mockCrimeData.map((crime, index) => (
                    <div
                      key={crime.id}
                      className={`absolute w-4 h-4 rounded-full ${getSeverityColor(crime.severity)} opacity-80 cursor-pointer hover:opacity-100 transition-opacity`}
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index * 10)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedCrime(crime)}
                    />
                  ))}

                  {/* Heatmap overlay */}
                  {activeLayer === 'heatmap' && (
                    <div className="absolute inset-0">
                      <div className="absolute w-32 h-32 bg-red-500 opacity-20 rounded-full blur-xl" style={{left: '20%', top: '30%'}} />
                      <div className="absolute w-24 h-24 bg-yellow-500 opacity-20 rounded-full blur-xl" style={{left: '60%', top: '50%'}} />
                      <div className="absolute w-20 h-20 bg-orange-500 opacity-20 rounded-full blur-xl" style={{left: '40%', top: '70%'}} />
                    </div>
                  )}
                </div>

                {/* Map controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button variant="outline" size="sm">+</Button>
                  <Button variant="outline" size="sm">-</Button>
                </div>

                {/* Selected crime info */}
                {selectedCrime && (
                  <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 min-w-[200px]">
                    <h4 className="font-medium">{selectedCrime.type}</h4>
                    <p className="text-sm text-muted-foreground">Reported {selectedCrime.time}</p>
                    <Badge variant={getSeverityBadgeVariant(selectedCrime.severity)} className="mt-2">
                      {selectedCrime.severity} severity
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Crime Statistics Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockCrimeData.slice(0, 3).map((crime) => (
                    <div key={crime.id} className="flex items-center justify-between p-2 border border-border rounded">
                      <div>
                        <p className="font-medium text-sm">{crime.type}</p>
                        <p className="text-xs text-muted-foreground">{crime.time}</p>
                      </div>
                      <Badge variant={getSeverityBadgeVariant(crime.severity)}>
                        {crime.severity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Crime Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High Severity</span>
                    <span className="font-semibold text-destructive">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Medium Severity</span>
                    <span className="font-semibold text-warning">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Severity</span>
                    <span className="font-semibold text-accent">1</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Crimes</span>
                      <span className="font-bold">{mockCrimeData.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}