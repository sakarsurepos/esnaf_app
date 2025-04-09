export interface User {
  id: string;
  name: string;
  avatar?: string;
  isProfessional?: boolean;
  badgeCount?: number;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface Review {
  id: string;
  user: User;
  rating: number;
  comment?: string;
  date: string; // ISO 8601 format
  photos?: Photo[];
  helpfulCount: number;
  unhelpfulCount: number;
  isHelpful?: boolean;
  isUnhelpful?: boolean;
  isReported?: boolean;
  orderInfo?: {
    id: string;
    service: string;
    date: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalCount: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  withPhotos: number;
  withComments: number;
}

export interface ReviewFilterOptions {
  rating?: number[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  hasPhotos?: boolean;
  hasComments?: boolean;
  keywords?: string[];
}

export interface ReviewSortOptions {
  field: 'date' | 'rating' | 'helpfulCount';
  direction: 'asc' | 'desc';
}

export interface WriteReviewPayload {
  orderId: string;
  rating: number;
  comment?: string;
  photos?: {
    uri: string;
    name: string;
    type: string;
  }[];
}

export interface ReviewActionPayload {
  reviewId: string;
  action: 'helpful' | 'unhelpful' | 'report';
  value: boolean;
}

export interface ReviewPhoto {
  id: string;
  review_id: string;
  photo_url: string;
  created_at: string;
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  business_id: string;
  user_id: string; // İş yeri sahibi veya çalışanı
  response: string;
  created_at: string;
  updated_at?: string;
}

export interface DetailedRating {
  id: string;
  review_id: string;
  service_quality: number;
  employee_attitude: number;
  value_for_money: number;
  cleanliness: number;
  overall: number; // Ortalama puan
}

export interface ReviewStats {
  business_id: string;
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    one_star: number;
    two_star: number;
    three_star: number;
    four_star: number;
    five_star: number;
  };
  detailed_ratings: {
    service_quality: number;
    employee_attitude: number;
    value_for_money: number;
    cleanliness: number;
  };
} 