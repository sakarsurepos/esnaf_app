import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface PaymentPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Ödeme politikaları hakkında bilgi veren modal
 */
const PaymentPolicyModal: React.FC<PaymentPolicyModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Ödeme Politikaları</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.policySection}>
              <View style={[styles.policyIcon, { backgroundColor: Colors.paymentPolicyFree }]}>
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.policyContent}>
                <Text style={styles.policyTitle}>Ücretsiz Rezervasyon</Text>
                <Text style={styles.policyDescription}>
                  Bu politika ile randevu oluştururken ödeme yapmanız gerekmez. Ödemeyi hizmet 
                  sırasında veya sonrasında yapabilirsiniz. Salon ödeme kabul etmiyorsa, randevu 
                  sonrası online ödeme yapmanız gerekebilir.
                </Text>
              </View>
            </View>
            
            <View style={styles.policySection}>
              <View style={[styles.policyIcon, { backgroundColor: Colors.paymentPolicyDeposit }]}>
                <Ionicons name="wallet" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.policyContent}>
                <Text style={styles.policyTitle}>Depozito Gerektiren</Text>
                <Text style={styles.policyDescription}>
                  Bu politika ile randevu oluştururken belirtilen oranda bir depozito ödemeniz gerekir. 
                  Depozito, toplam tutarın belirli bir yüzdesidir (genellikle %15-30 arası). Kalan tutar, 
                  hizmet sırasında veya sonrasında ödenebilir.
                </Text>
              </View>
            </View>
            
            <View style={styles.policySection}>
              <View style={[styles.policyIcon, { backgroundColor: Colors.paymentPolicyFull }]}>
                <Ionicons name="card" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.policyContent}>
                <Text style={styles.policyTitle}>Tam Ödeme Gerektiren</Text>
                <Text style={styles.policyDescription}>
                  Bu politika ile randevu oluştururken hizmetin tam ücretini ödemeniz gerekir. 
                  Bu genellikle özel veya yüksek talep gören hizmetlerde, tatil günlerinde veya 
                  önemli etkinliklerden önce geçerlidir. İptal politikasını kontrol etmeniz önerilir.
                </Text>
              </View>
            </View>
            
            <View style={styles.infoSection}>
              <Ionicons name="information-circle" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>
                İptal politikaları işletmeden işletmeye farklılık gösterebilir. İptal etmek isterseniz, 
                ödemenizin iade edilebilmesi için işletmenin belirttiği süre sınırlarına dikkat edin.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  policySection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  policyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  policyContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 14,
    color: Colors.secondary,
    lineHeight: 20,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGrey,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.darkGrey,
    lineHeight: 18,
  },
});

export default PaymentPolicyModal; 