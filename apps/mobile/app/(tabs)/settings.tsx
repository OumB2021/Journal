import React from "react";
import {
  View,
  Text,
  Pressable,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
// import { useAuth } from "@clerk/clerk-expo";
import { useTheme, useSetScheme } from "@/theme/useTheme";
import { TAB_BAR_BOTTOM_INSET } from "@/components/TabBar";

// ── Section label ─────────────────────────────────────────────────────
function SectionLabel({ title }: { title: string }) {
  return (
    <Text className="font-sans-semibold text-[11px] tracking-[2px] text-icon-strong">
      {title}
    </Text>
  );
}

// ── Row divider ────────────────────────────────────────────────────────
function Divider() {
  return <View className="h-px bg-border" />;
}

// ── Navigation row (label + chevron) ─────────────────────────────────
function NavRow({ label, onPress }: { label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      className="flex-row items-center justify-between p-md"
      onPress={onPress}
      android_ripple={{ color: colors.borderDefault }}
    >
      <Text className="font-sans text-[15px] text-text-primary">{label}</Text>
      <Feather name="chevron-right" size={18} color={colors.iconStrong} />
    </Pressable>
  );
}

// ── Value row (label + value string + chevron) ─────────────────────────
function ValueRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      className="flex-row items-center justify-between p-md"
      onPress={onPress}
      android_ripple={{ color: colors.borderDefault }}
    >
      <Text className="font-sans text-[15px] text-text-primary">{label}</Text>
      <View className="flex-row items-center gap-xs">
        <Text className="font-sans text-[14px] text-icon-strong">{value}</Text>
        <Feather name="chevron-right" size={16} color={colors.iconStrong} />
      </View>
    </Pressable>
  );
}

// ── Toggle row (label + Switch) ────────────────────────────────────────
function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-between p-md">
      <Text className="font-sans text-[15px] text-text-primary">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.borderStrong, true: colors.interactiveBg }}
        thumbColor={colors.bgSurface}
        ios_backgroundColor={colors.borderStrong}
      />
    </View>
  );
}

// ── Section card ───────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  const { colors, radii, scheme } = useTheme();
  const borderRadius = scheme === "dark" ? radii.dark.s : radii.light.s;
  return (
    <View
      className="border overflow-hidden"
      style={{ backgroundColor: colors.bgSurface, borderColor: colors.borderDefault, borderRadius }}
    >
      {children}
    </View>
  );
}

// ── Settings Screen ────────────────────────────────────────────────────
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

        {/* Sign Out — its own section in accentDanger */}
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

// contentContainerStyle must be a style object (not className); TAB_BAR_BOTTOM_INSET
// is a runtime value, so this is the only StyleSheet entry that remains.
const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_BOTTOM_INSET,
    gap: 24,
  },
});
