import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabase';
import { updateProfileSchema } from '../../utils/validation';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'EditProfile'>;

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const { user, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Gerçek uygulamada Supabase'den veri çekme işlemi olacak
      // Örnek kod:
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .eq('id', user?.id)
      //   .single();
      
      // Şimdilik örnek veriler kullanıyoruz
      setTimeout(() => {
        setFormData({
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          phone: '5321234567'
        });
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Profil verileri yüklenirken hata:', error);
      setLoading(false);
      Alert.alert('Hata', 'Profil bilgileri yüklenirken bir sorun oluştu.');
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Hata mesajını temizle
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    try {
      updateProfileSchema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: ValidationErrors = {};
      
      if (error.inner) {
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof ValidationErrors] = err.message;
        });
      }
      
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Gerçek uygulamada burada Supabase ile güncelleme işlemi yapılacak
      // Örnek:
      // 1. Auth service kullanıcı bilgilerini güncelle
      // await updateProfile({
      //   data: { 
      //     firstName: formData.firstName,
      //     lastName: formData.lastName 
      //   }
      // });
      
      // 2. Profiles tablosunu güncelle
      // await supabase
      //   .from('profiles')
      //   .update({ 
      //     first_name: formData.firstName,
      //     last_name: formData.lastName,
      //     phone: formData.phone
      //   })
      //   .eq('id', user?.id);
      
      // Şimdilik başarılı olduğunu varsayıyoruz
      setTimeout(() => {
        setSaving(false);
        Alert.alert(
          'Başarılı',
          'Profil bilgileriniz güncellendi.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 1500);
      
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      setSaving(false);
      Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Profil bilgileri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          {/* Ad Alanı */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adınız</Text>
            <TextInput
              style={[styles.input, errors.firstName ? styles.inputError : null]}
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              placeholder="Adınızı girin"
              autoCapitalize="words"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          {/* Soyad Alanı */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Soyadınız</Text>
            <TextInput
              style={[styles.input, errors.lastName ? styles.inputError : null]}
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              placeholder="Soyadınızı girin"
              autoCapitalize="words"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          {/* Telefon Alanı */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon Numarası</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.phonePrefixText}>+90</Text>
              </View>
              <TextInput
                style={[
                  styles.phoneInput, 
                  errors.phone ? styles.inputError : null
                ]}
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                placeholder="5xx xxx xx xx"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
            <Text style={styles.helperText}>Başında 0 olmadan 10 haneli olarak girin (5xx xxx xx xx)</Text>
          </View>

          {/* Bilgilendirme */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#3498db" />
            <Text style={styles.infoText}>
              Email adresinizi değiştirmek için lütfen "Güvenlik Ayarları" bölümünü kullanın.
            </Text>
          </View>

          {/* Butonlar */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePrefix: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRightWidth: 0,
  },
  phonePrefixText: {
    fontSize: 16,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoText: {
    color: '#3498db',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen; 