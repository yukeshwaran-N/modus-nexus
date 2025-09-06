import { Brain, Clock, Target, Shield, Activity, Database, Cpu, Upload, Map, Users, BarChart3 } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6 py-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800">ModusMapping</h1>
          </div>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced criminal intelligence and pattern analysis for Tamil Nadu Police
          </p>
          <p className="text-lg text-gray-500">
            Use AI to detect criminal patterns, analyze networks, and prevent crimes before they happen
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Analysis System</h3>
                <p className="text-sm text-gray-500">Real-time processing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Database</h3>
                <p className="text-sm text-gray-500">Criminal records</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Cpu className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">AI Model</h3>
                <p className="text-sm text-gray-500">Pattern detection</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Pattern Analysis
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Target className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">95%</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
              Detection Accuracy
            </div>
            <p className="text-xs text-gray-500 mt-2">Advanced AI algorithms</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-2xl">
                <Clock className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">24/7</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
              Real-time Monitoring
            </div>
            <p className="text-xs text-gray-500 mt-2">Continuous surveillance</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <Brain className="h-10 w-10 text-purple-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-800 mb-3">50+</div>
            <div className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
              Criminal Patterns
            </div>
            <p className="text-xs text-gray-500 mt-2">Identified modus operandi</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Criminal Database</h3>
            </div>
            <p className="text-sm text-gray-600">Comprehensive database of known criminals and their networks</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Map className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Crime Heatmaps</h3>
            </div>
            <p className="text-sm text-gray-600">Visualize crime patterns and hotspots across districts</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">Advanced analytics and predictive crime pattern analysis</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Upload Case Data</h2>
            <p className="text-gray-600">Drag and drop your files here or click to select evidence data</p>

            {/* Hidden File Input */}
            <input
              type="file"
              id="fileUpload"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  console.log("Selected files:", files);
                  alert(`You selected ${files.length} file(s).`);
                }
              }}
            />

            {/* Custom Button */}
            <label
              htmlFor="fileUpload"
              className="cursor-pointer bg-gray-100 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors inline-block"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Tamil Nadu Police • Advanced Crime Analytics Platform
          </p>
        </div>
      </div>
    </div>
  );
}
