import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
        navigation.navigate('ProfileScreen', { data: { firstName, email } });
    } else {
      alert('Please fill in all fields!');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Little Lemon</Text>
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
      <Button title="Complete Onboarding" onPress={handleCompleteOnboarding} />
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
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
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
