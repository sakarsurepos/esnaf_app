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
import { supabase } from '../../services/supabase';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

// Örnek veri yapıları
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Business {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  distance?: number; // Opsiyonel, konum bilgisi varsa hesaplanacak
  category_id: string;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularBusinesses, setPopularBusinesses] = useState<Business[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Business[]>([]);

  // Örnek veriler - Gerçek uygulamada Supabase'den gelecek
  const sampleCategories: Category[] = [
    { id: '1', name: 'Berber', icon: 'cut' },
    { id: '2', name: 'Terzi', icon: 'shirt' },
    { id: '3', name: 'Tamirci', icon: 'hammer' },
    { id: '4', name: 'Fırın', icon: 'restaurant' },
    { id: '5', name: 'Kasap', icon: 'nutrition' },
    { id: '6', name: 'Manav', icon: 'leaf' },
    { id: '7', name: 'Kuru Temizleme', icon: 'water' },
    { id: '8', name: 'Eczane', icon: 'medkit' }
  ];

  const sampleBusinesses: Business[] = [
    {
      id: '1',
      name: 'Ahmet Berber Salonu',
      description: 'Kaliteli saç kesimi ve tıraş hizmetleri',
      image: 'https://picsum.photos/200',
      rating: 4.7,
      category_id: '1'
    },
    {
      id: '2',
      name: 'Mehmet Usta Terzi',
      description: 'Her türlü tamir ve dikiş işleri',
      image: 'https://picsum.photos/201',
      rating: 4.5,
      category_id: '2'
    },
    {
      id: '3',
      name: 'Anadolu Fırını',
      description: 'Taze ekmek ve unlu mamüller',
      image: 'https://picsum.photos/202',
      rating: 4.8,
      category_id: '4'
    },
    {
      id: '4',
      name: 'Ali Usta Tamirci',
      description: 'Elektronik ve ev aletleri tamiri',
      image: 'https://picsum.photos/203',
      rating: 4.3,
      category_id: '3'
    },
    {
      id: '5',
      name: 'Yılmaz Kasap',
      description: 'Taze et ürünleri',
      image: 'https://picsum.photos/204',
      rating: 4.6,
      category_id: '5'
    }
  ];

  // Verileri yükleme fonksiyonu
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Gerçek uygulamada burası Supabase sorguları olacak
      // Örnek kod:
      // const { data: categoriesData, error: categoriesError } = await supabase
      //   .from('categories')
      //   .select('*');
      
      // if (categoriesError) throw categoriesError;
      // setCategories(categoriesData);

      // Demo için örnek verileri kullan
      setCategories(sampleCategories);
      setPopularBusinesses(sampleBusinesses);
      setNearbyBusinesses([...sampleBusinesses].reverse());

    } catch (error) {
      console.error('Veri yükleme hatası:', error);
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

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
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
              onPress={() => console.log('Kategori seçildi:', item.name)}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={item.icon as any} size={24} color="#3498db" />
              </View>
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Popüler Esnaflar */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Popüler Esnaflar</Text>
        <FlatList
          data={popularBusinesses}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.businessCard}
              onPress={() => navigation.navigate('BusinessDetails', { businessId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.businessImage} />
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{item.name}</Text>
                <Text style={styles.businessDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Yakınındaki İşletmeler */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Yakınındaki İşletmeler</Text>
        {nearbyBusinesses.map((business) => (
          <TouchableOpacity
            key={business.id}
            style={styles.nearbyBusinessItem}
            onPress={() => navigation.navigate('BusinessDetails', { businessId: business.id })}
          >
            <Image source={{ uri: business.image }} style={styles.nearbyBusinessImage} />
            <View style={styles.nearbyBusinessInfo}>
              <Text style={styles.businessName}>{business.name}</Text>
              <Text style={styles.businessDescription} numberOfLines={1}>
                {business.description}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{business.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 5,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  businessCard: {
    width: windowWidth * 0.75,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  businessImage: {
    width: '100%',
    height: 150,
  },
  businessInfo: {
    padding: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  nearbyBusinessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  nearbyBusinessImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  nearbyBusinessInfo: {
    flex: 1,
    marginLeft: 12,
  },
});

export default HomeScreen; 