// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, getSupabaseAnonKey } from '@/config/env'

const supabaseUrl = getSupabaseUrl()
const supabaseKey = getSupabaseAnonKey()

export const supabase = createClient(supabaseUrl, supabaseKey)