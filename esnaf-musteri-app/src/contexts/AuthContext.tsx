import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: any) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Mevcut oturumu kontrol et
    checkSession();

    // Auth state'i dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Oturum bilgilerini AsyncStorage'a kaydet
        if (session) {
          await AsyncStorage.setItem('session', JSON.stringify(session));
        } else {
          await AsyncStorage.removeItem('session');
        }
      }
    );

    return () => {
      // Dinleyiciyi kaldır
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);

      // Yerel depodan oturum bilgilerini alma denemesi
      const storedSession = await AsyncStorage.getItem('session');
      
      if (storedSession) {
        const sessionData = JSON.parse(storedSession) as Session;
        setSession(sessionData);
        setUser(sessionData.user);
      }

      // Supabase oturum kontrolü
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error('Oturum kontrolünde hata:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Giriş hatası:', error);
      setError(error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setError(error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      await AsyncStorage.removeItem('session');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'esnafmusterim://reset-password',
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      setError(error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser(data);
      
      if (error) throw error;
      
      // Profil güncellendikten sonra kullanıcı bilgilerini güncelle
      const { data: userData, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError) throw sessionError;
      if (userData) setUser(userData.user);
      
      return { error: null };
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      setError(error as Error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 