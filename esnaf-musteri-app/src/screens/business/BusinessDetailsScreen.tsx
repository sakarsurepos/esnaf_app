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
import { supabase } from '../../services/supabase';

type BusinessDetailsRouteProp = RouteProp<HomeStackParamList, 'BusinessDetails'>;
type BusinessDetailsNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface Business {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  address: string;
  phone: string;
  website?: string;
  workingHours: string;
  category_id: string;
  latitude?: number;
  longitude?: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  business_id: string;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  business_id: string;
}

const BusinessDetailsScreen = () => {
  const navigation = useNavigation<BusinessDetailsNavigationProp>();
  const route = useRoute<BusinessDetailsRouteProp>();
  const { businessId } = route.params;

  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Örnek veriler - gerçek uygulamada Supabase'den gelecek
  const sampleBusiness: Business = {
    id: businessId,
    name: 'Ahmet Berber Salonu',
    description: 'Şehrin merkezinde, her türlü saç kesimi ve sakal tıraşı hizmetleri sunan modern bir berber salonu. 15 yıllık tecrübe ile müşteri memnuniyetini ön planda tutuyoruz.',
    image: 'https://picsum.photos/800/400',
    rating: 4.7,
    address: 'Atatürk Cad. No:123, Merkez, İstanbul',
    phone: '+90 (212) 123 45 67',
    website: 'https://www.ahmetberber.com',
    workingHours: 'Pazartesi-Cumartesi: 09:00-19:00',
    category_id: '1',
    latitude: 41.0082,
    longitude: 28.9784,
  };

  const sampleServices: Service[] = [
    {
      id: '1',
      name: 'Saç Kesimi',
      description: 'Erkek saç kesimi, yıkama dahil',
      price: 80,
      duration: 30,
      business_id: businessId,
    },
    {
      id: '2',
      name: 'Sakal Tıraşı',
      description: 'Sakal şekillendirme ve tıraş',
      price: 50,
      duration: 20,
      business_id: businessId,
    },
    {
      id: '3',
      name: 'Saç Yıkama',
      description: 'Özel şampuan ile saç yıkama',
      price: 30,
      duration: 15,
      business_id: businessId,
    },
    {
      id: '4',
      name: 'Çocuk Saç Kesimi',
      description: '12 yaş altı çocuklar için',
      price: 60,
      duration: 25,
      business_id: businessId,
    },
  ];

  const sampleReviews: Review[] = [
    {
      id: '1',
      user_name: 'Mehmet Y.',
      rating: 5,
      comment: 'Harika bir hizmet, çok memnun kaldım. Özellikle saç kesimi konusunda ustalar.',
      created_at: '2023-03-15',
      business_id: businessId,
    },
    {
      id: '2',
      user_name: 'Ali K.',
      rating: 4,
      comment: 'İyi bir deneyimdi, fiyatlar biraz yüksek ama hizmet kaliteli.',
      created_at: '2023-02-28',
      business_id: businessId,
    },
    {
      id: '3',
      user_name: 'Hasan T.',
      rating: 5,
      comment: 'Çok temiz bir salon, personel çok ilgili. Kesinlikle tavsiye ederim.',
      created_at: '2023-01-20',
      business_id: businessId,
    },
  ];

  // Veri yükleme fonksiyonu
  const loadData = async () => {
    try {
      setLoading(true);

      // Gerçek uygulamada Supabase sorguları olacak
      // Örnek kod:
      // const { data, error } = await supabase
      //   .from('businesses')
      //   .select('*')
      //   .eq('id', businessId)
      //   .single();
      
      // if (error) throw error;
      // setBusiness(data);

      // Demo için örnek verileri yükle
      setBusiness(sampleBusiness);
      setServices(sampleServices);
      setReviews(sampleReviews);

      // Favori durumu kontrolü (gerçek uygulamada kullanıcı bazlı kontrol edilecek)
      setIsFavorite(false);

    } catch (error) {
      console.error('İşletme verileri yüklenirken hata:', error);
      Alert.alert('Hata', 'İşletme bilgileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
    if (business?.latitude && business?.longitude) {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${business.latitude},${business.longitude}`;
      const label = business.name;
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
    navigation.navigate('Appointment', { serviceId });
  };

  // Favori ekleme/çıkarma fonksiyonu
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Gerçek uygulamada Supabase'e kaydetme işlemi yapılacak
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>İşletme bilgileri bulunamadı.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* İşletme Görseli */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: business.image }} style={styles.image} />
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
          <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({reviews.length} değerlendirme)</Text>
        </View>

        <Text style={styles.businessDescription}>{business.description}</Text>

        {/* İletişim Bilgileri */}
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactItem} onPress={handleCallPhone}>
            <Ionicons name="call" size={24} color="#3498db" />
            <Text style={styles.contactText}>{business.phone}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleOpenMap}>
            <Ionicons name="location" size={24} color="#3498db" />
            <Text style={styles.contactText}>{business.address}</Text>
          </TouchableOpacity>
          
          <View style={styles.contactItem}>
            <Ionicons name="time" size={24} color="#3498db" />
            <Text style={styles.contactText}>{business.workingHours}</Text>
          </View>

          {business.website && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => Linking.openURL(business.website || '')}
            >
              <Ionicons name="globe" size={24} color="#3498db" />
              <Text style={styles.contactText}>{business.website}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Hizmetler Bölümü */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Hizmetler</Text>
        {services.map(service => (
          <View key={service.id} style={styles.serviceItem}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceDetails}>
                <Text style={styles.servicePrice}>{service.price} ₺</Text>
                <Text style={styles.serviceDuration}>{service.duration} dk</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => handleBookAppointment(service.id)}
            >
              <Text style={styles.bookButtonText}>Randevu Al</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Değerlendirmeler Bölümü */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Değerlendirmeler</Text>
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
            <Text style={styles.reviewDate}>{review.created_at}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  image: {
    width: windowWidth,
    height: 200,
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
  sectionContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
});

export default BusinessDetailsScreen; 