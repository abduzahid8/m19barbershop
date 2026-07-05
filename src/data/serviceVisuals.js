export const CATEGORIES = [
  { key: 'all',    label: 'Все',      icon: 'grid',     grad: ['#0b1d3a', '#1a3d7a'] },
  { key: 'hair',   label: 'Стрижки',  icon: 'scissors', grad: ['#102852', '#1a3d7a'] },
  { key: 'beard',  label: 'Борода',   icon: 'moon',     grad: ['#5b21b6', '#8b5cf6'] },
  { key: 'combo',  label: 'Комбо',    icon: 'layers',   grad: ['#c2410c', '#f97316'] },
  { key: 'shave',  label: 'Бритьё',   icon: 'zap',      grad: ['#b91c1c', '#ef4444'] },
  { key: 'style',  label: 'Укладка',  icon: 'feather',  grad: ['#0369a1', '#06b6d4'] },
];

export const HERO_IMAGES = {
  default: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=900&q=85',
  category: {
    hair: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=900&q=85',
    beard: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=85',
    combo: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=900&q=85',
    shave: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=85',
    style: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=85',
  },
};

export const SERVICE_PHOTOS = {
  '1': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=85',
  '2': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=85',
  '3': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=85',
  '4': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=85',
  '5': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=85',
  '6': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=85',
  '7': 'https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b8?w=600&q=85',
  '8': 'https://images.unsplash.com/photo-1598524374912-bf880ee0c45d?w=600&q=85',
};

const DURATION_COLORS = {
  short: '#4ade80',
  mid: '#facc15',
  long: '#f97316',
};

export function getDurationColor(duration) {
  if (duration <= 25) return DURATION_COLORS.short;
  if (duration <= 50) return DURATION_COLORS.mid;
  return DURATION_COLORS.long;
}

export function getCategoryConfig(key) {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[0];
}

export const MOOD_CHIPS = [
  { key: 'all', label: 'Все', icon: 'grid' },
  { key: 'fast', label: 'Быстро', icon: 'zap' },
  { key: 'premium', label: 'Премиум', icon: 'award' },
  { key: 'popular', label: 'Популярное', icon: 'star' },
];

export function getServiceMoods(service) {
  const moods = [];
  if (service.duration <= 30) moods.push('fast');
  if (service.price >= 100000) moods.push('premium');
  if (service.popular) moods.push('popular');
  return moods;
}

export function filterByMood(services, moodKey) {
  if (moodKey === 'all') return services;
  return services.filter(s => getServiceMoods(s).includes(moodKey));
}
