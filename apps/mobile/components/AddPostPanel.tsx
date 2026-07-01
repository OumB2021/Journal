import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/useTheme';
import { useToastStore } from '@/store/toastStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_DESC = 200;

const CATEGORIES = [
  'Architecture',
  'Art',
  'Culture',
  'Food',
  'Lifestyle',
  'Nature',
  'Technology',
  'Travel',
];

interface Props {
  onClose: () => void;
}

export default function AddPostPanel({ onClose }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { show: showToast } = useToastStore();

  const [modalVisible, setModalVisible] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);

  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 300 });
  }, [translateX]);

  const dismiss = useCallback(() => {
    setModalVisible(false);
    onClose();
  }, [onClose]);

  const goHome = useCallback(() => {
    router.navigate('/(tabs)/home');
  }, [router]);

  const handleClose = useCallback(() => {
    setCategoryOpen(false);
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
      runOnJS(dismiss)();
    });
  }, [translateX, dismiss]);

  const handlePublish = useCallback(() => {
    setCategoryOpen(false);
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
      runOnJS(dismiss)();
      runOnJS(showToast)('Post published successfully!');
      runOnJS(goHome)();
    });
  }, [translateX, dismiss, showToast, goHome]);

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

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const handleDescChange = useCallback((text: string) => {
    if (text.length <= MAX_DESC) setDescription(text);
  }, []);

  const canPublish = !!imageUri && title.trim().length > 0 && !!category;

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
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={{ flex: 1 }}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                bounces={false}
              >
                <Pressable onPress={Keyboard.dismiss} style={styles.scrollContent}>
                {/* ── Header ─────────────────────────────────── */}
                <View style={styles.header}>
                  <Text
                    style={[
                      styles.headerTitle,
                      { color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
                    ]}
                  >
                    New Post
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    hitSlop={12}
                    style={[styles.closeBtn, { backgroundColor: colors.bgSurface, borderColor: colors.borderDefault }]}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                  >
                    <Feather name="x" size={14} color={colors.iconDefault} />
                  </Pressable>
                </View>

                {/* ── Image Canvas ────────────────────────────── */}
                <Pressable onPress={pickImage} style={styles.canvas}>
                  <View
                    style={[
                      styles.canvasInner,
                      {
                        backgroundColor: colors.bgSurface,
                        borderColor: colors.borderDefault,
                      },
                    ]}
                  >
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.previewImage}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.uploadPlaceholder}>
                        <View
                          style={[
                            styles.uploadIconWrap,
                            { backgroundColor: colors.bgElevated, borderColor: colors.borderDefault },
                          ]}
                        >
                          <Feather name="image" size={22} color={colors.iconDefault} />
                        </View>
                        <Text
                          style={[
                            styles.uploadTitle,
                            { color: colors.textSecondary, fontFamily: 'Inter_600SemiBold' },
                          ]}
                        >
                          Tap to upload image
                        </Text>
                        <Text
                          style={[
                            styles.uploadSub,
                            { color: colors.textTertiary, fontFamily: 'Inter_400Regular' },
                          ]}
                        >
                          JPG · PNG · WEBP
                        </Text>
                      </View>
                    )}
                  </View>
                  {imageUri && (
                    <View style={styles.changeImageBadge}>
                      <Feather name="camera" size={12} color="#fff" />
                      <Text style={styles.changeImageText}>Change</Text>
                    </View>
                  )}
                </Pressable>

                {/* ── Title ──────────────────────────────────── */}
                <View style={styles.fieldGroup}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.textTertiary, fontFamily: 'Inter_600SemiBold' },
                    ]}
                  >
                    TITLE
                  </Text>
                  <TextInput
                    style={[
                      styles.inputField,
                      {
                        backgroundColor: colors.bgSurface,
                        color: colors.textPrimary,
                        borderColor: colors.borderDefault,
                        fontFamily: 'Inter_400Regular',
                      },
                    ]}
                    placeholder="Give your post a title..."
                    placeholderTextColor={colors.textTertiary}
                    value={title}
                    onChangeText={setTitle}
                    returnKeyType="next"
                  />
                </View>

                {/* ── Description ────────────────────────────── */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldLabelRow}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: colors.textTertiary, fontFamily: 'Inter_600SemiBold' },
                      ]}
                    >
                      DESCRIPTION
                    </Text>
                    <Text
                      style={[
                        styles.charCount,
                        { color: colors.textTertiary, fontFamily: 'Inter_400Regular' },
                      ]}
                    >
                      {description.length} / {MAX_DESC}
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: colors.bgSurface,
                        color: colors.textPrimary,
                        borderColor: colors.borderDefault,
                        fontFamily: 'Inter_400Regular',
                      },
                    ]}
                    placeholder="Share what inspired this post..."
                    placeholderTextColor={colors.textTertiary}
                    value={description}
                    onChangeText={handleDescChange}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {/* ── Category ───────────────────────────────── */}
                <View style={[styles.fieldGroup, { zIndex: 10 }]}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: colors.textTertiary, fontFamily: 'Inter_600SemiBold' },
                    ]}
                  >
                    CATEGORY
                  </Text>
                  <Pressable
                    onPress={() => setCategoryOpen((v) => !v)}
                    style={[
                      styles.inputField,
                      styles.dropdownTrigger,
                      {
                        backgroundColor: colors.bgSurface,
                        borderColor: categoryOpen ? colors.borderStrong : colors.borderDefault,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        { fontFamily: 'Inter_400Regular', fontSize: 14 },
                        { color: category ? colors.textPrimary : colors.textTertiary },
                      ]}
                    >
                      {category || 'Select a category'}
                    </Text>
                    <Feather
                      name={categoryOpen ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.iconDefault}
                    />
                  </Pressable>

                  {categoryOpen && (
                    <View
                      style={[
                        styles.dropdownList,
                        {
                          backgroundColor: colors.bgSurface,
                          borderColor: colors.borderDefault,
                        },
                      ]}
                    >
                      {CATEGORIES.map((cat, i) => {
                        const isSelected = category === cat;
                        const isLast = i === CATEGORIES.length - 1;
                        return (
                          <Pressable
                            key={cat}
                            onPress={() => {
                              setCategory(cat);
                              setCategoryOpen(false);
                            }}
                            style={[
                              styles.dropdownItem,
                              !isLast && {
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                borderBottomColor: colors.borderSubtle,
                              },
                              isSelected && { backgroundColor: colors.bgElevated },
                            ]}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                {
                                  color: isSelected ? colors.interactiveBg : colors.textPrimary,
                                  fontFamily: isSelected ? 'Inter_600SemiBold' : 'Inter_400Regular',
                                },
                              ]}
                            >
                              {cat}
                            </Text>
                            {isSelected && (
                              <Feather name="check" size={14} color={colors.interactiveBg} />
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
                </Pressable>
              </ScrollView>
              </View>

              {/* ── Pinned publish bar ──────────────────────── */}
              <View
                style={[
                  styles.bottomBar,
                  {
                    paddingBottom: insets.bottom || 16,
                    backgroundColor: colors.bgBase,
                  },
                ]}
              >
                <Pressable
                  onPress={canPublish ? handlePublish : undefined}
                  style={({ pressed }) => [
                    styles.publishBtn,
                    {
                      backgroundColor: colors.interactiveBg,
                      opacity: !canPublish ? 0.4 : pressed ? 0.85 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Publish post"
                  accessibilityState={{ disabled: !canPublish }}
                >
                  <Feather name="send" size={15} color={colors.interactiveText} />
                  <Text
                    style={[
                      styles.publishLabel,
                      { color: colors.interactiveText, fontFamily: 'Inter_700Bold' },
                    ]}
                  >
                    Publish Post
                  </Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  scrollContent: {
    gap: 16,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Canvas
  canvas: {
    position: 'relative',
  },
  canvasInner: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 13,
  },
  uploadSub: {
    fontSize: 11,
    letterSpacing: 0.5,
  },
  changeImageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  changeImageText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Inter_500Medium',
  },
  // Form fields
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: 10,
  },
  inputField: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  textArea: {
    height: 88,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  // Category dropdown
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownList: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  // Bottom bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  // Publish
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 10,
    marginTop: 4,
  },
  publishLabel: {
    fontSize: 15,
  },
});
