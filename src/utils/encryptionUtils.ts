// src/utils/encryptionUtils.ts
import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
const getEncryptionKey = (): string => {
  // Try Vite environment variables first
  if (import.meta.env.VITE_ENCRYPTION_KEY) {
    return import.meta.env.VITE_ENCRYPTION_KEY;
  }
  
  // Fallback for development
  return 'dev-fallback-encryption-key-32-chars-long!';
};

const ENCRYPTION_KEY = getEncryptionKey();

// Check if a string is encrypted
export const isEncrypted = (data: string): boolean => {
  return data && data.startsWith('U2FsdGVkX1');
};

// Encryption function
export const encryptValue = (value: string): string => {
  if (!value || isEncrypted(value)) return value;
  try {
    return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return value;
  }
};

// Decryption function
export const decryptValue = (encryptedValue: string): string => {
  if (!encryptedValue || !isEncrypted(encryptedValue)) return encryptedValue;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedValue;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedValue;
  }
};

// Decrypt all encrypted fields in an object
export const decryptObject = (obj: Record<string, any>): Record<string, any> => {
  if (!obj) return obj;
  
  const decrypted = { ...obj };
  
  // List of fields that might be encrypted
  const encryptedFields = [
    'name', 'phone_number', 'email', 'address', 'address_line', 
    'city', 'state', 'country', 'nationality', 'bio', 'modus_operandi', 
    'tools_used', 'associates', 'connected_criminals', 'known_associates', 
    'case_progress_timeline', 'last_location'
  ];
  
  encryptedFields.forEach(field => {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = decryptValue(decrypted[field]);
    }
  });
  
  return decrypted;
};

// Encrypt fields in an object
export const encryptObject = (obj: Record<string, any>): Record<string, any> => {
  if (!obj) return obj;
  
  const encrypted = { ...obj };
  
  const fieldsToEncrypt = [
    'name', 'phone_number', 'email', 'address', 'address_line', 
    'city', 'state', 'country', 'nationality', 'bio', 'modus_operandi', 
    'tools_used', 'associates', 'connected_criminals', 'known_associates', 
    'case_progress_timeline', 'last_location'
  ];
  
  fieldsToEncrypt.forEach(field => {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encryptValue(encrypted[field]);
    }
  });
  
  return encrypted;
};