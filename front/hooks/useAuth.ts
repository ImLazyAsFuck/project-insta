import {
  JWTResponse,
  LoginRequest,
  RegisterRequest,
} from "@/interfaces/auth.interface";
import { login, logout, register } from "@/services/auth.service";
import { SingleResponse } from "@/utils/response-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

const PROFILE_KEY = ["auth"];

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<JWTResponse>, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: async (res) => {
      const { accessToken, refreshToken } = res.data;
      await AsyncStorage.setItem("ACCESS_TOKEN", accessToken);
      await AsyncStorage.setItem("REFRESH_TOKEN", refreshToken);

      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });

      router.replace("/(tabs)/feed");
		},
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<JWTResponse>, Error, RegisterRequest>({
    mutationFn: register,
    onSuccess: async (res) => {
      const { accessToken, refreshToken } = res.data;
      await AsyncStorage.setItem("ACCESS_TOKEN", accessToken);
      await AsyncStorage.setItem("REFRESH_TOKEN", refreshToken);

      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });

      router.replace("/(tabs)/feed");
    },
    onError: (err) => {
      Alert.alert("Đăng ký thất bại:", err.message);
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      await AsyncStorage.removeItem("ACCESS_TOKEN");
      await AsyncStorage.removeItem("REFRESH_TOKEN");

      queryClient.removeQueries({ queryKey: PROFILE_KEY });

      router.replace("/(auth)/login");
    },
    onError: (err) => {
      Alert.alert("Đăng xuất thất bại:", (err as Error).message);
    },
  });
};
