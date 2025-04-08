import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';

import { useAuth } from '../../contexts/AuthContext';
import FormInput from '../../components/FormInput';
import { registerSchema } from '../../utils/validation';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const RegisterScreen = () => {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const { error } = await register(data.email, data.password);

      if (error) throw error;

      Alert.alert(
        'Kayıt Başarılı',
        'Hesabınız oluşturuldu! Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      
      // Hata mesajını Türkçe'ye çevirme
      if (error.message?.includes('User already registered')) {
        setErrorMessage('Bu e-posta adresi zaten kayıtlı');
      } else {
        setErrorMessage(error.message || 'Kayıt olurken bir hata oluştu');
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
          <Text style={styles.title}>Yeni Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Esnaf uygulamasına hoş geldiniz</Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <FormInput
            control={control}
            name="firstName"
            label="Ad"
            placeholder="Adınızı girin"
            autoCapitalize="words"
          />

          <FormInput
            control={control}
            name="lastName"
            label="Soyad"
            placeholder="Soyadınızı girin"
            autoCapitalize="words"
          />

          <FormInput
            control={control}
            name="email"
            label="E-posta Adresi"
            placeholder="E-posta adresinizi girin"
            keyboardType="email-address"
          />

          <FormInput
            control={control}
            name="phone"
            label="Telefon Numarası"
            placeholder="Telefon numaranızı girin"
            keyboardType="phone-pad"
          />

          <FormInput
            control={control}
            name="password"
            label="Şifre"
            placeholder="Şifrenizi girin"
            secureTextEntry
          />

          <FormInput
            control={control}
            name="confirmPassword"
            label="Şifre Tekrarı"
            placeholder="Şifrenizi tekrar girin"
            secureTextEntry
          />

          <Controller
            control={control}
            name="termsAccepted"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View style={styles.termsContainer}>
                <CheckBox
                  checked={value}
                  onPress={() => onChange(!value)}
                  containerStyle={styles.checkbox}
                  title="Kullanım şartlarını ve gizlilik politikasını kabul ediyorum"
                  textStyle={styles.termsText}
                />
                {error && <Text style={styles.termsError}>{error.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleSubmit(onSubmit as any)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Kayıt Ol</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Zaten hesabınız var mı?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
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
  termsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginLeft: 0,
  },
  termsText: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  termsError: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
    marginRight: 4,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default RegisterScreen; 