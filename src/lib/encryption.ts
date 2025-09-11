// src/lib/encryption.ts
import CryptoJS from 'crypto-js';

// Encryption configuration - define which fields to encrypt for each table
export const ENCRYPTION_CONFIG: Record<string, string[]> = {
  criminal_records: [
    'name',
    'phone_number',
    'email',
    'address',
    'address_line',
    'city',
    'state',
    'country',
    'nationality',
    'bio',
    'modus_operandi',
    'tools_used',
    'associates',
    'connected_criminals',
    'known_associates',
    'case_progress_timeline',
    'last_location'
  ],
  users: [
    'email',
    'phone_number',
    'address'
  ]
};

// Get encryption key from environment variables
const getEncryptionKey = (): string => {
  // Try Vite environment variables first
  if (import.meta.env.VITE_ENCRYPTION_KEY) {
    console.log('Using encryption key from Vite environment');
    return import.meta.env.VITE_ENCRYPTION_KEY;
  }
  
  // Try global variable (set by Vite config)
  if (typeof globalThis !== 'undefined' && (globalThis as any).ENCRYPTION_KEY) {
    console.log('Using encryption key from globalThis');
    return (globalThis as any).ENCRYPTION_KEY;
  }
  
  // Try window variable
  if (typeof window !== 'undefined' && (window as any).ENCRYPTION_KEY) {
    console.log('Using encryption key from window');
    return (window as any).ENCRYPTION_KEY;
  }
  
  // Try meta tag
  if (typeof document !== 'undefined') {
    const metaKey = document.querySelector('meta[name="encryption-key"]');
    if (metaKey && metaKey.getAttribute('content')) {
      console.log('Using encryption key from meta tag');
      return metaKey.getAttribute('content') as string;
    }
  }
  
  // Final fallback for development
  console.log('Using development fallback encryption key');
  return 'dev-fallback-encryption-key-32-chars-long!';
};

const ENCRYPTION_KEY = getEncryptionKey();

// Check if encryption is properly configured
export const isEncryptionConfigured = (): boolean => {
  const key = getEncryptionKey();
  const isConfigured = key !== 'dev-fallback-encryption-key-32-chars-long!' && key.length >= 32;
  console.log('Encryption configured:', isConfigured, 'Key length:', key.length);
  return isConfigured;
};

export const encryptData = (data: string): string => {
  if (!data) return data;
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return data;
  }
};

export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return encryptedData;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedData;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData;
  }
};

// Helper function to encrypt object fields based on table
export const encryptObjectFields = (obj: any, table: string): any => {
  if (!obj || !isEncryptionConfigured()) return obj;
  
  const encrypted = { ...obj };
  const fieldsToEncrypt = ENCRYPTION_CONFIG[table] || [];
  
  fieldsToEncrypt.forEach(field => {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encryptData(encrypted[field]);
    }
  });
  
  return encrypted;
};

// Helper function to decrypt object fields based on table
export const decryptObjectFields = (obj: any, table: string): any => {
  if (!obj || !isEncryptionConfigured()) return obj;
  
  const decrypted = { ...obj };
  const fieldsToDecrypt = ENCRYPTION_CONFIG[table] || [];
  
  fieldsToDecrypt.forEach(field => {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      decrypted[field] = decryptData(decrypted[field]);
    }
  });
  
  return decrypted;
};