import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserActivePackages, checkServiceUsageRights } from '../../services/userPackageService';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PackageSelectionProps {
  serviceId: string;
  onPackageSelected: (packageId: string | null) => void;
  onUseRights: (hasRights: boolean) => void;
}

const PackageSelection = ({ serviceId, onPackageSelected, onUseRights }: PackageSelectionProps) => {
  const [loading, setLoading] = useState(true);
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const { user } = useAuth();
  const [hasRights, setHasRights] = useState(false);
  const [rightsSource, setRightsSource] = useState<'direct' | 'package' | 'membership' | null>(null);

  useEffect(() => {
    loadPackagesAndRights();
  }, [serviceId, user?.id]);

  const loadPackagesAndRights = async () => {
    if (!user?.id || !serviceId) return;
    
    setLoading(true);
    try {
      // 1. Önce kullanım haklarını kontrol et
      const rights = await checkServiceUsageRights(user.id, serviceId);
      setHasRights(rights.hasRights);
      
      if (rights.hasRights) {
        setRightsSource(rights.source);
        
        // Eğer bir paket veya üyelikten gelen bir kullanım hakkı varsa, 
        // o paketi/üyeliği default olarak seç
        if (rights.source === 'package' || rights.source === 'membership') {
          setSelectedPackageId(rights.purchase.id);
          onPackageSelected(rights.purchase.id);
        }
      }
      
      // 2. Aktif paketleri yükle
      const packages = await getUserActivePackages(user.id);
      setAvailablePackages(packages);
      
      // Kullanım hakkı durumunu üst bileşene bildir
      onUseRights(rights.hasRights);
    } catch (error) {
      console.error('Paket bilgileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId);
    onPackageSelected(packageId);
  };

  const handleClearSelection = () => {
    setSelectedPackageId(null);
    onPackageSelected(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>Paketleriniz yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanım Hakları</Text>
      
      {hasRights && (
        <View style={styles.rightsBadgeContainer}>
          <View style={[styles.rightsBadge, 
            { backgroundColor: 
              rightsSource === 'direct' ? '#E3F2FD' : 
              rightsSource === 'package' ? '#E8F5E9' : 
              '#FFF3E0' 
            }]}>
            <Ionicons 
              name={
                rightsSource === 'direct' ? 'checkmark-circle' : 
                rightsSource === 'package' ? 'cube' : 
                'ribbon'
              } 
              size={20} 
              color={
                rightsSource === 'direct' ? '#2196F3' : 
                rightsSource === 'package' ? '#4CAF50' : 
                '#FF9800'
              }
            />
            <Text style={styles.rightsBadgeText}>
              {rightsSource === 'direct' ? 'Bu hizmet için kullanım hakkınız var' : 
               rightsSource === 'package' ? 'Paket kapsamında kullanım hakkınız var' :
               'Üyelik kapsamında kullanım hakkınız var'}
            </Text>
          </View>
        </View>
      )}
      
      {availablePackages.length > 0 ? (
        <ScrollView style={styles.packagesContainer}>
          {availablePackages.map((pkg) => {
            const isSelected = selectedPackageId === pkg.id;
            const expiryDate = new Date(pkg.expiry_date);
            
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageItem,
                  isSelected && styles.selectedPackageItem
                ]}
                onPress={() => handlePackageSelect(pkg.id)}
              >
                <View style={styles.packageHeader}>
                  <Text style={styles.packageName}>{pkg.packageDetails.name}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  )}
                </View>
                
                <Text style={styles.packageDesc}>{pkg.packageDetails.description}</Text>
                
                <View style={styles.packageDetails}>
                  <Text style={styles.packageDetail}>
                    <Ionicons name="time-outline" size={16} color="#757575" /> 
                    Geçerlilik: {format(expiryDate, 'd MMMM yyyy', { locale: tr })}
                  </Text>
                  <Text style={styles.packageDetail}>
                    <Ionicons name="repeat-outline" size={16} color="#757575" /> 
                    Kalan Kullanım: {pkg.remaining_usage === -1 ? 'Sınırsız' : pkg.remaining_usage}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.noPackagesContainer}>
          <Text style={styles.noPackagesText}>
            Aktif paketiniz bulunmuyor. Paketsiz olarak devam edebilirsiniz.
          </Text>
        </View>
      )}
      
      {selectedPackageId && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearSelection}
        >
          <Text style={styles.clearButtonText}>Paket Seçimini Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  packagesContainer: {
    maxHeight: 300,
  },
  packageItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPackageItem: {
    borderColor: Colors.primary,
    backgroundColor: '#F5F9FF',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  packageDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  packageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  packageDetail: {
    fontSize: 13,
    color: '#757575',
    marginRight: 8,
  },
  clearButton: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: Colors.primary,
    fontSize: 14,
  },
  noPackagesContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  noPackagesText: {
    color: '#666',
    textAlign: 'center',
  },
  rightsBadgeContainer: {
    marginBottom: 16,
  },
  rightsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  rightsBadgeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
});

export default PackageSelection; 