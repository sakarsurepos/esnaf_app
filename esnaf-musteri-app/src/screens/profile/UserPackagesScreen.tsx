import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { UserPackage, getUserPackages } from '../../services/userPackageService';
import { format } from 'date-fns';

const UserPackagesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [packages, setPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadUserPackages();
  }, []);
  
  const loadUserPackages = async () => {
    if (!user) {
      setError('Kullanıcı bilgisi bulunamadı');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const userPackages = await getUserPackages(user.id);
      setPackages(userPackages);
      setError(null);
    } catch (err) {
      console.error('Paketler yüklenirken hata:', err);
      setError('Paketler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd.MM.yyyy');
  };
  
  const getStatusText = (status: string, expiryDate: Date) => {
    if (status === 'consumed') return 'Tükenmiş';
    if (new Date(expiryDate) < new Date()) return 'Süresi Dolmuş';
    return 'Aktif';
  };
  
  const getStatusColor = (status: string, expiryDate: Date) => {
    if (status === 'consumed') return COLORS.error;
    if (new Date(expiryDate) < new Date()) return COLORS.warning;
    return COLORS.success;
  };
  
  const renderPackageItem = ({ item }: { item: UserPackage }) => {
    const statusText = getStatusText(item.status, item.expiry_date);
    const statusColor = getStatusColor(item.status, item.expiry_date);
    
    return (
      <TouchableOpacity 
        style={styles.packageCard}
        onPress={() => handlePackagePress(item)}
      >
        <View style={styles.packageHeader}>
          <Text style={styles.packageName}>{item.package_name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        
        <View style={styles.businessInfo}>
          <Icon name="store" size={16} color={COLORS.gray} />
          <Text style={styles.businessName}>{item.business_name}</Text>
        </View>
        
        <View style={styles.packageDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Satın Alma:</Text>
            <Text style={styles.detailValue}>{formatDate(item.purchase_date)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Son Kullanma:</Text>
            <Text style={styles.detailValue}>{formatDate(item.expiry_date)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Toplam Hizmet:</Text>
            <Text style={styles.detailValue}>{item.total_services}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Kalan Hizmet:</Text>
            <Text style={[styles.detailValue, { color: COLORS.primary }]}>{item.remaining_services}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(item.used_services / item.total_services) * 100}%`,
                  backgroundColor: statusColor
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.used_services}/{item.total_services} kullanıldı
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const handlePackagePress = (pkg: UserPackage) => {
    // Paket detaylarını göster
    Alert.alert(
      pkg.package_name,
      `${pkg.business_name}\n\n` +
      `İçerdiği Hizmetler:\n` +
      pkg.services.map(service => 
        `- ${service.service_name}: ${service.used_count}/${service.total_count} kullanıldı`
      ).join('\n'),
      [{ text: 'Tamam', style: 'cancel' }]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Paketleriniz yükleniyor...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="error-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadUserPackages}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paketlerim</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {packages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="card-membership" size={64} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>Henüz satın aldığınız bir paket bulunmuyor.</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('ServiceDiscovery')}
          >
            <Text style={styles.browseButtonText}>Hizmetlere Göz At</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={renderPackageItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  listContent: {
    padding: 16,
  },
  packageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginLeft: 8,
  },
  packageDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'right',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
});

export default UserPackagesScreen; 