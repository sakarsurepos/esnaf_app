import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  SectionList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ServiceDiscoveryStackParamList } from '../../navigation/types';
import { getAllServiceCategories } from '../../services/dataService';
import { ExtendedServiceCategory, ServiceSubcategory } from '../../models/service_categories/types';

type NavigationProp = NativeStackNavigationProp<ServiceDiscoveryStackParamList, 'Category'>;

// İlgi çeken (öne çıkan) kategori ID'leri
const FEATURED_CATEGORY_IDS = ['category-uuid-1', 'category-uuid-2', 'category-uuid-3', 'category-uuid-4'];

const CategoryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<ExtendedServiceCategory[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<ExtendedServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // dataService aracılığıyla kategorileri yükleyen fonksiyon
  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllServiceCategories();
      
      if (error) {
        throw new Error('Kategoriler yüklenirken bir hata oluştu');
      }
      
      if (data) {
        // ExtendedServiceCategory olarak veriyi işleyeceğiz
        const extendedData = data as unknown as ExtendedServiceCategory[];
        setCategories(extendedData);
        
        // Popüler kategorileri filtreleme
        const featured = extendedData.filter(category => 
          FEATURED_CATEGORY_IDS.includes(category.id)
        );
        setFeaturedCategories(featured);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata oluştu:', error);
      setError('Kategoriler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Kategori seçimi
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    navigation.navigate('ServiceList', {
      categoryId,
      categoryName,
    });
  };

  // Alt Kategori seçimi
  const handleSubcategorySelect = (subcategoryId: string, subcategoryName: string) => {
    navigation.navigate('ServiceList', {
      categoryId: subcategoryId,
      categoryName: subcategoryName,
    });
  };

  // Kategori açılıp kapanma durumu yönetimi
  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Arama işlevi
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('SearchResults', { query: searchQuery });
    }
  };

  // Filtrelenmiş kategoriler
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.subcategories && category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const renderSubcategoryItem = (subcategory: ServiceSubcategory, categoryId: string) => (
    <TouchableOpacity
      key={subcategory.id}
      style={styles.subcategoryItem}
      onPress={() => handleSubcategorySelect(subcategory.id, subcategory.name)}
    >
      <View style={styles.subcategoryIconContainer}>
        <Ionicons name={subcategory.icon_url as any} size={20} color="#3498db" />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.subcategoryName}>{subcategory.name}</Text>
        <Text style={styles.categoryDescription} numberOfLines={1}>{subcategory.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#999" />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: ExtendedServiceCategory }) => {
    const isExpanded = expandedCategories.includes(item.id);
    const hasSubcategories = item.subcategories && item.subcategories.length > 0;

    return (
      <View>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => hasSubcategories ? toggleCategoryExpand(item.id) : handleCategorySelect(item.id, item.name)}
        >
          <View style={styles.categoryImageContainer}>
            <Ionicons name={item.icon_url as any} size={28} color="#3498db" />
          </View>
          <View style={styles.categoryContent}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryDescription} numberOfLines={1}>{item.description}</Text>
          </View>
          {hasSubcategories ? (
            <Ionicons 
              name={isExpanded ? "chevron-down" : "chevron-forward"} 
              size={20} 
              color="#999" 
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color="#999" />
          )}
        </TouchableOpacity>

        {/* Alt kategoriler (açık durumdaysa) */}
        {isExpanded && hasSubcategories && (
          <View style={styles.subcategoriesContainer}>
            {item.subcategories?.map(subcategory => 
              renderSubcategoryItem(subcategory, item.id)
            )}
          </View>
        )}
      </View>
    );
  };

  const renderFeaturedCategories = () => (
    <View style={styles.featuredSection}>
      <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
      <View style={styles.featuredGrid}>
        {featuredCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={styles.featuredItem}
            onPress={() => handleCategorySelect(category.id, category.name)}
          >
            <View style={styles.featuredIconContainer}>
              <Ionicons name={category.icon_url as any} size={30} color="#3498db" />
            </View>
            <Text style={styles.featuredName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={loadCategories}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kategori ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
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
      </View>

      {searchQuery.length === 0 && renderFeaturedCategories()}

      <View style={styles.allCategoriesSection}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Arama Sonuçları' : 'Tüm Kategoriler'}
        </Text>
        <FlatList
          data={filteredCategories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            </View>
          }
        />
      </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
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
  featuredSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featuredItem: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  featuredIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  allCategoriesSection: {
    flex: 1,
    padding: 16,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#777',
  },
  subcategoriesContainer: {
    marginLeft: 20,
    marginBottom: 10,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 6,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  subcategoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default CategoryScreen; 