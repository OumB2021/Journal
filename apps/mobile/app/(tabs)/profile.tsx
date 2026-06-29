import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  type ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { PROFILE_USER, PROFILE_POSTS, type ProfilePost } from '@/data/profileMockData';
import ProfileHeader from '@/components/profile/ProfileHeader';
import StatsBanner from '@/components/profile/StatsBanner';
import GridImage from '@/components/profile/GridImage';
import PostDetailPanel from '@/components/profile/PostDetailPanel';
import { useTheme } from '@/theme/useTheme';

function GridHeader() {
  const { colors } = useTheme();
  return (
    <View style={styles.gridHeader}>
      <Text style={[styles.gridHeaderLabel, { color: colors.iconStrong }]}>
        POSTS
      </Text>
      <Feather name="grid" size={18} color={colors.iconStrong} />
    </View>
  );
}

function ListHeader() {
  return (
    <View style={styles.listHeader}>
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
    ({ item }: ListRenderItemInfo<ProfilePost>) => (
      <GridImage post={item} onPress={handlePostPress} />
    ),
    [handlePostPress],
  );

  return (
    <SafeAreaView className="flex-1 bg-bg-base" edges={['top']}>
      <FlatList
        data={PROFILE_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
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
    paddingBottom: 120,
  },
  listHeader: {
    alignItems: 'center',
    gap: 24,
    paddingBottom: 24,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  gridHeaderLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 3,
  },
  columnWrapper: {
    gap: 8,
  },
  rowSeparator: {
    height: 8,
  },
});
