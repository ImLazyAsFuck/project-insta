import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Post() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }}
      style={styles.container}
    >

      <View style={styles.overlay}>


        <View style={styles.bottomContainer}>

          <TouchableOpacity>
            <Ionicons name="images-outline" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.captureButton}>
            <View style={styles.innerCircle} />
          </View>

          <TouchableOpacity>
            <MaterialCommunityIcons name="camera-switch-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.modeBar}>
          {['type', 'live', 'normal', 'boomerang', 'superzoom'].map((mode, i) => (
            <Text
              key={i}
              style={[
                styles.modeText,
                mode === 'normal' && styles.activeMode
              ]}
            >
              {mode.toUpperCase()}
            </Text>
          ))}
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 60,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  modeBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modeText: {
    color: '#999',
    fontSize: 13,
    marginHorizontal: 8,
    letterSpacing: 0.5,
  },
  activeMode: {
    color: '#fff',
    fontWeight: '600',
  },
})