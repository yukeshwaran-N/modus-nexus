// src/components/CriminalDataEntry.tsx
import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, UserPlus, X, Download, FileUp, AlertCircle, Square, Shield, ShieldOff } from 'lucide-react';
import { secureSupabase } from '@/lib/secureSupabase';
import * as XLSX from 'xlsx';

// Criminal record type
interface CriminalData {
  case_id: string;
  name: string;
  age: number;
  gender: string;
  phone_number: string;
  email: string;
  nationality: string;
  crime_type: string;
  modus_operandi: string;
  tools_used: string;
  associates: string;
  connected_criminals: string;
  case_status: string;
  current_status: string;
  last_location: string;
  arrest_date: string;
  bail_date: string;
  bio: string;
  total_cases: number;
  legal_status: string;
  known_associates: string;
  case_progress_timeline: string;
  address: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  risk_level: string;
  threat_level: string;
  criminal_photo_url?: string;
  evidence_files_urls?: string[];
  date_added?: string;
}

// Helper functions for CSV parsing
const detectDelimiter = (line: string): string => {
  const delimiters = [',', ';', '\t', '|'];
  const counts = delimiters.map(delim => ({
    delim,
    count: line.split(delim).length
  }));
  
  return counts.reduce((prev, current) => 
    current.count > prev.count ? current : prev
  ).delim;
};

const cleanCSVValue = (value: string): string => {
  if (!value) return '';
  return value
    .trim()
    .replace(/^['"]|['"]$/g, '') // Remove surrounding quotes
    .replace(/\uFEFF/g, '') // Remove BOM character
    .replace(/\r/g, '') // Remove carriage returns
    .trim();
};

const parseCSVLine = (line: string, delimiter: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(cleanCSVValue(current));
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(cleanCSVValue(current));
  return result;
};

export default function CriminalDataEntry() {
  const [activeTab, setActiveTab] = useState<'manual' | 'excel'>('manual');
  const [formData, setFormData] = useState<Partial<CriminalData>>({});
  const [criminalPhoto, setCriminalPhoto] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [importResult, setImportResult] = useState<{ success: number; errors: number }>({ success: 0, errors: 0 });
  const [isImportCancelled, setIsImportCancelled] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState({
    enabled: false,
    keyLength: 0,
    details: ''
  });
  const [importError, setImportError] = useState<string>(''); // Added missing importError state
  const criminalPhotoInputRef = useRef<HTMLInputElement>(null);
  const evidenceInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkEncryptionStatus = () => {
      const status = secureSupabase.getEncryptionStatus();
      setEncryptionStatus({
        enabled: status.enabled,
        keyLength: status.keyLength,
        details: status.enabled ? 
          `Encryption is active with a ${status.keyLength}-character key` :
          'Encryption is not properly configured. Set VITE_ENCRYPTION_KEY in your environment variables.'
      });
    };
    checkEncryptionStatus();
  }, []);

  const handleInputChange = (field: keyof CriminalData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCriminalPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCriminalPhoto(file);
  };

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEvidenceFiles(prev => [...prev, ...files]);
  };

  const removeEvidenceFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFileToStorage = async (file: File, folder: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await secureSupabase.raw.storage
        .from('criminal-records')
        .upload(filePath, file);

      if (error) throw error;

      const { data } = secureSupabase.raw.storage
        .from('criminal-records')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let criminalPhotoUrl = '';
      let evidenceUrls: string[] = [];

      if (criminalPhoto) {
        try {
          criminalPhotoUrl = await uploadFileToStorage(criminalPhoto, 'criminal-photos');
          setUploadProgress(33);
        } catch (error) {
          console.warn('Failed to upload criminal photo:', error);
        }
      }

      if (evidenceFiles.length > 0) {
        for (let i = 0; i < evidenceFiles.length; i++) {
          try {
            const url = await uploadFileToStorage(evidenceFiles[i], 'evidence');
            evidenceUrls.push(url);
            setUploadProgress(33 + Math.round((i + 1) / evidenceFiles.length * 33));
          } catch (error) {
            console.warn('Failed to upload evidence file:', error);
          }
        }
      }

      const insertData: Partial<CriminalData> = {
        case_id: formData.case_id,
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone_number: formData.phone_number,
        email: formData.email,
        nationality: formData.nationality,
        crime_type: formData.crime_type,
        modus_operandi: formData.modus_operandi,
        tools_used: formData.tools_used,
        associates: formData.associates,
        connected_criminals: formData.connected_criminals,
        case_status: formData.case_status,
        current_status: formData.current_status,
        last_location: formData.last_location,
        arrest_date: formData.arrest_date,
        bail_date: formData.bail_date,
        bio: formData.bio,
        total_cases: formData.total_cases,
        legal_status: formData.legal_status,
        known_associates: formData.known_associates,
        case_progress_timeline: formData.case_progress_timeline,
        address: formData.address,
        address_line: formData.address_line,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        risk_level: formData.risk_level,
        threat_level: formData.threat_level,
        criminal_photo_url: criminalPhotoUrl || null,
        evidence_files_urls: evidenceUrls.length > 0 ? evidenceUrls : null,
        date_added: new Date().toISOString()
      };

      const { error, data } = await secureSupabase.insert('criminal_records', insertData);

      if (error) {
        console.error('Database insert error:', error);
        if (error.code === '42501') {
          throw new Error(
            'RLS Policy Error: Please check Supabase RLS policies for criminal_records table'
          );
        }
        throw error;
      }

      setUploadProgress(100);
      alert('Criminal record added successfully!');
      resetForm();

    } catch (error: any) {
      console.error('Error adding record:', error);
      alert('Error adding record: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Replace the handleExcelImport function with this updated version

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setImportStatus('processing');
    setImportProgress(0);
    setImportResult({ success: 0, errors: 0 });
    setImportError('');
    setIsImportCancelled(false);
  
    try {
      console.log('=== CSV IMPORT DEBUG START ===');
      console.log('File name:', file.name);
      console.log('File type:', file.type);
      console.log('File size:', file.size, 'bytes');
  
      let data: any[] = [];
      
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        console.log('Processing CSV file');
        
        const text = await file.text();
        console.log('Raw file content (first 500 chars):', text.substring(0, 500));
        
        const cleanedText = text.replace(/\uFEFF/g, '').replace(/\r/g, '');
        const lines = cleanedText.split('\n').filter(line => line.trim() !== '');
        
        console.log('Number of lines after cleaning:', lines.length);
  
        if (lines.length <= 1) {
          throw new Error('CSV file is empty or has no data rows.');
        }
        
        const firstLine = lines[0];
        const delimiter = detectDelimiter(firstLine);
        console.log('Detected delimiter:', delimiter);
        
        const headers = parseCSVLine(firstLine, delimiter).map(header => 
          header.toLowerCase().replace(/\s+/g, '_')
        );
        
        console.log('Cleaned headers:', headers);
  
        if (headers.length === 0) {
          throw new Error('No headers found in CSV file');
        }
  
        // Process data rows
        for (let i = 1; i < lines.length; i++) {
          if (isImportCancelled) break;
          if (!lines[i].trim()) continue;
  
          const values = parseCSVLine(lines[i], delimiter);
          
          const rowData: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            if (index < values.length) {
              rowData[header] = values[index] || '';
            } else {
              rowData[header] = '';
            }
          });
          
          data.push(rowData);
        }
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        data = XLSX.utils.sheet_to_json(worksheet);
      }
  
      console.log('Number of records parsed:', data.length);
  
      if (data.length === 0) {
        throw new Error('No valid data found in the file.');
      }
  
      let successCount = 0;
      let errorCount = 0;
      const errorMessages: string[] = [];
  
      // DEBUG: Let's check what columns we're working with
      if (data.length > 0) {
        console.log('First row keys:', Object.keys(data[0]));
        console.log('First row values:', data[0]);
      }
  
      // Process each row
      for (let i = 0; i < data.length; i++) {
        if (isImportCancelled) {
          setImportStatus('idle');
          break;
        }
  
        try {
          const row: any = data[i];
          if (!row || Object.keys(row).length === 0) continue;
          
          // REQUIRED: Check if we have at least a name
          if (!row.name && !row.full_name && !row.fullname) {
            throw new Error('Missing required field: name. Available fields: ' + Object.keys(row).join(', '));
          }
  
          // Function to safely trim values for database constraints
          const safeValue = (value: any, maxLength: number = 255) => {
            if (value === null || value === undefined) return '';
            const strValue = String(value);
            
            // DEBUG: Log if we're trimming any values
            if (strValue.length > maxLength) {
              console.warn(`Trimming value for field: ${strValue.substring(0, 50)}... from ${strValue.length} to ${maxLength} chars`);
            }
            
            return strValue.length > maxLength ? strValue.substring(0, maxLength) : strValue;
          };
  
          // DEBUG: Let's check the case_id specifically since it's likely the culprit
          const rawCaseId = row.case_id || row.caseid || row.case || `IMP-${Date.now()}-${i}`;
          console.log(`Row ${i+1} case_id:`, rawCaseId, 'Length:', rawCaseId.length);
  
          const insertData: Partial<CriminalData> = {
            case_id: safeValue(rawCaseId, 15),
            name: safeValue(row.name || row.full_name || row.fullname || 'Unknown Criminal', 100),
            age: parseInt(row.age || row.criminal_age || '0') || 0,
            gender: safeValue((row.gender || row.sex || 'Male').toString().charAt(0).toUpperCase(), 1),
            phone_number: safeValue(row.phone_number || row.phone || row.mobile || row.contact || '', 15),
            email: safeValue(row.email || row.email_address || '', 100),
            nationality: safeValue(row.nationality || row.country || 'Indian', 50),
            crime_type: safeValue(row.crime_type || row.crime || 'Unknown Crime', 50),
            modus_operandi: safeValue(row.modus_operandi || row.modus || row.method || '', 500),
            tools_used: safeValue(row.tools_used || row.tools || row.weapons || '', 200),
            associates: safeValue(row.associates || row.partners || '', 200),
            connected_criminals: safeValue(row.connected_criminals || row.connections || '', 200),
            case_status: safeValue(row.case_status || row.status || 'Under Investigation', 50),
            current_status: safeValue(row.current_status || 'In Custody', 50),
            last_location: safeValue(row.last_location || row.location || '', 100),
            arrest_date: safeValue(row.arrest_date || row.arrest || '', 20),
            bail_date: safeValue(row.bail_date || row.bail || '', 20),
            bio: safeValue(row.bio || row.description || '', 1000),
            total_cases: parseInt(row.total_cases || row.cases || '0') || 0,
            legal_status: safeValue(row.legal_status || 'Under Investigation', 50),
            known_associates: safeValue(row.known_associates || row.associates || '', 200),
            case_progress_timeline: safeValue(row.case_progress_timeline || row.timeline || '', 500),
            address: safeValue(row.address || '', 200),
            address_line: safeValue(row.address_line || '', 200),
            city: safeValue(row.city || '', 50),
            state: safeValue(row.state || 'Tamil Nadu', 50),
            country: safeValue(row.country || 'India', 50),
            risk_level: safeValue(row.risk_level || 'Medium', 20),
            threat_level: safeValue(row.threat_level || 'Medium', 20),
            date_added: new Date().toISOString()
          };
  
          // DEBUG: Check the final case_id length
          console.log(`Row ${i+1} final case_id:`, insertData.case_id, 'Length:', insertData.case_id?.length);
  
          const { error } = await secureSupabase.insert('criminal_records', insertData);
  
          if (error) {
            console.error(`Database error for row ${i + 1}:`, error);
            
            // Enhanced error parsing to identify the exact column
            if (error.message.includes('too long for type character varying')) {
              const match = error.message.match(/column "([^"]+)"/);
              const columnName = match ? match[1] : 'unknown';
              const lengthMatch = error.message.match(/character varying\((\d+)\)/);
              const maxLength = lengthMatch ? lengthMatch[1] : 'unknown';
              
              errorMessages.push(`Row ${i + 1}: Value too long for ${columnName} (max ${maxLength} chars)`);
              console.error(`Column causing error: ${columnName}, Max length: ${maxLength}`);
            } else {
              errorMessages.push(`Row ${i + 1}: ${error.message}`);
            }
            
            errorCount++;
          } else {
            successCount++;
          }
  
        } catch (rowError: any) {
          console.error(`Error processing row ${i + 1}:`, rowError);
          errorMessages.push(`Row ${i + 1}: ${rowError.message}`);
          errorCount++;
        }
  
        setImportProgress(Math.round(((i + 1) / data.length) * 100));
        setImportResult({ success: successCount, errors: errorCount });
      }
  
      console.log('=== CSV IMPORT DEBUG END ===');
  
      if (!isImportCancelled) {
        if (successCount > 0) {
          setImportStatus('success');
          alert(`Import completed! Success: ${successCount}, Errors: ${errorCount}`);
        } else {
          setImportStatus('error');
          const errorSummary = errorMessages.slice(0, 5).join('\n');
          setImportError(errorSummary);
          alert(`Import failed. All rows had errors.\n\nFirst few errors:\n${errorSummary}`);
        }
      }
  
    } catch (error: any) {
      console.error('File import error:', error);
      setImportStatus('error');
      setImportError(error.message);
      alert('Error importing file: ' + error.message);
    } finally {
      if (excelInputRef.current) {
        excelInputRef.current.value = '';
      }
    }
  };

  const cancelImport = () => {
    setIsImportCancelled(true);
    setImportStatus('idle');
  };

  const resetForm = () => {
    setFormData({});
    setCriminalPhoto(null);
    setEvidenceFiles([]);
    if (criminalPhotoInputRef.current) criminalPhotoInputRef.current.value = '';
    if (evidenceInputRef.current) evidenceInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const templateData = [
      ['case_id', 'name', 'age', 'gender', 'phone_number', 'email', 'nationality', 
       'crime_type', 'modus_operandi', 'tools_used', 'associates', 'connected_criminals',
       'case_status', 'current_status', 'last_location', 'arrest_date', 'bail_date',
       'bio', 'total_cases', 'legal_status', 'known_associates', 'case_progress_timeline',
       'address', 'address_line', 'city', 'state', 'country', 'risk_level', 'threat_level'],
      ['TN-2024-001', 'John Doe', '35', 'Male', '+919876543210', 'john@example.com', 'Indian', 
       'Robbery', 'Night time breaking', 'Crowbar, Gloves', 'Jane Smith, Mike Johnson', 'Raj Kumar',
       'Under Investigation', 'In Custody', 'Chennai', '2024-01-15', '2024-02-01',
       'Known criminal with multiple offenses', '3', 'Under Trial', 'Sanjay, Ramesh', 'Arrested on Jan 15, 2024',
       '123 Main Street', 'Anna Nagar', 'Chennai', 'Tamil Nadu', 'India', 'High', 'Medium']
    ];

    const csvContent = templateData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'criminal_data_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criminal Data Entry System</h1>
          <p className="text-gray-600">Add new criminal records manually or import from Excel/CSV</p>
          
          <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm ${
            encryptionStatus.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {encryptionStatus.enabled ? <Shield className="h-4 w-4 mr-2" /> : <ShieldOff className="h-4 w-4 mr-2" />}
            <span>Encryption: {encryptionStatus.enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          
          {!encryptionStatus.enabled && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Warning: Encryption is not properly configured. Set VITE_ENCRYPTION_KEY in environment variables.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-6 py-4 font-medium ${
                activeTab === 'manual'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus className="h-5 w-5" />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('excel')}
              className={`flex items-center gap-2 px-6 py-4 font-medium ${
                activeTab === 'excel'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-5 w-5" />
              Excel/CSV Import
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'manual' ? (
              <ManualEntryForm
                formData={formData}
                criminalPhoto={criminalPhoto}
                evidenceFiles={evidenceFiles}
                onInputChange={handleInputChange}
                onCriminalPhotoUpload={handleCriminalPhotoUpload}
                onEvidenceUpload={handleEvidenceUpload}
                onRemoveEvidence={removeEvidenceFile}
                onSubmit={handleManualSubmit}
                isSubmitting={isSubmitting}
                uploadProgress={uploadProgress}
                criminalPhotoInputRef={criminalPhotoInputRef}
                evidenceInputRef={evidenceInputRef}
              />
            ) : (
              <ExcelImport
                onExcelImport={handleExcelImport}
                onDownloadTemplate={downloadTemplate}
                onCancelImport={cancelImport}
                excelInputRef={excelInputRef}
                importStatus={importStatus}
                importProgress={importProgress}
                importResult={importResult}
                isImportCancelled={isImportCancelled}
                importError={importError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Manual Entry Form Component
function ManualEntryForm({
  formData,
  criminalPhoto,
  evidenceFiles,
  onInputChange,
  onCriminalPhotoUpload,
  onEvidenceUpload,
  onRemoveEvidence,
  onSubmit,
  isSubmitting,
  uploadProgress,
  criminalPhotoInputRef,
  evidenceInputRef
}: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isSubmitting && (
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Uploading files...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          <InputField label="Case ID" value={formData.case_id} onChange={(v) => onInputChange('case_id', v)} required />
          <InputField label="Full Name" value={formData.name} onChange={(v) => onInputChange('name', v)} required />
          <InputField label="Age" type="number" value={formData.age} onChange={(v) => onInputChange('age', v)} />
          <SelectField label="Gender" value={formData.gender} onChange={(v) => onInputChange('gender', v)} options={['Male', 'Female', 'Other']} />
          <InputField label="Phone Number" value={formData.phone_number} onChange={(v) => onInputChange('phone_number', v)} />
          <InputField label="Email" type="email" value={formData.email} onChange={(v) => onInputChange('email', v)} />
          <InputField label="Nationality" value={formData.nationality} onChange={(v) => onInputChange('nationality', v)} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Crime Details</h3>
          <InputField label="Crime Type" value={formData.crime_type} onChange={(v) => onInputChange('crime_type', v)} required />
          <TextAreaField label="Modus Operandi" value={formData.modus_operandi} onChange={(v) => onInputChange('modus_operandi', v)} />
          <InputField label="Tools Used" value={formData.tools_used} onChange={(v) => onInputChange('tools_used', v)} />
          <InputField label="Associates" value={formData.associates} onChange={(v) => onInputChange('associates', v)} />
          <InputField label="Connected Criminals" value={formData.connected_criminals} onChange={(v) => onInputChange('connected_criminals', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          <InputField label="Case ID" value={formData.case_id} onChange={(v) => onInputChange('case_id', v)} required />
          <InputField label="Full Name" value={formData.name} onChange={(v) => onInputChange('name', v)} required />
          <InputField label="Age" type="number" value={formData.age} onChange={(v) => onInputChange('age', v)} />
          <SelectField label="Gender" value={formData.gender} onChange={(v) => onInputChange('gender', v)} options={['Male', 'Female', 'Other']} />
          <InputField label="Phone Number" value={formData.phone_number} onChange={(v) => onInputChange('phone_number', v)} />
          <InputField label="Email" type="email" value={formData.email} onChange={(v) => onInputChange('email', v)} />
          <InputField label="Nationality" value={formData.nationality} onChange={(v) => onInputChange('nationality', v)} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Crime Details</h3>
          <InputField label="Crime Type" value={formData.crime_type} onChange={(v) => onInputChange('crime_type', v)} required />
          <TextAreaField label="Modus Operandi" value={formData.modus_operandi} onChange={(v) => onInputChange('modus_operandi', v)} />
          <InputField label="Tools Used" value={formData.tools_used} onChange={(v) => onInputChange('tools_used', v)} />
          <InputField label="Associates" value={formData.associates} onChange={(v) => onInputChange('associates', v)} />
          <InputField label="Connected Criminals" value={formData.connected_criminals} onChange={(v) => onInputChange('connected_criminals', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Case Status</h3>
          <SelectField label="Case Status" value={formData.case_status} onChange={(v) => onInputChange('case_status', v)} options={['Under Investigation', 'Solved', 'Under Trial', 'Closed']} />
          <SelectField label="Current Status" value={formData.current_status} onChange={(v) => onInputChange('current_status', v)} options={['In Custody', 'Out on Bail', 'In Jail', 'Wanted']} />
          <InputField label="Last Known Location" value={formData.last_location} onChange={(v) => onInputChange('last_location', v)} />
          <InputField label="Arrest Date" type="date" value={formData.arrest_date} onChange={(v) => onInputChange('arrest_date', v)} />
          <InputField label="Bail Date" type="date" value={formData.bail_date} onChange={(v) => onInputChange('bail_date', v)} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
          <InputField label="Total Cases" type="number" value={formData.total_cases} onChange={(v) => onInputChange('total_cases', v)} />
          <InputField label="Legal Status" value={formData.legal_status} onChange={(v) => onInputChange('legal_status', v)} />
          <InputField label="Known Associates" value={formData.known_associates} onChange={(v) => onInputChange('known_associates', v)} />
          <SelectField label="Risk Level" value={formData.risk_level} onChange={(v) => onInputChange('risk_level', v)} options={['Low', 'Medium', 'High', 'Very High']} />
          <SelectField label="Threat Level" value={formData.threat_level} onChange={(v) => onInputChange('threat_level', v)} options={['Low', 'Medium', 'High', 'Critical', 'Extreme']} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Address Line" value={formData.address_line} onChange={(v) => onInputChange('address_line', v)} />
          <InputField label="City" value={formData.city} onChange={(v) => onInputChange('city', v)} />
          <InputField label="State" value={formData.state} onChange={(v) => onInputChange('state', v)} />
          <InputField label="Country" value={formData.country} onChange={(v) => onInputChange('country', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <TextAreaField label="Biography" value={formData.bio} onChange={(v) => onInputChange('bio', v)} rows={3} />
        <TextAreaField label="Case Progress Timeline" value={formData.case_progress_timeline} onChange={(v) => onInputChange('case_progress_timeline', v)} rows={3} />
        <TextAreaField label="Full Address" value={formData.address} onChange={(v) => onInputChange('address', v)} rows={2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Criminal Photo</h3>
          <FileUpload
            accept="image/*"
            onChange={onCriminalPhotoUpload}
            file={criminalPhoto}
            label="Upload Criminal Photo"
            inputRef={criminalPhotoInputRef}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Evidence Files</h3>
          <FileUpload
            accept="*"
            multiple
            onChange={onEvidenceUpload}
            files={evidenceFiles}
            onRemove={onRemoveEvidence}
            label="Upload Evidence Files"
            inputRef={evidenceInputRef}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Record...' : 'Add Criminal Record'}
        </button>
      </div>
    </form>
  );
}

// Excel Import Component
function ExcelImport({ 
  onExcelImport, 
  onDownloadTemplate, 
  onCancelImport,
  excelInputRef, 
  importStatus, 
  importProgress, 
  importResult,
  isImportCancelled
}: any) {
  return (
    <div className="text-center space-y-6">
      <div className="bg-blue-50 rounded-2xl p-8">
        <FileUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Import from Excel/CSV</h3>
        <p className="text-gray-600 mb-4">
          Upload an Excel or CSV file with criminal data. Download the template below for the correct format.
        </p>
        
        <input
          ref={excelInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onExcelImport}
          className="hidden"
        />
        
        <button
          onClick={() => excelInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 mb-4"
          disabled={importStatus === 'processing'}
        >
          {importStatus === 'processing' ? 'Processing...' : 'Choose File'}
        </button>
        
        <div className="text-sm text-gray-500">
          Supported formats: .xlsx, .xls, .csv
        </div>
      </div>

      {importStatus === 'processing' && (
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Importing records...</span>
            <span>{importProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>
          
          <div className="mt-4">
            <button
              onClick={onCancelImport}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 mx-auto text-sm"
            >
              <Square className="h-4 w-4" />
              Stop Import
            </button>
          </div>
        </div>
      )}

      {importStatus === 'success' && (
        <div className="flex items-center justify-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <svg className="h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-medium text-green-800 mb-2">Import Successful</h3>
              <p className="text-green-700">Successfully imported {importResult.success} records</p>
              {importResult.errors > 0 && (
                <p className="text-yellow-700 text-sm mt-2">({importResult.errors} errors occurred)</p>
              )}
            </div>
          </div>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">Import Failed</h3>
              <p className="text-red-700 mb-2">Please check the file format and try again.</p>
              <p className="text-red-600 text-sm">Make sure to use the provided template format.</p>
            </div>
          </div>
        </div>
      )}

      {isImportCancelled && (
        <div className="flex items-center justify-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Import Cancelled</h3>
              <p className="text-yellow-700">Import process was cancelled by user.</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onDownloadTemplate}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mx-auto"
      >
        <Download className="h-5 w-5" />
        Download Excel Template
      </button>
    </div>
  );
}

// Reusable Components
function InputField({ label, type = 'text', value, onChange, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && '*'}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((option: string) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function FileUpload({ accept, multiple, onChange, file, files, onRemove, label, inputRef }: any) {
  const handleButtonClick = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors">
      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-3">{label}</p>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
      >
        Choose Files
      </button>

      {file && (
        <div className="mt-4 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">{file.name}</span>
            <button type="button" onClick={() => onRemove?.(0)} className="text-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {files && files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file: File, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{file.name}</span>
              <button type="button" onClick={() => onRemove?.(index)} className="text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}