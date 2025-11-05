import React from 'react'
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';


const categories = ['IGTV', 'Shop', 'Style', 'Sports', 'Auto']

const images = [
  { id: '1', uri: 'https://picsum.photos/id/1/400/400' },
  { id: '2', uri: 'https://picsum.photos/id/2/400/400' },
  { id: '3', uri: 'https://picsum.photos/id/3/400/400' },
  { id: '4', uri: 'https://picsum.photos/id/4/400/400' },
  { id: '5', uri: 'https://picsum.photos/id/5/400/400' },
  { id: '6', uri: 'https://picsum.photos/id/6/400/400' },
  { id: '7', uri: 'https://picsum.photos/id/7/400/400' },
  { id: '8', uri: 'https://picsum.photos/id/8/400/400' },
  { id: '9', uri: 'https://picsum.photos/id/9/400/400' },
  { id: '10', uri: 'https://picsum.photos/id/10/400/400' },
  { id: '11', uri: 'https://picsum.photos/id/11/400/400' },
  { id: '12', uri: 'https://picsum.photos/id/12/400/400' },
]

export default function Search() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.image} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    marginHorizontal: 12,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  categoryButton: {
    backgroundColor: '#efefef',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  image: {
    width: '32.5%',
    aspectRatio: 1,
    margin: '0.5%',
    borderRadius: 8,
  },
})
