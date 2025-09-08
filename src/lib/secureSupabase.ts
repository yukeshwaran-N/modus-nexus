import { supabase } from './supabase';
import { 
  encryptObjectFields, 
  decryptObjectFields,
  ENCRYPTION_CONFIG,
  isEncryptionConfigured 
} from './encryption';

// Secure Supabase client with automatic encryption/decryption
export const secureSupabase = {
  // Select data with automatic decryption
  async select(table: string, columns = '*', filters?: any) {
    let query = supabase.from(table).select(columns);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return { data: null, error };
    }
    
    if (!data) return { data: null, error: null };
    
    // Decrypt sensitive fields if encryption is configured
    const decryptedData = isEncryptionConfigured() 
      ? data.map(item => decryptObjectFields(item, table))
      : data;
    
    return { data: decryptedData, error: null };
  },
  
  // Insert data with automatic encryption
  async insert(table: string, values: any) {
    // Encrypt sensitive fields before insertion
    const encryptedValues = isEncryptionConfigured()
      ? encryptObjectFields(values, table)
      : values;
    
    const { data, error } = await supabase
      .from(table)
      .insert(encryptedValues)
      .select();
    
    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      return { data: null, error };
    }
    
    if (!data) return { data: null, error: null };
    
    // Decrypt the returned data
    const decryptedData = isEncryptionConfigured()
      ? data.map(item => decryptObjectFields(item, table))
      : data;
    
    return { data: decryptedData, error: null };
  },
  
  // Update data with automatic encryption
  async update(table: string, values: any, match: any) {
    // Encrypt sensitive fields before update
    const encryptedValues = isEncryptionConfigured()
      ? encryptObjectFields(values, table)
      : values;
    
    const { data, error } = await supabase
      .from(table)
      .update(encryptedValues)
      .match(match)
      .select();
    
    if (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error };
    }
    
    if (!data) return { data: null, error: null };
    
    // Decrypt the returned data
    const decryptedData = isEncryptionConfigured()
      ? data.map(item => decryptObjectFields(item, table))
      : data;
    
    return { data: decryptedData, error: null };
  },
  
  // Delete operation (no encryption needed)
  async delete(table: string, match: any) {
    const { error } = await supabase
      .from(table)
      .delete()
      .match(match);
    
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { error };
    }
    
    return { error: null };
  },
  
  // Raw access when needed (use with caution)
  raw: supabase,
  
  // Check if encryption is enabled
  isEncryptionEnabled: isEncryptionConfigured()
};