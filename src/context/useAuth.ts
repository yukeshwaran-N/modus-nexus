import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { policeOfficerService, PoliceOfficer } from '../services/policeOfficerService';
import { generateToken, verifyToken, JwtPayload } from '../utils/jwt';
import React from 'react';

interface AuthContextType {
  user: any;
  policeOfficer: PoliceOfficer | null;
  session: any;
  loading: boolean;
  authChecked: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithCredentials: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isPoliceOfficer: boolean;
  refreshPoliceOfficer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [policeOfficer, setPoliceOfficer] = useState<PoliceOfficer | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const isPoliceOfficer = !!policeOfficer;

  const refreshPoliceOfficer = async () => {
    if (!user) return;
    try {
      const officer = await policeOfficerService.getOfficerByEmail(user.email);
      setPoliceOfficer(officer);
    } catch (error) {
      console.error('Error refreshing police officer data:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const checkExistingAuth = async () => {
      try {
        if (!isMounted) return;
        
        // Check Supabase session first
        const { data: { session: supabaseSession } } = await supabase.auth.getSession();
        
        if (supabaseSession && isMounted) {
          setSession(supabaseSession);
          setUser(supabaseSession.user);
          
          const officer = await policeOfficerService.getOfficerByEmail(supabaseSession.user.email);
          if (officer && isMounted) setPoliceOfficer(officer);
          
          setLoading(false);
          setAuthChecked(true);
          return;
        }

        // Check for JWT token
        const token = localStorage.getItem('police_jwt');
        if (token && isMounted) {
          const decoded = await verifyToken(token);
          if (decoded) {
            const officer = await policeOfficerService.getOfficerById(decoded.userId);
            if (officer && officer.is_active && isMounted) {
              setPoliceOfficer(officer);
              setUser({
                id: officer.id,
                email: officer.email,
                name: officer.name
              });
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    checkExistingAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setAuthChecked(true);
        
        if (session) {
          const officer = await policeOfficerService.getOfficerByEmail(session.user.email);
          if (officer && isMounted) setPoliceOfficer(officer);
          
          localStorage.removeItem('police_jwt');
        } else {
          setPoliceOfficer(null);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithCredentials = async (email: string, password: string): Promise<boolean> => {
    try {
      const officer = await policeOfficerService.verifyCredentials(email, password);
      if (!officer) return false;

      const tokenPayload: JwtPayload = {
        userId: officer.id,
        email: officer.email,
        badgeNumber: officer.badge_number,
        name: officer.name,
        rank: officer.rank,
        department: officer.department
      };
      
      const token = await generateToken(tokenPayload);
      localStorage.setItem('police_jwt', token);
      
      setPoliceOfficer(officer);
      setUser({
        id: officer.id,
        email: officer.email,
        name: officer.name
      });
      setAuthChecked(true);
      
      await supabase.auth.signOut();
      return true;
    } catch (error) {
      console.error('Error signing in with credentials:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      if (policeOfficer) {
        setPoliceOfficer(null);
        localStorage.removeItem('police_jwt');
      }
      
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      setUser(null);
      setSession(null);
      setAuthChecked(true);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    policeOfficer,
    session,
    loading,
    authChecked,
    signInWithGoogle,
    signInWithCredentials,
    signOut,
    isPoliceOfficer,
    refreshPoliceOfficer
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};