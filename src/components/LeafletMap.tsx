import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  onMapReady: (map: any) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    crime_type: string;
    case_id: string;
    name: string;
    location: string;
  }>;
  loading?: boolean;
}

export function LeafletMap({ onMapReady, markers = [], loading = false }: LeafletMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const LRef = useRef<any>(null);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initMap = async () => {
      try {
        setMapLoading(true);
        const L = await import('leaflet');
        LRef.current = L;
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create map
        const map = L.map(mapContainerRef.current).setView([10.9412, 78.7016], 7);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        mapRef.current = map;
        onMapReady(map);
        setMapLoading(false);
        
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setMapLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapReady]);

  // Add markers when they change
  useEffect(() => {
    if (!mapRef.current || !LRef.current || markers.length === 0 || mapLoading) return;

    try {
      // Clear existing markers
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof LRef.current.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Add new markers
      markers.forEach((markerData) => {
        const marker = LRef.current.marker([markerData.lat, markerData.lng]).addTo(mapRef.current);
        
        // Create colored icon
        const intensity = getIntensityByCrimeType(markerData.crime_type);
        let color;
        if (intensity > 0.7) color = "#dc2626";
        else if (intensity > 0.4) color = "#ea580c";
        else color = "#ca8a04";
        
        const icon = LRef.current.divIcon({
          className: "crime-marker",
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        
        marker.setIcon(icon);
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">${markerData.crime_type || 'Unknown Crime'}</h3>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Case ID:</strong> ${markerData.case_id || 'N/A'}</p>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Name:</strong> ${markerData.name || 'Unknown'}</p>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Location:</strong> ${markerData.location || 'Unknown'}</p>
          </div>
        `);
      });
      
    } catch (err) {
      console.error('Error adding markers:', err);
    }
  }, [markers, mapLoading]);

  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-100">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
      />
      
      {(mapLoading || loading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{loading ? 'Loading crime data...' : 'Loading map...'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function
function getIntensityByCrimeType(crimeType: string): number {
  const intensityMap: Record<string, number> = {
    'Cyber Crime': 0.9,
    'Drug Trafficking': 0.8,
    'Human Trafficking': 0.8,
    'Kidnapping': 0.8,
    'Financial Fraud': 0.7,
    'ATM Fraud': 0.7,
    'Counterfeiting': 0.6,
    'Chain Snatching': 0.6,
    'House Breaking': 0.5,
    'Environmental Crime': 0.4,
  };
  
  return intensityMap[crimeType] || 0.5;
}