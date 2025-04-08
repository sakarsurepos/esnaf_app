import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabase';

type SearchScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface Business {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  category_id: string;
}

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Örnek işletmeler - gerçek uygulamada Supabase'den gelecek
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

  useEffect(() => {
    // Son aramaları yükle (gerçek uygulamada AsyncStorage'den)
    setRecentSearches(['berber', 'terzi', 'fırın', 'tamirci']);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    
    // Arama işlemi simülasyonu (gerçek uygulamada Supabase sorgusu olacak)
    setTimeout(() => {
      // Basit arama filtresi
      const filteredResults = sampleBusinesses.filter(
        business => 
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setLoading(false);
      
      // Son aramalara ekle (eğer zaten yoksa)
      if (!recentSearches.includes(query) && query.trim()) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
      }
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };

  const handleSelectRecentSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <View style={styles.container}>
      {/* Arama Çubuğu */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Esnaf veya hizmet ara..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>İptal</Text>
        </TouchableOpacity>
      </View>

      {/* Sonuçlar veya Son Aramalar */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : searchQuery ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => navigation.navigate('BusinessDetails', { businessId: item.id })}
            >
              <Image source={{ uri: item.image }} style={styles.resultImage} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultDescription} numberOfLines={1}>
                  {item.description}
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyResultsText}>
                "{searchQuery}" için sonuç bulunamadı
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Son Aramalar</Text>
          {recentSearches.map((query, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchItem}
              onPress={() => handleSelectRecentSearch(query)}
            >
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.recentSearchText}>{query}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 10,
    padding: 5,
  },
  cancelButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
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
  emptyResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  recentSearchesContainer: {
    padding: 16,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentSearchText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});

export default SearchScreen; 