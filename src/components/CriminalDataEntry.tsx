// src/components/CriminalDataEntry.tsx
import { useState, useRef } from 'react';
import { Upload, FileText, UserPlus, X, Download, FileUp, AlertCircle, Square } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

// Criminal record type - based on your database structure
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

export function CriminalDataEntry() {
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
  const criminalPhotoInputRef = useRef<HTMLInputElement>(null);
  const evidenceInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

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

      const { error } = await supabase.storage
        .from('criminal-records')
        .upload(filePath, file);

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      const { data } = supabase.storage
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

      // Upload files if they exist
      if (criminalPhoto) {
        try {
          criminalPhotoUrl = await uploadFileToStorage(criminalPhoto, 'criminal-photos');
          setUploadProgress(33);
        } catch (error) {
          console.warn('Failed to upload criminal photo, continuing without it:', error);
        }
      }

      // Upload evidence files
      if (evidenceFiles.length > 0) {
        for (let i = 0; i < evidenceFiles.length; i++) {
          try {
            const url = await uploadFileToStorage(evidenceFiles[i], 'evidence');
            evidenceUrls.push(url);
            setUploadProgress(33 + Math.round((i + 1) / evidenceFiles.length * 33));
          } catch (error) {
            console.warn('Failed to upload evidence file, continuing without it:', error);
          }
        }
      }

      // Prepare data for insertion - only include fields that exist in your table
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

      console.log('Attempting to insert into criminal_records:', insertData);

      // Insert into database
      const { error, data } = await supabase
        .from('criminal_records')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Database insert error:', error);
        
        // If RLS error, guide user to fix policies
        if (error.code === '42501') {
          throw new Error(
            'RLS Policy Error: Please go to Supabase Dashboard → Authentication → Policies ' +
            'and create an INSERT policy for the criminal_records table, or temporarily disable RLS.'
          );
        }
        throw error;
      }

      console.log('Insert successful:', data);
      setUploadProgress(100);
      alert('Criminal record added successfully!');
      resetForm();

    } catch (error: any) {
      console.error('Full error details:', error);
      alert('Error adding record: ' + (error.message || 'Unknown error. Check console for details.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus('processing');
    setImportProgress(0);
    setImportResult({ success: 0, errors: 0 });
    setIsImportCancelled(false);

    try {
      console.log('Starting file import for file:', file.name, file.type);
      
      let data: any[] = [];
      
      // Handle CSV files
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        console.log('Processing CSV file');
        const text = await file.text();
        const lines = text.split('\n');
        
        if (lines.length <= 1) {
          throw new Error('CSV file is empty or no data found');
        }
        
        // Extract headers from first line
        const headers = lines[0].split(',').map(header => header.trim());
        console.log('CSV headers:', headers);
        
        // Process each line
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = lines[i].split(',').map(value => value.trim());
          const rowData: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });
          
          data.push(rowData);
        }
      } 
      // Handle Excel files
      else {
        console.log('Processing Excel file');
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        data = XLSX.utils.sheet_to_json(worksheet);
      }
      
      console.log('File data parsed:', data);

      if (data.length === 0) {
        throw new Error('File is empty or no data found');
      }

      let successCount = 0;
      let errorCount = 0;

      // Process each row
      for (let i = 0; i < data.length; i++) {
        // Check if import was cancelled
        if (isImportCancelled) {
          console.log('Import cancelled by user');
          setImportStatus('idle');
          break;
        }

        try {
          const row: any = data[i];
          if (!row || Object.keys(row).length === 0) continue;
          
          console.log(`Processing row ${i + 1}:`, row);
          
          // Map columns to database fields with better error handling
          const insertData: Partial<CriminalData> = {
            case_id: row.case_id || row['Case ID'] || `TN-AUTO-${Date.now()}-${i}`,
            name: row.name || row.Name || '',
            age: parseInt(row.age || row.Age || '0'),
            gender: row.gender || row.Gender || '',
            phone_number: row.phone_number || row.phone || row.Phone || '',
            email: row.email || row.Email || '',
            nationality: row.nationality || row.Nationality || 'Indian',
            crime_type: row.crime_type || row.crime || row.Crime || '',
            modus_operandi: row.modus_operandi || row.modus || row.Modus || '',
            tools_used: row.tools_used || row.tools || row.Tools || '',
            associates: row.associates || row.Associates || '',
            connected_criminals: row.connected_criminals || row.connected || row.Connected || '',
            case_status: row.case_status || row.status || row.Status || 'Under Investigation',
            current_status: row.current_status || row.current || row.Current || 'In Custody',
            last_location: row.last_location || row.location || row.Location || '',
            arrest_date: row.arrest_date || row.arrest || row.Arrest || '',
            bail_date: row.bail_date || row.bail || row.Bail || '',
            bio: row.bio || row.Bio || '',
            total_cases: parseInt(row.total_cases || row.total || row.Total || '0'),
            legal_status: row.legal_status || row.legal || row.Legal || 'Under Investigation',
            known_associates: row.known_associates || row.known || row.Known || '',
            case_progress_timeline: row.case_progress_timeline || row.timeline || row.Timeline || '',
            address: row.address || row.Address || '',
            address_line: row.address_line || row.addressLine || row.AddressLine || '',
            city: row.city || row.City || '',
            state: row.state || row.State || 'Tamil Nadu',
            country: row.country || row.Country || 'India',
            risk_level: row.risk_level || row.risk || row.Risk || 'Medium',
            threat_level: row.threat_level || row.threat || row.Threat || 'Medium',
            date_added: new Date().toISOString()
          };

          console.log('Insert data prepared:', insertData);

          // Insert into database
          const { error } = await supabase
            .from('criminal_records')
            .insert([insertData]);

          if (error) {
            console.error(`Database error for row ${i + 1}:`, error);
            errorCount++;
          } else {
            successCount++;
            console.log(`Row ${i + 1} inserted successfully`);
          }

        } catch (rowError) {
          console.error(`Error processing row ${i + 1}:`, rowError);
          errorCount++;
        }

        // Update progress
        setImportProgress(Math.round(((i + 1) / data.length) * 100));
        setImportResult({ success: successCount, errors: errorCount });
      }

      
      if (!isImportCancelled) {
        setImportStatus(successCount > 0 ? 'success' : 'error');
        
        if (successCount > 0) {
          alert(`Import completed! Success: ${successCount}`);
        } else {
          alert('Import failed. Please check the file format and try again.');
        }
      }

    } catch (error: any) {
      console.error('File import error:', error);
      setImportStatus('error');
      alert('Error importing file: ' + (error.message || 'Please check the file format'));
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
       'address', 'address_line', 'city', 'state', 'country', 'risk_level', 'threat_level']
    ];

    const csvContent = templateData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'criminal_data_template.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Criminal Data Entry System
          </h1>
          <p className="text-gray-600">
            Add new criminal records manually or import from Excel/CSV
          </p>
        </div>

        {/* Tabs */}
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
      {/* Progress Bar */}
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
        {/* Basic Information */}
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

        {/* Crime Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Crime Details</h3>
          
          <InputField label="Crime Type" value={formData.crime_type} onChange={(v) => onInputChange('crime_type', v)} required />
          <TextAreaField label="Modus Operandi" value={formData.modus_operandi} onChange={(v) => onInputChange('modus_operandi', v)} />
          <InputField label="Tools Used" value={formData.tools_used} onChange={(v) => onInputChange('tools_used', v)} />
          <InputField label="Associates" value={formData.associates} onChange={(v) => onInputChange('associates', v)} />
          <InputField label="Connected Criminals" value={formData.connected_criminals} onChange={(v) => onInputChange('connected_criminals', v)} />
        </div>
      </div>

      {/* Status Information */}
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

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Address Line" value={formData.address_line} onChange={(v) => onInputChange('address_line', v)} />
          <InputField label="City" value={formData.city} onChange={(v) => onInputChange('city', v)} />
          <InputField label="State" value={formData.state} onChange={(v) => onInputChange('state', v)} />
          <InputField label="Country" value={formData.country} onChange={(v) => onInputChange('country', v)} />
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 gap-4">
        <TextAreaField label="Biography" value={formData.bio} onChange={(v) => onInputChange('bio', v)} rows={3} />
        <TextAreaField label="Case Progress Timeline" value={formData.case_progress_timeline} onChange={(v) => onInputChange('case_progress_timeline', v)} rows={3} />
        <TextAreaField label="Full Address" value={formData.address} onChange={(v) => onInputChange('address', v)} rows={2} />
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Criminal Photo Upload */}
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

        {/* Evidence Files Upload */}
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

      {/* Submit Button */}
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

      {/* Import Progress */}
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
          
          {/* Cancel Button */}
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

      {/* Import Results */}
      {importStatus === 'success' && (
        <div className="flex items-center justify-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <svg className="h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Import Successful
              </h3>
              <p className="text-green-700">
                Successfully imported {importResult.success} records
              </p>
            </div>
          </div>
        </div>
      )}

      {importStatus === 'error' && (
        <div className="flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Import Failed
              </h3>
              <p className="text-red-700">
                Please check the file format and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {isImportCancelled && (
        <div className="flex items-center justify-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Import Cancelled
              </h3>
              <p className="text-yellow-700">
                Import process was cancelled by user.
              </p>
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

      {/* Show selected files */}
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