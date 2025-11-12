import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
} from "react-native";
import { useRemoveFollowMutation } from "@/hooks/useFollow";

const { height } = Dimensions.get("window");

export default function UnfollowModal({
  visible,
  onClose,
  username,
  userId,
}: {
  visible: boolean;
  onClose: () => void;
  username: string;
  userId: number;
}) {
  const slideY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const removeFollowMutation = useRemoveFollowMutation();

  // Animation mở / đóng
  useEffect(() => {
    if (visible) {
      // Reset giá trị về vị trí ban đầu trước khi animate
      slideY.setValue(height);
      backdropOpacity.setValue(0);
      // Sử dụng requestAnimationFrame để đảm bảo render xong trước khi animate
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(slideY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Cho phép kéo xuống để đóng
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        slideY.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          onClose();
        } else {
          Animated.timing(slideY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleUnfollowConfirm = () => {
    Alert.alert(
      "Xác nhận",
      `Bạn có chắc muốn hủy theo dõi ${username}?`,
      [
        { text: "Huỷ", style: "cancel" },
        {
          text: "Đồng ý",
          style: "destructive",
          onPress: () => {
            removeFollowMutation.mutate(userId, {
              onSuccess: () => {
                Alert.alert("Đã hủy theo dõi");
                onClose();
              },
              onError: (error: any) => {
                Alert.alert("Lỗi", error?.message || "Hủy theo dõi thất bại");
              },
            });
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {/* nền mờ */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            opacity: backdropOpacity,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={onClose}
          />
        </Animated.View>

        {/* bottom sheet */}
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            backgroundColor: "#fff",
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            paddingTop: 8,
            paddingHorizontal: 20,
            paddingBottom: 30,
            transform: [{ translateY: slideY }],
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -3 },
            shadowRadius: 8,
            elevation: 5,
          }}
        >
        {/* thanh kéo */}
        <View
          style={{
            alignSelf: "center",
            width: 40,
            height: 4,
            backgroundColor: "#ccc",
            borderRadius: 2,
            marginBottom: 15,
          }}
        />

        {/* tên người dùng */}
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 15,
          }}
        >
          @{username}
        </Text>

        {/* nút Huỷ theo dõi */}
        <TouchableOpacity
          onPress={handleUnfollowConfirm}
          style={{
            backgroundColor: "#ff3b30",
            paddingVertical: 12,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Huỷ theo dõi
          </Text>
        </TouchableOpacity>

        {/* nút Hủy */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "#eee",
            paddingVertical: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>Đóng</Text>
        </TouchableOpacity>
      </Animated.View>
      </View>
    </Modal>
  );
}
