import { useProfileQuery } from "@/hooks/useAccount";
import { useFollowingsQuery } from "@/hooks/useFollow";
import { useOwnPostsQuery } from "@/hooks/usePost";
import { ProfileResponse } from "@/interfaces/profile.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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

  const { data: followingsData, isLoading: isFollowingsLoading } =
    useFollowingsQuery();

  const followings = useMemo(() => {
    const list =
      (followingsData?.data as (ProfileResponse & {
        createdAt?: string;
      })[]) || [];

    return [...list].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aTime === bTime) {
        return (b.id || 0) - (a.id || 0);
      }
      return bTime - aTime;
    });
  }, [followingsData]);

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
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 20 }}
        >
          <Image
            source={{
              uri: profile?.avatarUrl || "https://placehold.co/120x120",
            }}
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
          style={{
            marginVertical: 20,
            paddingLeft: 20,
            paddingBottom: 10,
            borderBottomWidth: 0.5,
            borderBottomColor: "#ddd",
          }}
        >
          {isFollowingsLoading ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text>Đang tải bạn bè...</Text>
            </View>
          ) : followings.length ? (
            followings.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={{ alignItems: "center", marginRight: 15 }}
                onPress={() => router.push(`/user/${user.username}`)}
                activeOpacity={0.8}
              >
                <Image
                  source={{
                    uri: user.avatarUrl || "https://placehold.co/120x120",
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: "#ddd",
                  }}
                />
                <Text style={{ fontSize: 12, marginTop: 4 }} numberOfLines={1}>
                  {user.fullName || user.username}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text>Chưa có bạn bè nào</Text>
            </View>
          )}
        </ScrollView>

        {/* Grid Posts from API */}
        {isLoading ? (
          <Text style={{ padding: 20 }}>Loading posts...</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            scrollEnabled={false}
            columnWrapperStyle={{
              marginBottom: 2,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ flex: 1 / 3, margin: 1 }}
                onPress={() =>
                  router.push({
                    pathname: "/post/[id]",
                    params: { id: item.id.toString() },
                  })
                }
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

      <ProfileMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </SafeAreaView>
  );
}
