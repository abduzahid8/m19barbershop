export interface ShopReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  bio: string;
  imageUrl?: string;
  portfolio: string[];
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

export const barbers: Barber[] = [
  {
    id: 'b1', name: 'Rustam', specialty: 'Top Barber', rating: 4.95, reviewCount: 410,
    bio: '16 лет опыта. Работал в легендарном TopGun (Москва). Мастер классических стрижек и премиального обслуживания.',
    imageUrl: 'https://assets.alteg.io/masters/origin/4/40/409ab786af699dd_20250312234003.png',
    portfolio: [], reviews: ['Лучший мастер в Ташкенте!', 'Очень профессиональный подход', 'Всегда идеальный результат'],
    colorIndex: 0, available: true,
  },
  {
    id: 'b2', name: 'Avaz', specialty: 'Barber', rating: 4.97, reviewCount: 284,
    bio: 'Более 20 лет в профессии. Специализируется на стрижках, бороде и массаже головы и плеч.',
    imageUrl: 'https://assets.alteg.io/masters/origin/5/5d/5db03430d7116bc_20260515001115.png',
    portfolio: [], reviews: ['Золотые руки!', 'Лучшая стрижка бороды', 'Очень внимательный мастер'],
    colorIndex: 1, available: true,
  },
  {
    id: 'b3', name: 'Zeyid', specialty: 'Premium Barber', rating: 5.0, reviewCount: 98,
    bio: 'Основатель M19 Barbershop. 15 лет опыта. Стилист, актёр и модель. Специализация: классические стрижки, окрашивание, чистка лица.',
    imageUrl: 'https://assets.alteg.io/masters/origin/5/5f/5fbc15e0a784240_20250118000631.png',
    portfolio: [], reviews: ['Мастер высшего уровня', 'Настоящий профессионал', 'Основатель с большой душой'],
    colorIndex: 2, available: false,
  },
  {
    id: 'b4', name: 'Sherzod', specialty: 'Barber', rating: 4.97, reviewCount: 117,
    bio: 'Барбер с более чем 6-летним опытом. Стиль — идеальный fade, точные линии и чистые переходы.',
    imageUrl: 'https://assets.alteg.io/masters/origin/c/cd/cd4069c2b9b52c7_20260315042133.png',
    portfolio: [], reviews: ['Идеальный fade', 'Точность и аккуратность', 'Лучший в своём деле'],
    colorIndex: 3, available: true,
  },
  {
    id: 'b5', name: 'OTTO', specialty: 'Barber', rating: 4.93, reviewCount: 57,
    bio: 'В профессии с 2011 года. Разработал авторскую технику стрижки Black Work.',
    imageUrl: 'https://assets.alteg.io/masters/origin/9/9d/9dd2ce994f1ac3a_20250720032724.png',
    portfolio: [], reviews: ['Уникальный стиль', 'Black Work — это шедевр', 'Мастер с авторским подходом'],
    colorIndex: 0, available: true,
  },
  {
    id: 'b6', name: 'Shod', specialty: 'Top Barber', rating: 4.97, reviewCount: 222,
    bio: '16 лет стажа. Специализируется на классическом стиле. Делает расслабляющий массаж в конце стрижки.',
    imageUrl: 'https://assets.alteg.io/masters/origin/e/ee/ee206c6bc56584f_20260315042224.png',
    portfolio: [], reviews: ['Классика на высшем уровне', 'Лучший массаж после стрижки', 'Очень приятная атмосфера'],
    colorIndex: 1, available: true,
  },
];

export const services: Service[] = [
  { id: 's1', name: 'Haircut', price: 80000, duration: 45, icon: 'scissors', description: 'Precision cut tailored to your style' },
  { id: 's2', name: 'Beard Trim', price: 50000, duration: 30, icon: 'minus', description: 'Shape, trim, and hot towel finish' },
  { id: 's3', name: 'Haircut + Beard', price: 120000, duration: 60, icon: 'check-square', description: 'Full grooming package' },
  { id: 's4', name: 'Hair Wash', price: 30000, duration: 15, icon: 'droplet', description: 'Refresh with premium products' },
  { id: 's5', name: 'Kids Haircut', price: 60000, duration: 30, icon: 'smile', description: 'Patient care for young clients' },
  { id: 's6', name: 'Royal Shave', price: 70000, duration: 40, icon: 'star', description: 'Traditional hot towel straight razor shave' },
];

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

export const seedAppointments: Appointment[] = [
  {
    id: 'a1', barberId: 'b1', barberName: 'Rustam',
    serviceNames: ['Haircut', 'Beard Trim'],
    date: buildDate(5), time: '14:00', status: 'upcoming',
  },
  {
    id: 'a2', barberId: 'b4', barberName: 'Sherzod',
    serviceNames: ['Haircut'],
    date: buildDate(-14), time: '11:00', status: 'completed',
  },
  {
    id: 'a3', barberId: 'b2', barberName: 'Avaz',
    serviceNames: ['Royal Shave'],
    date: buildDate(-30), time: '16:00', status: 'completed',
  },
];

export const seedShopReviews: ShopReview[] = [
  {
    id: 'sr1', author: 'Alex', rating: 5,
    text: 'Лучший барбершоп в Ташкенте! Отличная атмосфера и профессиональные мастера.',
    date: '2026-06-15',
  },
  {
    id: 'sr2', author: 'Dmitry', rating: 5,
    text: 'Всегда отличное качество. Рекомендую всем!',
    date: '2026-06-10',
  },
  {
    id: 'sr3', author: 'Jahongir', rating: 4,
    text: 'Хороший сервис, приятная обстановка. Немного дороговато, но качество того стоит.',
    date: '2026-05-28',
  },
];

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
