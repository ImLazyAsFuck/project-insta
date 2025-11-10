import { useProfileQuery } from "@/hooks/useAccount";
import { useOwnPostsQuery } from "@/hooks/usePost";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileMenu from "./profile-menu";

export default function ProfileScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const { data: profileData } = useProfileQuery();
  const profile = profileData?.data;

  const { data: postsData, isLoading } = useOwnPostsQuery();
  const posts = postsData?.data || [];

  const highlights = [
    {
      id: 1,
      title: "New",
      uri: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    },
    {
      id: 2,
      title: "Friends",
      uri: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    },
    {
      id: 3,
      title: "Sport",
      uri: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    },
    {
      id: 4,
      title: "Design",
      uri: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {profile?.username || "..."}
        </Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={28} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Profile Info */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
          <Image
            source={{ uri: profile?.avatarUrl || "https://placehold.co/120x120" }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {profile?.postCount ?? 0}
              </Text>
              <Text>Posts</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => router.push("/(tabs)/profile/followers")}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.followersCount ?? 0}
                </Text>
                <Text>Followers</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={() => router.push("/(tabs)/profile/following")}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.followingCount ?? 0}
                </Text>
                <Text>Following</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* User Info */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontWeight: "bold" }}>
            {profile?.fullName || profile?.username || ""}
          </Text>
          {profile?.bio ? <Text>{profile.bio}</Text> : null}
          {profile?.website ? <Text>{profile.website}</Text> : null}
          <TouchableOpacity
            style={{
              marginTop: 10,
              borderWidth: 1,
              borderColor: "#ddd",
              paddingVertical: 6,
              borderRadius: 6,
              alignItems: "center",
            }}
            onPress={() => router.push("/(tabs)/profile/edit")}
          >
            <Text>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Highlights */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 20, paddingLeft: 20 }}
        >
          {highlights.map((item) => (
            <View key={item.id} style={{ alignItems: "center", marginRight: 15 }}>
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              />
              <Text style={{ fontSize: 12, marginTop: 4 }}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            borderTopWidth: 0.5,
            borderColor: "#ddd",
          }}
        >
          <Ionicons name="grid-outline" size={28} />
          <Ionicons name="person-outline" size={28} />
        </View>

        {/* Grid Posts from API */}
        {isLoading ? (
          <Text style={{ padding: 20 }}>Loading posts...</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 2 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 1 / 3, margin: 1 }}
              >
                {item.mediaList?.[0]?.url ? (
                  <Image
                    source={{ uri: item.mediaList[0].url }}
                    style={{ width: "100%", aspectRatio: 1, borderRadius: 4 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      backgroundColor: "#eee",
                      borderRadius: 4,
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>

      <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}
