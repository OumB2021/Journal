import React from 'react';
import { View, Text } from 'react-native';
import type { ProfileUser } from '@/data/profileMockData';

interface Props {
  user: ProfileUser;
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <View className="items-center gap-0.5">
      <Text className="font-sans-bold text-[22px] text-text-primary">{value}</Text>
      <Text className="font-sans text-[12px] text-icon-strong">{label}</Text>
    </View>
  );
}

export default function StatsBanner({ user }: Props) {
  return (
    <View className="bg-bg-surface border border-border w-full flex-row justify-between items-center rounded-[5px] py-md px-lg">
      <StatItem value={user.postCount} label="Posts" />
      <StatItem value={user.followerCount} label="Followers" />
      <StatItem value={user.followingCount} label="Following" />
    </View>
  );
}
