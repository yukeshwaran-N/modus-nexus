// src/lib/supabase-utils.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

// Type-safe insert wrapper
export const safeInsert = <T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  table: T,
  values: Database['public']['Tables'][T]['Insert'][]
) => {
  return supabase.from(table).insert(values as any).select();
};

// Type-safe update wrapper
export const safeUpdate = <T extends keyof Database['public']['Tables']>(
  supabase: SupabaseClient<Database>,
  table: T,
  values: Database['public']['Tables'][T]['Update'],
  eq: { column: keyof Database['public']['Tables'][T]['Row']; value: any }
) => {
  return supabase.from(table).update(values as any).eq(eq.column as string, eq.value).select();
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];