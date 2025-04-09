import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Review } from '../../models/reviews/types';
import ReviewCard from './ReviewCard';
import { COLORS, FONTS } from '../../constants';

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: string;
  showSorting?: boolean;
  showFilters?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
  filterMode?: string;
  onFilterChange?: (filter: string) => void;
  sortMode?: string;
  onSortChange?: (sort: string) => void;
  isMinimal?: boolean;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  isLoading = false,
  error,
  showSorting = true,
  showFilters = true,
  onRefresh,
  refreshing = false,
  onLoadMore,
  hasMoreData = false,
  filterMode = 'all',
  onFilterChange,
  sortMode = 'newest',
  onSortChange,
  isMinimal = false,
}) => {
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
    if (isFilterMenuOpen) setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
    if (isSortMenuOpen) setIsSortMenuOpen(false);
  };

  const handleSortChange = (sort: string) => {
    if (onSortChange) onSortChange(sort);
    setIsSortMenuOpen(false);
  };

  const handleFilterChange = (filter: string) => {
    if (onFilterChange) onFilterChange(filter);
    setIsFilterMenuOpen(false);
  };

  const renderSortItem = (name: string, value: string) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        sortMode === value && styles.activeMenuItem
      ]}
      onPress={() => handleSortChange(value)}
    >
      <Text style={[
        styles.menuItemText,
        sortMode === value && styles.activeMenuItemText
      ]}>
        {name}
      </Text>
      {sortMode === value && (
        <Ionicons name="checkmark" size={18} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  const renderFilterItem = (name: string, value: string) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        filterMode === value && styles.activeMenuItem
      ]}
      onPress={() => handleFilterChange(value)}
    >
      <Text style={[
        styles.menuItemText,
        filterMode === value && styles.activeMenuItemText
      ]}>
        {name}
      </Text>
      {filterMode === value && (
        <Ionicons name="checkmark" size={18} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  if (isLoading && reviews.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Değerlendirmeler yükleniyor...</Text>
      </View>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>{error}</Text>
        {onRefresh && (
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="chatbubble-outline" size={48} color={COLORS.gray} />
        <Text style={styles.emptyText}>Henüz değerlendirme yok</Text>
        <Text style={styles.emptySubText}>İlk değerlendirmeyi siz yapın</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {(showSorting || showFilters) && !isMinimal && (
        <View style={styles.optionsContainer}>
          {showSorting && (
            <View style={styles.sortContainer}>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={toggleSortMenu}
              >
                <Ionicons name="swap-vertical-outline" size={16} color={COLORS.black} />
                <Text style={styles.sortButtonText}>
                  {sortMode === 'newest' ? 'En Yeni' :
                    sortMode === 'oldest' ? 'En Eski' :
                    sortMode === 'highest' ? 'En Yüksek Puan' :
                    'En Düşük Puan'}
                </Text>
                <Ionicons
                  name={isSortMenuOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={COLORS.black}
                />
              </TouchableOpacity>

              {isSortMenuOpen && (
                <View style={styles.menu}>
                  {renderSortItem('En Yeni', 'newest')}
                  {renderSortItem('En Eski', 'oldest')}
                  {renderSortItem('En Yüksek Puan', 'highest')}
                  {renderSortItem('En Düşük Puan', 'lowest')}
                </View>
              )}
            </View>
          )}

          {showFilters && (
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={toggleFilterMenu}
              >
                <Ionicons name="filter-outline" size={16} color={COLORS.black} />
                <Text style={styles.filterButtonText}>
                  {filterMode === 'all' ? 'Tümü' :
                    filterMode === 'highRated' ? '4+ Yıldız' :
                    filterMode === 'lowRated' ? '3- Yıldız' :
                    filterMode === 'withPhotos' ? 'Fotoğraflı' :
                    filterMode === 'withComments' ? 'Yorumlu' : 'Filtrele'}
                </Text>
                <Ionicons
                  name={isFilterMenuOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={COLORS.black}
                />
              </TouchableOpacity>

              {isFilterMenuOpen && (
                <View style={styles.menu}>
                  {renderFilterItem('Tümü', 'all')}
                  {renderFilterItem('4+ Yıldız', 'highRated')}
                  {renderFilterItem('3- Yıldız', 'lowRated')}
                  {renderFilterItem('Fotoğraflı', 'withPhotos')}
                  {renderFilterItem('Yorumlu', 'withComments')}
                </View>
              )}
            </View>
          )}
        </View>
      )}

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            isMinimal={isMinimal}
            onHelpfulPress={() => {}}
            onUnhelpfulPress={() => {}}
            onReportPress={() => {}}
          />
        )}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          hasMoreData && (
            <View style={styles.listFooter}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadMoreText}>Daha fazla yükleniyor...</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.danger,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.gray,
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sortContainer: {
    position: 'relative',
    flex: 1,
    marginRight: 8,
  },
  filterContainer: {
    position: 'relative',
    flex: 1,
    marginLeft: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  sortButtonText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginHorizontal: 6,
  },
  filterButtonText: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginHorizontal: 6,
  },
  menu: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  activeMenuItem: {
    backgroundColor: '#F0F8FF',
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.black,
  },
  activeMenuItemText: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadMoreText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
});

export default ReviewsList; 