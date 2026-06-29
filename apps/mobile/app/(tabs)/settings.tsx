import React, { useState } from "react";
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
import { useTheme } from "@/theme/useTheme";
import { TAB_BAR_BOTTOM_INSET } from "@/components/TabBar";

// ── Section label ─────────────────────────────────────────────────────
function SectionLabel({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.sectionLabel, { color: colors.iconStrong }]}>
      {title}
    </Text>
  );
}

// ── Row divider ────────────────────────────────────────────────────────
function Divider() {
  const { colors } = useTheme();
  return (
    <View style={[styles.divider, { backgroundColor: colors.borderDefault }]} />
  );
}

// ── Navigation row (label + chevron) ─────────────────────────────────
function NavRow({ label, onPress }: { label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      android_ripple={{ color: colors.borderDefault }}
    >
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
        {label}
      </Text>
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
      style={styles.row}
      onPress={onPress}
      android_ripple={{ color: colors.borderDefault }}
    >
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
        {label}
      </Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.valueText, { color: colors.iconStrong }]}>
          {value}
        </Text>
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
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>
        {label}
      </Text>
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
      style={[
        styles.card,
        {
          backgroundColor: colors.bgSurface,
          borderColor: colors.borderDefault,
          borderRadius,
        },
      ]}
    >
      {children}
    </View>
  );
}

// ── Settings Screen ────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { colors, static: staticColors, scheme } = useTheme();
  // const { signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(scheme === "dark");

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => {} },
    ]);
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bgBase }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
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
            value={darkMode}
            onValueChange={setDarkMode}
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
          <Pressable style={styles.signOutRow} onPress={() => {}}>
            <Text
              style={[styles.signOutText, { color: staticColors.accentDanger }]}
            >
              Sign Out
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: TAB_BAR_BOTTOM_INSET,
    gap: 24,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 34,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 2,
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  rowLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  valueText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  signOutRow: {
    padding: 16,
    alignItems: "center",
  },
  signOutText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
});
