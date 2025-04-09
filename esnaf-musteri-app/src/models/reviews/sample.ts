import { Review, ReviewPhoto, ReviewResponse, DetailedRating, ReviewStats } from './types';

export const sampleReviews: Review[] = [
  {
    id: '1',
    user_id: 'user-1',
    business_id: 'business-1',
    service_id: 'service-1',
    staff_id: 'staff-1',
    appointment_id: 'appointment-1',
    rating: 4.5,
    comment: 'Çok memnun kaldım, personel oldukça ilgiliydi. Fiyat performans oranı da gayet iyiydi.',
    created_at: '2023-03-15T10:30:00Z',
    is_verified: true,
    has_photos: true,
    photos: [
      {
        id: 'photo-1',
        review_id: '1',
        photo_url: 'https://via.placeholder.com/300/09f/fff.png',
        created_at: '2023-03-15T10:30:00Z',
      },
      {
        id: 'photo-2',
        review_id: '1',
        photo_url: 'https://via.placeholder.com/300/0f9/fff.png',
        created_at: '2023-03-15T10:30:00Z',
      }
    ],
    helpful_count: 12,
    unhelpful_count: 2,
    is_reported: false,
    business_response: {
      id: 'response-1',
      review_id: '1',
      business_id: 'business-1',
      user_id: 'business-owner-1',
      response: 'Değerlendirmeniz için teşekkür ederiz! Sizi tekrar görmekten mutluluk duyarız.',
      created_at: '2023-03-16T09:15:00Z',
    }
  },
  {
    id: '2',
    user_id: 'user-2',
    business_id: 'business-1',
    service_id: 'service-2',
    staff_id: 'staff-2',
    appointment_id: 'appointment-2',
    rating: 3.0,
    comment: 'Hizmet iyiydi ama beklediğim kadar etkileyici değildi. Biraz daha ilgi beklerdim.',
    created_at: '2023-03-10T14:20:00Z',
    is_verified: true,
    has_photos: false,
    helpful_count: 5,
    unhelpful_count: 1,
    is_reported: false,
  },
  {
    id: '3',
    user_id: 'user-3',
    business_id: 'business-2',
    service_id: 'service-3',
    appointment_id: 'appointment-3',
    rating: 5.0,
    comment: 'Harika bir deneyimdi! Kesinlikle tavsiye ediyorum. Personel çok profesyonel ve işinin ehli.',
    created_at: '2023-03-08T11:45:00Z',
    is_verified: true,
    has_photos: true,
    photos: [
      {
        id: 'photo-3',
        review_id: '3',
        photo_url: 'https://via.placeholder.com/300/f90/fff.png',
        created_at: '2023-03-08T11:45:00Z',
      }
    ],
    helpful_count: 24,
    unhelpful_count: 0,
    is_reported: false,
    business_response: {
      id: 'response-2',
      review_id: '3',
      business_id: 'business-2',
      user_id: 'business-owner-2',
      response: 'Güzel sözleriniz için çok teşekkür ederiz! Her zaman en iyi hizmeti sunmaya çalışıyoruz.',
      created_at: '2023-03-09T10:30:00Z',
    }
  },
  {
    id: '4',
    user_id: 'user-4',
    business_id: 'business-2',
    service_id: 'service-4',
    staff_id: 'staff-3',
    appointment_id: 'appointment-4',
    rating: 2.5,
    comment: 'Randevu saatinde gecikme yaşandı ve yeterince özür dilenmedi. Hizmet kalitesi ortalama.',
    created_at: '2023-03-05T16:10:00Z',
    is_verified: true,
    has_photos: false,
    helpful_count: 8,
    unhelpful_count: 3,
    is_reported: true,
  },
  {
    id: '5',
    user_id: 'user-5',
    business_id: 'business-3',
    service_id: 'service-5',
    staff_id: 'staff-4',
    appointment_id: 'appointment-5',
    rating: 4.0,
    comment: 'Temiz ve ferah bir ortam. Çalışanlar samimi ve yardımsever. Fiyatlar biraz yüksek ama kaliteli hizmet alıyorsunuz.',
    created_at: '2023-03-01T13:25:00Z',
    is_verified: true,
    has_photos: false,
    helpful_count: 15,
    unhelpful_count: 1,
    is_reported: false,
  }
];

export const sampleDetailedRatings: DetailedRating[] = [
  {
    id: 'detail-1',
    review_id: '1',
    service_quality: 4.5,
    employee_attitude: 5.0,
    value_for_money: 4.0,
    cleanliness: 4.5,
    overall: 4.5
  },
  {
    id: 'detail-2',
    review_id: '2',
    service_quality: 3.0,
    employee_attitude: 2.5,
    value_for_money: 3.5,
    cleanliness: 4.0,
    overall: 3.0
  },
  {
    id: 'detail-3',
    review_id: '3',
    service_quality: 5.0,
    employee_attitude: 5.0,
    value_for_money: 5.0,
    cleanliness: 5.0,
    overall: 5.0
  },
  {
    id: 'detail-4',
    review_id: '4',
    service_quality: 3.0,
    employee_attitude: 2.0,
    value_for_money: 2.5,
    cleanliness: 3.0,
    overall: 2.5
  },
  {
    id: 'detail-5',
    review_id: '5',
    service_quality: 4.0,
    employee_attitude: 4.5,
    value_for_money: 3.5,
    cleanliness: 4.0,
    overall: 4.0
  }
];

export const sampleBusinessReviewStats: ReviewStats[] = [
  {
    business_id: 'business-1',
    total_reviews: 25,
    average_rating: 4.2,
    rating_distribution: {
      one_star: 1,
      two_star: 2,
      three_star: 5,
      four_star: 10,
      five_star: 7
    },
    detailed_ratings: {
      service_quality: 4.3,
      employee_attitude: 4.5,
      value_for_money: 3.9,
      cleanliness: 4.1
    }
  },
  {
    business_id: 'business-2',
    total_reviews: 18,
    average_rating: 3.8,
    rating_distribution: {
      one_star: 2,
      two_star: 1,
      three_star: 3,
      four_star: 8,
      five_star: 4
    },
    detailed_ratings: {
      service_quality: 3.9,
      employee_attitude: 3.7,
      value_for_money: 3.6,
      cleanliness: 4.0
    }
  },
  {
    business_id: 'business-3',
    total_reviews: 32,
    average_rating: 4.6,
    rating_distribution: {
      one_star: 0,
      two_star: 1,
      three_star: 2,
      four_star: 8,
      five_star: 21
    },
    detailed_ratings: {
      service_quality: 4.7,
      employee_attitude: 4.8,
      value_for_money: 4.2,
      cleanliness: 4.7
    }
  }
]; 