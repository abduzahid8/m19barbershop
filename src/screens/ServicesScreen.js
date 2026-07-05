import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { scale as s } from '../theme/responsive';
import { services as allServices } from '../data/mockData';
import { CATEGORIES } from '../data/serviceVisuals';

import ServiceHero from '../components/ServiceHero';
import ServiceCategoryRail from '../components/ServiceCategoryRail';

import ServiceVisualCard from '../components/ServiceVisualCard';
import ServiceDetailSheet from '../components/ServiceDetailSheet';
import VisitBasketBar from '../components/VisitBasketBar';

export default function ServicesScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedServiceIds, setSelectedServiceIds] = useState(new Set());
  const [detailService, setDetailService] = useState(null);
  const [detailIndex, setDetailIndex] = useState(0);
  const contentAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    contentAnim.setValue(0);
    Animated.timing(contentAnim, {
      toValue: 1, duration: 350, useNativeDriver: true,
    }).start();
  }, [activeCategory]);

  const filtered = activeCategory === 'all'
    ? allServices
    : allServices.filter(s => s.category === activeCategory);

  const toggleService = useCallback((service) => {
    setSelectedServiceIds(prev => {
      const next = new Set(prev);
      if (next.has(service.id)) {
        next.delete(service.id);
      } else {
        next.add(service.id);
      }
      return next;
    });
  }, []);

  const openDetail = useCallback((service) => {
    const idx = filtered.findIndex(s => s.id === service.id);
    setDetailIndex(idx >= 0 ? idx : 0);
    setDetailService(service);
  }, [filtered]);

  const handleSwipe = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < filtered.length) {
      setDetailIndex(newIndex);
      setDetailService(filtered[newIndex]);
    }
  }, [filtered]);

  const handleBookFromSheet = useCallback((service) => {
    setDetailService(null);
    nav.navigate('Booking', { selectedService: service });
  }, [nav]);

  const handleBasketBook = useCallback(() => {
    const sorted = allServices.filter(s => selectedServiceIds.has(s.id));
    nav.navigate('Booking', { selectedService: sorted[0] || null });
  }, [nav, selectedServiceIds]);

  const handleRemoveFromBasket = useCallback((serviceId) => {
    setSelectedServiceIds(prev => {
      const next = new Set(prev);
      next.delete(serviceId);
      return next;
    });
  }, []);

  const selectedServices = allServices.filter(s => selectedServiceIds.has(s.id));

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(selectedServices.length > 0 ? s(120) : 0, s(100) + insets.bottom) }}
      >
        <ServiceHero activeCategory={activeCategory} />

        <ServiceCategoryRail
          categories={CATEGORIES}
          activeKey={activeCategory}
          onSelect={setActiveCategory}
        />

        <Animated.View
          style={[
            styles.section,
            {
              opacity: contentAnim,
              transform: [{
                translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }),
              }],
            },
          ]}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="search" size={s(28)} color={colors.textMuted} />
            </View>
          ) : (
            <View>
              {filtered.map((srv, i) => (
                  <ServiceVisualCard
                    key={srv.id}
                    service={srv}
                    index={i}
                    selected={selectedServiceIds.has(srv.id)}
                    onSelect={() => toggleService(srv)}
                    onInfo={() => openDetail(srv)}
                  />
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <VisitBasketBar
        selectedServices={selectedServices}
        onRemove={handleRemoveFromBasket}
        onBook={handleBasketBook}
      />

      <ServiceDetailSheet
        visible={!!detailService}
        service={detailService}
        services={filtered}
        serviceIndex={detailIndex}
        onSwipe={handleSwipe}
        onClose={() => setDetailService(null)}
        onBook={handleBookFromSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: { paddingTop: s(4), paddingBottom: s(30) },

  empty: { alignItems: 'center', paddingVertical: s(60) },
});
