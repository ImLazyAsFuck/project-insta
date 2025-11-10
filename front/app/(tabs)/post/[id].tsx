import { useProfileQuery } from "@/hooks/useAccount";
import {
  useCommentsByPostQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentReactionMutation,
} from "@/hooks/useComment";
import {
  usePostDetailQuery,
  useTogglePostReactionMutation,
} from "@/hooks/usePost";
import { CommentResponse } from "@/interfaces/comment.interface";
import { Feather } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const PostDetailScreen = () => {
  const route = useRoute<any>();
  const postId = route.params?.postId;

  const { data: postDetail } = usePostDetailQuery(postId);
  const { data: commentsData } = useCommentsByPostQuery(postId);
  const { data: profileData } = useProfileQuery();

  const createComment = useCreateCommentMutation();
  const deleteComment = useDeleteCommentMutation();
  const toggleCommentReaction = useToggleCommentReactionMutation();
  const togglePostReaction = useTogglePostReactionMutation();

  const currentUser = profileData?.data;
  const post = postDetail?.data;
  const comments = useMemo(() => {
    if (!commentsData?.data) return [];

    const map = new Map<
      number,
      CommentResponse & { childComments: CommentResponse[] }
    >();
    commentsData.data.forEach((c) =>
      map.set(c.id, { ...c, childComments: [] })
    );

    const roots: (CommentResponse & { childComments: CommentResponse[] })[] =
      [];
    commentsData.data.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.childComments.push(map.get(c.id)!);
      } else roots.push(map.get(c.id)!);
    });

    return roots;
  }, [commentsData]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = (parentId?: number | null) => {
    if (!newComment.trim()) return;
    createComment.mutate({ content: newComment, postId, parentId });
    setNewComment("");
  };

  const handleTogglePostReaction = () => {
    togglePostReaction.mutate({ postId });
  };

  const CommentText = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);
    if (text.length <= 100)
      return <Text style={styles.commentText}>{text}</Text>;
    return (
      <Text style={styles.commentText}>
        {expanded ? text : text.slice(0, 100) + "..."}
        <Text style={styles.seeMore} onPress={() => setExpanded(!expanded)}>
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
          <Text style={styles.replyToText}>
            Trả lời {reply.replyToUsername}
          </Text>
        )}
        <CommentText text={reply.content} />
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.reactionRow}
            onPress={() =>
              toggleCommentReaction.mutate({ commentId: reply.id, postId })
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
  }) => (
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
              toggleCommentReaction.mutate({ commentId: item.id, postId })
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

        {item.childComments?.map((reply) => renderReply(reply))}
      </View>
    </View>
  );

  if (!post) return <Text style={{ padding: 20 }}>Đang tải...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView>
        <View style={styles.postHeader}>
          <Image source={{ uri: post.user.avatarUrl }} style={styles.avatar} />
          <Text style={styles.username}>{post.user.username}</Text>
        </View>

        {post.mediaList[0]?.type === "IMAGE" ? (
          <Image
            source={{ uri: post.mediaList[0].url }}
            style={styles.postImage}
          />
        ) : (
          <Video
            source={{ uri: post.mediaList[0].url }}
            style={styles.postImage}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
        )}

        <View style={styles.postActions}>
          <TouchableOpacity onPress={handleTogglePostReaction}>
            <Feather
              name="heart"
              size={24}
              color={post.reactedByCurrentUser ? "red" : "black"}
            />
          </TouchableOpacity>
          <Text style={styles.reactionCountText}>
            {post.totalReactions} lượt thích
          </Text>
        </View>

        <View style={styles.captionContainer}>
          <Text style={styles.captionUsername}>{post.user.username}</Text>
          <Text style={styles.captionText}>{post.content}</Text>
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListHeaderComponent={
            <Text style={styles.commentHeader}>Bình luận</Text>
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </ScrollView>

      <View style={styles.inputRow}>
        <Image
          source={{ uri: currentUser?.avatarUrl }}
          style={styles.inputAvatar}
        />
        <TextInput
          style={styles.input}
          placeholder="Thêm bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={() => handleAddComment()}>
          <Feather name="send" size={22} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { fontWeight: "bold", fontSize: 16 },
  postImage: { width: "100%", height: 400, backgroundColor: "#000" },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  reactionCountText: { marginLeft: 10, color: "#555" },
  captionContainer: { paddingHorizontal: 10 },
  captionUsername: { fontWeight: "bold" },
  captionText: { marginTop: 4 },

  commentHeader: { fontWeight: "bold", margin: 10, fontSize: 16 },
  commentItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  replyItem: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingLeft: 50,
  },
  commentAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  commentUsername: { fontWeight: "bold" },
  commentText: { fontSize: 14 },
  seeMore: { color: "#007AFF" },
  replyToText: { fontSize: 12, color: "#777" },
  commentActions: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  reactionRow: { flexDirection: "row", alignItems: "center" },
  reactionCount: { marginLeft: 4, fontSize: 12, color: "gray" },
  replyText: { marginLeft: 10, color: "#007AFF", fontSize: 12 },
  deleteText: { marginLeft: 10, color: "red", fontSize: 12 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  inputAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  input: {
    flex: 1,
    height: 36,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 8,
  },
});
