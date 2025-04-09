import api from './api';
import { 
  Review, 
  ReviewStats, 
  ReviewFilterOptions, 
  ReviewSortOptions,
  WriteReviewPayload,
  ReviewActionPayload
} from '../models/reviews/types';

const BASE_URL = '/reviews';

export const ReviewService = {
  getReviews: async (
    businessId: string,
    page: number = 1,
    limit: number = 10,
    sortOptions?: ReviewSortOptions,
    filterOptions?: ReviewFilterOptions
  ): Promise<{ reviews: Review[]; totalPages: number; totalCount: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      businessId,
      ...(sortOptions && {
        sortBy: sortOptions.field,
        sortDirection: sortOptions.direction,
      }),
      ...(filterOptions?.rating && { 
        ratings: filterOptions.rating.join(',') 
      }),
      ...(filterOptions?.hasPhotos && { 
        hasPhotos: filterOptions.hasPhotos.toString() 
      }),
      ...(filterOptions?.hasComments && { 
        hasComments: filterOptions.hasComments.toString() 
      }),
      ...(filterOptions?.keywords && { 
        keywords: filterOptions.keywords.join(',') 
      }),
    });

    const response = await api.get(`${BASE_URL}?${params}`);
    return response.data;
  },

  getStaffReviews: async (
    staffId: string,
    page: number = 1,
    limit: number = 10,
    sortOptions?: ReviewSortOptions,
    filterOptions?: ReviewFilterOptions
  ): Promise<{ reviews: Review[]; totalPages: number; totalCount: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      staffId,
      ...(sortOptions && {
        sortBy: sortOptions.field,
        sortDirection: sortOptions.direction,
      }),
      ...(filterOptions?.rating && { 
        ratings: filterOptions.rating.join(',') 
      }),
      ...(filterOptions?.hasPhotos && { 
        hasPhotos: filterOptions.hasPhotos.toString() 
      }),
      ...(filterOptions?.hasComments && { 
        hasComments: filterOptions.hasComments.toString() 
      }),
    });

    const response = await api.get(`${BASE_URL}/staff?${params}`);
    return response.data;
  },

  getReviewById: async (reviewId: string): Promise<Review> => {
    const response = await api.get(`${BASE_URL}/${reviewId}`);
    return response.data;
  },

  getReviewStats: async (businessId: string): Promise<ReviewStats> => {
    const response = await api.get(`${BASE_URL}/stats/${businessId}`);
    return response.data;
  },

  getUserReviews: async (
    page: number = 1, 
    limit: number = 10
  ): Promise<{ reviews: Review[]; totalPages: number; totalCount: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const response = await api.get(`${BASE_URL}/user?${params}`);
    return response.data;
  },

  writeReview: async (reviewData: WriteReviewPayload): Promise<Review> => {
    let formData;
    
    // Eğer fotoğraf varsa FormData kullan
    if (reviewData.photos && reviewData.photos.length > 0) {
      formData = new FormData();
      formData.append('orderId', reviewData.orderId);
      formData.append('rating', reviewData.rating.toString());
      
      if (reviewData.comment) {
        formData.append('comment', reviewData.comment);
      }
      
      reviewData.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, {
          uri: photo.uri,
          name: photo.name,
          type: photo.type,
        } as any);
      });
      
      const response = await api.post(BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      // Fotoğraf yoksa JSON data gönder
      const response = await api.post(BASE_URL, reviewData);
      return response.data;
    }
  },

  editReview: async (
    reviewId: string, 
    reviewData: Partial<WriteReviewPayload>
  ): Promise<Review> => {
    let formData;
    
    // Eğer fotoğraf varsa FormData kullan
    if (reviewData.photos && reviewData.photos.length > 0) {
      formData = new FormData();
      
      if (reviewData.rating) {
        formData.append('rating', reviewData.rating.toString());
      }
      
      if (reviewData.comment) {
        formData.append('comment', reviewData.comment);
      }
      
      reviewData.photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, {
          uri: photo.uri,
          name: photo.name,
          type: photo.type,
        } as any);
      });
      
      const response = await api.put(`${BASE_URL}/${reviewId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      // Fotoğraf yoksa JSON data gönder
      const response = await api.put(`${BASE_URL}/${reviewId}`, reviewData);
      return response.data;
    }
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${reviewId}`);
  },

  reviewAction: async (payload: ReviewActionPayload): Promise<Review> => {
    const response = await api.post(`${BASE_URL}/actions`, payload);
    return response.data;
  },

  getOrderReviewStatus: async (orderId: string): Promise<{ exists: boolean, reviewId?: string }> => {
    const response = await api.get(`${BASE_URL}/order/${orderId}/status`);
    return response.data;
  }
};

export default ReviewService; 