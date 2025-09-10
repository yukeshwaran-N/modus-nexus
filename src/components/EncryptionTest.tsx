// src/components/EncryptionTest.tsx
import { useState, useEffect } from 'react';
import { Shield, ShieldOff, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { secureSupabase } from '@/lib/secureSupabase';

export function EncryptionTest() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<any>(null);

  useEffect(() => {
    checkEncryptionStatus();
  }, []);

  const checkEncryptionStatus = () => {
    const status = secureSupabase.getEncryptionStatus();
    setEncryptionStatus(status);
  };

  const runEncryptionTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Test basic encryption/decryption
      const result = secureSupabase.testEncryption();
      setTestResult(result);

      // Test with actual database operations if basic test passes
      if (result.success) {
        const testData = {
          name: 'Test Criminal ' + Date.now(),
          phone_number: '+1234567890',
          email: 'test@example.com'
        };

        // Test encryption
        const encrypted = secureSupabase.encryptObjectFields(testData, 'criminal_records');
        console.log('Encrypted test data:', encrypted);

        // Test decryption
        const decrypted = secureSupabase.decryptObjectFields(encrypted, 'criminal_records');
        console.log('Decrypted test data:', decrypted);

        // Verify decryption worked
        if (decrypted.name !== testData.name) {
          setTestResult({
            success: false,
            message: 'Object field encryption/decryption test failed'
          });
        }
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test error: ${error.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Encryption Test</h2>
      
      <div className="space-y-4">
        {/* Encryption Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {encryptionStatus?.enabled ? (
              <Shield className="h-6 w-6 text-green-600" />
            ) : (
              <ShieldOff className="h-6 w-6 text-red-600" />
            )}
            <div>
              <p className="font-medium">Encryption Status</p>
              <p className="text-sm text-gray-600">
                {encryptionStatus?.enabled ? 'Enabled' : 'Disabled'}
                {encryptionStatus && ` (Key: ${encryptionStatus.keyLength} chars)`}
              </p>
            </div>
          </div>
          <button
            onClick={checkEncryptionStatus}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Test Button */}
        <button
          onClick={runEncryptionTest}
          disabled={isTesting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isTesting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Run Encryption Test'
          )}
        </button>

        {/* Test Results */}
        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.success ? 'Test Passed' : 'Test Failed'}
                </p>
                <p className={`text-sm ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Encryption Details */}
        {encryptionStatus && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Encryption Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Key Source: {encryptionStatus.keySource}</p>
              <p>• Key Length: {encryptionStatus.keyLength} characters</p>
              <p>• Enabled Tables: {encryptionStatus.tables?.join(', ') || 'None'}</p>
              {encryptionStatus.tables?.includes('criminal_records') && (
                <p>• Criminal Records Fields: {
                  secureSupabase.encryptionConfig.fields.criminal_records.join(', ')
                }</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}