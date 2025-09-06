// src/components/CriminalsTable.tsx
import { useState, useMemo } from 'react';
import { useCriminalRecords } from '@/hooks/useCriminalRecords';
import { Search, Filter, ArrowUpDown, X, Edit, Eye, Save, ChevronDown, ChevronUp } from 'lucide-react';

// Edit modal component
function EditModal({ record, onSave, onClose }) {
  const [formData, setFormData] = useState(record);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Edit Criminal Record</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case ID</label>
              <input
                type="text"
                value={formData.case_id || ''}
                onChange={(e) => handleChange('case_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
                onChange={(e) => handleChange('age', e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crime Type</label>
              <input
                type="text"
                value={formData.crime_type || ''}
                onChange={(e) => handleChange('crime_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.last_location || ''}
                onChange={(e) => handleChange('last_location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
              </select>
            </div>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modus Operandi</label>
            <textarea
              value={formData.modus_operandi || ''}
              onChange={(e) => handleChange('modus_operandi', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
function ViewModal({ record, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Criminal Record Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

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
function DetailItem({ label, value, fullWidth = false }) {
  if (!value) return null;
  
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
}

export function CriminalsTable() {
  const { records, loading, error, updateCriminalRecord } = useCriminalRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
    let filteredRecords = records.filter(record => {
      // Search across multiple fields
      const matchesSearch = 
        !searchTerm || 
        record.case_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.crime_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.last_location?.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply column filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return record[key]?.toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    // Apply sorting
    if (sortConfig !== null) {
      filteredRecords.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredRecords;
  }, [records, searchTerm, sortConfig, filters]);

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
  const handleSaveEdit = async (updatedData: any) => {
    try {
      await updateCriminalRecord(updatedData);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record. Please try again.');
    }
  };

  // Get unique values for filter dropdowns
  const uniqueValues = (key: string) => {
    return Array.from(new Set(records.map(record => record[key] || '').filter(Boolean))).sort();
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Criminal Database</h2>
        <div className="text-sm text-gray-500">
          {filteredAndSortedRecords.length} of {records.length} records
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
                  No criminal records found matching your criteria
                </td>
              </tr>
            ) : (
              filteredAndSortedRecords.map((record) => (
                <>
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                        {record.current_status}
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
                </>
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