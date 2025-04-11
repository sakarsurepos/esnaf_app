import React, { useState, useEffect, useRef } from 'react';
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
import { getAllServiceCategories, getAllBusinesses, getAllCampaigns } from '../../services/dataService';
import { Campaign } from '../../models/campaigns/types';
import { ExtendedServiceCategory } from '../../models/service_categories/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [popularBusinesses, setPopularBusinesses] = useState<Tables<'businesses'>[]>([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState<Tables<'businesses'>[]>([]);
  const [categories, setCategories] = useState<ExtendedServiceCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentCampaignIndex, setCurrentCampaignIndex] = useState(0);
  
  // Kampanya otomatik kaydırma için referans
  const campaignsListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Verileri yükleme fonksiyonu
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Kampanyaları yükle
      const { data: campaignsData, error: campaignsError } = await getAllCampaigns();
      
      if (campaignsError) {
        throw new Error('Kampanyalar yüklenirken bir hata oluştu');
      }
      
      setCampaigns(campaignsData || []);

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

      // Kategorileri yükle
      const { data: categoriesData, error: categoriesError } = await getAllServiceCategories();
      
      if (categoriesError) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      
      // Öncelikli olarak gösterilecek kategori ID'leri
      const featuredCategoryIds = ['category-uuid-1', 'category-uuid-3', 'category-uuid-4', 'category-uuid-2'];
      
      if (categoriesData && categoriesData.length > 0) {
        // Kategori listesini featuredCategoryIds'ye göre sıralayıp diğerlerini arkaya koy
        const sortedCategories = [...categoriesData].sort((a, b) => {
          const indexA = featuredCategoryIds.indexOf(a.id);
          const indexB = featuredCategoryIds.indexOf(b.id);
          
          // Eğer her iki kategori de öne çıkarılacak kategorilerdeyse, dizideki sıralamaya göre sırala
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // Öne çıkarılacak kategorilerden biri değilse, öne çıkarılacak olanı öne al
          if (indexA !== -1) {
            return -1;
          }
          if (indexB !== -1) {
            return 1;
          }
          
          // Her ikisi de öne çıkarılmayacaksa, alfabetik olarak sırala
          return a.name.localeCompare(b.name);
        });
        
        setCategories(sortedCategories);
      } else {
        setCategories([]);
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

  // Otomatik kaydırma fonksiyonu
  useEffect(() => {
    if (campaigns.length > 1) {
      startAutoScroll();
    }
    
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [campaigns]);

  const startAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    
    autoScrollTimer.current = setInterval(() => {
      if (campaignsListRef.current && campaigns.length > 0) {
        const nextIndex = (currentCampaignIndex + 1) % campaigns.length;
        campaignsListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true
        });
        setCurrentCampaignIndex(nextIndex);
      }
    }, 3000); // Her 3 saniyede bir sonraki kampanyaya geç
  };

  const handleCampaignScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / windowWidth);
    
    if (index !== currentCampaignIndex) {
      setCurrentCampaignIndex(index);
      
      // Yeni bir kampanyaya kaydırıldığında sayacı yeniden başlat
      startAutoScroll();
    }
  };

  // Yenileme işlemi
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Kampanya seçme işlevi
  const handleCampaignSelect = (campaignId: string) => {
    navigation.navigate('Campaigns', { 
      screen: 'CampaignDetail', 
      params: { campaignId } 
    });
  };

  const renderCampaignItem = ({ item }: { item: Campaign }) => (
    <TouchableOpacity 
      style={styles.campaignItem}
      onPress={() => handleCampaignSelect(item.id)}
    >
      <View style={styles.campaignCard}>
        <View style={styles.campaignImageContainer}>
          <Ionicons name="megaphone-outline" size={48} color="#3498db" />
        </View>
        <View style={styles.campaignInfo}>
          <Text style={styles.campaignTitle}>{item.title}</Text>
          <Text style={styles.campaignDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {item.discountRate && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>%{item.discountRate} İndirim</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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

      {/* Kampanyalar */}
      <View style={styles.campaignsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kampanyalar</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Campaigns', { screen: 'Campaigns' } as any)}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <ActivityIndicator color="#3498db" size="large" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>
            Kampanyalar yüklenirken bir hata oluştu. Tekrar denemek için lütfen sayfayı yenileyin.
          </Text>
        ) : campaigns.length === 0 ? (
          <Text style={styles.emptyText}>Şu anda aktif kampanya bulunmamaktadır.</Text>
        ) : (
          <FlatList
            data={campaigns}
            renderItem={renderCampaignItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={windowWidth}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.campaignsContainer}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
              setCurrentCampaignIndex(newIndex);
            }}
            ref={campaignsListRef}
          />
        )}
        
        {/* Kampanya noktaları göstergesi */}
        {campaigns.length > 0 && (
          <View style={styles.paginationDots}>
            {campaigns.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: index === currentCampaignIndex ? '#3498db' : '#ddd' }
                ]}
              />
            ))}
          </View>
        )}
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
                <View style={styles.businessImage}>
                  <Ionicons name="business-outline" size={32} color="#3498db" />
                </View>
                <View style={styles.businessInfo}>
                  <Text style={styles.businessName}>{item.name}</Text>
                  <Text style={styles.businessCategory}>{item.category}</Text>
                  <Text style={styles.businessDistance}>{item.distance} km</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Hizmet Kategorileri */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hizmet Kategorileri</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ServiceDiscovery', { screen: 'Category' } as any)}>
            <Text style={styles.seeAllText}>Tümünü Gör</Text>
          </TouchableOpacity>
        </View>
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>Henüz kategori bulunmuyor</Text>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => navigation.navigate('ServiceDiscovery', { 
                  screen: 'ServiceList',
                  params: { categoryId: item.id, categoryName: item.name }
                } as any)}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name={item.icon_url as any} size={32} color="#3498db" />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
                {item.subcategories && (
                  <View style={styles.subcategoriesContainer}>
                    {item.subcategories.slice(0, 3).map(subcat => (
                      <TouchableOpacity 
                        key={subcat.id}
                        style={styles.subcategoryTag}
                        onPress={() => navigation.navigate('ServiceDiscovery', { 
                          screen: 'ServiceList',
                          params: { categoryId: subcat.id, categoryName: subcat.name }
                        } as any)}
                      >
                        <Text style={styles.subcategoryTagText} numberOfLines={1}>{subcat.name}</Text>
                      </TouchableOpacity>
                    ))}
                    {item.subcategories.length > 3 && (
                      <TouchableOpacity 
                        style={styles.moreTag}
                        onPress={() => navigation.navigate('ServiceDiscovery', { 
                          screen: 'Category',
                          params: { initialCategory: item.id }
                        } as any)}
                      >
                        <Text style={styles.moreTagText}>+{item.subcategories.length - 3} daha</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
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
              style={styles.nearbyItem}
              onPress={() => navigation.navigate('BusinessDetails' as any, { businessId: business.id })}
            >
              <View style={styles.nearbyImage}>
                <Ionicons name="business-outline" size={28} color="#3498db" />
              </View>
              <View style={styles.nearbyInfo}>
                <Text style={styles.nearbyName}>{business.name}</Text>
                <Text style={styles.nearbyCategory}>{business.category}</Text>
                <View style={styles.nearbyRating}>
                  <Ionicons name="star" size={16} color="#f39c12" />
                  <Text style={styles.ratingText}>
                    {business.rating !== undefined && business.rating !== null 
                      ? business.rating.toFixed(1) 
                      : '0.0'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
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
    backgroundColor: '#fff',
    padding: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  errorText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchBar: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  businessCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  businessImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  businessInfo: {
    padding: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  businessCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  businessDistance: {
    fontSize: 12,
    color: '#888',
  },
  nearbyItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nearbyImage: {
    width: 64,
    height: 64,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  nearbyInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  nearbyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  nearbyCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nearbyRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  campaignsSection: {
    marginTop: 24,
    paddingHorizontal: 0,
  },
  campaignsContainer: {
    paddingHorizontal: 0,
  },
  campaignItem: {
    width: windowWidth,
    paddingHorizontal: 16,
  },
  campaignCard: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  campaignImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  campaignInfo: {
    padding: 16,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#e74c3c',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  loader: {
    marginVertical: 20,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
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
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#999',
  },
  categoryCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subcategoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  subcategoryTagText: {
    fontSize: 10,
    color: '#333',
  },
  moreTag: {
    backgroundColor: '#3498db',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  moreTagText: {
    fontSize: 10,
    color: '#fff',
  },
  subcategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
    width: '100%',
  },
});

export default HomeScreen; 