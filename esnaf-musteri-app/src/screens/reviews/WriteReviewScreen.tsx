import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS } from '../../constants';
import StarRating from '../../components/reviews/StarRating';
import ReviewService from '../../services/ReviewService';
import { WriteReviewPayload } from '../../models/reviews/types';

type WriteReviewScreenProps = StackScreenProps<any, 'WriteReview'>;

const WriteReviewScreen: React.FC<WriteReviewScreenProps> = ({ route, navigation }) => {
  const { orderId, businessName } = route.params;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<Array<{uri: string, name: string, type: string}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasReview, setHasReview] = useState(false);
  const [reviewId, setReviewId] = useState<string | undefined>(undefined);

  // Daha önce değerlendirme yapılmış mı kontrol et
  useEffect(() => {
    const checkOrderReviewStatus = async () => {
      try {
        const response = await ReviewService.getOrderReviewStatus(orderId);
        setHasReview(response.exists);
        setReviewId(response.reviewId);
        setIsLoading(false);
      } catch (error) {
        console.error("Değerlendirme durumu kontrol edilirken hata:", error);
        setIsLoading(false);
      }
    };

    checkOrderReviewStatus();
  }, [orderId]);

  // Değerlendirme puanı değişikliği
  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  // Yorum değişikliği
  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  // Fotoğraf ekle
  const handleAddPhoto = async () => {
    if (photos.length >= 5) {
      Alert.alert("Uyarı", "En fazla 5 fotoğraf ekleyebilirsiniz.");
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Fotoğraf eklemek için galerinize erişim izni vermeniz gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = asset.uri.split('/').pop() || 'photo.jpg';
      const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
      
      const photo = {
        uri: asset.uri,
        name: fileName,
        type: `image/${fileExt}`,
      };
      
      setPhotos([...photos, photo]);
    }
  };

  // Fotoğraf sil
  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  // Değerlendirme gönder
  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("Hata", "Lütfen bir puan seçin.");
      return;
    }

    if (comment.trim() !== '' && comment.length < 10) {
      Alert.alert("Hata", "Yorum en az 10 karakter olmalıdır.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const reviewData: WriteReviewPayload = {
        orderId,
        rating,
        comment: comment.trim() !== '' ? comment : undefined,
        photos: photos.length > 0 ? photos : undefined
      };

      if (hasReview && reviewId) {
        // Değerlendirmeyi güncelle
        await ReviewService.editReview(reviewId, reviewData);
        Alert.alert("Başarılı", "Değerlendirmeniz başarıyla güncellendi.", [
          { text: "Tamam", onPress: () => navigation.goBack() }
        ]);
      } else {
        // Yeni değerlendirme ekle
        await ReviewService.writeReview(reviewData);
        Alert.alert("Başarılı", "Değerlendirmeniz başarıyla gönderildi.", [
          { text: "Tamam", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error("Değerlendirme gönderilirken hata:", error);
      Alert.alert("Hata", "Değerlendirmeniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
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
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Değerlendirme Yaz</Text>
          <View style={styles.placeholderIcon} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Değerlendirme durumu kontrol ediliyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {hasReview ? 'Değerlendirmeyi Düzenle' : 'Değerlendirme Yaz'}
        </Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{businessName}</Text>
            <Text style={styles.orderIdText}>Sipariş No: {orderId}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.sectionTitle}>Puanınız</Text>
            <View style={styles.starContainer}>
              <StarRating
                rating={rating}
                maxRating={5}
                size={36}
                editable={true}
                onRatingChange={handleRatingChange}
                allowHalfStar={false}
                showValue={true}
              />
            </View>
          </View>
          
          <View style={styles.commentContainer}>
            <Text style={styles.sectionTitle}>Yorumunuz</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Deneyiminizi paylaşın (isteğe bağlı)"
              placeholderTextColor={COLORS.lightGray}
              multiline={true}
              maxLength={500}
              value={comment}
              onChangeText={handleCommentChange}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>
          
          <View style={styles.photosContainer}>
            <Text style={styles.sectionTitle}>Fotoğraflar (İsteğe Bağlı)</Text>
            <Text style={styles.photosSubtitle}>En fazla 5 fotoğraf ekleyebilirsiniz</Text>
            
            <View style={styles.photoList}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {photos.length < 5 && (
                <TouchableOpacity 
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                >
                  <Ionicons name="add" size={32} color={COLORS.gray} />
                  <Text style={styles.addPhotoText}>Fotoğraf Ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || rating === 0) && styles.disabledButton
            ]}
            onPress={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {hasReview ? 'Değerlendirmeyi Güncelle' : 'Değerlendirmeyi Gönder'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 16,
  },
  businessInfo: {
    marginBottom: 20,
  },
  businessName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.black,
    marginBottom: 12,
  },
  starContainer: {
    alignItems: 'center',
  },
  commentContainer: {
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    maxHeight: 200,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    textAlign: 'right',
    marginTop: 4,
  },
  photosContainer: {
    marginBottom: 20,
  },
  photosSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginBottom: 12,
  },
  photoList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  photoItem: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 4,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
});

export default WriteReviewScreen; 