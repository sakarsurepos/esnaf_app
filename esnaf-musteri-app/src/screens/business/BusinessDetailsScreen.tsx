import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackParamList } from '../../navigation/types';
import { 
  getBusinessData, 
  getAllServices, 
  getUserFavorites, 
  getBusinessStaff,
  getStaffProfiles,
  getBusinessHours,
  getBusinessReviews,
  BusinessReview
} from '../../services/dataService';
import { Tables } from '../../types/supabase';
import { StaffProfileInfo } from '../../models/staff_members/sample';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import PaymentPolicyBadge from '../../components/PaymentPolicyBadge';
import PaymentPolicyModal from '../../components/PaymentPolicyModal';
import { sampleBusinessSettings } from '../../models';
import { getServicePaymentPolicy, Service } from '../../models/services/types';

// Genişletilmiş hizmet tipi
interface EnrichedService extends Service {
  paymentPolicy: 'free_booking' | 'deposit_required' | 'full_payment_required';
  depositRate: number;
  isCustomPolicy: boolean;
}

type BusinessDetailsRouteProp = RouteProp<HomeStackParamList, 'BusinessDetails'>;
type BusinessDetailsNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const BusinessDetailsScreen = () => {
  const navigation = useNavigation<BusinessDetailsNavigationProp>();
  const route = useRoute<BusinessDetailsRouteProp>();
  const { businessId } = route.params;

  const [business, setBusiness] = useState<Tables<'businesses'> | null>(null);
  const [services, setServices] = useState<EnrichedService[]>([]);
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [staff, setStaff] = useState<Tables<'staff_members'>[]>([]);
  const [staffProfiles, setStaffProfiles] = useState<StaffProfileInfo[]>([]);
  const [businessHours, setBusinessHours] = useState<Tables<'business_hours'>[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingHours, setLoadingHours] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'reviews' | 'info'>('services');
  const [businessLocation, setBusinessLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Veri yükleme fonksiyonu
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // İşletme bilgilerini getir
      const { data: businessData, error: businessError } = await getBusinessData(businessId);
      
      if (businessError) {
        throw new Error('İşletme bilgileri yüklenemedi');
      }
      
      if (businessData) {
        setBusiness(businessData);
        
        // İşletmeye ait hizmetleri getir
        const { data: allServices, error: servicesError } = await getAllServices();
        
        if (servicesError) {
          console.error('Hizmetler yüklenirken hata:', servicesError);
        } else {
          // İşletmeye ait hizmetleri filtrele
          if (allServices) {
            // İşletme ayarlarını bul
            const businessSettings = sampleBusinessSettings.find(
              bs => bs.business_id === businessId
            ) || sampleBusinessSettings[0]; // Varsayılan olarak ilk ayarı kullan
            
            // Hizmetlere ödeme politikası bilgisini ekle
            const enrichedServices = allServices
              .filter(service => service.business_id === businessId)
              .map(service => {
                // Ödeme politikası bilgisini getir
                const { paymentPolicy, depositRate, isCustomPolicy } = getServicePaymentPolicy(service, businessSettings);
                
                return {
                  ...service,
                  paymentPolicy,
                  depositRate,
                  isCustomPolicy
                };
              });
              
            setServices(enrichedServices);
          }
        }

        // Demo için konum bilgisi oluştur - Gerçek uygulamada veritabanındaki konum kullanılacak
        setBusinessLocation({
          latitude: 41.0082,
          longitude: 28.9784
        });
      }

    } catch (error) {
      console.error('İşletme verileri yüklenirken hata:', error);
      setError('İşletme bilgileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data, error } = await getBusinessReviews(businessId);
      
      if (error) {
        console.error('Değerlendirmeler yüklenirken hata:', error);
      } else if (data) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Değerlendirmeler yüklenirken hata:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadStaff = async () => {
    try {
      setLoadingStaff(true);
      
      // Personel bilgilerini getir
      const { data: staffData, error: staffError } = await getBusinessStaff(businessId);
      
      if (staffError) {
        console.error('Personel bilgileri yüklenirken hata:', staffError);
      } else if (staffData && staffData.length > 0) {
        setStaff(staffData);
        
        // Personel profil detaylarını getir
        const staffIds = staffData.map(member => member.id);
        const { data: profilesData, error: profilesError } = await getStaffProfiles(staffIds);
        
        if (profilesError) {
          console.error('Personel profilleri yüklenirken hata:', profilesError);
        } else if (profilesData) {
          setStaffProfiles(profilesData);
        }
      }
    } catch (error) {
      console.error('Personel bilgileri yüklenirken hata:', error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const loadBusinessHours = async () => {
    try {
      setLoadingHours(true);
      
      // Çalışma saatlerini getir
      const { data: hoursData, error: hoursError } = await getBusinessHours(businessId);
      
      if (hoursError) {
        console.error('Çalışma saatleri yüklenirken hata:', hoursError);
      } else if (hoursData) {
        setBusinessHours(hoursData);
      }
    } catch (error) {
      console.error('Çalışma saatleri yüklenirken hata:', error);
    } finally {
      setLoadingHours(false);
    }
  };

  useEffect(() => {
    loadData();
    loadReviews();
    loadStaff();
    loadBusinessHours();
  }, [businessId]);

  // Telefon arama fonksiyonu
  const handleCallPhone = () => {
    if (business?.phone) {
      const phoneUrl = `tel:${business.phone.replace(/\s+/g, '')}`;
      Linking.canOpenURL(phoneUrl)
        .then(supported => {
          if (supported) {
            return Linking.openURL(phoneUrl);
          }
          Alert.alert('Hata', 'Telefon araması yapılamıyor.');
        })
        .catch(error => console.error('Telefon arama hatası:', error));
    }
  };

  // Harita açma fonksiyonu
  const handleOpenMap = () => {
    if (businessLocation) {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${businessLocation.latitude},${businessLocation.longitude}`;
      const label = business?.name || 'İşletme Konumu';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });

      if (url) {
        Linking.openURL(url);
      }
    } else {
      Alert.alert('Bilgi', 'Bu işletme için konum bilgisi bulunmuyor.');
    }
  };

  // Randevu alma fonksiyonu
  const handleBookAppointment = (serviceId: string) => {
    navigation.navigate('Transactions', {
      screen: 'CreateAppointment',
      params: { serviceId }
    });
  };

  // Favori ekleme/çıkarma fonksiyonu
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Gerçek uygulamada Supabase'e kaydetme işlemi yapılacak
  };

  // Gün isimlerini türkçe olarak aldığımız helper fonksiyon
  const getDayName = (dayOfWeek: number): string => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[dayOfWeek];
  };

  // Ortalama değerlendirme puanını hesapla
  const getAverageRating = (): string => {
    if (reviews.length === 0) return '0.0';
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error || !business) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error || 'İşletme bilgileri bulunamadı.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* İşletme Görseli */}
      <View style={styles.imageContainer}>
        <View style={styles.imageBackground}>
          <Ionicons name="business-outline" size={60} color="#3498db" />
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'} 
            size={28} 
            color={isFavorite ? '#e74c3c' : '#fff'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.backButtonOverlay}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* İşletme Başlık ve Bilgileri */}
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{business.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.ratingText}>{getAverageRating()}</Text>
          <Text style={styles.reviewCount}>({reviews.length} değerlendirme)</Text>
        </View>

        <Text style={styles.businessDescription}>{business.description}</Text>

        {/* İletişim Bilgileri */}
        <View style={styles.contactContainer}>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleCallPhone}
          >
            <Ionicons name="call-outline" size={20} color="#3498db" />
            <Text style={styles.contactText}>{business.phone}</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={handleOpenMap}
          >
            <Ionicons name="location-outline" size={20} color="#3498db" />
            <Text style={styles.contactText}>Konum bilgisini görüntüle</Text>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
          
          {business.email && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL(`mailto:${business.email}`)}
            >
              <Ionicons name="mail-outline" size={20} color="#3498db" />
              <Text style={styles.contactText}>{business.email}</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tab Menü */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'services' && styles.activeTab]}
          onPress={() => setActiveTab('services')}
        >
          <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>Hizmetler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'staff' && styles.activeTab]}
          onPress={() => setActiveTab('staff')}
        >
          <Text style={[styles.tabText, activeTab === 'staff' && styles.activeTabText]}>Personel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Değerlendirmeler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Bilgiler</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Hizmetler Sekmesi */}
        {activeTab === 'services' && (
          <View style={styles.sectionContainer}>
            {services.length === 0 ? (
              <Text style={styles.emptyText}>Bu işletme için henüz hizmet bulunmuyor</Text>
            ) : (
              services.map(service => (
                <View key={service.id} style={styles.serviceItem}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                    
                    <View style={styles.serviceDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="cash-outline" size={16} color="#3498db" style={styles.detailIcon} />
                        <Text style={styles.servicePrice}>{service.price.toFixed(2)} ₺</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color="#3498db" style={styles.detailIcon} />
                        <Text style={styles.serviceDuration}>{service.duration_minutes || 30} dk</Text>
                      </View>
                    </View>
                    
                    {/* Ödeme Politikası Rozeti */}
                    {service.paymentPolicy && (
                      <View style={styles.policyContainer}>
                        <PaymentPolicyBadge
                          paymentPolicy={service.paymentPolicy}
                          depositRate={service.depositRate || 0}
                          showInfo={true}
                          onInfoPress={() => setShowPolicyModal(true)}
                          style={styles.policyBadge}
                        />
                      </View>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => handleBookAppointment(service.id)}
                  >
                    <Text style={styles.bookButtonText}>Randevu Al</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* Personel Sekmesi */}
        {activeTab === 'staff' && (
          <View style={styles.sectionContainer}>
            {loadingStaff ? (
              <ActivityIndicator size="small" color="#3498db" style={styles.loader} />
            ) : staff.length === 0 ? (
              <Text style={styles.emptyText}>Bu işletme için henüz personel bilgisi bulunmuyor</Text>
            ) : (
              staffProfiles.map(profile => {
                const staffMember = staff.find(s => s.id === profile.staff_id);
                return (
                  <View key={profile.staff_id} style={styles.staffItem}>
                    <View style={styles.staffHeader}>
                      <Image 
                        source={{ uri: profile.profile_image || 'https://via.placeholder.com/150' }} 
                        style={styles.staffImage} 
                      />
                      <View style={styles.staffTitleContainer}>
                        <Text style={styles.staffName}>{profile.full_name}</Text>
                        <Text style={styles.staffPosition}>{staffMember?.position}</Text>
                        
                        <View style={styles.staffRatingContainer}>
                          <Ionicons name="star" size={16} color="#FFD700" />
                          <Text style={styles.staffRating}>{profile.average_rating.toFixed(1)}</Text>
                          <Text style={styles.staffReviewCount}>({profile.total_reviews} değerlendirme)</Text>
                        </View>
                      </View>
                    </View>
                    
                    <Text style={styles.staffExpertise}>
                      <Text style={styles.boldText}>Uzmanlık: </Text>
                      {staffMember?.expertise}
                    </Text>
                    
                    <Text style={styles.staffAbout}>{profile.about}</Text>
                    
                    <View style={styles.staffStats}>
                      <View style={styles.staffStatItem}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={styles.staffStatText}>{profile.experience_years} yıl deneyim</Text>
                      </View>
                      
                      <View style={styles.staffStatItem}>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
                        <Text style={styles.staffStatText}>{profile.total_services}+ hizmet</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Değerlendirmeler Sekmesi */}
        {activeTab === 'reviews' && (
          <View style={styles.sectionContainer}>
            {loadingReviews ? (
              <ActivityIndicator size="small" color="#3498db" style={styles.loader} />
            ) : reviews.length === 0 ? (
              <Text style={styles.emptyText}>Henüz değerlendirme yapılmamış</Text>
            ) : (
              <>
                <View style={styles.reviewSummary}>
                  <View style={styles.reviewRatingLarge}>
                    <Text style={styles.reviewRatingNumber}>{getAverageRating()}</Text>
                    <Ionicons name="star" size={24} color="#FFD700" />
                  </View>
                  <Text style={styles.reviewRatingText}>Toplam {reviews.length} Değerlendirme</Text>
                </View>
                
                {reviews.map(review => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.user_name}</Text>
                      <View style={styles.reviewRatingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.reviewRating}>{review.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Bilgiler Sekmesi */}
        {activeTab === 'info' && (
          <View style={styles.sectionContainer}>
            {/* Konum */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Konum</Text>
              
              {businessLocation ? (
                <>
                  <View style={styles.mapContainer}>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: businessLocation.latitude,
                        longitude: businessLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: businessLocation.latitude,
                          longitude: businessLocation.longitude,
                        }}
                        title={business.name}
                      />
                    </MapView>
                  </View>
                  <TouchableOpacity 
                    style={styles.openMapButton}
                    onPress={handleOpenMap}
                  >
                    <Ionicons name="navigate-outline" size={20} color="#fff" />
                    <Text style={styles.openMapButtonText}>Yol Tarifi Al</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.emptyText}>Konum bilgisi bulunmuyor</Text>
              )}
            </View>
            
            {/* Çalışma Saatleri */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Çalışma Saatleri</Text>
              
              {loadingHours ? (
                <ActivityIndicator size="small" color="#3498db" style={styles.loader} />
              ) : businessHours.length === 0 ? (
                <Text style={styles.emptyText}>Çalışma saati bilgisi bulunmuyor</Text>
              ) : (
                businessHours.map(hour => (
                  <View key={hour.id} style={styles.hourItem}>
                    <Text style={styles.dayName}>{getDayName(hour.day_of_week || 0)}</Text>
                    {hour.is_closed ? (
                      <Text style={styles.closedText}>Kapalı</Text>
                    ) : (
                      <Text style={styles.hourText}>
                        {hour.open_time} - {hour.close_time}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Ödeme Politikası Modal */}
      <PaymentPolicyModal 
        visible={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
      />
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
  },
  imageBackground: {
    width: windowWidth,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  businessInfo: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  businessName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  businessDescription: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 15,
  },
  contactContainer: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  sectionContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 5,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3498db',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
  },
  bookButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: '600',
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewComment: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
  policyContainer: {
    marginTop: 5,
  },
  policyBadge: {
    padding: 5,
  },
  staffItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  staffImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  staffTitleContainer: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  staffPosition: {
    fontSize: 14,
    color: '#666',
  },
  staffRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  staffRating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  staffReviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  staffExpertise: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  staffAbout: {
    fontSize: 14,
    color: '#666',
  },
  staffStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  staffStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  staffStatText: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    marginBottom: 15,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mapContainer: {
    height: 200,
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  openMapButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  openMapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
  },
  hourText: {
    fontSize: 14,
    color: '#666',
  },
  closedText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  boldText: {
    fontWeight: 'bold',
  },
  reviewSummary: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reviewRatingLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewRatingNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  reviewRatingText: {
    fontSize: 14,
    color: '#666',
  },
});

export default BusinessDetailsScreen; 