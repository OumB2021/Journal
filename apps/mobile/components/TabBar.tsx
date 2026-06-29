import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons, Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@/theme/useTheme";

// ── Design tokens (from Pencil design — do not change) ───────────────
const H_PAD = 16; // outer nav horizontal padding
const PLUS_SIZE = 56; // plus button diameter
const NAV_GAP = 12; // gap between pill and plus button
const TB_PAD = 1; // tab-bar inner padding (all 4 sides)
const TB_GAP = 4; // gap between the 3 tab slots
const TB_H = 60; // tab-bar total height
const CAP_H = TB_H - TB_PAD * 2; // capsule height = 54
const ICON_SIZE = 22;
const PLUS_ICON = 24;

// ── Tab definitions ──────────────────────────────────────────────────
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: {
  name: string;
  label: string;
  activeIcon: IoniconName;
  inactiveIcon: IoniconName;
}[] = [
  {
    name: "home",
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  {
    name: "profile",
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
  {
    name: "settings",
    label: "Settings",
    activeIcon: "settings",
    inactiveIcon: "settings-outline",
  },
];

// ── Geometry helpers ─────────────────────────────────────────────────
function estimateTabBarWidth(): number {
  return Dimensions.get("window").width - H_PAD * 2 - PLUS_SIZE - NAV_GAP;
}

// TB_BORDER must be subtracted from both sides — onLayout returns the outer
// width (including border), but flex children are laid out in the content area.
const TB_BORDER = 1;

function calcCapsuleWidth(tbWidth: number): number {
  return (tbWidth - TB_BORDER * 2 - TB_PAD * 2 - TB_GAP * 2) / 3;
}

function capsuleTargetX(index: number, cw: number): number {
  return TB_PAD + index * (cw + TB_GAP);
}

// ── Shared inset constant — import this in scrollable screens ────────
export const TAB_BAR_BOTTOM_INSET = TB_H + 34 + 16; // max safe-area (34) + base offset + breathing room

// ── TabBar ───────────────────────────────────────────────────────────
export default function TabBar({
  state,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { colors, scheme } = useTheme();
  const isDark = scheme === "dark";

  const [tbWidth, setTbWidth] = useState(estimateTabBarWidth);
  const capW = calcCapsuleWidth(tbWidth);

  const tx = useSharedValue(capsuleTargetX(state.index, capW));

  // Animate capsule to newly active tab
  useEffect(() => {
    tx.value = withTiming(capsuleTargetX(state.index, capW), {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  }, [state.index, capW]);

  // After real layout, snap capsule without animation then let future
  // tab-change effects animate normally
  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      const cw = calcCapsuleWidth(w);
      setTbWidth(w);
      tx.value = capsuleTargetX(state.index, cw);
    },
    [state.index],
  );

  const capsuleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  // ── Colors derived from design tokens ──
  const tabBarBorder = colors.borderDefault;
  // Subtle glass-effect capsule: interactiveBg is white in dark (#FFFFFF) and
  // near-black in light (#1A1A1A), so appending 1A (≈10% opacity) produces the
  // correct tint in both schemes without any hardcoded literal.
  const capsuleBg = `${colors.interactiveBg}1A`;
  // Active tab uses the highest-contrast foreground for the current scheme
  const activeColor = colors.interactiveBg;
  // Inactive: stronger icon in dark (more contrast on dark bg), default in light
  const inactIconColor = isDark ? colors.iconStrong : colors.iconDefault;
  const inactLblColor = colors.iconDefault;
  const plusBg = colors.interactiveBg;
  const plusIconColor = colors.interactiveText;

  return (
    <View
      className="absolute flex-row items-center justify-center gap-3 px-4"
      style={{ bottom: Math.max(insets.bottom, 24) }}
    >
      {/* ── Pill-shaped tab container ──────────────── */}
      <View
        className="flex-1 h-14 rounded-full border flex-row items-center gap-1 p-px bg-bg-base backdrop-blur-lg"
        style={{ borderColor: tabBarBorder, height: TB_H }}
        onLayout={handleLayout}
      >
        {/* Animated capsule — rendered first so it sits behind icons */}
        <Animated.View
          style={[
            styles.capsule,
            { backgroundColor: capsuleBg, width: capW },
            capsuleAnimStyle,
          ]}
        />

        {TABS.map(({ name, label, activeIcon, inactiveIcon }, index) => {
          const active = state.index === index;
          return (
            <Pressable
              key={name}
              className="flex-1 items-center justify-center py-1.5 gap-[3px]"
              style={{ height: CAP_H }}
              onPress={() => navigation.navigate(name)}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
            >
              <Ionicons
                name={active ? activeIcon : inactiveIcon}
                size={ICON_SIZE}
                color={active ? activeColor : inactIconColor}
              />
              <Text
                className="text-[10px]"
                style={{
                  color: active ? activeColor : inactLblColor,
                  fontFamily: active ? "Inter_600SemiBold" : "Inter_500Medium",
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Plus CTA — separate floating circle, NOT a tab ─ */}
      <Pressable
        className="w-14 rounded-full items-center justify-center"
        style={{ backgroundColor: plusBg, height: TB_H, width: TB_H }}
        onPress={() => {
          /* TODO */
        }}
        accessibilityRole="button"
        accessibilityLabel="New entry"
      >
        <Feather name="plus" size={PLUS_ICON} color={plusIconColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  capsule: {
    position: "absolute",
    left: 0,
    top: 0,
    height: CAP_H,
    borderRadius: 999,
  },
});
