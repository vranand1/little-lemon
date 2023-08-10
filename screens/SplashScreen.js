import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text>Your App Name or Logo Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default SplashScreen;
