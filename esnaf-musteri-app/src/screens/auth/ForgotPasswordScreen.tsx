import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import { resetPasswordSchema } from '../../utils/validation';

type FormData = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const { resetPassword } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema) as any,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const { error } = await resetPassword(data.email);

      if (error) throw error;

      Alert.alert(
        'E-posta Gönderildi',
        'Şifre sıfırlama talimatları e-posta adresinize gönderildi.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error: any) {
      console.error('Şifre sıfırlama hatası:', error);
      
      if (error.message?.includes('Email not found')) {
        setErrorMessage('Bu e-posta adresine sahip bir kullanıcı bulunamadı');
      } else {
        setErrorMessage(error.message || 'Şifre sıfırlama işlemi başarısız oldu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            E-posta adresinizi girdiğinizde, size şifre sıfırlama talimatları göndereceğiz.
          </Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <FormInput
            control={control}
            name="email"
            label="E-posta Adresi"
            placeholder="E-posta adresinizi girin"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={[styles.resetButton, loading && styles.resetButtonDisabled]}
            onPress={handleSubmit(onSubmit as any)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Şifre Sıfırlama Talimatlarını Gönder</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.backToLoginText}>Giriş Ekranına Dön</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  resetButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  resetButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLogin: {
    marginTop: 16,
  },
  backToLoginText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen; 