import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

// Simplified interface for police officers
export interface PoliceOfficer {
  id: string;
  badge_number: string;
  name: string;
  email: string;
  password_hash: string;
  rank: string;
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PoliceOfficerInput {
  badge_number: string;
  name: string;
  email: string;
  password: string;
  rank: string;
  department: string;
}

export const policeOfficerService = {
  // Get all police officers
  async getAllOfficers(): Promise<PoliceOfficer[]> {
    const { data, error } = await supabase
      .from('police_officers')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Get officer by ID
  async getOfficerById(id: string): Promise<PoliceOfficer | null> {
    const { data, error } = await supabase
      .from('police_officers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  // Get officer by email
  async getOfficerByEmail(email: string): Promise<PoliceOfficer | null> {
    const { data, error } = await supabase
      .from('police_officers')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data;
  },

  // Create a new police officer
  async createOfficer(officerData: PoliceOfficerInput): Promise<PoliceOfficer | null> {
    const passwordHash = await bcrypt.hash(officerData.password, 12);
    
    const insertData = {
      badge_number: officerData.badge_number,
      name: officerData.name,
      email: officerData.email,
      password_hash: passwordHash,
      rank: officerData.rank,
      department: officerData.department,
      is_active: true
    };
    
    const { data, error } = await supabase
      .from('police_officers')
      .insert([insertData as never]) // Use 'as never' for insert
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a police officer
  async updateOfficer(id: string, updates: Partial<PoliceOfficerInput>): Promise<PoliceOfficer | null> {
    const updateData: any = {};
    
    // Map the updates to the correct fields
    if (updates.badge_number !== undefined) updateData.badge_number = updates.badge_number;
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.rank !== undefined) updateData.rank = updates.rank;
    if (updates.department !== undefined) updateData.department = updates.department;
    
    if (updates.password) {
      updateData.password_hash = await bcrypt.hash(updates.password, 12);
    }
    
    const { data, error } = await supabase
      .from('police_officers')
      .update(updateData as never) // Use 'as never' for update
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a police officer (soft delete)
  async deleteOfficer(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('police_officers')
      .update({ is_active: false } as never) // Use 'as never'
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Verify officer credentials
  async verifyCredentials(email: string, password: string): Promise<PoliceOfficer | null> {
    const officer = await this.getOfficerByEmail(email);
    
    if (!officer || !officer.is_active) return null;
    
    try {
      const isValid = await bcrypt.compare(password, officer.password_hash);
      return isValid ? officer : null;
    } catch (error) {
      console.error('Error during password comparison:', error);
      return null;
    }
  }
};