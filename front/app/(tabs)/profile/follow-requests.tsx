import {
  useAcceptFollowRequestMutation,
  useFollowRequestsQuery,
  useRejectFollowRequestMutation,
} from "@/hooks/useFollow";
import { ProfileResponse } from "@/interfaces/profile.interface";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FollowRequestsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch } = useFollowRequestsQuery();
  const acceptMutation = useAcceptFollowRequestMutation();
  const rejectMutation = useRejectFollowRequestMutation();

  const requests = data?.data || [];

  const handleAccept = (followId: number) => {
    acceptMutation.mutate(followId, {
      onSuccess: () => {
        refetch();
      },
      onError: (error: any) => {
        Alert.alert("Error", error?.message || "Failed to accept request");
      },
    });
  };

  const handleReject = (followId: number) => {
    rejectMutation.mutate(followId, {
      onSuccess: () => {
        refetch();
      },
      onError: (error: any) => {
        Alert.alert("Error", error?.message || "Failed to reject request");
      },
    });
  };

  const handleUserPress = (username: string) => {
    router.push(`/user/${username}`);
  };

  const renderRequest = ({ item }: { item: ProfileResponse }) => (
    <View style={styles.userItem}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => handleUserPress(item.username)}
      >
        <Image
          source={{ uri: item.avatarUrl || "https://placehold.co/60x60" }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{item.username}</Text>
          {item.fullName && (
            <Text style={styles.fullName}>{item.fullName}</Text>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => handleAccept(item.id)}
          disabled={acceptMutation.isPending || rejectMutation.isPending}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleReject(item.id)}
          disabled={acceptMutation.isPending || rejectMutation.isPending}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow Requests</Text>
        <View style={{ width: 26 }} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No follow requests</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRequest}
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
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#efefef",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
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
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#0095f6",
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  rejectButton: {
    backgroundColor: "#efefef",
  },
  rejectButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});
