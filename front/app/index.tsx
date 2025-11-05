import React from "react";
import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  return (
    <SafeAreaView className="flex justify-center items-center">
      <Image className="w-20 h-10" src="https://res-console.cloudinary.com/dyvpntnlo/thumbnails/v1/image/upload/v1762311398/aW5zdGFncmFtX2dnZnlkdw==/drilldown" />
      <Text>Hello</Text>
    </SafeAreaView>
  );
}
