// src/components/CriminalReport.tsx
import { useState, useRef, useEffect } from 'react';
import { Download, PieChart, BarChart3, Loader, Upload } from 'lucide-react';
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
import { secureSupabase } from '@/lib/secureSupabase';

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

interface CrimeStat {
  type: string;
  count: number;
  trend: string;
}

interface DistrictStat {
  district: string;
  crimes: number;
  trend: string;
}

interface RecentActivity {
  action: string;
  time: string;
  case?: string;
  criminal?: string;
}

interface ReportData {
  overview: {
    totalCriminals: number;
    inCustody: number;
    inJail: number;
    onBail: number;
    mostCommonCrime: string;
    crimeIncrease: number;
  };
  crimeStats: CrimeStat[];
  districtStats: DistrictStat[];
  recentActivities: RecentActivity[];
}

export const CriminalReport = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("lastMonth");
  const [activeChart, setActiveChart] = useState<'crime' | 'district'>('crime');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReportData();
  }, [selectedTimeframe]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch criminal records
      const { data: criminals, error: criminalsError } = await secureSupabase.select('criminal_records');
      
      if (criminalsError) {
        throw new Error(`Error fetching criminals: ${criminalsError.message}`);
      }

      if (!criminals) {
        throw new Error('No criminal data found');
      }

      // Process data for reports
      const processedData = processCriminalData(criminals);
      setReportData(processedData);
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const processCriminalData = (criminals: any[]): ReportData => {
    // Calculate overview statistics
    const totalCriminals = criminals.length;
    const inCustody = criminals.filter(c => c.current_status === 'In Custody').length;
    const inJail = criminals.filter(c => c.current_status === 'In Jail').length;
    const onBail = criminals.filter(c => c.current_status === 'Out on Bail').length;

    // Calculate crime type statistics
    const crimeTypeCounts: Record<string, number> = {};
    criminals.forEach(criminal => {
      const crimeType = criminal.crime_type || 'Unknown';
      crimeTypeCounts[crimeType] = (crimeTypeCounts[crimeType] || 0) + 1;
    });

    const crimeStats: CrimeStat[] = Object.entries(crimeTypeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({
        type,
        count,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      }));

    // Calculate district statistics (using last_location as district)
    const districtCounts: Record<string, number> = {};
    criminals.forEach(criminal => {
      const location = criminal.last_location || 'Unknown';
      // Extract district from location (simplified)
      const district = location.split(',')[0]?.trim() || 'Unknown';
      districtCounts[district] = (districtCounts[district] || 0) + 1;
    });

    const districtStats: DistrictStat[] = Object.entries(districtCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([district, crimes]) => ({
        district,
        crimes,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      }));

    // Generate recent activities (simulated)
    const recentActivities: RecentActivity[] = criminals
      .sort((a, b) => new Date(b.date_added || b.created_at).getTime() - new Date(a.date_added || a.created_at).getTime())
      .slice(0, 5)
      .map(criminal => ({
        action: 'Criminal Added',
        time: formatTimeDifference(new Date(criminal.date_added || criminal.created_at)),
        criminal: criminal.name,
        case: criminal.case_id
      }));

    return {
      overview: {
        totalCriminals,
        inCustody,
        inJail,
        onBail,
        mostCommonCrime: crimeStats[0]?.type || 'None',
        crimeIncrease: 12.4 // This would need actual comparison data
      },
      crimeStats,
      districtStats,
      recentActivities
    };
  };

  const formatTimeDifference = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Prepare data for charts
  const crimeChartData = {
    labels: reportData?.crimeStats.map(crime => crime.type) || [],
    datasets: [
      {
        data: reportData?.crimeStats.map(crime => crime.count) || [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 1,
      },
    ],
  };

  const districtChartData = {
    labels: reportData?.districtStats.map(district => district.district) || [],
    datasets: [
      {
        label: 'Crimes by District',
        data: reportData?.districtStats.map(district => district.crimes) || [],
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Report</h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchReportData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">No Data Available</h2>
          <p className="text-yellow-700">No criminal records found to generate reports.</p>
        </div>
      </div>
    );
  }

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
            <Upload className="h-4 w-4" />
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
          <h3 className="text-sm text-gray-500">Most Common Crime</h3>
          <p className="text-lg font-bold text-blue-600">{reportData.overview.mostCommonCrime}</p>
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