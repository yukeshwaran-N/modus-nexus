// src/components/CriminalReport.tsx
import { useState, useRef } from 'react';
import { Download, PieChart, BarChart3 } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  const [activeChart, setActiveChart] = useState<'crime' | 'district'>('crime');
  const reportRef = useRef<HTMLDivElement>(null);

  // Prepare data for charts
  const crimeChartData = {
    labels: reportData.crimeStats.map(crime => crime.type),
    datasets: [
      {
        data: reportData.crimeStats.map(crime => crime.count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 1,
      },
    ],
  };

  const districtChartData = {
    labels: reportData.districtStats.map(district => district.district),
    datasets: [
      {
        label: 'Crimes by District',
        data: reportData.districtStats.map(district => district.crimes),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Download PDF function
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('criminal-report.pdf');
  };

  return (
    <div className="p-6" ref={reportRef}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <div className="flex gap-4">
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
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500">Total Criminals</h3>
          <p className="text-2xl font-bold">{reportData.overview.totalCriminals.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500">In Custody</h3>
          <p className="text-2xl font-bold">{reportData.overview.inCustody.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500">In Jail</h3>
          <p className="text-2xl font-bold">{reportData.overview.inJail.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm text-gray-500">Crime Increase</h3>
          <p className="text-2xl font-bold text-red-600">+{reportData.overview.crimeIncrease}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart Container */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Visual Analytics</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChart('crime')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                  activeChart === 'crime' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <PieChart className="h-4 w-4" />
                Crime Types
              </button>
              <button
                onClick={() => setActiveChart('district')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                  activeChart === 'district' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Districts
              </button>
            </div>
          </div>
          
          <div className="h-64">
            {activeChart === 'crime' ? (
              <Pie data={crimeChartData} options={chartOptions} />
            ) : (
              <Bar data={districtChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Crime Statistics */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Crime Type Distribution</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reportData.crimeStats.map((crime, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">{crime.type}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{crime.count.toLocaleString()}</span>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* District Statistics */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Crime by District</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reportData.districtStats.map((district, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-sm">{district.district}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{district.crimes.toLocaleString()}</span>
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

        {/* Recent Activities */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {reportData.recentActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 hover:bg-gray-50 rounded p-2">
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.case && `Case: ${activity.case}`}
                    {activity.criminal && `Criminal: ${activity.criminal}`}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};