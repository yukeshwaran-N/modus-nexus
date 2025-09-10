// src/hooks/useCriminalRecords.ts
import { useState, useEffect } from 'react'
import { secureSupabase } from '@/lib/secureSupabase' // CHANGE THIS

export interface CriminalRecord {
  id: number
  case_id: string
  name: string
  age: number
  gender: string
  phone_number: string
  email: string
  nationality: string
  crime_type: string
  modus_operandi: string
  tools_used: string
  associates: string
  connected_criminals: string
  case_status: string
  current_status: string
  last_location: string
  arrest_date: string
  bail_date: string
  bio: string
  total_cases: number
  legal_status: string
  known_associates: string
  case_progress_timeline: string
  address: string
  address_line: string
  city: string
  state: string
  country: string
  risk_level: string
  threat_level: string
  criminal_photo_url?: string
  evidence_files_urls?: string[]
  date_added?: string
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
      // USE secureSupabase INSTEAD OF supabase
      const data = await secureSupabase.select('criminal_records')
      setRecords(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addCriminalRecord = async (record: Omit<CriminalRecord, 'id'>) => {
    try {
      // USE secureSupabase FOR INSERT
      const data = await secureSupabase.insert('criminal_records', record)
      
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
      // USE secureSupabase FOR UPDATE
      const data = await secureSupabase.update('criminal_records', id, updates)
      
      if (data) {
        setRecords(prev => prev.map(record => 
          record.id === id ? { ...record, ...data[0] } : record
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
      // USE secureSupabase FOR DELETE
      await secureSupabase.delete('criminal_records', id)
      
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