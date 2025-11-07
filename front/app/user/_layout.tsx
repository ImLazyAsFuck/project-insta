import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="[username]" options={{ title: "Trang cá nhân" }} />
    </Stack>
  );
}
