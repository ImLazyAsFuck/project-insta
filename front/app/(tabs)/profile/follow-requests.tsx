import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function FollowRequestsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/(tabs)/notification/follow-request");
  }, [router]);
  return <View />;
}
