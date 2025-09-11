// src/components/SetupWizard.tsx
import { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, Loader, Shield, Key } from 'lucide-react';
import { verifySupabaseConnection, checkAllTables } from '@/utils/setupVerification';
import { secureSupabase } from '@/lib/secureSupabase';

export const SetupWizard = () => {
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    setConnectionStatus('checking');
    
    try {
      const result = await verifySupabaseConnection();
      const tables = await checkAllTables();

      setTablesStatus(tables);
      setConnectionStatus(result.success ? 'success' : 'error');
      setErrorMessage(result.message);
    } catch (error: any) {
      setConnectionStatus('error');
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const runMigrations = async () => {
    setLoading(true);
    try {
      // This would typically be done through a backend API
      alert('Please run the SQL migrations in your Supabase SQL editor');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Database className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Database Setup</h1>
          <p className="text-gray-600">Verify your Supabase connection and database setup</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          
          <div className="flex items-center gap-3 p-4 border rounded-lg mb-4">
            {connectionStatus === 'checking' && (
              <>
                <Loader className="h-6 w-6 animate-spin text-blue-600" />
                <span>Checking Supabase connection...</span>
              </>
            )}
            {connectionStatus === 'success' && (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-green-700">Successfully connected to Supabase</span>
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="text-red-700">Connection failed: {errorMessage}</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-medium mb-3">Table Status</h3>
          <div className="space-y-2">
            {Object.entries(tablesStatus).map(([table, exists]) => (
              <div key={table} className="flex items-center gap-3 p-3 border rounded-lg">
                {exists ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={exists ? 'text-green-700' : 'text-red-700'}>
                  {table} {exists ? 'exists' : 'does not exist'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Supabase</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
                <p>Key: {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">Encryption</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Key: {import.meta.env.VITE_ENCRYPTION_KEY ? '✅ Set' : '❌ Missing'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Length: {import.meta.env.VITE_ENCRYPTION_KEY?.length || 0}/32 chars
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Next Steps</h2>
          
          <div className="space-y-3">
            {!Object.values(tablesStatus).every(Boolean) && (
              <div className="p-4 bg-yellow-100 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">1. Create Database Tables</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  You need to run the SQL migration scripts to create the required tables.
                </p>
                <button
                  onClick={runMigrations}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700"
                >
                  Run Migrations
                </button>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">2. Verify Data Encryption</h3>
              <p className="text-blue-700 text-sm">
                Test that data is being properly encrypted and decrypted using your encryption key.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">3. Test the Application</h3>
              <p className="text-green-700 text-sm">
                Navigate through different sections to ensure everything is working correctly.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={checkConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Re-check Connection'}
          </button>
        </div>
      </div>
    </div>
  );
};