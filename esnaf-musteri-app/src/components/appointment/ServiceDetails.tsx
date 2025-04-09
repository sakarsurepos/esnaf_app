import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tables } from '../../types/supabase';

interface ServiceDetailsProps {
  service: Tables<'services'>;
  business: Tables<'businesses'>;
  onContinue: () => void;
  onBack: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  business,
  onContinue,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Hizmet Bilgileri</Text>

          <View style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            {service.description && (
              <Text style={styles.serviceDescription}>{service.description}</Text>
            )}

            <View style={styles.serviceDetails}>
              {service.duration_minutes && (
                <View style={styles.serviceDetail}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.serviceDetailText}>{service.duration_minutes} dakika</Text>
                </View>
              )}

              <View style={styles.serviceDetail}>
                <Ionicons name="cash-outline" size={16} color="#666" />
                <Text style={styles.serviceDetailText}>{service.price ? `${service.price.toFixed(2)} ₺` : 'Fiyat belirtilmemiş'}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>İşletme Bilgileri</Text>

          <View style={styles.businessCard}>
            <View style={styles.businessHeader}>
              <Image
                source={business.logo_url ? { uri: business.logo_url } : require('../../assets/default-business.png')}
                style={styles.businessImage}
              />
              <View style={styles.businessInfo}>
                <Text style={styles.businessName}>{business.name}</Text>
                {business.phone && (
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{business.phone}</Text>
                  </View>
                )}
                {business.email && (
                  <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{business.email}</Text>
                  </View>
                )}
              </View>
            </View>

            {business.description && (
              <Text style={styles.businessDescription}>{business.description}</Text>
            )}

            {business.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{business.address}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back-outline" size={20} color="#3498db" />
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={onContinue}>
          <Text style={styles.nextButtonText}>Devam Et</Text>
          <Ionicons name="arrow-forward-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  businessHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  businessImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  businessInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  businessDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default ServiceDetails; 