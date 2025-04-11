import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Tables } from '../../types/supabase';
import { format, addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { COLORS, FONTS } from '../../constants';
import { createAppointment } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import PaymentPolicyBadge from '../PaymentPolicyBadge';
import PaymentPolicyModal from '../PaymentPolicyModal';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Button from '../common/Button';
import moment from 'moment';
import 'moment/locale/tr';
import { getBranchPaymentPolicy } from '../../services/paymentService';
import { Resource, ResourceType } from '../../models/resources';
import { resourceService } from '../../services/resource-service';
import { getUserPackagesForService } from '../../services/userPackageService';

moment.locale('tr');

// Tarih işlemleri için yardımcı fonksiyonlar
const formatDate = (date: Date, formatStr: string) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const addMinutesDate = (date: Date, minutes: number) => {
  const newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() + minutes);
  return newDate;
};

// Mock createAppointment fonksiyonu
const createAppointmentMock = async (appointmentData: {
  service_id: string;
  customer_id: string;
  business_id: string;
  branch_id?: string;
  staff_id: string;
  appointment_time: Date;
  location_type: "business" | "address";
  address?: string;
  customer_note?: string;
  total_price: number;
}) => {
  // Mock implementation
  console.log('Creating appointment with data:', appointmentData);
  
  // Başarılı işlem simülasyonu
  return {
    id: 'mock-appointment-id-' + Math.random().toString(36).substr(2, 9),
    ...appointmentData
  };
};

// AppointmentSummary komponenti ve props tanımlaması
export interface AppointmentDetails {
  service: Tables<'services'> & { 
    business_name?: string;  // İşletme adı için ek özellik
    paymentPolicy?: 'free_booking' | 'deposit_required' | 'full_payment_required';
    depositRate?: number;
    isCustomPolicy?: boolean;
    resources?: string[];  // Seçilen kaynak ID'leri
  };
  staff: { id: string; name: string; avatar_url?: string };
  date: Date;
  time: string;
  locationTypeValue: 'business' | 'address';
  address?: string;
  notes?: string;
}

export type AppointmentSummaryProps = {
  service: Tables<'services'> & { 
    business_name?: string;  // İşletme adı için ek özellik
    paymentPolicy?: 'free_booking' | 'deposit_required' | 'full_payment_required';
    depositRate?: number;
    isCustomPolicy?: boolean;
    resources?: string[];  // Seçilen kaynak ID'leri
  };
  staff: { id: string; name: string; avatar_url?: string };
  date: Date;
  time: string;
  locationTypeValue: 'business' | 'address';
  address?: string;
  notes?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onBack?: () => void;
  onEdit?: () => void;
};

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  service,
  staff,
  date,
  time,
  locationTypeValue,
  address,
  notes: initialNotes = '',
  onConfirm,
  onCancel,
  onBack,
  onEdit,
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const { user } = useAuth(); // Auth context'ten kullanıcı bilgisini alalım
  const navigation = useNavigation<NavigationProp<any>>();
  const [paymentPolicyLoading, setPaymentPolicyLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);

  // Tarih ve saat formatlama
  const formattedDate = format(date, 'd MMMM yyyy, EEEE');
  const startTime = time;
  const endTime = format(
    addMinutes(new Date(`${date.toISOString().split('T')[0]}T${time}:00`), service.duration_minutes || 30),
    'HH:mm'
  );

  // Seçilen kaynakları yükleme
  useEffect(() => {
    const loadSelectedResources = async () => {
      if (service.resources && service.resources.length > 0) {
        setResourcesLoading(true);
        try {
          // Tek tek getResourceById çağrısı yerine, tüm ID'leri bir dizide getResourcesByIds ile alıyoruz
          const resources = await resourceService.getResourcesByIds(service.resources);
          setSelectedResources(resources.filter(resource => resource !== null) as Resource[]);
        } catch (error) {
          console.error('Kaynaklar yüklenirken hata:', error);
        } finally {
          setResourcesLoading(false);
        }
      }
    };
    
    loadSelectedResources();
  }, [service.resources]);

  const handleConfirmAppointment = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı!');
      }

      // Hizmet fiyatı ve ödeme politikası kontrolü
      const servicePrice = service.price || 0;
      
      // Ücretli bir hizmet mi kontrol ediyoruz
      const isPaidService = servicePrice > 0; 
      
      // Hizmetin ödeme politikasını belirleme
      // 1. Hizmetin kendi özel ayarları (override_business_settings) olabilir
      // 2. İşletmenin genel ayarları olabilir
      // 3. Varsayılan olarak fiyatlı hizmetler tam ödeme gerektirir
      
      // Önce servis nesnesi içindeki paymentPolicy değerini kontrol edelim
      let paymentPolicy = service.paymentPolicy;
      
      // Eğer paymentPolicy tanımlı değilse ve ücretli bir hizmetse tam ödeme gerektirir
      if (!paymentPolicy && isPaidService) {
        console.log('Hizmet ücretli ve ödeme politikası tanımlı değil. Varsayılan olarak tam ödeme gerektirir.');
        paymentPolicy = 'full_payment_required';
      } else if (!paymentPolicy) {
        // Ücretsiz hizmet için veya tanımlı değilse ücretsiz randevu politikası kullan
        paymentPolicy = 'free_booking';
      }
      
      console.log('Hizmet bilgileri:', {
        id: service.id,
        title: service.title,
        price: servicePrice,
        paymentPolicy,
        businessId: service.business_id
      });
      
      // Tarih ve saat bilgisini birleştir (tüm durumlar için aynı)
      const [hour, minute] = time.split(':').map(Number);
      const appointmentDate = new Date(date);
      appointmentDate.setHours(hour, minute, 0, 0);
      const appointmentTimeStr = appointmentDate.toISOString();
      
      // Belirle bu bir ücretsiz randevu mu (free_booking)
      const isFreeBooking = paymentPolicy === 'free_booking';

      // YENİ: Kullanıcının bu hizmet için kullanabileceği paketleri kontrol et
      const applicablePackages = await getUserPackagesForService(user.id, service.id);
      const hasApplicablePackages = applicablePackages.length > 0;

      // Ödeme politikasına göre işlem yap
      if (paymentPolicy === 'deposit_required' || paymentPolicy === 'full_payment_required' || hasApplicablePackages) {
        // Ödeme ekranına yönlendir (depozito, tam ödeme veya paket seçimi için)
        setLoading(false);
        
        const isFullPayment = paymentPolicy === 'full_payment_required';
        const depositRate = service.depositRate || 0.3; // Default olarak %30 depozito
        const depositAmount = service.price * depositRate;
        
        console.log('Ödeme sayfasına yönlendiriliyor:', {
          paymentPolicy,
          isFullPayment,
          depositRate,
          depositAmount,
          totalPrice: service.price,
          hasApplicablePackages,
          applicablePackages: applicablePackages.length
        });
        
        // Parametre olarak gönderilecek verileri hazırla
        navigation.navigate('Payment', {
          serviceName: service.title,
          serviceId: service.id,
          businessId: service.business_id || '',
          businessName: service.business_name || '',
          branchId: service.branch_id || '',
          staffId: staff.id,
          staffName: staff.name,
          appointmentTime: appointmentTimeStr,
          locationType: locationTypeValue,
          address: locationTypeValue === 'address' ? address : undefined,
          customerNote: notes || undefined,
          totalPrice: service.price || 0,
          depositAmount: depositAmount,
          isFullPayment: isFullPayment,
          isFreeBooking: false, // Bu bir free_booking değil
          hasApplicablePackages: hasApplicablePackages, // YENİ: Kullanılabilir paketleri var mı?
          applicablePackages: hasApplicablePackages ? applicablePackages : [] // YENİ: Kullanılabilir paketler
        });
        return;
      } else if (paymentPolicy === 'free_booking') {
        // Ücretsiz randevu için de ödeme sayfasına yönlendir, kapıda ödeme seçeneği varsayılan olsun
        console.log('Ücretsiz randevu - Ödeme sayfasına yönlendiriliyor (kapıda ödeme seçeneği ile)');
        setLoading(false);
        
        navigation.navigate('Payment', {
          serviceName: service.title,
          serviceId: service.id,
          businessId: service.business_id || '',
          businessName: service.business_name || '',
          branchId: service.branch_id || '',
          staffId: staff.id,
          staffName: staff.name,
          appointmentTime: appointmentTimeStr,
          locationType: locationTypeValue,
          address: locationTypeValue === 'address' ? address : undefined,
          customerNote: notes || undefined,
          totalPrice: service.price || 0,
          depositAmount: 0,
          isFullPayment: false,
          isFreeBooking: true  // Bu bir free_booking, kapıda ödeme seçeneği varsayılan olacak
        });
        return;
      } else {
        console.log('Bilinmeyen ödeme politikası, ücretsiz randevu olarak işleniyor:', paymentPolicy);
      }

      // Ödeme gerektirmeyen randevularda doğrudan randevu oluştur
      // Randevu başlangıç zamanını oluşturalım - artık buraya sadece bilinmeyen politika durumlarında düşer
      await createAppointment({
        service_id: service.id,
        customer_id: user.id,
        staff_id: staff.id,
        business_id: service.business_id || '',
        branch_id: service.branch_id || '',
        appointment_time: appointmentTimeStr, // String olarak gönderiliyor
        location_type: locationTypeValue,
        address: locationTypeValue === 'address' ? address : undefined,
        customer_note: notes || undefined,
        total_price: service.price || 0,
        status: 'pending',
      });
      
      // İşlem başarılı, onConfirm çağrılıyor
      onConfirm();
    } catch (err) {
      console.error('Randevu oluşturma hatası:', err);
      setError('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      if (loading) setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Randevu oluşturma işlemini iptal etmek istediğinize emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        { text: 'Evet, İptal Et', style: 'destructive', onPress: () => onBack?.() },
      ]
    );
  };

  const renderResourceItem = (resource: Resource) => {
    // Kaynak tipine göre farklı görüntüleme
    const getResourceTypeText = (type: ResourceType) => {
      switch (type) {
        case ResourceType.TENNIS_COURT:
          return 'Tenis Kortu';
        case ResourceType.TENNIS_RACKET:
          return 'Tenis Raketi';
        default:
          return 'Kaynak';
      }
    };
    
    return (
      <View key={resource.id} style={styles.detailItem}>
        <Text style={styles.detailLabel}>{getResourceTypeText(resource.type)}:</Text>
        <Text style={styles.detailValue}>{resource.name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Onayı</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Randevu Özeti</Text>

          {/* Hizmet Detayları */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="build" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Hizmet Detayları</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hizmet</Text>
              <Text style={styles.detailValue}>{service.title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>İşletme</Text>
              <Text style={styles.detailValue}>{service.business_name || 'İşletme Adı'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Süre</Text>
              <Text style={styles.detailValue}>{service.duration_minutes || 30} dakika</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fiyat</Text>
              <Text style={styles.detailValue}>{service.price?.toFixed(2)} ₺</Text>
            </View>
            
            {/* Ödeme Politikası bilgisi */}
            {service.paymentPolicy && (
              <View style={styles.policyRow}>
                <Text style={styles.detailLabel}>Ödeme Politikası</Text>
                <PaymentPolicyBadge
                  paymentPolicy={service.paymentPolicy}
                  depositRate={service.depositRate || 0}
                  showInfo={true}
                  onInfoPress={() => setShowPolicyModal(true)}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Personel Bilgisi */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="person" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Personel</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Personel</Text>
              <Text style={styles.detailValue}>{staff.name || 'Fark etmez'}</Text>
            </View>
          </TouchableOpacity>

          {/* Tarih ve Saat */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="event" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Tarih ve Saat</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tarih</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Saat</Text>
              <Text style={styles.detailValue}>{startTime} - {endTime}</Text>
            </View>
          </TouchableOpacity>

          {/* Lokasyon */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="location-on" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Lokasyon</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tip</Text>
              <Text style={styles.detailValue}>
                {locationTypeValue === 'business' ? 'İşletme' : 'Adresime Gelsin'}
              </Text>
            </View>
            {locationTypeValue === 'address' && address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Adres</Text>
                <Text style={styles.detailValue}>{address}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Ücret */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Icon name="payment" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Ödeme Bilgileri</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Toplam Ücret</Text>
              <Text style={styles.priceValue}>{service.price.toFixed(2)} ₺</Text>
            </View>
          </View>

          {/* Notlar */}
          <TouchableOpacity 
            style={[styles.detailCard, styles.notesContainer]}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="note" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Ek Notlar</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <Text style={styles.notesText}>
              {notes ? notes : 'Not eklemek için dokunun'}
            </Text>
          </TouchableOpacity>

          {/* Kaynaklar (Tenis kortları, raketler, vb.) */}
          {selectedResources.length > 0 && (
            <View style={styles.resourcesSection}>
              <View style={styles.resourcesHeader}>
                <Text style={styles.resourcesTitle}>Seçilen Kaynaklar</Text>
                <TouchableOpacity onPress={() => onEdit?.()} style={styles.editIcon}>
                  <Icon name="edit" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              
              {resourcesLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                selectedResources.map(resource => renderResourceItem(resource))
              )}
            </View>
          )}

          {/* Hata mesajı */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" size={20} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Butonlar */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>İptal Et</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirmAppointment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Randevuyu Onayla</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Ödeme Politikası Modal */}
      <PaymentPolicyModal 
        visible={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  placeholderIcon: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 12,
  },
  detailHeaderText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginLeft: 8,
    flex: 1,
  },
  editIcon: {
    marginLeft: 'auto',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    maxWidth: '60%',
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    paddingVertical: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    marginLeft: 8,
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelButton: {
    backgroundColor: COLORS.lightGray,
    flex: 1,
    marginRight: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  resourcesSection: {
    marginVertical: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  resourcesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourcesTitle: {
    ...FONTS.h3,
    color: COLORS.black,
  },
});

// Named export ve default export birlikte sağlıyoruz
export default AppointmentSummary; 