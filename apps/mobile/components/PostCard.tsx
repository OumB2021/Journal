import React, { useRef, useCallback } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import type { Post } from '@/data/mockPosts';
import LikeButton from './LikeButton';
import type { MenuAnchor } from './PostMenu';
import { useTheme } from '@/theme/useTheme';

interface Props {
  post: Post;
  liked: boolean;
  likeCount: number;
  onLikeToggle: () => void;
  isMenuOpen: boolean;
  onMenuOpen: (anchor: MenuAnchor) => void;
  onMenuClose: () => void;
}

function PostCard({ post, liked, likeCount, onLikeToggle, isMenuOpen, onMenuOpen, onMenuClose }: Props) {
  const { colors } = useTheme();
  const menuBtnRef = useRef<View>(null);

  const handleMenuPress = useCallback(() => {
    if (isMenuOpen) {
      onMenuClose();
      return;
    }
    menuBtnRef.current?.measureInWindow((x, y, width, height) => {
      const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
      const MENU_HEIGHT = 160; // 3 rows × 52px + 2 dividers
      const spaceBelow = screenHeight - (y + height + 4);
      const top =
        spaceBelow >= MENU_HEIGHT
          ? y + height + 4
          : Math.max(0, y - MENU_HEIGHT - 4);
      onMenuOpen({ top, right: screenWidth - x - width });
    });
  }, [isMenuOpen, onMenuClose, onMenuOpen]);

  return (
    <View className="bg-bg-surface rounded-s border border-border p-md gap-3">
      {/* Header: avatar + meta + three-dot button */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-[10px]">
          <View className="w-9 h-9 rounded-full bg-border-strong overflow-hidden">
            <Image
              source={{ uri: post.avatarUrl }}
              style={{ width: 36, height: 36 }}
              contentFit="cover"
            />
          </View>
          <View className="gap-0.5">
            <Text className="font-sans-semibold text-[13px] text-text-primary">
              {post.author}
            </Text>
            <Text className="font-sans text-[11px] text-text-secondary">
              {post.date}
            </Text>
          </View>
        </View>

        <Pressable
          ref={menuBtnRef}
          className="w-7 h-7 rounded-[6px] items-center justify-center"
          onPress={handleMenuPress}
          hitSlop={8}
        >
          <Feather name="more-horizontal" size={18} color={colors.iconDefault} />
        </Pressable>
      </View>

      {/* Hero image with category badge */}
      <View className="h-[220px] rounded-s overflow-hidden">
        <Image
          source={{ uri: post.imageUrl }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
        />
        <View
          className="absolute bottom-[10px] left-[10px] rounded-[1px] py-xs px-[10px]"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Text className="font-sans-semibold text-[10px] text-text-on-accent">
            {post.category}
          </Text>
        </View>
      </View>

      {/* Title + description */}
      <View className="gap-[6px]">
        <Text className="font-sans-semibold text-[17px] text-text-primary">
          {post.title}
        </Text>
        <Text className="font-sans text-[13px] text-text-secondary leading-5">
          {post.description}
        </Text>
      </View>

      {/* Separator */}
      <View className="h-px bg-border" />

      {/* Like row */}
      <View className="flex-row items-center justify-between">
        <LikeButton liked={liked} onToggle={onLikeToggle} />
        <Text className="font-sans text-[13px] text-text-secondary">
          {likeCount} likes
        </Text>
      </View>
    </View>
  );
}

export default React.memo(PostCard);
