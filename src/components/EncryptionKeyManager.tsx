import { useState } from 'react';
import { Key, Save, RotateCcw, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isEncryptionConfigured } from '@/lib/encryption';

export function EncryptionKeyManager() {
  const [currentKey, setCurrentKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const isConfigured = isEncryptionConfigured();

  const handleKeyRotation = async () => {
    if (newKey !== confirmKey) {
      setMessage({ type: 'error', text: 'New keys do not match!' });
      return;
    }
    
    if (newKey.length < 32) {
      setMessage({ type: 'error', text: 'Encryption key must be at least 32 characters long' });
      return;
    }
    
    setIsRotating(true);
    setMessage(null);
    
    try {
      // In a real application, this would communicate with a backend service
      // to securely handle key rotation and re-encryption
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ 
        type: 'success', 
        text: 'Key rotation process simulated successfully. In production, this would re-encrypt all data with the new key.' 
      });
      
      // Reset form
      setNewKey('');
      setConfirmKey('');
      setCurrentKey('');
    } catch (error) {
      console.error('Key rotation failed:', error);
      setMessage({ type: 'error', text: 'Key rotation failed. Please check the console for details.' });
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <Card className="law-enforcement-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Encryption Key Management
        </CardTitle>
        <CardDescription>
          Manage encryption keys for sensitive data. Only authorized administrators should access this section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Alert variant={isConfigured ? 'default' : 'destructive'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isConfigured 
              ? 'Encryption is properly configured with a secure key.' 
              : 'Warning: Using fallback encryption key. Set VITE_ENCRYPTION_KEY environment variable for production.'}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="currentKey">Current Key (for verification)</Label>
          <Input
            id="currentKey"
            type="password"
            value={currentKey}
            onChange={(e) => setCurrentKey(e.target.value)}
            placeholder="Enter current encryption key"
            disabled={!isConfigured}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newKey">New Encryption Key</Label>
          <Input
            id="newKey"
            type="password"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Enter new encryption key (min 32 characters)"
            disabled={!isConfigured}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmKey">Confirm New Key</Label>
          <Input
            id="confirmKey"
            type="password"
            value={confirmKey}
            onChange={(e) => setConfirmKey(e.target.value)}
            placeholder="Confirm new encryption key"
            disabled={!isConfigured}
          />
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            <Key className="h-4 w-4 inline mr-1" />
            Key rotation will re-encrypt all data with the new key
          </div>
          
          <Button 
            onClick={handleKeyRotation} 
            disabled={isRotating || !isConfigured || !currentKey || !newKey || !confirmKey}
          >
            {isRotating ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Rotating Keys...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Rotate Encryption Key
              </>
            )}
          </Button>
        </div>
        
        <div className="p-4 bg-muted rounded-lg text-sm">
          <h4 className="font-medium mb-2">Security Notes:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Store encryption keys in environment variables (VITE_ENCRYPTION_KEY)</li>
            <li>Use a minimum of 32 characters for encryption keys</li>
            <li>Rotate keys periodically for enhanced security</li>
            <li>Backup data before key rotation procedures</li>
            <li>Restrict access to this section to authorized administrators only</li>
            <li>Consider using a dedicated key management service in production</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}