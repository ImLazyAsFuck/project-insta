import { useAuthGuard } from "@/utils/use-auth-guard";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMyMessagesQuery } from "@/hooks/useChat";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function Messages() {
  useAuthGuard();
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useMyMessagesQuery();
  const [search, setSearch] = useState("");

  const messages = (data?.data || []).filter((item) => {
    const partner =
      item.sender?.id === user?.id ? item.receiver : item.sender;
    return partner?.username?.toLowerCase().includes(search.toLowerCase());
  });

  const renderItem = ({ item }) => {
    const partner =
      item.sender?.id === user?.id ? item.receiver : item.sender;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          router.push({
            pathname: "/message/[id]",
            params: { id: item.conversationId },
          })
        }
      >
        <Image
          source={{
            uri:
              partner?.avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.avatar}
        />

        <View style={styles.messageInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{partner?.username}</Text>
            <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
          </View>
          <Text style={styles.message} numberOfLines={1}>
            {item.mediaUrl?.length
              ? "📷 Photo"
              : item.content || "No message yet"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "red", marginBottom: 10 }}>
          Failed to load messages
        </Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={{ color: "#007AFF" }}>Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.username}>Messages</Text>
        <TouchableOpacity>
          <Text style={styles.plusIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => String(item.conversationId)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cameraBtn}>
          <Text style={styles.cameraButton}>📷 Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function formatTime(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diff = (Date.now() - date.getTime()) / 1000;

  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  const d = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return d;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ddd",
  },
  backArrow: { fontSize: 22, color: "#000" },
  username: { fontWeight: "bold", fontSize: 18, color: "#000" },
  plusIcon: { fontSize: 28, color: "#000" },

  searchContainer: {
    backgroundColor: "#f2f2f2",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 8,
  },
  searchInput: { color: "#000", fontSize: 15 },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.3,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  messageInfo: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontWeight: "600", fontSize: 15, color: "#000" },
  message: { color: "#666", fontSize: 13, marginTop: 3 },
  time: { color: "#999", fontSize: 12, marginLeft: 8 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 14,
  },
  cameraBtn: {
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  cameraButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
