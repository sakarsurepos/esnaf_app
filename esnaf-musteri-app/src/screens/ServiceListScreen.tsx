import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Tables } from '../types/supabase';
import { getAllServices } from '../services/dataService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RouteParams = {
  ServiceList: {
    categoryId: string;
    categoryName: string;
  };
};

type Props = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<RouteParams, 'ServiceList'>;
};

// UI için kullanılacak zenginleştirilmiş servis tipi
interface EnrichedService {
  id: string;
  title: string;
  businessName: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  rating: number;
}

const ServiceListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  const [services, setServices] = useState<EnrichedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, [categoryId]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAllServices();
      
      if (error) {
        setError('Hizmetler yüklenirken bir hata oluştu');
        console.error('Hizmet yükleme hatası:', error);
        return;
      }
      
      if (data) {
        // Kategori ID'sine göre filtrele
        const filteredServices = data.filter(service => 
          service.category_id === categoryId
        );
        
        // API'den gelen veriye ekstra bilgi ekleyerek zenginleştirilmiş servis listesi oluştur
        const enrichedServices: EnrichedService[] = filteredServices.map(service => ({
          id: service.id,
          title: service.title,
          businessName: `İşletme ID: ${service.business_id}`, // Gerçek projede işletme adı olacak
          description: service.description || 'Açıklama bulunmuyor',
          price: service.price,
          duration: service.duration_minutes,
          imageUrl: 'https://via.placeholder.com/150', // Örnek resim
          rating: 4.5 // Örnek değerlendirme
        }));
        
        setServices(enrichedServices);
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Hizmet yükleme exception:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleServicePress = (serviceId: string) => {
    navigation.navigate('ServiceDetail', { serviceId });
  };

  const renderServiceItem = ({ item }: { item: EnrichedService }) => (
    <TouchableOpacity 
      style={styles.serviceItem} 
      onPress={() => handleServicePress(item.id)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.serviceImage} 
        resizeMode="cover"
      />
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.businessName}>{item.businessName}</Text>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.serviceFooter}>
          <Text style={styles.servicePrice}>{item.price.toFixed(2)} ₺</Text>
          <Text style={styles.serviceDuration}>{item.duration} dk</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.ratingIcon}>★</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Hizmetler yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadServices}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{categoryName}</Text>
      
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Bu kategoride henüz hizmet bulunamadı.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceDetails: {
    padding: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f39c12',
    marginRight: 2,
  },
  ratingIcon: {
    fontSize: 14,
    color: '#f39c12',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ServiceListScreen; 