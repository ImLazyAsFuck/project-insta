import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyLive() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1551836022-4c4c79ecde16",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/507/507257.png",
              }}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <View style={styles.liveContainer}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <View style={styles.viewerBadge}>
              <Text style={styles.viewerText}>1</Text>
            </View>
          </View>

          <TouchableOpacity>
            <Text style={styles.endText}>End</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsContainer}>
          <Text style={styles.commentText}>
            We're telling your followers that you've started a live video.
          </Text>
          <Text style={styles.commentText}>
            Hang on! We're telling more followers to join your video.
          </Text>

          <View style={styles.joinedRow}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/32.jpg",
              }}
              style={styles.avatar}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.joinedText}>maxjacobson joined</Text>
              <Text style={styles.wave}>👋 Wave</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Comment"
            placeholderTextColor="#ccc"
          />

          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/61/61140.png",
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/742/742751.png",
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/64/64576.png",
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
                }}
                style={styles.thumb}
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
  background: { flex: 1, justifyContent: "space-between" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backIcon: { width: 22, height: 22, tintColor: "#fff" },
  liveContainer: { flexDirection: "row", alignItems: "center" },
  liveBadge: {
    backgroundColor: "#FF0050",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 5,
  },
  liveText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  viewerBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  viewerText: { color: "#fff", fontSize: 12 },
  endText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  commentsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 110,
  },
  commentText: { color: "#fff", fontSize: 14, marginBottom: 3 },
  joinedRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  joinedText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  wave: { color: "#FFD700", fontSize: 14, marginLeft: 6 },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    color: "#fff",
    fontSize: 14,
    marginRight: 8,
  },
  iconRow: { flexDirection: "row", alignItems: "center" },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
    marginHorizontal: 6,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginLeft: 4,
  },
});
