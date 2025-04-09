import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Tables } from '../../types/supabase';
import { format, addMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';
import { COLORS } from '../../constants';
import { createAppointment } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';

// Manuel tanımlamalar (eksik modüller için)
const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

// Tarih işlemleri için yardımcı fonksiyonlar
const formatDate = (date: Date, formatStr: string) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const addMinutesDate = (date: Date, minutes: number) => {
  const newDate = new Date(date);
  newDate.setMinutes(date.getMinutes() + minutes);
  return newDate;
};

// Mock createAppointment fonksiyonu
const createAppointmentMock = async (appointmentData: {
  service_id: string;
  customer_id: string;
  business_id: string;
  branch_id?: string;
  staff_id: string;
  appointment_time: Date;
  location_type: "business" | "address";
  address?: string;
  customer_note?: string;
  total_price: number;
}) => {
  // Mock implementation
  console.log('Creating appointment with data:', appointmentData);
  
  // Başarılı işlem simülasyonu
  return {
    id: 'mock-appointment-id-' + Math.random().toString(36).substr(2, 9),
    ...appointmentData
  };
};

// AppointmentSummary komponenti ve props tanımlaması
export interface AppointmentDetails {
  service: Tables<'services'> & { 
    business_name?: string;  // İşletme adı için ek özellik
  };
  staff: { id: string; name: string; avatar_url?: string };
  date: Date;
  time: string;
  locationTypeValue: 'business' | 'address';
  address?: string;
  notes?: string;
}

export type AppointmentSummaryProps = {
  service: Tables<'services'> & { 
    business_name?: string;  // İşletme adı için ek özellik
  };
  staff: { id: string; name: string; avatar_url?: string };
  date: Date;
  time: string;
  locationTypeValue: 'business' | 'address';
  address?: string;
  notes?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onBack?: () => void;
  onEdit?: () => void;
};

export const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({
  service,
  staff,
  date,
  time,
  locationTypeValue,
  address,
  notes: initialNotes = '',
  onConfirm,
  onCancel,
  onBack,
  onEdit,
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Auth context'ten kullanıcı bilgisini alalım

  // Tarih ve saat formatlama
  const formattedDate = format(date, 'd MMMM yyyy, EEEE');
  const startTime = time;
  const endTime = format(
    addMinutes(new Date(`${date.toISOString().split('T')[0]}T${time}:00`), service.duration_minutes || 30),
    'HH:mm'
  );

  const handleConfirmAppointment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user || !user.id) {
        throw new Error('Kullanıcı girişi yapılmamış');
      }
      
      // Randevu oluşturma işlemi
      const appointmentData = {
        service_id: service.id,
        customer_id: user.id, // Auth context'ten alınan kullanıcı ID'si
        staff_id: staff.id,
        business_id: service.business_id || '',
        branch_id: service.branch_id || undefined,
        appointment_time: new Date(`${format(date, 'yyyy-MM-dd')}T${time}`),
        location_type: locationTypeValue,
        address: locationTypeValue === 'address' ? address : undefined,
        customer_note: notes.trim() || undefined,
        total_price: service.price
      };

      await createAppointment(appointmentData);
      
      // İşlem başarılı, onConfirm çağrılıyor
      onConfirm();
    } catch (err) {
      console.error('Randevu oluşturma hatası:', err);
      setError('Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Randevuyu İptal Et',
      'Randevu oluşturma işlemini iptal etmek istediğinize emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        { text: 'Evet, İptal Et', style: 'destructive', onPress: () => onBack?.() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu Onayı</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Randevu Özeti</Text>

          {/* Hizmet Detayları */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="build" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Hizmet Detayları</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hizmet</Text>
              <Text style={styles.detailValue}>{service.title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>İşletme</Text>
              <Text style={styles.detailValue}>{service.business_name || 'İşletme Adı'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Süre</Text>
              <Text style={styles.detailValue}>{service.duration_minutes || 30} dakika</Text>
            </View>
          </TouchableOpacity>

          {/* Personel Bilgisi */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="person" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Personel</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Personel</Text>
              <Text style={styles.detailValue}>{staff.name || 'Fark etmez'}</Text>
            </View>
          </TouchableOpacity>

          {/* Tarih ve Saat */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="event" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Tarih ve Saat</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tarih</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Saat</Text>
              <Text style={styles.detailValue}>{startTime} - {endTime}</Text>
            </View>
          </TouchableOpacity>

          {/* Lokasyon */}
          <TouchableOpacity 
            style={styles.detailCard}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="location-on" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Lokasyon</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tip</Text>
              <Text style={styles.detailValue}>
                {locationTypeValue === 'business' ? 'İşletme' : 'Adresime Gelsin'}
              </Text>
            </View>
            {locationTypeValue === 'address' && address && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Adres</Text>
                <Text style={styles.detailValue}>{address}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Ücret */}
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Icon name="payment" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Ödeme Bilgileri</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Toplam Ücret</Text>
              <Text style={styles.priceValue}>{service.price.toFixed(2)} ₺</Text>
            </View>
          </View>

          {/* Notlar */}
          <TouchableOpacity 
            style={[styles.detailCard, styles.notesContainer]}
            onPress={() => onEdit?.()}
          >
            <View style={styles.detailHeader}>
              <Icon name="note" size={22} color={COLORS.primary} />
              <Text style={styles.detailHeaderText}>Ek Notlar</Text>
              <Icon name="edit" size={18} color={COLORS.gray} style={styles.editIcon} />
            </View>
            <Text style={styles.notesText}>
              {notes ? notes : 'Not eklemek için dokunun'}
            </Text>
          </TouchableOpacity>

          {/* Hata mesajı */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="error-outline" size={20} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Butonlar */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>İptal Et</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirmAppointment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Randevuyu Onayla</Text>
          )}
        </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  summaryContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 16,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 12,
  },
  detailHeaderText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginLeft: 8,
    flex: 1,
  },
  editIcon: {
    marginLeft: 'auto',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
    maxWidth: '60%',
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
    paddingVertical: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.danger,
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  },
});

// Named export ve default export birlikte sağlıyoruz
export default AppointmentSummary; 