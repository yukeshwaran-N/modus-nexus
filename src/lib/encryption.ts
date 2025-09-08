import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'fallback-encryption-key-for-development-2024';

// List of fields that should be encrypted for each table
export const ENCRYPTION_CONFIG: Record<string, string[]> = {
  criminal_records: [
    'name',
    'phone_number',
    'email',
    'last_location',
    'modus_operandi',
    'tools_used',
    'known_associates',
    'connected_criminals',
    'address',
    'personal_details'
  ],
  cases: [
    'case_details',
    'victim_info',
    'witness_info',
    'officer_notes',
    'confidential_notes'
  ],
  users: [
    'email',
    'phone_number',
    'personal_notes'
  ]
};

// Encrypt data
export const encryptData = (data: string): string => {
  try {
    if (!data) return data;
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data
export const decryptData = (encryptedData: string): string => {
  try {
    if (!encryptedData) return encryptedData;
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedData; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData; // Return original if decryption fails
  }
};

// Encrypt specific fields in an object
export const encryptObjectFields = (obj: any, tableName: string): any => {
  if (!obj) return obj;
  
  const encryptedObj = { ...obj };
  const fieldsToEncrypt = ENCRYPTION_CONFIG[tableName] || [];
  
  fieldsToEncrypt.forEach(field => {
    if (encryptedObj[field] && typeof encryptedObj[field] === 'string') {
      encryptedObj[field] = encryptData(encryptedObj[field]);
    }
  });
  
  return encryptedObj;
};

// Decrypt specific fields in an object
export const decryptObjectFields = (obj: any, tableName: string): any => {
  if (!obj) return obj;
  
  const decryptedObj = { ...obj };
  const fieldsToDecrypt = ENCRYPTION_CONFIG[tableName] || [];
  
  fieldsToDecrypt.forEach(field => {
    if (decryptedObj[field] && typeof decryptedObj[field] === 'string') {
      decryptedObj[field] = decryptData(decryptedObj[field]);
    }
  });
  
  return decryptedObj;
};

// Check if encryption is properly configured
export const isEncryptionConfigured = (): boolean => {
  return import.meta.env.VITE_ENCRYPTION_KEY !== undefined &&
         import.meta.env.VITE_ENCRYPTION_KEY.length >= 32;
};