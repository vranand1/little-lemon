// Import React hooks
import React, { useState, useEffect } from 'react';
// Import AsyncStorage from React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Import screens
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';

// Create a Stack navigator
const Stack = createStackNavigator();

// Create the main App component
export default function App() {
  // Declare state variables
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  
  // Use an effect hook to check if the onboarding status has been saved
  useEffect(() => {
    // Manually set the onboarding status to false for testing purposes; to be removed
   //AsyncStorage.setItem('onboardingCompleted', JSON.stringify(false));

    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('onboardingCompleted');
        if (status) {
          setIsOnboardingCompleted(JSON.parse(status));
        }
      } catch (error) {
        console.error("Error reading from AsyncStorage:", error);
      } finally {
        setIsLoading(false)
      }
    }
    checkOnboardingStatus();
  }, []);

  // If the app is loading, show the splash screen
  if (isLoading) {
    return <SplashScreen />;
  }

  // Otherwise, show the appropriate screen
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isOnboardingCompleted ? "Home" : "Onboarding"}>
        
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );  
}
