import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface PaymentPolicyBadgeProps {
  paymentPolicy: 'free_booking' | 'deposit_required' | 'full_payment_required';
  depositRate?: number;
  showInfo?: boolean;
  onInfoPress?: () => void;
  style?: any;
}

/**
 * Ödeme politikasını gösteren rozet bileşeni
 * Farklı ödeme politikalarını renk ve simgelerle görselleştirir
 */
const PaymentPolicyBadge: React.FC<PaymentPolicyBadgeProps> = ({
  paymentPolicy,
  depositRate = 0,
  showInfo = false,
  onInfoPress,
  style
}) => {
  // Politikaya göre stil ve içerik belirle
  let badgeColor, icon, label;
  
  switch (paymentPolicy) {
    case 'free_booking':
      badgeColor = Colors.paymentPolicyFree;
      icon = 'checkmark-circle';
      label = 'Ücretsiz Rezervasyon';
      break;
    case 'deposit_required':
      badgeColor = Colors.paymentPolicyDeposit;
      icon = 'wallet';
      label = `Depozito Gerekli (${(depositRate * 100).toFixed(0)}%)`;
      break;
    case 'full_payment_required':
      badgeColor = Colors.paymentPolicyFull;
      icon = 'card';
      label = 'Tam Ödeme Gerekli';
      break;
    default:
      badgeColor = Colors.grey;
      icon = 'help-circle';
      label = 'Belirsiz';
  }
  
  return (
    <View style={[styles.badgeContainer, { backgroundColor: badgeColor }, style]}>
      <Ionicons name={icon} size={14} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.badgeText}>{label}</Text>
      
      {showInfo && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={onInfoPress}
        >
          <Ionicons name="information-circle" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  icon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  infoButton: {
    marginLeft: 4,
  },
});

export default PaymentPolicyBadge; 