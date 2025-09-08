import { useCallback } from 'react';
import { encryptData, decryptData } from '@/lib/encryption';

export const useEncryption = () => {
  const encrypt = useCallback((data: string) => {
    return encryptData(data);
  }, []);

  const decrypt = useCallback((encryptedData: string) => {
    return decryptData(encryptedData);
  }, []);

  return { encrypt, decrypt };
};