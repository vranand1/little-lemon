import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, FlatList, Text, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTables, saveMenuItems, getMenuItemsByCategories } from './database'; // Adjust the path if necessary
import Banner from './Banner'; 
import { getFilteredMenuItems } from  './database'; // Adjust the path if necessary

function debounce(fn, delay) {
  let timer;
  return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
  };
}


function HomeScreen({ navigation }) {
  const [avatar, setAvatar] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = debounce(query => {
    setSearchQuery(query);
    fetchData();  // <-- Fetch data when search query changes.
  }, 250);

  const fetchData = async () => {
    try {
      createTables();
      setMenuData([]);
      if (searchQuery.trim()) {
        getFilteredMenuItems(selectedCategories, searchQuery, data => {
          setMenuData(data);
        });
      } else {
        getMenuItemsByCategories(selectedCategories, data => {
          if (data.length) {
            setMenuData(data);
          } else {
            fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json')
              .then(response => response.json())
              .then(data => {
                setMenuData(data.menu);
                saveMenuItems(data.menu);
              });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategories, searchQuery]);
  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userProfileData = await AsyncStorage.getItem('userProfile');
        if(userProfileData) {
          const parsedData = JSON.parse(userProfileData);
          setAvatar(parsedData.avatar);
        }
      } catch (error) {
        console.error("Failed to load user profile data:", error);
      }
    };
    loadProfileData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/Logo.png')} resizeMode="contain" style={styles.logo} />
        {avatar ? (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </TouchableOpacity>
        ) : (
          <View style={styles.defaultAvatar} />
        )}
      </View>
      <Banner onSearch={handleSearch} />
      <CategoriesList onCategoriesChange={setSelectedCategories} />

      <FlatList
        data={menuData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>${item.price.toFixed(2)}</Text>
            </View>
            <Image 
                source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true` }} 
                style={styles.menuItemImage} 
                resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}


const CategoriesList = ({ onCategoriesChange }) => {
  const [categories, setCategories] = useState(["starters", "mains", "desserts"]);
  const [activeCategories, setActiveCategories] = useState([]);

  const toggleCategory = (category) => {
    const isCurrentlySelected = activeCategories.includes(category);
    if (isCurrentlySelected) {
      const newCategories = activeCategories.filter(c => c !== category);
      setActiveCategories(newCategories);
      onCategoriesChange(newCategories);
    } else {
      setActiveCategories([...activeCategories, category]);
      onCategoriesChange([...activeCategories, category]);
    }
  };

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          onPress={() => toggleCategory(item)}
          style={[
            styles.categoryItem,
            activeCategories.includes(item) && styles.categoryItemSelected
          ]}
        >
          <Text style={styles.categoryText}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

// ... [Rest of your styles code remains unchanged]

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  logo: {
    width: 200,
    height: 50,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  menuItemName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  categoryItem: {
    padding: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    borderWidth: 1,
    fontWeight: 'bold',
    marginBottom  : 50,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  categoryItemSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
  },
});

