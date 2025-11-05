import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileMenu({ visible, onClose }) {
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={styles.header}>
            <Text style={styles.username}>s.khasanov_</Text>
          </View>

          <View style={styles.menu}>
            {[
              { icon: 'time-outline', label: 'Archive' },
              { icon: 'analytics-outline', label: 'Your Activity' },
              { icon: 'qr-code-outline', label: 'Nametag' },
              { icon: 'bookmark-outline', label: 'Saved' },
              { icon: 'people-outline', label: 'Close Friends' },
              { icon: 'person-add-outline', label: 'Discover People' },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <Ionicons name={item.icon} size={22} color="#000" />
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.menuItem}>
              <FontAwesome name="facebook-square" size={22} color="#1877F2" />
              <Text style={styles.menuText}>Open Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.menuItem, styles.setting]}>
            <Ionicons name="settings-outline" size={22} color="#000" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: width * 0.7,
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  menu: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  setting: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    marginTop: 20,
  },
});