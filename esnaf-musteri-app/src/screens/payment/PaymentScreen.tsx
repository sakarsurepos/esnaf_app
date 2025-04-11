import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../constants';
import { samplePaymentMethods } from '../../models';
import { createAppointment } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';
import { getPaymentMethods, addPaymentMethod, processPayment } from '../../services/paymentService';
import { usePackageForAppointment } from '../../services/userPackageService';
import { format } from 'date-fns';

export type PaymentScreenProps = StackScreenProps<any, 'Payment'>;

interface PaymentMethod {
  id: string;
  card_type: string;
  last_digits: string;
  expires_at: string;
  name: string;
  is_default: boolean;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const {
    serviceName,
    serviceId,
    businessId,
    branchId,
    staffId,
    staffName,
    appointmentTime,
    locationType,
    address,
    customerNote,
    totalPrice,
    depositAmount,
    isFullPayment,
    businessName,
    isFreeBooking = false,
    hasApplicablePackages = false,
    applicablePackages = []
  } = route.params;

  // Adım state'leri
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [useInPersonPayment, setUseInPersonPayment] = useState(isFreeBooking);
  const { user } = useAuth();

  // YENİ: Paket kullanımı için state
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [usePackagePayment, setUsePackagePayment] = useState(false);

  useEffect(() => {
    // Ödeme yöntemlerini yükle
    const loadPaymentMethods = async () => {
      setLoading(true);
      
      try {
        if (!user) return;
        
        const methods = await getPaymentMethods(user.id);
        setPaymentMethods(methods);
        
        // Eğer kapıda ödeme seçilmediyse uygun ödeme yöntemini seç
        if (!useInPersonPayment) {
          // Varsa default metodu seç
          const defaultMethod = methods.find(method => method.is_default);
          if (defaultMethod) {
            setSelectedPaymentMethod(defaultMethod.id);
          } else if (methods.length > 0) {
            setSelectedPaymentMethod(methods[0].id);
          }
        } else {
          // Kapıda ödeme için ödeme yöntemi seçimini temizle
          setSelectedPaymentMethod(null);
        }
      } catch (error) {
        console.error('Ödeme yöntemleri yüklenirken hata:', error);
        Alert.alert('Hata', 'Ödeme yöntemleri yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPaymentMethods();
  }, [user?.id, useInPersonPayment]);

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    // Free booking hizmetlerde bile kart seçiminde kapıda ödeme seçeneğini kapat
    setUseInPersonPayment(false);
    setSelectedPaymentMethod(paymentMethodId);
    // Eğer bir ödeme yöntemi seçilirse, paket kullanımını devre dışı bırak
    setUsePackagePayment(false);
    setSelectedPackage(null);
  };

  const handleToggleInPersonPayment = () => {
    // Sadece isFreeBooking true ise kapıda ödeme seçeneği kullanılabilir
    if (isFreeBooking) {
      setUseInPersonPayment(!useInPersonPayment);
      if (!useInPersonPayment) {
        setSelectedPaymentMethod(null);
        setUsePackagePayment(false);
        setSelectedPackage(null);
      }
    }
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setUsePackagePayment(true);
    // Diğer ödeme yöntemlerini devre dışı bırak
    setSelectedPaymentMethod('');
    setUseInPersonPayment(false);
  };

  const handleAddPaymentMethod = () => {
    Alert.alert('Yeni Kart Ekle', 'Bu özellik şu anda geliştirme aşamasındadır.');
  };

  const handleCompletePayment = async () => {
    if (!user) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı.');
      return;
    }
    
    // Ödeme yöntemi kontrolü
    if (!useInPersonPayment && !selectedPaymentMethod && !usePackagePayment) {
      Alert.alert('Ödeme Yöntemi Seçin', 'Lütfen bir ödeme yöntemi seçin.');
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      let paymentResult = false;
      let paymentType = 'none';
      
      // Ödeme tipine göre işlem yap
      if (usePackagePayment && selectedPackage) {
        // Paket kullanımı
        paymentResult = await usePackageForAppointment(selectedPackage, serviceId);
        paymentType = 'package';
      } else if (useInPersonPayment) {
        // Kapıda ödeme, doğrudan başarılı kabul et
        paymentResult = true;
        paymentType = 'in_person';
      } else if (selectedPaymentMethod) {
        // Kart ile ödeme
        const amount = isFullPayment ? totalPrice : depositAmount;
        paymentResult = await processPayment(selectedPaymentMethod, amount);
        paymentType = 'card';
      }
      
      if (paymentResult) {
        // Ödeme başarılı, randevu oluştur
        const result = await createAppointment({
          service_id: serviceId,
          customer_id: user.id,
          business_id: businessId,
          branch_id: branchId || '',
          staff_id: staffId,
          appointment_time: appointmentTime,
          location_type: locationType,
          address: locationType === 'address' ? address : undefined,
          customer_note: customerNote,
          total_price: totalPrice,
          payment_status: useInPersonPayment ? 'pending' : 'paid',
          payment_type: paymentType,
          payment_method_id: selectedPaymentMethod || null,
          used_package_id: selectedPackage || null,
          status: 'pending',
        });
        
        // Başarı mesajı göster
        Alert.alert(
          'Randevu Oluşturuldu',
          'Randevunuz başarıyla oluşturuldu. Randevularınız sayfasından detayları görüntüleyebilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => {
                // Ana sayfaya yönlendir
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'AppointmentList' }],
                });
              }
            }
          ]
        );
      } else {
        // Ödeme başarısız
        Alert.alert('Ödeme Hatası', 'Ödeme işlemi sırasında bir sorun oluştu. Lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Ödeme işlemi sırasında hata:', error);
      Alert.alert('Hata', 'İşlem sırasında beklenmeyen bir hata oluştu.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Tarih formatı yardımcı fonksiyonu
  const formatDate = (date: Date) => {
    return format(date, 'dd.MM.yyyy');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ödeme</Text>
          <View style={styles.placeholderIcon} />
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Ödeme bilgileri yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödeme</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hizmet Bilgileri */}
        <View style={styles.serviceInfoCard}>
          <Text style={styles.cardTitle}>Hizmet Bilgileri</Text>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>Hizmet:</Text>
            <Text style={styles.serviceValue}>{serviceName}</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>İşletme:</Text>
            <Text style={styles.serviceValue}>{businessName}</Text>
          </View>
          <View style={styles.serviceRow}>
            <Text style={styles.serviceLabel}>Personel:</Text>
            <Text style={styles.serviceValue}>{staffName}</Text>
          </View>
        </View>

        {/* Ödeme Özeti */}
        <View style={styles.paymentSummaryCard}>
          <Text style={styles.cardTitle}>Ödeme Özeti</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Hizmet Tutarı:</Text>
            <Text style={styles.amountValue}>{totalPrice.toFixed(2)} ₺</Text>
          </View>
          
          {useInPersonPayment ? (
            <>
              <View style={styles.divider} />
              <View style={styles.amountRow}>
                <Text style={[styles.amountLabel, {color: COLORS.success}]}>Kapıda Ödenecek:</Text>
                <Text style={[styles.amountValue, {color: COLORS.success}]}>{totalPrice.toFixed(2)} ₺</Text>
              </View>
              <Text style={styles.paymentNote}>Ödemeyi hizmet sırasında nakit veya kart ile yapabilirsiniz.</Text>
            </>
          ) : usePackagePayment && selectedPackage ? (
            <>
              <View style={styles.divider} />
              <View style={styles.amountRow}>
                <Text style={[styles.amountLabel, {color: COLORS.success}]}>Paket ile Ödenecek:</Text>
                <Text style={[styles.amountValue, {color: COLORS.success}]}>{totalPrice.toFixed(2)} ₺</Text>
              </View>
              <Text style={styles.paymentNote}>
                Randevu ücreti seçtiğiniz paketten düşülecektir.
              </Text>
            </>
          ) : !isFullPayment && (
            <>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Depozito Oranı:</Text>
                <Text style={styles.amountValue}>%{((depositAmount / totalPrice) * 100).toFixed(0)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Ödenecek Depozito:</Text>
                <Text style={styles.amountValue}>{depositAmount.toFixed(2)} ₺</Text>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Hizmet Sırasında Ödenecek:</Text>
                <Text style={styles.amountValue}>{(totalPrice - depositAmount).toFixed(2)} ₺</Text>
              </View>
            </>
          )}
          
          <View style={styles.divider} />
          <View style={[styles.amountRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Şimdi Ödenecek:</Text>
            <Text style={styles.totalValue}>
              {useInPersonPayment || usePackagePayment ? "0.00" : (isFullPayment ? totalPrice.toFixed(2) : depositAmount.toFixed(2))} ₺
            </Text>
          </View>
        </View>

        {/* YENİ: Kullanıcının Paketleri */}
        {hasApplicablePackages && applicablePackages.length > 0 && (
          <View style={styles.userPackagesCard}>
            <Text style={styles.cardTitle}>Paketlerim</Text>
            {applicablePackages.map((packageItem) => (
              <TouchableOpacity
                key={packageItem.id}
                style={[
                  styles.packageItem,
                  selectedPackage === packageItem.id && styles.selectedPackageItem
                ]}
                onPress={() => handlePackageSelect(packageItem.id)}
              >
                <View style={styles.cardIconContainer}>
                  <Icon name="card-membership" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardName}>{packageItem.package_name}</Text>
                  <Text style={styles.cardNumber}>
                    {packageItem.business_name} - {packageItem.remaining_services} kullanım hakkı
                  </Text>
                  <Text style={styles.cardExpiry}>
                    Son Kullanma: {formatDate(packageItem.expiry_date)}
                  </Text>
                </View>
                <View style={styles.checkboxContainer}>
                  {selectedPackage === packageItem.id && (
                    <Icon name="check-circle" size={24} color={COLORS.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ödeme Yöntemleri */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.cardTitle}>Ödeme Yöntemi</Text>
          
          {/* Kapıda Ödeme Seçeneği - Sadece free_booking hizmetler için göster */}
          {isFreeBooking && (
            <TouchableOpacity
              style={[
                styles.paymentMethodItem,
                useInPersonPayment && styles.selectedPaymentMethod,
              ]}
              onPress={handleToggleInPersonPayment}
            >
              <View style={styles.cardIconContainer}>
                <Icon name="payments" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardName}>Kapıda Ödeme</Text>
                <Text style={styles.cardNumber}>Hizmet sırasında nakit veya kart ile ödeme</Text>
              </View>
              <View style={styles.checkboxContainer}>
                {useInPersonPayment && (
                  <Icon name="check-circle" size={24} color={COLORS.primary} />
                )}
              </View>
            </TouchableOpacity>
          )}
          
          {paymentMethods.length === 0 ? (
            <View style={styles.noPaymentMethod}>
              <Icon name="credit-card-off" size={48} color={COLORS.gray} />
              <Text style={styles.noPaymentMethodText}>Kayıtlı ödeme yönteminiz bulunmuyor.</Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
                ]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                <View style={styles.cardIconContainer}>
                  <Icon
                    name={method.card_type.toLowerCase().includes('visa') ? 'credit-card' : 'credit-card'}
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardName}>{method.name}</Text>
                  <Text style={styles.cardNumber}>**** **** **** {method.last_digits}</Text>
                  <Text style={styles.cardExpiry}>Son Kullanma: {method.expires_at}</Text>
                </View>
                <View style={styles.checkboxContainer}>
                  {selectedPaymentMethod === method.id && (
                    <Icon name="check-circle" size={24} color={COLORS.primary} />
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
          
          <TouchableOpacity style={styles.addPaymentMethodButton} onPress={handleAddPaymentMethod}>
            <Icon name="add-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.addPaymentMethodText}>Yeni Ödeme Yöntemi Ekle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, (!selectedPaymentMethod && !useInPersonPayment && !usePackagePayment || processingPayment) && styles.disabledButton]}
          onPress={handleCompletePayment}
          disabled={!selectedPaymentMethod && !useInPersonPayment && !usePackagePayment || processingPayment}
        >
          {processingPayment ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Icon 
                name={useInPersonPayment 
                  ? "event-available" 
                  : usePackagePayment 
                  ? "card-membership" 
                  : "payment"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.payButtonText}>
                {useInPersonPayment 
                  ? 'Randevu Oluştur' 
                  : usePackagePayment 
                  ? 'Paket ile Öde' 
                  : isFullPayment 
                  ? 'Ödeme Yap' 
                  : 'Depozito Ödemesi Yap'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    padding: 16,
  },
  serviceInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  serviceValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    flex: 1,
    textAlign: 'right',
  },
  paymentSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  amountValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 8,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  paymentMethodsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F7FF',
  },
  cardIconContainer: {
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  cardExpiry: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 2,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPaymentMethod: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noPaymentMethodText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  addPaymentMethodText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  payButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
    marginLeft: 8,
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
  paymentNote: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 4,
  },
  userPackagesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPackageItem: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F7FF',
  },
});

export default PaymentScreen; 