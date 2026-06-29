import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/useTheme";

export function SectionLabel({ title }: { title: string }) {
  return (
    <Text className="font-sans-semibold text-[11px] tracking-[2px] text-icon-strong">
      {title}
    </Text>
  );
}

export function Divider() {
  return <View className="h-px bg-border" />;
}

export function NavRow({
  label,
  onPress,
}: {
  label: string;
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
      <Feather name="chevron-right" size={18} color={colors.iconStrong} />
    </Pressable>
  );
}

export function ValueRow({
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

export function ToggleRow({
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

export function Card({ children }: { children: React.ReactNode }) {
  const { colors, radii, scheme } = useTheme();
  const borderRadius = scheme === "dark" ? radii.dark.s : radii.light.s;
  return (
    <View
      className="border overflow-hidden"
      style={{
        backgroundColor: colors.bgSurface,
        borderColor: colors.borderDefault,
        borderRadius,
      }}
    >
      {children}
    </View>
  );
}
