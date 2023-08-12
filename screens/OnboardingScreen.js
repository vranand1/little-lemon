import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function OnboardingScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleCompleteOnboarding = async () => {
    if (firstName && email) {
        await AsyncStorage.clear();
        // Store user data 
        await AsyncStorage.setItem('user', JSON.stringify({ firstName, email }));
        // Indicate that onboarding is completed
        await AsyncStorage.setItem('onboardingCompleted', JSON.stringify(true));
        // Navigate to profile screen
        navigation.navigate('Profile', { data: { firstName, email } });
    } else {
      alert('Please fill in all fields!');
    }
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Logo.png')} resizeMode="contain" style={styles.logo} />
      <Text style={styles.title}>Let us get to know you</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Next" onPress={handleCompleteOnboarding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'MarkaziText_400Medium',
    color: 'black',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 50,
    alignItems: 'center',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default OnboardingScreen;
