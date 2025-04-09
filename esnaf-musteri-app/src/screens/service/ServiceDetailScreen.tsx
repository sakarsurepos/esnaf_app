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
  FlatList,
  Modal
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceDiscoveryStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { getServiceData, getBusinessData } from '../../services/dataService';
import { Tables } from '../../types/supabase';

type NavigationProp = NativeStackNavigationProp<ServiceDiscoveryStackParamList, 'ServiceDetail'>;
type RouteProps = RouteProp<ServiceDiscoveryStackParamList, 'ServiceDetail'>;

// Örnek yorumlar - bunlar için veritabanında henüz tablo olmadığından mock veri olarak kalabilir
const SAMPLE_REVIEWS = [
  {
    id: 'r1',
    userName: 'Ahmet Y.',
    avatar: 'https://via.placeholder.com/50',
    rating: 5,
    comment: 'Harika hizmet, çok memnun kaldım. Hızlı ve profesyonel.',
    date: '15.09.2023'
  },
  {
    id: 'r2',
    userName: 'Mehmet K.',
    avatar: 'https://via.placeholder.com/50',
    rating: 4,
    comment: 'Güzel bir deneyimdi, tavsiye ederim.',
    date: '10.09.2023'
  },
  {
    id: 'r3',
    userName: 'Ayşe T.',
    avatar: 'https://via.placeholder.com/50',
    rating: 5,
    comment: 'Temiz, hijyenik ve çok güler yüzlü bir hizmet. Kesinlikle tekrar geleceğim.',
    date: '05.09.2023'
  }
];

interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessId: string;
  businessLogo: string;
  businessAddress: string;
  businessPhone: string;
  images: string[];
  rating: number;
  reviewCount: number;
  price: number;
  discount: number;
  duration: number;
  categoryId: string;
  categoryName: string;
}

const ServiceDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { serviceId } = route.params;

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Models'ten hizmet detayını yükleyecek fonksiyon
  const loadServiceDetail = async () => {
    setLoading(true);
    try {
      const { data: serviceData, error: serviceError } = await getServiceData(serviceId);
      
      if (serviceError || !serviceData) {
        throw new Error('Hizmet detayı yüklenirken bir hata oluştu');
      }
      
      // İşletme bilgilerini de alalım
      const { data: businessData, error: businessError } = await getBusinessData(serviceData.business_id);
      
      if (businessError || !businessData) {
        throw new Error('İşletme bilgileri yüklenirken bir hata oluştu');
      }
      
      // Hizmet detayı nesnesini oluşturalım
      const serviceDetail: ServiceDetail = {
        id: serviceData.id,
        title: serviceData.title,
        description: serviceData.description || 'Hizmet açıklaması bulunmamaktadır.',
        businessName: businessData.name,
        businessId: businessData.id,
        businessLogo: 'https://via.placeholder.com/100', // Örnek logo
        businessAddress: businessData.address || 'İşletme adresi bulunmamaktadır.',
        businessPhone: businessData.phone || '+90 555 123 45 67',
        images: [
          'https://via.placeholder.com/800x500',
          'https://via.placeholder.com/800x500',
          'https://via.placeholder.com/800x500'
        ], // Örnek görseller
        rating: 4.8, // Örnek değer
        reviewCount: 124, // Örnek değer
        price: serviceData.price,
        discount: 0, // Örnek değer
        duration: serviceData.duration_minutes,
        categoryId: serviceData.category_id,
        categoryName: 'Hizmet Kategorisi' // Kategori adı için ekstra sorgu gerekebilir
      };
      
      setService(serviceDetail);
    } catch (error) {
      console.error('Hizmet detayı yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Hizmet detayları yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Favorilere ekle/çıkar
  const toggleFavorite = async () => {
    setIsFavorite(prev => !prev);
    // Gerçek uygulamada Supabase'e favorileri kaydedin
    // Şimdilik favori durumunu sadece yerel state'te tutuyoruz
  };

  // Randevu almaya geç
  const handleBooking = () => {
    if (service) {
      navigation.navigate('BookingStack', {
        screen: 'BookingCalendar',
        params: { 
          serviceId: service.id, 
          businessId: service.businessId,
          serviceName: service.title,
          businessName: service.businessName,
          serviceDuration: service.duration,
          servicePrice: service.price
        }
      });
    }
  };

  // İşletme profiline git
  const goToBusiness = () => {
    if (service) {
      navigation.navigate('BusinessStack', {
        screen: 'BusinessDetail',
        params: { businessId: service.businessId }
      });
    }
  };

  useEffect(() => {
    loadServiceDetail();
    // Favorileri kontrol et
    // Gerçek uygulamada:
    // const checkFavorite = async () => {
    //   const { data, error } = await supabase
    //     .from('favorites')
    //     .select()
    //     .eq('user_id', currentUser.id)
    //     .eq('service_id', serviceId);
    //   
    //   if (data && data.length > 0) {
    //     setIsFavorite(true);
    //   }
    // };
    // checkFavorite();
  }, [serviceId]);

  const renderImageCarousel = () => {
    if (!service) return null;
    
    return (
      <View style={styles.carouselContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setShowImageModal(true)}
        >
          <Image 
            source={{ uri: service.images[activeImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        
        <FlatList
          data={service.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setActiveImageIndex(index)}
              style={[
                styles.thumbnailContainer,
                activeImageIndex === index && styles.activeThumbnail
              ]}
            >
              <Image 
                source={{ uri: item }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    );
  };
  
  const renderReviews = () => {
    return (
      <View style={styles.reviewsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Değerlendirmeler</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        {SAMPLE_REVIEWS.map(review => (
          <View key={review.id} style={styles.reviewItem}>
            <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
            <View style={styles.reviewContent}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUserName}>{review.userName}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <View style={styles.ratingStars}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons 
                    key={i}
                    name="star" 
                    size={16} 
                    color={i < review.rating ? "#FFD700" : "#e0e0e0"} 
                  />
                ))}
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  const renderImageModal = () => {
    if (!service) return null;
    
    return (
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: service.images[activeImageIndex] }}
            style={styles.modalImage}
            resizeMode="contain"
          />
          
          <View style={styles.modalControls}>
            {activeImageIndex > 0 && (
              <TouchableOpacity 
                style={styles.arrowButton}
                onPress={() => setActiveImageIndex(prev => prev - 1)}
              >
                <Ionicons name="chevron-back" size={32} color="#fff" />
              </TouchableOpacity>
            )}
            
            {activeImageIndex < service.images.length - 1 && (
              <TouchableOpacity 
                style={[styles.arrowButton, styles.rightArrow]}
                onPress={() => setActiveImageIndex(prev => prev + 1)}
              >
                <Ionicons name="chevron-forward" size={32} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.paginationDots}>
            {service.images.map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.paginationDot,
                  activeImageIndex === index && styles.activeDot
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  if (loading || !service) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const discountedPrice = service.discount ? 
    service.price * (1 - service.discount / 100) : service.price;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageCarousel()}
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={26} 
                color={isFavorite ? '#e74c3c' : '#777'} 
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.businessRow}
            onPress={goToBusiness}
          >
            <Image source={{ uri: service.businessLogo }} style={styles.businessLogo} />
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{service.businessName}</Text>
              <Text style={styles.businessAddress}>{service.businessAddress}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777" />
          </TouchableOpacity>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.detailValue}>{service.rating.toFixed(1)}</Text>
                <Text style={styles.detailLabel}>({service.reviewCount} Değerlendirme)</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color="#777" />
                <Text style={styles.detailValue}>{service.duration}</Text>
                <Text style={styles.detailLabel}>Dakika</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Ionicons name="pricetag-outline" size={20} color="#777" />
                <Text style={styles.detailValue}>
                  {service.discount > 0 ? (
                    <Text style={styles.discountedPrice}>{discountedPrice.toFixed(0)} ₺</Text>
                  ) : (
                    `${service.price} ₺`
                  )}
                </Text>
                {service.discount > 0 && (
                  <Text style={styles.originalPrice}>{service.price} ₺</Text>
                )}
              </View>
            </View>
          </View>
          
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Hizmet Açıklaması</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>
          
          {renderReviews()}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Fiyat</Text>
          {service.discount > 0 ? (
            <View>
              <Text style={styles.discountPrice}>{discountedPrice.toFixed(0)} ₺</Text>
              <Text style={styles.priceWithStrike}>{service.price} ₺</Text>
            </View>
          ) : (
            <Text style={styles.priceText}>{service.price} ₺</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>Randevu Al</Text>
        </TouchableOpacity>
      </View>
      
      {renderImageModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    backgroundColor: '#fff',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  thumbnailList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#3498db',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  businessLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  businessInfo: {
    flex: 1,
    marginLeft: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  businessAddress: {
    fontSize: 14,
    color: '#777',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  discountedPrice: {
    color: '#e74c3c',
  },
  originalPrice: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  reviewsSection: {
    marginBottom: 100, // Footer için yer bırakıyoruz
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewContent: {
    flex: 1,
    marginLeft: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 13,
    color: '#777',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#777',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  discountPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  priceWithStrike: {
    fontSize: 16,
    color: '#777',
    textDecorationLine: 'line-through',
  },
  bookButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  modalControls: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  arrowButton: {
    position: 'absolute',
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    left: undefined,
    right: 10,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default ServiceDetailScreen; 