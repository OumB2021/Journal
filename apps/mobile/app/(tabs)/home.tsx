import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ListRenderItemInfo } from "react-native";
import { MOCK_POSTS, type Post } from "@/data/mockPosts";
import PostCard from "@/components/PostCard";
import PostMenu from "@/components/PostMenu";
import HomeHeader from "@/components/HomeHeader";
import type { MenuAnchor } from "@/components/PostMenu";
import { spacing } from "@/theme";

interface MenuState {
  postId: string | null;
  anchor: MenuAnchor;
}

const CLOSED_MENU: MenuState = { postId: null, anchor: { top: 0, right: 0 } };

export default function HomeScreen() {
  const [menu, setMenu] = useState<MenuState>(CLOSED_MENU);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  const handleMenuOpen = useCallback((id: string, anchor: MenuAnchor) => {
    setMenu({ postId: id, anchor });
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenu(CLOSED_MENU);
  }, []);

  const handleLikeToggle = useCallback((id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => {
      const liked = !!likedIds[item.id];
      return (
        <PostCard
          post={item}
          liked={liked}
          likeCount={item.likeCount + (liked ? 1 : 0)}
          onLikeToggle={() => handleLikeToggle(item.id)}
          isMenuOpen={menu.postId === item.id}
          onMenuOpen={(anchor) => handleMenuOpen(item.id, anchor)}
          onMenuClose={handleMenuClose}
        />
      );
    },
    [likedIds, menu.postId, handleLikeToggle, handleMenuOpen, handleMenuClose],
  );

  return (
    <SafeAreaView className="flex-1 bg-bg-base" edges={["top"]}>
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<HomeHeader />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <></>}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
      <PostMenu
        isOpen={menu.postId !== null}
        anchor={menu.anchor}
        onClose={handleMenuClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
});
