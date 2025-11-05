import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProfileMenu from './profileMenu';

export default function ProfileScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const posts = [
    { id: 1, uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 2, uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 3, uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 4, uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 5, uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 6, uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
  ];

  const highlights = [
    { id: 1, title: 'New', uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 2, title: 'Friends', uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 3, title: 'Sport', uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
    { id: 4, title: 'Design', uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>s.khasanov_</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={28} />
        </TouchableOpacity>
      </View>
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Image
          source={{ uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' }}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>54</Text>
            <Text>Posts</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>834</Text>
            <Text>Followers</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>162</Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontWeight: 'bold' }}>Jacob West</Text>
        <Text>Digital goodies designer @pixsellz</Text>
        <Text>Everything is designed.</Text>

        <TouchableOpacity
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            paddingVertical: 6,
            borderRadius: 6,
            alignItems: 'center',
          }}
          onPress={() => router.push('/profile/edit')}
        >
          <Text>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Highlights */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 20, paddingLeft: 20 }}>
        {highlights.map((item) => (
          <View key={item.id} style={{ alignItems: 'center', marginRight: 15 }}>
            <Image
              source={{ uri: item.uri }}
              style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#ddd' }}
            />
            <Text style={{ fontSize: 12, marginTop: 4 }}>{item.title}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 0.5, borderColor: '#ddd' }}>
        <Ionicons name="grid-outline" size={28} />
        <Ionicons name="person-outline" size={28} />
      </View>

      {/* Grid Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.uri }}
            style={{ width: '33%', height: 120 }}
            resizeMode="cover"
          />
        )}
      />
    </ScrollView>
    <ProfileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}
