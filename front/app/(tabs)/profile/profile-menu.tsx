import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function ProfileMenu({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleLogout = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => logoutMutation.mutate(),
      },
    ]);
  };

  const goToFollowRequests = () => {
    onClose();
    setTimeout(() => {
      router.push("/(tabs)/profile/follow-requests");
    }, 200);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.username}>s.khasanov_</Text>
          </View>

          <View style={styles.menu}>
            {[
              { icon: "time-outline", label: "Archive" },
              { icon: "analytics-outline", label: "Your Activity" },
              { icon: "qr-code-outline", label: "Nametag" },
              { icon: "bookmark-outline", label: "Saved" },
              { icon: "people-outline", label: "Close Friends" },
              { icon: "person-add-outline", label: "Discover People" },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <Ionicons name={item.icon} size={22} color="#000" />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.menuItem} onPress={goToFollowRequests}>
              <Ionicons name="person-outline" size={22} color="#000" />
              <Text style={styles.menuText}>Friend Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="facebook-square" size={22} color="#1877F2" />
              <Text style={styles.menuText}>Open Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.menuItem, styles.setting]}>
            <Ionicons name="settings-outline" size={22} color="#000" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logout]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
            <Text style={[styles.menuText, { color: "#e74c3c" }]}>Log out</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  menuContainer: {
    backgroundColor: "#fff",
    width: width * 0.7,
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
  menu: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  setting: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
    marginTop: 20,
  },
  logout: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 15,
    marginTop: 10,
  },
});
