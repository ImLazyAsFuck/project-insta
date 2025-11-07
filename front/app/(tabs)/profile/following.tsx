import { useFollowingsQuery } from "@/hooks/useFollow";
import { ProfileResponse } from "@/interfaces/profile.interface";
import { Ionicons } from "@expo/vector-icons";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FollowingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username?: string }>();
  const { data, isLoading } = useFollowingsQuery();
  const followings = data?.data || [];

  const handleUserPress = (username: string) => {
    router.push(`/user/${username}` as RelativePathString);
  };

  const renderFollowing = ({ item }: { item: ProfileResponse }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item.username)}
    >
      <Image
        source={{ uri: item.avatarUrl || "https://placehold.co/60x60" }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        {item.fullName && <Text style={styles.fullName}>{item.fullName}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {params.username ? `${params.username}'s Following` : "Following"}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : followings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Not following anyone</Text>
        </View>
      ) : (
        <FlatList
          data={followings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFollowing}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
  listContainer: {
    padding: 12,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  fullName: {
    fontSize: 14,
    color: "#666",
  },
});
