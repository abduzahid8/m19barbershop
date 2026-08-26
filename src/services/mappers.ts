import type {
  BarberRow,
  ServiceRow,
  AppointmentRow,
  ReviewRow,
  YandexReviewRow,
} from '../lib/database.types';
import type { Barber, Service, Appointment, ShopReview } from '../data';

export function mapBarber(row: BarberRow): Barber {
  return {
    id: row.id,
    name: row.name,
    specialty: row.specialty,
    rating: row.rating,
    reviewCount: row.review_count,
    bio: row.bio,
    imageUrl: row.image_url || undefined,
    portfolio: row.portfolio,
    reviews: [],
    colorIndex: row.color_index,
    available: row.available,
  };
}

export function mapBarbers(rows: BarberRow[]): Barber[] {
  return rows.map(mapBarber);
}

export function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    duration: row.duration,
    icon: row.icon,
    description: row.description,
    types: row.types || undefined,
  };
}

export function mapServices(rows: ServiceRow[]): Service[] {
  return rows.map(mapService);
}

export function mapAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    barberId: row.barber_id,
    barberName: row.barber_name,
    serviceNames: row.service_names,
    date: row.date,
    time: row.time,
    status: row.status,
  };
}

export function mapAppointments(rows: AppointmentRow[]): Appointment[] {
  return rows.map(mapAppointment);
}

export function mapShopReview(row: ReviewRow): ShopReview {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    date: row.date,
  };
}

export function mapShopReviews(rows: ReviewRow[]): ShopReview[] {
  return rows.map(mapShopReview);
}

export function mapYandexReview(row: YandexReviewRow): ShopReview {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    date: row.date,
    source: 'yandex',
    authorAvatarUrl: row.author_avatar_url || undefined,
    likesCount: row.likes_count,
  };
}

export function mapYandexReviews(rows: YandexReviewRow[]): ShopReview[] {
  return rows.map(mapYandexReview);
}
