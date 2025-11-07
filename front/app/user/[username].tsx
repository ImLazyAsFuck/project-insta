import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOtherProfileQuery } from "@/hooks/useUser";
import { useSendFollowRequestMutation } from "@/hooks/useFollow";

export default function OtherProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username?: string }>();
  const username = params.username;
  console.log(username);

  const { data, isLoading } = useOtherProfileQuery(username);
  const profile = data?.data;
  const sendFollowMutation = useSendFollowRequestMutation();

  const handleFollow = () => {
    if (!profile?.id) return;
    
    sendFollowMutation.mutate(profile.id, {
      onSuccess: () => {
        Alert.alert("Success", "Follow request sent successfully");
      },
      onError: (error: any) => {
        Alert.alert("Error", error?.message || "Failed to send follow request");
      },
    });
  };

  const handleFollowersPress = () => {
    if (profile?.username) {
      router.push(`/(tabs)/profile/followers?username=${profile.username}`);
    }
  };

  const handleFollowingPress = () => {
    if (profile?.username) {
      router.push(`/(tabs)/profile/following?username=${profile.username}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {username || "Profile"}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
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
              <TouchableOpacity style={{ alignItems: "center" }} onPress={handleFollowersPress}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.followersCount ?? 0}
                </Text>
                <Text>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }} onPress={handleFollowingPress}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.followingCount ?? 0}
                </Text>
                <Text>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: "bold" }}>
              {profile?.fullName || profile?.username || username}
            </Text>
            {profile?.bio ? <Text>{profile.bio}</Text> : null}
            {profile?.website ? <Text>{profile.website}</Text> : null}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  paddingVertical: 6,
                  borderRadius: 6,
                  alignItems: "center",
                  backgroundColor: "#000",
                  opacity: sendFollowMutation.isPending ? 0.6 : 1,
                }}
                onPress={handleFollow}
                disabled={sendFollowMutation.isPending}
              >
                {sendFollowMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Follow</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  paddingVertical: 6,
                  borderRadius: 6,
                  alignItems: "center",
                }}
              >
                <Text>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              borderTopWidth: 0.5,
              borderColor: "#ddd",
              marginTop: 20,
              paddingTop: 10,
            }}
          >
            <Ionicons name="grid-outline" size={28} />
            <Ionicons name="person-outline" size={28} />
          </View>

          <FlatList
            data={[]}
            keyExtractor={(_, index) => String(index)}
            numColumns={3}
            renderItem={() => null}
            ListEmptyComponent={() => (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text>No posts yet</Text>
              </View>
            )}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


