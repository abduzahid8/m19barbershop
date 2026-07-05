import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../theme/colors';
import { scale as s } from '../theme/responsive';
function CategoryPill({ category, isActive, onPress }) {
  const dotPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(dotPulse, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
          Animated.timing(dotPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      dotPulse.setValue(1);
    }
  }, [isActive]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <Animated.View style={[
        scr.pillWrap,
        isActive && {
          transform: [{
            scale: dotPulse.interpolate({ inputRange: [0.3, 1], outputRange: [1, 1.03] }),
          }],
        },
      ]}>
        {isActive ? (
          <LinearGradient colors={category.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={scr.pillGrad}>
            <Feather name={category.icon} size={s(13)} color="#FFF" />
          </LinearGradient>
        ) : (
          <View style={scr.pillInactive}>
            <Feather name={category.icon} size={s(13)} color={colors.iconMuted} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ServiceCategoryRail({
  categories, activeKey, onSelect,
}) {
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entryAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: entryAnim }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scr.rail}
      >
        {categories.map((cat) => (
          <CategoryPill
            key={cat.key}
            category={cat}
            isActive={activeKey === cat.key}
            onPress={() => onSelect(cat.key)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const scr = StyleSheet.create({
  rail: {
    paddingHorizontal: s(16),
    gap: s(8),
    paddingVertical: s(10),
  },
  pillWrap: { borderRadius: 100 },
  pillGrad: {
    width: s(34), height: s(34), borderRadius: s(17),
    alignItems: 'center', justifyContent: 'center',
  },
  pillInactive: {
    width: s(34), height: s(34), borderRadius: s(17),
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
