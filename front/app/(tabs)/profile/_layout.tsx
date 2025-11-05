import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Trang cá nhân" }} />
      <Stack.Screen name="edit" options={{ title: "Chỉnh sửa cá nhân" }} />
    </Stack>
  );
}
