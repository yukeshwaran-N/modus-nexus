// src/components/Cases.tsx
import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Edit, Download, MoreVertical } from 'lucide-react';

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
  const itemsPerPage = 5;

  // Sample data - in real app, this would come from API
  const sampleCases: Case[] = [
    {
      id: '1',
      case_id: 'FRA-2024-001',
      title: 'Multi-state Financial Fraud',
      status: 'under_investigation',
      priority: 'high',
      assigned_officer: 'Inspector Rajesh',
      created_date: '2024-01-15',
      last_updated: '2024-03-20',
      criminal_count: 3,
      crime_type: 'Financial Fraud',
      location: 'Chennai'
    },
    {
      id: '2',
      case_id: 'CBR-2024-002',
      title: 'Cyber Attack on Bank Systems',
      status: 'open',
      priority: 'critical',
      assigned_officer: 'Cyber Crime Unit',
      created_date: '2024-02-10',
      last_updated: '2024-03-22',
      criminal_count: 5,
      crime_type: 'Cyber Crime',
      location: 'Bangalore'
    },
    {
      id: '3',
      case_id: 'DRG-2024-003',
      title: 'International Drug Trafficking',
      status: 'pending_trial',
      priority: 'high',
      assigned_officer: 'Narcotics Division',
      created_date: '2024-01-05',
      last_updated: '2024-03-18',
      criminal_count: 8,
      crime_type: 'Drug Trafficking',
      location: 'Mumbai'
    },
    {
      id: '4',
      case_id: 'THE-2024-004',
      title: 'Jewelry Store Heist',
      status: 'closed',
      priority: 'medium',
      assigned_officer: 'Inspector Kumar',
      created_date: '2024-02-20',
      last_updated: '2024-03-15',
      criminal_count: 2,
      crime_type: 'Robbery',
      location: 'Delhi'
    },
    {
      id: '5',
      case_id: 'FRA-2024-005',
      title: 'Credit Card Fraud Ring',
      status: 'open',
      priority: 'high',
      assigned_officer: 'Inspector Singh',
      created_date: '2024-03-01',
      last_updated: '2024-03-25',
      criminal_count: 4,
      crime_type: 'Financial Fraud',
      location: 'Mumbai'
    },
    {
      id: '6',
      case_id: 'CBR-2024-006',
      title: 'Data Breach Investigation',
      status: 'under_investigation',
      priority: 'critical',
      assigned_officer: 'Cyber Crime Unit',
      created_date: '2024-02-15',
      last_updated: '2024-03-23',
      criminal_count: 3,
      crime_type: 'Cyber Crime',
      location: 'Hyderabad'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCases(sampleCases);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = 
      caseItem.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.assigned_officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.crime_type.toLowerCase().includes(searchTerm.toLowerCase());

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
    // In a real app, this would open a modal or navigate to a form
  };

  const handleViewDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
    alert(`Viewing details for case: ${caseItem.case_id}\n${caseItem.title}`);
    // In a real app, this would open a modal or navigate to details page
  };

  const handleEditCase = (caseItem: Case) => {
    alert(`Editing case: ${caseItem.case_id}`);
    // In a real app, this would open an edit form
  };

  const handleDownloadReport = () => {
    alert('Downloading cases report...');
    // In a real app, this would generate and download a PDF/CSV
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Case Management</h1>
        <button 
          onClick={handleNewCase}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Case
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cases by ID, title, officer, or crime type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {viewMode === 'list' ? 'Grid View' : 'List View'}
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
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

      {/* Cases List */}
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-semibold text-gray-600 bg-gray-50">
          <div className="col-span-2">Case ID</div>
          <div className="col-span-3">Title</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-2">Assigned Officer</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Cases */}
        {paginatedCases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No cases found matching your criteria
          </div>
        ) : (
          paginatedCases.map(caseItem => (
            <div key={caseItem.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="col-span-2 font-medium text-blue-600">{caseItem.case_id}</div>
              <div className="col-span-3">{caseItem.title}</div>
              <div className="col-span-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                  {caseItem.status.replace('_', ' ')}
                </span>
              </div>
              <div className="col-span-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                  {caseItem.priority}
                </span>
              </div>
              <div className="col-span-2 text-sm text-gray-600">{caseItem.assigned_officer}</div>
              <div className="col-span-2 text-sm text-gray-600">
                {new Date(caseItem.last_updated).toLocaleDateString()}
              </div>
              <div className="col-span-1">
                <div className="flex gap-2">
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
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};