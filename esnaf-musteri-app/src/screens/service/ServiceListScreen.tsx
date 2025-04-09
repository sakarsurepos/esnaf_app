import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Modal,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceDiscoveryStackParamList } from '../../navigation/types';
import { getAllServices } from '../../services/dataService';
import { Tables } from '../../types/supabase';

type ServiceListRouteProp = RouteProp<ServiceDiscoveryStackParamList, 'ServiceList'>;
type NavigationProp = NativeStackNavigationProp<ServiceDiscoveryStackParamList, 'ServiceList'>;

interface ServiceWithDetails {
  id: string;
  name: string;
  business_name: string;
  address: string;
  rating: number;
  review_count: number;
  image_url: string;
  price_level: number; // 1-4 arası fiyat seviyesi
  distance: number; // metre cinsinden
  is_favorite: boolean;
  tags: string[];
}

// Fiyat seviyesi gösterimi için yardımcı fonksiyon
const renderPriceLevel = (level: number) => {
  const symbols = [];
  for (let i = 0; i < 4; i++) {
    symbols.push(
      <Text key={i} style={{ color: i < level ? '#2ecc71' : '#ddd' }}>₺</Text>
    );
  }
  return <View style={styles.priceContainer}>{symbols}</View>;
};

// Mesafe gösterimi için yardımcı fonksiyon
const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${meters} m`;
  } else {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }
};

const ServiceListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ServiceListRouteProp>();
  const { categoryId, categoryName } = route.params;

  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  const [priceFilter, setPriceFilter] = useState<number[]>([]);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);

  // Hizmetleri yükleyen fonksiyon
  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllServices();
      
      if (error) {
        throw new Error('Hizmetler yüklenirken bir hata oluştu');
      }
      
      if (data) {
        // Backend yapısına göre tüm hizmetleri kategori ID'sine göre filtrele
        const categoryServices = data.filter(service => service.category_id === categoryId);
        
        // Eksik bilgileri iş mantığı ile ekleyelim
        const servicesWithDetails: ServiceWithDetails[] = categoryServices.map(service => ({
          id: service.id,
          name: service.title,
          business_name: `İşletme ${service.business_id}`, // Gerçek projede join ile gelecek
          address: "İstanbul", // Örnek amaçlı
          rating: 4.5, // Örnek
          review_count: Math.floor(Math.random() * 100), // Örnek
          image_url: "https://via.placeholder.com/300",
          price_level: Math.ceil(service.price / 100), // Fiyata göre seviye (örnek)
          distance: Math.floor(Math.random() * 5000), // Örnek mesafe
          is_favorite: false, // Varsayılan olarak favori değil
          tags: [service.title.split(' ')[0], "Hizmet", categoryName] // Örnek etiketler
        }));
        
        setServices(servicesWithDetails);
        setFilteredServices(servicesWithDetails);
      }
    } catch (error) {
      console.error('Hizmetler yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Hizmetler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Favorilere ekleme/çıkarma fonksiyonu
  const toggleFavorite = (serviceId: string) => {
    const updatedServices = services.map(service => 
      service.id === serviceId 
        ? { ...service, is_favorite: !service.is_favorite } 
        : service
    );
    setServices(updatedServices);
    setFilteredServices(
      applyFiltersAndSort(updatedServices, searchQuery, sortOption, priceFilter, distanceFilter)
    );

    // Gerçek uygulamada Supabase'e favorileri kaydedeceğiz
    // if (isFavorite) {
    //   supabase.from('favorites').delete().eq('service_id', serviceId).eq('user_id', userId);
    // } else {
    //   supabase.from('favorites').insert({ service_id: serviceId, user_id: userId });
    // }
  };

  // Hizmet detayı sayfasına yönlendirme
  const navigateToServiceDetail = (serviceId: string) => {
    navigation.navigate('ServiceDetail', { serviceId });
  };

  // Filtreleme ve sıralama uygulanması
  const applyFiltersAndSort = (
    serviceList: ServiceWithDetails[],
    query: string, 
    sort: string, 
    priceFilters: number[],
    distanceFilter: number | null
  ) => {
    // İlk olarak arama sorgusu filtrelemesi
    let result = serviceList.filter(service => 
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.business_name.toLowerCase().includes(query.toLowerCase()) ||
      service.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    // Fiyat filtrelemesi
    if (priceFilters.length > 0) {
      result = result.filter(service => priceFilters.includes(service.price_level));
    }
    
    // Mesafe filtrelemesi
    if (distanceFilter) {
      result = result.filter(service => service.distance <= distanceFilter);
    }
    
    // Sıralama
    switch (sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        result.sort((a, b) => a.price_level - b.price_level);
        break;
      case 'price_high':
        result.sort((a, b) => b.price_level - a.price_level);
        break;
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      // 'recommended' varsayılan olarak kalıyor
      default:
        // Önerilen için kompleks bir sıralama algoritması kullanabiliriz
        // Örneğin: rating * (1 - distance/10000)
        result.sort((a, b) => {
          const scoreA = a.rating * (1 - a.distance/10000);
          const scoreB = b.rating * (1 - b.distance/10000);
          return scoreB - scoreA;
        });
    }
    
    return result;
  };

  // Arama, filtreleme ve sıralama değişiklikleri
  useEffect(() => {
    setFilteredServices(
      applyFiltersAndSort(services, searchQuery, sortOption, priceFilter, distanceFilter)
    );
  }, [searchQuery, sortOption, priceFilter, distanceFilter]);

  // Sayfa ilk yüklendiğinde hizmetleri getir
  useEffect(() => {
    loadServices();
    
    // Başlık ayarı
    navigation.setOptions({
      title: categoryName || 'Hizmetler',
    });
  }, [categoryId]);

  // Filtre ve sıralama seçenekleri resetleme
  const resetFilters = () => {
    setPriceFilter([]);
    setDistanceFilter(null);
    setSortOption('recommended');
    setFilterModalVisible(false);
  };

  // Filtre ve sıralama seçenekleri uygulama
  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  // Fiyat filtresini değiştirme
  const togglePriceFilter = (level: number) => {
    if (priceFilter.includes(level)) {
      setPriceFilter(priceFilter.filter(p => p !== level));
    } else {
      setPriceFilter([...priceFilter, level]);
    }
  };

  // Filtre ve sıralama modalı
  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtreler ve Sıralama</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {/* Sıralama Seçenekleri */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sırala</Text>
              <View style={styles.sortOptions}>
                {[
                  { id: 'recommended', label: 'Önerilen' },
                  { id: 'rating', label: 'En Yüksek Puan' },
                  { id: 'distance', label: 'En Yakın' },
                  { id: 'price_low', label: 'Fiyat (Düşük-Yüksek)' },
                  { id: 'price_high', label: 'Fiyat (Yüksek-Düşük)' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      sortOption === option.id && styles.activeSortOption
                    ]}
                    onPress={() => setSortOption(option.id)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortOption === option.id && styles.activeSortOptionText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Fiyat Filtreleri */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Fiyat</Text>
              <View style={styles.priceFilterOptions}>
                {[1, 2, 3, 4].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.priceFilterOption,
                      priceFilter.includes(level) && styles.activePriceFilterOption
                    ]}
                    onPress={() => togglePriceFilter(level)}
                  >
                    <Text style={styles.priceFilterText}>
                      {'₺'.repeat(level)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Mesafe Filtreleri */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Mesafe</Text>
              <View style={styles.distanceFilterOptions}>
                {[
                  { value: 1000, label: '1 km' },
                  { value: 3000, label: '3 km' },
                  { value: 5000, label: '5 km' },
                  { value: 10000, label: '10 km' },
                  { value: null, label: 'Tümü' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.label}
                    style={[
                      styles.distanceFilterOption,
                      distanceFilter === option.value && styles.activeDistanceFilterOption
                    ]}
                    onPress={() => setDistanceFilter(option.value)}
                  >
                    <Text
                      style={[
                        styles.distanceFilterText,
                        distanceFilter === option.value && styles.activeDistanceFilterText
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Sıfırla</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderServiceItem = ({ item }: { item: ServiceWithDetails }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigateToServiceDetail(item.id)}
    >
      <Image source={{ uri: item.image_url }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name={item.is_favorite ? 'heart' : 'heart-outline'}
              size={22}
              color={item.is_favorite ? '#e74c3c' : '#666'}
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.businessName}>{item.business_name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        
        <View style={styles.serviceFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#f39c12" />
            <Text style={styles.rating}>
              {item.rating.toFixed(1)} ({item.review_count})
            </Text>
          </View>
          
          {renderPriceLevel(item.price_level)}
          
          <Text style={styles.distance}>{formatDistance(item.distance)}</Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Hizmet veya işletme ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery || priceFilter.length > 0 || distanceFilter
                ? 'Filtrelere uygun sonuç bulunamadı'
                : 'Bu kategoride henüz hizmet bulunmuyor'}
            </Text>
          </View>
        }
      />
      
      {renderFilterModal()}
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
  searchFilterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  filterButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesList: {
    padding: 12,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 160,
  },
  serviceContent: {
    padding: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  distance: {
    fontSize: 14,
    color: '#777',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    marginBottom: 8,
  },
  sortOptionText: {
    fontSize: 14,
    color: '#555',
  },
  activeSortOption: {
    backgroundColor: '#3498db',
  },
  activeSortOptionText: {
    color: '#fff',
  },
  priceFilterOptions: {
    flexDirection: 'row',
  },
  priceFilterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  priceFilterText: {
    fontSize: 14,
    color: '#555',
  },
  activePriceFilterOption: {
    backgroundColor: '#3498db',
  },
  distanceFilterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  distanceFilterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    marginBottom: 8,
  },
  distanceFilterText: {
    fontSize: 14,
    color: '#555',
  },
  activeDistanceFilterOption: {
    backgroundColor: '#3498db',
  },
  activeDistanceFilterText: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#3498db',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default ServiceListScreen; 