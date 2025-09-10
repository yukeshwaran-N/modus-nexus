// lib/secureSupabase.ts
import { createClient } from '@supabase/supabase-js';
import CryptoJS from 'crypto-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Create Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: new Error('Supabase not configured') }),
      insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: () => ({ error: new Error('Supabase not configured') })
    }),
    storage: {
      from: () => ({
        upload: () => ({ error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    rpc: () => ({ data: null, error: new Error('Supabase not configured') })
  };
}

export { supabase };

export const secureSupabase = {
  // Encryption configuration
  encryptionConfig: {
    enabled: true,
    tables: ['criminal_records', 'users'],
    fields: {
      criminal_records: [
        'name', 'phone_number', 'email', 'address', 'address_line',
        'city', 'state', 'country', 'nationality', 'bio',
        'modus_operandi', 'tools_used', 'associates', 'connected_criminals',
        'known_associates', 'case_progress_timeline', 'last_location'
      ],
      users: ['email', 'phone_number', 'address']
    }
  },

  // Check if Supabase is properly configured
  isSupabaseConfigured(): boolean {
    return !!supabaseUrl && !!supabaseAnonKey;
  },

  // Encryption/Decryption methods
  encrypt(text: string): string {
    if (!text || !encryptionKey) return text;
    try {
      return CryptoJS.AES.encrypt(text, encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return text;
    }
  },

  decrypt(encryptedText: string): string {
    if (!encryptedText || !encryptionKey || !this.isEncrypted(encryptedText)) {
      return encryptedText;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
      const result = bytes.toString(CryptoJS.enc.Utf8);
      return result || encryptedText; // Return original if decryption fails
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText;
    }
  },

  isEncrypted(value: string): boolean {
    return typeof value === 'string' && value.startsWith('U2FsdGVkX1');
  },

  // Object field encryption/decryption
  encryptObjectFields(obj: any, table: string): any {
    if (!obj || !this.encryptionConfig.enabled) return obj;
    
    const encryptedFields = this.encryptionConfig.fields[table];
    if (!encryptedFields) return obj;

    const encryptedObj = { ...obj };
    encryptedFields.forEach(field => {
      if (obj[field] && typeof obj[field] === 'string') {
        encryptedObj[field] = this.encrypt(obj[field]);
      }
    });
    return encryptedObj;
  },

  decryptObjectFields(obj: any, table: string): any {
    if (!obj || !this.encryptionConfig.enabled) return obj;
    
    const encryptedFields = this.encryptionConfig.fields[table];
    if (!encryptedFields) return obj;

    const decryptedObj = { ...obj };
    encryptedFields.forEach(field => {
      if (obj[field] && this.isEncrypted(obj[field])) {
        try {
          decryptedObj[field] = this.decrypt(obj[field]);
        } catch (error) {
          console.warn(`Failed to decrypt field ${field}:`, error);
        }
      }
    });
    return decryptedObj;
  },

  // Data processing methods
  encryptData(data: any, table: string): any {
    if (!data || !this.encryptionConfig.enabled) return data;
    
    const encryptedFields = this.encryptionConfig.fields[table];
    if (!encryptedFields) return data;

    if (Array.isArray(data)) {
      return data.map(record => this.encryptObjectFields(record, table));
    }
    return this.encryptObjectFields(data, table);
  },

  decryptData(data: any, table: string): any {
    if (!data || !this.encryptionConfig.enabled) return data;
    
    const encryptedFields = this.encryptionConfig.fields[table];
    if (!encryptedFields) return data;

    if (Array.isArray(data)) {
      return data.map(record => this.decryptObjectFields(record, table));
    }
    return this.decryptObjectFields(data, table);
  },

  // Database operations with encryption/decryption
  async insert(table: string, data: any) {
    if (!this.isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }

    const encryptedData = this.encryptData(data, table);
    const { data: result, error } = await supabase
      .from(table)
      .insert(encryptedData)
      .select();

    if (error) throw error;
    return this.decryptData(result, table);
  },

  async select(table: string, options: any = {}) {
    try {
      if (!this.isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Please check your environment variables.');
      }

      let query = supabase.from(table).select('*');
      
      // Apply limit if specified
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Apply filters if specified
      if (options.filters) {
        query = query.match(options.filters);
      }

      // Apply order if specified
      if (options.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending !== false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        return { data: null, error };
      }

      if (!data) {
        return { data: [], error: null };
      }

      // Decrypt the data
      const decryptedData = this.decryptData(data, table);
      return { data: decryptedData, error: null };

    } catch (error) {
      console.error('Secure Supabase select error:', error);
      return { data: null, error };
    }
  },

  async update(table: string, id: number, updates: any) {
    if (!this.isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }

    const encryptedUpdates = this.encryptData(updates, table);
    const { data, error } = await supabase
      .from(table)
      .update(encryptedUpdates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return this.decryptData(data, table);
  },

  async delete(table: string, id: number) {
    if (!this.isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Raw Supabase access
  get raw() {
    return supabase;
  },

  // Encryption status
  getEncryptionStatus() {
    const isSupabaseReady = this.isSupabaseConfigured();
    const isEncryptionReady = this.encryptionConfig.enabled && encryptionKey.length > 0;
    
    return {
      enabled: isEncryptionReady,
      keyLength: encryptionKey.length,
      keySource: encryptionKey ? 'Environment Variable' : 'Not Set',
      supabaseConfigured: isSupabaseReady,
      tables: Object.keys(this.encryptionConfig.fields),
      ready: isSupabaseReady && isEncryptionReady
    };
  },

  // Test encryption
  testEncryption(): { success: boolean; message: string } {
    try {
      // Check if encryption key is set
      if (!encryptionKey) {
        return { 
          success: false, 
          message: 'Encryption key not set. Please set VITE_ENCRYPTION_KEY environment variable.' 
        };
      }

      const testData = 'Test encryption data';
      const encrypted = this.encrypt(testData);
      
      if (!this.isEncrypted(encrypted)) {
        return { success: false, message: 'Encryption failed - output not encrypted' };
      }

      const decrypted = this.decrypt(encrypted);
      
      if (decrypted !== testData) {
        return { success: false, message: 'Decryption failed - output mismatch' };
      }

      return { 
        success: true, 
        message: 'Encryption test passed successfully!' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `Encryption test failed: ${error.message}` 
      };
    }
  },

  // Test database connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.isSupabaseConfigured()) {
        return {
          success: false,
          message: 'Supabase not configured. Check environment variables.'
        };
      }

      // Test with a simple query
      const { error } = await supabase
        .from('criminal_records')
        .select('count')
        .limit(1);

      if (error) {
        return {
          success: false,
          message: `Database connection failed: ${error.message}`
        };
      }

      return {
        success: true,
        message: 'Database connection successful!'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`
      };
    }
  }
};