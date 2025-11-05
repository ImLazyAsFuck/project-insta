// app/notifications/_layout.js
import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Layout() {
  const router = useRouter();
  const segments = useSegments(); // lấy route hiện tại
  const current = segments[segments.length - 1] ;

  return (
    <View style={{ flex: 1 }}>
      {/* thanh tab dùng chung */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, current === 'following' && styles.activeTab]}
          onPress={() => router.push('/like/following')}
        >
          <Text
            style={
              current === 'following'
                ? styles.tabTextActive
                : styles.tabTextInactive
            }
          >
            Following
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, current === 'like' && styles.activeTab]}
          onPress={() => router.push('/like')}
        >
          <Text
            style={
              current === 'like'
                ? styles.tabTextActive
                : styles.tabTextInactive
            }
          >
            You
          </Text>
        </TouchableOpacity>
      </View>

      {/* stack để hiển thị nội dung từng màn hình */}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8ff',
  },
  tab: {
    paddingVertical: 10,
    width: '50%',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  tabTextInactive: {
    fontSize: 16,
    color: '#888',
  },
});