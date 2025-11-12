// app/notifications/_layout.js
import { Stack, useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const current = segments[segments.length - 1];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, current === "follow-request" && styles.activeTab]}
          onPress={() => router.push("/(tabs)/notification/follow-request")}
        >
          <Text
            style={
              current === "follow-request"
                ? styles.tabTextActive
                : styles.tabTextInactive
            }
          >
            Follow Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, current === "notification" && styles.activeTab]}
          onPress={() => router.push("/(tabs)/notification")}
        >
          <Text
            style={
              current === "notification"
                ? styles.tabTextActive
                : styles.tabTextInactive
            }
          >
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8ff",
  },
  tab: {
    paddingVertical: 10,
    width: "50%",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabTextActive: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  tabTextInactive: {
    fontSize: 16,
    color: "#888",
  },
});
