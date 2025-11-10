import { useCreatePostMutation } from "@/hooks/usePost";
import { EVisibility } from "@/types/visibility.enum";
import { Feather } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadPostScreen() {
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isVideo, setIsVideo] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const { mutate: createPost } = useCreatePostMutation();

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!result.assets?.length) return;

      // Compress images nếu quá lớn
      const processed: ImagePicker.ImagePickerAsset[] = [];
      for (let m of result.assets) {
        let compressedUri = m.uri;
        if (m.fileSize && m.fileSize > MAX_SIZE) {
          const compressed = await ImageManipulator.manipulateAsync(
            m.uri,
            [{ resize: { width: 1080 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          compressedUri = compressed.uri;
        }
        processed.push({ ...m, uri: compressedUri });
      }

      setIsVideo(false);
      setMedia(processed);
    } catch (err) {
      console.error("Error picking images:", err);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        videoMaxDuration: 60,
        quality: 0.8,
      });
      if (!result.assets?.length) return;

      // Kiểm tra size video
      if (result.assets[0].fileSize && result.assets[0].fileSize > MAX_SIZE) {
        Alert.alert(
          "Lỗi",
          `Video quá lớn! Vui lòng chọn video dưới ${
            MAX_SIZE / (1024 * 1024)
          }MB`
        );
        return;
      }

      setIsVideo(true);
      setMedia(result.assets);
    } catch (err) {
      console.error("Error picking video:", err);
      Alert.alert("Lỗi", "Không thể chọn video. Vui lòng thử lại.");
    }
  };

  const handleUpload = () => {
    if (media.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ảnh hoặc video trước khi đăng.");
      return;
    }

    setLoading(true);

    const files = media.map((m) => ({
      uri: m.uri,
      name: m.fileName || `upload-${Date.now()}.${isVideo ? "mp4" : "jpg"}`,
      type: isVideo ? "video/mp4" : "image/jpeg",
    }));

    createPost(
      {
        content: caption.trim(),
        visibility: EVisibility.PUBLIC,
        mediaFiles: files as any,
      },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Bài đăng đã được tạo!");
          setMedia([]);
          setCaption("");
          router.replace("/(tabs)/feed");
        },
        onError: (err: any) => {
          console.error(err);
          Alert.alert("Lỗi", "Không thể đăng bài. Vui lòng thử lại.");
        },
        onSettled: () => setLoading(false),
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Tạo bài đăng mới</Text>

      <View style={styles.pickButtonsContainer}>
        <TouchableOpacity style={styles.pickButton} onPress={pickImages}>
          <Text style={styles.pickButtonText}>Chọn ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
          <Text style={styles.pickButtonText}>Chọn video</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mediaPicker}>
        {media.length > 0 ? (
          isVideo ? (
            <Video
              source={{ uri: media[0].uri }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping={false}
              shouldPlay={false}
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {media.map((m, index) => (
                <Image
                  key={index}
                  source={{ uri: m.uri }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          )
        ) : (
          <View style={styles.placeholder}>
            <Feather name="image" size={48} color="#aaa" />
            <Text style={styles.placeholderText}>
              Chọn ảnh hoặc 1 video từ thư viện
            </Text>
          </View>
        )}
      </View>

      <TextInput
        placeholder="Viết chú thích..."
        placeholderTextColor="#888"
        value={caption}
        onChangeText={setCaption}
        multiline
        style={styles.captionInput}
      />

      <TouchableOpacity
        style={[
          styles.uploadButton,
          (media.length === 0 || loading) && styles.disabled,
        ]}
        disabled={media.length === 0 || loading}
        onPress={handleUpload}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>Đăng bài</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 12,
  },
  pickButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pickButton: {
    flex: 1,
    backgroundColor: "#0095F6",
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
  },
  pickButtonText: { color: "#fff", fontWeight: "600" },
  mediaPicker: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#f3f3f3",
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: width - 32,
    height: width - 32,
    resizeMode: "cover",
    borderRadius: 16,
    marginRight: 4,
  },
  video: { width: "100%", height: "100%", borderRadius: 16 },
  placeholder: { alignItems: "center", justifyContent: "center" },
  placeholderText: { color: "#888", marginTop: 8, textAlign: "center" },
  captionInput: {
    marginTop: 16,
    minHeight: 80,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlignVertical: "top",
    fontSize: 16,
  },
  uploadButton: {
    marginTop: 24,
    backgroundColor: "#0095F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  uploadText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  disabled: { opacity: 0.6 },
});
