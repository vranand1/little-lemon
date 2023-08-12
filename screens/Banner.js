
import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet } from 'react-native';

function Banner({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftContainer}>
        <Text style={styles.bannerTitle}>Little Lemon</Text>
        <Text style={styles.bannerSubtitle}>Chicago</Text>
        <Text style={styles.description}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist</Text>
        <TextInput 
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search for dishes..."
          style={styles.searchBar}
        />
      </View>
      <Image source={require('../assets/Heroimage.png')} style={styles.bannerImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 0,
    backgroundColor: '#495E57',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    paddingRight: 20,
  },
  bannerTitle: {
    fontSize: 30,
    fontFamily: 'MarkaziText_400Medium',
    color: '#F4CE14',
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 20,
    fontFamily: 'MarkaziText_400Regular',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    textAlign: 'left',
    color: 'white',
    fontFamily: 'karla-medium',
    fontSize: 15,
    marginBottom: 20,
  },
  bannerImage: {
    width: 100,  // Adjust as needed.
    height: 100, // Adjust as needed.
    borderRadius: 10,
  },
  searchBar: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default Banner;
