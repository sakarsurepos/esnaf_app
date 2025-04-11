import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Campaign } from '../../models/campaigns/types';
import { sampleCampaigns } from '../../models/campaigns/sample';
import { Colors } from '../../constants/Colors';
import { formatDateLong, daysBetween } from '../../utils/dateUtils';

type RouteParams = {
  CampaignDetail: {
    campaignId: string;
  };
};

const CampaignDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'CampaignDetail'>>();
  const { campaignId } = route.params;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);

  useEffect(() => {
    // API entegrasyonu olduğunda burası gerçek veri çekme işlemlerini yapacak
    const loadCampaignDetail = async () => {
      try {
        // Simüle edilmiş API çağrısı gecikmesi
        setTimeout(() => {
          const foundCampaign = sampleCampaigns.find(
            (c) => c.id === campaignId
          );
          
          if (foundCampaign) {
            setCampaign(foundCampaign);
          }
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Kampanya detayları yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    loadCampaignDetail();
  }, [campaignId]);

  const handleShare = async () => {
    if (!campaign) return;

    try {
      await Share.share({
        message: `${campaign.title} - ${campaign.description} Kampanya Kodu: ${campaign.discountCode || 'Kod Bulunmuyor'}`,
        title: campaign.title,
      });
    } catch (error) {
      Alert.alert('Paylaşım Hatası', 'Kampanya paylaşılırken bir hata oluştu.');
    }
  };

  const handleCopyCode = () => {
    if (!campaign?.discountCode) return;
    
    // Gerçek uygulamada burada kod kopyalanacak
    // Clipboard.setString(campaign.discountCode);
    
    setIsCodeCopied(true);
    setTimeout(() => setIsCodeCopied(false), 2000);
    Alert.alert('Kod Kopyalandı', `${campaign.discountCode} kodunu kullanabilirsiniz.`);
  };

  const getRemainingDays = () => {
    if (!campaign) return 0;
    
    const today = new Date().toISOString();
    return daysBetween(today, campaign.endDate);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={Colors.danger} />
        <Text style={styles.errorText}>Kampanya bulunamadı</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isActive = campaign.status === 'active';
  const isExpired = campaign.status === 'expired';
  const remainingDays = getRemainingDays();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: campaign.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          
          <TouchableOpacity
            style={styles.backArrow}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={24} color={Colors.white} />
          </TouchableOpacity>

          {campaign.isFeatured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Öne Çıkan</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>{campaign.title}</Text>
            
            <View
              style={[
                styles.statusBadge,
                isActive
                  ? styles.activeBadge
                  : isExpired
                  ? styles.expiredBadge
                  : styles.upcomingBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {isActive
                  ? 'Aktif'
                  : isExpired
                  ? 'Sona Erdi'
                  : 'Yakında'}
              </Text>
            </View>
          </View>

          <View style={styles.dateSection}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <Text style={styles.dateText}>
              {formatDateLong(campaign.startDate)} - {formatDateLong(campaign.endDate)}
            </Text>
          </View>

          {isActive && (
            <View style={styles.remainingSection}>
              <Text style={styles.remainingText}>
                Kampanyanın bitmesine {remainingDays} gün kaldı
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${100 - (remainingDays / 30) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}

          <Text style={styles.description}>{campaign.description}</Text>

          {campaign.discountRate && (
            <View style={styles.discountSection}>
              <Text style={styles.discountLabel}>İndirim Oranı:</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>%{campaign.discountRate}</Text>
              </View>
            </View>
          )}

          {campaign.discountCode && (
            <View style={styles.codeSection}>
              <Text style={styles.codeLabel}>Kampanya Kodu:</Text>
              <TouchableOpacity
                style={styles.codeContainer}
                onPress={handleCopyCode}
                activeOpacity={0.7}
              >
                <Text style={styles.codeText}>{campaign.discountCode}</Text>
                <Ionicons
                  name={isCodeCopied ? "checkmark" : "copy-outline"}
                  size={20}
                  color={isCodeCopied ? Colors.success : Colors.primary}
                />
              </TouchableOpacity>
              <Text style={styles.codeTip}>
                Kodu kopyalamak için dokunun
              </Text>
            </View>
          )}

          {campaign.minPurchaseAmount && (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color={Colors.darkGrey} />
              <Text style={styles.infoText}>
                Minimum sipariş tutarı: {campaign.minPurchaseAmount} TL
              </Text>
            </View>
          )}

          {campaign.termsAndConditions && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Kampanya Koşulları</Text>
              <Text style={styles.termsText}>
                {campaign.termsAndConditions}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {isActive && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Kampanyayı Kullan</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
  },
  backArrow: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  featuredBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  featuredText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: Colors.success,
  },
  expiredBadge: {
    backgroundColor: Colors.danger,
  },
  upcomingBadge: {
    backgroundColor: Colors.warning,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.darkGrey,
  },
  remainingSection: {
    marginBottom: 16,
  },
  remainingText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.lightGrey,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
    marginBottom: 20,
  },
  discountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountLabel: {
    fontSize: 16,
    color: Colors.text,
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  discountText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  codeSection: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGrey,
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  codeTip: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: Colors.darkGrey,
    marginLeft: 8,
  },
  termsSection: {
    marginTop: 10,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.darkGrey,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CampaignDetailScreen; 