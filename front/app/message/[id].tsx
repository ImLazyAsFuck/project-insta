import { useProfileQuery } from "@/hooks/useAccount";
import {
  useMessagesQuery,
  useMyConversationsQuery,
  useSendMessageMutation,
  useSendMessageMediaMutation,
} from "@/hooks/useChat";
import { axiosInstance } from "@/utils/axios-instance";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EReactionType } from "@/types/reaction.enum";
import { useReactMessageMutation } from "@/hooks/useChat";

export default function ChatDetailUI() {
  const { data: profile } = useProfileQuery();
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = Number(params.id);
  const { data: conversationsRes } = useMyConversationsQuery();
  const conversation = conversationsRes?.data?.find(
    (c) => c.id === conversationId
  );
  const isGroup = conversation?.group;
  const otherUser =
    conversation?.users?.find((u) => u.id !== profile?.data?.id) ||
    conversation?.users?.[0];

  const flatListRef = useRef<FlatList>(null);
  const [text, setText] = useState("");

  const { data: messagesRes, isLoading } = useMessagesQuery(conversationId);
  const { mutateAsync: sendMessage, isPending: isSendingText } =
    useSendMessageMutation();
  const { mutateAsync: sendMessageMedia, isPending: isSendingMedia } =
    useSendMessageMediaMutation();
  const { mutateAsync: reactMessage, isPending: isReacting } =
    useReactMessageMutation();

  const isSending = isSendingText || isSendingMedia;
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<
    number | null
  >(null);

  const resolveUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = axiosInstance.defaults.baseURL || "";
    const origin = base.replace(/\/api\/v\d+$/, "");
    return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
    setActiveReactionMessageId(null);
  }, [messagesRes?.data?.length]);

  const onPressSend = async () => {
    const content = text.trim();
    if (!content || !profile?.data?.id || !conversationId || isSending) return;
    await sendMessage({
      conversationId,
      content,
      senderId: profile.data.id,
    });
    setText("");
  };

  const onPickImage = async () => {
    if (!profile?.data?.id || !conversationId || isSending) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.9,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const name = asset.fileName || `image_${Date.now()}.jpg`;
    const type = asset.mimeType || "image/jpeg";
    const file = { uri, name, type };

    await sendMessageMedia({
      conversationId,
      senderId: profile.data.id,
      mediaFiles: [file],
    });
  };

  const reactionOptions: { type: EReactionType; emoji: string }[] = [
    { type: EReactionType.LIKE, emoji: "👍" },
    { type: EReactionType.LOVE, emoji: "❤️" },
    { type: EReactionType.HAHA, emoji: "😂" },
    { type: EReactionType.WOW, emoji: "😮" },
    { type: EReactionType.SAD, emoji: "😢" },
    { type: EReactionType.ANGRY, emoji: "😡" },
  ];

  const handleSelectReaction = async (
    messageId: number,
    type: EReactionType
  ) => {
    if (!messageId || isReacting) return;
    try {
      await reactMessage({ messageId, type });
    } finally {
      setActiveReactionMessageId(null);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {!isGroup && !!otherUser?.avatarUrl && (
            <Image
              source={{ uri: resolveUrl(otherUser.avatarUrl) }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                marginRight: 8,
              }}
            />
          )}
          <Text style={styles.username}>
            {isGroup
              ? conversation?.name || "Chat"
              : otherUser?.fullName || "Chat"}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={(messagesRes?.data || []).map((m) => {
          const imageUrls =
            Array.isArray(m.mediaUrls) && m.mediaUrls.length
              ? m.mediaUrls.map((u) => resolveUrl(u))
              : [];
          return {
            id: m.id,
            text: m.content ?? null,
            imageUrls,
            mine: m.sender.id === profile?.data?.id,
            avatar: resolveUrl(m.sender.avatarUrl),
            reactions: m.reactions || [],
          };
        })}
        onScrollBeginDrag={() => setActiveReactionMessageId(null)}
        renderItem={({ item }: any) => {
          const reactionGroups = item.reactions.reduce(
            (
              acc: Partial<
                Record<EReactionType, { count: number; mine: boolean }>
              >,
              reaction: any
            ) => {
              const type = reaction.type as EReactionType;
              if (!acc[type]) {
                acc[type] = {
                  count: 0,
                  mine: reaction.userId === profile?.data?.id,
                };
              }
              acc[type]!.count += 1;
              if (reaction.userId === profile?.data?.id) {
                acc[type]!.mine = true;
              }
              return acc;
            },
            {}
          );
          const reactionEntries = Object.entries(
            reactionGroups
          ) as Array<[EReactionType, { count: number; mine: boolean }]>;

          return (
            <Pressable
              onLongPress={() => setActiveReactionMessageId(item.id)}
              onPress={() => {
                if (activeReactionMessageId === item.id) {
                  setActiveReactionMessageId(null);
                }
              }}
              style={[
                styles.messageContainer,
                item.mine ? styles.myMessage : styles.theirMessage,
              ]}
            >
              {!item.mine && item.avatar && (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              )}
              {item.imageUrls?.length || item.text ? (
                <View
                  style={[
                    styles.bubble,
                    item.mine ? styles.bubbleMine : styles.bubbleTheirs,
                    item.imageUrls?.length
                      ? { padding: 0, backgroundColor: "transparent" }
                      : null,
                  ]}
                >
                  {item.imageUrls?.length ? (
                    <View style={{ gap: 6 }}>
                      {item.imageUrls.length === 1 ? (
                        <Image
                          source={{ uri: item.imageUrls[0] }}
                          style={{ width: 220, height: 220, borderRadius: 12 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 6,
                            maxWidth: 240,
                          }}
                        >
                          {item.imageUrls.map((url: string, idx: number) => (
                            <Image
                              key={`${item.id}_${idx}`}
                              source={{ uri: url }}
                              style={{
                                width: 110,
                                height: 110,
                                borderRadius: 10,
                              }}
                              resizeMode="cover"
                            />
                          ))}
                        </View>
                      )}
                      {!!item.text && (
                        <View
                          style={{
                            alignSelf: "flex-start",
                            backgroundColor: item.mine ? "#007AFF" : "#f0f0f0",
                            borderRadius: 14,
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            marginTop: 4,
                            maxWidth: 240,
                          }}
                        >
                          <Text
                            style={[
                              styles.textMessage,
                              item.mine ? styles.textMine : styles.textTheirs,
                            ]}
                          >
                            {item.text}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.textMessage,
                        item.mine ? styles.textMine : styles.textTheirs,
                      ]}
                    >
                      {item.text}
                    </Text>
                  )}
                </View>
              ) : null}
              {activeReactionMessageId === item.id && (
                <View
                  style={[
                    styles.reactionPicker,
                    item.mine
                      ? styles.reactionPickerMine
                      : styles.reactionPickerTheirs,
                  ]}
                >
                  {reactionOptions.map((reaction) => (
                    <TouchableOpacity
                      key={reaction.type}
                      style={styles.reactionOption}
                      onPress={() => handleSelectReaction(item.id, reaction.type)}
                      disabled={isReacting}
                    >
                      <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {item.reactions?.length ? (
                <View
                  style={[
                    styles.reactionSummary,
                    item.mine
                      ? styles.reactionSummaryMine
                      : styles.reactionSummaryTheirs,
                  ]}
                >
                  {reactionEntries
                    .sort((a, b) => b[1].count - a[1].count)
                    .map(([type, { count, mine }]) => (
                      <View
                        key={`${item.id}_${type}`}
                        style={[
                          styles.reactionSummaryBadge,
                          mine ? styles.reactionSummaryBadgeMine : null,
                        ]}
                      >
                        <Text style={styles.reactionEmoji}>
                          {
                            reactionOptions.find(
                              (option) => option.type === type
                            )?.emoji || "❔"
                          }
                        </Text>
                        <Text style={styles.reactionCount}>{count}</Text>
                      </View>
                    ))}
                </View>
              ) : null}
            </Pressable>
          );
        }}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12, paddingBottom: 80 }}
        ListEmptyComponent={
          isLoading ? (
            <Text style={{ textAlign: "center", color: "#888", marginTop: 12 }}>
              Loading...
            </Text>
          ) : (
            <Text style={{ textAlign: "center", color: "#888", marginTop: 12 }}>
              Say hi to start the conversation
            </Text>
          )
        }
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={onPickImage} disabled={isSending}>
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
            onPress={onPressSend}
            disabled={!text.trim() || isSending}
          >
            <Ionicons name="send" size={22} color={text ? "#007AFF" : "#aaa"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingBottom: 10 },
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

  avatar: { width: 28, height: 28, borderRadius: 14, marginHorizontal: 6 },

  bubble: {
    maxWidth: "70%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  bubbleMine: { backgroundColor: "#007AFF", borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: "#f0f0f0", borderBottomLeftRadius: 4 },

  textMessage: { fontSize: 14 },
  textMine: { color: "#fff" },
  textTheirs: { color: "#000" },

  reactionPicker: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 6,
    gap: 8,
  },
  reactionPickerMine: { alignSelf: "flex-end", marginRight: 4 },
  reactionPickerTheirs: { alignSelf: "flex-start", marginLeft: 34 },
  reactionOption: { paddingHorizontal: 2 },
  reactionEmoji: { fontSize: 18 },

  reactionSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  reactionSummaryMine: { alignSelf: "flex-end", marginRight: 4 },
  reactionSummaryTheirs: { alignSelf: "flex-start", marginLeft: 36 },
  reactionSummaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  reactionSummaryBadgeMine: { backgroundColor: "#dbe8ff" },
  reactionCount: { fontSize: 12, color: "#333", fontWeight: "600" },

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
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    color: "#000",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
});
