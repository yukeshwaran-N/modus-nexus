import { useState, useEffect, useMemo } from "react";
import { Database, RefreshCw, Map, Filter, AlertCircle, WifiOff, Server } from "lucide-react";
import { PageLayout } from "./PageLayout";
import { secureSupabase } from "@/lib/secureSupabase"; // Use secureSupabase instead of supabase
import { LeafletMap } from "./LeafletMap";

// Coordinates mapping for Tamil Nadu districts
const districtCoordinates: Record<string, { lat: number; lng: number }> = {
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Trichy": { lat: 10.7905, lng: 78.7047 },
  "Salem": { lat: 11.6643, lng: 78.1460 },
  "Erode": { lat: 11.3410, lng: 77.7172 },
  "Vellore": { lat: 12.9165, lng: 79.1325 },
  "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
  "Thanjavur": { lat: 10.7870, lng: 79.1378 },
  "Rameswaram": { lat: 9.2880, lng: 79.3130 },
};

export function CrimeHeatmap() {
  const [crimeData, setCrimeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedCrimeType, setSelectedCrimeType] = useState("All");
  const [dbStatus, setDbStatus] = useState<string>('Checking connection...');
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  // Test database connection
  const testDbConnection = async () => {
    try {
      setDbStatus('Testing Secure Supabase connection...');
      const { data, error } = await secureSupabase.select('criminal_records', {
        limit: 1
      });
      
      if (error) {
        setDbStatus(`Database error: ${error.message}`);
        setDbConnected(false);
        throw error;
      }
      
      setDbStatus('Database connection successful!');
      setDbConnected(true);
      return true;
    } catch (err) {
      setDbStatus('Database connection failed');
      setDbConnected(false);
      console.error('Database test failed:', err);
      return false;
    }
  };

  // Fetch crime data from database using secureSupabase
  const fetchCrimeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test connection first
      const isConnected = await testDbConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to database');
      }
      
      setDbStatus('Fetching crime records...');
      const { data, error: supabaseError } = await secureSupabase.select('criminal_records');
      
      if (supabaseError) {
        setDbStatus(`Query error: ${supabaseError.message}`);
        throw supabaseError;
      }
      
      if (data) {
        console.log('Fetched crime data:', data);
        
        // Add coordinates based on location
        const processedData = data.map(record => {
          const location = record.last_location || record.location || '';
          const district = Object.keys(districtCoordinates).find(d => 
            location.toLowerCase().includes(d.toLowerCase())
          );
          
          return {
            ...record,
            lat: district ? districtCoordinates[district].lat : (10.9412 + (Math.random() - 0.5) * 2),
            lng: district ? districtCoordinates[district].lng : (78.7016 + (Math.random() - 0.5) * 2)
          };
        });
        
        setCrimeData(processedData);
        setDbStatus(`Successfully loaded ${data.length} records`);
      }
    } catch (err: any) {
      setDbStatus('Error: ' + err.message);
      setError(err.message || 'Failed to fetch crime data');
      console.error('Error fetching crime data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter crime data based on selection
  const filteredData = useMemo(() => {
    if (selectedCrimeType === "All") return crimeData;
    return crimeData.filter(crime => crime.crime_type === selectedCrimeType);
  }, [crimeData, selectedCrimeType]);

  // Get unique crime types for filter dropdown
  const crimeTypes = useMemo(() => {
    const types = Array.from(new Set(crimeData.map(item => item.crime_type).filter(Boolean)));
    return ["All", ...types.sort()];
  }, [crimeData]);

  // Calculate hotspots based on crime density
  const hotspots = useMemo(() => [
    { 
      location: "Chennai", 
      crimes: crimeData.filter((c: any) => c.last_location && c.last_location.includes("Chennai")).length, 
      trend: crimeData.filter((c: any) => c.last_location && c.last_location.includes("Chennai")).length > 5 ? "↑ Increasing" : "→ Stable", 
      level: crimeData.filter((c: any) => c.last_location && c.last_location.includes("Chennai")).length > 5 ? "high" : "medium" 
    },
    { 
      location: "Coimbatore", 
      crimes: crimeData.filter((c: any) => c.last_location && c.last_location.includes("Coimbatore")).length, 
      trend: "→ Stable", 
      level: "medium" 
    },
    { 
      location: "Madurai", 
      crimes: crimeData.filter((c: any) => c.last_location && c.last_location.includes("Madurai")).length, 
      trend: "↓ Decreasing", 
      level: "low" 
    },
  ], [crimeData]);

  useEffect(() => {
    fetchCrimeData();
  }, []);

  const handleMapReady = (map: any) => {
    setMapReady(true);
  };

  if (loading && crimeData.length === 0) {
    return (
      <PageLayout title="Crime Heatmap" subtitle="Visualize crime patterns and hotspots across Tamil Nadu">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
            <p className="text-gray-600">Loading crime data...</p>
            <p className="text-sm text-gray-500 mt-2">{dbStatus}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Crime Heatmap" 
      subtitle="Visualize crime patterns and hotspots across Tamil Nadu"
    >
      {/* Data Overview Section */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{crimeData.length}</p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center">
              <Filter className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{new Set(crimeData.map(r => r.crime_type)).size}</p>
                <p className="text-sm text-gray-600">Crime Types</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <div className="flex items-center">
              <Map className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <p className="text-xl font-bold text-gray-800">{mapReady ? 'ACTIVE' : 'OFFLINE'}</p>
                <p className="text-sm text-gray-600">Map Status</p>
              </div>
            </div>
          </div>
          
          {/* Database Connection Status Card */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="text-xl font-bold text-gray-800">
                  {dbConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </p>
                <p className="text-sm text-gray-600">Database Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        error ? 'bg-red-100 border border-red-300' : 'bg-blue-100 border border-blue-300'
      }`}>
        <div className="flex items-center gap-3">
          {error ? (
            <WifiOff className="h-6 w-6 text-red-600" />
          ) : (
            <Database className="h-6 w-6 text-blue-600" />
          )}
          <div>
            <h3 className="font-semibold">{error ? 'Connection Issue' : 'Database Status'}</h3>
            <p className="text-sm">{dbStatus}</p>
            {error && (
              <p className="text-sm text-red-600 mt-1">
                Check your Supabase connection.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Live Crime Heatmap</h2>
            <p className="text-gray-600">Real-time visualization of criminal activity across Tamil Nadu</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Crime Type Filter */}
            <select 
              value={selectedCrimeType}
              onChange={(e) => setSelectedCrimeType(e.target.value)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {crimeTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <button 
              onClick={fetchCrimeData}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
        
        {/* Map Component */}
        <LeafletMap 
          onMapReady={handleMapReady}
          markers={filteredData}
          loading={loading}
        />
      </div>

      {/* Recent Crimes List */}
      {crimeData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Criminal Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crimeData.slice(0, 6).map((crime, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800">{crime.name || 'Unknown Criminal'}</h4>
                <p className="text-sm text-gray-600">Case: {crime.case_id || 'N/A'}</p>
                <p className="text-sm text-gray-600">Crime: {crime.crime_type || 'Unknown'}</p>
                <p className="text-sm text-gray-600">Location: {crime.last_location || 'Unknown'}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    crime.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                    crime.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Risk: {crime.risk_level || 'Unknown'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotspots Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                hotspot.level === "high" ? "bg-red-100" : 
                hotspot.level === "medium" ? "bg-orange-100" : "bg-yellow-100"
              }`}>
                <AlertCircle className={`h-6 w-6 ${
                  hotspot.level === "high" ? "text-red-600" : 
                  hotspot.level === "medium" ? "text-orange-600" : "text-yellow-600"
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{hotspot.location}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reported Crimes:</span>
                <span className="font-bold text-gray-800">{hotspot.crimes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trend:</span>
                <span className={`font-medium ${
                  hotspot.trend.includes("↑") ? "text-red-600" : 
                  hotspot.trend.includes("↓") ? "text-green-600" : "text-gray-600"
                }`}>
                  {hotspot.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-4 text-lg">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-6 py-3 rounded-xl hover:from-blue-200 hover:to-blue-300 transition-colors shadow-sm flex items-center gap-2 border border-blue-300">
            <span>📊</span>
            Generate Report
          </button>
          <button className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-6 py-3 rounded-xl hover:from-green-200 hover:to-green-300 transition-colors shadow-sm flex items-center gap-2 border border-green-300">
            <span>📥</span>
            Export Data
          </button>
          <button className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-6 py-3 rounded-xl hover:from-purple-200 hover:to-purple-300 transition-colors shadow-sm flex items-center gap-2 border border-purple-300">
            <span>🖨️</span>
            Print Map
          </button>
          <button className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-6 py-3 rounded-xl hover:from-orange-200 hover:to-orange-300 transition-colors shadow-sm flex items-center gap-2 border border-orange-300">
            <span>🚨</span>
            Alert Team
          </button>
        </div>
      </div>
    </PageLayout>
  );
}