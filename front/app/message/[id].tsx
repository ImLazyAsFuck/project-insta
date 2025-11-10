import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useMessagesQuery,
  useSendMessageMutation,
} from "@/hooks/useChat";
import { Ionicons } from "@expo/vector-icons";

export default function ChatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Number(id);
  const flatListRef = useRef<FlatList>(null);
  const [text, setText] = useState("");

  const { data, isLoading, isError, refetch } =
    useMessagesQuery(conversationId);
  const sendMessageMutation = useSendMessageMutation();

  const messages = data?.data || [];

  // Tự scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessageMutation.mutate({
      conversationId,
      senderId:  // TODO: lấy từ context hoặc userInfo
      content: text,
      mediaUrl: [],
    });
    setText("");
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
        <Text style={{ color: "red" }}>Failed to load messages</Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={{ color: "#007AFF" }}>Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item }: any) => {
    const isMine = item.senderId === 1; // TODO: thay 1 bằng userId thực tế
    return (
      <View
        style={[
          styles.messageContainer,
          isMine ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isMine && (
          <Image
            source={{
              uri:
                item.sender?.avatarUrl ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleTheirs,
          ]}
        >
          {item.mediaUrl && (
            <Image
              source={{ uri: item.mediaUrl }}
              style={styles.imageMessage}
            />
          )}
          {item.content ? (
            <Text
              style={[
                styles.textMessage,
                isMine ? styles.textMine : styles.textTheirs,
              ]}
            >
              {item.content}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.username}>
          {data?.data?.[0]?.sender?.username || "Chat"}
        </Text>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity>
            <Ionicons name="image-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TextInput
            placeholder="Message..."
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={sendMessageMutation.isPending}
          >
            <Ionicons
              name="send"
              size={22}
              color={sendMessageMutation.isPending ? "#aaa" : "#007AFF"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  username: { fontWeight: "bold", fontSize: 16, color: "#000" },

  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  myMessage: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  theirMessage: { alignSelf: "flex-start" },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
  },

  bubble: {
    maxWidth: "70%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  textMessage: { fontSize: 14 },
  textMine: { color: "#fff" },
  textTheirs: { color: "#000" },

  imageMessage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },

  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    color: "#000",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});
