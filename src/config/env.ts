// src/config/env.ts
export const getEnvVariable = (key: string, fallback: string = ''): string => {
    // Handle Vite environment variables (client-side)
    if (typeof import.meta.env !== 'undefined' && import.meta.env[key]) {
      return import.meta.env[key] as string;
    }
    
    // Handle browser environment
    if (typeof window !== 'undefined') {
      // Try to get from meta tag first (more secure)
      const metaValue = document.querySelector(`meta[name="${key}"]`)?.getAttribute('content');
      if (metaValue) return metaValue;
      
      // Fallback to window object (less secure)
      return (window as any)[key] || fallback;
    }
    
    // Handle server environment (Node.js)
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }
    
    return fallback;
  };
  
  // Specific environment variable getters
  export const getSupabaseUrl = (): string => 
    getEnvVariable('VITE_SUPABASE_URL', 'https://xddunzaxllqgresvuryx.supabase.co');
  
  export const getSupabaseAnonKey = (): string => 
    getEnvVariable('VITE_SUPABASE_PUBLISHABLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZHVuemF4bGxxZ3Jlc3Z1cnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDkzNzYsImV4cCI6MjA3MjcyNTM3Nn0.SmBVhQi9UP_xaLcIyeIIncvSjvZjFNwqxbY3ZchdEG8');
  
  export const getEncryptionKey = (): string => 
    getEnvVariable('VITE_ENCRYPTION_KEY', '9cD4tX!q7Yz*P0Lm$2aBvW#r5NfGhJ8k');