export interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  bio: string;
  imageUrl?: string;
  portfolio: (string | number)[];
  reviews: string[];
  colorIndex: number;
  available: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  icon: string;
  description: string;
  types?: string[];
  image?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

export interface Appointment {
  id: string;
  barberId: string;
  barberName: string;
  serviceNames: string[];
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface ShopReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export function getTimeSlots(): TimeSlot[] {
  return [
    { time: '09:00', available: true, period: 'morning' },
    { time: '10:00', available: true, period: 'morning' },
    { time: '11:00', available: true, period: 'morning' },
    { time: '12:00', available: false, period: 'afternoon' },
    { time: '13:00', available: true, period: 'afternoon' },
    { time: '14:00', available: true, period: 'afternoon' },
    { time: '15:00', available: true, period: 'afternoon' },
    { time: '16:00', available: false, period: 'afternoon' },
    { time: '17:00', available: true, period: 'evening' },
    { time: '18:00', available: true, period: 'evening' },
    { time: '19:00', available: true, period: 'evening' },
  ];
}

export const shopInfo = {
  name: 'M19 Barbershop',
  address: 'ул. Авлиё-Ота, 36, Ташкент (метро Айбек)',
  phone: '+998 91 004 00 19',
  hours: 'Ежедневно 10:00–22:00',
  instagram: '@m19barbershop',
  instagramUrl: 'https://instagram.com/m19barbershop',
  telegramUrl: 'https://t.me/m19barbershop',
  email: 'info@m19barbershop.uz',
};

export function buildDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString + 'T12:00:00');
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
}

export function formatDateLong(dateString: string): string {
  const d = new Date(dateString + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

export function formatPrice(price: number): string {
  return price.toLocaleString('uz-UZ') + ' UZS';
}

export function getDayNames(): { day: string; date: string; dateNum: number; fullDate: string }[] {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      day: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: 'numeric' }),
      dateNum: d.getDate(),
      fullDate: d.toISOString().split('T')[0],
    });
  }
  return days;
}
