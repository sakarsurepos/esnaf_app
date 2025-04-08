import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Geçici OnBoarding ekranı
const OnBoardingScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Esnaf Müşteri Uygulaması</Text>
      <Text style={styles.subtitle}>Yerel işletmeleri keşfedin, hizmet alın</Text>
    </View>
  );
};

// Yükleme ekranı
const LoadingScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>Yükleniyor...</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Geliştirme aşamasında farklı ekranları görebilmek için hızlı değişim
  useEffect(() => {
    // 2 saniye sonra onboarding'i tamamlıyoruz (demo için)
    const onboardingTimer = setTimeout(() => {
      setHasCompletedOnboarding(true);
    }, 2000);

    return () => clearTimeout(onboardingTimer);
  }, []);

  // Kimlik doğrulama durumu yükleniyorsa
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      ) : !user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default RootNavigator; 