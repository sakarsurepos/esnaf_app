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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ProfileStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { getUserData, getUserAddresses, getUserPaymentMethods, getUserAppointments, getBusinessData, getServiceData } from '../../services/dataService';
import { Tables } from '../../types/supabase';

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

  const handleLogout = async () => {
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

  return (
    <ScrollView style={styles.container}>
      {/* Profil Başlığı */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity 
            style={styles.editImageButton}
            onPress={() => Alert.alert('Bilgi', 'Bu özellik şu anda geliştiriliyor.')}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{profile?.firstName} {profile?.lastName}</Text>
        <Text style={styles.profileEmail}>{profile?.email}</Text>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="create-outline" size={20} color="#3498db" />
            <Text style={styles.actionButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#3498db" />
            <Text style={styles.actionButtonText}>Ayarlar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Geliştirici Test Ekranı Düğmesi */}
      {process.env.NODE_ENV === 'development' && (
        <TouchableOpacity 
          style={styles.devButton}
          onPress={() => navigation.navigate('TestDev')}
        >
          <Ionicons name="code-working" size={20} color="#fff" />
          <Text style={styles.devButtonText}>GELİŞTİRİCİ TEST EKRANI</Text>
        </TouchableOpacity>
      )}

      {/* Kullanıcı Bilgileri */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={20} color="#3498db" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Telefon:</Text>
          <Text style={styles.infoText}>{profile?.phone || 'Ayarlanmadı'}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Üyelik Tarihi:</Text>
          <Text style={styles.infoText}>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</Text>
        </View>
      </View>

      {/* Adresler */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Adreslerim</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddressManagement')}>
            <Ionicons name="add-outline" size={22} color="#3498db" />
          </TouchableOpacity>
        </View>
        
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressItem}>
              <View style={styles.addressHeader}>
                <View style={styles.addressTitle}>
                  <Text style={styles.addressTitleText}>{address.title}</Text>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Varsayılan</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressActions}>
                  <TouchableOpacity 
                    style={styles.addressAction}
                    onPress={() => navigation.navigate('AddressManagement')}
                  >
                    <Ionicons name="create-outline" size={18} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addressAction}>
                    <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.addressText}>{address.address}</Text>
              <Text style={styles.addressText}>{address.city}, {address.postal_code}</Text>
            </View>
          ))
        ) : (
          <TouchableOpacity 
            style={styles.emptyListButton}
            onPress={() => navigation.navigate('AddressManagement')}
          >
            <Text style={styles.emptyListText}>Henüz adres eklenmemiş. Eklemek için tıklayın.</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Ödeme Yöntemleri */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ödeme Yöntemlerim</Text>
          <TouchableOpacity>
            <Ionicons name="add-outline" size={22} color="#3498db" />
          </TouchableOpacity>
        </View>
        
        {paymentMethods.length > 0 ? (
          paymentMethods.map((payment) => (
            <View key={payment.id} style={styles.paymentItem}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentInfo}>
                  <Ionicons name="card-outline" size={24} color="#666" />
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentTitle}>{payment.card_type} **** {payment.last_digits}</Text>
                    <Text style={styles.paymentSubtitle}>Son Kullanma: {payment.expires_at}</Text>
                  </View>
                </View>
                {payment.is_default && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Varsayılan</Text>
                  </View>
                )}
              </View>
              <View style={styles.paymentActions}>
                <TouchableOpacity style={styles.paymentAction}>
                  <Ionicons name="create-outline" size={18} color="#3498db" />
                  <Text style={styles.paymentActionText}>Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentAction}>
                  <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                  <Text style={styles.paymentActionText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyListText}>Henüz ödeme yöntemi eklenmemiş</Text>
        )}
      </View>

      {/* Son Randevular */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Son Randevularım</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Appointments', { screen: 'AppointmentList' })}>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <TouchableOpacity 
              key={appointment.id} 
              style={styles.appointmentItem}
              onPress={() => navigation.navigate('Appointments', { 
                screen: 'AppointmentDetail', 
                params: { appointmentId: appointment.id } 
              })}
            >
              <View style={styles.appointmentHeader}>
                <Text style={styles.appointmentTitle}>{appointment.business_name}</Text>
                <View style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: 
                      appointment.status === 'confirmed' ? '#2ecc71' : 
                      appointment.status === 'pending' ? '#f39c12' : 
                      appointment.status === 'completed' ? '#3498db' : '#e74c3c' 
                  }
                ]}>
                  <Text style={styles.statusText}>
                    {
                      appointment.status === 'confirmed' ? 'Onaylandı' : 
                      appointment.status === 'pending' ? 'Bekliyor' : 
                      appointment.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'
                    }
                  </Text>
                </View>
              </View>
              <Text style={styles.appointmentService}>{appointment.service_name}</Text>
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentDetail}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.appointmentDetailText}>
                    {new Date(appointment.date).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <View style={styles.appointmentDetail}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.appointmentDetailText}>
                    {new Date(appointment.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.appointmentDetail}>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.appointmentDetailText}>
                    {appointment.total_price.toFixed(2)} ₺
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyListText}>Henüz randevu oluşturulmamış</Text>
        )}
      </View>

      {/* Sipariş Geçmişi */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sipariş Geçmişim</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.viewAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.orderHistoryButton}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <View style={styles.orderHistoryButtonContent}>
            <Ionicons name="cart-outline" size={24} color="#3498db" />
            <Text style={styles.orderHistoryButtonText}>Siparişlerimi Görüntüle</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Çıkış Yap Butonu */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
      
      {/* Alt Boşluk */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: '#3498db',
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    width: 110,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  addressItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#3498db',
  },
  addressActions: {
    flexDirection: 'row',
  },
  addressAction: {
    marginLeft: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  paymentActions: {
    flexDirection: 'row',
  },
  paymentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentActionText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 4,
  },
  appointmentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  appointmentService: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  appointmentDetails: {
    flexDirection: 'row',
  },
  appointmentDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyListText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3498db',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  emptyListButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  devButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  orderHistoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  orderHistoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderHistoryButtonText: {
    fontSize: 16,
    color: '#3498db',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ProfileScreen; 