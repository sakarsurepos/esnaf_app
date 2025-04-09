import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../services/supabase';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleUsers } from '../models';

// Mock veri modu kontrolü
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
const IS_DEV = process.env.NODE_ENV === 'development';

// Mock kullanıcı ve oturum oluşturmak için yardımcı fonksiyonlar
const createMockUser = (userData: any): User => {
  return {
    id: userData.id,
    email: userData.email,
    user_metadata: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      bio: userData.bio,
      phone: userData.phone,
      profile_image: userData.profile_image,
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: userData.created_at || new Date().toISOString(),
  } as User;
};

const createMockSession = (user: User): Session => {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: user,
  } as Session;
};

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
    if (IS_DEV && USE_MOCK_DATA) {
      console.log('🧪 Mock kimlik doğrulama modunda çalışılıyor');
      initMockAuth();
    } else {
      console.log('🔌 Gerçek Supabase kimlik doğrulama kullanılıyor');
      initRealAuth();
    }
  }, []);

  // Mock kimlik doğrulama başlatma
  const initMockAuth = async () => {
    try {
      // AsyncStorage'dan mevcut oturum kontrolü
      const storedSession = await AsyncStorage.getItem('mock_session');
      
      if (storedSession) {
        const sessionData = JSON.parse(storedSession) as Session;
        setSession(sessionData);
        setUser(sessionData.user);
      } else {
        // Demo amacıyla otomatik giriş yapılabilir (istenirse)
        // Varsayılan olarak oturumu kapalı başlatıyoruz
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Mock oturum kontrolünde hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gerçek Supabase kimlik doğrulamayı başlatma
  const initRealAuth = () => {
    // Mevcut oturumu kontrol et
    checkSession();

    // Auth state'i dinle
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
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
  };

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
      
      if (IS_DEV && USE_MOCK_DATA) {
        // Mock giriş işlemi - Kullanıcıyı örnek verilerden bul
        const foundUser = sampleUsers.find(user => 
          user.email.toLowerCase() === email.toLowerCase() && 
          // Gerçekte şifre hash'leri karşılaştırılır, ancak demo amaçlı doğrudan şifreleri kontrol ediyoruz
          // Not: Bu sadece mock data için güvenli bir yaklaşımdır, gerçek uygulamada asla yapılmamalıdır
          user.password_hash === password
        );
        
        if (foundUser) {
          const mockUser = createMockUser(foundUser);
          const mockSession = createMockSession(mockUser);
          
          setUser(mockUser);
          setSession(mockSession);
          
          // Mock oturum bilgilerini AsyncStorage'a kaydet
          await AsyncStorage.setItem('mock_session', JSON.stringify(mockSession));
          
          return { error: null };
        } else {
          throw new Error('Geçersiz e-posta veya şifre');
        }
      } else {
        // Gerçek Supabase giriş işlemi
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        return { error: null };
      }
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
      
      if (IS_DEV && USE_MOCK_DATA) {
        // Mock kayıt işlemi
        if (email && password && password.length >= 6) {
          // Önce e-posta adresinin kullanılmadığından emin olalım
          const existingUser = sampleUsers.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
          );
          
          if (existingUser) {
            throw new Error('Bu e-posta adresi zaten kullanılıyor');
          }
          
          // Yeni bir kullanıcı oluştur (örnek kullanıcıyı temel alarak)
          const templateUser = sampleUsers[0];
          const newUser = {
            ...templateUser,
            id: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            email: email,
            password_hash: password, // gerçek uygulamada asla böyle yapılmamalı
            first_name: '',
            last_name: '',
            created_at: new Date().toISOString()
          };
          
          const mockUser = createMockUser(newUser);
          const mockSession = createMockSession(mockUser);
          
          setUser(mockUser);
          setSession(mockSession);
          
          // Mock oturum bilgilerini AsyncStorage'a kaydet
          await AsyncStorage.setItem('mock_session', JSON.stringify(mockSession));
          
          return { error: null };
        } else {
          throw new Error('Geçersiz e-posta veya şifre');
        }
      } else {
        // Gerçek Supabase kayıt işlemi
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        return { error: null };
      }
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
      
      if (IS_DEV && USE_MOCK_DATA) {
        // Mock çıkış işlemi
        setUser(null);
        setSession(null);
        await AsyncStorage.removeItem('mock_session');
      } else {
        // Gerçek Supabase çıkış işlemi
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        setUser(null);
        setSession(null);
        await AsyncStorage.removeItem('session');
      }
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
      
      if (IS_DEV && USE_MOCK_DATA) {
        // Mock şifre sıfırlama
        console.log(`Mock şifre sıfırlama e-postası gönderildi: ${email}`);
        return { error: null };
      } else {
        // Gerçek Supabase şifre sıfırlama
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'esnafmusterim://reset-password',
        });
        
        if (error) throw error;
        
        return { error: null };
      }
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
      
      if (IS_DEV && USE_MOCK_DATA) {
        // Mock profil güncelleme
        if (user) {
          const updatedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              ...data.data
            }
          };
          
          setUser(updatedUser);
          
          // Oturum bilgilerini güncelle
          if (session) {
            const updatedSession = {
              ...session,
              user: updatedUser
            };
            
            setSession(updatedSession);
            await AsyncStorage.setItem('mock_session', JSON.stringify(updatedSession));
          }
        }
        
        return { error: null };
      } else {
        // Gerçek Supabase profil güncelleme
        const { error } = await supabase.auth.updateUser(data);
        
        if (error) throw error;
        
        // Profil güncellendikten sonra kullanıcı bilgilerini güncelle
        const { data: userData, error: sessionError } = await supabase.auth.getUser();
        
        if (sessionError) throw sessionError;
        if (userData) setUser(userData.user);
        
        return { error: null };
      }
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