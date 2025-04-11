import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { format, addDays, isBefore, isToday, isAfter, isSameDay, startOfToday } from 'date-fns';
import { tr } from 'date-fns/locale';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../constants';
import { getAvailableTimeSlots } from '../../services/dataService';

type DateTimeSelectionProps = {
  serviceId: string;
  businessId: string;
  staffId?: string;  // Opsiyonel yap
  onSelect: (dateTime: { date: Date; time: string }) => void;
  onBack: () => void;
};

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  serviceId,
  businessId,
  staffId,
  onSelect,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kullanılabilir tarihleri oluşturmak için
  useEffect(() => {
    const generateAvailableDates = () => {
      setIsLoading(true);
      try {
        const today = startOfToday();
        const dates = [];
        // Bugün ve sonraki 14 günü göster
        for (let i = 0; i < 15; i++) {
          dates.push(addDays(today, i));
        }
        setAvailableDates(dates);
        setIsLoading(false);
      } catch (err) {
        console.error('Tarihler oluşturulurken hata:', err);
        setError('Tarihler yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };

    generateAvailableDates();
  }, []);

  // Seçilen tarihe göre uygun zaman dilimlerini getirme
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!selectedDate) return;

      setLoadingTimeSlots(true);
      setAvailableTimeSlots([]);
      try {
        // Personel ID'si yoksa (kaynak rezervasyonu durumunda) farklı bir API çağrısı yapılabilir
        // veya mevcut API staffId olmadan çağrılabilir
        const timeSlotsData = await getAvailableTimeSlots(
          businessId, 
          serviceId, 
          selectedDate, 
          staffId || 'default-staff-id'  // staffId yoksa varsayılan ID kullan
        );
        setAvailableTimeSlots(timeSlotsData as string[]);
        setLoadingTimeSlots(false);
      } catch (err) {
        console.error('Zaman dilimleri yüklenirken hata:', err);
        setError(staffId 
          ? 'Personelin uygun zaman dilimleri yüklenirken bir hata oluştu' 
          : 'Uygun zaman dilimleri yüklenirken bir hata oluştu');
        setLoadingTimeSlots(false);
      }
    };

    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, businessId, serviceId, staffId]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Tarih değiştiğinde seçilen zamanı sıfırla
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelect({ date: selectedDate, time: selectedTime });
    } else {
      Alert.alert('Uyarı', 'Lütfen hem tarih hem de saat seçiniz');
    }
  };

  const renderDateItem = ({ item }: { item: Date }) => {
    const isSelected = isSameDay(selectedDate, item);
    const dayName = format(item, 'E', { locale: tr }).toUpperCase();
    const dayNumber = format(item, 'd');
    const monthName = format(item, 'MMM', { locale: tr });
    const isPastDate = isBefore(item, startOfToday()) && !isToday(item);

    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
          isPastDate && styles.disabledDateItem
        ]}
        onPress={() => !isPastDate && handleDateSelect(item)}
        disabled={isPastDate}
      >
        <Text style={[styles.dayName, isSelected && styles.selectedDateText]}>
          {dayName}
        </Text>
        <Text style={[styles.dayNumber, isSelected && styles.selectedDateText]}>
          {dayNumber}
        </Text>
        <Text style={[styles.monthName, isSelected && styles.selectedDateText]}>
          {monthName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeItem = ({ item }: { item: string }) => {
    const isSelected = selectedTime === item;

    return (
      <TouchableOpacity
        style={[styles.timeItem, isSelected && styles.selectedTimeItem]}
        onPress={() => handleTimeSelect(item)}
      >
        <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tarih ve Saat</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loaderText}>Kullanılabilir tarihler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tarih ve Saat</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => setIsLoading(true)}
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
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarih ve Saat</Text>
        <View style={styles.placeholderIcon} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Tarih Seçin</Text>
        <View style={styles.calendarContainer}>
          <FlatList
            data={availableDates}
            renderItem={renderDateItem}
            keyExtractor={(item) => format(item, 'yyyy-MM-dd')}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}
          />
        </View>

        <Text style={styles.sectionTitle}>Saat Seçin</Text>
        {loadingTimeSlots ? (
          <View style={styles.timeLoadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.timeLoadingText}>Uygun saatler yükleniyor...</Text>
          </View>
        ) : availableTimeSlots.length === 0 ? (
          <View style={styles.noTimesContainer}>
            <Icon name="schedule" size={32} color={COLORS.gray} />
            <Text style={styles.noTimesText}>
              Seçilen tarihte uygun saat bulunamadı. Lütfen başka bir tarih seçin.
            </Text>
          </View>
        ) : (
          <FlatList
            data={availableTimeSlots}
            renderItem={renderTimeItem}
            keyExtractor={(item) => item}
            numColumns={4}
            contentContainerStyle={styles.timeList}
          />
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedDate || !selectedTime) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.continueButtonText}>Devam Et</Text>
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 12,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  dateList: {
    paddingVertical: 8,
  },
  dateItem: {
    width: 70,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
  },
  selectedDateItem: {
    backgroundColor: COLORS.primary,
  },
  disabledDateItem: {
    backgroundColor: '#EEEEEE',
    opacity: 0.6,
  },
  dayName: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 4,
  },
  monthName: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  selectedDateText: {
    color: 'white',
  },
  timeList: {
    paddingVertical: 8,
  },
  timeItem: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedTimeItem: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  selectedTimeText: {
    color: 'white',
  },
  timeLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  timeLoadingText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 8,
  },
  noTimesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noTimesText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontSize: 16,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: '#FFFFFF',
  }
}); 