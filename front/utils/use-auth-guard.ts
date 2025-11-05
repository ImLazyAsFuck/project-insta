import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export function useAuthGuard() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const token = await AsyncStorage.getItem("ACCESS_TOKEN");
        if (!token) {
          router.replace("/(auth)/login");
        }
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  return { checking };
}


