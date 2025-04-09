import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { Tables } from '../../types/supabase';
import { getAllServiceCategories, getAllBusinesses } from '../../services/dataService';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<Tables<'service_categories'>[]>([]);
  const [popularBusinesses, setPopularBusinesses] = useState<Tables<'businesses'>[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Tables<'businesses'>[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Verileri yükleme fonksiyonu
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

      // İşletmeleri yükle
      const { data: businessesData, error: businessesError } = await getAllBusinesses();
      
      if (businessesError) {
        throw new Error('İşletmeler yüklenirken bir hata oluştu');
      }
      
      if (businessesData) {
        // Popüler işletmeler (onaylı olan işletmeleri göster)
        const approved = businessesData.filter(business => business.approval_status === 'approved');
        setPopularBusinesses(approved);
        
        // Yakındaki işletmeler için farklı bir sıralama/filtreleme uygulayabilirsiniz.
        // Örneğin gerçek uygulamada konum verilerine göre sıralama yapılabilir
        setNearbyBusinesses([...approved].reverse());
      }

    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      setError('Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    loadData();
  }, []);

  // Yenileme işlemi
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Kategori seçme işlevi
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    navigation.navigate('ServiceList' as any, { 
      categoryId, 
      categoryName 
    });
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Arama Çubuğu */}
      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search' as any)}
      >
        <Ionicons name="search" size={20} color="#666" />
        <Text style={styles.searchText}>Esnaf veya hizmet ara...</Text>
      </TouchableOpacity>

      {/* Kategoriler */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Kategoriler</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategorySelect(item.id, item.name)}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={item.icon_url as any} size={24} color="#3498db" />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Popüler İşletmeler */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popüler İşletmeler</Text>
        {popularBusinesses.length === 0 ? (
          <Text style={styles.emptyText}>Henüz işletme bulunmuyor</Text>
        ) : (
          <FlatList
            data={popularBusinesses}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.businessCard}
                onPress={() => navigation.navigate('BusinessDetails' as any, { businessId: item.id })}
              >
                <View style={styles.businessImageContainer}>
                  <Ionicons name="business-outline" size={32} color="#3498db" />
                </View>
                <View style={styles.businessInfo}>
                  <Text style={styles.businessName}>{item.name}</Text>
                  <Text style={styles.businessDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Yakınındaki İşletmeler */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Yakınındaki İşletmeler</Text>
        {nearbyBusinesses.length === 0 ? (
          <Text style={styles.emptyText}>Henüz yakında işletme bulunmuyor</Text>
        ) : (
          nearbyBusinesses.map((business) => (
            <TouchableOpacity
              key={business.id}
              style={styles.nearbyBusinessItem}
              onPress={() => navigation.navigate('BusinessDetails' as any, { businessId: business.id })}
            >
              <View style={styles.nearbyBusinessImageContainer}>
                <Ionicons name="business-outline" size={28} color="#3498db" />
              </View>
              <View style={styles.nearbyBusinessInfo}>
                <Text style={styles.businessName}>{business.name}</Text>
                <Text style={styles.businessDescription} numberOfLines={1}>
                  {business.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))
        )}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchText: {
    marginLeft: 10,
    color: '#999',
    fontSize: 16,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
  businessCard: {
    width: windowWidth * 0.7,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  businessImageContainer: {
    height: 120,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessInfo: {
    padding: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  nearbyBusinessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  nearbyBusinessImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nearbyBusinessInfo: {
    flex: 1,
  },
});

export default HomeScreen; 