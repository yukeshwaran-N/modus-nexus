import { useState } from 'react';
import { X, Network, UserCheck, UserX } from 'lucide-react';

interface CriminalLinkProps {
  sourceRecord: any;
  records: any[];
  onLinkCreated: (linkData: any) => void;
  onClose: () => void;
}

export function CriminalLink({ sourceRecord, records, onLinkCreated, onClose }: CriminalLinkProps) {
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [relationship, setRelationship] = useState('associate');
  const [isLinking, setIsLinking] = useState(false);

  const handleCreateLink = () => {
    if (!selectedTarget) return;
    
    setIsLinking(true);
    
    // Simulate API call to create relationship
    setTimeout(() => {
      const linkData = {
        from: sourceRecord.id,
        to: selectedTarget.id,
        relationship: relationship,
        strength: 'medium',
        date_established: new Date().toISOString().split('T')[0],
        sourceName: sourceRecord.name,
        targetName: selectedTarget.name
      };
      
      onLinkCreated(linkData);
      setIsLinking(false);
      onClose();
    }, 500);
  };

  // Filter out the source record from available targets
  const availableRecords = records.filter(record => record.id !== sourceRecord.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Link Criminal Network</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Source Criminal</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Network className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{sourceRecord.name}</p>
              <p className="text-sm text-gray-600">{sourceRecord.case_id} • {sourceRecord.crime_type}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Target Criminal</label>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {availableRecords.map(record => (
              <div
                key={record.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTarget?.id === record.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTarget(record)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedTarget?.id === record.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {selectedTarget?.id === record.id ? (
                      <UserCheck className="h-4 w-4 text-blue-600" />
                    ) : (
                      <UserX className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{record.name}</p>
                    <p className="text-sm text-gray-600">{record.case_id} • {record.crime_type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Type</label>
          <select 
            value={relationship} 
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="associate">Associate</option>
            <option value="family">Family Member</option>
            <option value="business">Business Partner</option>
            <option value="gang">Gang Member</option>
            <option value="mentor">Mentor/Apprentice</option>
            <option value="other">Other Relationship</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateLink}
            disabled={!selectedTarget || isLinking}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              !selectedTarget || isLinking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Network className="h-4 w-4" />
            {isLinking ? 'Creating Link...' : 'Create Link'}
          </button>
        </div>
      </div>
    </div>
  );
} 