import { Tabs } from "expo-router";
import TabBar from "@/components/TabBar";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
