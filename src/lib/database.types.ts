export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'created_at'>;
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at'>>;
      };
      barbers: {
        Row: BarberRow;
        Insert: Omit<BarberRow, 'id' | 'created_at'>;
        Update: Partial<Omit<BarberRow, 'id' | 'created_at'>>;
      };
      services: {
        Row: ServiceRow;
        Insert: Omit<ServiceRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ServiceRow, 'id' | 'created_at'>>;
      };
      appointments: {
        Row: AppointmentRow;
        Insert: Omit<AppointmentRow, 'id' | 'created_at'>;
        Update: Partial<Omit<AppointmentRow, 'id' | 'created_at'>>;
      };
      reviews: {
        Row: ReviewRow;
        Insert: Omit<ReviewRow, 'id' | 'created_at'>;
        Update: Partial<Omit<ReviewRow, 'id' | 'created_at'>>;
      };
      loyalty_points: {
        Row: LoyaltyRow;
        Insert: Omit<LoyaltyRow, 'id' | 'created_at'>;
        Update: Partial<Omit<LoyaltyRow, 'id' | 'created_at'>>;
      };
      time_slots: {
        Row: TimeSlotRow;
        Insert: Omit<TimeSlotRow, 'id'>;
        Update: Partial<Omit<TimeSlotRow, 'id'>>;
      };
      yandex_reviews: {
        Row: YandexReviewRow;
        Insert: Omit<YandexReviewRow, 'id' | 'created_at'>;
        Update: Partial<Omit<YandexReviewRow, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface ProfileRow {
  id: string;
  phone: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface BarberRow {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  review_count: number;
  bio: string;
  image_url: string | null;
  portfolio: string[];
  color_index: number;
  available: boolean;
  created_at: string;
}

export interface ServiceRow {
  id: string;
  name: string;
  price: number;
  duration: number;
  icon: string;
  description: string;
  types: string[] | null;
  created_at: string;
}

export interface AppointmentRow {
  id: string;
  user_id: string;
  barber_id: string;
  barber_name: string;
  service_names: string[];
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ReviewRow {
  id: string;
  user_id: string | null;
  author: string;
  rating: number;
  text: string;
  date: string;
  created_at: string;
}

export interface LoyaltyRow {
  id: string;
  user_id: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  total_visits: number;
  created_at: string;
}

export interface TimeSlotRow {
  id: string;
  barber_id: string | null;
  time: string;
  date: string;
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

export interface YandexReviewRow {
  id: string;
  yandex_id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  author_avatar_url: string | null;
  likes_count: number;
  owner_reply: string | null;
  owner_reply_date: string | null;
  created_at: string;
}
