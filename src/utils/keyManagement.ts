// Key management utilities for more advanced scenarios

// Generate a random encryption key
export const generateEncryptionKey = (length: number = 32): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let result = '';
    const crypto = window.crypto || (window as any).msCrypto;
    
    if (crypto && crypto.getRandomValues) {
      const values = new Uint32Array(length);
      crypto.getRandomValues(values);
      for (let i = 0; i < length; i++) {
        result += chars[values[i] % chars.length];
      }
    } else {
      // Fallback for browsers without crypto support
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  };
  
  // Validate encryption key strength
  export const validateKeyStrength = (key: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];
    
    if (key.length < 32) {
      issues.push('Key must be at least 32 characters long');
    }
    
    if (!/[A-Z]/.test(key)) {
      issues.push('Key should contain uppercase letters');
    }
    
    if (!/[a-z]/.test(key)) {
      issues.push('Key should contain lowercase letters');
    }
    
    if (!/[0-9]/.test(key)) {
      issues.push('Key should contain numbers');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(key)) {
      issues.push('Key should contain special characters');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  };