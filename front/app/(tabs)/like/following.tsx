import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FollowingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* item 1 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>karenne </Text>liked 3 posts.
            </Text>
            <Text style={styles.timeText}>3h</Text>
            <View style={styles.imageRow}>
              <Image
                source={{ uri: "https://picsum.photos/100/100?1" }}
                style={styles.postImage}
              />
              <Image
                source={{ uri: "https://picsum.photos/100/100?2" }}
                style={styles.postImage}
              />
              <Image
                source={{ uri: "https://picsum.photos/100/100?3" }}
                style={styles.postImage}
              />
            </View>
          </View>
        </View>

        {/* item 2 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/11.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>kiero_d, zackjohn </Text>and{" "}
              <Text style={styles.username}>craig_love </Text>
              liked <Text style={styles.username}>joshua_l</Text>’s photo.
            </Text>
            <Text style={styles.timeText}>3h</Text>
          </View>
          <Image
            source={{ uri: "https://picsum.photos/100/100?4" }}
            style={styles.thumbnail}
          />
        </View>

        {/* item 3 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>kiero_d </Text>started following
              <Text style={styles.username}> craig_love</Text>.
            </Text>
            <Text style={styles.timeText}>3h</Text>
          </View>
        </View>

        {/* item 4 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>craig_love </Text>liked 8 posts.
            </Text>
            <Text style={styles.timeText}>3h</Text>
            <View style={styles.imageRow}>
              <Image
                source={{ uri: "https://picsum.photos/100/100?5" }}
                style={styles.postImage}
              />
              <Image
                source={{ uri: "https://picsum.photos/100/100?6" }}
                style={styles.postImage}
              />
              <Image
                source={{ uri: "https://picsum.photos/100/100?7" }}
                style={styles.postImage}
              />
              <Image
                source={{ uri: "https://picsum.photos/100/100?8" }}
                style={styles.postImage}
              />
            </View>
          </View>
        </View>

        {/* item 5 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/21.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>maxjacobson </Text>and{" "}
              <Text style={styles.username}>zackjohn </Text>
              liked <Text style={styles.username}>mis_potter</Text>’s post.
            </Text>
            <Text style={styles.timeText}>3h</Text>
          </View>
          <Image
            source={{ uri: "https://picsum.photos/100/100?9" }}
            style={styles.thumbnail}
          />
        </View>

        {/* item 6 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/11.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>maxjacobson </Text>and{" "}
              <Text style={styles.username}>craig_love </Text>
              liked <Text style={styles.username}>martini_rond</Text>’s post.
            </Text>
            <Text style={styles.timeText}>3h</Text>
          </View>
          <Image
            source={{ uri: "https://picsum.photos/100/100?10" }}
            style={styles.thumbnail}
          />
        </View>

        {/* item 7 */}
        <View style={styles.item}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>karenne </Text>liked
              <Text style={styles.username}> martini_rond</Text>’s comment:
              <Text style={styles.tag}> @martini_rond </Text>Nice!
            </Text>
            <Text style={styles.timeText}>3h</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 10,
    width: "50%",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabTextActive: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
  tabTextInactive: {
    fontSize: 16,
    color: "#888",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 14,
    color: "#222",
    flexWrap: "wrap",
  },
  username: {
    fontWeight: "bold",
  },
  tag: {
    color: "#007bff",
  },
  timeText: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
  },
  imageRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 6,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginLeft: 8,
  },
});
