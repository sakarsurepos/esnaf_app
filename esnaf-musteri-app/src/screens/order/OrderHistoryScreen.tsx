import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../constants';
import { getUserOrders } from '../../services/dataService';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

type OrderHistoryScreenProps = StackScreenProps<any, 'OrderHistory'>;

interface Order {
  id: string;
  business_id: string;
  business_name: string;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  item_count: number;
}

type OrderStatusFilter = 'all' | 'active' | 'completed' | 'cancelled';

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Siparişleri getir
  const fetchOrders = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    try {
      // Kullanıcının tüm siparişlerini getir
      const result = await getUserOrders('user-123'); // Gerçek uygulamada kullanıcı ID dinamik olarak alınacak
      
      if (result.error) {
        setError('Siparişler yüklenirken bir hata oluştu.');
        return;
      }
      
      // Her bir siparişe işletme adı ekle
      const ordersWithBusinessName = await Promise.all(
        result.data.map(async (order: any) => {
          // Gerçek uygulamada, bu bilgiler backend'den direkt gelebilir
          return {
            ...order,
            business_name: 'Test İşletmesi', // Bu kısım gerçek verilerle değiştirilecek
          };
        })
      );
      
      setOrders(ordersWithBusinessName);
    } catch (err) {
      console.error('Siparişler yüklenirken hata:', err);
      setError('Siparişler yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtre değiştiğinde filtreleme yap
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else if (statusFilter === 'active') {
      const activeStatuses = ['pending', 'confirmed', 'processing', 'shipped'];
      setFilteredOrders(orders.filter(order => activeStatuses.includes(order.status)));
    } else if (statusFilter === 'completed') {
      setFilteredOrders(orders.filter(order => order.status === 'delivered'));
    } else if (statusFilter === 'cancelled') {
      setFilteredOrders(orders.filter(order => order.status === 'cancelled'));
    }
  }, [statusFilter, orders]);

  // Yenile fonksiyonu
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders(false);
  };

  // Sipariş detayına git
  const navigateToDetail = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  // Sipariş öğesi render etme
  const renderOrderItem = ({ item }: { item: Order }) => {
    const orderDate = parseISO(item.order_date);
    const formattedDate = format(orderDate, 'd MMMM yyyy', { locale: tr });
    
    const statusColors = {
      pending: COLORS.warning,
      confirmed: COLORS.info,
      processing: COLORS.primary,
      shipped: COLORS.primary,
      delivered: COLORS.success,
      cancelled: COLORS.error
    };
    
    const statusText = {
      pending: 'Onay Bekliyor',
      confirmed: 'Onaylandı',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigateToDetail(item.id)}
      >
        <View style={styles.orderHeader}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{item.business_name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
              <Text style={styles.statusText}>{statusText[item.status]}</Text>
            </View>
          </View>
          <Text style={styles.orderAmount}>{item.total_amount.toFixed(2)} TL</Text>
        </View>
        
        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Icon name="event" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="shopping-bag" size={16} color={COLORS.primary} />
            <Text style={styles.detailText}>{item.item_count} ürün</Text>
          </View>
          
          {item.tracking_number && (
            <View style={styles.detailRow}>
              <Icon name="local-shipping" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>Takip No: {item.tracking_number}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.orderActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToDetail(item.id)}
          >
            <Text style={styles.actionButtonText}>Detayları Görüntüle</Text>
            <Icon name="chevron-right" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Boş içerik durumu
  const renderEmptyContent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-cart" size={64} color={COLORS.lightGray} />
      <Text style={styles.emptyText}>
        Sipariş geçmişiniz bulunmamaktadır.
      </Text>
      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Alışverişe Başla</Text>
      </TouchableOpacity>
    </View>
  );

  // Yükleniyor gösterimi
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sipariş Geçmişi</Text>
        </View>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Siparişleriniz yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hata gösterimi
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sipariş Geçmişi</Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchOrders()}
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
        <Text style={styles.headerTitle}>Sipariş Geçmişi</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, statusFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>
            Tümü
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, statusFilter === 'active' && styles.activeFilterTab]}
          onPress={() => setStatusFilter('active')}
        >
          <Text style={[styles.filterText, statusFilter === 'active' && styles.activeFilterText]}>
            Aktif
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, statusFilter === 'completed' && styles.activeFilterTab]}
          onPress={() => setStatusFilter('completed')}
        >
          <Text style={[styles.filterText, statusFilter === 'completed' && styles.activeFilterText]}>
            Tamamlanan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, statusFilter === 'cancelled' && styles.activeFilterTab]}
          onPress={() => setStatusFilter('cancelled')}
        >
          <Text style={[styles.filterText, statusFilter === 'cancelled' && styles.activeFilterText]}>
            İptal Edilen
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
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
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  filterContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingHorizontal: 8,
  },
  filterTab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  activeFilterTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  activeFilterText: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  orderAmount: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  orderDetails: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginLeft: 8,
  },
  orderActions: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  }
});

export default OrderHistoryScreen; 