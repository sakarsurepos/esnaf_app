import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { ServiceType } from '../../models/services/types';

interface AppointmentCardProps {
  id: string;
  serviceName: string;
  serviceType?: ServiceType; // Hizmet tipi
  businessName: string;
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  staffName?: string;
  resourceName?: string; // Kaynak adı (ör. Kort 1, Kort 2)
  onPress: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  serviceName,
  serviceType = ServiceType.SERVICE, // Varsayılan olarak SERVICE tipi
  businessName,
  date,
  time,
  price,
  status,
  staffName,
  resourceName,
  onPress
}) => {
  // Durum rengini ve ikonu belirle
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'confirmed':
        return COLORS.primary;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return 'clock-outline';
      case 'confirmed':
        return 'check-circle-outline';
      case 'completed':
        return 'check-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'information-outline';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Onay Bekliyor';
      case 'confirmed':
        return 'Onaylandı';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };
  
  // Hizmet tipine göre ikon getir
  const getServiceTypeIcon = () => {
    switch (serviceType) {
      case ServiceType.SERVICE:
        return 'calendar-clock';
      case ServiceType.RESOURCE:
        return 'tennis';
      case ServiceType.PRODUCT:
        return 'shopping';
      case ServiceType.PACKAGE:
        return 'package-variant-closed';
      default:
        return 'calendar-clock';
    }
  };
  
  // Hizmet tipine göre başlık getir
  const getServiceTypeTitle = () => {
    switch (serviceType) {
      case ServiceType.SERVICE:
        return 'Hizmet';
      case ServiceType.RESOURCE:
        return 'Kaynak';
      case ServiceType.PRODUCT:
        return 'Ürün';
      case ServiceType.PACKAGE:
        return 'Paket';
      default:
        return 'Hizmet';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.serviceTypeContainer}>
          <Icon name={getServiceTypeIcon()} size={16} color={COLORS.primary} />
          <Text style={styles.serviceTypeText}>{getServiceTypeTitle()}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Icon name={getStatusIcon()} size={16} color={getStatusColor()} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
        </View>
      </View>
      
      <Text style={styles.serviceTitle}>{serviceName}</Text>
      <Text style={styles.businessName}>{businessName}</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="calendar" size={16} color={COLORS.text} />
          <Text style={styles.detailText}>{formatDate(new Date(date))}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Icon name="clock-outline" size={16} color={COLORS.text} />
          <Text style={styles.detailText}>{time}</Text>
        </View>
        
        {serviceType !== ServiceType.PRODUCT && staffName && (
          <View style={styles.detailItem}>
            <Icon name="account" size={16} color={COLORS.text} />
            <Text style={styles.detailText}>{staffName}</Text>
          </View>
        )}
        
        {serviceType === ServiceType.RESOURCE && resourceName && (
          <View style={styles.detailItem}>
            <Icon name="tennis" size={16} color={COLORS.text} />
            <Text style={styles.detailText}>{resourceName}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{price.toFixed(2)} TL</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  serviceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTypeText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    ...FONTS.body4,
    marginLeft: 4,
  },
  serviceTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  businessName: {
    ...FONTS.body4,
    color: COLORS.darkgray,
    marginBottom: SIZES.padding,
  },
  detailsContainer: {
    marginBottom: SIZES.padding,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    ...FONTS.body4,
    marginLeft: 8,
    color: COLORS.text,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
});

export default AppointmentCard; 