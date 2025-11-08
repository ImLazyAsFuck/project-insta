import UnfollowModal from "@/components/UnfollowModal";
import { useBlockUserMutation } from "@/hooks/useBlock";
import {
  useFollowStatusQuery,
  useRemoveFollowMutation,
  useSendFollowRequestMutation,
} from "@/hooks/useFollow";
import { useOtherProfileQuery } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function OtherProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ username?: string }>();
  const username = params.username;

  const { data, isLoading } = useOtherProfileQuery(username);
  const profile = data?.data;
  const sendFollowMutation = useSendFollowRequestMutation();
  const { data: followStatus } = useFollowStatusQuery(profile?.id as number);
  const blockUserMutation = useBlockUserMutation();

  const [showUnfollowModal, setShowUnfollowModal] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [blockConfirmVisible, setBlockConfirmVisible] = React.useState(false);

  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible, slideAnim]);

  const handleFollow = () => {
    if (!profile?.id) return;
    sendFollowMutation.mutate(profile.id, {
      onSuccess: () => {
        Alert.alert("Success", "Follow request sent successfully");
      },
      onError: (error: any) => {
        Alert.alert("Error", error?.message || "Failed to send follow request");
      },
    });
  };

  const handleBlockUser = () => {
    if (!profile?.id) return;
    blockUserMutation.mutate(profile.id, {
      onSuccess: () => {
        setBlockConfirmVisible(false);
        setMenuVisible(false);
        Alert.alert("Thành công", "Bạn đã chặn người này");
      },
      onError: (error: any) => {
        Alert.alert("Lỗi", error?.message || "Không thể chặn người này");
      },
    });
  };

  const handleFollowersPress = () => {
    if (profile?.username) {
      router.push(`/(tabs)/profile/followers?username=${profile.username}`);
    }
  };

  const handleFollowingPress = () => {
    if (profile?.username) {
      router.push(`/(tabs)/profile/following?username=${profile.username}`);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {username || "Profile"}
        </Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={22} />
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>
            <Image
              source={{
                uri: profile?.avatarUrl || "https://placehold.co/120x120",
              }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.postCount ?? 0}
                </Text>
                <Text>Posts</Text>
              </View>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={handleFollowersPress}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.followersCount ?? 0}
                </Text>
                <Text>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={handleFollowingPress}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {profile?.followingCount ?? 0}
                </Text>
                <Text>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: "bold" }}>
              {profile?.fullName || profile?.username || username}
            </Text>
            {profile?.bio ? <Text>{profile.bio}</Text> : null}
            {profile?.website ? <Text>{profile.website}</Text> : null}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              {followStatus?.data === "ACCEPTED" ? (
                <>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      paddingVertical: 6,
                      borderRadius: 6,
                      alignItems: "center",
                      backgroundColor: "#000",
                    }}
                    onPress={() => setShowUnfollowModal(true)}
                  >
                    <Text style={{ color: "#fff" }}>Đang theo dõi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      paddingVertical: 6,
                      borderRadius: 6,
                      alignItems: "center",
                    }}
                  >
                    <Text>Message</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    disabled={followStatus?.data === "PENDING"}
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      paddingVertical: 6,
                      borderRadius: 6,
                      alignItems: "center",
                      backgroundColor:
                        followStatus?.data === "PENDING" ? "#999" : "#000",
                      opacity: sendFollowMutation.isPending ? 0.6 : 1,
                    }}
                    onPress={handleFollow}
                  >
                    {sendFollowMutation.isPending ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff" }}>
                        {followStatus?.data === "PENDING"
                          ? "Pending"
                          : "Follow"}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      paddingVertical: 6,
                      borderRadius: 6,
                      alignItems: "center",
                    }}
                  >
                    <Text>Message</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              borderTopWidth: 0.5,
              borderColor: "#ddd",
              marginTop: 20,
              paddingTop: 10,
            }}
          >
            <Ionicons name="grid-outline" size={28} />
            <Ionicons name="person-outline" size={28} />
          </View>

          <FlatList
            data={[]}
            keyExtractor={(_, index) => String(index)}
            numColumns={3}
            renderItem={() => null}
            ListEmptyComponent={() => (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text>No posts yet</Text>
              </View>
            )}
          />
        </ScrollView>
      )}

      {/* Modal Unfollow */}
      <UnfollowModal
        visible={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        username={profile?.username ?? ""}
        userId={profile?.id ?? 0}
      />

      {/* Side Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="none">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <Animated.View
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 220,
              backgroundColor: "#fff",
              padding: 20,
              transform: [{ translateX: slideAnim }],
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              Tuỳ chọn
            </Text>
            <TouchableOpacity
              onPress={() => {
                setBlockConfirmVisible(true);
              }}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text style={{ color: "red", fontWeight: "600" }}>Chặn người này</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              style={{ paddingVertical: 12 }}
            >
              <Text>Đóng</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Block Confirm Modal */}
      <Modal
        visible={blockConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBlockConfirmVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 280,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              Bạn có chắc muốn chặn {profile?.username}?
            </Text>
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 10,
                backgroundColor: "#ff4444",
                borderRadius: 8,
                marginBottom: 8,
              }}
              onPress={handleBlockUser}
              disabled={blockUserMutation.isPending}
            >
              {blockUserMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Chặn
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "100%",
                paddingVertical: 10,
                backgroundColor: "#eee",
                borderRadius: 8,
              }}
              onPress={() => setBlockConfirmVisible(false)}
            >
              <Text style={{ textAlign: "center" }}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
