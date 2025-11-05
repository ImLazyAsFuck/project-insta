import { Gender } from "@/enums/gender.enum";
import {
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/hooks/useAccount";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const router = useRouter();
  const { data, isLoading: _isLoading } = useProfileQuery();
  const { mutate: updateProfile, isPending: saving } =
    useUpdateProfileMutation();
  const { mutate: _uploadAvatar, isPending: uploading } =
    useUploadAvatarMutation();

  type ProfileForm = {
    fullName: string;
    username: string;
    website: string;
    bio: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    avatarUrl: string;
  };

  const [profile, setProfile] = useState<ProfileForm>({
    fullName: "",
    username: "",
    website: "",
    bio: "",
    email: "",
    phoneNumber: "",
    gender: Gender.OTHER,
    avatarUrl: "",
  });

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      setProfile({
        fullName: p.fullName || "",
        username: p.username || "",
        website: p.website || "",
        bio: p.bio || "",
        email: p.email || "",
        phoneNumber: p.phoneNumber || "",
        gender: p.gender,
        avatarUrl: p.avatarUrl || "",
      });
    }
  }, [data]);

  const handleChange = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K]
  ) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = () => {
    updateProfile(
      {
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        website: profile.website,
        bio: profile.bio,
        gender: profile.gender,
      },
      {
        onSuccess: () => {
          router.push("/(tabs)/profile");
        },
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 15,
          }}
        >
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Text style={{ color: "#0095f6", fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Edit Profile</Text>

          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={{ color: "#0095f6", fontSize: 16 }}>
              {saving ? "Saving..." : "Done"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Image
            source={{
              uri: profile.avatarUrl || "https://placehold.co/100x100",
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <TouchableOpacity
            onPress={() => {
              /* integrate image picker to get fileUri and call uploadAvatar(fileUri) */
            }}
            disabled={uploading}
          >
            <Text style={{ color: "#0095f6", marginTop: 8 }}>
              {uploading ? "Uploading..." : "Change Profile Photo"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Fields */}
        <View style={{ marginTop: 20 }}>
          {[
            { label: "Name", key: "fullName" as const },
            { label: "Username", key: "username" as const },
            { label: "Website", key: "website" as const },
            { label: "Bio", key: "bio" as const, multiline: true },
          ].map((item) => (
            <View
              key={item.key}
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              <Text style={{ width: 90, fontSize: 16 }}>{item.label}</Text>
              <TextInput
                value={profile[item.key]}
                onChangeText={(text) => handleChange(item.key, text)}
                style={{
                  flex: 1,
                  borderBottomWidth: 0.5,
                  borderColor: "#ddd",
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
          <Text style={{ color: "#0095f6" }}>
            Switch to Professional Account
          </Text>
        </TouchableOpacity>

        {/* Private Information */}
        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
            Private Information
          </Text>

          {/* Email */}
          <View style={{ flexDirection: "row", paddingVertical: 10 }}>
            <Text style={{ width: 90, fontSize: 16 }}>Email</Text>
            <TextInput
              value={profile.email}
              onChangeText={(text) => handleChange("email", text)}
              style={{
                flex: 1,
                borderBottomWidth: 0.5,
                borderColor: "#ddd",
                paddingVertical: 2,
                fontSize: 16,
              }}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={{ flexDirection: "row", paddingVertical: 10 }}>
            <Text style={{ width: 90, fontSize: 16 }}>Phone</Text>
            <TextInput
              value={profile.phoneNumber}
              onChangeText={(text) => handleChange("phoneNumber", text)}
              style={{
                flex: 1,
                borderBottomWidth: 0.5,
                borderColor: "#ddd",
                paddingVertical: 2,
                fontSize: 16,
              }}
              placeholder="Phone"
              keyboardType="phone-pad"
            />
          </View>

          {/* Gender Picker using Gender enum */}
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ width: 90, fontSize: 16 }}>Gender</Text>
            <View
              style={{
                flex: 1,
                borderWidth: 0.5,
                borderColor: "#ddd",
                borderRadius: 6,
              }}
            >
              <Picker
                selectedValue={profile.gender}
                onValueChange={(value) =>
                  handleChange("gender", value as Gender)
                }
              >
                <Picker.Item label="Male" value={Gender.MALE} />
                <Picker.Item label="Female" value={Gender.FEMALE} />
                <Picker.Item label="Other" value={Gender.OTHER} />
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
