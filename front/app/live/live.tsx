import React from "react";
import { useAuthGuard } from "@/utils/use-auth-guard";
import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MyLive() {
  useAuthGuard();
  return (
    <SafeAreaView style={styles.container}>
      {/* Video nền */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1551836022-4c4c79ecde16", // ảnh nền minh họa
        }}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.liveBadgeContainer}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.viewerCount}>
              <Text style={styles.viewerText}>1</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.endText}>End</Text>
          </TouchableOpacity>
        </View>

        {/* Comment overlay */}
        <View style={styles.commentsContainer}>
          <Text style={styles.comment}>
            We’re telling your followers that you’ve started a live video.
          </Text>
          <Text style={styles.comment}>
            Hang on! We’re telling more followers to join your video.
          </Text>

          <View style={styles.joinedContainer}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/41.jpg",
              }}
              style={styles.avatar}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.username}>maxjacobson joined</Text>
              <Text style={styles.wave}>👋 Wave</Text>
            </View>
          </View>
        </View>

        {/* Bottom comment bar */}
        <View style={styles.footer}>
          <TextInput
            placeholder="Comment"
            placeholderTextColor="#ccc"
            style={styles.commentInput}
          />

          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Text style={styles.icon}>⋯</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.icon}>❓</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.icon}>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.icon}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
                }}
                style={styles.smallThumbnail}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: {
    flex: 1,
    justifyContent: "space-between",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backIcon: { color: "#fff", fontSize: 22 },
  liveBadgeContainer: { flexDirection: "row", alignItems: "center" },
  liveBadge: {
    backgroundColor: "#ff0040",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  liveText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  viewerCount: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  viewerText: { color: "#fff", fontSize: 12 },
  endText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  // Comments
  commentsContainer: {
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  comment: { color: "#fff", fontSize: 14, marginBottom: 4 },
  joinedContainer: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 8 },
  username: { color: "#fff", fontWeight: "600", fontSize: 14 },
  wave: { color: "#f5d142", fontSize: 14, marginLeft: 6 },

  // Footer
  footer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  icon: { color: "#fff", fontSize: 18, marginHorizontal: 4 },
  smallThumbnail: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginLeft: 6,
  },
});
