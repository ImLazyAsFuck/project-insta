import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: 'Jacob West',
    username: 'jacob_w',
    website: '',
    bio: 'Digital goodies designer @pixsellz\nEverything is designed.',
    email: 'jacob.west@gmail.com',
    phone: '+1 202 555 0147',
    gender: 'Male',
  });

  const handleChange = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15 }}>
        <TouchableOpacity onPress={() => router.push(`/profile`)}>
            <Text style={{ color: '#0095f6', fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Edit Profile</Text>
        
        <TouchableOpacity onPress={() => router.push(`/profile`)}>
            <Text style={{ color: '#0095f6', fontSize: 16 }}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Image
          source={{ uri: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg' }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <TouchableOpacity>
          <Text style={{ color: '#0095f6', marginTop: 8 }}>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Info Fields */}
      <View style={{ marginTop: 20 }}>
        {[
          { label: 'Name', key: 'name' },
          { label: 'Username', key: 'username' },
          { label: 'Website', key: 'website' },
          { label: 'Bio', key: 'bio', multiline: true },
        ].map((item) => (
          <View key={item.key} style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text style={{ width: 90, fontSize: 16 }}>{item.label}</Text>
            <TextInput
              value={profile[item.key]}
              onChangeText={(text) => handleChange(item.key, text)}
              style={{
                flex: 1,
                borderBottomWidth: 0.5,
                borderColor: '#ddd',
                paddingVertical: 2,
                fontSize: 16,
              }}
              multiline={item.multiline}
              placeholder={item.label}
            />
          </View>
        ))}
      </View>

      {/* Switch to Pro */}
      <TouchableOpacity style={{ padding: 20 }}>
        <Text style={{ color: '#0095f6' }}>Switch to Professional Account</Text>
      </TouchableOpacity>

      {/* Private Information */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Private Information</Text>

        {[
          { label: 'Email', key: 'email' },
          { label: 'Phone', key: 'phone' },
          { label: 'Gender', key: 'gender' },
        ].map((item) => (
          <View key={item.key} style={{ flexDirection: 'row', paddingVertical: 10 }}>
            <Text style={{ width: 90, fontSize: 16 }}>{item.label}</Text>
            <TextInput
              value={profile[item.key]}
              onChangeText={(text) => handleChange(item.key, text)}
              style={{
                flex: 1,
                borderBottomWidth: 0.5,
                borderColor: '#ddd',
                paddingVertical: 2,
                fontSize: 16,
              }}
              placeholder={item.label}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
