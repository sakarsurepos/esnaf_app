import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { getAppointmentData, getBusinessData, getServiceData } from '../../services/dataService';
import { Tables } from '../../types/supabase';

type AppointmentDetailScreenRouteProp = RouteProp<ProfileStackParamList, 'AppointmentDetail'>;
type AppointmentDetailScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'AppointmentDetail'>;

interface DetailedAppointment {
  id: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  customer_note: string | null;
  location_type: string;
  address: string | null;
  service: {
    id: string;
    title: string;
    description: string | null;
    duration_minutes: number;
    price: number;
  } | null;
  business: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    description: string | null;
  } | null;
}

const AppointmentDetailScreen = () => {
  const navigation = useNavigation<AppointmentDetailScreenNavigationProp>();
  const route = useRoute<AppointmentDetailScreenRouteProp>();
  const { appointmentId } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<DetailedAppointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointmentDetails();
  }, [appointmentId]);

  const loadAppointmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Randevu verilerini al
      const { data: appointmentData, error: appointmentError } = await getAppointmentData(appointmentId);
      
      if (appointmentError || !appointmentData) {
        throw new Error('Randevu bilgileri yüklenirken bir hata oluştu');
      }
      
      // İşletme ve hizmet bilgilerini al
      const { data: businessData } = await getBusinessData(appointmentData.business_id || '');
      const { data: serviceData } = await getServiceData(appointmentData.service_id || '');
      
      // Detaylı randevu nesnesini oluştur
      const detailedAppointment: DetailedAppointment = {
        id: appointmentData.id,
        appointment_time: appointmentData.appointment_time,
        status: appointmentData.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        total_price: appointmentData.total_price,
        customer_note: appointmentData.customer_note,
        location_type: appointmentData.location_type,
        address: appointmentData.address,
        service: serviceData ? {
          id: serviceData.id,
          title: serviceData.title,
          description: serviceData.description,
          // @ts-ignore - duration_minutes null olabilir ama varsayılan değer atıyoruz
          duration_minutes: serviceData.duration_minutes ?? 0,
          price: serviceData.price
        } : null,
        business: businessData ? {
          id: businessData.id,
          name: businessData.name,
          phone: businessData.phone,
          email: businessData.email,
          description: businessData.description
        } : null
      };
      
      setAppointment(detailedAppointment);
      
    } catch (error) {
      console.error('Randevu detayları yüklenirken hata:', error);
      setError('Randevu detayları yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#2ecc71';
      case 'pending': return '#f39c12';
      case 'completed': return '#3498db';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Bekliyor';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getLocationTypeText = (locationType: string) => {
    switch (locationType) {
      case 'on_site': return 'İşletmede';
      case 'at_home': return 'Evde';
      case 'online': return 'Çevrimiçi';
      default: return 'Belirtilmemiş';
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Randevu İptali',
      'Bu randevuyu iptal etmek istediğinize emin misiniz?',
      [
        {
          text: 'Vazgeç',
          style: 'cancel'
        },
        {
          text: 'İptal Et',
          style: 'destructive',
          onPress: () => {
            // Gerçekte burada iptal işlemi yapılacak
            Alert.alert('Bilgi', 'Bu işlem şu anda geliştirme aşamasındadır.');
          }
        }
      ]
    );
  };

  const handleRescheduleAppointment = () => {
    // Gerçekte burada yeniden planlama ekranına gidilecek
    Alert.alert('Bilgi', 'Bu işlem şu anda geliştirme aşamasındadır.');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Randevu bilgileri yükleniyor...</Text>
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>{error || 'Randevu bulunamadı'}</Text>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Başlık & Durum */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Text style={styles.headerTitle}>Randevu Detayları</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
        </View>
        
        <View style={styles.idContainer}>
          <Text style={styles.idLabel}>Randevu ID:</Text>
          <Text style={styles.idValue}>{appointment.id.substring(0, 8)}...</Text>
        </View>
      </View>

      {/* İşletme Bilgileri */}
      {appointment.business && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İşletme Bilgileri</Text>
          <View style={styles.businessInfo}>
            <View style={styles.businessImageContainer}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/100' }} 
                style={styles.businessImage} 
              />
            </View>
            <View style={styles.businessDetails}>
              <Text style={styles.businessName}>{appointment.business.name}</Text>
              {appointment.business.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{appointment.business.phone}</Text>
                </View>
              )}
              {appointment.business.email && (
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{appointment.business.email}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Hizmet Bilgileri */}
      {appointment.service && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hizmet Bilgileri</Text>
          <View style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{appointment.service.title}</Text>
            {appointment.service.description && (
              <Text style={styles.serviceDescription}>{appointment.service.description}</Text>
            )}
            <View style={styles.serviceDetailsRow}>
              <View style={styles.serviceDetail}>
                <Ionicons name="cash-outline" size={16} color="#666" />
                <Text style={styles.serviceDetailText}>{appointment.service.price.toFixed(2)} ₺</Text>
              </View>
              {appointment.service.duration_minutes && (
                <View style={styles.serviceDetail}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.serviceDetailText}>{appointment.service.duration_minutes} dakika</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Randevu Bilgileri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Randevu Bilgileri</Text>
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Tarih:</Text>
              <Text style={styles.detailValue}>
                {new Date(appointment.appointment_time).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Saat:</Text>
              <Text style={styles.detailValue}>
                {new Date(appointment.appointment_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Toplam Tutar:</Text>
              <Text style={styles.detailValue}>{appointment.total_price.toFixed(2)} ₺</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Hizmet Yeri:</Text>
              <Text style={styles.detailValue}>{getLocationTypeText(appointment.location_type)}</Text>
            </View>
          </View>
          
          {appointment.address && (
            <View style={styles.detailRow}>
              <Ionicons name="home-outline" size={20} color="#666" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Adres:</Text>
                <Text style={styles.detailValue}>{appointment.address}</Text>
              </View>
            </View>
          )}
          
          {appointment.customer_note && (
            <View style={styles.detailRow}>
              <Ionicons name="create-outline" size={20} color="#666" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Notlar:</Text>
                <Text style={styles.detailValue}>{appointment.customer_note}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Eylem Butonları */}
      <View style={styles.actionsContainer}>
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleRescheduleAppointment}
            >
              <Ionicons name="calendar-outline" size={20} color="#3498db" />
              <Text style={styles.actionButtonText}>Yeniden Planla</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelAppointment}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text style={styles.cancelButtonText}>Randevuyu İptal Et</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      
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
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 14,
    color: '#777',
    marginRight: 8,
  },
  idValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  businessImageContainer: {
    marginRight: 16,
  },
  businessImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  businessDetails: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  serviceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  serviceDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  appointmentDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    padding: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  actionButtonText: {
    color: '#3498db',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  }
});

export default AppointmentDetailScreen; 