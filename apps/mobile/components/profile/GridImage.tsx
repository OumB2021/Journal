import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { ProfilePost } from '@/data/profileMockData';

interface Props {
  post: ProfilePost;
  onPress: (post: ProfilePost) => void;
}

function GridImage({ post, onPress }: Props) {
  const handlePress = useCallback(() => onPress(post), [onPress, post]);

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${post.category} post: ${post.title}`}
    >
      <Image
        source={{ uri: post.imageUrl }}
        style={styles.image}
        contentFit="cover"
        recyclingKey={post.id}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(GridImage);
