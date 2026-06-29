import React, { useCallback, useEffect, useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { ProfilePost } from "@/data/profileMockData";
import { PROFILE_USER } from "@/data/profileMockData";
import { useTheme } from "@/theme/useTheme";

const SCREEN_WIDTH = Dimensions.get("window").width;

function formatCount(n: number): string {
  if (n >= 1000) {
    const val = n / 1000;
    return (Number.isInteger(val) ? val.toString() : val.toFixed(1)) + "K";
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
        <Animated.View style={[styles.root, animatedStyle]}>
          <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <ScrollView
                style={styles.flex}
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                {/* Hero image with back arrow */}
                <View style={styles.heroContainer}>
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.heroImage}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={handleClose}
                    style={styles.backBtn}
                    hitSlop={12}
                  >
                    <View
                      style={[
                        styles.backBtnInner,
                        { backgroundColor: "rgba(0,0,0,0.45)" },
                      ]}
                    >
                      <Feather name="arrow-left" size={20} color="#e5e2e1" />
                    </View>
                  </Pressable>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  {/* Author row */}
                  <View style={styles.authorRow}>
                    <View style={styles.avatarSmall}>
                      <Image
                        source={{ uri: PROFILE_USER.avatarUrl }}
                        style={{ width: 36, height: 36 }}
                        contentFit="cover"
                      />
                    </View>

                    <View style={styles.authorMeta}>
                      <Text
                        style={[
                          styles.authorName,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {PROFILE_USER.name}
                      </Text>
                      <Text
                        style={[
                          styles.postDate,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {post.date}
                      </Text>
                    </View>

                    <Pressable
                      style={[
                        styles.followBtn,
                        { borderColor: colors.textPrimary },
                      ]}
                    >
                      <Text
                        style={[
                          styles.followText,
                          { color: colors.textPrimary },
                        ]}
                      >
                        Follow
                      </Text>
                    </Pressable>

                    <Pressable onPress={handleClose} hitSlop={8}>
                      <Feather name="x" size={20} color={colors.iconDefault} />
                    </Pressable>
                  </View>

                  {/* Description */}
                  <Text
                    style={[styles.description, { color: colors.textPrimary }]}
                  >
                    {post.description}
                  </Text>

                  {/* Hashtags */}
                  <Text style={[styles.hashtags, { color: "#5B8DEF" }]}>
                    {post.hashtags.join(" ")}
                  </Text>

                  {/* Engagement row */}
                  <View style={styles.engagementRow}>
                    <View style={styles.engagementGroup}>
                      <View style={styles.engagementItem}>
                        <Feather
                          name="heart"
                          size={20}
                          color={colors.iconDefault}
                        />
                        <Text
                          style={[
                            styles.engagementCount,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {formatCount(post.likeCount)}
                        </Text>
                      </View>
                      <View style={styles.engagementItem}>
                        <Feather
                          name="message-circle"
                          size={20}
                          color={colors.iconDefault}
                        />
                        <Text
                          style={[
                            styles.engagementCount,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {post.commentCount}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Separator */}
                  <View
                    style={[
                      styles.separator,
                      { backgroundColor: colors.borderDefault },
                    ]}
                  />

                  {/* Comments */}
                  {post.comments.map((comment) => (
                    <View key={comment.id} style={styles.commentRow}>
                      <View style={styles.commentAvatar}>
                        <Image
                          source={{ uri: comment.avatarUrl }}
                          style={{ width: 32, height: 32 }}
                          contentFit="cover"
                        />
                      </View>
                      <View style={styles.commentBody}>
                        <Text
                          style={[
                            styles.commentAuthor,
                            { color: colors.textPrimary },
                          ]}
                        >
                          {comment.author}
                        </Text>
                        <Text
                          style={[
                            styles.commentText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {comment.text}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {/* Bottom padding so last comment isn't hidden behind input */}
                  <View style={{ height: 8 }} />
                </View>
              </ScrollView>

              {/* Fixed comment input */}
              <View
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: colors.bgBase,
                    borderTopColor: colors.borderDefault,
                  },
                ]}
              >
                <View style={styles.commentAvatar}>
                  <Image
                    source={{ uri: PROFILE_USER.avatarUrl }}
                    style={{ width: 32, height: 32 }}
                    contentFit="cover"
                  />
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.bgSurface,
                      color: colors.textPrimary,
                    },
                  ]}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#131313",
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  heroContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  backBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  authorMeta: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  postDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  followText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  hashtags: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
  engagementRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  engagementGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  engagementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  engagementCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  separator: {
    height: 1,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    flexShrink: 0,
  },
  commentBody: {
    flex: 1,
    gap: 2,
  },
  commentAuthor: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  commentText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
