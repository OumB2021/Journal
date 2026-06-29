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
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
