import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Use a simpler interface instead of the complex generated types
interface CriminalRecord {
  id: number;
  case_id?: string | null;
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  phone_number?: string | null;
  email?: string | null;
  crime_type?: string | null;
  last_location?: string | null;
  current_status?: string | null;
  // Add other fields as needed
}

export const useCriminalRecords = () => {
  const [records, setRecords] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCriminalRecords();
  }, []);

  const fetchCriminalRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('criminal_records')
        .select('*')
        .order('date_added', { ascending: false });

      if (supabaseError) throw supabaseError;
      setRecords(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCriminalRecord = async (record: Omit<CriminalRecord, 'id'>) => {
    try {
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('criminal_records')
        .insert([record as never])
        .select();

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0) {
        setRecords(prev => [data[0], ...prev]);
        return data[0];
      }
      
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateCriminalRecord = async (id: number, updates: Partial<CriminalRecord>) => {
    try {
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('criminal_records')
        .update(updates as never)
        .eq('id', id)
        .select();

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0 && data[0]) {
        const updatedData = data[0];
        // Use Object.assign instead of spread operator to avoid TypeScript errors
        setRecords(prev => prev.map(record => 
          record.id === id ? Object.assign({}, record, updatedData) : record
        ));
        return data[0];
      }
      
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const deleteCriminalRecord = async (id: number) => {
    try {
      setError(null);
      
      const { error: supabaseError } = await supabase
        .from('criminal_records')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    records,
    loading,
    error,
    addCriminalRecord,
    updateCriminalRecord,
    deleteCriminalRecord,
    refetch: fetchCriminalRecords
  };
};