import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, type ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { PROFILE_USER, PROFILE_POSTS, type ProfilePost } from '@/data/profileMockData';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsBanner from '@/components/profile/StatsBanner';
import GridImage from '@/components/profile/GridImage';
import PostDetailPanel from '@/components/profile/PostDetailPanel';
import { useTheme } from '@/theme/useTheme';
import { TAB_BAR_BOTTOM_INSET } from '@/components/TabBar';

// Pad to even length so the last row always has two cells.
type GridItem = ProfilePost | null;
const GRID_DATA: GridItem[] =
  PROFILE_POSTS.length % 2 === 0 ? PROFILE_POSTS : [...PROFILE_POSTS, null];

function GridHeader() {
  const { colors } = useTheme();
  return (
    <View className="flex-row justify-between items-center w-full">
      <Text
        className="font-sans-semibold text-[11px] tracking-[3px]"
        style={{ color: colors.iconStrong }}
      >
        POSTS
      </Text>
      <Feather name="grid" size={18} color={colors.iconStrong} />
    </View>
  );
}

function ListHeader() {
  return (
    <View className="items-center gap-lg pb-lg">
      <ProfileHeader user={PROFILE_USER} />
      <StatsBanner user={PROFILE_USER} />
      <GridHeader />
    </View>
  );
}

export default function ProfileScreen() {
  const [selectedPost, setSelectedPost] = useState<ProfilePost | null>(null);

  const handlePostPress = useCallback((post: ProfilePost) => {
    setSelectedPost(post);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GridItem>) => {
      if (item === null) return <View style={{ flex: 1 }} />;
      return <GridImage post={item} onPress={handlePostPress} />;
    },
    [handlePostPress],
  );

  return (
    <SafeAreaView className="flex-1 bg-bg-base" edges={['top']}>
      <FlatList
        data={GRID_DATA}
        keyExtractor={(item, index) => item?.id ?? `spacer-${index}`}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View className="h-sm" />}
        ListHeaderComponent={<ListHeader />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {selectedPost && (
        <PostDetailPanel post={selectedPost} onClose={handleClose} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_BOTTOM_INSET,
  },
  columnWrapper: {
    gap: 8,
  },
});
