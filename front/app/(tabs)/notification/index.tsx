import { useNotificationsQuery } from "@/hooks/useNotification";
import { NotificationResponse } from "@/interfaces/notification.interface";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
  return `${Math.floor(diffInSeconds / 2592000)}mo`;
};

const groupNotificationsByTime = (notifications: NotificationResponse[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const newNotifications: NotificationResponse[] = [];
  const todayNotifications: NotificationResponse[] = [];
  const weekNotifications: NotificationResponse[] = [];

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.createdAt);

    if (!notification.isRead) {
      newNotifications.push(notification);
    } else if (notificationDate >= today) {
      todayNotifications.push(notification);
    } else if (notificationDate >= thisWeek) {
      weekNotifications.push(notification);
    }
  });

  return { newNotifications, todayNotifications, weekNotifications };
};

export default function YouScreen() {
  const { data, isLoading, error } = useNotificationsQuery();

  const { newNotifications, todayNotifications, weekNotifications } =
    useMemo(() => {
      if (!data?.data) {
        return {
          newNotifications: [],
          todayNotifications: [],
          weekNotifications: [],
        };
      }
      return groupNotificationsByTime(data.data);
    }, [data]);

  const renderNotificationItem = (notification: NotificationResponse) => {
    const isFollowNotification = notification.message
      .toLowerCase()
      .includes("follow");

    return (
      <View key={notification.id} style={styles.item}>
        <Image
          source={{
            uri:
              notification.sender.avatarUrl || "https://via.placeholder.com/48",
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            <Text style={styles.username}>{notification.sender.username} </Text>
            {notification.message}
          </Text>
          <Text style={styles.timeText}>
            {formatTimeAgo(notification.createdAt)}
          </Text>
        </View>
        {isFollowNotification ? (
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        ) : (
          <Image
            source={{ uri: "https://picsum.photos/100/100?1" }}
            style={styles.thumbnail}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0095f6" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load notifications</Text>
          </View>
        ) : (
          <>
            {newNotifications.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>New</Text>
                {newNotifications.map(renderNotificationItem)}
              </>
            )}

            {todayNotifications.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Today</Text>
                {todayNotifications.map(renderNotificationItem)}
              </>
            )}

            {weekNotifications.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>This Week</Text>
                {weekNotifications.map(renderNotificationItem)}
              </>
            )}

            {newNotifications.length === 0 &&
              todayNotifications.length === 0 &&
              weekNotifications.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              )}
          </>
        )}
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
  followRequest: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  followRequestText: {
    color: "#007bff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 14,
    color: "#222",
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
    marginTop: 2,
  },
  thumbnail: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginLeft: 8,
  },
  messageButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  messageText: {
    fontWeight: "600",
  },
  followButton: {
    backgroundColor: "#0095f6",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
});
