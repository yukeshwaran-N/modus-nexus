// src/utils/setupVerification.ts
import { secureSupabase } from '@/lib/secureSupabase';

export const verifySupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await secureSupabase.raw
      .from('criminal_records')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        console.warn('⚠️ criminal_records table does not exist yet');
        return { success: false, message: 'Tables need to be created' };
      }
      throw error;
    }

    console.log('✅ Supabase connection successful!');
    return { success: true, message: 'Connection successful' };
  } catch (error: any) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, message: error.message };
  }
};

export const checkAllTables = async () => {
  const tables = ['criminal_records', 'cases'];
  const results: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      const { error } = await secureSupabase.raw
        .from(table)
        .select('count')
        .limit(1);

      results[table] = !error;
    } catch {
      results[table] = false;
    }
  }

  return results;
};