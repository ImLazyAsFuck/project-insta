import { useProfileQuery } from "@/hooks/useAccount";
import {
  useCommentsByPostQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentReactionMutation,
} from "@/hooks/useComment";
import { CommentResponse } from "@/interfaces/comment.interface";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  postId: number;
}

export const CommentModal = ({
  visible,
  onClose,
  postId,
}: CommentModalProps) => {
  const { data } = useCommentsByPostQuery(postId);
  const { data: profileData } = useProfileQuery();
  const createComment = useCreateCommentMutation();
  const deleteComment = useDeleteCommentMutation();
  const toggleReaction = useToggleCommentReactionMutation();

  const currentUser = profileData?.data;
  const [newComment, setNewComment] = useState("");

  const comments = useMemo(() => {
    if (!data?.data) return [];

    const map = new Map<
      number,
      CommentResponse & { childComments: CommentResponse[] }
    >();
    data.data.forEach((c) => {
      map.set(c.id, { ...c, childComments: [] });
    });

    const roots: (CommentResponse & { childComments: CommentResponse[] })[] =
      [];

    data.data.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        const parent = map.get(c.parentId)!;
        parent.childComments.push(map.get(c.id)!);
      } else {
        roots.push(map.get(c.id)!);
      }
    });

    return roots;
  }, [data]);

  const handleAddComment = (parentId?: number | null) => {
    if (!newComment.trim() || !currentUser) return;
    createComment.mutate({ content: newComment, postId, parentId });
    setNewComment("");
  };

  const CommentText = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpand = () => setExpanded(!expanded);
    if (text.length <= 100)
      return <Text style={styles.commentText}>{text}</Text>;
    return (
      <Text style={styles.commentText}>
        {expanded ? text : text.slice(0, 100) + "..."}
        <Text style={{ color: "#007AFF" }} onPress={toggleExpand}>
          {expanded ? " Ẩn bớt" : " Xem thêm"}
        </Text>
      </Text>
    );
  };

  const renderReply = (reply: CommentResponse) => (
    <View key={reply.id} style={styles.replyItem}>
      <Image
        source={{ uri: reply.user.avatarUrl }}
        style={styles.commentAvatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.commentUsername}>{reply.user.username}</Text>
        {reply.replyToUsername && (
          <Text style={{ fontSize: 12, color: "#555" }}>
            Trả lời {reply.replyToUsername}
          </Text>
        )}
        <CommentText text={reply.content} />
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.reactionRow}
            onPress={() =>
              toggleReaction.mutate({ commentId: reply.id, postId })
            }
          >
            <Feather
              name="heart"
              size={16}
              color={reply.reactedByCurrentUser ? "red" : "gray"}
            />
            <Text style={styles.reactionCount}>{reply.reactionCount}</Text>
          </TouchableOpacity>
          {reply.user.username === currentUser?.username && (
            <TouchableOpacity
              onPress={() =>
                deleteComment.mutate({ commentId: reply.id, postId })
              }
            >
              <Text style={styles.deleteText}>Xoá</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderComment = ({
    item,
  }: {
    item: CommentResponse & { childComments?: CommentResponse[] };
  }) => {
    return (
      <View style={styles.commentItem}>
        <Image
          source={{ uri: item.user.avatarUrl }}
          style={styles.commentAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.commentUsername}>{item.user.username}</Text>
          <CommentText text={item.content} />
          <View style={styles.commentActions}>
            <TouchableOpacity
              style={styles.reactionRow}
              onPress={() =>
                toggleReaction.mutate({ commentId: item.id, postId })
              }
            >
              <Feather
                name="heart"
                size={16}
                color={item.reactedByCurrentUser ? "red" : "gray"}
              />
              <Text style={styles.reactionCount}>{item.reactionCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAddComment(item.id)}>
              <Text style={styles.replyText}>Trả lời</Text>
            </TouchableOpacity>
            {item.user.username === currentUser?.username && (
              <TouchableOpacity
                onPress={() =>
                  deleteComment.mutate({ commentId: item.id, postId })
                }
              >
                <Text style={styles.deleteText}>Xoá</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Render replies */}
          {item.childComments?.map((reply) => renderReply(reply))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      style={{ padding: 10 }}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {currentUser && (
          <View style={styles.inputRow}>
            <Image
              source={{ uri: currentUser.avatarUrl }}
              style={styles.inputAvatar}
            />
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
            </View>
            <TouchableOpacity onPress={() => handleAddComment()}>
              <Feather name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: "#fff", paddingVertical: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    marginTop: 10,
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  closeText: { fontSize: 18, color: "#007AFF" },

  commentItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  replyItem: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingLeft: 50,
    alignItems: "flex-start",
  },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  commentUsername: { fontWeight: "bold", marginBottom: 2 },
  commentText: { fontSize: 14 },
  commentActions: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  reactionRow: { flexDirection: "row", alignItems: "center" },
  reactionCount: { marginLeft: 4, color: "gray", fontSize: 12 },
  deleteText: { marginLeft: 15, color: "red", fontSize: 12 },
  replyText: { marginLeft: 15, color: "#007AFF", fontSize: 12 },

  inputRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  inputAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});
