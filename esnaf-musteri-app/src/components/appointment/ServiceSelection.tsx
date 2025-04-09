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
  SafeAreaView,
} from 'react-native';
import { getAllServices, getAllServiceCategories } from '../../services/dataService';
import { COLORS, FONTS } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ServiceSelectionProps = {
  onServiceSelect: (
    service: { id: string; name: string; price: number; duration: number }, 
    business: { id: string; name: string }
  ) => void;
  onBack: () => void;
  initialServiceId?: string;
  initialBusinessId?: string;
};

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  onServiceSelect,
  onBack,
  initialServiceId,
  initialBusinessId
}) => {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Hizmet kategorilerini yükle
      const { data: categoriesData, error: categoriesError } = await getAllServiceCategories();
      
      if (categoriesError) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      
      setCategories(categoriesData || []);
      
      // Hizmetleri yükle
      const { data: servicesData, error: servicesError } = await getAllServices();
      
      if (servicesError) {
        throw new Error('Hizmetler yüklenirken bir hata oluştu');
      }
      
      // Hizmetlere işletme bilgisini ekle
      const enrichedServices = servicesData?.map(service => ({
        ...service,
        businessName: service.business_name || 'İşletme'  // Mock veri için
      })) || [];
      
      setServices(enrichedServices);
      
      // Eğer başlangıç servisi belirlendiyse, onu seç
      if (initialServiceId && initialBusinessId) {
        const initialService = enrichedServices.find(s => s.id === initialServiceId);
        
        if (initialService) {
          onServiceSelect(
            {
              id: initialService.id,
              name: initialService.title,
              price: initialService.price,
              duration: initialService.duration_minutes
            },
            {
              id: initialBusinessId,
              name: initialService.businessName
            }
          );
        }
      }
      
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      setError('Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: any) => {
    onServiceSelect(
      {
        id: service.id,
        name: service.title,
        price: service.price,
        duration: service.duration_minutes
      },
      {
        id: service.business_id,
        name: service.businessName
      }
    );
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? service.category_id === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const renderCategoryItem = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => setSelectedCategory(isSelected ? null : item.id)}
      >
        <Text 
          style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderServiceItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServiceSelect(item)}
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>{item.title}</Text>
          <Text style={styles.businessName}>{item.businessName}</Text>
          
          <View style={styles.serviceDetails}>
            {item.duration_minutes && (
              <View style={styles.detailItem}>
                <Icon name="access-time" size={14} color={COLORS.gray} />
                <Text style={styles.detailText}>{item.duration_minutes} dk</Text>
              </View>
            )}
            
            <View style={styles.detailItem}>
              <Icon name="attach-money" size={14} color={COLORS.gray} />
              <Text style={styles.detailText}>{item.price.toFixed(2)} ₺</Text>
            </View>
          </View>
        </View>
        
        <Icon name="chevron-right" size={24} color={COLORS.gray} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hizmet Seçimi</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Hizmetler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hizmet Seçimi</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Hizmet veya işletme ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.lightGray}
        />
      </View>
      
      {categories.length > 0 && (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
        />
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : filteredServices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="search-off" size={48} color={COLORS.gray} />
          <Text style={styles.emptyText}>Aramanızla eşleşen hizmet bulunamadı.</Text>
          <TouchableOpacity style={styles.clearButton} onPress={() => {
            setSearchQuery('');
            setSelectedCategory(null);
          }}>
            <Text style={styles.clearButtonText}>Filtreleri Temizle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.servicesList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.black,
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  categoriesList: {
    maxHeight: 50,
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  serviceItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default ServiceSelection; 