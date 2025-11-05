import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Story() {
  return (
    <View style={styles.container}>
      {/* Ảnh nền của story */}
      <ImageBackground
        source={{ uri: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg" }} // Thay bằng link ảnh thật
        style={styles.background}
        resizeMode="cover"
      >
        {/* Lớp mờ gradient để giúp chữ hiển thị rõ hơn */}
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={styles.gradient}
        />

        {/* Thanh thông tin trên đầu */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg" }} // Avatar
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>craig_love</Text>
              <Text style={styles.time}>4h</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Nút gửi tin nhắn (phía dưới) */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
    justifyContent: "space-between",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  time: {
    color: "#ccc",
    fontSize: 12,
  },
  close: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  messageButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  messageText: {
    color: "#fff",
    fontSize: 14,
  },
});