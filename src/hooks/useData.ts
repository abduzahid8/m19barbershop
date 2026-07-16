import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import type { Barber, Service } from '../data';

const shouldHide = (b: Barber) => {
  const n = b.name.toLowerCase();
  const s = b.specialty.toLowerCase();
  if (n.includes('shakhnoza') || n.includes('шахноза') || n.includes('shahnoza') || n.includes('shaxnoza')) return true;
  if (s.includes('ресепшн') || s.includes('reception') || s.includes('администратор') || s.includes('admin')) return true;
  return false;
};

const fallbackBarbers: Barber[] = [
  { id: 'fb-barber-1', name: 'Zeyid', specialty: 'Premium Barber', rating: 5.0, reviewCount: 98, bio: 'Основатель M19 Barbershop. Premium Barber с 15-летним опытом.', imageUrl: require('../../assets/barbers/zeyid.png'), portfolio: [], reviews: [], colorIndex: 0, available: true },
  { id: 'fb-barber-2', name: 'Avaz', specialty: 'Barber', rating: 4.97, reviewCount: 285, bio: 'Барбер из Ташкента с опытом более 20 лет.', imageUrl: require('../../assets/barbers/avaz.png'), portfolio: [], reviews: [], colorIndex: 1, available: true },
  { id: 'fb-barber-3', name: 'Sherzod', specialty: 'Barber', rating: 4.97, reviewCount: 117, bio: 'Барбер с более чем 6-летним опытом.', imageUrl: require('../../assets/barbers/sherzod.png'), portfolio: [], reviews: [], colorIndex: 2, available: true },
  { id: 'fb-barber-4', name: 'Shod', specialty: 'Топ Барбер', rating: 4.97, reviewCount: 222, bio: 'Мастер классического стиля с 16-летним стажем.', imageUrl: require('../../assets/barbers/shod.png'), portfolio: [], reviews: [], colorIndex: 3, available: true },
  { id: 'fb-barber-5', name: 'Rustam', specialty: 'Топ Барбер', rating: 4.95, reviewCount: 410, bio: 'Профессиональный барбер с 16-летним опытом.', imageUrl: require('../../assets/barbers/rustam.png'), portfolio: [], reviews: [], colorIndex: 4, available: true },
  { id: 'fb-barber-6', name: 'OTTO', specialty: 'Барбер', rating: 4.93, reviewCount: 57, bio: 'В профессии с 2011 года.', imageUrl: require('../../assets/barbers/otto.png'), portfolio: [], reviews: [], colorIndex: 5, available: true },
];

let eagerFetchPromise: Promise<Barber[]> | null = null;

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '');

function cleanBarber(b: Barber): Barber {
  return { ...b, name: stripHtml(b.name), specialty: stripHtml(b.specialty), bio: stripHtml(b.bio) };
}

function serviceImage(name: string): number | undefined {
  const n = name.toLowerCase();
  if (n.includes('premium') || n.includes('vip') || n.includes('private')) return require('../../assets/services/premium.png');
  if (n.includes('стрижка') && n.includes('бород')) return require('../../assets/services/haircut-beard.png');
  if (n.includes('стрижк')) return require('../../assets/services/haircut.png');
  if (n.includes('бород')) return require('../../assets/services/beard-trim.png');
  if (n.includes('мыть') || n.includes('wash')) return require('../../assets/services/hair-wash.png');
  if (n.includes('детск') || n.includes('kids')) return require('../../assets/services/kids-haircut.png');
  if (n.includes('бре') || n.includes('shave') || n.includes('royal')) return require('../../assets/services/royal-shave.png');
  return undefined;
}

function cleanService(s: Service): Service {
  return { ...s, description: stripHtml(s.description), image: s.image || serviceImage(s.name) };
}

async function performFetch(): Promise<Barber[]> {
  const result = await api.getBarbers();
  if (result.error || !result.data || result.data.length === 0) {
    return fallbackBarbers;
  }
  return result.data.filter((b) => !shouldHide(b)).map(cleanBarber);
}

function startEagerFetch(): Promise<Barber[]> {
  if (!eagerFetchPromise) {
    eagerFetchPromise = performFetch();
  }
  return eagerFetchPromise;
}

const eagerBarbers = startEagerFetch();

const fallbackServices: Service[] = [
  { id: 'fb-haircut', name: 'Стрижка', price: 80000, duration: 45, icon: 'scissors', description: 'Точная стрижка под ваш стиль', types: ['Classic Fade', 'Textured Crop', 'Pompadour', 'Buzz Cut'], image: require('../../assets/services/haircut.png') },
  { id: 'fb-beard', name: 'Коррекция бороды', price: 50000, duration: 30, icon: 'minus', description: 'Форма, тримминг и горячее полотенце', types: ['Full Beard', 'Stubble', 'Goatee', 'Clean Shave'], image: require('../../assets/services/beard-trim.png') },
  { id: 'fb-haircut-beard', name: 'Стрижка + Борода', price: 120000, duration: 60, icon: 'check-square', description: 'Полный уход', types: ['Fade & Beard', 'Crop & Stubble', 'Classic Combo'], image: require('../../assets/services/haircut-beard.png') },
  { id: 'fb-wash', name: 'Мытьё головы', price: 30000, duration: 15, icon: 'droplet', description: 'Свежесть с премиальными средствами', image: require('../../assets/services/hair-wash.png') },
  { id: 'fb-kids', name: 'Детская стрижка', price: 60000, duration: 30, icon: 'smile', description: 'Заботливый подход для юных клиентов', image: require('../../assets/services/kids-haircut.png') },
  { id: 'fb-royal', name: 'Королевское бритьё', price: 70000, duration: 40, icon: 'star', description: 'Традиционное бритьё опасной бритвой', image: require('../../assets/services/royal-shave.png') },
];

export function useBarbers() {
  const [data, setData] = useState<Barber[]>(fallbackBarbers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    eagerFetchPromise = null;
    try {
      const result = await startEagerFetch();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load barbers');
      setData(fallbackBarbers);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    eagerBarbers.then((barbers) => {
      setData(barbers);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return { data, loading, error, refetch: fetch };
}

export function useServices() {
  const [data, setData] = useState<Service[]>(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await api.getServices();
    if (result.error || !result.data || result.data.length === 0) {
      if (result.error) setError(result.error);
      setData(fallbackServices);
    } else {
      setData(result.data.map(cleanService));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
