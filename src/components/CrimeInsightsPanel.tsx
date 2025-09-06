import { Brain, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { PageLayout } from "./PageLayout";

export function CrimeInsightsPanel() {
  const insights = [
    {
      icon: TrendingUp,
      title: "Pattern Detected",
      description: "Increase in cyber crimes in Chennai during evening hours",
      confidence: "92%",
      color: "blue"
    },
    {
      icon: AlertTriangle,
      title: "Alert",
      description: "New modus operandi detected in financial fraud cases",
      confidence: "87%",
      color: "red"
    },
    {
      icon: Lightbulb,
      title: "Recommendation",
      description: "Increase patrols in commercial areas during weekends",
      confidence: "95%",
      color: "green"
    }
  ];

  return (
    <PageLayout 
      title="AI Crime Insights" 
      subtitle="AI-powered analysis and predictive crime pattern detection"
    >
      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                insight.color === "blue" ? "bg-blue-100" : 
                insight.color === "red" ? "bg-red-100" : "bg-green-100"
              }`}>
                <insight.icon className={`h-6 w-6 ${
                  insight.color === "blue" ? "text-blue-600" : 
                  insight.color === "red" ? "text-red-600" : "text-green-600"
                }`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{insight.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{insight.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Confidence:</span>
              <span className="font-bold text-gray-800">{insight.confidence}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Chat Interface */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">AI Crime Analyst</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-gray-700">Hello! I can help you analyze crime patterns, predict trends, and generate reports. What would you like to know?</p>
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Ask about crime patterns, predictions, or analysis..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Ask AI
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}