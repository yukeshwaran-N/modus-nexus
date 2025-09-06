// src/hooks/useCriminalRecords.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface CriminalRecord {
  id: number
  case_id: string
  name: string
  age: number
  crime_type: string
  last_location: string
  // Add all other fields from your table
}

export const useCriminalRecords = () => {
  const [records, setRecords] = useState<CriminalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCriminalRecords()
  }, [])

  const fetchCriminalRecords = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('criminal_records')
        .select('*')
        .order('date_added', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addCriminalRecord = async (record: Omit<CriminalRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('criminal_records')
        .insert([record])
        .select()

      if (error) throw error
      
      if (data) {
        setRecords(prev => [data[0], ...prev])
      }
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  const updateCriminalRecord = async (id: number, updates: Partial<CriminalRecord>) => {
    try {
      const { data, error } = await supabase
        .from('criminal_records')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      if (data) {
        setRecords(prev => prev.map(record => 
          record.id === id ? { ...record, ...updates } : record
        ))
      }
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  const deleteCriminalRecord = async (id: number) => {
    try {
      const { error } = await supabase
        .from('criminal_records')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setRecords(prev => prev.filter(record => record.id !== id))
    } catch (err: any) {
      setError(err.message)
    }
  }

  return {
    records,
    loading,
    error,
    addCriminalRecord,
    updateCriminalRecord,
    deleteCriminalRecord,
    refetch: fetchCriminalRecords
  }
}