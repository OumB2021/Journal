import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { ProfilePost } from '@/data/profileMockData';
import { PROFILE_USER } from '@/data/profileMockData';
import { useTheme } from '@/theme/useTheme';

const SCREEN_WIDTH = Dimensions.get('window').width;

function formatCount(n: number): string {
  if (n >= 1000) {
    const val = n / 1000;
    return (Number.isInteger(val) ? val.toString() : val.toFixed(1)) + 'K';
  }
  return n.toString();
}

interface Props {
  post: ProfilePost;
  onClose: () => void;
}

export default function PostDetailPanel({ post, onClose }: Props) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(true);
  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 300 });
  }, [translateX]);

  const dismiss = useCallback(() => {
    setModalVisible(false);
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
      runOnJS(dismiss)();
    });
  }, [translateX, dismiss]);

  const panGesture = Gesture.Pan()
    .activeOffsetX(15)
    .failOffsetY([-20, 20])
    .onUpdate((e) => {
      if (e.translationX > 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      const shouldDismiss =
        e.translationX > SCREEN_WIDTH * 0.3 || e.velocityX > 500;
      if (shouldDismiss) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
          runOnJS(dismiss)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.root, { backgroundColor: colors.bgBase }, animatedStyle]}
        >
          <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <ScrollView
                className="flex-1"
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                {/* Hero image with back arrow */}
                <View className="w-full aspect-square">
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.heroImage}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={handleClose}
                    className="absolute top-4 left-4"
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Go back to profile"
                  >
                    <View
                      className="w-9 h-9 rounded-full items-center justify-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
                    >
                      <Feather name="arrow-left" size={20} color="#e5e2e1" />
                    </View>
                  </Pressable>
                </View>

                {/* Content */}
                <View className="px-md pt-md gap-[12px]">
                  {/* Author row */}
                  <View className="flex-row items-center gap-[10px]">
                    <View className="w-9 h-9 rounded-full overflow-hidden">
                      <Image
                        source={{ uri: PROFILE_USER.avatarUrl }}
                        style={{ width: 36, height: 36 }}
                        contentFit="cover"
                      />
                    </View>

                    <View className="flex-1 gap-0.5">
                      <Text
                        className="font-sans-semibold text-[14px]"
                        style={{ color: colors.textPrimary }}
                      >
                        {PROFILE_USER.name}
                      </Text>
                      <Text
                        className="font-sans text-[12px]"
                        style={{ color: colors.textSecondary }}
                      >
                        {post.date}
                      </Text>
                    </View>

                    <Pressable
                      className="px-[14px] py-[6px] rounded-full border"
                      style={{ borderColor: colors.textPrimary }}
                    >
                      <Text
                        className="font-sans-semibold text-[13px]"
                        style={{ color: colors.textPrimary }}
                      >
                        Follow
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={handleClose}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel="Close post"
                    >
                      <Feather name="x" size={20} color={colors.iconDefault} />
                    </Pressable>
                  </View>

                  {/* Description */}
                  <Text
                    className="font-sans text-[14px] leading-[21px]"
                    style={{ color: colors.textPrimary }}
                  >
                    {post.description}
                  </Text>

                  {/* Hashtags */}
                  <Text className="font-sans text-[14px] leading-[21px]" style={{ color: '#5B8DEF' }}>
                    {post.hashtags.join(' ')}
                  </Text>

                  {/* Engagement row */}
                  <View className="flex-row items-center justify-between py-xs">
                    <View className="flex-row items-center gap-5">
                      <View className="flex-row items-center gap-[6px]">
                        <Feather name="heart" size={20} color={colors.iconDefault} />
                        <Text
                          className="font-sans text-[14px]"
                          style={{ color: colors.textSecondary }}
                        >
                          {formatCount(post.likeCount)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-[6px]">
                        <Feather name="message-circle" size={20} color={colors.iconDefault} />
                        <Text
                          className="font-sans text-[14px]"
                          style={{ color: colors.textSecondary }}
                        >
                          {post.commentCount}
                        </Text>
                      </View>
                    </View>
                    <Feather name="bookmark" size={20} color={colors.iconDefault} />
                  </View>

                  {/* Separator */}
                  <View className="h-px" style={{ backgroundColor: colors.borderDefault }} />

                  {/* Comments */}
                  {post.comments.map((comment) => (
                    <View key={comment.id} className="flex-row items-start gap-[10px]">
                      <View className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <Image
                          source={{ uri: comment.avatarUrl }}
                          style={{ width: 32, height: 32 }}
                          contentFit="cover"
                        />
                      </View>
                      <View className="flex-1 gap-0.5">
                        <Text
                          className="font-sans-semibold text-[13px]"
                          style={{ color: colors.textPrimary }}
                        >
                          {comment.author}
                        </Text>
                        <Text
                          className="font-sans text-[13px] leading-[18px]"
                          style={{ color: colors.textSecondary }}
                        >
                          {comment.text}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View className="h-2" />
                </View>
              </ScrollView>

              {/* Fixed comment input */}
              <View
                className="flex-row items-center gap-[10px] px-md py-3 border-t"
                style={{
                  backgroundColor: colors.bgBase,
                  borderTopColor: colors.borderDefault,
                }}
              >
                <View className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    source={{ uri: PROFILE_USER.avatarUrl }}
                    style={{ width: 32, height: 32 }}
                    contentFit="cover"
                  />
                </View>
                <TextInput
                  className="flex-1 h-[38px] rounded-[19px] px-[14px] font-sans text-[14px]"
                  style={{
                    backgroundColor: colors.bgSurface,
                    color: colors.textPrimary,
                  }}
                  placeholder="Add a comment..."
                  placeholderTextColor={colors.textTertiary}
                />
                <Feather name="send" size={18} color="#5B8DEF" />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

// Only expo-image's style prop cannot use NativeWind className.
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
});
