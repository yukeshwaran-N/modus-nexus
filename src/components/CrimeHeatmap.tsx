import { Map, Filter, AlertCircle } from "lucide-react";
import { PageLayout } from "./PageLayout";

export function CrimeHeatmap() {
  const hotspots = [
    { location: "Chennai Central", crimes: 42, trend: "↑ Increasing", level: "high" },
    { location: "Coimbatore North", crimes: 28, trend: "→ Stable", level: "medium" },
    { location: "Madurai South", crimes: 15, trend: "↓ Decreasing", level: "low" },
  ];

  return (
    <PageLayout 
      title="Crime Heatmap" 
      subtitle="Visualize crime patterns and hotspots across Tamil Nadu"
    >
      {/* Map Container */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Live Crime Heatmap</h2>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors">
            <Filter className="h-5 w-5" />
            Filter Areas
          </button>
        </div>
        
        {/* Placeholder for actual map */}
        <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
          <div className="text-center text-gray-600">
            <Map className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Interactive Crime Heatmap</p>
            <p className="text-sm">Real-time data visualization</p>
          </div>
        </div>
      </div>

      {/* Hotspots List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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
    </PageLayout>
  );
}