import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function YouScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* follow requests */}
        <TouchableOpacity style={styles.followRequest}>
          <Text style={styles.followRequestText}>Follow Requests</Text>
        </TouchableOpacity>

        {/* new section */}
        <Text style={styles.sectionTitle}>New</Text>
        <View style={styles.item}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>karenne </Text>liked your photo.
            </Text>
            <Text style={styles.timeText}>1h</Text>
          </View>
          <Image
            source={{ uri: 'https://picsum.photos/100/100?1' }}
            style={styles.thumbnail}
          />
        </View>

        {/* today section */}
        <Text style={styles.sectionTitle}>Today</Text>
        <View style={styles.item}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>kiero_d, zackjohn </Text>and 26 others liked your photo.
            </Text>
            <Text style={styles.timeText}>3h</Text>
          </View>
          <Image
            source={{ uri: 'https://picsum.photos/100/100?2' }}
            style={styles.thumbnail}
          />
        </View>

        {/* this week section */}
        <Text style={styles.sectionTitle}>This Week</Text>

        <View style={styles.item}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>craig_love </Text>mentioned you in a comment: 
              <Text style={styles.tag}> @jacob_w </Text>exactly..
            </Text>
            <Text style={styles.timeText}>2d</Text>
          </View>
          <Image
            source={{ uri: 'https://picsum.photos/100/100?3' }}
            style={styles.thumbnail}
          />
        </View>

        <View style={styles.item}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/41.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>martini_rond </Text>started following you.
            </Text>
            <Text style={styles.timeText}>3d</Text>
          </View>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.item}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/21.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>maxjacobson </Text>started following you.
            </Text>
            <Text style={styles.timeText}>3d</Text>
          </View>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.item}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/25.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              <Text style={styles.username}>mis_potter </Text>started following you.
            </Text>
            <Text style={styles.timeText}>3d</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  followRequest: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  followRequestText: {
    color: '#007bff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#222',
  },
  username: {
    fontWeight: 'bold',
  },
  tag: {
    color: '#007bff',
  },
  timeText: {
    color: '#888',
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
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  messageText: {
    fontWeight: '600',
  },
  followButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
  },
})