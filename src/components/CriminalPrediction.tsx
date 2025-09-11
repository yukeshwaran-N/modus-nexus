import React, { useState, useEffect } from 'react';
import { Brain, Search, Filter, AlertCircle, User, MapPin, Clock, Shield, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Define types for our data
interface Criminal {
  id: number;
  name: string;
  age: number;
  gender: string;
  last_known_location: string;
  known_crimes: string[];
  modus_operandi: string[];
  risk_level: 'Low' | 'Medium' | 'High';
  last_seen: string;
  image_url?: string;
  // These will be calculated client-side
  probability?: number;
  matchReasons?: string[];
}

interface PredictionForm {
  location: string;
  crimeType: string;
  timeOfDay: string;
  weaponsUsed: string[];
  modusOperandi: string;
  description: string;
}

interface CrimeStats {
  id: number;
  location: string;
  crime_type: string;
  frequency: number;
  recent_cases: number;
}

// Tamil Nadu districts data
const tamilNaduDistricts = [
  "Ariyalur", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", 
  "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
  "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", 
  "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const crimeTypes = [
  "Theft", "Burglary", "Assault", "Robbery", "Fraud", 
  "Vandalism", "Cyber Crime", "Forgery", "Hacking", "Carjacking",
  "Identity Theft", "Public Disturbance", "Data Theft"
];

const timeOfDayOptions = ["Early Morning (12AM-6AM)", "Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-12AM)"];
const weaponsOptions = ["Firearm", "Knife", "Blunt Object", "No Weapon", "Unknown"];
const modusOperandiOptions = [
  "Solo perpetrator", "Group activities", "Night operations", "Daytime activities",
  "Weapon involved", "No violence", "Quick escape", "Planned operation",
  "Spontaneous", "Alcohol involved", "Drug related", "Online operations"
];

const CriminalPrediction: React.FC = () => {
  const [criminalDatabase, setCriminalDatabase] = useState<Criminal[]>([]);
  const [crimeStats, setCrimeStats] = useState<CrimeStats[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState<PredictionForm>({
    location: '',
    crimeType: '',
    timeOfDay: '',
    weaponsUsed: [],
    modusOperandi: '',
    description: ''
  });
  const [predictions, setPredictions] = useState<Criminal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCriminal, setSelectedCriminal] = useState<Criminal | null>(null);
  const [crimeTrends, setCrimeTrends] = useState<CrimeStats[]>([]);
  
  // Dropdown states
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [crimeTypeDropdownOpen, setCrimeTypeDropdownOpen] = useState(false);
  const [timeOfDayDropdownOpen, setTimeOfDayDropdownOpen] = useState(false);
  const [modusOperandiDropdownOpen, setModusOperandiDropdownOpen] = useState(false);
  
  // Search states
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [crimeTypeSearchTerm, setCrimeTypeSearchTerm] = useState('');
  const [timeOfDaySearchTerm, setTimeOfDaySearchTerm] = useState('');
  const [modusOperandiSearchTerm, setModusOperandiSearchTerm] = useState('');

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        
        // Fetch criminals
        const { data: criminalsData, error: criminalsError } = await supabase
          .from('criminals')
          .select('*');
        
        if (criminalsError) {
          throw criminalsError;
        }
        
        if (criminalsData) {
          setCriminalDatabase(criminalsData as Criminal[]);
        }
        
        // Fetch crime stats
        const { data: statsData, error: statsError } = await supabase
          .from('crime_stats')
          .select('*');
        
        if (statsError) {
          throw statsError;
        }
        
        if (statsData) {
          setCrimeStats(statsData as CrimeStats[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWeaponChange = (weapon: string) => {
    setFormData(prev => ({
      ...prev,
      weaponsUsed: prev.weaponsUsed.includes(weapon)
        ? prev.weaponsUsed.filter(w => w !== weapon)
        : [...prev.weaponsUsed, weapon]
    }));
  };

  // Handler functions for dropdown selections
  const handleDistrictSelect = (district: string) => {
    setFormData(prev => ({ ...prev, location: district }));
    setDistrictDropdownOpen(false);
    setDistrictSearchTerm('');
  };

  const handleCrimeTypeSelect = (crimeType: string) => {
    setFormData(prev => ({ ...prev, crimeType }));
    setCrimeTypeDropdownOpen(false);
    setCrimeTypeSearchTerm('');
  };

  const handleTimeOfDaySelect = (timeOfDay: string) => {
    setFormData(prev => ({ ...prev, timeOfDay }));
    setTimeOfDayDropdownOpen(false);
    setTimeOfDaySearchTerm('');
  };

  const handleModusOperandiSelect = (modusOperandi: string) => {
    setFormData(prev => ({ ...prev, modusOperandi }));
    setModusOperandiDropdownOpen(false);
    setModusOperandiSearchTerm('');
  };

  // Filter functions for dropdowns
  const filteredDistricts = tamilNaduDistricts.filter(district =>
    district.toLowerCase().includes(districtSearchTerm.toLowerCase())
  );

  const filteredCrimeTypes = crimeTypes.filter(crimeType =>
    crimeType.toLowerCase().includes(crimeTypeSearchTerm.toLowerCase())
  );

  const filteredTimeOfDayOptions = timeOfDayOptions.filter(timeOption =>
    timeOption.toLowerCase().includes(timeOfDaySearchTerm.toLowerCase())
  );

  const filteredModusOperandiOptions = modusOperandiOptions.filter(modusOperandi =>
    modusOperandi.toLowerCase().includes(modusOperandiSearchTerm.toLowerCase())
  );

  // Predict criminals based on multiple factors
  const predictCriminal = () => {
    if (!formData.location || !formData.crimeType) {
      alert('Please select at least location and crime type');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = criminalDatabase.map(criminal => {
        let probability = 0;
        const matchReasons: string[] = [];

        // Location match (30%)
        if (criminal.last_known_location === formData.location) {
          probability += 30;
          matchReasons.push("Known to operate in this area");
        }

        // Crime type match (40%)
        if (criminal.known_crimes.includes(formData.crimeType)) {
          probability += 40;
          matchReasons.push("History of similar crimes");
        }

        // Modus operandi match (20%)
        if (formData.modusOperandi && criminal.modus_operandi.includes(formData.modusOperandi)) {
          probability += 20;
          matchReasons.push("Matching modus operandi");
        }

        // Time of day consideration (10%)
        if (formData.timeOfDay.includes("Night") && criminal.modus_operandi.some(m => m.includes("Night"))) {
          probability += 10;
          matchReasons.push("Active during this time");
        }

        // Adjust based on risk level
        if (criminal.risk_level === "High") probability += 15;
        if (criminal.risk_level === "Medium") probability += 5;

        // Cap probability at 100%
        probability = Math.min(probability, 100);

        return {
          ...criminal,
          probability,
          matchReasons
        };
      })
      .filter(criminal => criminal.probability && criminal.probability > 0)
      .sort((a, b) => (b.probability || 0) - (a.probability || 0));

      // Update crime trends
      const relevantTrends = crimeStats.filter(stat => 
        stat.location === formData.location && stat.crime_type === formData.crimeType
      );
      setCrimeTrends(relevantTrends);

      setPredictions(results);
      setIsLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      location: '',
      crimeType: '',
      timeOfDay: '',
      weaponsUsed: [],
      modusOperandi: '',
      description: ''
    });
    setPredictions([]);
    setCrimeTrends([]);
    setSelectedCriminal(null);
    setDistrictSearchTerm('');
    setCrimeTypeSearchTerm('');
    setTimeOfDaySearchTerm('');
    setModusOperandiSearchTerm('');
  };

  const viewCriminalDetails = (criminal: Criminal) => {
    setSelectedCriminal(criminal);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading criminal database...</p>
        </div>
      </div>
    );
  }

  // Custom Dropdown Component
  const CustomDropdown = ({ 
    label, 
    value, 
    isOpen, 
    setIsOpen, 
    searchTerm, 
    setSearchTerm, 
    options, 
    onSelect 
  }: {
    label: string;
    value: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    options: string[];
    onSelect: (option: string) => void;
  }) => {
    return (
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          <button
            type="button"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center justify-between"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{value || `Select ${label}`}</span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="py-1">
                {options.length > 0 ? (
                  options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`block w-full text-left px-4 py-2 hover:bg-blue-50 ${value === option ? 'bg-blue-100 text-blue-800' : 'text-gray-700'}`}
                      onClick={() => onSelect(option)}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No options found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              AI Criminal Prediction System
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced machine learning analysis to predict potential suspects based on crime patterns and historical data
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Form */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Search className="h-5 w-5 text-blue-600" />
                    Crime Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {/* District Selector */}
                      <CustomDropdown
                        label="Location of Crime"
                        value={formData.location}
                        isOpen={districtDropdownOpen}
                        setIsOpen={setDistrictDropdownOpen}
                        searchTerm={districtSearchTerm}
                        setSearchTerm={setDistrictSearchTerm}
                        options={filteredDistricts}
                        onSelect={handleDistrictSelect}
                      />

                      {/* Crime Type Selector */}
                      <CustomDropdown
                        label="Type of Crime"
                        value={formData.crimeType}
                        isOpen={crimeTypeDropdownOpen}
                        setIsOpen={setCrimeTypeDropdownOpen}
                        searchTerm={crimeTypeSearchTerm}
                        setSearchTerm={setCrimeTypeSearchTerm}
                        options={filteredCrimeTypes}
                        onSelect={handleCrimeTypeSelect}
                      />

                      {/* Time of Occurrence Selector */}
                      <CustomDropdown
                        label="Time of Occurrence"
                        value={formData.timeOfDay}
                        isOpen={timeOfDayDropdownOpen}
                        setIsOpen={setTimeOfDayDropdownOpen}
                        searchTerm={timeOfDaySearchTerm}
                        setSearchTerm={setTimeOfDaySearchTerm}
                        options={filteredTimeOfDayOptions}
                        onSelect={handleTimeOfDaySelect}
                      />
                    </div>

                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weapons Used</label>
                      <div className="grid grid-cols-2 gap-2">
                        {weaponsOptions.map(weapon => (
                          <label key={weapon} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                              type="checkbox"
                              checked={formData.weaponsUsed.includes(weapon)}
                              onChange={() => handleWeaponChange(weapon)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{weapon}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Filter className="h-4 w-4" />
                      {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </button>

                    {showAdvanced && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        {/* Modus Operandi Selector */}
                        <CustomDropdown
                          label="Modus Operandi"
                          value={formData.modusOperandi}
                          isOpen={modusOperandiDropdownOpen}
                          setIsOpen={setModusOperandiDropdownOpen}
                          searchTerm={modusOperandiSearchTerm}
                          setSearchTerm={setModusOperandiSearchTerm}
                          options={filteredModusOperandiOptions}
                          onSelect={handleModusOperandiSelect}
                        />
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the crime scene, witness accounts, or any other relevant information..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={predictCriminal}
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          Predict Suspects
                        </>
                      )}
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Crime Trends */}
                {crimeTrends.length > 0 && (
                  <div className="bg-orange-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      Crime Trends in {formData.location}
                    </h3>
                    <div className="space-y-3">
                      {crimeTrends.map((trend, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                          <span className="font-medium text-gray-800">{trend.crime_type}</span>
                          <div className="text-right">
                            <div className="text-sm text-blue-600 font-semibold">{trend.frequency}% frequency</div>
                            <div className="text-xs text-green-600">{trend.recent_cases} recent cases</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Results */}
              <div className="space-y-6">
                {predictions.length > 0 ? (
                  <>
                    <div className="bg-green-50 rounded-2xl p-6">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Prediction Results</h2>
                        <p className="text-gray-600 mb-4">Based on {formData.crimeType} in {formData.location}</p>
                        <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Found {predictions.length} potential suspect{predictions.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {predictions.map(criminal => (
                        <div key={criminal.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-start gap-4">
                            <img 
                              src={criminal.image_url} 
                              alt={criminal.name}
                              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">{criminal.name}</h3>
                                  <p className="text-sm text-gray-600">{criminal.gender}, {criminal.age} years</p>
                                </div>
                                <div className="text-right">
                                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {criminal.probability}% Match
                                  </div>
                                  <div className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    criminal.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                                    criminal.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    <Shield className="h-3 w-3" />
                                    {criminal.risk_level} Risk
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {criminal.last_known_location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Last seen: {criminal.last_seen}
                                  </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium">Match Probability</span>
                                    <span>{criminal.probability}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${criminal.probability}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-blue-800 mb-2">Match Reasons</h4>
                                  <ul className="text-sm text-blue-700 space-y-1">
                                    {criminal.matchReasons?.map((reason, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700">Known Crimes:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {criminal.known_crimes.slice(0, 3).map(crime => (
                                        <span key={crime} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                          {crime}
                                        </span>
                                      ))}
                                      {criminal.known_crimes.length > 3 && (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                          +{criminal.known_crimes.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Modus Operandi:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {criminal.modus_operandi.slice(0, 2).map(mo => (
                                        <span key={mo} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                          {mo}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => viewCriminalDetails(criminal)}
                                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                  View Full Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Predictions Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Enter crime details to analyze patterns and predict potential suspects using our AI system.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                      <h4 className="font-medium text-gray-800 mb-2">System Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Advanced pattern matching algorithm</li>
                        <li>• Real-time crime trend analysis</li>
                        <li>• Multiple factor consideration</li>
                        <li>• Risk assessment scoring</li>
                        <li>• Historical data correlation</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Criminal Detail Modal */}
        {selectedCriminal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Criminal Profile</h2>
                  <button 
                    onClick={() => setSelectedCriminal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-6 mb-6">
                  <img 
                    src={selectedCriminal.image_url} 
                    alt={selectedCriminal.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{selectedCriminal.name}</h3>
                    <p className="text-gray-600">{selectedCriminal.gender}, {selectedCriminal.age} years</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCriminal.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                        selectedCriminal.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedCriminal.risk_level} Risk
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {selectedCriminal.probability}% Match
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Last Known Information</h4>
                      <p className="text-gray-600">Location: {selectedCriminal.last_known_location}</p>
                      <p className="text-gray-600">Last Seen: {selectedCriminal.last_seen}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Criminal History</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCriminal.known_crimes.map(crime => (
                          <span key={crime} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {crime}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Modus Operandi</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCriminal.modus_operandi.map(mo => (
                          <span key={mo} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {mo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Prediction Match</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Confidence Level</span>
                          <span>{selectedCriminal.probability}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${selectedCriminal.probability}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Match Reasons</h4>
                  <ul className="space-y-2">
                    {selectedCriminal.matchReasons?.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// In CriminalPrediction.tsx, make sure you have:
export default CriminalPrediction;