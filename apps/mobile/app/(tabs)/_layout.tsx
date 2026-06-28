import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.floatingTabBar,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    // Crucial: Positions the bar over the scrollable area
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,

    paddingBottom: Platform.OS === "ios" ? 0 : 0, // Reset default system padding
  },
});
