import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../constants';
import { getOrderDetails } from '../../services/dataService';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

type OrderDetailScreenProps = StackScreenProps<any, 'OrderDetail'>;

interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
}

interface OrderDetail {
  id: string;
  business_id: string;
  business_name: string;
  order_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  carrier?: string;
  carrier_url?: string;
  shipping_address: string;
  payment_method: string;
  items: OrderItem[];
}

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState<boolean>(false);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);

  // Sipariş detayını getir
  useEffect(() => {
    const fetchOrderDetail = async () => {
      setIsLoading(true);
      try {
        // Seçilen siparişin detaylarını getir
        const result = await getOrderDetails(orderId);
        
        if (result.error) {
          setError('Sipariş detayları yüklenirken bir hata oluştu.');
          return;
        }
        
        setOrderDetail(result.data);
      } catch (err) {
        console.error('Sipariş detayları yüklenirken hata:', err);
        setError('Sipariş detayları yüklenirken bir sorun oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetail();
  }, [orderId]);

  // Değerlendirme durumunu kontrol et
  useEffect(() => {
    const checkReviewStatus = async () => {
      setReviewLoading(true);
      try {
        const reviewService = await import('../../services/ReviewService').then(m => m.default);
        const response = await reviewService.getOrderReviewStatus(orderId);
        setHasReview(response.exists);
      } catch (err) {
        console.error('Değerlendirme durumu kontrol edilirken hata:', err);
      } finally {
        setReviewLoading(false);
      }
    };

    checkReviewStatus();
  }, [orderId]);

  // Kargo takip linkini aç
  const openTrackingUrl = () => {
    if (orderDetail?.carrier_url) {
      Linking.openURL(orderDetail.carrier_url);
    } else {
      Alert.alert('Bilgi', 'Takip linki bulunmamaktadır.');
    }
  };

  // Sipariş ile ilgili sorun bildir
  const reportProblem = () => {
    Alert.alert(
      'Sorun Bildir',
      'Sipariş ile ilgili bir sorun mu var?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sorun Bildir',
          onPress: () => {
            Alert.alert('Bilgi', 'Sorun bildirme işlemi şu anda geliştirme aşamasındadır.');
          }
        }
      ]
    );
  };

  // Aynı ürünleri tekrar sipariş et
  const reorderItems = () => {
    Alert.alert('Bilgi', 'Tekrar sipariş verme işlemi şu anda geliştirme aşamasındadır.');
  };

  // Değerlendirme ekranına git
  const goToReviewScreen = () => {
    navigation.navigate('WriteReview', { 
      orderId: orderDetail?.id, 
      businessName: orderDetail?.business_name 
    });
  };

  // Yükleniyor gösterimi
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sipariş Detayı</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Sipariş detayları yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hata gösterimi
  if (error || !orderDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sipariş Detayı</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorText}>{error || 'Sipariş detayı bulunamadı.'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Sipariş durumu gösterimi için renkler ve metinler
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

  // Tarih formatla
  const orderDate = parseISO(orderDetail.order_date);
  const formattedDate = format(orderDate, 'd MMMM yyyy, HH:mm', { locale: tr });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sipariş Detayı</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Sipariş Özeti */}
        <View style={styles.orderSummary}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Sipariş No:</Text>
            <Text style={styles.orderId}>{orderDetail.id}</Text>
          </View>
          
          <View style={[
            styles.statusBadge, 
            { backgroundColor: statusColors[orderDetail.status] }
          ]}>
            <Text style={styles.statusText}>{statusText[orderDetail.status]}</Text>
          </View>
          
          <Text style={styles.businessName}>{orderDetail.business_name}</Text>
          <Text style={styles.orderDate}>{formattedDate}</Text>
        </View>
        
        {/* Durum Bilgisi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sipariş Durumu</Text>
          
          <View style={styles.statusProgress}>
            <View style={[
              styles.statusStep, 
              { backgroundColor: orderDetail.status !== 'cancelled' ? COLORS.success : COLORS.lightGray }
            ]}>
              <Icon 
                name="check" 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
            <View style={[
              styles.statusLine, 
              { backgroundColor: orderDetail.status === 'pending' ? COLORS.lightGray : COLORS.success }
            ]} />
            
            <View style={[
              styles.statusStep, 
              { backgroundColor: ['confirmed', 'processing', 'shipped', 'delivered'].includes(orderDetail.status) ? COLORS.success : COLORS.lightGray }
            ]}>
              <Icon 
                name={['confirmed', 'processing', 'shipped', 'delivered'].includes(orderDetail.status) ? "check" : "hourglass-empty"} 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
            <View style={[
              styles.statusLine, 
              { backgroundColor: ['processing', 'shipped', 'delivered'].includes(orderDetail.status) ? COLORS.success : COLORS.lightGray }
            ]} />
            
            <View style={[
              styles.statusStep, 
              { backgroundColor: ['shipped', 'delivered'].includes(orderDetail.status) ? COLORS.success : COLORS.lightGray }
            ]}>
              <Icon 
                name={['shipped', 'delivered'].includes(orderDetail.status) ? "check" : "hourglass-empty"}
                size={16} 
                color="#FFFFFF" 
              />
            </View>
            <View style={[
              styles.statusLine, 
              { backgroundColor: orderDetail.status === 'delivered' ? COLORS.success : COLORS.lightGray }
            ]} />
            
            <View style={[
              styles.statusStep, 
              { backgroundColor: orderDetail.status === 'delivered' ? COLORS.success : COLORS.lightGray }
            ]}>
              <Icon 
                name={orderDetail.status === 'delivered' ? "check" : "hourglass-empty"}
                size={16} 
                color="#FFFFFF" 
              />
            </View>
          </View>
          
          <View style={styles.statusLabels}>
            <Text style={styles.statusLabel}>Onaylandı</Text>
            <Text style={styles.statusLabel}>Hazırlanıyor</Text>
            <Text style={styles.statusLabel}>Kargoya Verildi</Text>
            <Text style={styles.statusLabel}>Teslim Edildi</Text>
          </View>
        </View>
        
        {/* Kargo Takip */}
        {orderDetail.status === 'shipped' && orderDetail.tracking_number && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kargo Takibi</Text>
            
            <View style={styles.trackingInfo}>
              <View style={styles.trackingDetails}>
                <Text style={styles.trackingLabel}>Kargo Firması:</Text>
                <Text style={styles.trackingValue}>{orderDetail.carrier || 'Belirtilmemiş'}</Text>
                
                <Text style={styles.trackingLabel}>Takip Numarası:</Text>
                <Text style={styles.trackingValue}>{orderDetail.tracking_number}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.trackButton}
                onPress={openTrackingUrl}
              >
                <Text style={styles.trackButtonText}>Takip Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Teslimat Adresi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
          <Text style={styles.addressText}>{orderDetail.shipping_address}</Text>
        </View>
        
        {/* Ödeme Bilgisi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ödeme Bilgileri</Text>
          <Text style={styles.paymentMethod}>{orderDetail.payment_method}</Text>
        </View>
        
        {/* Ürünler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ürünler</Text>
          
          {orderDetail.items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image 
                source={{ uri: item.image_url }} 
                style={styles.productImage}
                resizeMode="cover"
              />
              
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.unit_price.toFixed(2)} TL</Text>
                <Text style={styles.productQuantity}>Adet: {item.quantity}</Text>
              </View>
              
              <Text style={styles.productTotal}>
                {(item.unit_price * item.quantity).toFixed(2)} TL
              </Text>
            </View>
          ))}
        </View>
        
        {/* Toplam */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Ara Toplam:</Text>
            <Text style={styles.totalValue}>{orderDetail.total_amount.toFixed(2)} TL</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Kargo:</Text>
            <Text style={styles.totalValue}>0.00 TL</Text>
          </View>
          
          <View style={[styles.totalRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>Toplam:</Text>
            <Text style={styles.grandTotalValue}>{orderDetail.total_amount.toFixed(2)} TL</Text>
          </View>
        </View>
        
        {/* Aksiyon Butonları */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={reportProblem}
          >
            <Icon name="report-problem" size={20} color={COLORS.error} />
            <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Sorun Bildir</Text>
          </TouchableOpacity>
          
          {!reviewLoading && (
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                hasReview ? styles.reviewedButton : styles.reviewButton,
                orderDetail.status !== 'delivered' ? styles.disabledButton : null
              ]}
              onPress={() => {
                if (orderDetail.status === 'delivered') {
                  goToReviewScreen();
                } else {
                  Alert.alert(
                    'Bilgi', 
                    'Değerlendirme yapmak için siparişin teslim edilmiş olması gerekmektedir.'
                  );
                }
              }}
            >
              <Icon 
                name={hasReview ? "rate-review" : "star"} 
                size={20} 
                color={hasReview ? COLORS.success : "#FFFFFF"} 
              />
              <Text style={hasReview ? styles.reviewedButtonText : styles.reviewButtonText}>
                {hasReview ? 'Değerlendirmeyi Düzenle' : 'Değerlendirme Yap'}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.reorderButton]}
            onPress={reorderItems}
          >
            <Icon name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.reorderButtonText}>Tekrar Sipariş Ver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: COLORS.lightBackground,
  },
  orderIdContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  orderIdLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.gray,
    marginRight: 4,
  },
  orderId: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.black,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  businessName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 12,
  },
  statusProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  statusStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.success,
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    width: 80,
  },
  trackingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingDetails: {
    flex: 1,
  },
  trackingLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  trackingValue: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginBottom: 8,
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  trackButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
  addressText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  paymentMethod: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  productTotal: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  totalSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  totalValue: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.black,
  },
  grandTotalValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  actionsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginLeft: 8,
  },
  reorderButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reorderButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  reviewButton: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  reviewButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  reviewedButton: {
    backgroundColor: '#FFFFFF',
    borderColor: COLORS.success,
  },
  reviewedButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.success,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.lightGray,
    opacity: 0.7
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
  },
});

export default OrderDetailScreen; 