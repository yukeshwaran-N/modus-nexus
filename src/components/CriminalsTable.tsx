// src/components/CriminalsTable.tsx
import { useCriminalRecords } from '@/hooks/useCriminalRecords'

export function CriminalsTable() {
  const { records, loading, error, deleteCriminalRecord } = useCriminalRecords()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Criminal Database</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left">Case ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Crime Type</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">{record.case_id}</td>
                <td className="px-4 py-3">{record.name}</td>
                <td className="px-4 py-3">{record.crime_type}</td>
                <td className="px-4 py-3">{record.last_location}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteCriminalRecord(record.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}