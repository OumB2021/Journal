import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';
import { useToastStore } from '@/store/toastStore';

const SLIDE_MS = 320;
const HOLD_MS = 2200;

export default function Toast() {
  const { visible, message, hide } = useToastStore();
  const { colors, static: sc } = useTheme();
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    translateY.value = withSequence(
      withTiming(0, { duration: SLIDE_MS }),
      withDelay(HOLD_MS, withTiming(-120, { duration: SLIDE_MS })),
    );
    opacity.value = withSequence(
      withTiming(1, { duration: SLIDE_MS }),
      withDelay(
        HOLD_MS,
        withTiming(0, { duration: SLIDE_MS }, (finished) => {
          if (finished) runOnJS(hide)();
        }),
      ),
    );
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.container, { top: insets.top + 12 }, animStyle]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.bgElevated,
            borderColor: colors.borderDefault,
            shadowColor: '#000',
          },
        ]}
      >
        <Feather name="check-circle" size={16} color={sc.accentSuccess} />
        <Text
          style={[styles.label, { color: colors.textPrimary, fontFamily: 'Inter_500Medium' }]}
          numberOfLines={1}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 9999,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  label: {
    fontSize: 14,
  },
});
