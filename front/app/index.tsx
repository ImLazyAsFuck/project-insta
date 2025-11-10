import { useProfileQuery } from "@/hooks/useAccount";
import { getProfile } from "@/services/account.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RelativePathString, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("ACCESS_TOKEN");
        if (!accessToken) {
          router.replace("/(auth)/login");
          return;
        }
    
        const user = await getProfile();
        if (user) {
          router.replace("/(tabs)/feed");
        } else {
          await AsyncStorage.multiRemove(["ACCESS_TOKEN", "REFRESH_TOKEN", "USER"]);
          router.replace("/(auth)/login");
        }
      } catch (error) {
        router.replace("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };    
    checkAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {loading && <ActivityIndicator size="large" />}
    </View>
  );
}
