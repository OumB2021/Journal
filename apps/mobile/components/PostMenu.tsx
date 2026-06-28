import React from 'react';
import {
  Modal,
  View,
  Pressable,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/theme/useTheme';

export interface MenuAnchor {
  top: number;
  right: number;
}

interface Props {
  isOpen: boolean;
  anchor: MenuAnchor;
  onClose: () => void;
}

function PostMenu({ isOpen, anchor, onClose }: Props) {
  const { colors, static: sc } = useTheme();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill}>
          {/* Inner touchable stops propagation so tapping the dropdown doesn't close it */}
          <TouchableWithoutFeedback>
            <View
              className="absolute w-48 rounded-s border border-border-subtle"
              style={[
                styles.shadow,
                {
                  top: anchor.top,
                  right: anchor.right,
                  backgroundColor: colors.bgOverlay,
                },
              ]}
            >
              <Pressable
                className="flex-row items-center h-[52px] px-[14px] gap-3"
                onPress={() => {
                  // TODO: download
                }}
              >
                <View className="w-[30px] h-[30px] rounded-s items-center justify-center">
                  <Feather name="download" size={15} color={colors.textPrimary} />
                </View>
                <Text className="font-sans text-[14px] text-text-primary">Download</Text>
              </Pressable>

              <View className="h-px bg-border-subtle" />

              <Pressable
                className="flex-row items-center h-[52px] px-[14px] gap-3"
                onPress={() => {
                  // TODO: share
                }}
              >
                <View className="w-[30px] h-[30px] rounded-s items-center justify-center">
                  <Feather name="share" size={15} color={colors.textPrimary} />
                </View>
                <Text className="font-sans text-[14px] text-text-primary">Share</Text>
              </Pressable>

              <View className="h-px bg-border-subtle" />

              <Pressable
                className="flex-row items-center h-[52px] px-[14px] gap-3"
                onPress={() => {
                  // TODO: delete post
                }}
              >
                <View className="w-[30px] h-[30px] rounded-s items-center justify-center">
                  <Feather name="trash-2" size={15} color={sc.accentDangerStrong} />
                </View>
                <Text className="font-sans text-[14px] text-danger-strong">Delete Post</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.63,
    shadowRadius: 40,
    elevation: 12,
  },
});

export default React.memo(PostMenu);
