import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
  SafeAreaView
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { getUserAppointments } from '../../services/dataService';
import { COLORS, FONTS } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format, isBefore, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

type AppointmentListScreenProps = StackScreenProps<any, 'AppointmentList'>;

type AppointmentTab = 'active' | 'past';

interface Appointment {
  id: string;
  service_id: string;
  business_id: string;
  business_name: string;
  staff_id: string;
  staff_name: string;
  appointment_time: string;
  service_name: string;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const AppointmentListScreen: React.FC<AppointmentListScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<AppointmentTab>('active');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Randevuları getir
  const fetchAppointments = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      // Kullanıcının tüm randevularını getir
      const result = await getUserAppointments('user-123'); // Gerçek uygulamada kullanıcı ID dinamik olarak alınacak
      
      if (result.error) {
        setError('Randevular yüklenirken bir hata oluştu.');
        return;
      }
      
      // Her bir randevuya işletme ve personel adı ekle
      const appointmentsWithDetails = await Promise.all(
        result.data.map(async (appointment: any) => {
          // Gerçek uygulamada, bu bilgiler backend'den direkt gelebilir
          // veya ilgili servislere istek atılarak doldurulabilir
          return {
            ...appointment,
            business_name: 'Test İşletmesi', // Bu kısım gerçek verilerle değiştirilecek
            staff_name: 'Test Personeli',    // Bu kısım gerçek verilerle değiştirilecek
            service_name: 'Test Hizmeti',    // Bu kısım gerçek verilerle değiştirilecek
            price: 100                       // Bu kısım gerçek verilerle değiştirilecek
          };
        })
      );
      
      setAppointments(appointmentsWithDetails);
    } catch (err) {
      console.error('Randevular yüklenirken hata:', err);
      setError('Randevular yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Sekme değiştiğinde filtreleme yap
  useEffect(() => {
    const now = new Date();
    
    if (activeTab === 'active') {
      // Aktif (gelecek) randevuları filtrele
      const activeAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.appointment_time);
        return !isBefore(appointmentDate, now) || appointment.status === 'pending';
      });
      setFilteredAppointments(activeAppointments);
    } else {
      // Geçmiş randevuları filtrele
      const pastAppointments = appointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.appointment_time);
        return isBefore(appointmentDate, now) && appointment.status !== 'pending';
      });
      setFilteredAppointments(pastAppointments);
    }
  }, [activeTab, appointments]);

  // Yenile fonksiyonu
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAppointments(false);
  };

  // Randevu detayına git
  const navigateToDetail = (appointmentId: string) => {
    navigation.navigate('AppointmentDetail', { appointmentId });
  };

  // Randevuyu iptal et
  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Randevuyu İptal Et',
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
            // Burada iptal işlemi yapılacak
            Alert.alert('Bilgi', 'Randevu iptal işlemi şu anda geliştirme aşamasındadır.');
          }
        }
      ]
    );
  };

  // Randevuyu yeniden planla
  const handleRescheduleAppointment = (appointmentId: string) => {
    Alert.alert('Bilgi', 'Randevu yeniden planlama işlemi şu anda geliştirme aşamasındadır.');
  };

  // Benzer randevu oluştur
  const handleRebookAppointment = (appointment: Appointment) => {
    navigation.navigate('CreateAppointment', {
      serviceId: appointment.service_id,
      businessId: appointment.business_id
    });
  };

  // Randevu öğesi render etme
  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const appointmentDate = parseISO(item.appointment_time);
    const formattedDate = format(appointmentDate, 'd MMMM yyyy', { locale: tr });
    const formattedTime = format(appointmentDate, 'HH:mm', { locale: tr });
    
    const statusColors = {
      pending: COLORS.warning,
      confirmed: COLORS.success,
      cancelled: COLORS.error,
      completed: COLORS.gray
    };
    
    const statusText = {
      pending: 'Onay Bekliyor',
      confirmed: 'Onaylandı',
      cancelled: 'İptal Edildi',
      completed: 'Tamamlandı'
    };

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => navigateToDetail(item.id)}
      >
        <View style={styles.appointmentHeader}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{item.business_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
              <Text style={styles.statusText}>{statusText[item.status]}</Text>
            </View>
          </View>
          <Text style={styles.price}>{item.price} TL</Text>
        </View>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Icon name="event" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="access-time" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="spa" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.service_name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="person" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.staff_name}</Text>
          </View>
        </View>
        
        {activeTab === 'active' && item.status !== 'cancelled' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelAppointment(item.id)}
            >
              <Icon name="close" size={16} color={COLORS.error} />
              <Text style={[styles.actionText, styles.cancelText]}>İptal Et</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => handleRescheduleAppointment(item.id)}
            >
              <Icon name="event" size={16} color={COLORS.primary} />
              <Text style={[styles.actionText, styles.rescheduleText]}>Yeniden Planla</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {activeTab === 'past' && item.status !== 'cancelled' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rebookButton]}
              onPress={() => handleRebookAppointment(item)}
            >
              <Icon name="refresh" size={16} color={COLORS.primary} />
              <Text style={[styles.actionText, styles.rebookText]}>Tekrar Randevu Al</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Boş içerik durumu
  const renderEmptyContent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="event-busy" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyText}>
        {activeTab === 'active' 
          ? 'Aktif randevunuz bulunmamaktadır.' 
          : 'Geçmiş randevunuz bulunmamaktadır.'}
      </Text>
      {activeTab === 'active' && (
        <TouchableOpacity 
          style={styles.newAppointmentButton}
          onPress={() => navigation.navigate('CreateAppointment')}
        >
          <Text style={styles.newAppointmentButtonText}>Yeni Randevu Oluştur</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Yükleniyor gösterimi
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Randevularım</Text>
        </View>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Randevularınız yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hata gösterimi
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Randevularım</Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchAppointments()}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Randevularım</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateAppointment')}
        >
          <Icon name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Aktif Randevular
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Geçmiş Randevular
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  addButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  price: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  appointmentDetails: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.errorLight,
  },
  rescheduleButton: {
    backgroundColor: COLORS.primaryLight,
  },
  rebookButton: {
    backgroundColor: COLORS.primaryLight,
  },
  actionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginLeft: 4,
  },
  cancelText: {
    color: COLORS.error,
  },
  rescheduleText: {
    color: COLORS.primary,
  },
  rebookText: {
    color: COLORS.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  newAppointmentButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newAppointmentButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
});

export default AppointmentListScreen; 