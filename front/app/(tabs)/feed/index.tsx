import { CommentModal } from "@/components/CommentModal";
import { useFeedsQuery, useTogglePostReactionMutation } from "@/hooks/usePost";
import { PostResponse } from "@/interfaces/post.interface";
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const stories = [
  { id: "1", name: "Your Story", image: "https://i.imgur.com/2nCt3Sb.jpg" },
  { id: "2", name: "karenne", image: "https://i.imgur.com/8Km9tLL.jpg" },
  { id: "3", name: "zackjohn", image: "https://i.imgur.com/6VBx3io.jpg" },
  { id: "4", name: "kieron_d", image: "https://i.imgur.com/jNNT4LE.jpg" },
];

export default function HomeScreen() {
  const { data, isLoading } = useFeedsQuery();
  const toggleReaction = useTogglePostReactionMutation();

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [expandedCaptions, setExpandedCaptions] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleCaption = (postId: number) => {
    setExpandedCaptions((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const openComments = (postId: number) => {
    setCurrentPostId(postId);
    setCommentModalVisible(true);
  };

  const renderStory = ({ item }: { item: any }) => (
    <View style={styles.storyItem}>
      <View style={styles.storyBorder}>
        <Image source={{ uri: item.image }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName}>{item.name}</Text>
    </View>
  );

  const renderPost = ({ item }: { item: PostResponse }) => {
    const handleToggleReaction = (postId: number) => {
      toggleReaction.mutate({ postId });
    };

    return (
      <View style={styles.postContainer}>
        {/* Header */}
        <View style={styles.postHeader}>
          <View style={styles.postUser}>
            <Image
              source={{ uri: item.user.avatarUrl }}
              style={styles.userAvatar}
            />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
          <Feather name="more-vertical" size={20} />
        </View>

        {/* Media */}
        <FlatList
          horizontal
          pagingEnabled
          data={item.mediaList}
          keyExtractor={(media) => media.id.toString()}
          renderItem={({ item: media }) => (
            <Image source={{ uri: media.url }} style={styles.postImage} />
          )}
          showsHorizontalScrollIndicator={false}
        />

        {/* Actions */}
        <View style={styles.actionRow}>
          <View style={styles.leftActions}>
            {/* Like */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleToggleReaction(item.id)}
            >
              <FontAwesome
                name={item.reactedByCurrentUser ? "heart" : "heart-o"}
                size={28}
                color={item.reactedByCurrentUser ? "red" : "black"}
              />
              <Text style={styles.actionCount}>{item.totalReactions}</Text>
            </TouchableOpacity>

            {/* Comment */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openComments(item.id)}
            >
              <Feather name="message-circle" size={28} />
              <Text style={styles.actionCount}>{item.totalComments}</Text>
            </TouchableOpacity>

            {/* Send */}
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="send" size={28} />
            </TouchableOpacity>
          </View>

          {/* Bookmark */}
          <TouchableOpacity>
            <Feather name="bookmark" size={28} />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        <View style={styles.captionContainer}>
          <Text
            style={styles.captionText}
            numberOfLines={expandedCaptions[item.id] ? undefined : 1}
          >
            <Text style={styles.bold}>{item.user.username} </Text>
            {item.content}
          </Text>

          {/* Hiển thị xem thêm nếu chưa mở rộng */}
          {!expandedCaptions[item.id] && item.content.length > 100 && (
            <Text
              style={styles.readMore}
              onPress={() => toggleCaption(item.id)}
            >
              Xem thêm
            </Text>
          )}

          {/* Nếu đã mở rộng, có thể muốn thêm nút thu gọn */}
          {expandedCaptions[item.id] && (
            <Text
              style={styles.readMore}
              onPress={() => toggleCaption(item.id)}
            >
              Thu gọn
            </Text>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Instagram</Text>
        <View style={styles.headerIcons}>
          <Feather name="heart" size={24} style={styles.headerIcon} />
          <Feather name="message-circle" size={24} />
        </View>
      </View>

      {/* Stories */}
      <View style={styles.storiesContainer}>
        <FlatList
          horizontal
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Posts */}
      <FlatList
        data={data?.data || []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        windowSize={5}
        removeClippedSubviews
      />
      {/* Chỗ cuối cùng trong HomeScreen, sau FlatList posts */}
      <CommentModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        postId={currentPostId!}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ddd",
  },
  logo: { fontSize: 32, fontFamily: "Billabong" },
  headerIcons: { flexDirection: "row" },
  headerIcon: { marginRight: 15 },
  storiesContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  storyItem: { alignItems: "center", marginHorizontal: 8 },
  storyBorder: {
    borderWidth: 2,
    borderColor: "#FF0066",
    borderRadius: 45,
    padding: 3,
  },
  storyImage: { width: 60, height: 60, borderRadius: 30 },
  storyName: { fontSize: 12, marginTop: 4, color: "#333" },
  postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  postUser: { flexDirection: "row", alignItems: "center" },
  userAvatar: { width: 35, height: 35, borderRadius: 18, marginRight: 10 },
  username: { fontWeight: "bold", fontSize: 14 },
  postImage: { width: SCREEN_WIDTH, height: 400, marginTop: 10 },
  icon: { marginRight: 12 },
  likes: { paddingHorizontal: 12, fontWeight: "500", marginBottom: 5 },
  caption: { paddingHorizontal: 12, marginBottom: 10 },
  bold: { fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  countRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  countText: {
    marginRight: 15,
    fontWeight: "500",
    color: "#333",
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  leftActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionCount: {
    marginLeft: 6,
    fontWeight: "500",
    fontSize: 14,
    color: "#333",
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  captionText: {
    fontSize: 14,
    color: "#333",
  },
  readMore: {
    color: "#999",
    marginTop: 2,
    fontSize: 13,
  },
});
