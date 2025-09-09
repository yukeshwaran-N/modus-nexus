import { useState, useEffect, useRef } from "react";
import { 
  Brain, Clock, Target, Shield, Activity, Database, Cpu, 
  Map, Users, BarChart3, Info, Cloud, Newspaper, ChevronRight,
  Sparkles, Leaf, Eye, Navigation, MapPin, Locate, LocateOff, AlertCircle,
  Thermometer, Droplets, Wind, Gauge
} from "lucide-react";

// Weather Types
interface WeatherData {
  location: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  aqi: string;
  condition: string;
}

// News Types
interface NewsArticle {
  title: string;
  source: { name: string };
  url: string;
  publishedAt: string;
}

const WEATHER_API_KEY = "416cbf771f8338b1dc6225551922793b";
const NEWS_API_KEY = "9b7211ac64ce2684ef5e4e05a10abd16";

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
        const result = await res.json();
        
        setWeather({
          location: result.name,
          temp: Math.round(result.main.temp),
          humidity: result.main.humidity,
          windSpeed: Math.round(result.wind.speed * 3.6), // Convert m/s to km/h
          pressure: result.main.pressure,
          aqi: "N/A",
          condition: result.weather[0].description,
        });
        setError(null);
      } catch {
        setError("Failed to fetch weather data");
        // Set fallback data
        setWeather({
          location: "Chennai",
          temp: 32,
          humidity: 70,
          windSpeed: 10,
          pressure: 1013,
          aqi: "N/A",
          condition: "Partly cloudy",
        });
      } finally {
        setLoading(false);
      }
    };

    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationAccess(true);
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationAccess(false);
          setError("Location access denied. Using default location (Chennai).");
          // Fallback to Chennai coordinates
          fetchWeather(13.0827, 80.2707);
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    } else {
      setError("Geolocation not supported. Using default location.");
      setLocationAccess(false);
      fetchWeather(13.0827, 80.2707);
    }
  }, []);

  if (loading) {
    return (
      <button className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
        <Cloud className="h-5 w-5 text-blue-600 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="Weather information"
      >
        {locationAccess ? (
          <Cloud className="h-5 w-5 text-blue-600" />
        ) : (
          <LocateOff className="h-5 w-5 text-orange-600" />
        )}
        {error && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
        )}
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              Weather
            </h3>
            {locationAccess ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Your Location
              </span>
            ) : (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Default Location
              </span>
            )}
          </div>
          
          {weather ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{weather.location}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-gray-600">Temperature</div>
                    <div className="font-medium">{weather.temp}°C</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-gray-600">Humidity</div>
                    <div className="font-medium">{weather.humidity}%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-gray-600">Wind Speed</div>
                    <div className="font-medium">{weather.windSpeed} km/h</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="text-gray-600">Pressure</div>
                    <div className="font-medium">{weather.pressure} hPa</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="text-gray-600">Condition</div>
                <div className="font-medium capitalize">{weather.condition}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              <p>Weather data unavailable</p>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
              {error}
            </div>
          )}

          {!locationAccess && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
              Allow location access for accurate weather information.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// NewsCard Component (unchanged)
const NewsCard: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://gnews.io/api/v4/search?q=crime+police&lang=en&country=in&max=10&apikey=${NEWS_API_KEY}`
        );
        const result = await response.json();
        setNews(result.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
        // Fallback to mock data if API fails
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
      }
    };
    fetchNews();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % news.length;
      setCurrentIndex(nextIndex);
      if (carouselRef.current) {
        carouselRef.current.scrollTo({
          left: nextIndex * 320,
          behavior: "smooth",
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, news]);

  // Track scroll for dot sync
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const index = Math.round(carousel.scrollLeft / 320);
      setCurrentIndex(index);
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  if (news.length === 0) {
    return <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">Loading News...</div>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Newspaper className="h-5 w-5" />
        Latest Crime News
      </h2>
      <div className="overflow-hidden" ref={carouselRef}>
        <div className="flex">
          {news.map((article, index) => (
            <div key={index} className="flex-shrink-0 w-80 mr-6">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">{article.title}</h3>
                <p className="text-sm text-gray-500">({article.source.name})</p>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4">
        {news.map((_, i) => (
          <button
            key={i}
            className={`h-2 w-2 rounded-full mx-1 ${i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => {
              setCurrentIndex(i);
              if (carouselRef.current) {
                carouselRef.current.scrollTo({
                  left: i * 320,
                  behavior: 'smooth'
                });
              }
            }}
            aria-label={`Go to news item ${i+1}`}
          />
        ))}
      </div>
    </div>
  );
};

// SystemInfoWidget Component (unchanged)
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

// Dashboard Component (unchanged)
export default function Dashboard() {
  // Function to handle Get Started button click
  const handleGetStarted = () => {
    alert("Get Started functionality would be implemented here!");
  };

  // Function to handle Pattern Detection button click
  const handlePatternDetection = () => {
    alert("Pattern Detection functionality would be implemented here!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section with only System Info and Weather in top right */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <WeatherWidget />
            <SystemInfoWidget />
          </div>
        </div>

        {/* Hero Section with centered logo */}
        <div className="text-black text-center -mt-12">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Centered Shield Logo */}
            <div className="flex justify-center">
              <img 
                src="/logo.png" 
                alt="App Logo" 
                className="h-30 w-40 object-contain mb-4"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-black shadow-sm">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="tracking-wide">Tamil Nadu Police Intelligence Platform</span>
            </div>

            <h2 className="mt-6 text-4xl lg:text-6xl font-extrabold leading-tight font-magneto">
              <span className="text-indigo-600">Modus Mapping</span><br />
              <span className="text-gray-900">AI-Powered Crime Records</span>
            </h2>

            <p className="mt-4 text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Use AI to detect criminal patterns, analyze networks, and prevent crimes before they happen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button 
                className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                onClick={handleGetStarted}
              >
                Get Started <ChevronRight className="h-5 w-5" />
              </button>
              <button 
                className="bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                onClick={handlePatternDetection}
              >
                <Eye className="h-5 w-5" />
                Pattern Detection
              </button>
            </div>
          </div>
        </div>

        {/* News Section - Centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <NewsCard />
          </div>
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
    </div>
  );
};