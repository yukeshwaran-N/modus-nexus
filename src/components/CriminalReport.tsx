// src/components/CriminalReport.tsx
import { useState } from 'react';

// Sample report data
const reportData = {
  overview: {
    totalCriminals: 1247,
    inCustody: 543,
    inJail: 482,
    onBail: 222,
    mostCommonCrime: "Financial Fraud",
    crimeIncrease: 12.4,
  },
  crimeStats: [
    { type: "Cyber Crime", count: 187, trend: "up" },
    { type: "Drug Trafficking", count: 142, trend: "down" },
    { type: "Financial Fraud", count: 324, trend: "up" },
    { type: "Chain Snatching", count: 89, trend: "stable" },
    { type: "House Breaking", count: 156, trend: "up" },
    { type: "ATM Fraud", count: 134, trend: "up" },
    { type: "Human Trafficking", count: 67, trend: "down" },
    { type: "Counterfeiting", count: 98, trend: "stable" },
    { type: "Kidnapping", count: 45, trend: "down" },
    { type: "Environmental Crime", count: 23, trend: "up" },
  ],
  districtStats: [
    { district: "Chennai", crimes: 324, trend: "up" },
    { district: "Coimbatore", crimes: 187, trend: "stable" },
    { district: "Madurai", crimes: 156, trend: "up" },
    { district: "Trichy", crimes: 134, trend: "down" },
    { district: "Salem", crimes: 98, trend: "up" },
    { district: "Erode", crimes: 89, trend: "stable" },
    { district: "Vellore", crimes: 76, trend: "down" },
    { district: "Tirunelveli", crimes: 67, trend: "up" },
    { district: "Thanjavur", crimes: 54, trend: "stable" },
    { district: "Rameswaram", crimes: 45, trend: "down" },
  ],
  recentActivities: [
    { action: "New Case Registered", time: "2 hours ago", case: "FRA-2024-125" },
    { action: "Criminal Apprehended", time: "5 hours ago", criminal: "Rajesh Kumar" },
    { action: "Bail Granted", time: "1 day ago", criminal: "Priya Singh" },
    { action: "Case Closed", time: "1 day ago", case: "THE-2024-087" },
    { action: "New Criminal Added", time: "2 days ago", criminal: "Mohan Lal" },
  ]
};

export const CriminalReport = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("lastMonth");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <select 
          className="border rounded-md px-3 py-2"
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
        >
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="lastQuarter">Last Quarter</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">Total Criminals</h3>
          <p className="text-2xl font-bold">{reportData.overview.totalCriminals}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">In Custody</h3>
          <p className="text-2xl font-bold">{reportData.overview.inCustody}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">In Jail</h3>
          <p className="text-2xl font-bold">{reportData.overview.inJail}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm text-gray-500">Crime Increase</h3>
          <p className="text-2xl font-bold text-red-600">+{reportData.overview.crimeIncrease}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crime Statistics */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Crime Type Distribution</h2>
          <div className="space-y-3">
            {reportData.crimeStats.map((crime, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{crime.type}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{crime.count}</span>
                  <span className={`text-xs ${
                    crime.trend === "up" ? "text-red-600" : 
                    crime.trend === "down" ? "text-green-600" : "text-gray-600"
                  }`}>
                    {crime.trend === "up" ? "↑" : crime.trend === "down" ? "↓" : "→"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Statistics */}
        <div className="bg-white p-4 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Crime by District</h2>
          <div className="space-y-3">
            {reportData.districtStats.map((district, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{district.district}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{district.crimes}</span>
                  <span className={`text-xs ${
                    district.trend === "up" ? "text-red-600" : 
                    district.trend === "down" ? "text-green-600" : "text-gray-600"
                  }`}>
                    {district.trend === "up" ? "↑" : district.trend === "down" ? "↓" : "→"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-4 rounded-lg border mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {reportData.recentActivities.map((activity, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">
                  {activity.case && `Case: ${activity.case}`}
                  {activity.criminal && `Criminal: ${activity.criminal}`}
                </p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};