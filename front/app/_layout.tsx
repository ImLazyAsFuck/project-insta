import { Slot } from "expo-router";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
