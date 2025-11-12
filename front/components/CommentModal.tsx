import { useProfileQuery } from "@/hooks/useAccount";
import {
  useCommentsByPostQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentReactionMutation,
} from "@/hooks/useComment";
import { CommentResponse } from "@/interfaces/comment.interface";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
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
  const [replyingTo, setReplyingTo] = useState<{
    commentId: number;
    username: string;
  } | null>(null);
  const inputRef = useRef<TextInput>(null);

  const comments = useMemo(() => {
    if (!data?.data) return [];

    // Build a set of all comment IDs that are children (have parentId)
    const childIds = new Set<number>();
    data.data.forEach((c) => {
      if (c.parentId) {
        childIds.add(c.id);
      }
    });

    // If there are no child comments, API might return nested structure
    // Check if any root comment has childComments populated
    const rootComments = data.data.filter((c) => !c.parentId);
    const hasNestedStructure = rootComments.some(
      (c) => c.childComments && c.childComments.length > 0
    );

    if (hasNestedStructure && childIds.size === 0) {
      // API returns nested structure and no flat children, use as is
      return rootComments;
    }

    // API returns flat list (or mixed), build tree structure
    const map = new Map<
      number,
      CommentResponse & { childComments: CommentResponse[] }
    >();
    
    // First pass: create map with all comments, preserve existing childComments if any
    data.data.forEach((c) => {
      // If this comment is a child (has parentId), don't include its childComments
      // as they might be duplicates from nested structure
      if (c.parentId) {
        map.set(c.id, { ...c, childComments: [] });
      } else {
        map.set(c.id, { ...c, childComments: c.childComments || [] });
      }
    });

    const roots: (CommentResponse & { childComments: CommentResponse[] })[] =
      [];

    // Second pass: build tree structure from flat list
    data.data.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        const parent = map.get(c.parentId)!;
        const childComment = map.get(c.id)!;
        // Only add if not already in parent's childComments
        if (!parent.childComments.some((child) => child.id === childComment.id)) {
          parent.childComments.push(childComment);
        }
      } else if (!c.parentId) {
        // Only add to roots if not already there
        if (!roots.some((root) => root.id === c.id)) {
          roots.push(map.get(c.id)!);
        }
      }
    });

    return roots;
  }, [data]);

  const handleAddComment = (parentId?: number | null) => {
    if (!newComment.trim() || !currentUser) return;
    createComment.mutate({ content: newComment, postId, parentId });
    setNewComment("");
    setReplyingTo(null);
  };

  const handleReplyClick = (commentId: number, username: string) => {
    setReplyingTo({ commentId, username });
    // Focus the input after a short delay to ensure the modal is ready
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
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
          <TouchableOpacity onPress={() => handleReplyClick(reply.id, reply.user.username)}>
            <Text style={styles.replyText}>Trả lời</Text>
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
            <TouchableOpacity onPress={() => handleReplyClick(item.id, item.user.username)}>
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

  const handleClose = () => {
    setReplyingTo(null);
    setNewComment("");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
          <TouchableOpacity onPress={handleClose}>
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
          <View style={styles.inputContainer}>
            {replyingTo && (
              <View style={styles.replyIndicator}>
                <Text style={styles.replyIndicatorText}>
                  Trả lời {replyingTo.username}
                </Text>
                <TouchableOpacity onPress={handleCancelReply}>
                  <Feather name="x" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <Image
                source={{ uri: currentUser.avatarUrl }}
                style={styles.inputAvatar}
              />
              <View style={{ flex: 1 }}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder={replyingTo ? `Trả lời ${replyingTo.username}...` : "Add a comment..."}
                  value={newComment}
                  onChangeText={setNewComment}
                />
              </View>
              <TouchableOpacity onPress={() => handleAddComment(replyingTo?.commentId)}>
                <Feather name="send" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
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
    paddingRight: 10,
    alignItems: "flex-start",
    marginTop: 4,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  commentUsername: { fontWeight: "bold", marginBottom: 2 },
  commentText: { fontSize: 14 },
  commentActions: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  reactionRow: { flexDirection: "row", alignItems: "center" },
  reactionCount: { marginLeft: 4, color: "gray", fontSize: 12 },
  deleteText: { marginLeft: 15, color: "red", fontSize: 12 },
  replyText: { marginLeft: 15, color: "#007AFF", fontSize: 12 },

  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  replyIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  replyIndicatorText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
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
