import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { DateTimeSelection } from '../../components/appointment/DateTimeSelection';
import { StaffSelection } from '../../components/appointment/StaffSelection';
import AppointmentSummary, { AppointmentDetails } from '../../components/appointment/AppointmentSummary';
import ServiceSelection from '../../components/appointment/ServiceSelection';
import { getServiceData, getBusinessData } from '../../services/dataService';
import { COLORS, FONTS } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ResourceType } from '../../models/resources';
import { ServiceType } from '../../models/services/types';
import PackageSelection from '../../components/appointment/PackageSelection';
import { useServiceRight } from '../../services/userPackageService';

type AppointmentStep = 'service' | 'datetime' | 'staff' | 'summary' | 'resources' | 'purchase' | 'package';

export type AppointmentScreenProps = StackScreenProps<any, 'Appointment'>;

interface UserPackage {
  id: string;
  user_id: string;
  package_id: string;
  purchase_date: Date;
  expiry_date: Date;
  total_services: number;  // Toplam hizmet sayısı
  used_services: number;   // Kullanılan hizmet sayısı
  remaining_services: number;  // Kalan hizmet sayısı
  status: 'active' | 'expired' | 'consumed';  // Paket durumu
  services: {
    service_id: string;
    total_count: number;
    used_count: number;
  }[];
}

const AppointmentScreen: React.FC<AppointmentScreenProps> = ({ navigation, route }) => {
  // Route params
  const initialServiceId = route.params?.serviceId;
  const initialBusinessId = route.params?.businessId;

  // State
  const [currentStep, setCurrentStep] = useState<AppointmentStep>('service');
  const [loading, setLoading] = useState(false);
  
  // Seçilen bilgiler
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
    price: number;
    duration: number;
    category_id?: string; // Hizmetin kategori ID'si (kaynak gerektiren hizmetleri belirlemek için)
    service_type?: ServiceType; // Hizmet tipi (SERVICE, RESOURCE, PRODUCT, PACKAGE)
    requires_resource?: boolean; // Kaynak gerektirip gerektirmediği
    requires_staff?: boolean; // Personel gerektirip gerektirmediği
    is_purchasable?: boolean; // Satın alınabilir ürün mü?
  } | null>(null);
  
  const [selectedBusiness, setSelectedBusiness] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: Date;
    time: string;
  } | null>(null);
  
  const [selectedStaff, setSelectedStaff] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<'business' | 'home'>('business');
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');

  // Paket ve kullanım hakları için state değişkenleri
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [hasUsageRights, setHasUsageRights] = useState(false);

  // Hizmetin kaynak gerektirip gerektirmediğini kontrol etme fonksiyonu
  const requiresResource = () => {
    if (!selectedService) return false;
    
    // Service type kontrolü
    if (selectedService.service_type === ServiceType.RESOURCE) {
      return true;
    }
    
    // Eskiden olduğu gibi sabit kategori ve anahtar kelime kontrolü
    const sportCategoryId = 'category-uuid-8'; // Spor ve Rekreasyon kategorisi ID'si
    const requiresCourtKeywords = ['kort', 'tenis', 'court', 'tennis', 'raket', 'racket'];
    const serviceName = selectedService.name.toLowerCase();
    
    // Hizmet adı kort/tenis/raket gibi kelimeleri içeriyor mu?
    const containsKeyword = requiresCourtKeywords.some(keyword => serviceName.includes(keyword));
    
    // Spor kategorisinde mi veya kaynak gerektiren anahtar kelimeleri içeriyor mu?
    return selectedService.category_id === sportCategoryId || containsKeyword;
  };
  
  // Personel gerekip gerekmediğini kontrol etme
  const requiresStaff = () => {
    if (!selectedService) return true; // Varsayılan olarak personel gerektirir
    
    // Servis tipi kontrolü - doğrudan service_type ve requires_staff alanlarını kontrol et
    if (selectedService.service_type === ServiceType.SERVICE && selectedService.requires_staff) {
      return true;
    }
    
    if (selectedService.service_type === ServiceType.RESOURCE && !selectedService.requires_staff) {
      return false;
    }
    
    if (selectedService.service_type === ServiceType.PRODUCT) {
      return false; // Ürünler personel gerektirmez
    }
    
    // Kaynak gerektiren hizmetler (kort rezervasyonu gibi) genellikle personel gerektirmez
    return !requiresResource();
  };
  
  // Doğrudan satın alınabilir mi kontrol et (Ürün veya Paket)
  const isPurchasable = () => {
    if (!selectedService) return false;
    
    return selectedService.service_type === ServiceType.PRODUCT || 
           (selectedService.is_purchasable === true);
  };
  
  // Hizmet türüne göre kaynak tipini belirleme
  const getResourceType = (): ResourceType | null => {
    if (!selectedService) return null;
    
    const serviceName = selectedService.name.toLowerCase();
    
    if (serviceName.includes('kort') || serviceName.includes('court') || serviceName.includes('tenis')) {
      return ResourceType.TENNIS_COURT;
    }
    
    if (serviceName.includes('raket') || serviceName.includes('racket')) {
      return ResourceType.TENNIS_RACKET;
    }
    
    // Varsayılan olarak tenis kortu dönelim (bu özel durumda)
    return ResourceType.TENNIS_COURT;
  };

  // Eğer route'dan bir serviceId ve businessId geldiyse, ilk başta o hizmeti yükleme
  useEffect(() => {
    const loadInitialService = async () => {
      if (initialServiceId && initialBusinessId) {
        setLoading(true);
        try {
          const { data: serviceData, error } = await getServiceData(initialServiceId);
          if (serviceData && !error) {
            setSelectedService({
              id: serviceData.id,
              name: serviceData.title,
              price: serviceData.price,
              duration: serviceData.duration_minutes || 30,
              category_id: serviceData.category_id,
              service_type: serviceData.service_type,
              requires_resource: serviceData.requires_resource,
              requires_staff: serviceData.requires_staff,
              is_purchasable: serviceData.is_purchasable
            });
            
            // İşletme bilgisini al veya varsayılan değer kullan
            const businessInfo = await getBusinessData(initialBusinessId);
            
            setSelectedBusiness({
              id: initialBusinessId,
              name: businessInfo?.data?.name || 'İşletme'
            });
            
            // Hizmet tipine göre sonraki adımı belirle
            if (serviceData.service_type === ServiceType.PRODUCT || 
                serviceData.is_purchasable === true) {
              setCurrentStep('purchase'); // Ürün veya satın alınabilir paket ise doğrudan satın alma adımına git
            } else if (serviceData.service_type === ServiceType.RESOURCE ||
                      (serviceData.requires_resource && !serviceData.requires_staff)) {
              setCurrentStep('datetime'); // Kaynak gerektirip personel gerektirmeyen hizmetler için zaman seçimine git
              
              // Varsayılan personel ata
              setSelectedStaff({
                id: 'default-staff-id',
                name: 'Personel Atanmadı'
              });
            } else {
              setCurrentStep('staff'); // Normal hizmetler için personel seçimi adımına git
            }
          }
        } catch (error) {
          console.error('Hizmet yüklenirken hata:', error);
          Alert.alert('Hata', 'Hizmet bilgileri yüklenirken bir sorun oluştu.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadInitialService();
  }, [initialServiceId, initialBusinessId]);

  // Adımları tanımlama
  const steps = [
    { key: 'service', title: 'Hizmet' },
    { key: 'staff', title: 'Personel' },
    { key: 'datetime', title: 'Tarih & Saat' },
    { key: 'location', title: 'Konum' },
    { key: 'package', title: 'Paket' }, // Yeni adım
    { key: 'summary', title: 'Özet' },
  ];

  // handleStepChange fonksiyonunu güncelle
  const handleStepChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (currentStep < steps.length - 1) {
        // Eğer kullanıcının kullanım hakkı varsa ve "paket" adımındaysak, 
        // kullanıcıyı doğrudan özet adımına yönlendir
        if (currentStep === 3 && (hasUsageRights || selectedPackageId)) {
          setCurrentStep(5); // 'summary' adımına git
          return;
        }
        
        setCurrentStep(currentStep + 1);
      } else {
        handleCompleteAppointment();
      }
    } else {
      if (currentStep > 0) {
        // Eğer özet adımından geri dönülüyorsa ve kullanıcının kullanım hakkı varsa, 
        // "location" adımına dön (paket adımını atla)
        if (currentStep === 5 && (hasUsageRights || selectedPackageId)) {
          setCurrentStep(3); // 'location' adımına dön
          return;
        }
        
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Paket seçimini işleyen fonksiyon
  const handlePackageSelected = (packageId: string | null) => {
    setSelectedPackageId(packageId);
  };

  // Kullanım haklarını işleyen fonksiyon
  const handleUsageRights = (hasRights: boolean) => {
    setHasUsageRights(hasRights);
  };

  // Tamamlama fonksiyonunu güncelle
  const handleCompleteAppointment = async () => {
    if (!user) {
      Alert.alert('Hata', 'Randevu oluşturmak için giriş yapmalısınız.');
      return;
    }
    
    if (!selectedService || !selectedStaff || !selectedDateTime) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm randevu bilgilerini tamamlayın.');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Ödeme politikasına göre işlem yap
      const service = selectedService;
      
      // Eğer hizmetin bir ödeme politikası varsa ona göre işleyelim
      const paymentPolicy = service.payment_policy || 'no_payment';
      
      // Eğer kullanım hakkı veya seçili paket varsa, doğrudan randevu oluştur
      if (hasUsageRights || selectedPackageId) {
        // Eğer bir paket seçilmişse, paketi kullan
        if (selectedPackageId) {
          await useServiceRight(user.id, service.id);
        }
        
        // Randevuyu oluştur
        await createAppointment({
          service_id: service.id,
          staff_id: selectedStaff.id,
          business_id: service.business_id,
          branch_id: selectedStaff.branch_id || '',
          appointment_time: selectedDateTime.toISOString(),
          location_type: locationType,
          address: locationType === 'address' ? address : undefined,
          customer_note: customerNote,
          total_price: service.price,
          payment_status: 'paid',
          payment_type: selectedPackageId ? 'package' : 'direct',
          used_package_id: selectedPackageId,
          status: 'pending',
        });
        
        // Başarı mesajı göster
        Alert.alert(
          'Randevu Oluşturuldu',
          'Randevunuz başarıyla oluşturuldu. Randevularınız sayfasından detayları görüntüleyebilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('AppointmentList')
            }
          ]
        );
        
        return;
      }
      
      // Ödeme politikasına göre ödeme ekranına yönlendir
      switch (paymentPolicy) {
        case 'free_booking':
          // Ücretsiz randevu - direkt oluştur
          navigation.navigate('Payment', {
            serviceName: service.title,
            serviceId: service.id,
            businessId: service.business_id,
            businessName: businessName,
            branchId: selectedStaff.branch_id,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            appointmentTime: selectedDateTime.toISOString(),
            locationType: locationType,
            address: address,
            customerNote: customerNote,
            totalPrice: service.price,
            isFreeBooking: true
          });
          break;
          
        case 'deposit_required':
          // Depozito gerektiren randevu
          const depositAmount = service.deposit_amount || (service.price * 0.2);
          
          navigation.navigate('Payment', {
            serviceName: service.title,
            serviceId: service.id,
            businessId: service.business_id,
            businessName: businessName,
            branchId: selectedStaff.branch_id,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            appointmentTime: selectedDateTime.toISOString(),
            locationType: locationType,
            address: address,
            customerNote: customerNote,
            totalPrice: service.price,
            depositAmount: depositAmount,
            isFreeBooking: false
          });
          break;
          
        case 'full_payment_required':
          // Tam ödeme gerektiren randevu
          navigation.navigate('Payment', {
            serviceName: service.title,
            serviceId: service.id,
            businessId: service.business_id,
            businessName: businessName,
            branchId: selectedStaff.branch_id,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            appointmentTime: selectedDateTime.toISOString(),
            locationType: locationType,
            address: address,
            customerNote: customerNote,
            totalPrice: service.price,
            isFullPayment: true,
            isFreeBooking: false
          });
          break;
          
        default:
          // Varsayılan: Ücretsiz randevu
          navigation.navigate('Payment', {
            serviceName: service.title,
            serviceId: service.id,
            businessId: service.business_id,
            businessName: businessName,
            branchId: selectedStaff.branch_id,
            staffId: selectedStaff.id,
            staffName: selectedStaff.name,
            appointmentTime: selectedDateTime.toISOString(),
            locationType: locationType,
            address: address,
            customerNote: customerNote,
            totalPrice: service.price,
            isFreeBooking: true
          });
          break;
      }
    } catch (error) {
      console.error('Randevu oluşturulurken hata:', error);
      Alert.alert('Hata', 'Randevu oluşturulurken bir sorun oluştu.');
    } finally {
      setProcessing(false);
    }
  };

  // Yükleme durumunu gösterme
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Adım bileşenleri
  const renderCurrentStep = () => {
    switch (steps[currentStep].key) {
      case 'service':
        return (
          <ServiceSelection
            onServiceSelect={(service: { id: string; name: string; price: number; duration: number }, 
                             business: { id: string; name: string }) => {
              setSelectedService(service);
              setSelectedBusiness(business);
              handleStepChange('next');
            }}
            onBack={() => navigation.goBack()}
            initialServiceId={initialServiceId}
            initialBusinessId={initialBusinessId}
          />
        );
        
      case 'staff':
        if (!selectedService || !selectedBusiness) {
          setCurrentStep('service');
          return null;
        }
        return (
          <StaffSelection
            serviceId={selectedService.id}
            businessId={selectedBusiness.id}
            onStaffSelect={(staff) => {
              setSelectedStaff(staff);
              handleStepChange('next');
            }}
            onBack={() => handleStepChange('prev')}
          />
        );

      case 'datetime':
        if (!selectedService || !selectedBusiness) {
          setCurrentStep('service');
          return null;
        }
        
        // Kaynak gerektiren hizmetler için personel kontrolü yapmayız
        if (!requiresResource() && !selectedStaff) {
          setCurrentStep('staff');
          return null;
        }
        
        return (
          <DateTimeSelection
            serviceId={selectedService.id}
            businessId={selectedBusiness.id}
            staffId={requiresResource() ? undefined : selectedStaff?.id}
            onSelect={(dateTime) => {
              setSelectedDateTime(dateTime);
              handleStepChange('next');
            }}
            onBack={() => handleStepChange('prev')}
          />
        );
        
      case 'location':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Konum Seçimi</Text>
            <Text style={styles.stepDescription}>
              Randevunuzun konumunu seçin
            </Text>
            
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {
                Alert.alert(
                  'Konum Seçimi',
                  'Randevu konumunu seçin',
                  [
                    { 
                      text: 'İşletme Adresi', 
                      onPress: () => setLocationType('business') 
                    },
                    { 
                      text: 'Ev Adresi', 
                      onPress: () => {
                        setLocationType('home');
                        // Burada adres seçme modalı açılabilir
                      } 
                    },
                    { 
                      text: 'İptal', 
                      style: 'cancel' 
                    }
                  ]
                );
              }}
            >
              <Text style={styles.locationButtonText}>
                {locationType === 'business' ? 'İşletme Adresi' : 'Ev Adresi'}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'package':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Paket ve Kullanım Hakları</Text>
            <Text style={styles.stepDescription}>
              Varsa kullanmak istediğiniz paketi seçebilirsiniz veya normal ödeme yapabilirsiniz.
            </Text>
            
            {selectedService && (
              <PackageSelection
                serviceId={selectedService.id}
                onPackageSelected={handlePackageSelected}
                onUseRights={handleUsageRights}
              />
            )}
          </View>
        );

      case 'summary':
        if (!selectedService || !selectedBusiness || !selectedDateTime) {
          setCurrentStep('service');
          return null;
        }
        
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Randevu Özeti</Text>
            
            <View style={styles.summaryContainer}>
              <AppointmentSummary
                service={{
                  id: selectedService.id,
                  title: selectedService.name,
                  price: selectedService.price,
                  duration_minutes: selectedService.duration,
                  business_id: selectedBusiness.id,
                  business_name: selectedBusiness.name,
                  approval_status: 'approved',
                  branch_id: null,
                  category_id: null,
                  description: null,
                  is_active: true,
                  service_type_id: null,
                  staff_id: null
                }}
                staff={{
                  id: selectedStaff?.id || 'default-staff-id',
                  name: selectedStaff?.name || 'Personel Atanmadı'
                }}
                date={selectedDateTime.date}
                time={selectedDateTime.time}
                locationTypeValue={locationType === 'home' ? 'address' : 'business'}
                address={locationType === 'home' ? address : undefined}
                notes={note}
                onConfirm={handleCompleteAppointment}
                onCancel={() => navigation.goBack()}
                onBack={() => handleStepChange('prev')}
                onEdit={() => Alert.alert('Düzenle', 'Bu özellik şu anda geliştirme aşamasındadır.')}
              />
              
              {/* Paket bilgisi */}
              {selectedPackageId && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Paket:</Text>
                  <Text style={styles.summaryValue}>Seçili Paket Kullanılacak</Text>
                </View>
              )}
              
              {hasUsageRights && !selectedPackageId && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Kullanım Hakkı:</Text>
                  <Text style={styles.summaryValue}>Mevcut Kullanım Hakkı Kullanılacak</Text>
                </View>
              )}
              
              {/* Ödeme bilgisi */}
              {!hasUsageRights && !selectedPackageId && selectedService && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Ödeme:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedService.payment_policy === 'free_booking' ? 'Ücretsiz Rezervasyon' :
                     selectedService.payment_policy === 'deposit_required' ? 'Depozito Gerekli' :
                     selectedService.payment_policy === 'full_payment_required' ? 'Tam Ödeme Gerekli' :
                     'Ücretsiz Rezervasyon'}
                  </Text>
                </View>
              )}
            </View>
            
            {processing ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteAppointment}
              >
                <Text style={styles.completeButtonText}>Randevuyu Onayla</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 20,
  },
  locationButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 5,
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryItem: {
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  completeButton: {
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 20,
  },
});

export default AppointmentScreen; 