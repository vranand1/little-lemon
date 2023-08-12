import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, Platform, StyleSheet, Switch } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ route, navigation }) {
  // Default data structure
  const defaultData = {
    firstName: '',
    lastName: '',
    email: ''
  };
  
  const data = route.params?.data || defaultData;

  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [email, setEmail] = useState(data.email);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);
  const [checkboxes, setCheckboxes] = useState({
    someKey: false // Initial structure for checkboxes. Extend as needed.
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveChanges = async () => {
    await AsyncStorage.setItem('userProfile', JSON.stringify({
      avatar: image,
      firstName,
      lastName,
      email,
      phoneNumber,
      checkboxes
    }));
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <Text>{firstName}</Text>
      <Text style={styles.label}>Email</Text>
      <Text>{email}</Text>
      <Text style={styles.label}>Phone Number</Text>
      <TextInputMask
        type={'cel-phone'}
        options={{
          maskType: 'BRL',
          withDDD: true,
          dddMask: '(999) 999-9999'
        }}
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
        style={styles.input}
      />

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {/* Switch */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <Text style={{ marginRight: 10 }}>Email :</Text>
        <Switch
            value={checkboxes.someKey}
            onValueChange={(newValue) => setCheckboxes(prev => ({ ...prev, someKey: newValue }))}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={checkboxes.someKey ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      <Button title="Save Changes" onPress={saveChanges} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // making it circular
    marginVertical: 20,
  },
});