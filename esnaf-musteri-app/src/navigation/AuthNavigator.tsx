import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

// Kimlik doğrulama ekranlarını import ediyoruz
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// VerifyEmail ve ResetPassword ekranları henüz hazır değil,
// bu yüzden geçici placeholder bileşeni kullanacağız
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ route }: any) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
      {route.name} Ekranı (Yapım Aşamasında)
    </Text>
    {route.params && (
      <Text style={{ marginTop: 10 }}>
        Parametreler: {JSON.stringify(route.params)}
      </Text>
    )}
  </View>
);

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="Login"
        component={LoginScreen}
        options={{ title: 'Giriş Yap' }}
      />
      <Stack.Screen 
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Kayıt Ol' }}
      />
      <Stack.Screen 
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Şifremi Unuttum' }}
      />
      <Stack.Screen 
        name="VerifyEmail"
        component={PlaceholderScreen}
        options={{ title: 'E-posta Doğrulama' }}
      />
      <Stack.Screen 
        name="ResetPassword"
        component={PlaceholderScreen}
        options={{ title: 'Şifre Sıfırlama' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 