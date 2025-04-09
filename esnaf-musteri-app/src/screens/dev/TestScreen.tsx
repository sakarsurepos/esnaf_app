import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllServiceCategories, 
  getAllServices, 
  getAllBusinesses,
  seedDatabaseWithSampleData
} from '../../services/dataService';
import { sampleUsers } from '../../models';

const TestScreen = () => {
  const { user, login, logout, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<string>('');

  // Test login with sample user
  const handleTestLogin = async () => {
    // Örnek kullanıcılardan birini kullan
    const testUser = sampleUsers[0];
    try {
      const { error } = await login(testUser.email, testUser.password_hash);
      if (error) {
        Alert.alert('Giriş Hatası', error.message);
      } else {
        Alert.alert('Başarılı', 'Örnek kullanıcı ile giriş yapıldı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş sırasında bir hata oluştu');
    }
  };

  // Login with entered credentials
  const handleManualLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre gereklidir');
      return;
    }

    try {
      const { error } = await login(email, password);
      if (error) {
        Alert.alert('Giriş Hatası', error.message);
      } else {
        Alert.alert('Başarılı', 'Giriş yapıldı');
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş sırasında bir hata oluştu');
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'E-posta ve şifre gereklidir');
      return;
    }

    try {
      const { error } = await register(email, password);
      if (error) {
        Alert.alert('Kayıt Hatası', error.message);
      } else {
        Alert.alert('Başarılı', 'Hesap oluşturuldu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Başarılı', 'Çıkış yapıldı');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış sırasında bir hata oluştu');
    }
  };

  // Test API calls
  const testGetCategories = async () => {
    try {
      const { data, error } = await getAllServiceCategories();
      if (error) {
        setResults(`Hata: ${JSON.stringify(error)}`);
      } else {
        setResults(`Kategoriler (${data.length} adet):\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResults(`İstisna: ${JSON.stringify(error)}`);
    }
  };

  const testGetServices = async () => {
    try {
      const { data, error } = await getAllServices();
      if (error) {
        setResults(`Hata: ${JSON.stringify(error)}`);
      } else {
        setResults(`Hizmetler (${data.length} adet):\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResults(`İstisna: ${JSON.stringify(error)}`);
    }
  };

  const testGetBusinesses = async () => {
    try {
      const { data, error } = await getAllBusinesses();
      if (error) {
        setResults(`Hata: ${JSON.stringify(error)}`);
      } else {
        setResults(`İşletmeler (${data.length} adet):\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      setResults(`İstisna: ${JSON.stringify(error)}`);
    }
  };

  const testSeedDatabase = async () => {
    try {
      const { success, error } = await seedDatabaseWithSampleData();
      if (!success) {
        setResults(`Tohum Hatası: ${JSON.stringify(error)}`);
      } else {
        setResults(`Veritabanı başarıyla örneklerle dolduruldu!`);
      }
    } catch (error) {
      setResults(`İstisna: ${JSON.stringify(error)}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GELİŞTİRİCİ TEST EKRANI</Text>
        
        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.infoLabel}>Giriş Yapan Kullanıcı:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
            <Text style={styles.infoLabel}>Kullanıcı ID:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.loginForm}>
            <Text style={styles.infoLabel}>Oturum Açık Değil</Text>
            
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button} onPress={handleManualLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleTestLogin}>
              <Text style={styles.buttonText}>Örnek Kullanıcı ile Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VERİ TESTLERİ</Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity style={styles.apiButton} onPress={testGetCategories}>
            <Text style={styles.buttonText}>Kategorileri Getir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.apiButton} onPress={testGetServices}>
            <Text style={styles.buttonText}>Hizmetleri Getir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.apiButton} onPress={testGetBusinesses}>
            <Text style={styles.buttonText}>İşletmeleri Getir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.apiButton} onPress={testSeedDatabase}>
            <Text style={styles.buttonText}>Veritabanını Doldur</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SONUÇLAR</Text>
        <ScrollView style={styles.resultsContainer}>
          <Text style={styles.resultsText}>{results || 'Henüz sonuç yok'}</Text>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  loginForm: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  apiButton: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    maxHeight: 300,
  },
  resultsText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
});

export default TestScreen; 