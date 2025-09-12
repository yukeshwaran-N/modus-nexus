// src/hooks/useEncryption.ts
import { useCallback } from 'react';
import { 
  encryptData, 
  decryptData, 
  isEncrypted,
  isEncryptionConfigured 
} from '@/lib/encryption';

export const useEncryption = () => {
  const encrypt = useCallback((data: string): string => {
    return encryptData(data);
  }, []);

  const decrypt = useCallback((encryptedData: string): string => {
    return decryptData(encryptedData);
  }, []);

  const checkEncrypted = useCallback((data: string): boolean => {
    return isEncrypted(data);
  }, []);

  const checkConfigured = useCallback((): boolean => {
    return isEncryptionConfigured();
  }, []);

  return {
    encrypt,
    decrypt,
    isEncrypted: checkEncrypted,
    isEncryptionConfigured: checkConfigured
  };
};