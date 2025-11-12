import { useProfileQuery } from "@/hooks/useAccount";
import { useMyConversationsQuery } from "@/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

type RenderedMessage = {
  id: number;
  name: string;
  avatar: string;
  message: string;
  time: string;
};

export default function Messages() {
  const { data: profile } = useProfileQuery();
  const { data: conversations, isLoading } = useMyConversationsQuery();
  const router = useRouter();

  const [conversationData, setConversationData] = useState<
    RenderedMessage[] | undefined
  >([]);

  useEffect(() => {
    if (conversations?.data) {
      const mapped: RenderedMessage[] = conversations.data.map((conv) => {
        const lastMessage = conv.messages?.[conv.messages.length - 1];
        console.log(conversations.data);
        
        const isGroup = conv.group;
        const meId = profile?.data?.id;
        const otherUser =
          conv.users?.find((u) => u.id !== meId) || conv.users?.[0];

        console.log(otherUser);

        return {
          id: conv.id,
          name: isGroup ? conv.name : otherUser?.fullName || conv.name,
          avatar: isGroup
            ? "https://cdn-icons-png.flaticon.com/512/74/74472.png"
            : otherUser?.avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          message:
            lastMessage?.content ||
            (lastMessage?.mediaUrls?.length ? "📷 Photo" : "") ||
            "",
          time: lastMessage
            ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        };
      });
      setConversationData(mapped);
    }
  }, [conversations?.data, profile?.data?.id]);

  const renderItem = ({ item }: { item: RenderedMessage }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/message/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.username}>Messages</Text>
        <TouchableOpacity onPress={() => router.push("/feed")}>
          <Ionicons name="add-circle-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : conversationData?.length ? (
        <FlatList
          data={conversationData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  cameraButton: { color: "#007AFF", fontSize: 16, fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },
});
