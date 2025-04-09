import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Review } from '../../models/reviews/types';
import StarRating from './StarRating';
import { COLORS, FONTS } from '../../constants';

interface ReviewCardProps {
  review: Review;
  isMinimal?: boolean;
  onHelpfulPress?: (reviewId: string) => void;
  onUnhelpfulPress?: (reviewId: string) => void;
  onReportPress?: (reviewId: string) => void;
  showDetailedRating?: boolean;
  showBusinessResponse?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isMinimal = false,
  onHelpfulPress,
  onUnhelpfulPress,
  onReportPress,
  showDetailedRating = false,
  showBusinessResponse = true
}) => {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(review.created_at), {
    addSuffix: true,
    locale: tr
  });

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
  };

  const isCommentLong = review.comment && review.comment.length > 150;
  const displayComment = isCommentLong && !expanded
    ? `${review.comment.substring(0, 150)}...`
    : review.comment;

  return (
    <View style={styles.container}>
      {/* Kullanıcı Bilgileri ve Tarih */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={36} color={COLORS.primary} />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>Kullanıcı</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
        
        {!isMinimal && (
          <StarRating
            rating={review.rating}
            size={16}
            editable={false}
            allowHalfStar={true}
            filledColor={COLORS.warning}
          />
        )}
      </View>

      {/* Derecelendirme ve Yorum */}
      {isMinimal ? (
        <View style={styles.minimalContent}>
          <StarRating
            rating={review.rating}
            size={16}
            editable={false}
            showValue={true}
            allowHalfStar={true}
            filledColor={COLORS.warning}
          />
          <Text style={styles.comment} numberOfLines={2} ellipsizeMode="tail">
            {review.comment}
          </Text>
        </View>
      ) : (
        <>
          {/* Yorum Metni */}
          <Text style={styles.comment}>
            {displayComment}
          </Text>
          
          {isCommentLong && (
            <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
              <Text style={styles.expandButtonText}>
                {expanded ? 'Daha az göster' : 'Devamını göster'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Fotoğraflar */}
          {review.has_photos && review.photos && review.photos.length > 0 && (
            <View style={styles.photosContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {review.photos.map((photo, index) => (
                  <TouchableOpacity
                    key={photo.id}
                    style={styles.photoThumbnail}
                    onPress={() => openImageViewer(index)}
                  >
                    <Image
                      source={{ uri: photo.photo_url }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* İş Yeri Yanıtı */}
          {showBusinessResponse && review.business_response && (
            <View style={styles.responseContainer}>
              <View style={styles.responseTitleContainer}>
                <Ionicons name="business-outline" size={16} color={COLORS.primary} />
                <Text style={styles.responseTitle}>İşletme Yanıtı</Text>
              </View>
              <Text style={styles.responseText}>{review.business_response.response}</Text>
              <Text style={styles.responseDate}>
                {formatDistanceToNow(new Date(review.business_response.created_at), {
                  addSuffix: true,
                  locale: tr
                })}
              </Text>
            </View>
          )}

          {/* İşlemler (Faydalı/Faydasız/Raporla) */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onHelpfulPress && onHelpfulPress(review.id)}
            >
              <Ionicons name="thumbs-up-outline" size={16} color={COLORS.darkGray} />
              <Text style={styles.actionText}>Faydalı ({review.helpful_count})</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onUnhelpfulPress && onUnhelpfulPress(review.id)}
            >
              <Ionicons name="thumbs-down-outline" size={16} color={COLORS.darkGray} />
              <Text style={styles.actionText}>Faydasız ({review.unhelpful_count})</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onReportPress && onReportPress(review.id)}
            >
              <Ionicons name="flag-outline" size={16} color={COLORS.darkGray} />
              <Text style={styles.actionText}>Raporla</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Fotoğraf Görüntüleyici Modal */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={closeImageViewer}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeImageViewer}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {review.photos && review.photos.length > 0 && (
            <Image
              source={{ uri: review.photos[selectedImageIndex].photo_url }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
          
          {review.photos && review.photos.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {review.photos.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 8,
  },
  userName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  date: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 2,
  },
  minimalContent: {
    flexDirection: 'column',
  },
  comment: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    lineHeight: 20,
    marginTop: 4,
  },
  expandButton: {
    marginTop: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  photosContainer: {
    marginTop: 12,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  responseContainer: {
    marginTop: 16,
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  responseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseTitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 4,
  },
  responseText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  responseDate: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});

export default ReviewCard; 