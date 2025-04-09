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

type AppointmentStep = 'service' | 'datetime' | 'staff' | 'summary';

export type AppointmentScreenProps = StackScreenProps<any, 'Appointment'>;

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
  
  const [locationType, setLocationType] = useState<'business' | 'home'>('business');
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');

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
              duration: serviceData.duration_minutes || 30
            });
            
            // İşletme bilgisini al veya varsayılan değer kullan
            const businessInfo = await getBusinessData(initialBusinessId);
            
            setSelectedBusiness({
              id: initialBusinessId,
              name: businessInfo?.data?.name || 'İşletme'
            });
            
            // Doğrudan datetime seçimine geç
            setCurrentStep('datetime');
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

  // Adım geçişlerini yönetme fonksiyonları
  const goToNextStep = () => {
    switch (currentStep) {
      case 'service':
        setCurrentStep('staff');
        break;
      case 'staff':
        setCurrentStep('datetime');
        break;
      case 'datetime':
        setCurrentStep('summary');
        break;
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case 'staff':
        setCurrentStep('service');
        break;
      case 'datetime':
        setCurrentStep('staff');
        break;
      case 'summary':
        setCurrentStep('datetime');
        break;
      default:
        navigation.goBack();
        break;
    }
  };

  // Randevu oluşturma tamamlandığında
  const handleAppointmentCreated = () => {
    Alert.alert(
      'Randevu Oluşturuldu',
      'Randevunuz başarıyla oluşturuldu. Randevularınız sayfasından detayları görüntüleyebilirsiniz.',
      [
        { 
          text: 'Tamam', 
          onPress: () => {
            // Randevularım sayfasına yönlendir
            navigation.replace('AppointmentList');
          } 
        }
      ]
    );
  };

  // Belirli bir adıma gitme
  const handleEditField = (field: 'service' | 'staff' | 'datetime' | 'location' | 'note') => {
    switch (field) {
      case 'service':
        setCurrentStep('service');
        break;
      case 'datetime':
        setCurrentStep('datetime');
        break;
      case 'staff':
        setCurrentStep('staff');
        break;
      case 'location':
        // Konum düzenleme için modal açabilir
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
        break;
      case 'note':
        // Not düzenleme için modal açabilir
        Alert.prompt(
          'Randevu Notu',
          'Servis sağlayıcıya iletmek istediğiniz notları yazabilirsiniz',
          [
            { 
              text: 'İptal', 
              style: 'cancel' 
            },
            {
              text: 'Kaydet',
              onPress: (text) => {
                if (text) setNote(text);
              }
            }
          ],
          'plain-text',
          note
        );
        break;
      default:
        break;
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
    switch (currentStep) {
      case 'service':
        return (
          <ServiceSelection
            onServiceSelect={(service: { id: string; name: string; price: number; duration: number }, 
                             business: { id: string; name: string }) => {
              setSelectedService(service);
              setSelectedBusiness(business);
              goToNextStep();
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
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );

      case 'datetime':
        if (!selectedService || !selectedBusiness || !selectedStaff) {
          setCurrentStep('staff');
          return null;
        }
        return (
          <DateTimeSelection
            serviceId={selectedService.id}
            businessId={selectedBusiness.id}
            staffId={selectedStaff.id}
            onSelect={(dateTime) => {
              setSelectedDateTime(dateTime);
              goToNextStep();
            }}
            onBack={goToPreviousStep}
          />
        );
        
      case 'summary':
        if (!selectedService || !selectedBusiness || !selectedDateTime || !selectedStaff) {
          setCurrentStep('staff');
          return null;
        }
        
        return (
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
              id: selectedStaff.id,
              name: selectedStaff.name
            }}
            date={selectedDateTime.date}
            time={selectedDateTime.time}
            locationTypeValue={locationType === 'home' ? 'address' : 'business'}
            address={locationType === 'home' ? address : undefined}
            notes={note}
            onConfirm={handleAppointmentCreated}
            onCancel={() => navigation.goBack()}
            onBack={goToPreviousStep}
            onEdit={() => Alert.alert('Düzenle', 'Bu özellik şu anda geliştirme aşamasındadır.')}
          />
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
});

export default AppointmentScreen; 