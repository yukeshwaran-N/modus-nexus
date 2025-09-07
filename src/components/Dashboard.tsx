import { useState, useEffect, useRef } from "react";
import { 
  Brain, Clock, Target, Shield, Activity, Database, Cpu, 
  Map, Users, BarChart3, Info, Cloud, Newspaper, ChevronRight,
  Sparkles, Leaf, Eye
} from "lucide-react";

// Weather Types
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// News Types
interface NewsArticle {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
}

const WEATHER_API_KEY = "416cbf771f8338b1dc6225551922793b";

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [locationAccess, setLocationAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error('Weather data fetch failed');
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationAccess(true);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationAccess(false);
          // Fallback to Chennai coordinates if permission denied
          fetchWeather(13.0827, 80.2707);
        }
      );
    } else {
      // Fallback to Chennai coordinates if geolocation not supported
      fetchWeather(13.0827, 80.2707);
    }
  }, []);

  if (loading) return (
    <button className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
      <Cloud className="h-5 w-5 text-blue-600 animate-pulse" />
    </button>
  );

  if (error) return (
    <button className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
      <Cloud className="h-5 w-5 text-red-600" />
    </button>
  );

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Cloud className="h-5 w-5 text-blue-600" />
      </button>

      {/* Weather tooltip on hover */}
      {showTooltip && weather && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800">Weather Details</h4>
            <Cloud className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-medium">{Math.round(weather.main.temp)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Feels like:</span>
              <span className="font-medium">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Humidity:</span>
              <span className="font-medium">{weather.main.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wind:</span>
              <span className="font-medium">{weather.wind.speed} m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{weather.name}</span>
            </div>
          </div>
          {!locationAccess && (
            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
              Allow location access for accurate weather data
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NewsTicker: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock news data
    const mockNews: NewsArticle[] = [
      {
        title: "Tamil Nadu Police launches new crime prevention initiative",
        source: { name: "The Hindu" },
        url: "#",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Advanced surveillance systems installed across Chennai",
        source: { name: "Times of India" },
        url: "#",
        publishedAt: new Date().toISOString()
      },
      {
        title: "Cyber crime unit arrests 5 in major fraud case",
        source: { name: "Deccan Chronicle" },
        url: "#",
        publishedAt: new Date().toISOString()
      },
      {
        title: "New AI-powered crime prediction system shows 95% accuracy",
        source: { name: "Police Today" },
        url: "#",
        publishedAt: new Date().toISOString()
      }
    ];
    setNews(mockNews);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [news.length]);

  if (loading) return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-2">
      <Newspaper className="h-4 w-4" />
      <span className="text-sm">Loading news...</span>
    </div>
  );

  if (news.length === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-2 overflow-hidden">
      <Newspaper className="h-4 w-4 flex-shrink-0" />
      <div className="flex-1 overflow-hidden">
        <div 
          key={currentIndex} 
          className="text-sm whitespace-nowrap animate-slideIn"
        >
          {news[currentIndex].title}
        </div>
      </div>
      <div className="flex gap-1">
        {news.map((_, index) => (
          <div 
            key={index} 
            className={`h-1 w-1 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const SystemInfoWidget: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Info className="h-5 w-5 text-blue-600" />
      </button>

      {showInfo && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <h4 className="font-semibold text-gray-800 mb-3">System Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Live Data Feed • Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">Database • Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700">AI Model • Synced</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Real-time data from TN Police databases. Analysis powered by advanced AI systems.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section with System Info and Weather in top right */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="text-center lg:text-left space-y-4 flex-1">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">ModusMapping</h1>
                <p className="text-lg text-gray-600 mt-1">Tamil Nadu Police Intelligence Platform</p>
              </div>
            </div>
          </div>

          {/* System Info and Weather Widgets in top right corner */}
          <div className="flex items-center gap-2 self-center">
            <WeatherWidget />
            <SystemInfoWidget />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Sparkles className="h-4 w-4" />
              <span>REVOLUTIONIZING POLICE WORK</span>
            </div>
            
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              Crime Prevention Made<br />
              Simple with Generative AI
            </h2>
            
            <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
              Use AI to detect criminal patterns, analyze networks, and prevent crimes before they happen
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                Get Started <ChevronRight className="h-5 w-5" />
              </button>
              <button className="bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2">
                <Eye className="h-5 w-5" />
                Pattern Detection
              </button>
            </div>
          </div>
        </div>

        {/* Weather and News Ticker - Compact Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <NewsTicker />
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

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Tamil Nadu Police • Advanced Crime Analytics Platform
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}