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

        const user = await AsyncStorage.getItem("USER");
        if (user) {
          router.replace("/(tabs)/index" as RelativePathString);
        } else {
          router.replace("/(auth)/feed/index" as RelativePathString);
        }
      } catch (error) {
        router.replace("/(auth)/index" as RelativePathString);
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
