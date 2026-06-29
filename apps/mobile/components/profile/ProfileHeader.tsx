import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import type { ProfileUser } from '@/data/profileMockData';

interface Props {
  user: ProfileUser;
}

export default function ProfileHeader({ user }: Props) {
  return (
    <>
      <View className="w-24 h-24 rounded-full overflow-hidden">
        <Image
          source={{ uri: user.avatarUrl }}
          style={{ width: 96, height: 96 }}
          contentFit="cover"
        />
      </View>

      <Text className="font-sans-bold text-[22px] text-text-primary">
        {user.name}
      </Text>

      <Text
        className="font-sans text-[14px] text-icon-strong text-center"
        style={{ lineHeight: 21 }}
      >
        {user.bio}
      </Text>
    </>
  );
}
