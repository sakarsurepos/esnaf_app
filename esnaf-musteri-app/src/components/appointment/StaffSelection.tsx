import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Alert,
  SafeAreaView
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { getStaffByBusinessService, getAvailableStaff } from '../../services/dataService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../constants';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Personel tipini tanımlama
export interface Staff {
  id: string;
  name: string;
  position: string;
  avatar: string;
  rating: number;
  experience: number; // Yıl cinsinden
  description?: string;
  isAvailable: boolean;
}

export interface StaffSelectionProps {
  serviceId: string;
  businessId: string;
  onBack: () => void;
  onStaffSelect: (staff: { id: string; name: string }) => void;
}

export const StaffSelection: React.FC<StaffSelectionProps> = ({
  serviceId,
  businessId,
  onBack,
  onStaffSelect,
}) => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        // Tüm personeli getir - tarih ve saat filtrelemesi olmadan
        const staff = await getStaffByBusinessService(businessId, serviceId);
        
        setStaffList(staff as Staff[]);
      } catch (err) {
        console.error('Personel listesi yüklenirken hata:', err);
        setError('Personel listesi yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    loadStaff();
  }, [businessId, serviceId]);

  const handleStaffSelect = (staff: Staff) => {
    setSelectedStaff(staff.id);
    onStaffSelect({ id: staff.id, name: staff.name });
  };

  // Yıldız derecelendirmesini render etme
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Icon key={`star-${i}`} name="star" size={16} color={COLORS.yellow} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Icon key={`star-half-${i}`} name="star-half" size={16} color={COLORS.yellow} />
        );
      } else {
        stars.push(
          <Icon key={`star-outline-${i}`} name="star-outline" size={16} color={COLORS.yellow} />
        );
      }
    }

    return (
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{stars}</View>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderStaffItem = ({ item }: { item: Staff }) => (
    <TouchableOpacity
      style={[
        styles.staffCard,
        selectedStaff === item.id && styles.selectedStaffCard,
        !item.isAvailable && styles.unavailableStaffCard
      ]}
      onPress={() => item.isAvailable && handleStaffSelect(item)}
      disabled={!item.isAvailable}
    >
      <Image source={{ uri: item.avatar }} style={styles.staffAvatar} />
      
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffPosition}>{item.position}</Text>
        
        {renderRating(item.rating)}
        
        <View style={styles.experienceContainer}>
          <Icon name="work" size={14} color={COLORS.gray} />
          <Text style={styles.experienceText}>{item.experience} yıl deneyim</Text>
        </View>
        
        {item.description && (
          <Text style={styles.staffDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      
      {!item.isAvailable && (
        <View style={styles.unavailableOverlay}>
          <Text style={styles.unavailableText}>Uygun Değil</Text>
        </View>
      )}
      
      {selectedStaff === item.id && (
        <View style={styles.selectedIndicator}>
          <Icon name="check-circle" size={24} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personel Seçimi</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Uygun personeller yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personel Seçimi</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => setLoading(true)}
          >
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Personel Seçimi</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Uygun Personeller</Text>
        <Text style={styles.sectionSubtitle}>Lütfen randevunuz için bir personel seçin</Text>
        
        {staffList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="person-off" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>Seçtiğiniz tarih ve saatte uygun personel bulunamadı.</Text>
            <TouchableOpacity style={styles.changeButton} onPress={onBack}>
              <Text style={styles.changeButtonText}>Tarih/Saat Değiştir</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={staffList}
            keyExtractor={(item) => item.id}
            renderItem={renderStaffItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
  placeholderIcon: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 24,
  },
  staffCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedStaffCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  unavailableStaffCard: {
    opacity: 0.7,
  },
  staffAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.lightGray,
  },
  staffInfo: {
    flex: 1,
    marginLeft: 16,
  },
  staffName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.dark,
    marginBottom: 2,
  },
  staffPosition: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  experienceText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  staffDescription: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 4,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.errorLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  unavailableText: {
    color: COLORS.error,
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
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
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  changeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  }
}); 