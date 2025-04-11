import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AppointmentStackParamList } from '../../navigation/types';
import { getAvailableResources } from '../../services/resourceService';
import { Resource, ResourceType, ResourceStatus } from '../../models/resources';

type ResourceSelectionScreenNavigationProp = NativeStackNavigationProp<
  AppointmentStackParamList,
  'ResourceSelection'
>;

type ResourceSelectionScreenRouteProp = RouteProp<
  AppointmentStackParamList,
  'ResourceSelection'
>;

const ResourceSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ResourceSelectionScreenNavigationProp>();
  const route = useRoute<ResourceSelectionScreenRouteProp>();
  
  const { 
    businessId, 
    resourceType, 
    startTime, 
    endTime, 
    serviceId,
    appointmentParams,
    multiSelect = false
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableResources();
  }, []);

  const loadAvailableResources = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await getAvailableResources(
        businessId,
        resourceType as ResourceType,
        startTime,
        endTime || startTime // eğer endTime yoksa, startTime kullanılır
      );

      if (error) {
        throw new Error(`Kaynak bilgileri yüklenirken bir hata oluştu: ${error.message}`);
      }

      setResources(data || []);
    } catch (err) {
      console.error('Kaynakları yükleme hatası:', err);
      setError('Kaynaklar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSelect = (resourceId: string) => {
    if (multiSelect) {
      // Çoklu seçim modunda
      setSelectedResources(prev => {
        if (prev.includes(resourceId)) {
          return prev.filter(id => id !== resourceId);
        } else {
          return [...prev, resourceId];
        }
      });
    } else {
      // Tekli seçim modunda
      setSelectedResources([resourceId]);
    }
  };

  const handleContinue = () => {
    if (selectedResources.length === 0) {
      Alert.alert(
        'Seçim Yapılmadı',
        'Lütfen devam etmek için en az bir kaynak seçin.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    // Seçilen kaynakları randevu parametrelerine ekle
    const updatedAppointmentParams = {
      ...appointmentParams,
      resources: {
        resource_ids: selectedResources,
        start_time: startTime,
        end_time: endTime
      }
    };

    // Bir sonraki ekrana geç (AppointmentSummary veya Payment ekranı olabilir)
    navigation.navigate('AppointmentSummary', {
      ...updatedAppointmentParams,
      serviceId
    });
  };

  const getResourceTypeLabel = () => {
    switch (resourceType) {
      case ResourceType.TENNIS_COURT:
        return 'Tenis Kortu';
      case ResourceType.TENNIS_RACKET:
        return 'Tenis Raketi';
      case ResourceType.FITNESS_EQUIPMENT:
        return 'Fitness Ekipmanı';
      default:
        return 'Kaynak';
    }
  };

  const renderResourceItem = ({ item }: { item: Resource }) => {
    const isSelected = selectedResources.includes(item.id);
    const statusText = getResourceStatusText(item.status);
    
    // Kort tipi varsa göster (sadece tenis kortları için)
    const courtTypeLabel = item.details?.court_type 
      ? getCourtTypeLabel(item.details.court_type) 
      : '';
    
    // Kapalı alan bilgisi (sadece tenis kortları için)
    const isCoveredText = item.details?.is_covered !== undefined 
      ? (item.details.is_covered ? 'Kapalı Alan' : 'Açık Alan') 
      : '';

    return (
      <TouchableOpacity
        style={[
          styles.resourceItem,
          isSelected && styles.selectedResource
        ]}
        onPress={() => handleResourceSelect(item.id)}
        disabled={item.status !== ResourceStatus.AVAILABLE}
      >
        <View style={styles.resourceDetails}>
          <View style={styles.resourceImageContainer}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.resourceImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons 
                  name={resourceType === ResourceType.TENNIS_COURT ? 'tennisball-outline' : 'fitness-outline'} 
                  size={32} 
                  color="#3498db" 
                />
              </View>
            )}
          </View>

          <View style={styles.resourceInfo}>
            <Text style={styles.resourceName}>{item.name}</Text>
            <Text style={styles.resourceDescription}>{item.description}</Text>
            
            {/* Kort/Raket detayları */}
            {courtTypeLabel && (
              <View style={styles.detailItem}>
                <Ionicons name="disc-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{courtTypeLabel}</Text>
              </View>
            )}
            
            {isCoveredText && (
              <View style={styles.detailItem}>
                <Ionicons name={item.details?.is_covered ? 'home-outline' : 'sunny-outline'} size={16} color="#666" />
                <Text style={styles.detailText}>{isCoveredText}</Text>
              </View>
            )}
            
            {/* Raket için spesifik detaylar */}
            {item.details?.brand && (
              <View style={styles.detailItem}>
                <Ionicons name="pricetag-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{`${item.details.brand} ${item.details.model}`}</Text>
              </View>
            )}
            
            {item.details?.condition && (
              <View style={styles.detailItem}>
                <Ionicons name="star-outline" size={16} color="#666" />
                <Text style={styles.detailText}>Durum: {getConditionLabel(item.details.condition)}</Text>
              </View>
            )}

            <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>

          {item.status === ResourceStatus.AVAILABLE && (
            <View style={styles.selectionIndicator}>
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={28} color="#2ecc71" />
              ) : (
                <Ionicons name="ellipse-outline" size={28} color="#bbb" />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Kaynak durumu metni
  const getResourceStatusText = (status: ResourceStatus) => {
    switch (status) {
      case ResourceStatus.AVAILABLE:
        return 'Müsait';
      case ResourceStatus.RESERVED:
        return 'Rezerve';
      case ResourceStatus.MAINTENANCE:
        return 'Bakımda';
      case ResourceStatus.OUT_OF_ORDER:
        return 'Kullanım Dışı';
      default:
        return 'Bilinmiyor';
    }
  };

  // Kort tipi etiketi
  const getCourtTypeLabel = (courtType: string) => {
    switch (courtType) {
      case 'clay':
        return 'Kil Kort';
      case 'hard':
        return 'Sert Zemin';
      case 'grass':
        return 'Çim Kort';
      case 'carpet':
        return 'Halı Kort';
      default:
        return courtType;
    }
  };

  // Ekipman durumu etiketi
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'Yeni';
      case 'good':
        return 'İyi';
      case 'fair':
        return 'Orta';
      case 'poor':
        return 'Yıpranmış';
      default:
        return condition;
    }
  };

  // Durum badge'i stili
  const getStatusBadgeStyle = (status: ResourceStatus) => {
    switch (status) {
      case ResourceStatus.AVAILABLE:
        return styles.availableStatus;
      case ResourceStatus.RESERVED:
        return styles.reservedStatus;
      case ResourceStatus.MAINTENANCE:
        return styles.maintenanceStatus;
      case ResourceStatus.OUT_OF_ORDER:
        return styles.outOfOrderStatus;
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Müsait kaynaklar yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadAvailableResources}>
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {startTime ? new Date(startTime).toLocaleDateString('tr-TR', { 
            day: 'numeric', 
            month: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : 'Seçilen Zaman'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {getResourceTypeLabel()} Seçimi
        </Text>
      </View>

      {resources.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={48} color="#7f8c8d" />
          <Text style={styles.emptyText}>
            Seçilen zaman diliminde müsait {getResourceTypeLabel().toLowerCase()} bulunamadı.
          </Text>
          <TouchableOpacity 
            style={styles.changeTimeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.changeTimeButtonText}>Zamanı Değiştir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={resources}
            renderItem={renderResourceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resourcesList}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedResources.length === 0 && styles.disabledButton
              ]}
              onPress={handleContinue}
              disabled={selectedResources.length === 0}
            >
              <Text style={styles.continueButtonText}>Devam Et</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
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
  changeTimeButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  changeTimeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resourcesList: {
    padding: 16,
  },
  resourceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedResource: {
    borderColor: '#2ecc71',
    borderWidth: 2,
  },
  resourceDetails: {
    flexDirection: 'row',
    padding: 12,
  },
  resourceImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  resourceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  resourceInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
  },
  availableStatus: {
    backgroundColor: '#e8f8f5',
  },
  reservedStatus: {
    backgroundColor: '#fef9e7',
  },
  maintenanceStatus: {
    backgroundColor: '#ebf5fb',
  },
  outOfOrderStatus: {
    backgroundColor: '#f9ebea',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionIndicator: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#d5d5d5',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResourceSelectionScreen; 