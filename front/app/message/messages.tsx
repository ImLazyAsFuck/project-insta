import React from 'react';
import { useAuthGuard } from "@/utils/use-auth-guard";
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const messagesData = [
  {
    id: '1',
    name: 'joshua_l',
    message: 'Have a nice day, bro!',
    time: 'now',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    name: 'karennne',
    message: 'I heard this is a good movie, so...',
    time: 'now',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
  },
  {
    id: '3',
    name: 'martini_rond',
    message: 'See you on the next meeting!',
    time: '15m',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    id: '4',
    name: 'andrewww_',
    message: 'Sounds good 😂😂😂',
    time: '20m',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
  },
  {
    id: '5',
    name: 'kiero_d',
    message: 'The new design looks cool, btw!',
    time: '1h',
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
  },
  {
    id: '6',
    name: 'maxjacobson',
    message: 'Thank you, bro!',
    time: '2h',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    id: '7',
    name: 'jamie.franco',
    message: "Yep, I'm going to travel in Tokyo",
    time: '4h',
    avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
  },
  {
    id: '8',
    name: 'm_humphrey',
    message: 'Instagram UI is pretty good',
    time: '5h',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

export default function Messages() {
  useAuthGuard();
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
      <Text style={styles.time}>· {item.time}</Text>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/54/54667.png',
        }}
        style={styles.cameraIcon}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.username}>jacob_w</Text>
        <TouchableOpacity>
          <Text style={styles.plusIcon}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" placeholderTextColor="#888" style={styles.searchInput} />
      </View>

      {/* Messages List */}
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Camera Bar */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.cameraButton}>📷 Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backArrow: { fontSize: 20, color: '#000' },
  username: { fontWeight: 'bold', fontSize: 18, color: '#000' },
  plusIcon: { fontSize: 24, color: '#000' },

  searchContainer: {
    backgroundColor: '#f2f2f2',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  searchInput: { color: '#000', fontSize: 14 },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  messageInfo: { flex: 1 },
  name: { fontWeight: '600', fontSize: 15, color: '#000' },
  message: { color: '#666', fontSize: 13, marginTop: 2 },
  time: { color: '#999', fontSize: 12, marginRight: 8 },
  cameraIcon: { width: 20, height: 20, tintColor: '#aaa' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cameraButton: { color: '#007AFF', fontSize: 16 },
});
