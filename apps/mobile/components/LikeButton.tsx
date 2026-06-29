import React, { useRef, useCallback } from 'react';
import { Pressable, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

interface Props {
  liked: boolean;
  onToggle: () => void;
}

function LikeButton({ liked, onToggle }: Props) {
  const { colors, static: sc } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.35,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle();
  }, [onToggle, scale]);

  return (
    <Pressable onPress={handlePress} className="flex-row items-center gap-[6px]" hitSlop={8}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={18}
          color={liked ? sc.accentDangerStrong : colors.iconDefault}
        />
      </Animated.View>
      <Text className="font-sans text-[13px] text-icon">Like</Text>
    </Pressable>
  );
}

export default React.memo(LikeButton);
