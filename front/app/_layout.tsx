import { Stack } from "expo-router";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="index"
      ></Stack>
    </GluestackUIProvider>
  );
}
