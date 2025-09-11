// src/components/Cases.tsx
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Download, MoreVertical, Loader, Database, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Use the regular supabase client

// Types
interface Case {
  id: string;
  case_id: string;
  title: string;
  status: 'open' | 'closed' | 'under_investigation' | 'pending_trial';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_officer: string;
  created_date: string;
  last_updated: string;
  criminal_count: number;
  crime_type: string;
  location: string;
  description?: string;
}

interface FilterOptions {
  status: string;
  priority: string;
  crime_type: string;
  date_range: string;
}

export const Cases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    priority: '',
    crime_type: '',
    date_range: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const itemsPerPage = 10;

  // Check if cases table exists and fetch cases
  useEffect(() => {
    checkTableExists();
  }, []);

  const checkTableExists = async () => {
    try {
      setLoading(true);
      
      // Try to query the table to see if it exists
      const { error } = await supabase
        .from('cases')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') { // Table doesn't exist error code
          setTableExists(false);
          setError('Cases table does not exist in the database. Please run the migration script first.');
        } else {
          throw error;
        }
      } else {
        setTableExists(true);
        fetchCases();
      }
    } catch (err: any) {
      console.error('Error checking table existence:', err);
      setError(err.message || 'Failed to check database table');
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*');
      
      if (casesError) {
        throw new Error(`Error fetching cases: ${casesError.message}`);
      }

      if (!casesData) {
        // If no data but table exists, show empty state
        setCases([]);
        return;
      }

      // Transform the data to match our Case interface
      const formattedCases: Case[] = casesData.map((caseItem: any) => ({
        id: caseItem.id,
        case_id: caseItem.case_id || `CASE-${caseItem.id.substring(0, 8)}`,
        title: caseItem.title || 'Untitled Case',
        status: (caseItem.status as 'open' | 'closed' | 'under_investigation' | 'pending_trial') || 'open',
        priority: (caseItem.priority as 'low' | 'medium' | 'high' | 'critical') || 'medium',
        assigned_officer: caseItem.assigned_officer || 'Unassigned',
        created_date: caseItem.created_date || caseItem.created_at,
        last_updated: caseItem.last_updated || caseItem.updated_at,
        criminal_count: caseItem.criminal_count || 0,
        crime_type: caseItem.crime_type || 'Unknown',
        location: caseItem.location || 'Unknown',
        description: caseItem.description
      }));

      setCases(formattedCases);
    } catch (err: any) {
      console.error('Error fetching cases:', err);
      setError(err.message || 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assigned_officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.crime_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (!filters.status || caseItem.status === filters.status) &&
      (!filters.priority || caseItem.priority === filters.priority) &&
      (!filters.crime_type || caseItem.crime_type === filters.crime_type);

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'under_investigation': return 'bg-yellow-100 text-yellow-800';
      case 'pending_trial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewCase = () => {
    alert('New Case functionality would open a form here');
  };

  const handleViewDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
    alert(`Viewing details for case: ${caseItem.case_id}\n${caseItem.title}`);
  };

  const handleEditCase = (caseItem: Case) => {
    alert(`Editing case: ${caseItem.case_id}`);
  };

  const handleDownloadReport = () => {
    alert('Downloading cases report...');
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      crime_type: '',
      date_range: ''
    });
    setSearchTerm('');
  };

  const handleCreateTable = async () => {
    try {
      setLoading(true);
      // This would typically be done through a backend API or migration
      alert('Table creation requires database migration. Please run the SQL migration script provided.');
    } catch (err: any) {
      setError(err.message || 'Failed to create table');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading cases...</p>
          </div>
        </div>
      </div>
    );
  }

  if (tableExists === false) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <Database className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Cases Table Not Found</h2>
          <p className="text-yellow-700 mb-4">
            The cases table does not exist in your database. You need to run the migration script first.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleCreateTable}
              className="bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Create Table
            </button>
            <div className="text-sm text-yellow-600">
              <p>Or run this SQL in your Supabase SQL editor:</p>
              <code className="bg-yellow-100 p-2 rounded text-xs block mt-2 text-left overflow-x-auto">
                CREATE TABLE cases (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), case_id TEXT, title TEXT, status TEXT, priority TEXT, assigned_officer TEXT, created_date TIMESTAMP DEFAULT now(), last_updated TIMESTAMP DEFAULT now(), criminal_count INTEGER DEFAULT 0, crime_type TEXT, location TEXT, description TEXT);
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Cases</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchCases}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Case Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all criminal cases</p>
        </div>
        <button 
          onClick={handleNewCase}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          New Case
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cases by ID, title, officer, crime type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Filter className="h-4 w-4" />
              Filters {showFilters ? '▲' : '▼'}
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="pending_trial">Pending Trial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crime Type</label>
              <select
                value={filters.crime_type}
                onChange={(e) => setFilters({...filters, crime_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Financial Fraud">Financial Fraud</option>
                <option value="Cyber Crime">Cyber Crime</option>
                <option value="Drug Trafficking">Drug Trafficking</option>
                <option value="Robbery">Robbery</option>
                <option value="Theft">Theft</option>
                <option value="Assault">Assault</option>
                <option value="Burglary">Burglary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.date_range}
                onChange={(e) => setFilters({...filters, date_range: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Time</option>
                <option value="last_week">Last Week</option>
                <option value="last_month">Last Month</option>
                <option value="last_quarter">Last Quarter</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <p className="text-sm text-gray-600">
          {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View:</span>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'list' | 'grid')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="list">List</option>
            <option value="grid">Grid</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-semibold text-gray-600 bg-gray-50">
          <div className="md:col-span-2">Case ID</div>
          <div className="md:col-span-3">Title</div>
          <div className="md:col-span-1">Status</div>
          <div className="md:col-span-1">Priority</div>
          <div className="md:col-span-2">Assigned Officer</div>
          <div className="md:col-span-2">Last Updated</div>
          <div className="md:col-span-1 text-center">Actions</div>
        </div>

        {/* Cases */}
        {paginatedCases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <Search className="h-12 w-12 text-gray-300 mx-auto" />
            </div>
            <p className="text-lg font-medium mb-2">No cases found</p>
            <p className="text-sm">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filters' 
                : 'No cases available in the database'
              }
            </p>
          </div>
        ) : (
          paginatedCases.map(caseItem => (
            <div key={caseItem.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors items-start md:items-center">
              {/* Case ID */}
              <div className="md:col-span-2">
                <span className="font-mono text-sm text-blue-600 font-medium">{caseItem.case_id}</span>
              </div>
              
              {/* Title and details */}
              <div className="md:col-span-3">
                <p className="font-medium text-gray-800">{caseItem.title}</p>
                <p className="text-xs text-gray-500 mt-1">{caseItem.crime_type} • {caseItem.location}</p>
              </div>
              
              {/* Status badge */}
              <div className="md:col-span-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                  {caseItem.status.replace('_', ' ')}
                </span>
              </div>
              
              {/* Priority badge */}
              <div className="md:col-span-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                  {caseItem.priority}
                </span>
              </div>
              
              {/* Assigned Officer */}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-800">{caseItem.assigned_officer}</p>
              </div>
              
              {/* Last Updated */}
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">
                  {new Date(caseItem.last_updated).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 md:mt-1">
                  {new Date(caseItem.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="md:col-span-1 flex justify-start md:justify-center gap-2 pt-2 md:pt-0">
                <button 
                  onClick={() => handleViewDetails(caseItem)}
                  className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleEditCase(caseItem)}
                  className="text-green-600 hover:text-green-800 transition-colors p-1 rounded hover:bg-green-50"
                  title="Edit Case"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
          </div>
          <div className="flex gap-1 flex-wrap justify-center">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border rounded-md text-sm transition-colors min-w-[40px] ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 py-2">...</span>
            )}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};