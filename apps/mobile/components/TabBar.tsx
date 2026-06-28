import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  useColorScheme,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// ── Design tokens (from Pencil design — do not change) ───────────────
const H_PAD = 16; // outer nav horizontal padding
const B_PAD = 20; // outer nav bottom padding
const PLUS_SIZE = 56; // plus button diameter
const NAV_GAP = 12; // gap between pill and plus button
const TB_PAD = 1; // tab-bar inner padding (all 4 sides)
const TB_GAP = 4; // gap between the 3 tab slots
const TB_H = 56; // tab-bar total height
const CAP_H = TB_H - TB_PAD * 2; // capsule height = 48
const ICON_SIZE = 22;
const PLUS_ICON = 24;
const LABEL_SIZE = 10;

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

// ── TabBar ───────────────────────────────────────────────────────────
export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";

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

  // ── Colors (light / dark from Pencil tokens) ──
  const tabBarBg = isDark ? "#131313D9" : "#FFFFFFD9";
  const tabBarBorder = isDark ? "#1F1F1F" : "#E0E0E0";
  const capsuleBg = isDark ? "#FFFFFF1A" : "#0000001A";
  const activeColor = isDark ? "#FFFFFF" : "#131313";
  const inactIconColor = isDark ? "#C4C7C8" : "#888888";
  const inactLblColor = isDark ? "#8E9192" : "#888888";
  const plusBg = isDark ? "#FFFFFF" : "#1A1A1A";
  const plusIconColor = isDark ? "#131313" : "#FFFFFF";

  return (
    <View
      className="bg-bg-base"
      style={[
        styles.nav,
        {
          paddingBottom: B_PAD,
        },
      ]}
    >
      {/* ── Pill-shaped tab container ──────────────── */}
      <View
        style={[
          styles.tabBar,
          { backgroundColor: tabBarBg, borderColor: tabBarBorder },
        ]}
        onLayout={handleLayout}
      >
        {/* Animated capsule — rendered first so it sits behind icons */}
        <Animated.View
          className="align-center justify-center py-auto"
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
              style={styles.tab}
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
                style={[
                  styles.label,
                  {
                    color: active ? activeColor : inactLblColor,
                    fontFamily: active
                      ? "Inter_600SemiBold"
                      : "Inter_500Medium",
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── Plus CTA — separate floating circle, NOT a tab ─ */}
      <Pressable
        style={[styles.plus, { backgroundColor: plusBg }]}
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
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: NAV_GAP,
    paddingHorizontal: H_PAD,
    paddingTop: 0,
  },
  tabBar: {
    flex: 1,
    height: TB_H,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: TB_GAP,
    padding: TB_PAD,
  },
  capsule: {
    position: "absolute",
    left: 0,
    top: 0,
    height: CAP_H,
    borderRadius: 999,
  },
  tab: {
    flex: 1,
    height: CAP_H,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 3,
  },
  label: {
    fontSize: LABEL_SIZE,
  },
  plus: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    borderRadius: PLUS_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
