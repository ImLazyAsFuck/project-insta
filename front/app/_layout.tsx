import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Slot } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Slot initialRouteName="(auth)/" />
    </GluestackUIProvider>
  );
}
