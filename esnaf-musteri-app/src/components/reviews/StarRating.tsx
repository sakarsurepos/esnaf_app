import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  showValue?: boolean;
  onRatingChange?: (rating: number) => void;
  containerStyle?: object;
  starStyle?: object;
  filledColor?: string;
  emptyColor?: string;
  allowHalfStar?: boolean;
  label?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  maxRating = 5,
  size = 20,
  editable = false,
  showValue = false,
  onRatingChange,
  containerStyle,
  starStyle,
  filledColor = COLORS.warning,
  emptyColor = "#CCCCCC",
  allowHalfStar = true,
  label
}) => {
  const [activeRating, setActiveRating] = useState(rating);

  const handleStarPress = (selectedRating: number) => {
    if (!editable) return;
    
    setActiveRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = editable ? activeRating : rating;
    
    for (let i = 1; i <= maxRating; i++) {
      let iconName: string;
      
      if (i <= Math.floor(currentRating)) {
        iconName = 'star';
      } else if (allowHalfStar && i === Math.ceil(currentRating) && !Number.isInteger(currentRating)) {
        iconName = 'star-half';
      } else {
        iconName = 'star-outline';
      }
      
      const starColor = i <= currentRating ? filledColor : emptyColor;
      
      stars.push(
        <TouchableOpacity
          key={i}
          style={[styles.starContainer, starStyle]}
          onPress={() => handleStarPress(i)}
          disabled={!editable}
          activeOpacity={editable ? 0.7 : 1}
        >
          <Ionicons
            name={iconName}
            size={size}
            color={starColor}
          />
        </TouchableOpacity>
      );
    }
    
    return stars;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.starRow}>
        {renderStars()}
        {showValue && (
          <Text style={styles.ratingValue}>
            {editable ? activeRating : rating}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.darkGray,
    marginBottom: 5
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starContainer: {
    marginRight: 2
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.black
  }
});

export default StarRating; 