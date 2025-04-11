import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { getUserData, getUserAddresses, getUserPaymentMethods, getUserAppointments, getBusinessData, getServiceData } from '../../services/dataService';
import { Tables } from '../../types/supabase';
import { Colors } from '../../constants/Colors';

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

type Address = Tables<'addresses'>;
type PaymentMethod = Tables<'payment_methods'>;

interface Appointment {
  id: string;
  business_name: string;
  service_name: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
}

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      // Kullanıcı bilgilerini al
      const { data: userData, error: userError } = await getUserData(user.id);
      
      if (userError || !userData) {
        throw new Error('Kullanıcı bilgileri yüklenirken bir hata oluştu');
      }
      
      // Profil nesnesini oluştur
      setProfile({
        id: userData.id,
        email: user?.email || userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        avatar_url: userData.profile_image,
        phone: userData.phone,
        created_at: userData.created_at
      });
      
      // Adres bilgilerini al
      const { data: addressData, error: addressError } = await getUserAddresses(user.id);
      
      if (!addressError) {
        setAddresses(addressData || []);
      } else {
        console.error('Adres bilgileri yüklenirken hata:', addressError);
      }
      
      // Ödeme yöntemlerini al
      const { data: paymentData, error: paymentError } = await getUserPaymentMethods(user.id);
      
      if (!paymentError) {
        setPaymentMethods(paymentData || []);
      } else {
        console.error('Ödeme yöntemleri yüklenirken hata:', paymentError);
      }
      
      // Randevu bilgilerini al
      const { data: appointmentData, error: appointmentError } = await getUserAppointments(user.id);
      
      if (!appointmentError && appointmentData) {
        // Randevu verilerini zenginleştir ve görüntülenecek formata dönüştür
        const formattedAppointments: Appointment[] = await Promise.all(
          appointmentData.map(async (appt) => {
            // İşletme bilgilerini al
            const { data: businessData } = await getBusinessData(appt.business_id);
            // Hizmet bilgilerini al
            const { data: serviceData } = await getServiceData(appt.service_id);
            
            return {
              id: appt.id,
              business_name: businessData?.name || `İşletme ${appt.business_id}`,
              service_name: serviceData?.title || `Hizmet ${appt.service_id}`,
              date: appt.appointment_time,
              status: appt.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
              total_price: appt.total_price
            };
          })
        );
        
        setAppointments(formattedAppointments);
      } else {
        console.error('Randevu bilgileri yüklenirken hata:', appointmentError);
      }
      
    } catch (error) {
      console.error('Profil verileri yüklenirken hata:', error);
      Alert.alert('Hata', 'Profil bilgileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Çıkış Yap',
          onPress: logout
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  const menuItems = [
    {
      icon: 'time-outline',
      title: 'Sipariş Geçmişi',
      onPress: () => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek'),
      iconBgColor: '#FFE8E8',
      iconColor: '#FF6B6B',
    },
    {
      icon: 'location-outline',
      title: 'Adreslerim',
      onPress: () => navigation.navigate('AddressManagement'),
      iconBgColor: '#E4F3FF',
      iconColor: '#50A8EA',
    },
    {
      icon: 'calendar-outline',
      title: 'Randevularım',
      onPress: () => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek'),
      iconBgColor: '#E6F9F1',
      iconColor: '#27AE60',
    },
    {
      icon: 'heart-outline',
      title: 'Favorilerim',
      onPress: () => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek'),
      iconBgColor: '#FFEFEB',
      iconColor: '#FF8C6B',
    },
    {
      icon: 'settings-outline',
      title: 'Ayarlar',
      onPress: () => Alert.alert('Bilgi', 'Bu özellik yakında eklenecek'),
      iconBgColor: '#F0F0F0',
      iconColor: '#888888',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Profil Bilgileri */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }} 
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{profile?.firstName} {profile?.lastName}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.userPhone}>{profile?.phone || 'Telefon eklenmemiş'}</Text>
            <Text style={styles.userEmail}>{profile?.email}</Text>
          </View>
        </View>
        
        {/* Menü Öğeleri */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.iconBgColor }]}>
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#D1D1D6" />
            </TouchableOpacity>
          ))}

          {/* Paketlerim */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('UserPackages')}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="card" size={24} color={Colors.primary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Paketlerim</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
          </TouchableOpacity>

          {/* Ayarlar */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="settings-outline" size={24} color={Colors.primary} style={styles.menuItemIcon} />
              <Text style={styles.menuItemText}>Ayarlar</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
          </TouchableOpacity>
        </View>
        
        {/* Geliştirici Test Butonu */}
        {process.env.NODE_ENV === 'development' && (
          <TouchableOpacity 
            style={styles.devButton}
            onPress={() => navigation.navigate('TestDev')}
          >
            <Ionicons name="code-working" size={20} color="#fff" />
            <Text style={styles.devButtonText}>GELİŞTİRİCİ TEST EKRANI</Text>
          </TouchableOpacity>
        )}
        
        {/* Çıkış Yap */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
          <View style={{flex: 1}} />
          <Ionicons name="chevron-forward" size={20} color="#D1D1D6" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  profileContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFE3D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactInfo: {
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#8E8E93',
  },
  userPhone: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 2,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.22,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 16,
  },
  devButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 16,
  },
});

export default ProfileScreen; 