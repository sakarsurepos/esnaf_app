import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Campaign } from '../../models/campaigns/types';
import { sampleCampaigns } from '../../models/campaigns/sample';
import { Colors } from '../../constants/Colors';
import SearchInput from '../../components/SearchInput';
import { formatDate } from '../../utils/dateUtils';

const CampaignsScreen = () => {
  const navigation = useNavigation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    // API entegrasyonu olduğunda burası gerçek veri çekme işlemlerini yapacak
    const loadCampaigns = async () => {
      try {
        // Simüle edilmiş API çağrısı gecikmesi
        setTimeout(() => {
          setCampaigns(sampleCampaigns);
          setFilteredCampaigns(sampleCampaigns);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Kampanyalar yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCampaigns(campaigns);
    } else {
      const filtered = campaigns.filter(
        campaign =>
          campaign.title.toLowerCase().includes(searchText.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    }
  }, [searchText, campaigns]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const navigateToCampaignDetail = (campaignId: string) => {
    // Detay sayfasına yönlendirme, ileride implementasyon için
    navigation.navigate('CampaignDetail', { campaignId });
    // console.log('Kampanya detayına gidiliyor:', campaignId);
  };

  const renderCampaignItem = ({ item }: { item: Campaign }) => {
    const isActive = item.status === 'active';
    const isExpired = item.status === 'expired';
    const isUpcoming = item.status === 'upcoming';

    return (
      <TouchableOpacity
        style={styles.campaignCard}
        onPress={() => navigateToCampaignDetail(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {item.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Öne Çıkan</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadge,
              isActive
                ? styles.activeBadge
                : isExpired
                ? styles.expiredBadge
                : styles.upcomingBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {isActive
                ? 'Aktif'
                : isExpired
                ? 'Sona Erdi'
                : 'Yakında'}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.dateText}>
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
              </Text>
            </View>

            {item.discountRate && (
              <View style={styles.discountContainer}>
                <Text style={styles.discountText}>%{item.discountRate}</Text>
              </View>
            )}
          </View>

          {item.discountCode && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Kod:</Text>
              <Text style={styles.codeText}>{item.discountCode}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Kampanyalar</Text>
        <Text style={styles.headerSubtitle}>
          Size özel fırsatları kaçırmayın!
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="pricetag-outline" size={60} color={Colors.grey} />
        <Text style={styles.emptyText}>Şu an için kampanya bulunmuyor</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput
        placeholder="Kampanya ara..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderCampaignItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchInput: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.darkGrey,
  },
  listContainer: {
    paddingBottom: 24,
  },
  campaignCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  featuredText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: Colors.success,
  },
  expiredBadge: {
    backgroundColor: Colors.danger,
  },
  upcomingBadge: {
    backgroundColor: Colors.warning,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.darkGrey,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: Colors.darkGrey,
    marginLeft: 4,
  },
  discountContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
  },
  codeLabel: {
    fontSize: 12,
    color: Colors.darkGrey,
    marginRight: 4,
  },
  codeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.darkGrey,
    textAlign: 'center',
  },
});

export default CampaignsScreen; 