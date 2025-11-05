import {
  Feather,
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useAuthGuard } from "@/utils/use-auth-guard";

export default function TabLayout() {
  useAuthGuard();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "",
          tabBarIcon: ({ color }) => {
            return <FontAwesome name="home" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",

          tabBarIcon: ({ color }) => {
            return <Feather name="search" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "",

          tabBarIcon: ({ color }) => {
            return <FontAwesome6 name="add" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="like"
        options={{
          title: "",
          tabBarIcon: ({ color }) => {
            return (
              <FontAwesome name="heart-o" size={24} color={color} />
              // <FontAwesome name="heart" size={24} color="black" />
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons name="account" size={24} color={color} />
            );
          },
        }}
      />
    </Tabs>
  );
}
