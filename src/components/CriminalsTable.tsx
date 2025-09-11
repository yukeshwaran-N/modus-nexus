import { useState, useMemo, Fragment } from 'react';
import { useCriminalRecords } from '@/hooks/useCriminalRecords';
import { Search, Filter, ArrowUpDown, X, Edit, Eye, Save, ChevronDown, ChevronUp, Brain, Upload, Image as ImageIcon } from 'lucide-react';

// Define TypeScript interfaces
interface CriminalRecord {
  id: string;
  case_id: string;
  name: string;
  age?: number;
  gender?: string;
  phone_number?: string;
  email?: string;
  crime_type: string;
  last_location: string;
  current_status?: string;
  risk_level?: string;
  total_cases?: number;
  arrest_date?: string;
  modus_operandi?: string;
  tools_used?: string;
  associates?: string;
  address?: string;
  image_url?: string; // New field for image
  [key: string]: any;
}

interface EditModalProps {
  record: CriminalRecord;
  onSave: (record: CriminalRecord) => void;
  onClose: () => void;
}

interface ViewModalProps {
  record: CriminalRecord;
  onClose: () => void;
}

interface DetailItemProps {
  label: string;
  value: string | number | undefined;
  fullWidth?: boolean;
}

interface CriminalsTableProps {
  onAskAI?: (criminalData: CriminalRecord) => void;
}

// Edit modal component with image upload
function EditModal({ record, onSave, onClose }: EditModalProps) {
  const [formData, setFormData] = useState<CriminalRecord>(record);
  const [imagePreview, setImagePreview] = useState<string | null>(record.image_url || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof CriminalRecord, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // In a real application, you would upload the image to a server here
      // For this example, we'll just create a local URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setImagePreview(imageDataUrl);
        setFormData(prev => ({ ...prev, image_url: imageDataUrl }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Edit Criminal Record</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Upload Section */}
            <div className="md:col-span-1">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Criminal Photo</h4>
                <div className="flex flex-col items-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Criminal" 
                        className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center mb-2">No image uploaded</p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {imagePreview ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Case ID*</label>
                    <input
                      type="text"
                      value={formData.case_id || ''}
                      onChange={(e) => handleChange('case_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Contact Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone_number || ''}
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={formData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Crime Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Crime Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crime Type*</label>
                    <input
                      type="text"
                      value={formData.crime_type || ''}
                      onChange={(e) => handleChange('crime_type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Location</label>
                    <input
                      type="text"
                      value={formData.last_location || ''}
                      onChange={(e) => handleChange('last_location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <select
                      value={formData.current_status || ''}
                      onChange={(e) => handleChange('current_status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="In Custody">In Custody</option>
                      <option value="Out on Bail">Out on Bail</option>
                      <option value="In Jail">In Jail</option>
                      <option value="Wanted">Wanted</option>
                      <option value="Released">Released</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Additional Details</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                    <select
                      value={formData.risk_level || ''}
                      onChange={(e) => handleChange('risk_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Risk Level</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Cases</label>
                    <input
                      type="number"
                      value={formData.total_cases || 0}
                      onChange={(e) => handleChange('total_cases', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrest Date</label>
                    <input
                      type="date"
                      value={formData.arrest_date || ''}
                      onChange={(e) => handleChange('arrest_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Additional Information</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modus Operandi</label>
                  <textarea
                    value={formData.modus_operandi || ''}
                    onChange={(e) => handleChange('modus_operandi', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tools Used</label>
                  <input
                    type="text"
                    value={formData.tools_used || ''}
                    onChange={(e) => handleChange('tools_used', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Associates</label>
                  <input
                    type="text"
                    value={formData.associates || ''}
                    onChange={(e) => handleChange('associates', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View details modal component
function ViewModal({ record, onClose }: ViewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Criminal Record Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Section */}
          {record.image_url && (
            <div className="md:col-span-1">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Criminal Photo</h4>
                <img 
                  src={record.image_url} 
                  alt="Criminal" 
                  className="w-full h-64 object-cover rounded-lg border border-gray-300"
                />
              </div>
            </div>
          )}
          
          <div className={record.image_url ? "md:col-span-2" : "md:col-span-3"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Basic Information</h4>
                <DetailItem label="Case ID" value={record.case_id} />
                <DetailItem label="Full Name" value={record.name} />
                <DetailItem label="Age" value={record.age} />
                <DetailItem label="Gender" value={record.gender} />
                <DetailItem label="Phone" value={record.phone_number} />
                <DetailItem label="Email" value={record.email} />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Case Details</h4>
                <DetailItem label="Crime Type" value={record.crime_type} />
                <DetailItem label="Location" value={record.last_location} />
                <DetailItem label="Status" value={record.current_status} />
                <DetailItem label="Risk Level" value={record.risk_level} />
                <DetailItem label="Total Cases" value={record.total_cases} />
                <DetailItem label="Arrest Date" value={record.arrest_date} />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">Additional Information</h4>
              <DetailItem label="Modus Operandi" value={record.modus_operandi} fullWidth />
              <DetailItem label="Tools Used" value={record.tools_used} fullWidth />
              <DetailItem label="Associates" value={record.associates} fullWidth />
              <DetailItem label="Address" value={record.address} fullWidth />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper component for detail items
function DetailItem({ label, value, fullWidth = false }: DetailItemProps) {
  if (value === undefined || value === null || value === '') return null;
  
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

// The rest of the CriminalsTable component remains the same as in your original code
// ... (CriminalsTable component code)

export function CriminalsTable({ onAskAI }: CriminalsTableProps) {
  const { records, loading, error, updateCriminalRecord } = useCriminalRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CriminalRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<CriminalRecord | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // FIXED: Handle different data formats from useCriminalRecords
  // FIXED: Handle different data formats from useCriminalRecords with proper typing
const safeRecords = useMemo(() => {
  console.log('Raw records from hook:', records);
  
  // Handle case where records might be null, undefined
  if (!records) {
    console.log('Records is null or undefined');
    return [];
  }
  
  // Handle case where records is an object with data property
  if (typeof records === 'object' && records !== null && !Array.isArray(records)) {
    console.log('Records is an object, checking for data property');
    
    // Use type assertion to handle the object case
    const recordsObj = records as any;
    
    // If records has a data property that is an array
    if (recordsObj.data && Array.isArray(recordsObj.data)) {
      console.log('Found data array in records object');
      return recordsObj.data.map((record: any, index: number) => ({
        ...record,
        id: record.id || `record-${index}-${Math.random().toString(36).substr(2, 9)}`
      })) as CriminalRecord[];
    }
    
    // If records is an object but we can convert it to an array
    if (Object.keys(recordsObj).length > 0) {
      console.log('Converting object to array');
      // Check if it's an object with numeric keys (like {0: {}, 1: {}})
      const hasNumericKeys = Object.keys(recordsObj).every(key => !isNaN(Number(key)));
      
      if (hasNumericKeys) {
        return Object.values(recordsObj).map((record: any, index: number) => ({
          ...record,
          id: record.id || `record-${index}-${Math.random().toString(36).substr(2, 9)}`
        })) as CriminalRecord[];
      }
      
      // If it's a single record object, wrap it in an array
      if (recordsObj.case_id || recordsObj.name) {
        console.log('Single record object found, wrapping in array');
        return [{
          ...recordsObj,
          id: recordsObj.id || `record-0-${Math.random().toString(36).substr(2, 9)}`
        }] as CriminalRecord[];
      }
    }
    
    console.log('Records is an object but cannot be converted to array:', recordsObj);
    return [];
  }
  
  // Handle case where records is already an array
  if (Array.isArray(records)) {
    console.log('Records is already an array');
    return records.map((record, index) => ({
      ...record,
      id: record.id || `record-${index}-${Math.random().toString(36).substr(2, 9)}`
    })) as CriminalRecord[];
  }
  
  console.error('Unknown records format:', records);
  return [];
}, [records]);
  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filteredRecords = safeRecords.filter(record => {
      // Search across multiple fields
      const matchesSearch = 
        !searchTerm || 
        (record.case_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.crime_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.last_location || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Apply column filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const recordValue = record[key];
        return recordValue !== undefined && recordValue !== null && 
               recordValue.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    // Apply sorting
    if (sortConfig !== null) {
      filteredRecords.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof CriminalRecord];
        const bValue = b[sortConfig.key as keyof CriminalRecord];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        // Convert to string for comparison
        const aString = aValue.toString();
        const bString = bValue.toString();
        
        if (aString < bString) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aString > bString) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredRecords;
  }, [safeRecords, searchTerm, sortConfig, filters]);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Handle edit save
  const handleSaveEdit = async (updatedData: CriminalRecord) => {
    try {
      const { id, ...updates } = updatedData;
      await updateCriminalRecord(Number(id), updates);  
      setEditingRecord(null);
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record. Please try again.');
    }
  };

  // Get unique values for filter dropdowns
  const uniqueValues = (key: keyof CriminalRecord) => {
    return Array.from(
      new Set(safeRecords.map(record => record[key] || '').filter(Boolean))
    ).sort() as string[];
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-2xl p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading criminal records...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg">
          <h3 className="font-semibold mb-2">Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Criminal Database</h2>
        <div className="text-sm text-gray-500">
          {filteredAndSortedRecords.length} of {safeRecords.length} records
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by ID, name, crime type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </button>
          )}
        </div>

        {/* Column Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case ID</label>
              <input
                type="text"
                value={filters.case_id || ''}
                onChange={(e) => handleFilterChange('case_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Filter by ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={filters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Filter by name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crime Type</label>
              <select
                value={filters.crime_type || ''}
                onChange={(e) => handleFilterChange('crime_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All crime types</option>
                {uniqueValues('crime_type').map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.current_status || ''}
                onChange={(e) => handleFilterChange('current_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All statuses</option>
                {uniqueValues('current_status').map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Details
              </th>
              {['case_id', 'name', 'crime_type', 'last_location', 'current_status', 'actions'].map((column) => (
                <th 
                  key={column} 
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => column !== 'actions' && handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {column.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {column !== 'actions' && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                    {sortConfig?.key === column && (
                      <span className="text-xs">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {safeRecords.length === 0 ? 'No criminal records found' : 'No records matching your criteria'}
                </td>
              </tr>
            ) : (
              filteredAndSortedRecords.map((record) => (
                <Fragment key={record.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowExpansion(record.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedRows.has(record.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium">{record.case_id}</td>
                    <td className="px-4 py-3">{record.name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {record.crime_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.last_location}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.current_status === 'In Custody' ? 'bg-green-100 text-green-800' :
                        record.current_status === 'Wanted' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.current_status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewingRecord(record)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingRecord(record)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                          title="Edit Record"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {onAskAI && (
                          <button
                            onClick={() => onAskAI(record)}
                            className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                            title="Ask AI Analysis"
                          >
                            <Brain className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(record.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><span className="font-medium">Age:</span> {record.age || 'N/A'}</div>
                          <div><span className="font-medium">Gender:</span> {record.gender || 'N/A'}</div>
                          <div><span className="font-medium">Risk Level:</span> {record.risk_level || 'N/A'}</div>
                          <div><span className="font-medium">Total Cases:</span> {record.total_cases || '0'}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <EditModal
          record={editingRecord}
          onSave={handleSaveEdit}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* View Modal */}
      {viewingRecord && (
        <ViewModal
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </div>
  );
}