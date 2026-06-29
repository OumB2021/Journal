import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { useAuth } from "@clerk/clerk-expo";
import { useTheme, useSetScheme } from "@/theme/useTheme";
import { TAB_BAR_BOTTOM_INSET } from "@/components/TabBar";
import {
  SectionLabel,
  Divider,
  NavRow,
  ValueRow,
  ToggleRow,
  Card,
} from "@/components/settings/SettingsUI";

export default function SettingsScreen() {
  const { colors, scheme } = useTheme();
  const setScheme = useSetScheme();
  // const { signOut } = useAuth();

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => {} },
    ]);
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgBase }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-sans-bold text-[28px] leading-[34px] text-text-primary">
          Settings
        </Text>

        <SectionLabel title="ACCOUNT" />
        <Card>
          <NavRow label="Edit Profile" />
          <Divider />
          <NavRow label="Change Password" />
          <Divider />
          <NavRow label="Email" />
        </Card>

        <SectionLabel title="APP" />
        <Card>
          <NavRow label="Notifications" />
          <Divider />
          <ToggleRow
            label="Dark Mode"
            value={scheme === "dark"}
            onValueChange={(v) => setScheme(v ? "dark" : "light")}
          />
          <Divider />
          <ValueRow label="Language" value="English" />
        </Card>

        <SectionLabel title="ABOUT" />
        <Card>
          <NavRow label="Privacy Policy" />
          <Divider />
          <NavRow label="Terms of Service" />
          <Divider />
          <ValueRow label="App Version" value="1.0.0" />
        </Card>

        <Card>
          <Pressable className="p-md items-center" onPress={handleSignOut}>
            <Text className="font-sans-semibold text-[15px] text-danger">
              Sign Out
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// contentContainerStyle cannot use className; TAB_BAR_BOTTOM_INSET is a runtime
// value — this is the only StyleSheet entry that belongs in this file.
const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_BOTTOM_INSET,
    gap: 24,
  },
});
