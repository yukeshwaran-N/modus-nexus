// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xddunzaxllqgresvuryx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZHVuemF4bGxxZ3Jlc3Z1cnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDkzNzYsImV4cCI6MjA3MjcyNTM3Nn0.SmBVhQi9UP_xaLcIyeIIncvSjvZjFNwqxbY3ZchdEG8'

export const supabase = createClient(supabaseUrl, supabaseKey)