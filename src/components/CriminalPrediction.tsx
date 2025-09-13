import { useState, useEffect } from 'react';
import { Brain, MapPin, User, Search, AlertCircle, Database, Filter, Download } from 'lucide-react';

// Define TypeScript interfaces for the data
interface CriminalRecord {
  id: number;
  case_id: string;
  name: string;
  age: number;
  gender: string;
  phone_number?: string;
  email?: string;
  nationality?: string;
  crime_type: string;
  modus_operandi?: string;
  tools_used?: string;
  associates?: string;
  connected_criminals?: string;
  case_status?: string;
  current_status?: string;
  last_location: string;
  arrest_date?: string;
  bail_date?: string;
  bio?: string;
  total_cases?: number;
  legal_status?: string;
  known_associates?: string;
  case_progress_timeline?: string;
  address?: string;
  address_line?: string;
  city?: string;
  state?: string;
  country?: string;
  risk_level?: string;
  threat_level?: string;
}

interface Filters {
  location: string;
  crimeType: string;
}

// Sample data from your CSV
const sampleData: CriminalRecord[] = [
  {
    id: 1,
    case_id: "TN-2025-001",
    name: "Anitha Palanisamy",
    age: 59,
    gender: "Female",
    phone_number: "919045788970",
    email: "anitha.palanisamy1@example.com",
    nationality: "Indian",
    crime_type: "Smuggling",
    modus_operandi: "Fake documents",
    tools_used: "Crowbar",
    associates: "Yes",
    connected_criminals: "None",
    case_status: "Under Investigation",
    current_status: "At Large",
    last_location: "Namakkal",
    arrest_date: "2025-07-19",
    bail_date: "2025-08-04",
    bio: "Anitha Palanisamy involved in minor case in Namakkal.",
    total_cases: 4,
    legal_status: "Convicted",
    known_associates: "Local contacts",
    case_progress_timeline: "Case registered in Namakkal",
    address: "150 Street, Namakkal",
    address_line: "Area 18",
    city: "Namakkal",
    state: "Tamil Nadu",
    country: "India",
    risk_level: "Low",
    threat_level: "High"
  },
  // Add more sample data as needed from your CSV
  {
    id: 2,
    case_id: "TN-2025-002",
    name: "Sandhya Rajendran",
    age: 36,
    gender: "Female",
    phone_number: "916338081338",
    email: "sandhya.rajendran2@example.com",
    nationality: "Indian",
    crime_type: "Smuggling",
    modus_operandi: "Pickpocketing",
    tools_used: "Knife",
    associates: "Yes",
    connected_criminals: "Local Gang",
    case_status: "Closed",
    current_status: "On Bail",
    last_location: "Tirupattur",
    arrest_date: "2025-08-15",
    bail_date: "",
    bio: "Sandhya Rajendran involved in minor case in Tirupattur.",
    total_cases: 4,
    legal_status: "Convicted",
    known_associates: "Local contacts",
    case_progress_timeline: "Case registered in Tirupattur",
    address: "599 Street, Tirupattur",
    address_line: "Area 9",
    city: "Tirupattur",
    state: "Tamil Nadu",
    country: "India",
    risk_level: "High",
    threat_level: "Low"
  },
  {
    id: 3,
    case_id: "TN-2025-003",
    name: "Arun Rajendran",
    age: 53,
    gender: "Male",
    phone_number: "919357200991",
    email: "arun.rajendran3@example.com",
    nationality: "Indian",
    crime_type: "Smuggling",
    modus_operandi: "Hacking",
    tools_used: "Knife",
    associates: "No",
    connected_criminals: "None",
    case_status: "Open",
    current_status: "On Bail",
    last_location: "Pudukottai",
    arrest_date: "2025-01-11",
    bail_date: "",
    bio: "Arun Rajendran involved in minor case in Pudukottai.",
    total_cases: 5,
    legal_status: "Convicted",
    known_associates: "Local contacts",
    case_progress_timeline: "Case registered in Pudukottai",
    address: "118 Street, Pudukottai",
    address_line: "Area 19",
    city: "Pudukottai",
    state: "Tamil Nadu",
    country: "India",
    risk_level: "Medium",
    threat_level: "High"
  }
];

const CriminalRetrievalSystem = () => {
  const [filters, setFilters] = useState<Filters>({
    location: 'Erode',
    crimeType: 'Theft'
  });
  
  const [suspects, setSuspects] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [useSampleData, setUseSampleData] = useState(true);

  // Tamil Nadu districts data
  const tamilNaduDistricts = [
    "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode",
    "Ariyalur", "Cuddalore", "Dharmapuri", "Dindigul", 
    "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Sivaganga", "Tenkasi", "Thanjavur", 
    "Theni", "Thoothukudi", "Tirunelveli", "Tirupathur", "Tiruppur",
    "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram",
    "Virudhunagar"
  ];

  const crimeTypes = [
    "Theft", "Robbery", "Smuggling", "Cyber Crime", "Fraud", "Murder",
    "Burglary", "Vandalism", "Forgery", "Hacking",
    "Identity Theft", "Public Disturbance", "Data Theft"
  ];

  // Function to fetch suspects from database
  const fetchSuspects = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('');
    
    try {
      console.log('Fetching suspects with filters:', filters);
      
      if (useSampleData) {
        // Use sample data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        
        const filteredData = sampleData.filter(record => 
          record.crime_type.toLowerCase().includes(filters.crimeType.toLowerCase()) &&
          record.last_location.toLowerCase().includes(filters.location.toLowerCase())
        );
        
        console.log('Filtered sample data:', filteredData);
        setDebugInfo(`Using sample data: crime_type contains '${filters.crimeType}' AND last_location contains '${filters.location}' | Found ${filteredData.length} records`);
        setSuspects(filteredData);
      } else {
        // This would be your actual Supabase query
        // const { data, error } = await supabase
        //   .from('criminal_records')
        //   .select('*')
        //   .ilike('crime_type', `%${filters.crimeType}%`)
        //   .ilike('last_location', `%${filters.location}%`);
        
        // For now, we'll simulate an empty response from the database
        setDebugInfo(`Query: crime_type ILIKE '%${filters.crimeType}%' AND last_location ILIKE '%${filters.location}%' | Found 0 records in DB`);
        setSuspects([]);
        setError('No records found in database. Using sample data instead.');
      }
    } catch (err) {
      setError('Failed to fetch suspects. Please check console for details.');
      console.error('Database error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch all records for debugging
  const fetchAllRecords = async () => {
    try {
      if (useSampleData) {
        console.log('All sample records:', sampleData);
        setDebugInfo(`Found ${sampleData.length} sample records`);
        alert(`Sample records loaded. Check console for details. First record: ${sampleData[0].name}`);
      } else {
        // This would be your actual Supabase query
        // const { data, error } = await supabase
        //   .from('criminal_records')
        //   .select('*');
        
        setDebugInfo('Database connection not configured. Using sample data.');
        setUseSampleData(true);
      }
    } catch (err) {
      console.error('Error fetching all records:', err);
      setError('Failed to fetch all records. Please check console for details.');
    }
  };

  // Function to check specific values in database
  const checkDatabaseValues = async () => {
    try {
      if (useSampleData) {
        const theftRecords = sampleData.filter(record => 
          record.crime_type.toLowerCase().includes('theft')
        );
        
        const erodeRecords = sampleData.filter(record => 
          record.last_location.toLowerCase().includes('erode')
        );
        
        console.log('Theft records:', theftRecords);
        console.log('Erode records:', erodeRecords);
        
        setDebugInfo(`Theft records: ${theftRecords.length}, Erode records: ${erodeRecords.length}`);
      } else {
        setDebugInfo('Database connection not configured. Using sample data.');
        setUseSampleData(true);
      }
    } catch (err) {
      console.error('Error checking database values:', err);
    }
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClear = () => {
    setFilters({
      location: 'Erode',
      crimeType: 'Theft'
    });
    setSuspects([]);
    setError(null);
    setDebugInfo('');
  };

  const getRiskColor = (riskLevel?: string) => {
    if (!riskLevel) return 'bg-gray-100 text-gray-800';
    
    switch (riskLevel.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatColor = (threatLevel?: string) => {
    if (!threatLevel) return 'bg-gray-100 text-gray-800';
    
    switch (threatLevel.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Load sample data on initial render
  useEffect(() => {
    fetchAllRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                Criminal Suspect Retrieval System
              </h1>
              <p className="text-gray-600">
                Retrieve suspects based on crime location and type
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {useSampleData ? 'Using Sample Data' : 'Using Database'}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            </div>
          )}

          {debugInfo && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <strong>Debug Info:</strong> {debugInfo}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location of Crime</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tamilNaduDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type of Crime</label>
              <select
                value={filters.crimeType}
                onChange={(e) => handleFilterChange('crimeType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {crimeTypes.map(crime => (
                  <option key={crime} value={crime}>{crime}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={fetchSuspects}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Search className="h-4 w-4" />
              )}
              Find Suspects
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button
              onClick={fetchAllRecords}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
            >
              <Database className="h-4 w-4" />
              Fetch All Records
            </button>
            <button
              onClick={checkDatabaseValues}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
            >
              <Filter className="h-4 w-4" />
              Check Values
            </button>
            <button
              onClick={() => setUseSampleData(!useSampleData)}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
            >
              <Download className="h-4 w-4" />
              {useSampleData ? 'Use DB' : 'Use Sample'}
            </button>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Important Notes
            </h3>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Currently using sample data. Switch to database mode when your DB is configured.</li>
              <li>Using partial matching for crime_type and last_location fields</li>
              <li>Click "Fetch All Records" to see all data</li>
              <li>Click "Check Values" to see what's in your data</li>
              <li>Check browser console for detailed information</li>
            </ul>
          </div>
        </div>

        {suspects.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Suspects Found</h2>
            <p className="text-gray-600 mb-6">
              Based on {filters.crimeType} in {filters.location}
              <br />
              <span className="font-semibold">Found {suspects.length} potential suspect{suspects.length !== 1 ? 's' : ''}</span>
            </p>

            <div className="space-y-4">
              {suspects.map((suspect) => (
                <div key={suspect.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{suspect.name}</h3>
                        <p className="text-sm text-gray-600">
                          {suspect.gender}, {suspect.age} years
                        </p>
                        <p className="text-sm text-gray-600">Case ID: {suspect.case_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(suspect.risk_level)}`}>
                        {suspect.risk_level || 'Unknown'} Risk
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatColor(suspect.threat_level)}`}>
                        {suspect.threat_level || 'Unknown'} Threat
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Crime Type:</span> {suspect.crime_type}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Location:</span> {suspect.last_location}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Status:</span> {suspect.current_status || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Total Cases:</span> {suspect.total_cases || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {suspect.arrest_date && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Arrested:</span> {suspect.arrest_date}
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Additional Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Nationality:</span> {suspect.nationality || 'N/A'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span> {suspect.phone_number || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-medium">Associates:</span> {suspect.associates || 'N/A'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Modus Operandi:</span> {suspect.modus_operandi || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {suspects.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No suspects retrieved yet</h3>
            <p className="text-gray-500">Select location and crime type, then click "Find Suspects" to retrieve potential suspects.</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="font-medium text-blue-800 mb-2">Current Filters:</h4>
              <p className="text-blue-700">Location: {filters.location}</p>
              <p className="text-blue-700">Crime Type: {filters.crimeType}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriminalRetrievalSystem;